"use client";

import { motion } from "framer-motion";
import { Film, Sparkles, Users, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark via-brand-blue to-brand-dark">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-brand-gold" />
              <span className="text-xl font-bold text-white">Hangar Filmowy</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#o-nas" className="text-white/80 hover:text-brand-gold transition">O nas</a>
              <a href="#oferta" className="text-white/80 hover:text-brand-gold transition">Oferta</a>
              <a href="#kontakt" className="text-white/80 hover:text-brand-gold transition">Kontakt</a>
            </div>
            <Link 
              href="/admin/login"
              className="text-sm text-white/60 hover:text-brand-gold transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <Sparkles className="w-16 h-16 text-brand-gold" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Prawdziwe Kino
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-orange">
                Pod Gwiazdami
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-2xl mx-auto">
              Wynajem profesjonalnego ekranu LED na wydarzenia
            </p>
            
            <p className="text-lg text-white/60 mb-12 max-w-xl mx-auto">
              Organizacja kin plenerowych, eventów firmowych, pokazów samochodowych i imprez miejskich
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#kontakt"
                className="px-8 py-4 bg-gradient-to-r from-brand-gold to-brand-orange text-black font-bold rounded-lg hover:scale-105 transition-transform duration-300"
              >
                ZAPYTAJ O TERMIN
              </a>
              <a
                href="#oferta"
                className="px-8 py-4 border-2 border-brand-gold text-brand-gold font-bold rounded-lg hover:bg-brand-gold/10 transition-colors duration-300"
              >
                ZOBACZ OFERTĘ
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Users className="w-10 h-10 text-brand-gold mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">50-1000+</div>
              <div className="text-white/60">Widzów</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Film className="w-10 h-10 text-brand-gold mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">LED 4K</div>
              <div className="text-white/60">Jakość obrazu</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Star className="w-10 h-10 text-brand-gold mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/60">Wsparcie</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-brand-gold/50 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-3 bg-brand-gold rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Quick sections placeholders */}
      <section id="o-nas" className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">O nas</h2>
          <p className="text-xl text-white/70">
            Sekcja w budowie - szczegółowa treść zostanie dodana wkrótce
          </p>
        </div>
      </section>

      <section id="oferta" className="py-24 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Oferta</h2>
          <p className="text-xl text-white/70">
            Sekcja w budowie - szczegółowa treść zostanie dodana wkrótce
          </p>
        </div>
      </section>

      <section id="kontakt" className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Kontakt</h2>
          <p className="text-xl text-white/70 mb-8">
            Konfigurator w budowie - wkrótce będziesz mógł stworzyć swoją ofertę online
          </p>
          <a 
            href="mailto:pokaz@hangarfilmowy.pl"
            className="text-brand-gold hover:text-brand-orange text-xl transition"
          >
            pokaz@hangarfilmowy.pl
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/60">
          <p>&copy; 2025 Hangar Filmowy. Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
}
