'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ChevronDown } from 'lucide-react';

type EventType = 'city' | 'corporate' | 'hotel' | 'festival' | null;

export default function Home() {
  const [eventType, setEventType] = useState<EventType>(null);
  const [audienceSize, setAudienceSize] = useState(250);
  const [extras, setExtras] = useState({
    popcorn: false,
    deckchairs: false,
    license: false
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const eventLabels: Record<Exclude<EventType, null>, string> = {
    city: 'Event miejski',
    corporate: 'Event korporacyjny',
    hotel: 'Hotel / Resort',
    festival: 'Festiwal / Impreza'
  };

  const getCategory = () => {
    if (audienceSize < 150) return { name: 'KAMERALNY', color: 'text-[#4D90FE]' };
    if (audienceSize < 400) return { name: 'STANDARD', color: 'text-[#FFD700]' };
    if (audienceSize < 700) return { name: 'PROFESSIONAL', color: 'text-[#FFA500]' };
    return { name: 'MASS EVENT', color: 'text-[#FF6B6B]' };
  };

  const getEstimatedPrice = () => {
    let base = 5000;
    if (audienceSize >= 150) base = 8500;
    if (audienceSize >= 400) base = 15000;
    if (audienceSize >= 700) base = 25000;
    
    if (extras.popcorn) base += 1500;
    if (extras.deckchairs) base += 2000;
    if (extras.license) base += 2500;
    
    return base.toLocaleString('pl-PL');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventType) {
      alert('Proszę wybrać rodzaj wydarzenia');
      return;
    }

    const category = getCategory();
    const estimatedPrice = getEstimatedPrice();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          audienceSize,
          extras,
          formData,
          category: category.name,
          estimatedPrice
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Zapytanie wysłane! Odezwiemy się wkrótce (sprawdź też folder SPAM).');
        // Reset formularza
        setEventType(null);
        setAudienceSize(250);
        setExtras({ popcorn: false, deckchairs: false, license: false });
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        alert('❌ Wystąpił błąd. Spróbuj ponownie lub napisz na: pokaz@hangarfilmowy.pl');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Wystąpił błąd połączenia. Spróbuj ponownie lub napisz na: pokaz@hangarfilmowy.pl');
    }
  };

  return (
    <main className="bg-[#0A1828]">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0A1828 0%, #1E3A5F 100%)',
        }}
      >
        {/* Background Stars Effect */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-60 left-1/3 w-2 h-2 bg-[#FFD700] rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 right-1/4 w-1 h-1 bg-white rounded-full opacity-80 animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700] opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFA500] opacity-10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="heading-hero text-white mb-6">
            Prawdziwe kino pod gwiazdami.<br />
            W jakości, jakiej jeszcze nie widziałeś.
          </h1>
          
          <p className="body-text text-white/90 max-w-3xl mx-auto mb-12">
            Zapomnij o wyblakłym obrazie z rzutnika. Hangar Filmowy to potężne ekrany LED, 
            krystaliczny dźwięk i zapach świeżego popcornu. Organizujemy plenerowe pokazy 
            filmowe klasy premium.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              Zorganizuj pokaz
            </button>
            <button 
              onClick={() => document.getElementById('dlaczego-my')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary"
            >
              Zobacz naszą technologię
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white/60" />
          </div>
        </div>
      </section>

      {/* O Nas Section */}
      <section id="o-nas" className="section-padding bg-[#F5F5F5]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Side */}
            <div>
              <h2 className="heading-section text-[#0A1828] mb-6">
                Wychodzimy z cienia. Wnosimy kino plenerowe na nowy poziom.
              </h2>
              <div className="space-y-4 body-text text-gray-700">
                <p>
                  Przez lata kino plenerowe kojarzyło się z jednym: czekaniem na zmrok, walką z wiatrem 
                  falującym ekranem i kompromisami w jakości obrazu. Hangar Filmowy zmienia te zasady gry.
                </p>
                <p>
                  Jesteśmy zespołem pasjonatów kina i ekspertów od eventów. Nasza obietnica jest prosta: 
                  dostarczamy wrażenia kinowe (dosłownie!) w dowolnym miejscu w Polsce. Nie uznajemy półśrodków.
                </p>
                <p>
                  Nasze ekrany świecą jasno, dźwięk wbija w fotel, a obsługa licencyjna zdejmuje Ci z głowy 
                  wszystkie formalności. Tworzymy wydarzenia, o których mieszkańcy rozmawiają miesiącami.
                </p>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#1E3A5F] to-[#0A1828] rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-white/20 text-6xl font-bold">LED Screen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dlaczego My Section */}
      <section id="dlaczego-my" className="section-padding bg-gradient-to-b from-[#F8F9FA] to-white">
        <div className="container mx-auto px-6">
          <h2 className="heading-section text-[#0A1828] text-center mb-16">
            Dlaczego ekran LED, a nie rzutnik?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Box 1 */}
            <div className="card group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#0A1828] mb-4 text-center">
                Obraz Żyleta – O Każdej Porze
              </h3>
              <p className="text-gray-600 text-center">
                Tradycyjna projekcja wymaga całkowitej ciemności. Nasze ekrany LED o ultrawysokiej jasności 
                pozwalają rozpocząć seans wcześniej, nawet przy zachodzącym słońcu. Czerń jest czarna, 
                kolory nasycone, a rozdzielczość zachwyca każdego widza.
              </p>
            </div>

            {/* Box 2 */}
            <div className="card group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#4D90FE] to-[#64C7FF] flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#0A1828] mb-4 text-center">
                Odporność na Warunki
              </h3>
              <p className="text-gray-600 text-center">
                Wiatr? Lekki deszcz? Dla naszych modułowych ścian LED to nie problem. Konstrukcja jest 
                stabilna i bezpieczna, w przeciwieństwie do tradycyjnych ekranów pneumatycznych 
                („dmuchańców"), które poddają się przy mocniejszych podmuchach.
              </p>
            </div>

            {/* Box 3 */}
            <div className="card group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.06m-1.414-1.06a5 5 0 01-1.06-1.414M12 12l.01.01m-.01 4.95a5 5 0 110-9.9" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#0A1828] mb-4 text-center">
                Dźwięk, Który Czujesz
              </h3>
              <p className="text-gray-600 text-center">
                Kino to w 50% dźwięk. Instalujemy profesjonalne systemy nagłośnieniowe, które zapewniają 
                czystość dialogów i głębię efektów specjalnych, precyzyjnie pokrywając dźwiękiem strefę widowni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta Section */}
      <section id="oferta" className="section-padding bg-[#0A1828]">
        <div className="container mx-auto px-6">
          <h2 className="heading-section text-white text-center mb-4">
            Nasza Oferta
          </h2>
          <p className="body-text text-white/70 text-center mb-16 max-w-3xl mx-auto">
            Dostarczamy kompletne rozwiązanie eventowe – od technologii po popcorn.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1 - Technika */}
            <div className="card-dark group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Technika Premium</h3>
              <ul className="space-y-2 text-white/80">
                <li>✓ Ekran LED (3m × 5m lub większy)</li>
                <li>✓ System nagłośnienia 5.1 / Dolby Atmos</li>
                <li>✓ Backup techniczny (zapasowy sprzęt na miejscu)</li>
                <li>✓ Montaż, ustawienie, demontaż</li>
                <li>✓ Obsługa techniczna podczas seansu</li>
              </ul>
            </div>

            {/* Card 2 - Licencje */}
            <div className="card-dark group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#4D90FE] to-[#64C7FF] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Licencje & Repertuar</h3>
              <ul className="space-y-2 text-white/80">
                <li>✓ Załatwiamy prawa do projekcji publicznej (ZAPA, STOART)</li>
                <li>✓ Szeroki wybór filmów – od klasyki po nowości</li>
                <li>✓ Możliwość emisji materiałów klienta (korporacyjnych, edukacyjnych)</li>
                <li>✓ Obsługa prawna i administracyjna licencji</li>
              </ul>
            </div>

            {/* Card 3 - Strefa Widza */}
            <div className="card-dark group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Strefa Widza</h3>
              <ul className="space-y-2 text-white/80">
                <li>✓ Leżaki lub krzesła (na wybór)</li>
                <li>✓ Koce piknikowe premium (w chłodniejsze wieczory)</li>
                <li>✓ Oświetlenie klimatyczne (LED, lampiony)</li>
                <li>✓ Obsługa gastronomiczna (opcjonalnie)</li>
              </ul>
            </div>

            {/* Card 4 - Popcorn */}
            <div className="card-dark group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#FF6B6B] to-[#FFD93D] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Popcorn & Więcej</h3>
              <ul className="space-y-2 text-white/80">
                <li>✓ Wózek popcornowy (świeży, na miejscu)</li>
                <li>✓ Drink bar (napoje, woda, soki)</li>
                <li>✓ Słodycze kinowe</li>
                <li>✓ Pakiety gastronomiczne do uzgodnienia</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Dla Kogo Section */}
      <section id="dla-kogo" className="section-padding bg-gradient-to-b from-[#F8F9FA] to-white">
        <div className="container mx-auto px-6">
          <h2 className="heading-section text-[#0A1828] text-center mb-16">
            Dla Kogo Jest Hangar Filmowy?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Target 1 - Samorządy */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#4D90FE] to-[#64C7FF] text-white transform hover:-translate-y-2 transition-all duration-300 shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Samorządy & Miasta</h3>
              <p className="text-center text-white/90">
                Kino w parku, festiwal miejski, piknik rodzinny – zbuduj kapitał społeczny i pokaż, 
                że Twoje miasto żyje kulturą.
              </p>
            </div>

            {/* Target 2 - Hotele */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] text-white transform hover:-translate-y-2 transition-all duration-300 shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Hotele & Resorty</h3>
              <p className="text-center text-white/90">
                Zaproponuj gościom wieczór filmowy w ogrodzie. Unikalne doświadczenie, które wyróżni 
                Twoją ofertę i wygeneruje pozytywne recenzje.
              </p>
            </div>

            {/* Target 3 - Firmy */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white transform hover:-translate-y-2 transition-all duration-300 shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Firmy & Korporacje</h3>
              <p className="text-center text-white/90">
                Integracja? Urodziny firmy? Prezentacja produktu? Zorganizuj kino na zamkniętym 
                evencie – niezapomniane team-buildingowe doświadczenie.
              </p>
            </div>

            {/* Target 4 - Festiwale */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFD93D] text-white transform hover:-translate-y-2 transition-all duration-300 shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Festiwale & Eventy</h3>
              <p className="text-center text-white/90">
                Festiwal muzyczny, food truck event, targi – dodaj kinową strefę, która przyciągnie 
                tłumy i stworzy wiralowe momenty w social mediach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proces Section */}
      <section id="proces" className="section-padding bg-[#0A1828]">
        <div className="container mx-auto px-6">
          <h2 className="heading-section text-white text-center mb-4">
            Jak To Działa? Proces Krok Po Kroku
          </h2>
          <p className="body-text text-white/70 text-center mb-16 max-w-2xl mx-auto">
            Od zapytania do seansu – wszystko maksymalnie proste.
          </p>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Ustalamy Termin & Wizję</h3>
                <p className="text-white/70">
                  Dzwonisz/piszesz. Rozmawiamy o dacie, miejscu, rodzaju eventu i Twoich oczekiwaniach.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4D90FE] to-[#64C7FF] flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Wybieramy Repertuar</h3>
                <p className="text-white/70">
                  Podpowiadamy filmy dopasowane do grupy docelowej. Ty wybierasz – my załatwiamy licencje.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Przygotowanie Przestrzeni</h3>
                <p className="text-white/70">
                  Przyjeżdżamy z wyprzedzeniem, montujemy ekran, nagłośnienie, strefę widowni.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FFD93D] flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6">
                  4
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Showtime!</h3>
                <p className="text-white/70">
                  Twoi goście wchodzą, siadają, zapachy popcornu unoszą się w powietrzu – KINO się zaczyna!
                </p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="hidden md:block relative -mt-64 mb-64">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#4D90FE] via-[#8B5CF6] to-[#FF6B6B] opacity-30" 
                   style={{ transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt Section */}
      <section id="kontakt" className="section-padding bg-gradient-to-b from-[#F8F9FA] to-white">
        <div className="container mx-auto px-6">
          <h2 className="heading-section text-[#0A1828] text-center mb-16">
            Skonfiguruj Swój Pokaz & Wyślij Zapytanie
          </h2>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Left Side - Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rodzaj wydarzenia *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['city', 'corporate', 'hotel', 'festival'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEventType(type)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                          eventType === type
                            ? 'border-[#FFD700] bg-[#FFD700]/10 font-semibold'
                            : 'border-gray-300 hover:border-[#FFD700]/50'
                        }`}
                      >
                        {type === 'city' && '🏙️ Event miejski'}
                        {type === 'corporate' && '🏢 Event korporacyjny'}
                        {type === 'hotel' && '🏨 Hotel / Resort'}
                        {type === 'festival' && '🎪 Festiwal / Impreza'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audience Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Przewidywana liczba widzów: <span className="text-[#FFD700] font-bold">{audienceSize}</span>
                  </label>
                  <input 
                    type="range" 
                    min="50" 
                    max="1000" 
                    value={audienceSize}
                    onChange={(e) => setAudienceSize(Number(e.target.value))}
                    className="slider-gold w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50</span>
                    <span>1000+</span>
                  </div>
                </div>

                {/* Extras */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dodatki
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={extras.popcorn}
                        onChange={(e) => setExtras({ ...extras, popcorn: e.target.checked })}
                        className="w-5 h-5 text-[#FFD700] rounded" 
                      />
                      <span>🍿 Wózek popcornowy</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={extras.deckchairs}
                        onChange={(e) => setExtras({ ...extras, deckchairs: e.target.checked })}
                        className="w-5 h-5 text-[#FFD700] rounded" 
                      />
                      <span>🛋️ Leżaki premium</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={extras.license}
                        onChange={(e) => setExtras({ ...extras, license: e.target.checked })}
                        className="w-5 h-5 text-[#FFD700] rounded" 
                      />
                      <span>📜 Obsługa licencyjna filmu</span>
                    </label>
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Imię *" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Nazwisko *" 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="E-mail *" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                />
                <input 
                  type="tel" 
                  placeholder="Telefon *" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                />
                <textarea 
                  placeholder="Dodatkowe uwagi..." 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                />

                <button type="submit" className="btn-primary w-full">
                  Wyślij Zapytanie
                </button>
              </form>
            </div>

            {/* Right Side - Summary */}
            <div className="card sticky top-24 h-fit">
              <h3 className="text-2xl font-semibold text-[#0A1828] mb-6">Podsumowanie</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rodzaj wydarzenia:</span>
                  <span className="font-semibold">
                    {eventType ? eventLabels[eventType] : 'Nie wybrano'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Liczba widzów:</span>
                  <span className="font-semibold">{audienceSize} osób</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategoria:</span>
                  <span className={`font-semibold ${getCategory().color}`}>
                    {getCategory().name}
                  </span>
                </div>
              </div>

              {(extras.popcorn || extras.deckchairs || extras.license) && (
                <div className="border-t pt-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Wybrane dodatki:</p>
                  <ul className="text-sm space-y-1 text-gray-700">
                    {extras.popcorn && <li>• Wózek popcornowy</li>}
                    {extras.deckchairs && <li>• Leżaki premium</li>}
                    {extras.license && <li>• Obsługa licencyjna filmu</li>}
                  </ul>
                </div>
              )}

              <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-6 rounded-xl text-white">
                <p className="text-sm opacity-90 mb-1">Orientacyjna cena od:</p>
                <p className="text-4xl font-bold">~{getEstimatedPrice()} zł</p>
                <p className="text-xs opacity-75 mt-2">*Ostateczna wycena po konsultacji</p>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Odpowiemy w ciągu 24h roboczych
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1828] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Column 1 - Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🎬</span>
                <span className="text-xl font-bold">Hangar Filmowy</span>
              </div>
              <p className="text-white/70 text-sm">
                Prawdziwe kino pod gwiazdami. W jakości, jakiej jeszcze nie widziałeś.
              </p>
            </div>

            {/* Column 2 - Links */}
            <div>
              <h4 className="font-semibold mb-4">Nawigacja</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="#o-nas" className="hover:text-[#FFD700] transition">O nas</a></li>
                <li><a href="#oferta" className="hover:text-[#FFD700] transition">Oferta</a></li>
                <li><a href="#proces" className="hover:text-[#FFD700] transition">Proces</a></li>
                <li><a href="#kontakt" className="hover:text-[#FFD700] transition">Kontakt</a></li>
              </ul>
            </div>

            {/* Column 3 - Contact */}
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>📧 pokaz@hangarfilmowy.pl</li>
                <li>📱 +48 XXX XXX XXX</li>
                <li>📍 Polska (zasięg ogólnopolski)</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-white/50 text-sm">
            <p>&copy; 2024 Hangar Filmowy. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
