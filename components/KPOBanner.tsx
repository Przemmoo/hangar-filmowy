'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Wysokość banera w px
export const KPO_BANNER_HEIGHT = 72;

export default function KPOBanner() {
  const [isVisible, setIsVisible] = useState(true);

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
    // Informuj o zmianie widoczności
    window.dispatchEvent(new CustomEvent('kpoBannerVisibility', { detail: { isVisible } }));
  }, [isVisible]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 z-[60] w-full bg-gradient-to-r from-white via-gray-50 to-white py-4 border-b border-gray-200"
        >
          <div className="container mx-auto px-4">
            <Link 
              href="/kpo"
              className="flex flex-col lg:flex-row items-center justify-between gap-4 group"
            >
              {/* Logotypy */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center lg:justify-start">
                <Image
                  src="/kpo-fe-popc.jpg"
                  alt="Fundusze Europejskie"
                  width={160}
                  height={60}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                <Image
                  src="/kpo-barwy-rp.jpg"
                  alt="Rzeczypospolita Polska"
                  width={140}
                  height={60}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                <Image
                  src="/kpo-kpo.jpg"
                  alt="KPO"
                  width={140}
                  height={60}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                <Image
                  src="/kpo-nextgeneU.jpg"
                  alt="Next Generation EU"
                  width={140}
                  height={60}
                  className="h-10 sm:h-12 w-auto object-contain"
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
