import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Resend } from 'resend';
import { dbSelectOne, dbInsert, getCurrentTimestamp } from '@/lib/cloudflare-db';

export const runtime = 'edge';

const resend = new Resend(process.env.RESEND_API_KEY);

type RouteParams = {
  params: Promise<{ id: string }>;
};

// POST - Send reply to submission
export async function POST(request: Request, context: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: submissionId } = await context.params;
    const body = await request.json() as { subject?: string; message?: string };
    const { subject, message } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Get submission details
    const submission = await dbSelectOne(
      'SELECT email, name FROM form_submissions WHERE id = ?',
      [submissionId]
    ) as { email: string; name: string } | null;

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Prepare email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0A1828, #1E3A5F); padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .header img { height: 60px; margin-bottom: 15px; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .header p { color: rgba(255,255,255,0.8); margin: 10px 0 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .message-box { background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            .highlight { background: linear-gradient(135deg, #FFD700, #FFA500); color: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://hangarfilmowy.pl/hangar_filmowy.svg" alt="Hangar Filmowy Logo" />
              <h1>🎬 Hangar Filmowy</h1>
              <p>Kino Pod Gwiazdami</p>
            </div>
            <div class="content">
              <div class="message-box">
                <div style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
              </div>

              <div class="highlight">
                <p style="margin: 0; font-size: 14px;">
                  <strong>Pytania?</strong> Odpowiedz na tego emaila lub napisz na: 
                  <a href="mailto:pokaz@hangarfilmowy.pl" style="color: white; text-decoration: underline;">pokaz@hangarfilmowy.pl</a>
                </p>
              </div>

              <div style="background: linear-gradient(to right, #ffffff, #f9fafb, #ffffff); border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <a href="https://hangarfilmowy.pl/kpo" style="text-decoration: none; color: inherit; display: block;">
                  <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <img src="https://hangarfilmowy.pl/kpo-fe-popc.jpg" alt="Fundusze Europejskie" style="height: 50px; width: auto;" />
                    <img src="https://hangarfilmowy.pl/kpo-barwy-rp.jpg" alt="Rzeczypospolita Polska" style="height: 50px; width: auto;" />
                    <img src="https://hangarfilmowy.pl/kpo-kpo.jpg" alt="KPO" style="height: 50px; width: auto;" />
                    <img src="https://hangarfilmowy.pl/kpo-nextgeneU.jpg" alt="Next Generation EU" style="height: 50px; width: auto;" />
                  </div>
                  <p style="margin: 10px 0 0 0; font-size: 13px; color: #374151; line-height: 1.5;">
                    Dofinansowano z <strong style="color: #0A1828;">Funduszy Europejskich</strong> w ramach<br />
                    <strong style="color: #0A1828;">Krajowego Planu Odbudowy i Zwiększania Odporności</strong>
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #6B7280;">
                    <strong>Więcej informacji →</strong>
                  </p>
                </a>
              </div>

              <div class="footer">
                <p><strong>Hangar Filmowy</strong></p>
                <p>Prawdziwe kino pod gwiazdami. W jakości, jakiej jeszcze nie widziałeś.</p>
                <p>hangarfilmowy.pl</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: submission.email,
        subject: subject,
        html: emailHtml,
        replyTo: process.env.EMAIL_TO || 'pokaz@hangarfilmowy.pl',
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Save reply to history
    const replyId = crypto.randomUUID();

    try {
      await dbInsert(
        'INSERT INTO submission_replies (id, submissionId, subject, message, sentBy, sentByName, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          replyId,
          submissionId,
          subject,
          message,
          session.user.id || '',
          session.user.name || session.user.email || 'Admin',
          getCurrentTimestamp()
        ]
      );
    } catch (historyError) {
      console.error('Error saving reply history:', historyError);
      // Email was sent successfully, so we don't fail here
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Reply sent successfully' 
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
