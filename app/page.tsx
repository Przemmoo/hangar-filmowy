'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';
import CookieBanner from '@/components/CookieBanner';
import KPOBanner from '@/components/KPOBanner';
import { ChevronDown, Sparkles, Users, Film, Star } from 'lucide-react';
import { scrollToSection } from '@/lib/scrollToSection';

type EventType = 'city' | 'corporate' | 'hotel' | 'festival' | null;

export default function Home() {
  const [content, setContent] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [eventType, setEventType] = useState<EventType>(null);
  const [audienceSize, setAudienceSize] = useState(250);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [kpoBannerHeight, setKpoBannerHeight] = useState(60);
  const [kpoBannerVisible, setKpoBannerVisible] = useState(true);
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Oblicz kategorię na podstawie liczby widzów
  const getCategory = () => {
    if (audienceSize <= 150) return 'KAMERALNY';
    if (audienceSize <= 500) return 'STANDARD';
    if (audienceSize <= 800) return 'PROFESSIONAL';
    return 'MASS EVENT';
  };

  // Śledź wysokość bannera KPO
  useEffect(() => {
    const handleBannerVisibility = (e: CustomEvent) => {
      setKpoBannerVisible(e.detail.isVisible);
      if (e.detail.height) {
        setKpoBannerHeight(e.detail.height);
      }
    };

    window.addEventListener('kpoBannerVisibility', handleBannerVisibility as EventListener);
    
    return () => {
      window.removeEventListener('kpoBannerVisibility', handleBannerVisibility as EventListener);
    };
  }, []);

  // Load content from CMS
  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading content:', err);
        setIsLoading(false);
      });
  }, []);

  // Obsługa scrollowania do sekcji z hash w URL (np. /#kontakt)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hash = window.location.hash;
    if (hash) {
      // Usuń # z początku
      const sectionId = hash.substring(1);
      // Odczekaj chwilę, aż strona się załaduje
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 500);
    }
  }, []);

  const eventLabels: Record<Exclude<EventType, null>, string> = {
    city: 'Plener Miejski',
    corporate: 'Event Firmowy',
    hotel: 'Kino Samochodowe',
    festival: 'Inne'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventType) {
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);

    // Oblicz kategorię wydarzenia na podstawie liczby widzów
    const category = getCategory();

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
          category,
          preferredDate
        }),
      });
      
      const data = await response.json();

      if (data.success) {
        // Reset formularza
        setEventType(null);
        setAudienceSize(250);
        setPreferredDate('');
        setExtras({ popcorn: false, deckchairs: false, license: false });
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        setShowSuccessModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    let x: number;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
    } else {
      x = e.clientX - rect.left;
    }
    
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <main className="bg-[var(--brand-dark)]">
      {/* KPO Banner - na górze przed navbar */}
      <KPOBanner />
      
      <Navbar />
      
      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative min-h-[650px] sm:min-h-[700px] md:min-h-screen flex items-center justify-center overflow-hidden md:pt-0"
        style={{
          paddingTop: kpoBannerVisible ? `${kpoBannerHeight + 80}px` : '80px',
          backgroundImage: content.hero?.backgroundImage ? `url(${content.hero.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Background Stars Effect */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-60 left-1/3 w-2 h-2 bg-[var(--brand-gold)] rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 right-1/4 w-1 h-1 bg-white rounded-full opacity-80 animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--brand-gold)] opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--brand-orange)] opacity-10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 px-4">
              {content.hero?.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)]">
                {content.hero?.titleGradient}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-3 md:mb-4 max-w-2xl mx-auto px-4">
              {content.hero?.subtitle}
            </p>
            
            <p className="text-sm sm:text-base md:text-lg text-white/60 mb-8 md:mb-12 max-w-xl mx-auto px-4">
              {content.hero?.lead}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button
                onClick={() => scrollToSection('kontakt')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)] text-black font-bold rounded-lg hover:scale-105 transition-transform duration-300 text-center cursor-pointer"
              >
                {content.hero?.ctaPrimary}
              </button>
              <button
                onClick={() => scrollToSection('oferta')}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-[var(--brand-gold)] text-[var(--brand-gold)] font-bold rounded-lg hover:bg-[var(--brand-gold)]/10 transition-colors duration-300 text-center cursor-pointer"
              >
                {content.hero?.ctaSecondary}
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto px-4"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
              <Users className="w-8 h-8 md:w-10 md:h-10 text-[var(--brand-gold)] mx-auto mb-2 md:mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">50-1000+</div>
              <div className="text-sm md:text-base text-white/60">Widzów</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
              <Film className="w-8 h-8 md:w-10 md:h-10 text-[var(--brand-gold)] mx-auto mb-2 md:mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">LED 4K</div>
              <div className="text-sm md:text-base text-white/60">Jakość obrazu</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
              <Star className="w-8 h-8 md:w-10 md:h-10 text-[var(--brand-gold)] mx-auto mb-2 md:mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">24/7</div>
              <div className="text-sm md:text-base text-white/60">Wsparcie</div>
            </div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-brand-gold/50 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-3 bg-brand-gold rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* O Nas Section */}
      <section id="o-nas" className="section-padding bg-gradient-to-b from-[var(--brand-dark)] to-[var(--brand-blue)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-top">
            {/* Text Side */}
            <ScrollReveal>
              <div className="space-y-4 md:space-y-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-normal">
                  <span className="text-white">{content.about?.title}</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)]">
                    {content.about?.titleGradient}
                  </span>
                </h2>
                
                <div className="space-y-4 md:space-y-6 text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
                  <p>
                    {content.about?.paragraph1}
                  </p>
                  <p>
                    {content.about?.paragraph2}
                  </p>
                </div>

                
              </div>
            </ScrollReveal>

            {/* Image Side */}
            <ScrollReveal delay={0.2}>
              <div className="relative group">
                <div className="relative aspect-[4/3]">
                  {/* Gradient Glow Layer */}
                  <div 
                    className="absolute inset-0 rounded-2xl transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6) 0%, rgba(128, 0, 255, 0.6) 100%)',
                      filter: 'blur(5px)',
                      transform: 'scale(1.01)',
                      zIndex: 0,
                      opacity: 1
                    }}
                  />
                  {/* Hover Glow Intensifier */}
                  <div 
                    className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(128, 0, 255, 0.8) 100%)',
                      filter: 'blur(8px)',
                      transform: 'scale(1.03)',
                      zIndex: 0
                    }}
                  />
                  {/* Image Container */}
                  {content.about?.imageUrl && (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden z-10">
                    <Image 
                      src={content.about?.imageUrl} 
                      alt={content.about?.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Dlaczego My Section */}
      <section id="technologia" className="section-padding bg-gradient-to-b from-[var(--brand-blue)] to-[var(--brand-dark)]">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">
              <span className="text-white">{content["why-us"]?.title} </span><br />
              
            </h2>
            <p className="text-white/70 text-center mb-16 max-w-3xl mx-auto">
              {content["why-us"]?.subtitle}
            </p>
          </ScrollReveal>

          {/* Comparison Image */}
          {content["why-us"]?.comparisonImageUrl && (
          <ScrollReveal delay={0.1}>
            <div className="max-w-4xl mx-auto mb-8 md:mb-16 px-4">
              <div className="relative">
                {/* Gradient Glow Layer */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6) 0%, rgba(128, 0, 255, 0.9) 100%)',
                    filter: 'blur(10px)',
                    transform: 'scale(1.00)',
                    zIndex: 0,
                    opacity: 1
                  }}
                />
                
                {/* Comparison Container */}
                <div 
                  className="relative aspect-video rounded-2xl overflow-hidden bg-[var(--brand-dark)] cursor-ew-resize select-none z-10"
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  onMouseMove={handleSliderMove}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                  onTouchMove={handleSliderMove}
                >
                  
                  {/* Full comparison image as base */}
                  <Image 
                    src={content["why-us"]?.comparisonImageUrl} 
                    alt="Porównanie rzutnika i ekranu LED"
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                    loading="lazy"
                  />

                  {/* Dark blur overlay for left side */}
                  <div 
                    className="absolute inset-0 backdrop-blur-[2px] bg-gray-600/45 z-[5]"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  />

                  {/* Labels */}
                  {/* Left label wrapper - clips entire left area */}
                  <div 
                    className="absolute inset-0 z-10"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/70 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-4 md:py-2 rounded-lg">
                      <span className="text-white font-semibold text-[9px] sm:text-xs md:text-sm">TRADYCYJNY RZUTNIK</span>
                    </div>
                  </div>
                  
                  {/* Right label wrapper - clips entire right area */}
                  <div 
                    className="absolute inset-0 z-10"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                  >
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)] px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-4 md:py-2 rounded-lg">
                      <span className="text-black font-semibold text-[9px] sm:text-xs md:text-sm">HANGAR FILMOWY LED</span>
                    </div>
                  </div>
                
                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-[var(--brand-gold)] to-[var(--brand-orange)] z-20 transition-opacity duration-200"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[var(--brand-gold)] to-[var(--brand-orange)] flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4 4-4M17 8l4 4-4 4" />
                    </svg>
                  </div>
                </div>
                </div>
              </div>
              <p className="text-center text-white/50 mt-2 md:mt-4 text-xs md:text-sm px-4">Przesuń suwak</p>
            </div>
          </ScrollReveal>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 px-4">
            {/* Box 1 - Sun Icon */}
            <ScrollReveal delay={0.1}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '24px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%'
                }}
              >
                <svg className="text-white" style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 2v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 md:mb-4 text-center">
                {content["why-us"]?.boxes?.[0]?.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm text-center">
                {content["why-us"]?.boxes?.[0]?.description}
              </p>
            </div>
            </ScrollReveal>

            {/* Box 2 - Cloud Rain Icon */}
            <ScrollReveal delay={0.2}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '24px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%'
                }}
              >
                <svg className="text-white" style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 19v2m4-2v2m4-2v2" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 md:mb-4 text-center">
                {content["why-us"]?.boxes?.[1]?.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm text-center">
                {content["why-us"]?.boxes?.[1]?.description}
              </p>
            </div>
            </ScrollReveal>

            {/* Box 3 - Speaker Icon */}
            <ScrollReveal delay={0.3}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '24px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%'
                }}
              >
                <svg className="text-white" style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 md:mb-4 text-center">
                {content["why-us"]?.boxes?.[2]?.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm text-center">
                {content["why-us"]?.boxes?.[2]?.description}
              </p>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Oferta Section */}
      <section id="oferta" className="section-padding bg-[var(--brand-dark)] scroll-mt-[50px]">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">
              <span className="text-white">{content.offer?.titlePrefix} </span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)]">
                {content.offer?.title}
              </span>
            </h2>
            <p className="text-white/70 text-center text-sm sm:text-base mb-8 md:mb-16 max-w-3xl mx-auto px-4">
              {content.offer?.subtitle}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8 mx-auto">
            {/* Card 1 - Technika Kinowa */}
            {content.offer?.cards?.[0]?.imageUrl && (
            <ScrollReveal delay={0.1}>
              <div className="relative group">
                {/* Gradient Glow Layer */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6) 0%, rgba(128, 0, 255, 0.6) 100%)',
                    filter: 'blur(5px)',
                    transform: 'scale(1.01)',
                    zIndex: 0,
                    opacity: 1
                  }}
                />
                {/* Hover Glow Intensifier */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(128, 0, 255, 0.8) 100%)',
                    filter: 'blur(8px)',
                    transform: 'scale(1.03)',
                    zIndex: 0
                  }}
                />
                <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[300px] sm:h-[350px] md:h-[400px] z-10">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image 
                    src={content.offer?.cards?.[0]?.imageUrl}
                    alt={content.offer?.cards?.[0]?.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg  flex items-center justify-center mb-3 md:mb-4 relative">
                    <Image 
                      src="/image-kino.png" 
                      alt="Technika Kinowa"
                      width={24}
                      height={24}
                      style={{ filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{content.offer?.cards?.[0]?.title}</h3>
                  <p className="text-white/90 text-xs sm:text-sm">
                    {content.offer?.cards?.[0]?.description}
                  </p>
                </div>
              </div>
              </div>
            </ScrollReveal>
            )}

            {/* Card 2 - Licencje */}
            {content.offer?.cards?.[1]?.imageUrl && (
            <ScrollReveal delay={0.2}>
              <div className="relative group">
                {/* Gradient Glow Layer */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6) 0%, rgba(128, 0, 255, 0.6) 100%)',
                    filter: 'blur(5px)',
                    transform: 'scale(1.01)',
                    zIndex: 0,
                    opacity: 1
                  }}
                />
                {/* Hover Glow Intensifier */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(128, 0, 255, 0.8) 100%)',
                    filter: 'blur(8px)',
                    transform: 'scale(1.03)',
                    zIndex: 0
                  }}
                />
                <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[300px] sm:h-[350px] md:h-[400px] z-10">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image 
                    src={content.offer?.cards?.[1]?.imageUrl}
                    alt={content.offer?.cards?.[1]?.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg  flex items-center justify-center mb-3 md:mb-4 relative">
                    <Image 
                      src="/image-licenc.png" 
                      alt="Licencje"
                      width={24}
                      height={24}
                      style={{ filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{content.offer?.cards?.[1]?.title}</h3>
                  <p className="text-white/90 text-xs sm:text-sm">
                    {content.offer?.cards?.[1]?.description}
                  </p>
                </div>
              </div>
              </div>
            </ScrollReveal>
            )}

            {/* Card 3 - Strefa Widza */}
            {content.offer?.cards?.[2]?.imageUrl && (
            <ScrollReveal delay={0.3}>
              <div className="relative group">
                {/* Gradient Glow Layer */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6) 0%, rgba(128, 0, 255, 0.6) 100%)',
                    filter: 'blur(5px)',
                    transform: 'scale(1.01)',
                    zIndex: 0,
                    opacity: 1
                  }}
                />
                {/* Hover Glow Intensifier */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(128, 0, 255, 0.8) 100%)',
                    filter: 'blur(8px)',
                    transform: 'scale(1.03)',
                    zIndex: 0
                  }}
                />
                
                <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[300px] sm:h-[350px] md:h-[400px] z-10">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image 
                    src={content.offer?.cards?.[2]?.imageUrl}
                    alt={content.offer?.cards?.[2]?.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg  flex items-center justify-center mb-3 md:mb-4 relative">
                    <Image 
                      src="/image-armchair.png" 
                      alt="Strefa Widza"
                      width={24}
                      height={24}
                      style={{ filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{content.offer?.cards?.[2]?.title}</h3>
                  <p className="text-white/90 text-xs sm:text-sm">
                    {content.offer?.cards?.[2]?.description}
                  </p>
                </div>
              </div>
              </div>
            </ScrollReveal>
            )}

            {/* Card 4 - Popcorn Bar */}
            {content.offer?.cards?.[3]?.imageUrl && (
            <ScrollReveal delay={0.4}>
              <div className="relative group">
                {/* Gradient Glow Layer */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.6) 0%, rgba(128, 0, 255, 0.6) 100%)',
                    filter: 'blur(5px)',
                    transform: 'scale(1.01)',
                    zIndex: 0,
                    opacity: 1
                  }}
                />
                {/* Hover Glow Intensifier */}
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(128, 0, 255, 0.8) 100%)',
                    filter: 'blur(8px)',
                    transform: 'scale(1.03)',
                    zIndex: 0
                  }}
                />
                <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[300px] sm:h-[350px] md:h-[400px] z-10">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image 
                    src={content.offer?.cards?.[3]?.imageUrl}
                    alt={content.offer?.cards?.[3]?.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg  flex items-center justify-center mb-3 md:mb-4 relative">
                    <Image 
                      src="/image-food.png" 
                      alt="Popcorn Bar"
                      width={24}
                      height={24}
                      style={{ filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{content.offer?.cards?.[3]?.title}</h3>
                  <p className="text-white/90 text-xs sm:text-sm">
                    {content.offer?.cards?.[3]?.description}
                  </p>
                </div>
              </div>
              </div>
            </ScrollReveal>
            )}
          </div>

          {/* Dla Kogo Subsection */}
          <ScrollReveal delay={0.5}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4 mt-16 md:mt-24">
              {content['for-who']?.title}
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-16">
            {/* Target 1 - Samorządy */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '24px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10 relative"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%'
                }}
              >
                <Image 
                  src="/image-office.png" 
                  alt="Samorządy i Miasta"
                  width={24}
                  height={24}
                  style={{ filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                  loading="lazy"
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 md:mb-4 text-center">
                {content['for-who']?.cards?.[0]?.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm text-center">
                {content['for-who']?.cards?.[0]?.description}
              </p>
            </div>

            {/* Target 2 - Hotele */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '24px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10 relative"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%'
                }}
              >
                <Image 
                  src="/image-hotels.png" 
                  alt="Hotele i Resorty"
                  width={24}
                  height={24}
                  style={{ filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                  loading="lazy"
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 md:mb-4 text-center">
                {content['for-who']?.cards?.[1]?.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm text-center">
                {content['for-who']?.cards?.[1]?.description}
              </p>
            </div>

            {/* Target 3 - Firmy */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '24px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10 relative"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%'
                }}
              >
                <Image 
                  src="/image-firm.png" 
                  alt="Firmy i Korporacje"
                  width={24}
                  height={24}
                  style={{ filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                  loading="lazy"
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 md:mb-4 text-center">
                {content['for-who']?.cards?.[2]?.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm text-center">
                {content['for-who']?.cards?.[2]?.description}
              </p>
            </div>

            {/* Target 4 - Festiwale */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '24px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10 relative"
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%'
                }}
              >
                <Image 
                  src="/image-festival.png" 
                  alt="Festiwale i Eventy"
                  width={24}
                  height={24}
                  style={{ filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                  loading="lazy"
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 md:mb-4 text-center">
                {content['for-who']?.cards?.[3]?.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm text-center">
                {content['for-who']?.cards?.[3]?.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proces Section */}
      <section id="proces" className="section-padding bg-gradient-to-b from-[var(--brand-blue)] to-[var(--brand-dark)]">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">
            {content.process?.title}
          </h2>
          <p className="text-white/70 text-center mb-8 md:mb-16 max-w-3xl mx-auto text-sm sm:text-base px-4">
            {content.process?.subtitle}
          </p>

          <div className="mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Step 1 */}
              <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105">
                <div 
                  className="rounded-full flex items-center justify-center font-bold text-white mx-auto mb-4 md:mb-6 transition-all duration-500 hover-step-circle"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    fontSize: '32px',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  1
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 md:mb-3 transition-all duration-300 group-hover:text-[var(--brand-gold)]">{content.process?.steps?.[0]?.title}</h3>
                <p className="text-white/80 text-xs sm:text-sm transition-all duration-300 group-hover:text-white">
                  {content.process?.steps?.[0]?.description}
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105">
                <div 
                  className="rounded-full flex items-center justify-center font-bold text-white mx-auto mb-4 md:mb-6 transition-all duration-500 hover-step-circle"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    fontSize: '32px',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  2
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 md:mb-3 transition-all duration-300 group-hover:text-[var(--brand-gold)]">{content.process?.steps?.[1]?.title}</h3>
                <p className="text-white/80 text-xs sm:text-sm transition-all duration-300 group-hover:text-white">
                  {content.process?.steps?.[1]?.description}
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105">
                <div 
                  className="rounded-full flex items-center justify-center font-bold text-white mx-auto mb-4 md:mb-6 transition-all duration-500 hover-step-circle"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    fontSize: '32px',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  3
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 md:mb-3 transition-all duration-300 group-hover:text-[var(--brand-gold)]">{content.process?.steps?.[2]?.title}</h3>
                <p className="text-white/80 text-xs sm:text-sm transition-all duration-300 group-hover:text-white">
                  {content.process?.steps?.[2]?.description}
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105">
                <div 
                  className="rounded-full flex items-center justify-center font-bold text-white mx-auto mb-4 md:mb-6 transition-all duration-500 hover-step-circle"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    fontSize: '32px',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  4
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 md:mb-3 transition-all duration-300 group-hover:text-[var(--brand-gold)]">{content.process?.steps?.[3]?.title}</h3>
                <p className="text-white/80 text-xs sm:text-sm transition-all duration-300 group-hover:text-white">
                  {content.process?.steps?.[3]?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt Section - Konfigurator */}
      <section id="kontakt" className="section-padding bg-[var(--brand-dark)] scroll-mt-[50px]">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">
              <span className="text-white">{content.contact?.title}</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)]">
                {content.contact?.titleGradient}
              </span>
          </h2>
          <p className="text-white/70 text-center mb-8 md:mb-16 max-w-3xl mx-auto text-sm sm:text-base px-4">
            {content.contact?.subtitle}
          </p>

          <div className="mx-auto grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-6 md:gap-8">
            {/* Left Side - 55% */}
            <div className="space-y-5">
              {/* Event Type - Toggle Buttons */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Rodzaj wydarzenia *
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {(['city', 'corporate', 'hotel', 'festival'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`px-3 py-3 sm:px-6 sm:py-4 rounded-xl border-2 transition-all duration-300 text-xs sm:text-sm text-left font-medium ${
                        eventType === type
                          ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-white'
                          : 'border-gray-600 bg-transparent text-gray-300 hover:border-[#FFD700]/50 hover:text-white'
                      }`}
                    >
                      {type === 'city' && 'Plener Miejski'}
                      {type === 'corporate' && 'Event Firmowy'}
                      {type === 'hotel' && 'Kino Samochodowe'}
                      {type === 'festival' && 'Inne'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience Size Slider */}
              <div>
                <label className="block text-sm sm:text-base font-semibold text-white mb-2">
                  Przewidywalna liczba widzów
                </label>
                <div className="text-center mb-2 sm:mb-3">
                  <span className="text-lg sm:text-xl font-bold text-[var(--brand-gold)]">{audienceSize}</span>
                  <span className="text-white/70 ml-2">osób</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  value={audienceSize}
                  onChange={(e) => setAudienceSize(Number(e.target.value))}
                  className="slider-gold w-full"
                />
                <div className="flex justify-between text-xs text-white/60 mt-2">
                  <span>50</span>
                  <span>1000+</span>
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-sm sm:text-base font-semibold text-white mb-2">
                  Preferowany termin wydarzenia
                </label>
                <input 
                  type="date" 
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-[var(--brand-gold)] transition-all text-sm sm:text-base"
                  style={{
                    colorScheme: 'dark'
                  }}
                />
                <p className="text-xs text-white/50 mt-1">Podaj przybliżoną datę - pomożemy dostosować szczegóły</p>
              </div>

              {/* Toggle Switches for Extras */}
              <div>
                <label className="block text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
                  Dodatki
                </label>
                <div className="space-y-2">
                  {/* Toggle Switch 1 - Popcorn */}
                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-white text-sm flex items-center gap-3">
                      <span className="font-medium">Stoisko z Popcornem</span>
                    </span>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={extras.popcorn}
                        onChange={(e) => setExtras({ ...extras, popcorn: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-600 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-[var(--brand-gold)] peer-checked:to-[var(--brand-orange)] transition-all"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>

                  {/* Toggle Switch 2 - Deckchairs */}
                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-white text-sm flex items-center gap-3">
                      <span className="font-medium">Leżaki (Ilość dopasowana do widzów)</span>
                    </span>
                    <div className="relative">
                      <input 
                        type="checkbox"
                        checked={extras.deckchairs}
                        onChange={(e) => setExtras({ ...extras, deckchairs: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-600 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-[var(--brand-gold)] peer-checked:to-[var(--brand-orange)] transition-all"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>

                  {/* Toggle Switch 3 - License */}
                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-white text-sm flex items-center gap-3">
                      <span className="font-medium">Obsługa Licencyjna</span>
                    </span>
                    <div className="relative">
                      <input 
                        type="checkbox"
                        checked={extras.license}
                        onChange={(e) => setExtras({ ...extras, license: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-600 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-[var(--brand-gold)] peer-checked:to-[var(--brand-orange)] transition-all"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Side - 45% Sticky Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Podsumowanie</h3>

                {/* Rodzaj wydarzenia - duży box */}
                <div className="mb-4 p-4 bg-gradient-to-r from-[var(--brand-gold)]/20 to-[var(--brand-orange)]/20 border-2 border-[var(--brand-gold)]/30 rounded-xl text-center">
                  <p className="text-white/60 text-xs sm:text-sm mb-2 uppercase tracking-wider">Rodzaj wydarzenia</p>
                  <p className="text-white font-bold text-lg sm:text-xl">
                    {eventType ? eventLabels[eventType] : 'Nie wybrano'}
                  </p>
                </div>

                {/* Kategoria - duży box */}
                <div className="mb-4 p-4 rounded-xl text-center border-2"
                  style={{
                    background: `linear-gradient(135deg, ${
                      getCategory() === 'KAMERALNY' ? '#4D90FE' : 
                      getCategory() === 'STANDARD' ? '#FFD700' : 
                      getCategory() === 'PROFESSIONAL' ? '#FFA500' : '#FF6B6B'
                    }22, ${
                      getCategory() === 'KAMERALNY' ? '#4D90FE' : 
                      getCategory() === 'STANDARD' ? '#FFD700' : 
                      getCategory() === 'PROFESSIONAL' ? '#FFA500' : '#FF6B6B'
                    }11)`,
                    borderColor: `${
                      getCategory() === 'KAMERALNY' ? '#4D90FE' : 
                      getCategory() === 'STANDARD' ? '#FFD700' : 
                      getCategory() === 'PROFESSIONAL' ? '#FFA500' : '#FF6B6B'
                    }66`
                  }}>
                  <p className="text-white/60 text-xs sm:text-sm mb-2 uppercase tracking-wider">Kategoria</p>
                  <p className="font-bold text-xl sm:text-2xl"
                    style={{
                      color: getCategory() === 'KAMERALNY' ? '#4D90FE' : 
                             getCategory() === 'STANDARD' ? '#FFD700' : 
                             getCategory() === 'PROFESSIONAL' ? '#FFA500' : '#FF6B6B'
                    }}>
                    {getCategory()}
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    {getCategory() === 'KAMERALNY' && 'do 150 widzów'}
                    {getCategory() === 'STANDARD' && '151-500 widzów'}
                    {getCategory() === 'PROFESSIONAL' && '501-800 widzów'}
                    {getCategory() === 'MASS EVENT' && 'powyżej 800 widzów'}
                  </p>
                </div>

                {/* Pozostałe parametry */}
                <div className="space-y-2 mb-3 sm:mb-4 pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/70 text-xs sm:text-sm">Liczba widzów:</span>
                    <span className="font-semibold text-white text-xs sm:text-base">{audienceSize} osób</span>
                  </div>
                  {preferredDate && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white/70 text-xs sm:text-sm">Preferowany termin:</span>
                      <span className="font-semibold text-white text-xs sm:text-base">
                        {new Date(preferredDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>

                {(extras.popcorn || extras.deckchairs || extras.license) && (
                  <div className="mb-3 sm:mb-4 p-3 bg-white/5 rounded-xl">
                    <p className="text-xs sm:text-sm text-white/70 mb-2 sm:mb-3 font-semibold">Wybrane dodatki:</p>
                    <ul className="space-y-1 sm:space-y-2 text-white text-xs sm:text-sm">
                      {extras.popcorn && <li className="flex items-center gap-2">✓ Stoisko z Popcornem</li>}
                      {extras.deckchairs && <li className="flex items-center gap-2">✓ Leżaki (Ilość dopasowana do widzów)</li>}
                      {extras.license && <li className="flex items-center gap-2">✓ Obsługa Licencyjna</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" mx-auto mt-6 sm:mt-8 text-center">
          {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-white/10">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Twoje dane kontaktowe</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Imię *" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Nazwisko *" 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all text-sm"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="E-mail *" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all text-sm"
                />
                <input 
                  type="tel" 
                  placeholder="Telefon *" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all text-sm"
                />
                <textarea 
                  placeholder="Dodatkowe uwagi..." 
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all resize-none text-sm"
                />

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full text-base sm:text-lg py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Wysyłanie...' : 'Wyślij Zapytanie Ofertowe'}
                </button>

                <p className="text-xs text-white/50 text-center">
                  Odpowiemy w ciągu 24h roboczych
                </p>
              </form>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--brand-dark)] text-white py-6 md:py-12 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Column 1 - Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-3 md:mb-4">
                <Image 
                  src="/hangar_filmowy.svg" 
                  alt="Hangar Filmowy Logo" 
                  width={48}
                  height={48}
                  className="h-12 w-auto"
                  style={{ width: 'auto', height: 'auto' }}
                  loading="lazy"
                />
                <span className="text-lg sm:text-xl font-bold">Hangar Filmowy</span>
              </div>
              <p className="text-white/70 text-xs sm:text-sm">
                {content.footer?.slogan}
              </p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Nawigacja</h4>
              <ul className="space-y-2 text-white/70 text-xs sm:text-sm">
                <li><a href="#o-nas" className="hover:text-[var(--brand-gold)] transition">O nas</a></li>
                <li><a href="#technologia" className="hover:text-[var(--brand-gold)] transition">Technologia</a></li>
                <li><a href="#oferta" className="hover:text-[var(--brand-gold)] transition">Oferta</a></li>
                <li><a href="#kontakt" className="hover:text-[var(--brand-gold)] transition">Kontakt</a></li>
              </ul>
            </div>

            {/* Column 3 - Legal */}
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Informacje prawne</h4>
              <ul className="space-y-2 text-white/70 text-xs sm:text-sm">
                <li><Link href="/polityka-prywatnosci" className="hover:text-[var(--brand-gold)] transition">Polityka prywatności</Link></li>
                <li><Link href="/regulamin" className="hover:text-[var(--brand-gold)] transition">Regulamin</Link></li>
                <li><Link href="/polityka-cookies" className="hover:text-[var(--brand-gold)] transition">Polityka cookies</Link></li>
                <li><Link href="/kpo" className="hover:text-[var(--brand-gold)] transition">Dofinansowanie z KPO</Link></li>
              </ul>
            </div>

            {/* Column 4 - Contact */}
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Kontakt</h4>
              <ul className="space-y-2 text-white/70 text-xs sm:text-sm">
                <li>{content.footer?.email}</li>
                <li>{content.footer?.phone}</li>
                <li>{content.footer?.address}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 md:pt-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
              <p className="text-white/50 text-xs sm:text-sm">&copy; 2025 Hangar Filmowy. Wszystkie prawa zastrzeżone.</p>
              <div className="flex gap-3 text-xs text-white/50">
                <Link href="/polityka-prywatnosci" className="hover:text-[var(--brand-gold)] transition">Prywatność</Link>
                <span>•</span>
                <Link href="/regulamin" className="hover:text-[var(--brand-gold)] transition">Regulamin</Link>
                <span>•</span>
                <Link href="/polityka-cookies" className="hover:text-[var(--brand-gold)] transition">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-[var(--brand-dark)] to-[var(--brand-blue)] border-2 border-[var(--brand-gold)] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl transform animate-scaleIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Zapytanie wysłane!</h3>
              <p className="text-white/80 mb-6">
                Dziękujemy za zapytanie. Odpowiemy w ciągu 24h roboczych.<br/>
                <span className="text-[var(--brand-gold)] text-sm">(Sprawdź też folder SPAM)</span>
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="btn-primary w-full"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-[var(--brand-dark)] to-[var(--brand-blue)] border-2 border-red-500 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl transform animate-scaleIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Wystąpił błąd</h3>
              <p className="text-white/80 mb-2">
                {!eventType ? 'Proszę wybrać rodzaj wydarzenia' : 'Nie udało się wysłać zapytania. Spróbuj ponownie.'}
              </p>
              <p className="text-white/60 text-sm mb-6">
                Lub napisz bezpośrednio na:<br/>
                <a href="mailto:pokaz@hangarfilmowy.pl" className="text-[var(--brand-gold)] hover:underline">
                  pokaz@hangarfilmowy.pl
                </a>
              </p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="btn-primary w-full"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Banner */}
      <CookieBanner />
    </main>
  );
}
