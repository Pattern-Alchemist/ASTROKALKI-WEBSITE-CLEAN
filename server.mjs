import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

const PORT = 3000;
const STATIC_DIR = '.next/static';
const PUBLIC_DIR = 'public';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    let filePath = req.url.split('?')[0];

    // Serve the main page
    if (filePath === '/' || filePath === '') {
      const html = await readFile('.next/server/app/index.html', 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    // Serve static files from .next/static
    if (filePath.startsWith('/_next/static/')) {
      filePath = join(STATIC_DIR, filePath.replace('/_next/static/', ''));
    }
    // Serve public files
    else if (filePath.startsWith('/3d/') || filePath.startsWith('/logo')) {
      filePath = join(PUBLIC_DIR, filePath);
    }
    // Serve _next/image through a simple redirect approach
    else if (filePath.startsWith('/_next/image')) {
      const url = new URL(req.url, 'http://localhost');
      const imgSrc = url.searchParams.get('url');
      if (imgSrc) {
        const imgPath = join(PUBLIC_DIR, imgSrc);
        const data = await readFile(imgPath);
        const ext = extname(imgSrc);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
        return;
      }
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    else {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end('Not found: ' + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
});
