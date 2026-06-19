/**
 * Email Templates
 * 
 * Pre-designed HTML email templates for all communications
 */

export const emailTemplates = {
  // Lead Magnet Confirmation
  leadMagnetConfirmation: (userName: string, magnetTitle: string, downloadLink: string) => ({
    subject: `Your ${magnetTitle} is ready`,
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; color: #f0eee9; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 1px solid #333;">
            <tr>
              <td style="padding: 40px; text-align: center;">
                <h2 style="color: #c9a96e; margin: 0 0 20px 0;">Your Pattern Guide Awaits</h2>
                <p style="color: #888; margin: 0 0 30px 0;">Hi ${userName},</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px;">
                <p style="line-height: 1.6; color: #bbb; margin: 0 0 20px 0;">
                  Your <strong style="color: #c9a96e;">${magnetTitle}</strong> is ready to download. This resource reveals the patterns you've been living through — but couldn&apos;t see because you were inside them.
                </p>
                <p style="line-height: 1.6; color: #bbb; margin: 0 0 30px 0;">
                  Once you see the pattern, you can finally break it.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px 30px 40px; text-align: center;">
                <a href="${downloadLink}" style="display: inline-block; background: #c9a96e; color: #0a0a0a; padding: 12px 32px; text-decoration: none; font-weight: 600; letter-spacing: 0.05em; border-radius: 2px;">
                  Download Now
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px 40px 40px; border-top: 1px solid #333; margin-top: 20px;">
                <p style="color: #666; font-size: 12px; margin: 20px 0 0 0;">
                  This is the beginning. In your inbox tomorrow: the 5-day Pattern Recognition course. Every email builds on this one.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  // Email Course Day 1
  emailCourseDay1: (userName: string) => ({
    subject: 'Day 1: The Pattern You Keep Living',
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; color: #f0eee9; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 1px solid #333;">
            <tr>
              <td style="padding: 40px; background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);">
                <p style="color: #c9a96e; text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; margin: 0 0 20px 0;">Day 1 of 5</p>
                <h2 style="color: #f0eee9; margin: 0; font-size: 28px; line-height: 1.2;">The Pattern You Keep Living</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px;">
                <p style="line-height: 1.8; color: #ccc; margin: 0 0 20px 0;">
                  Hi ${userName},
                </p>
                <p style="line-height: 1.8; color: #ccc; margin: 0 0 20px 0;">
                  You have a pattern.
                </p>
                <p style="line-height: 1.8; color: #ccc; margin: 0 0 20px 0;">
                  The same crisis. Different face. Same choice. Different name. Same outcome. The pattern is so consistent, it cannot be luck. It is the architecture beneath your life.
                </p>
                <p style="line-height: 1.8; color: #ccc; margin: 0 0 20px 0;">
                  <strong style="color: #c9a96e;">Your astrology chart doesn&apos;t predict this pattern.</strong> It reveals it.
                </p>
                <p style="line-height: 1.8; color: #ccc; margin: 0 0 30px 0;">
                  Tomorrow, we decode what the pattern wants from you.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px 40px 40px; text-align: center;">
                <a href="https://astrokalki.com/ask-astrokalki" style="display: inline-block; background: #c9a96e; color: #0a0a0a; padding: 12px 32px; text-decoration: none; font-weight: 600; letter-spacing: 0.05em; border-radius: 2px;">
                  Ask AstroKalki
                </a>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  // Session Confirmation
  sessionConfirmation: (userName: string, sessionType: string, datetime: string, meetLink: string) => ({
    subject: `Your ${sessionType} Session is Confirmed`,
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; color: #f0eee9; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 1px solid #333;">
            <tr>
              <td style="padding: 40px; text-align: center;">
                <h2 style="color: #c9a96e; margin: 0 0 20px 0;">Session Confirmed</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px;">
                <p style="color: #bbb; margin: 0 0 15px 0;">
                  <strong>Session Type:</strong> ${sessionType}
                </p>
                <p style="color: #bbb; margin: 0 0 15px 0;">
                  <strong>Date & Time:</strong> ${datetime}
                </p>
                <p style="color: #bbb; margin: 0 0 30px 0;">
                  <strong>Your birth details are saved.</strong> Come ready with the question you&apos;ve been avoiding.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px 30px 40px; text-align: center;">
                <a href="${meetLink}" style="display: inline-block; background: #c9a96e; color: #0a0a0a; padding: 12px 32px; text-decoration: none; font-weight: 600; letter-spacing: 0.05em; border-radius: 2px;">
                  Join Session
                </a>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  // Post-Session Recap
  postSessionRecap: (userName: string, recap: string) => ({
    subject: 'Your Session Patterns — Now What?',
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; color: #f0eee9; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 1px solid #333;">
            <tr>
              <td style="padding: 40px; background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);">
                <h2 style="color: #f0eee9; margin: 0; font-size: 24px; line-height: 1.2;">What We Saw Today</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px; color: #ccc; line-height: 1.8;">
                ${recap}
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px 40px 40px; text-align: center;">
                <a href="https://astrokalki.com/journal" style="display: inline-block; background: #c9a96e; color: #0a0a0a; padding: 12px 32px; text-decoration: none; font-weight: 600; letter-spacing: 0.05em; border-radius: 2px;">
                  Start Your Journal
                </a>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  // Generic Newsletter
  newsletter: (subject: string, content: string) => ({
    subject,
    html: `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; color: #f0eee9; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 1px solid #333;">
            <tr>
              <td style="padding: 40px; border-bottom: 1px solid #333;">
                <h1 style="color: #c9a96e; margin: 0; font-size: 24px;">${subject}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px; color: #ccc; line-height: 1.8;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="padding: 40px; text-align: center; border-top: 1px solid #333; color: #666; font-size: 12px;">
                <p style="margin: 0;">
                  <a href="https://astrokalki.com/unsubscribe" style="color: #c9a96e; text-decoration: none;">Unsubscribe</a>
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),
};
