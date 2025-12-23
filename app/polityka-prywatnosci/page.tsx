'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Mail, Phone } from 'lucide-react';

export default function PolitykaPrivatnosciPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A1828] via-[#1E3A5F] to-[#0A1828]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FFA500] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Powrót do strony głównej</span>
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-12 h-12 text-[#0A1828]" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A1828]">
              Polityka Prywatności
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-white space-y-6">
          
          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">1. Informacje ogólne</h2>
            <p className="text-white/80 mb-4">
              Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych 
              przekazanych przez Użytkowników w związku z korzystaniem przez nich ze strony internetowej 
              hangarfilmowy.pl.
            </p>
            <p className="text-white/80">
              Administratorem danych osobowych jest <strong>Hangar Filmowy</strong>, 
              z siedzibą w ul. Górska 7, 32-020 Wieliczka, NIP: 6871775693, REGON: 120380716.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">2. Podstawa prawna przetwarzania danych</h2>
            <p className="text-white/80 mb-4">
              Dane osobowe są przetwarzane zgodnie z:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO)</li>
              <li>Ustawą z dnia 10 maja 2018 r. o ochronie danych osobowych</li>
              <li>Ustawą z dnia 16 lipca 2004 r. Prawo telekomunikacyjne</li>
              <li>Ustawą z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">3. Cel i zakres przetwarzania danych</h2>
            <p className="text-white/80 mb-4">
              Dane osobowe są przetwarzane w następujących celach:
            </p>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">3.1. Obsługa formularza kontaktowego</h3>
                <p className="text-white/80 text-sm mb-2">
                  Cel: Odpowiedź na zapytanie ofertowe<br/>
                  Podstawa prawna: Art. 6 ust. 1 lit. a RODO (zgoda)<br/>
                  Zakres: imię, nazwisko, adres e-mail, numer telefonu, treść wiadomości
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">3.2. Pliki cookies</h3>
                <p className="text-white/80 text-sm mb-2">
                  Cel: Zapewnienie prawidłowego działania strony<br/>
                  Podstawa prawna: Art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes)<br/>
                  Szczegóły: Zobacz <Link href="/polityka-cookies" className="text-[#FFD700] hover:underline">Politykę Cookies</Link>
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">3.3. Marketing (opcjonalnie)</h3>
                <p className="text-white/80 text-sm mb-2">
                  Cel: Wysyłka informacji o usługach<br/>
                  Podstawa prawna: Art. 6 ust. 1 lit. a RODO (zgoda)<br/>
                  Zakres: adres e-mail
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">4. Okres przechowywania danych</h2>
            <p className="text-white/80 mb-4">
              Dane osobowe są przechowywane przez okres:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Zapytania ofertowe: do czasu realizacji lub wycofania zgody</li>
              <li>Dane niezbędne do rozliczenia usług: zgodnie z przepisami prawa podatkowego (5 lat)</li>
              <li>Pliki cookies: zgodnie z Polityką Cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">5. Udostępnianie danych osobowych</h2>
            <p className="text-white/80 mb-4">
              Dane osobowe mogą być przekazywane następującym podmiotom:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Dostawcy usług IT (hosting, poczta e-mail)</li>
              <li>Podmioty świadczące usługi księgowe i prawne</li>
              <li>Organy państwowe uprawione na podstawie przepisów prawa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">6. Prawa osób, których dane dotyczą</h2>
            <p className="text-white/80 mb-4">
              Przysługuje Ci prawo do:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li><strong>Dostępu</strong> do swoich danych osobowych (art. 15 RODO)</li>
              <li><strong>Sprostowania</strong> danych (art. 16 RODO)</li>
              <li><strong>Usunięcia</strong> danych ("prawo do bycia zapomnianym") (art. 17 RODO)</li>
              <li><strong>Ograniczenia przetwarzania</strong> (art. 18 RODO)</li>
              <li><strong>Przenoszenia</strong> danych (art. 20 RODO)</li>
              <li><strong>Sprzeciwu</strong> wobec przetwarzania (art. 21 RODO)</li>
              <li><strong>Wycofania zgody</strong> w dowolnym momencie (art. 7 ust. 3 RODO)</li>
              <li><strong>Wniesienia skargi</strong> do Prezesa Urzędu Ochrony Danych Osobowych</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">7. Bezpieczeństwo danych</h2>
            <p className="text-white/80 mb-4">
              Stosujemy odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo danych:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Szyfrowanie połączenia SSL/TLS</li>
              <li>Zasada minimalizacji danych</li>
              <li>Ograniczony dostęp do danych osobowych</li>
              <li>Regularne kopie zapasowe</li>
              <li>Monitoring bezpieczeństwa systemów</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">8. Kontakt w sprawie danych osobowych</h2>
            <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 rounded-lg p-6">
              <p className="text-white/80 mb-4">
                W sprawach związanych z przetwarzaniem danych osobowych możesz skontaktować się:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <Mail className="w-5 h-5 text-[#FFD700]" />
                  <a href="mailto:pokaz@hangarfilmowy.pl" className="hover:text-[#FFD700] transition">
                    pokaz@hangarfilmowy.pl
                  </a>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Phone className="w-5 h-5 text-[#FFD700]" />
                  <span>+48 602 451 036</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">9. Zmiany w polityce prywatności</h2>
            <p className="text-white/80">
              Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności. 
              O wszelkich zmianach użytkownicy zostaną poinformowani poprzez publikację nowej wersji 
              na stronie internetowej.
            </p>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/polityka-cookies"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-center"
          >
            Polityka Cookies
          </Link>
          <Link 
            href="/regulamin"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-center"
          >
            Regulamin
          </Link>
          <Link 
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A1828] font-bold rounded-lg hover:scale-105 transition-transform text-center"
          >
            Strona główna
          </Link>
        </div>
      </div>
    </main>
  );
}
