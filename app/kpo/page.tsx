import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Target, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dofinansowanie z KPO | Hangar Filmowy',
  description: 'Projekt Hangar Filmowy otrzymał dofinansowanie z Funduszy Europejskich w ramach Krajowego Planu Odbudowy i Zwiększania Odporności.',
};

export default function KPOPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1828] via-[#1E3A5F] to-[#0A1828] flex flex-col">
      {/* Header z powrotem */}
      <div className="bg-[#0A1828]/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-[#FFD700] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót do strony głównej</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        {/* Logotypy */}
        <div className="bg-white flex flex-wrap items-center justify-center rounded-2xl gap-6 mb-6 py-3">
          <Image
            src="/kpo-fe-popc.jpg"
            alt="Fundusze Europejskie Program Operacyjny Polska Cyfrowa"
            width={180}
            height={20}
            className="h-12 sm:h-14 lg:h-20 w-auto object-contain"
            priority
          />
          <Image
            src="/kpo-barwy-rp.jpg"
            alt="Barwy Rzeczypospolitej Polskiej"
            width={180}
            height={20}
            className="h-12 sm:h-14 lg:h-20 w-auto object-contain"
            priority
          />
          <Image
            src="/kpo-kpo.jpg"
            alt="KPO"
            width={180}
            height={20}
            className="h-12 sm:h-14 lg:h-20 w-auto object-contain"
            priority
          />
          <Image
            src="/kpo-nextgeneU.jpg"
            alt="Next Generation EU"
            width={180}
            height={20}
            className="h-12 sm:h-14 lg:h-20 w-auto object-contain"
            priority
          />
        </div>

        {/* Content - jedna kolumna */}
        <div className="flex-1 mx-auto w-full space-y-5">
          {/* Nagłówek */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center">
              Dofinansowanie z Funduszy Europejskich
            </h1>
            <p className="text-base sm:text-lg text-white/90 text-center">
              w ramach <span className="font-bold text-[#FFD700]">Krajowego Planu Odbudowy i Zwiększania Odporności</span>
            </p>
          </div>

          {/* Tytuł projektu */}
          <div className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl p-5 shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold text-[#0A1828] mb-3">
              Tytuł projektu
            </h2>
            <p className="text-sm sm:text-base text-[#0A1828]/90 leading-relaxed">
              Wzmacnianie odporności przedsiębiorstwa poprzez wprowadzenie do oferty usługi plenerowych transmisji filmowych i multimedialnych w kinowej jakości, bez względu na warunki atmosferyczne i oświetleniowe.
            </p>
          </div>

          {/* Wartość projektu - 2 kolumny */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Wartość projektu</h3>
              <p className="text-2xl sm:text-3xl font-bold text-[#FFD700]">736 935,36 PLN</p>
            </div>
            <div className="bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 backdrop-blur-xl rounded-xl border border-[#FFD700]/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Dofinansowanie z UE</h3>
              <p className="text-2xl sm:text-3xl font-bold text-[#FFD700]">419 334,20 PLN</p>
            </div>
          </div>

          {/* Cele i Grupa docelowa - 2 kolumny */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Cele projektu */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Cele projektu</h2>
              <div className="space-y-2 text-white/80 text-sm leading-relaxed">
                <p>
                  Projekt ma na celu <span className="text-white font-semibold">wzmocnienie odporności przedsiębiorstwa</span> poprzez 
                  dywersyfikację działalności i wprowadzenie innowacyjnej usługi.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                  <li>Inwestycje w środki trwałe</li>
                  <li>Zielona i cyfrowa transformacja</li>
                  <li>Szkolenia cyfrowe</li>
                  <li>Doradztwo biznesowe</li>
                </ul>
              </div>
            </div>

            {/* Grupa docelowa */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Grupa docelowa</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
                  <span className="text-sm text-white/90">Instytucje publiczne</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
                  <span className="text-sm text-white/90">Przedsiębiorcy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
                  <span className="text-sm text-white/90">Instytucje kultury</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
                  <span className="text-sm text-white/90">NGO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hashtagi */}
          <div className="bg-gradient-to-r from-[#FFD700]/10 via-[#FFA500]/10 to-[#FFD700]/10 rounded-xl p-4 border border-[#FFD700]/20">
            <div className="flex flex-wrap items-center justify-center gap-2 text-[#FFD700] font-semibold text-sm">
              <span className="px-3 py-1.5 bg-[#FFD700]/20 rounded-full">#FunduszeUE</span>
              <span className="px-3 py-1.5 bg-[#FFD700]/20 rounded-full">#NextGenerationEU</span>
              <span className="px-3 py-1.5 bg-[#FFD700]/20 rounded-full">#KrajowePlanOdbudowy</span>
            </div>
          </div>
        </div>

        {/* Program details - footer */}
        <div className="mt-5 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
          <p className="text-white/60 text-sm text-center leading-relaxed">
            Projekt realizowany w ramach <span className="text-white font-semibold">Działania 1.2.1</span>, 
            Komponent A „Odporność i Konkurencyjność Gospodarki", 
            Program: <span className="text-white font-semibold">Krajowy Plan Odbudowy i Zwiększania Odporności</span>.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-6 text-center">
          <Link
            href="/#kontakt"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A1828] font-bold text-lg rounded-xl hover:scale-105 transition-transform shadow-2xl"
          >
            Skontaktuj się z nami
          </Link>
        </div>
      </div>
    </div>
  );
}
