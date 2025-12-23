import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { eventType, audienceSize, extras, formData, category, preferredDate } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Fetch contact email from database
    const settingsResponse = await fetch(`${supabaseUrl}/rest/v1/content_sections?section=eq.contact&select=data`, {
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });

    const settingsData = await settingsResponse.json();
    const contactEmail = settingsData?.[0]?.data?.email || process.env.EMAIL_TO || 'pokaz@hangarfilmowy.pl';

    const eventLabels: Record<string, string> = {
      city: 'Event miejski',
      corporate: 'Event korporacyjny',
      hotel: 'Hotel / Resort',
      festival: 'Festiwal / Impreza'
    };

    const extrasText = Object.entries(extras)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const labels: Record<string, string> = {
          popcorn: 'Wózek popcornowy',
          deckchairs: 'Leżaki premium',
          license: 'Obsługa licencyjna filmu'
        };
        return labels[key];
      })
      .join(', ') || 'Brak';

    // Save to database - dostosowane do struktury tabeli
    const submissionData = {
      id: crypto.randomUUID(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      message: formData.message || '',
      eventType: eventLabels[eventType] || eventType,
      audienceSize: audienceSize,
      extras: extras, // JSONB object, nie string
      estimatedLevel: category,
      preferredDate: preferredDate || null,
      status: 'NEW', // Uppercase zgodnie z DEFAULT
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const submissionResponse = await fetch(`${supabaseUrl}/rest/v1/form_submissions`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(submissionData)
    });
    
    if (!submissionResponse.ok) {
      const errorText = await submissionResponse.text();
      throw new Error(`Database save failed: ${errorText}`);
    }
    
    const savedSubmission = await submissionResponse.json();

    // Email do firmy
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .section h2 { color: #0A1828; margin-top: 0; font-size: 20px; border-bottom: 2px solid #FFD700; padding-bottom: 10px; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #666; }
            .info-value { color: #0A1828; }
            .category { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .category.standard { background: #FFD700; color: white; }
            .category.kameralny { background: #4D90FE; color: white; }
            .category.professional { background: #FFA500; color: white; }
            .category.mass { background: #FF6B6B; color: white; }
            .price-box { background: linear-gradient(135deg, #FFD700, #FFA500); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .price-box .amount { font-size: 36px; font-weight: bold; margin: 10px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Nowe Zapytanie o Pokaz</h1>
            </div>
            <div class="content">
              <div class="section">
                <h2>📋 Konfiguracja Wydarzenia</h2>
                <div class="info-row">
                  <span class="info-label">Rodzaj wydarzenia:</span>
                  <span class="info-value">${eventLabels[eventType] || 'Nie wybrano'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Liczba widzów:</span>
                  <span class="info-value">${audienceSize} osób</span>
                </div>
                ${preferredDate ? `
                <div class="info-row">
                  <span class="info-label">Preferowany termin:</span>
                  <span class="info-value"><strong>${new Date(preferredDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                </div>
                ` : ''}
                <div class="info-row">
                  <span class="info-label">Kategoria wydarzenia:</span>
                  <span class="info-value">
                    <span class="category ${category.toLowerCase()}">${category}</span>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Dodatki:</span>
                  <span class="info-value">${extrasText}</span>
                </div>
              </div>

              <div class="section">
                <h2>👤 Dane Kontaktowe</h2>
                <div class="info-row">
                  <span class="info-label">Imię i nazwisko:</span>
                  <span class="info-value">${formData.firstName} ${formData.lastName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value"><a href="mailto:${formData.email}">${formData.email}</a></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Telefon:</span>
                  <span class="info-value"><a href="tel:${formData.phone}">${formData.phone}</a></span>
                </div>
                ${formData.message ? `
                  <div style="margin-top: 20px;">
                    <p class="info-label">Dodatkowe uwagi:</p>
                    <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">${formData.message}</p>
                  </div>
                ` : ''}
              </div>

              <div class="footer">
                <p>To zapytanie zostało automatycznie wygenerowane z formularza na hangarfilmowy.pl</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Email potwierdzający dla klienta
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0A1828, #1E3A5F); padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .header p { color: rgba(255,255,255,0.8); margin: 10px 0 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .message-box { background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .highlight { background: linear-gradient(135deg, #FFD700, #FFA500); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Dziękujemy za zapytanie!</h1>
              <p>Hangar Filmowy - Kino Pod Gwiazdami</p>
            </div>
            <div class="content">
              <div class="message-box">
                <h2 style="color: #0A1828; margin-top: 0;">Witaj ${formData.firstName}! 👋</h2>
                <p>Otrzymaliśmy Twoje zapytanie o organizację pokazu filmowego. Dziękujemy za zainteresowanie naszą ofertą!</p>
                
                <div class="highlight">
                  <p style="margin: 0; font-size: 18px; font-weight: bold;">Skontaktujemy się z Tobą w ciągu 24h roboczych</p>
                </div>

                <div class="summary">
                  <p style="margin: 5px 0;"><strong>Wybrany pakiet:</strong> ${eventLabels[eventType] || 'Nie określono'}</p>
                  <p style="margin: 5px 0;"><strong>Liczba widzów:</strong> ${audienceSize} osób</p>
                  ${preferredDate ? `<p style="margin: 5px 0;"><strong>Preferowany termin:</strong> ${new Date(preferredDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>` : ''}
                  <p style="margin: 5px 0;"><strong>Kategoria:</strong> ${category}</p>
                  ${extrasText !== 'Brak' ? `<p style="margin: 5px 0;"><strong>Dodatki:</strong> ${extrasText}</p>` : ''}
                </div>

                <p>W międzyczasie możesz:</p>
                <ul>
                  <li>Zastanowić się nad preferowanym terminem wydarzenia</li>
                  <li>Przygotować listę pytań dotyczących organizacji</li>
                  <li>Pomyśleć o repertuarze filmowym</li>
                </ul>

                <p style="margin-top: 25px;">W razie pilnych pytań, możesz napisać bezpośrednio na: <a href="mailto:pokaz@hangarfilmowy.pl" style="color: #FFD700; text-decoration: none; font-weight: bold;">pokaz@hangarfilmowy.pl</a></p>
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

    // Wysyłka emaila do firmy
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: contactEmail,
        subject: `Nowe zapytanie: ${eventLabels[eventType]} - ${formData.firstName} ${formData.lastName}`,
        html: adminEmailHtml,
      });
    } catch (emailError) {
      // Email error handled silently
    }

    // Wysyłka emaila potwierdzającego do klienta
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: formData.email,
        subject: `Potwierdzenie zapytania - Hangar Filmowy`,
        html: clientEmailHtml,
      });
    } catch (emailError) {
      // Email error handled silently
    }

    return NextResponse.json({ success: true, message: 'Zapytanie wysłane pomyślnie!' });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Wystąpił błąd podczas wysyłania zapytania.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
