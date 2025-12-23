'use client';

import Link from 'next/link';
import { ArrowLeft, Cookie, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function PolitykaCookiesPage() {
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
            <Cookie className="w-12 h-12 text-[#0A1828]" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A1828]">
              Polityka Cookies
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-white space-y-6">
          
          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">1. Czym są pliki cookies?</h2>
            <p className="text-white/80 mb-4">
              Pliki cookies to małe pliki tekstowe zapisywane na Twoim urządzeniu (komputerze, tablecie, 
              smartfonie) podczas przeglądania stron internetowych. Cookies pozwalają stronie internetowej 
              rozpoznać Twoje urządzenie i zapamiętać wybrane preferencje.
            </p>
            <p className="text-white/80">
              Stosujemy pliki cookies, aby zapewnić prawidłowe działanie serwisu, dostosować treści do 
              Twoich potrzeb oraz analizować sposób korzystania ze strony.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">2. Jakie rodzaje cookies używamy?</h2>
            
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Cookies niezbędne</h3>
                    <span className="inline-block px-3 py-1 bg-green-500/30 text-green-300 text-xs font-semibold rounded-full mb-3">
                      ZAWSZE AKTYWNE
                    </span>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-3">
                  Te pliki cookies są niezbędne do prawidłowego funkcjonowania strony. Nie można ich wyłączyć 
                  w naszym systemie. Są ustawiane w odpowiedzi na Twoje działania, takie jak wypełnianie 
                  formularzy czy zarządzanie prywatnością.
                </p>
                <div className="bg-white/5 rounded p-3 text-sm">
                  <p className="text-white/70 mb-2"><strong>Przykłady:</strong></p>
                  <ul className="list-disc list-inside text-white/60 space-y-1 ml-2">
                    <li>cookieConsent - przechowuje Twoje preferencje dotyczące cookies</li>
                    <li>sessionId - zarządzanie sesją użytkownika</li>
                    <li>csrfToken - zabezpieczenie przed atakami CSRF</li>
                  </ul>
                  <p className="text-white/50 mt-3 text-xs">
                    Okres przechowywania: do 12 miesięcy
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Cookies analityczne</h3>
                    <span className="inline-block px-3 py-1 bg-blue-500/30 text-blue-300 text-xs font-semibold rounded-full mb-3">
                      OPCJONALNE
                    </span>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-3">
                  Te cookies pozwalają nam zliczać wizyty i źródła ruchu, aby mierzyć i poprawiać wydajność 
                  naszej witryny. Pomagają nam dowiedzieć się, które strony są najbardziej i najmniej popularne 
                  oraz zobaczyć, jak użytkownicy poruszają się po witrynie.
                </p>
                <div className="bg-white/5 rounded p-3 text-sm">
                  <p className="text-white/70 mb-2"><strong>Dostawcy:</strong></p>
                  <ul className="list-disc list-inside text-white/60 space-y-1 ml-2">
                    <li>Google Analytics (_ga, _gid, _gat) - analiza ruchu na stronie</li>
                  </ul>
                  <p className="text-white/50 mt-3 text-xs">
                    Okres przechowywania: do 24 miesięcy
                  </p>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-3">
                  <XCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Cookies marketingowe</h3>
                    <span className="inline-block px-3 py-1 bg-purple-500/30 text-purple-300 text-xs font-semibold rounded-full mb-3">
                      OPCJONALNE
                    </span>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-3">
                  Te pliki cookies mogą być ustawiane przez naszych partnerów reklamowych za pośrednictwem 
                  naszej witryny. Mogą być one wykorzystywane przez te firmy do budowania profilu Twoich 
                  zainteresowań i wyświetlania Ci odpowiednich reklam na innych witrynach.
                </p>
                <div className="bg-white/5 rounded p-3 text-sm">
                  <p className="text-white/70 mb-2"><strong>Dostawcy:</strong></p>
                  <ul className="list-disc list-inside text-white/60 space-y-1 ml-2">
                    <li>Google Ads - remarketing i konwersje</li>
                  </ul>
                  <p className="text-white/50 mt-3 text-xs">
                    Okres przechowywania: do 12 miesięcy
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">3. Jak zarządzać cookies?</h2>
            <p className="text-white/80 mb-4">
              Możesz zarządzać swoimi preferencjami dotyczącymi plików cookies na kilka sposobów:
            </p>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">3.1. Banner cookies na stronie</h3>
                <p className="text-white/80 text-sm">
                  Przy pierwszej wizycie na naszej stronie wyświetlany jest banner, gdzie możesz zaakceptować 
                  wszystkie cookies lub wybrać tylko niezbędne.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">3.2. Ustawienia przeglądarki</h3>
                <p className="text-white/80 text-sm mb-3">
                  Większość przeglądarek domyślnie akceptuje cookies. Możesz zmienić ustawienia przeglądarki, 
                  aby blokować cookies lub otrzymywać powiadomienia, gdy cookies są wysyłane:
                </p>
                <ul className="list-disc list-inside text-white/60 text-sm space-y-1 ml-4">
                  <li><strong>Chrome:</strong> Ustawienia → Prywatność i bezpieczeństwo → Pliki cookie</li>
                  <li><strong>Firefox:</strong> Opcje → Prywatność i bezpieczeństwo</li>
                  <li><strong>Safari:</strong> Preferencje → Prywatność</li>
                  <li><strong>Edge:</strong> Ustawienia → Pliki cookie i uprawnienia witryny</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">3.3. Narzędzia zewnętrzne</h3>
                <p className="text-white/80 text-sm mb-2">
                  Możesz również skorzystać z narzędzi do zarządzania cookies:
                </p>
                <ul className="list-disc list-inside text-white/60 text-sm space-y-1 ml-4">
                  <li>Google Analytics Opt-out: <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#FFD700] hover:underline" target="_blank" rel="noopener">tools.google.com/dlpage/gaoptout</a></li>
                  <li>Your Online Choices: <a href="http://www.youronlinechoices.com/" className="text-[#FFD700] hover:underline" target="_blank" rel="noopener">youronlinechoices.com</a></li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">4. Konsekwencje wyłączenia cookies</h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-white/80 text-sm">
                Wyłączenie lub ograniczenie plików cookies może wpłynąć na funkcjonalność strony. 
                Niektóre funkcje mogą nie działać prawidłowo bez cookies, w szczególności:
              </p>
              <ul className="list-disc list-inside text-white/60 text-sm space-y-1 ml-4 mt-3">
                <li>Formularz kontaktowy może nie działać</li>
                <li>Preferencje użytkownika nie będą zapamiętane</li>
                <li>Funkcje analityczne będą niedostępne</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">5. Aktualizacje polityki</h2>
            <p className="text-white/80">
              Zastrzegamy sobie prawo do wprowadzania zmian w Polityce Cookies. Wszelkie zmiany będą 
              publikowane na tej stronie z nową datą aktualizacji.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">6. Kontakt</h2>
            <p className="text-white/80 mb-4">
              W przypadku pytań dotyczących naszej Polityki Cookies, skontaktuj się z nami:
            </p>
            <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 rounded-lg p-4">
              <p className="text-white">
                Email: <a href="mailto:pokaz@hangarfilmowy.pl" className="text-[#FFD700] hover:underline">pokaz@hangarfilmowy.pl</a><br/>
                Telefon: +48 602 451 036
              </p>
            </div>
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
