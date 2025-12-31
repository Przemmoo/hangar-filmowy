import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Resend } from 'resend';
import { supabaseAdminFetch } from '@/lib/supabase-admin';

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
    const body = await request.json();
    const { subject, message } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Get submission details
    const submissionResponse = await supabaseAdminFetch(
      `/form_submissions?id=eq.${submissionId}&select=*`
    );

    if (!submissionResponse.ok) {
      throw new Error('Failed to fetch submission');
    }

    const submissions = await submissionResponse.json();
    if (submissions.length === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const submission = submissions[0];

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
    const replyRecord = {
      id: crypto.randomUUID(),
      submissionId: submissionId,
      subject: subject,
      message: message,
      sentBy: session.user.id,
      sentByName: session.user.name || session.user.email || 'Admin',
      createdAt: new Date().toISOString(),
    };

    try {
      await supabaseAdminFetch(`/submission_replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(replyRecord),
      });
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
