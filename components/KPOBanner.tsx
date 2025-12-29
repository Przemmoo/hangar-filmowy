'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Wysokość banera w px
export const KPO_BANNER_HEIGHT = 60; // mobile
export const KPO_BANNER_HEIGHT_MD = 72; // desktop

export default function KPOBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ukryj baner gdy przewinie się więcej niż 10px
      if (window.scrollY > 10) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    // Słuchaj custom eventu do wymuszenia ukrycia banera
    const handleForceHide = () => {
      setIsVisible(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hideKPOBanner', handleForceHide);
    
    // Dispatch custom event gdy zmienia się widoczność
    window.dispatchEvent(new CustomEvent('kpoBannerVisibility', { detail: { isVisible: true } }));
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hideKPOBanner', handleForceHide);
    };
  }, []);

  useEffect(() => {
    // Informuj o zmianie widoczności i wysokości
    const updateBannerHeight = () => {
      const height = bannerRef.current?.offsetHeight || 0;
      window.dispatchEvent(new CustomEvent('kpoBannerVisibility', { 
        detail: { isVisible, height } 
      }));
    };

    // Pierwszy pomiar natychmiast
    updateBannerHeight();
    
    // Drugi pomiar po krótkim opóźnieniu (gdy DOM już jest gotowy)
    const timer = setTimeout(updateBannerHeight, 100);
    
    // Śledź zmiany rozmiaru okna
    window.addEventListener('resize', updateBannerHeight);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateBannerHeight);
    };
  }, [isVisible]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          ref={bannerRef}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 z-[60] w-full bg-gradient-to-r from-white via-gray-50 to-white py-2 sm:py-3 md:py-4 border-b border-gray-200"
        >
          <div className="container mx-auto px-4">
            <Link 
              href="/kpo"
              className="flex flex-col lg:flex-row items-center justify-between gap-4 group"
            >
              {/* Logotypy */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center lg:justify-start">
                <img
                  src="/kpo-fe-popc.jpg"
                  alt="Fundusze Europejskie"
                  className="h-10 md:h-14 w-auto object-contain"
                />
                <img
                  src="/kpo-barwy-rp.jpg"
                  alt="Rzeczypospolita Polska"
                  className="h-10 md:h-14 w-auto object-contain"
                />
                <img
                  src="/kpo-kpo.jpg"
                  alt="KPO"
                  className="h-10 md:h-14 w-auto object-contain"
                />
                <img
                  src="/kpo-nextgeneU.jpg"
                  alt="Next Generation EU"
                  className="h-10 md:h-14 w-auto object-contain"
                />
              </div>

              {/* Tekst */}
              <div className="flex-1 text-center lg:text-left">
                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-snug">
                  Dofinansowano z <span className="font-bold text-[#0A1828]">Funduszy Europejskich</span> w ramach{' '}
                  <span className="font-bold text-[#0A1828]">Krajowego Planu Odbudowy i Zwiększania Odporności</span>
                </p>
              </div>

              {/* Przycisk */}
              <div className="flex items-center gap-2 text-[#0A1828] font-semibold group-hover:text-[#FFD700] transition-colors">
                <span className="text-xs sm:text-sm whitespace-nowrap">Więcej informacji</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
