'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
      setHasConsent(false);
    } else {
      setHasConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
    setHasConsent(true);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
    setHasConsent(true);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
    setHasConsent(true);
  };

  return (
    <>
      {/* Floating Cookie Button - pokazuje się po zaakceptowaniu */}
      {hasConsent && !showBanner && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          onClick={() => setShowBanner(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
          title="Zarządzaj cookies"
        >
          <Cookie className="w-7 h-7 text-[#0A1828] group-hover:rotate-12 transition-transform" />
        </motion.button>
      )}

      {/* Cookie Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
          >
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#0A1828] via-[#1E3A5F] to-[#0A1828] border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center">
                  <Cookie className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A1828]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#FFD700]" />
                    Szanujemy Twoją prywatność
                  </h3>
                </div>

                <p className="text-white/80 text-sm sm:text-base mb-4">
                  Używamy plików cookies, aby zapewnić najlepsze doświadczenia na naszej stronie. 
                  Pliki cookies są niezbędne do prawidłowego działania serwisu oraz pomagają nam 
                  analizować ruch i dostosowywać treści do Twoich potrzeb.
                </p>

                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mb-4 space-y-3"
                  >
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm">Niezbędne cookies</span>
                        <span className="text-[#FFD700] text-xs font-semibold">ZAWSZE AKTYWNE</span>
                      </div>
                      <p className="text-white/60 text-xs">
                        Wymagane do podstawowego działania strony, zarządzania sesjami i bezpieczeństwa.
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm">Cookies analityczne</span>
                        <span className="text-white/40 text-xs">OPCJONALNE</span>
                      </div>
                      <p className="text-white/60 text-xs">
                        Pomagają nam zrozumieć jak użytkownicy korzystają ze strony (np. Google Analytics).
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm">Cookies marketingowe</span>
                        <span className="text-white/40 text-xs">OPCJONALNE</span>
                      </div>
                      <p className="text-white/60 text-xs">
                        Używane do personalizacji reklam i śledzenia efektywności kampanii.
                      </p>
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[#FFD700] hover:text-[#FFA500] text-sm font-semibold mb-4 transition-colors"
                >
                  {showDetails ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
                </button>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A1828] font-bold rounded-lg hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
                  >
                    Akceptuj wszystkie
                  </button>
                  <button
                    onClick={handleAcceptNecessary}
                    className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors text-sm sm:text-base"
                  >
                    Tylko niezbędne
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-6 py-3 border-2 border-white/20 text-white/80 font-semibold rounded-lg hover:bg-white/5 transition-colors text-sm sm:text-base"
                  >
                    Odrzuć
                  </button>
                </div>

                <p className="text-white/40 text-xs mt-4">
                  Kontynuując, zgadzasz się na naszą{' '}
                  <a href="/polityka-prywatnosci" className="text-[#FFD700] hover:underline">
                    Politykę Prywatności
                  </a>
                  {' '}i{' '}
                  <a href="/polityka-cookies" className="text-[#FFD700] hover:underline">
                    Politykę Cookies
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
