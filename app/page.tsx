'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';
import { ChevronDown, Sparkles, Users, Film, Star } from 'lucide-react';

type EventType = 'city' | 'corporate' | 'hotel' | 'festival' | null;

export default function Home() {
  const [content, setContent] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [eventType, setEventType] = useState<EventType>(null);
  const [audienceSize, setAudienceSize] = useState(250);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
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

  const eventLabels: Record<Exclude<EventType, null>, string> = {
    city: 'Plener Miejski',
    corporate: 'Event Firmowy',
    hotel: 'Kino Samochodowe',
    festival: 'Inne'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventType) {
      alert('Proszę wybrać rodzaj wydarzenia');
      return;
    }

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
          formData
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
      <Navbar />
      
      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/kino.png)',
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {content.hero?.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)]">
                {content.hero?.titleGradient}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-2xl mx-auto">
              {content.hero?.subtitle}
            </p>
            
            <p className="text-lg text-white/60 mb-12 max-w-xl mx-auto">
              {content.hero?.lead}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#kontakt"
                className="px-8 py-4 bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)] text-black font-bold rounded-lg hover:scale-105 transition-transform duration-300"
              >
                {content.hero?.ctaPrimary}
              </a>
              <a
                href="#oferta"
                className="px-8 py-4 border-2 border-[var(--brand-gold)] text-[var(--brand-gold)] font-bold rounded-lg hover:bg-[var(--brand-gold)]/10 transition-colors duration-300"
              >
                {content.hero?.ctaSecondary}
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
              <Users className="w-10 h-10 text-[var(--brand-gold)] mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">50-1000+</div>
              <div className="text-white/60">Widzów</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Film className="w-10 h-10 text-[var(--brand-gold)] mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">LED 4K</div>
              <div className="text-white/60">Jakość obrazu</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Star className="w-10 h-10 text-[var(--brand-gold)] mx-auto mb-3" />
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

      {/* O Nas Section */}
      <section id="o-nas" className="section-padding bg-gradient-to-b from-[var(--brand-dark)] to-[var(--brand-blue)]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <ScrollReveal>
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold leading-normal">
                  <span className="text-white">Wychodzimy z cienia.</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)]">
                    Wnosimy kino plenerowe na nowy poziom.
                  </span>
                </h2>
                
                <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                  <p>
                    Przez lata kino plenerowe kojarzyło się z jednym: czekaniem na zmrok, walką z wiatrem 
                    falującym ekranem i kompromisami w jakości obrazu. Hangar Filmowy zmienia te zasady gry.
                  </p>
                  <p>
                    Jesteśmy zespołem pasjonatów kina i ekspertów od eventów. Nasza obietnica jest prosta: 
                    dostarczamy wrażenia kinowe (dosłownie!) w dowolnym miejscu w Polsce. Nie uznajemy półśrodków. 
                    Nasze ekrany świecą jasno, dźwięk wbija w fotel, a obsługa licencyjna zdejmuje Ci z głowy 
                    wszystkie formalności. Tworzymy wydarzenia, o których mieszkańcy rozmawiają miesiącami.
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <span className="text-white/80 text-sm font-bold">EXIP</span>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <span className="text-white/80 text-sm font-bold">HF</span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">
                    Zaufali nam organizatorzy<br />z całej Polski
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
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden z-10">
                    <img 
                      src="/plan_filmowy.png" 
                      alt="Plan filmowy Hangar Filmowy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Dlaczego My Section */}
      <section id="technologia" className="section-padding bg-gradient-to-b from-[var(--brand-blue)] to-[var(--brand-dark)]">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="text-white">{content["why-us"]?.title} </span><br />
              
            </h2>
            <p className="text-white/70 text-center mb-16 max-w-3xl mx-auto">
              Przesuń suwak, aby zobaczyć różnicę między tradycyjnym projektorem a naszą technologią LED.
            </p>
          </ScrollReveal>

          {/* Comparison Image */}
          <ScrollReveal delay={0.1}>
            <div className="max-w-4xl mx-auto mb-16">
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
                  <img 
                    src="/dlaczego-ekran-led.png" 
                    alt="Porównanie rzutnika i ekranu LED"
                    className="absolute inset-0 w-full h-full object-cover"
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
                    <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-lg">
                      <span className="text-white font-semibold text-sm">TRADYCYJNY RZUTNIK</span>
                    </div>
                  </div>
                  
                  {/* Right label wrapper - clips entire right area */}
                  <div 
                    className="absolute inset-0 z-10"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                  >
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)] px-4 py-2 rounded-lg">
                      <span className="text-black font-semibold text-sm">HANGAR FILMOWY LED</span>
                    </div>
                  </div>
                
                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--brand-gold)] to-[var(--brand-orange)] z-20 transition-opacity duration-200"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-gold)] to-[var(--brand-orange)] flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </div>
                </div>
              </div>
              <p className="text-center text-white/50 mt-4 text-sm">Przesuń suwak</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Box 1 - Sun Icon */}
            <ScrollReveal delay={0.1}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '40px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10"
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%'
                }}
              >
                <svg className="text-white" style={{ width: '32px', height: '32px' }} fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 2v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                {content["why-us"]?.boxes?.[0]?.title}
              </h3>
              <p className="text-white/80 text-sm text-center">
                {content["why-us"]?.boxes?.[0]?.description}
              </p>
            </div>
            </ScrollReveal>

            {/* Box 2 - Cloud Rain Icon */}
            <ScrollReveal delay={0.2}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '40px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10"
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%'
                }}
              >
                <svg className="text-white" style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 19v2m4-2v2m4-2v2" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                {content["why-us"]?.boxes?.[1]?.title}
              </h3>
              <p className="text-white/80 text-sm text-center">
                {content["why-us"]?.boxes?.[1]?.description}
              </p>
            </div>
            </ScrollReveal>

            {/* Box 3 - Speaker Icon */}
            <ScrollReveal delay={0.3}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '40px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10"
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%'
                }}
              >
                <svg className="text-white" style={{ width: '32px', height: '32px' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                {content["why-us"]?.boxes?.[2]?.title}
              </h3>
              <p className="text-white/80 text-sm text-center">
                {content["why-us"]?.boxes?.[2]?.description}
              </p>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Oferta Section */}
      <section id="oferta" className="section-padding bg-[var(--brand-dark)]">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="text-white">Od licencji po </span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)]">
                {content.offer?.title}
              </span>
            </h2>
            <p className="text-white/70 text-center mb-16 max-w-3xl mx-auto">
              Kompleksowa obsługa Twojego eventu.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8  mx-auto">
            {/* Card 1 - Technika Kinowa */}
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
                <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[400px] z-10">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={content.offer?.cards?.[0]?.imageUrl}
                    alt={content.offer?.cards?.[0]?.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8">
                  <div className="w-12 h-12 rounded-lg  flex items-center justify-center mb-4">
                    <img 
                      src="/image-kino.png" 
                      alt="Technika Kinowa"
                      style={{ width: '32px', height: '32px', filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{content.offer?.cards?.[0]?.title}</h3>
                  <p className="text-white/90 text-sm">
                    {content.offer?.cards?.[0]?.description}
                  </p>
                </div>
              </div>
              </div>
            </ScrollReveal>

            {/* Card 2 - Licencje */}
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
                <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[400px] z-10">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={content.offer?.cards?.[1]?.imageUrl}
                    alt={content.offer?.cards?.[1]?.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8">
                  <div className="w-12 h-12 rounded-lg  flex items-center justify-center mb-4">
                    <img 
                      src="/image-licenc.png" 
                      alt="Licencje"
                      style={{ width: '32px', height: '32px', filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{content.offer?.cards?.[1]?.title}</h3>
                  <p className="text-white/90 text-sm">
                    {content.offer?.cards?.[1]?.description}
                  </p>
                </div>
              </div>
              </div>
            </ScrollReveal>

            {/* Card 3 - Strefa Widza */}
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
                
                <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[400px] z-10">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="/strefa-widza.png" 
                    alt="Strefa Widza"
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8">
                  <div className="w-12 h-12 rounded-lg  flex items-center justify-center mb-4">
                    <img 
                      src="/image-armchair.png" 
                      alt="Strefa Widza"
                      style={{ width: '32px', height: '32px', filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Strefa Widza</h3>
                  <p className="text-white/90 text-sm">
                    Wygodne leżaki i nastrojowe oświetlenie, tworzące magię kina letniego.
                  </p>
                </div>
              </div>
              </div>
            </ScrollReveal>

            {/* Card 4 - Popcorn Bar */}
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
                <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[400px] z-10">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="/popcorn-bar.png" 
                    alt="Popcorn Bar"
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8">
                  <div className="w-12 h-12 rounded-lg  flex items-center justify-center mb-4">
                    <img 
                      src="/image-food.png" 
                      alt="Popcorn Bar"
                      style={{ width: '32px', height: '32px', filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Popcorn Bar</h3>
                  <p className="text-white/90 text-sm">
                    Profesjonalnie maszyny i obsługa. Świeży, ciepły popcorn, napoje, cukierki – 
                    jak w multiplepie, tylko lepiej.
                  </p>
                </div>
              </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Dla Kogo Subsection */}
          <ScrollReveal delay={0.5}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 mt-24">
              {content['for-who']?.title}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {/* Target 1 - Samorządy */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '40px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10"
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%'
                }}
              >
                <img 
                  src="/image-office.png" 
                  alt="Samorządy i Miasta"
                  style={{ width: '32px', height: '32px', filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Samorządy i Miasta
              </h3>
              <p className="text-white/80 text-sm text-center">
                Kino w parku, festiwal miejski, piknik rodzinny – zbuduj kapitał społeczny i pokaż, 
                że Twoje miasto żyje kulturą.
              </p>
            </div>

            {/* Target 2 - Hotele */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '40px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10"
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%'
                }}
              >
                <img 
                  src="/image-hotels.png" 
                  alt="Hotele i Resorty"
                  style={{ width: '32px', height: '32px', filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Hotele i Resorty
              </h3>
              <p className="text-white/80 text-sm text-center">
                Zaproponuj gościom wieczór filmowy w ogrodzie. Unikalne doświadczenie, które wyróżni 
                Twoją ofertę i wygeneruje pozytywne recenzje.
              </p>
            </div>

            {/* Target 3 - Firmy */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '40px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10"
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%'
                }}
              >
                <img 
                  src="/image-firm.png" 
                  alt="Firmy i Korporacje"
                  style={{ width: '32px', height: '32px', filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Firmy i Korporacje
              </h3>
              <p className="text-white/80 text-sm text-center">
                Integracja? Urodziny firmy? Prezentacja produktu? Zorganizuj kino na zamkniętym 
                evencie – niezapomniane team-buildingowe doświadczenie.
              </p>
            </div>

            {/* Target 4 - Festiwale */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/10 transition-all duration-300 flex flex-col h-full" style={{ padding: '40px', borderRadius: '20px' }}>
              <div 
                className="flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 bg-white/10"
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%'
                }}
              >
                <img 
                  src="/image-festival.png" 
                  alt="Festiwale i Eventy"
                  style={{ width: '32px', height: '32px', filter: 'brightness(0) saturate(100%) invert(77%) sepia(45%) saturate(1558%) hue-rotate(356deg) brightness(104%) contrast(106%)' }}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Festiwale i Eventy
              </h3>
              <p className="text-white/80 text-sm text-center">
                Festiwal muzyczny, food truck event, targi – dodaj kinową strefę, która przyciągnie 
                tłumy i stworzy wiralowe momenty w social mediach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proces Section */}
      <section id="proces" className="section-padding bg-gradient-to-b from-[var(--brand-blue)] to-[var(--brand-dark)]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {content.process?.title}
          </h2>
          <p className="text-white/70 text-center mb-16 max-w-3xl mx-auto">
            Od zapytania do seansu – wszystko maksymalnie proste.
          </p>

          <div className="mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105">
                <div 
                  className="rounded-full flex items-center justify-center font-bold text-white mx-auto mb-6 transition-all duration-500 hover-step-circle"
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    fontSize: '40px',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  1
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 transition-all duration-300 group-hover:text-[var(--brand-gold)]">Ustalamy Termin & Wizję</h3>
                <p className="text-white/80 text-sm transition-all duration-300 group-hover:text-white">
                  Dzwonisz/piszesz. Rozmawiamy o dacie, miejscu, rodzaju eventu i Twoich oczekiwaniach.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105">
                <div 
                  className="rounded-full flex items-center justify-center font-bold text-white mx-auto mb-6 transition-all duration-500 hover-step-circle"
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    fontSize: '40px',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  2
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 transition-all duration-300 group-hover:text-[var(--brand-gold)]">Wybieramy Repertuar</h3>
                <p className="text-white/80 text-sm transition-all duration-300 group-hover:text-white">
                  Podpowiadamy filmy dopasowane do grupy docelowej. Ty wybierasz – my załatwiamy licencje.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105">
                <div 
                  className="rounded-full flex items-center justify-center font-bold text-white mx-auto mb-6 transition-all duration-500 hover-step-circle"
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    fontSize: '40px',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  3
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 transition-all duration-300 group-hover:text-[var(--brand-gold)]">Przygotowanie Przestrzeni</h3>
                <p className="text-white/80 text-sm transition-all duration-300 group-hover:text-white">
                  Przyjeżdżamy z wyprzedzeniem, montujemy ekran, nagłośnienie, strefę widowni.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105">
                <div 
                  className="rounded-full flex items-center justify-center font-bold text-white mx-auto mb-6 transition-all duration-500 hover-step-circle"
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    fontSize: '40px',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  4
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 transition-all duration-300 group-hover:text-[var(--brand-gold)]">Showtime!</h3>
                <p className="text-white/80 text-sm transition-all duration-300 group-hover:text-white">
                  Twoi goście wchodzą, siadają, zapachy popcornu unoszą się w powietrzu – KINO się zaczyna!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt Section - Konfigurator */}
      <section id="kontakt" className="section-padding bg-[var(--brand-dark)]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="text-white">{content.contact?.title}</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-orange)]">
                {content.contact?.titleGradient}
              </span>
          </h2>
          <p className="text-white/70 text-center mb-16 max-w-3xl mx-auto">
            {content.contact?.subtitle}
          </p>

          <div className=" mx-auto grid lg:grid-cols-[55fr_45fr] gap-6">
            {/* Left Side - 55% */}
            <div className="space-y-5">
              {/* Event Type - Toggle Buttons */}
              <div>
                <label className="block text-base font-semibold text-white mb-3">
                  Rodzaj wydarzenia *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(['city', 'corporate', 'hotel', 'festival'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 text-sm text-left font-medium ${
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
                <label className="block text-base font-semibold text-white mb-2">
                  Przewidywalna liczba widzów
                </label>
                <div className="text-center mb-3">
                  <span className="text-xl font-bold text-[var(--brand-gold)]">{audienceSize}</span>
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

              {/* Toggle Switches for Extras */}
              <div>
                <label className="block text-base font-semibold text-white mb-3">
                  Dodatki
                </label>
                <div className="space-y-1">
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
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <h3 className="text-xl font-bold text-white mb-4">Podsumowanie</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/70">Technologia:</span>
                    <span className="font-semibold text-white text-right">
                      Ekran LED Premium<br />
                      
                    <span className="text-sm text-yellow-400 text-right">w zestawie</span>
                    </span>
                  </div><div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Rodzaj wydarzenia:</span>
                    <span className="font-semibold text-white text-right">
                      {eventType ? eventLabels[eventType] : 'Nie wybrano'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Liczba widzów:</span>
                    <span className="font-semibold text-white">{audienceSize} osób</span>
                  </div>
                </div>

                {(extras.popcorn || extras.deckchairs || extras.license) && (
                  <div className="mb-4 p-3 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/70 mb-3 font-semibold">Wybrane dodatki:</p>
                    <ul className="space-y-2 text-white">
                      {extras.popcorn && <li className="flex items-center gap-2">✓ Stoisko z Popcornem</li>}
                      {extras.deckchairs && <li className="flex items-center gap-2">✓ Leżaki (Ilość dopasowana do widzów)</li>}
                      {extras.license && <li className="flex items-center gap-2">✓ Obsługa Licencyjna</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" mx-auto mt-8 text-center">
          {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">Twoje dane kontaktowe</h3>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Imię *" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all"
                  />
                  <input 
                    type="text" 
                    placeholder="Nazwisko *" 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="E-mail *" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all"
                />
                <input 
                  type="tel" 
                  placeholder="Telefon *" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all"
                />
                <textarea 
                  placeholder="Dodatkowe uwagi..." 
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all resize-none"
                />

                <button type="submit" className="btn-primary w-full text-lg">
                  Wyślij Zapytanie Ofertowe
                </button>

                <p className="text-xs text-white/50 text-center">
                  Odpowiemy w ciągu 24h roboczych
                </p>
              </form>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--brand-dark)] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Column 1 - Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
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
                <li><a href="#o-nas" className="hover:text-[var(--brand-gold)] transition">O nas</a></li>
                <li><a href="#technologia" className="hover:text-[var(--brand-gold)] transition">Technologia</a></li>
                <li><a href="#oferta" className="hover:text-[var(--brand-gold)] transition">Oferta</a></li>
                <li><a href="#kontakt" className="hover:text-[var(--brand-gold)] transition">Kontakt</a></li>
              </ul>
            </div>

            {/* Column 3 - Contact */}
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>pokaz@hangarfilmowy.pl</li>
                <li>+48 XXX XXX XXX</li>
                <li>Polska (zasięg ogólnopolski)</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-white/50 text-sm">
            <p>&copy; 2026 Hangar Filmowy. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
