'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Scale } from 'lucide-react';

export default function RegulaminPage() {
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
            <Scale className="w-12 h-12 text-[#0A1828]" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A1828]">
              Regulamin Serwisu
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-white space-y-6">
          
          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">1. Postanowienia ogólne</h2>
            <p className="text-white/80 mb-4">
              Niniejszy Regulamin określa zasady korzystania ze strony internetowej hangarfilmowy.pl 
              (zwanej dalej "Serwisem").
            </p>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/80 text-sm mb-2">
                <strong>Właściciel Serwisu:</strong> Hangar Filmowy<br/>
                <strong>Siedziba:</strong> ul. Górska 7, 32-020 Wieliczka<br/>
                <strong>NIP:</strong> 6871775693<br/>
                <strong>REGON:</strong> 120380716<br/>
                <strong>Email:</strong> pokaz@hangarfilmowy.pl<br/>
                <strong>Telefon:</strong> +48 602 451 036
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">2. Definicje</h2>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white text-sm">
                  <strong>Serwis</strong> - strona internetowa hangarfilmowy.pl wraz z wszystkimi podstronami
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white text-sm">
                  <strong>Użytkownik</strong> - osoba fizyczna, prawna lub jednostka organizacyjna korzystająca z Serwisu
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white text-sm">
                  <strong>Usługa</strong> - wynajem ekranu LED i infrastruktury kinowej oferowany przez Hangar Filmowy
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">3. Zasady korzystania z Serwisu</h2>
            <p className="text-white/80 mb-4">
              Korzystanie z Serwisu jest dobrowolne i bezpłatne. Użytkownik zobowiązuje się do:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Korzystania z Serwisu zgodnie z jego przeznaczeniem</li>
              <li>Przestrzegania przepisów prawa obowiązujących w Polsce</li>
              <li>Niepodejmowania działań mogących zakłócić działanie Serwisu</li>
              <li>Niekopiowania i niepowielania treści bez zgody właściciela</li>
              <li>Podawania prawdziwych danych w formularzach kontaktowych</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">4. Formularz kontaktowy i zapytania ofertowe</h2>
            <p className="text-white/80 mb-4">
              Serwis umożliwia przesyłanie zapytań ofertowych poprzez formularz kontaktowy:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Przesłanie formularza nie stanowi zobowiązania do zawarcia umowy</li>
              <li>Odpowiedź na zapytanie następuje w ciągu 24 godzin roboczych</li>
              <li>Użytkownik zobowiązany jest do podania prawdziwych danych kontaktowych</li>
              <li>Dane osobowe przetwarzane są zgodnie z <Link href="/polityka-prywatnosci" className="text-[#FFD700] hover:underline">Polityką Prywatności</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">5. Warunki świadczenia usług</h2>
            <p className="text-white/80 mb-4">
              Szczegółowe warunki świadczenia usług wynajmu ekranu LED określane są indywidualnie:
            </p>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2 text-sm">5.1. Zakres usługi</h3>
                <p className="text-white/80 text-sm">
                  Usługa obejmuje wynajem ekranu LED wraz z infrastrukturą techniczną niezbędną do 
                  realizacji pokazu kinowego lub innego wydarzenia.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2 text-sm">5.2. Rezerwacja</h3>
                <p className="text-white/80 text-sm">
                  Rezerwacja terminu następuje po uzgodnieniu szczegółów i podpisaniu umowy. 
                  Wymagana jest wpłata zaliczki w wysokości określonej w ofercie.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2 text-sm">5.3. Rezygnacja</h3>
                <p className="text-white/80 text-sm">
                  Warunki rezygnacji z usługi określone są w umowie. W przypadku rezygnacji 
                  w terminie krótszym niż 14 dni przed wydarzeniem, zaliczka może nie podlegać zwrotowi.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">6. Prawa autorskie</h2>
            <p className="text-white/80 mb-4">
              Wszystkie treści zawarte w Serwisie (teksty, grafiki, logo, zdjęcia) są chronione prawem autorskim:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Właścicielem praw jest Hangar Filmowy lub partnerzy</li>
              <li>Zakazane jest kopiowanie, modyfikowanie i rozpowszechnianie bez zgody</li>
              <li>Dozwolone jest udostępnianie linków do Serwisu</li>
              <li>Cytowanie z podaniem źródła jest dozwolone w rozsądnych granicach</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">7. Odpowiedzialność</h2>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2 text-sm">7.1. Dostępność Serwisu</h3>
                <p className="text-white/80 text-sm">
                  Właściciel dokłada wszelkich starań, aby Serwis działał prawidłowo, jednak nie gwarantuje 
                  nieprzerwanego działania i nie ponosi odpowiedzialności za przerwy techniczne.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2 text-sm">7.2. Treści</h3>
                <p className="text-white/80 text-sm">
                  Informacje zamieszczone w Serwisie mają charakter ogólny. Właściciel nie ponosi 
                  odpowiedzialności za decyzje podjęte na ich podstawie.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2 text-sm">7.3. Linki zewnętrzne</h3>
                <p className="text-white/80 text-sm">
                  Serwis może zawierać linki do stron zewnętrznych. Właściciel nie ponosi odpowiedzialności 
                  za treści i politykę prywatności tych stron.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">8. Reklamacje</h2>
            <p className="text-white/80 mb-4">
              Reklamacje dotyczące Serwisu lub świadczonych usług należy kierować:
            </p>
            <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 rounded-lg p-4">
              <p className="text-white text-sm">
                Email: pokaz@hangarfilmowy.pl<br/>
                Telefon: +48 602 451 036<br/>
              </p>
            </div>
            <p className="text-white/80 text-sm mt-4">
              Reklamacje rozpatrywane są w terminie do 14 dni roboczych od daty ich otrzymania.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">9. Zmiany w Regulaminie</h2>
            <p className="text-white/80">
              Właściciel zastrzega sobie prawo do wprowadzania zmian w Regulaminie. O wszelkich zmianach 
              Użytkownicy zostaną poinformowani poprzez publikację nowej wersji w Serwisie. Zmiany wchodzą 
              w życie z dniem publikacji.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">10. Postanowienia końcowe</h2>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>W sprawach nieuregulowanych w Regulaminie stosuje się przepisy prawa polskiego</li>
              <li>Wszelkie spory rozstrzygane będą przez sąd właściwy dla siedziby Hangar Filmowy</li>
              <li>Regulamin wchodzi w życie z dniem 23 grudnia 2025</li>
            </ul>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/polityka-prywatnosci"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-center"
          >
            Polityka Prywatności
          </Link>
          <Link 
            href="/polityka-cookies"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-center"
          >
            Polityka Cookies
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
