import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email/config';

/**
 * API endpoint for lead magnet delivery and email capture
 * POST /api/lead-magnets
 * 
 * Captures email for lead magnets (Pattern Recognition Guide, Quizzes, etc.)
 * Enrolls in drip campaign and sends magnet via email
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, leadMagnetType } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    // Validate lead magnet type
    const validTypes = ['pattern-guide', 'shadow-quiz', 'karmic-loop-quiz', 'checklist'];
    if (!validTypes.includes(leadMagnetType)) {
      return NextResponse.json(
        { error: 'Invalid lead magnet type' },
        { status: 400 }
      );
    }

    // Check if email already exists
    let newsletter = await db.newsletter.findUnique({ where: { email } });
    
    if (!newsletter) {
      // Create new newsletter subscriber
      newsletter = await db.newsletter.create({
        data: {
          email,
          source: leadMagnetType,
          dripStage: 0,
          prefDrip: true,
          prefSessions: true,
          prefBlog: true,
        },
      });
    }

    // Send lead magnet via email
    const leadMagnetData: Record<string, any> = {
      'pattern-guide': {
        title: 'The Complete Pattern Recognition Guide',
        subject: 'Your AstroKalki Pattern Recognition Guide',
        url: 'https://astrokalki.com/downloads/pattern-guide.pdf',
      },
      'shadow-quiz': {
        title: 'Which Shadow Pattern Quiz',
        subject: 'Your Shadow Pattern Quiz Results',
        url: 'https://astrokalki.com/downloads/shadow-quiz.pdf',
      },
      'karmic-loop-quiz': {
        title: 'Karmic Loop Identifier Quiz',
        subject: 'Your Karmic Loop Results',
        url: 'https://astrokalki.com/downloads/karmic-loop-quiz.pdf',
      },
      'checklist': {
        title: 'Pattern Recognition Checklist',
        subject: 'Your Pattern Recognition Checklist',
        url: 'https://astrokalki.com/downloads/checklist.pdf',
      },
    };

    const magnet = leadMagnetData[leadMagnetType];

    // Send email with lead magnet
    await sendEmail({
      to: email,
      subject: magnet.subject,
      template: 'lead-magnet-delivery',
      data: {
        name: name || email.split('@')[0],
        title: magnet.title,
        downloadUrl: magnet.url,
      },
    });

    // Track event
    await db.analyticsEvent.create({
      data: {
        event: 'lead_magnet_download',
        page: '/lead-magnets',
        sessionId: request.headers.get('x-session-id') || 'unknown',
        data: JSON.stringify({
          email,
          type: leadMagnetType,
          timestamp: new Date().toISOString(),
        }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Lead magnet sent to your email',
        downloadUrl: magnet.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Lead Magnet API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process lead magnet request' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/lead-magnets - List available lead magnets
 */
export async function GET() {
  const leadMagnets = [
    {
      id: 'pattern-guide',
      title: 'The Complete Pattern Recognition Guide',
      description: 'Understand the 7 karmic loops running your relationships and choices',
      pages: 24,
      format: 'PDF',
      downloadUrl: '/api/download/pattern-guide.pdf',
    },
    {
      id: 'shadow-quiz',
      title: 'Which Shadow Pattern Is Running Your Relationships?',
      description: 'Identify which disowned part of yourself you keep meeting in partners',
      questions: 15,
      time: '2 minutes',
      downloadUrl: '/api/download/shadow-quiz.pdf',
    },
    {
      id: 'karmic-loop-quiz',
      title: 'What Karmic Loop Are You Repeating?',
      description: 'Discover the inherited pattern or karma you're unconsciously cycling through',
      questions: 18,
      time: '3 minutes',
      downloadUrl: '/api/download/karmic-loop-quiz.pdf',
    },
    {
      id: 'checklist',
      title: 'Pattern Recognition Checklist',
      description: '20 signs that reveal the unconscious pattern beneath your repeating situations',
      items: 20,
      downloadUrl: '/api/download/checklist.pdf',
    },
  ];

  return NextResponse.json(leadMagnets, { status: 200 });
}
