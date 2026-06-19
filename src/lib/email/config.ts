import nodemailer from 'nodemailer';

/**
 * Email infrastructure for AstroKalki
 * Handles transactional emails, drip campaigns, and lead magnet delivery
 */

export const emailConfig = {
  // SMTP Configuration (use environment variables)
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
  },
  
  // Default sender
  defaultFrom: {
    name: 'AstroKalki',
    email: process.env.EMAIL_FROM || 'hello@astrokalki.com',
  },
  
  // Email templates
  templates: {
    // Lead magnet delivery
    leadMagnetDelivery: {
      subject: 'Your AstroKalki Pattern Recognition Guide',
      template: 'lead-magnet-delivery',
    },
    
    // Welcome to email course
    emailCourseWelcome: {
      subject: 'Welcome to the 5-Day Pattern Recognition Email Course',
      template: 'email-course-welcome',
    },
    
    // Daily email course
    emailCourseDailyLesson: {
      subject: 'Day {day}: {title}',
      template: 'email-course-lesson',
    },
    
    // Session confirmation
    sessionConfirmation: {
      subject: 'Your AstroKalki Session Confirmed',
      template: 'session-confirmation',
    },
    
    // Pre-session prep
    preSessionPrep: {
      subject: 'Prepare for Your Pattern Reading Session',
      template: 'pre-session-prep',
    },
    
    // Post-session integration
    postSessionIntegration: {
      subject: 'Integration Guide: Continuing Your Pattern Work',
      template: 'post-session-integration',
    },
  },
};

// Initialize transporter (lazy-loaded to avoid errors if env vars not set)
let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter() {
  if (!transporter && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    transporter = nodemailer.createTransport(emailConfig.smtp);
  }
  return transporter;
}

/**
 * Send email with template
 */
export async function sendEmail({
  to,
  subject,
  template,
  data = {},
}: {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
}) {
  const transporter = getEmailTransporter();
  
  if (!transporter) {
    console.error('[Email] SMTP not configured. Set SMTP_USER and SMTP_PASSWORD.');
    return { success: false, error: 'SMTP not configured' };
  }
  
  try {
    // In production, load actual HTML template
    // For now, send plain text
    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h1>${subject}</h1>
        <p>Template: ${template}</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
    
    const result = await transporter.sendMail({
      from: emailConfig.defaultFrom,
      to,
      subject,
      html,
      text: `${subject}\n\nTemplate: ${template}`,
    });
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Email courses/drip campaigns
 */
export const dripCampaigns = {
  emailCourse: {
    name: 'Pattern Recognition Email Course',
    duration: 5, // days
    lessons: [
      {
        day: 1,
        title: 'Why You Cannot See Your Own Pattern',
        content: 'You are inside the pattern. That is why you cannot see it.',
      },
      {
        day: 2,
        title: 'The Architecture Beneath Your Repeating Experiences',
        content: 'Your birth chart shows the karmic blueprint beneath every repeating situation.',
      },
      {
        day: 3,
        title: 'How to Recognize Your Shadow Self in Your Relationships',
        content: 'You attract people who embody the disowned parts of yourself.',
      },
      {
        day: 4,
        title: 'The Moment Everything Changes',
        content: 'When you see the pattern clearly, it loses its invisible power over you.',
      },
      {
        day: 5,
        title: 'Your Next Step: Going Deeper',
        content: 'This is where the real work begins. Ready to see what was hidden?',
      },
    ],
  },
};

export const leadMagnets = {
  // Free resources that capture emails
  patternRecognitionGuide: {
    title: 'The Complete Pattern Recognition Guide',
    description: 'Understand the 7 karmic loops running your relationships and choices',
    pages: 24,
    format: 'PDF',
  },
  
  quizzes: {
    shadowPatternQuiz: {
      title: 'Which Shadow Pattern Is Running Your Relationships?',
      questions: 15,
      leadTime: '2 minutes',
    },
    karmicLoopQuiz: {
      title: 'What Karmic Loop Are You Repeating?',
      questions: 18,
      leadTime: '3 minutes',
    },
  },
};
