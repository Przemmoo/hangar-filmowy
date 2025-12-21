'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A1828] shadow-lg backdrop-blur-sm'
          : 'bg-transparent'
      }`}
      style={{ height: '80px' }}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 group"
        >
          <div className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
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
