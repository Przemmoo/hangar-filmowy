'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const KPO_BANNER_HEIGHT = 72;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [kpoBannerVisible, setKpoBannerVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleBannerVisibility = (e: CustomEvent) => {
      setKpoBannerVisible(e.detail.isVisible);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('kpoBannerVisibility', handleBannerVisibility as EventListener);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('kpoBannerVisibility', handleBannerVisibility as EventListener);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Zamknij mobile menu
      setIsMobileMenuOpen(false);
      
      // Jeśli baner jest widoczny, wymuś jego ukrycie
      if (kpoBannerVisible) {
        window.dispatchEvent(new CustomEvent('hideKPOBanner'));
        // Czekaj na ukrycie banera przed scrollowaniem
        setTimeout(() => {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      } else {
        // Baner już ukryty, scrolluj od razu
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A1828] shadow-lg backdrop-blur-sm'
          : 'bg-[#0A1828]/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none'
      }`}
      style={{ 
        height: '80px',
        top: kpoBannerVisible ? `${KPO_BANNER_HEIGHT}px` : '0'
      }}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-3 group"
        >
          <img 
            src="/hangar_filmowy.svg" 
            alt="Hangar Filmowy Logo" 
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent hidden sm:block">
            Hangar Filmowy
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('o-nas')}
            className="text-white hover:text-[#FFD700] transition-colors duration-300 font-medium"
          >
            O nas
          </button>
          <button
            onClick={() => scrollToSection('technologia')}
            className="text-white hover:text-[#FFD700] transition-colors duration-300 font-medium"
          >
            Technologia
          </button>
          <button
            onClick={() => scrollToSection('oferta')}
            className="text-white hover:text-[#FFD700] transition-colors duration-300 font-medium"
          >
            Oferta
          </button>
          <button
            onClick={() => scrollToSection('kontakt')}
            className="text-white hover:text-[#FFD700] transition-colors duration-300 font-medium"
          >
            Kontakt
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0A1828] border-t border-[#1E3A5F]">
          <div className="flex flex-col p-6 gap-4">
            <button
              onClick={() => scrollToSection('o-nas')}
              className="text-white hover:text-[#FFD700] transition-colors duration-300 font-medium text-lg text-left"
            >
              O nas
            </button>
            <button
              onClick={() => scrollToSection('technologia')}
              className="text-white hover:text-[#FFD700] transition-colors duration-300 font-medium text-lg text-left"
            >
              Technologia
            </button>
            <button
              onClick={() => scrollToSection('oferta')}
              className="text-white hover:text-[#FFD700] transition-colors duration-300 font-medium text-lg text-left"
            >
              Oferta
            </button>
            <button
              onClick={() => scrollToSection('kontakt')}
              className="text-white hover:text-[#FFD700] transition-colors duration-300 font-medium text-lg text-left"
            >
              Kontakt
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
