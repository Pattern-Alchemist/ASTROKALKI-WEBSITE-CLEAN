import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { promises as fs, existsSync } from 'fs';
import { join, extname } from 'path';

/**
 * Admin audio upload endpoint.
 *
 *   POST /api/admin/recordings/upload
 *     Content-Type: multipart/form-data
 *     Body:        form field `audio` = audio file (mp3 / m4a / wav, ≤50MB)
 *
 *   Returns: { url: '/recordings/<cuid>.<ext>', filename, size, mimeType, originalName }
 *
 * Auth-gated by middleware on the /api/admin/* path. The middleware's
 * public-POST body cap (4KB) does NOT apply here — that cap only fires on
 * the explicit `isPublicPostApi` whitelist (newsletter / bookings /
 * micro-reading / testimonials / referrals / slots / preferences).
 * /api/admin/* bypasses those public guards entirely. (Verified in
 * /src/middleware.ts section 3 — `isPublicPostApi` does not include
 * /api/admin/*.) The 50MB ceiling is enforced below by inspecting the
 * parsed file size.
 *
 * Files land in `public/recordings/<cuid>.<ext>` — served statically by
 * Next.js for the admin (cookie-authed) and the signed-token streaming
 * endpoint (/api/recordings/[id]?token=...). The URL is intentionally
 * unguessable (UUID) AND never exposed publicly — client playback happens
 * exclusively through the signed-token endpoint which validates a fresh
 * HMAC before streaming bytes, so even if a URL leaked, only the holder
 * of a fresh token can actually fetch the audio.
 *
 * For a production build you'd swap this for S3/R2 with presigned PUT
 * URLs, but local file storage is fine for this build.
 */

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

// Allowed audio MIME prefixes + extensions. We accept whatever the browser
// sends (usually reliable for audio inputs) AND a small set of fallbacks
// for clients that send generic types. The spec calls out mp3/m4a/wav
// explicitly; we also accept the other common lossless/lossy formats so
// practitioners can upload higher-quality masters if needed.
const ALLOWED_MIME_PREFIXES = ['audio/'];
const ALLOWED_EXTENSIONS = new Set([
  '.mp3',
  '.m4a',
  '.wav',
  '.ogg',
  '.oga',
  '.weba',
  '.flac',
  '.aac',
]);

const UPLOAD_DIR = join(process.cwd(), 'public', 'recordings');

// MIME → fallback extension. Used when the browser sends a generic audio/*
// type without a usable filename extension. Keeps files on disk in a
// shape that the <audio> tag can identify by URL alone.
const MIME_TO_EXT: Record<string, string> = {
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/mp4': '.m4a',
  'audio/x-m4a': '.m4a',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/wave': '.wav',
  'audio/ogg': '.ogg',
  'audio/vorbis': '.ogg',
  'audio/flac': '.flac',
  'audio/x-flac': '.flac',
  'audio/aac': '.aac',
  'audio/webm': '.weba',
};

export async function POST(request: NextRequest) {
  try {
    // ─── Parse multipart form ──────────────────────────────────────────
    // request.formData() handles the multipart parsing for us. This is the
    // standard Next.js 16 Web API way and supports large bodies (no 4KB
    // cap on admin routes — see file header for rationale).
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (err) {
      console.error('Upload formData parse error:', err);
      return NextResponse.json(
        { error: 'Invalid multipart form data' },
        { status: 400 }
      );
    }

    const file = formData.get('audio');
    if (!file) {
      return NextResponse.json(
        { error: 'Missing "audio" file field' },
        { status: 400 }
      );
    }
    if (!(file instanceof File)) {
      // formData.get can return a string if the field was sent as a plain
      // text value — reject that.
      return NextResponse.json(
        { error: '"audio" field must be a file' },
        { status: 400 }
      );
    }

    // ─── Validate size ─────────────────────────────────────────────────
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      );
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);
      return NextResponse.json(
        {
          error: `File is ${mb} MB — max upload is ${maxMb} MB`,
        },
        { status: 413 }
      );
    }

    // ─── Validate MIME type + extension ────────────────────────────────
    const mimeType = file.type || '';
    const originalName = file.name || 'audio.mp3';
    const ext = extname(originalName).toLowerCase();
    const mimeOk = ALLOWED_MIME_PREFIXES.some((p) => mimeType.startsWith(p));
    const extOk = ext !== '' && ALLOWED_EXTENSIONS.has(ext);

    if (!mimeOk && !extOk) {
      return NextResponse.json(
        {
          error: `File type not allowed. Got ${mimeType || 'unknown'} (${ext || 'no extension'}). Allowed: audio/* (mp3, m4a, wav, ogg, flac, aac).`,
        },
        { status: 415 }
      );
    }

    // Pick a safe extension. Prefer the client's extension if it's allowed;
    // otherwise derive from the MIME type so files end up with a sensible
    // extension even when the browser didn't send one.
    let safeExt = ext;
    if (!extOk) {
      safeExt = MIME_TO_EXT[mimeType] || '.mp3';
    }
    if (!safeExt.startsWith('.')) safeExt = `.${safeExt}`;

    // ─── Ensure upload directory exists ────────────────────────────────
    if (!existsSync(UPLOAD_DIR)) {
      try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
      } catch (err) {
        console.error('Failed to create upload directory:', err);
        return NextResponse.json(
          { error: 'Server storage unavailable' },
          { status: 500 }
        );
      }
    }

    // ─── Stream the file to disk under a UUID (cuid-style) filename ────
    const cuid = randomUUID();
    const filename = `${cuid}${safeExt}`;
    const destPath = join(UPLOAD_DIR, filename);

    try {
      // file.arrayBuffer() pulls the whole file into memory. For a 50MB cap
      // this is acceptable. (If we needed to support larger files we'd
      // stream from the underlying ReadableStream — but 50MB in-memory is
      // fine for a single-admin tool.)
      const bytes = await file.arrayBuffer();
      await fs.writeFile(destPath, Buffer.from(bytes));
    } catch (err) {
      console.error('Failed to write uploaded file:', err);
      return NextResponse.json(
        { error: 'Failed to store file' },
        { status: 500 }
      );
    }

    const publicUrl = `/recordings/${filename}`;

    return NextResponse.json(
      {
        url: publicUrl,
        filename,
        originalName,
        size: file.size,
        mimeType: mimeType || 'audio/mpeg',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
