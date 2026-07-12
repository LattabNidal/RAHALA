import React, { useState } from 'react';
import { Sparkles, Compass, Map, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface LandingPageProps {
  onEnterAuth: (phase: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterAuth }) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans select-none" id="rahla-immersive-landing-view" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 0. FLOATING HIGH-CONTRAST LANGUAGE CHANGER SELECTOR */}
      <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-50 flex items-center gap-2`}>
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 text-white hover:text-[#d4af37] border border-white/10 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-xl cursor-pointer"
          >
            <Globe size={14} className="text-[#d4af37]" />
            <span>{languagesList.find(l => l.code === language)?.label}</span>
            <span className="text-sm">{languagesList.find(l => l.code === language)?.flag}</span>
          </button>
          
          {langOpen && (
            <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-40 bg-slate-950/95 border border-white/20 rounded-xl shadow-2xl py-1 z-50 overflow-hidden backdrop-blur-md`}>
              {languagesList.map((lang) => {
                const isActive = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all text-start ${
                      isActive 
                        ? 'text-[#d4af37] bg-white/10 font-bold border-l-2 border-[#d4af37] rtl:border-l-0 rtl:border-r-2'
                        : 'text-slate-350 hover:text-[#d4af37] hover:bg-white/5'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-sm">{lang.flag}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 1. IMMERSIVE FULL-SCREEN BACKGROUND IMAGE (Algerian dunes & landmarks vibe) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80" 
          alt="Algerian golden Sahara desert"
          className="w-full h-full object-cover transition-transform duration-1000 scale-100"
        />
        {/* Dark radial and vertical gradient to guarantee contrast & elegant cinematic look */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-slate-900/40 to-slate-950/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(15,23,42,0.95)_100%)]"></div>
      </div>

      {/* 2. MAIN LOGO & CALL TO ACTION CARD (GLASSMORPHISM CARD) */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-950/45 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl shadow-black/80 text-center animate-fade-in space-y-8">
        
        {/* GLOWING CENTERED LOGO */}
        <div className="relative inline-block group">
          {/* Neon animated rings using Algerian flag gradient (emerald white red) and gold */}
          <div className="absolute -inset-3 bg-gradient-to-r from-emerald-600 via-amber-400 to-red-650 rounded-full blur-xl opacity-80 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-[#d4af37] to-red-500 rounded-full opacity-90 group-hover:scale-105 transition duration-500"></div>
          
          {/* Logo container mask */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-[3px] border-white shadow-2xl">
            <img 
              src="/src/assets/images/rahala_logo_1781612694384.jpg" 
              alt="Logo RAHALA" 
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />
          </div>

          {/* Slogan pills floating directly on the logo border */}
          <div className="absolute -bottom-1 -left-3 bg-emerald-600 text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-450 shadow-xl">
             {language === 'ar' ? 'الجزائر 🇩🇿' : 'Algérie'}
          </div>
          <div className="absolute -top-1 -right-3 bg-red-600 text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-450 shadow-xl">
             {language === 'ar' ? 'تفاعل 3D' : (language === 'es' ? 'Immersivo 3D' : 'Immersif 3D')}
          </div>
        </div>

        {/* TITLE & SLOGAN ACCORDING TO USER'S LITERAL REQUEST */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400">
            {t('appName')}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-serif font-black italic tracking-wide text-white leading-tight">
            {t('tagline')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-350 leading-relaxed max-w-md mx-auto">
            {t('welcomeSubtitle')}
          </p>
        </div>

        {/* DECORATIVE FEATURES LIST */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
          <div className="space-y-1 text-center">
            <div className="mx-auto w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Sparkles size={16} />
            </div>
            <span className="block text-[9px] uppercase font-mono tracking-wider text-slate-400">
              {language === 'ar' ? 'مساعد ذكي' : (language === 'es' ? 'Asistente IA' : 'IA Assistant')}
            </span>
          </div>
          <div className="space-y-1 text-center">
            <div className="mx-auto w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Compass size={16} />
            </div>
            <span className="block text-[9px] uppercase font-mono tracking-wider text-slate-400">
              {language === 'ar' ? 'مستكشف ثلاثي الأبعاد' : (language === 'es' ? 'Explorador 3D' : '3D Explorer')}
            </span>
          </div>
          <div className="space-y-1 text-center">
            <div className="mx-auto w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-005/70">
              <Map size={16} />
            </div>
            <span className="block text-[9px] uppercase font-mono tracking-wider text-slate-400">
              {language === 'ar' ? 'طرق آمنة' : (language === 'es' ? 'Ruta Segura' : 'Safe Route')}
            </span>
          </div>
        </div>

        {/* DYNAMIC ACTION BUTTONS COINCIDING WITH USER'S LABELS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          
          {/* Commencer */}
          <button 
            onClick={() => onEnterAuth('register')}
            className="w-full sm:w-1/2 py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-mono font-bold text-xs uppercase tracking-widest border border-emerald-500 hover:border-emerald-450 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 cursor-pointer transition flex items-center justify-center gap-2"
          >
            {t('commencer')} 🚀
            <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
          </button>

          {/* Se connecter */}
          <button 
            onClick={() => onEnterAuth('login')}
            className="w-full sm:w-1/2 py-4 px-6 bg-slate-900/80 hover:bg-slate-800 hover:text-white text-slate-200 font-mono font-bold text-xs uppercase tracking-widest border border-slate-700/30 rounded-xl hover:shadow-lg active:scale-95 cursor-pointer transition flex items-center justify-center gap-2"
          >
            {t('seConnecter')} 🔑
          </button>

        </div>

      </div>

      {/* FOOTER METADATA AND ACCENT */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] text-slate-450 font-mono tracking-wider">
         🇩🇿 RAHLA ECOSYSTEM — {t('tagline').toUpperCase()}
      </div>

    </div>
  );
};
