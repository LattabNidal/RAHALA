import React, { useState } from 'react';
import { Sparkles, Compass, Map, Globe, ArrowRight, Hotel, Car, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { SEOHead } from '../SEOHead';

interface LandingPageProps {
  onEnterAuth: (phase: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterAuth }) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const popularDestinations = [
    { name: 'Oran', desc: 'La Radieuse - Fort Santa Cruz', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80' },
    { name: 'Alger', desc: 'La Blanche - La Casbah historique', image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Constantine', desc: 'La ville des ponts suspendus', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80' },
    { name: 'Ghardaïa', desc: 'La vallée du Mzab et son architecture', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] text-[#1a1a1a] font-sans flex flex-col justify-between" id="rahala-trivago-landing" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEOHead 
        title="RAHALA - Tourisme Algérie | Visit Algeria & Oran Travel" 
        description="Découvrez l'Algérie autrement avec Rahala, la plateforme intelligente dédiée au tourisme en Algérie. Planifiez votre séjour, réservez des hôtels et explorez Oran et d'autres destinations." 
        canonicalUrl="https://www.rahala-dz.com/" 
        noindex={false}
      />

      {/* 1. SIMPLE FLAT NAVIGATION BAR */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img 
            src="/src/assets/images/rahala_logo_1781612694384.jpg" 
            alt="RAHALA Logo" 
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
          <div>
            <span className="block text-lg font-extrabold tracking-tight text-emerald-600 font-display leading-none">
              {t('appName')}
            </span>
            <span className="block text-[8px] tracking-wider uppercase text-gray-500 font-mono font-bold mt-0.5">
              Tourisme Algérie 🇩🇿
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold tracking-wider uppercase transition cursor-pointer"
            >
              <Globe size={14} className="text-emerald-600" />
              <span className="hidden sm:inline">{languagesList.find(l => l.code === language)?.label}</span>
              <span>{languagesList.find(l => l.code === language)?.flag}</span>
            </button>
            
            {langOpen && (
              <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50 overflow-hidden`}>
                {languagesList.map((lang) => {
                  const isActive = lang.code === language;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all text-start ${
                        isActive 
                          ? 'text-emerald-600 bg-emerald-50/50 font-bold border-l-2 border-emerald-600 rtl:border-l-0 rtl:border-r-2'
                          : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
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

          {/* Quick Access Buttons */}
          <button 
            onClick={() => onEnterAuth('login')}
            className="text-xs font-bold text-gray-700 hover:text-emerald-600 px-3 py-1.5 transition cursor-pointer"
          >
            {t('seConnecter')}
          </button>
          <button 
            onClick={() => onEnterAuth('register')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
          >
            {t('commencer')}
          </button>
        </div>
      </header>

      {/* 2. TRIVAGO-INSPIRED HERO BLOCK */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 sm:py-16 flex flex-col justify-center items-center gap-10">
        
        {/* Title and Intro */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Trouvez votre séjour idéal en <span className="text-emerald-600">Algérie</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto font-sans leading-relaxed">
            {t('welcomeSubtitle')}
          </p>
          
          {/* SEO Tags */}
          <div className="text-[10px] text-emerald-600/80 font-mono uppercase tracking-widest flex flex-wrap gap-2 justify-center pt-2">
            <span className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Tourisme Algérie</span>
            <span className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Visit Algeria</span>
            <span className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Oran travel</span>
          </div>
        </div>

        {/* TRIVAGO STYLE SEARCH BAR & CTA BLOCK */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-4 sm:p-6 space-y-4 max-w-3xl">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
                <Compass size={18} />
              </span>
              <input 
                type="text"
                placeholder={language === 'ar' ? 'أين تريد الذهاب في الجزائر؟' : 'Où voulez-vous aller en Algérie ? (ex: Oran, Alger...)'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
              />
            </div>
            
            {/* Action Buttons */}
            <button 
              onClick={() => onEnterAuth('register')}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              Rechercher 🚀
            </button>
          </div>

          {/* Quick Categories list */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-gray-600 border-t border-gray-100">
            <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Prestations :</span>
            <button onClick={() => onEnterAuth('login')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition font-medium cursor-pointer">
              <Hotel size={13} className="text-emerald-600" />
              Fôtels & Hébergements
            </button>
            <button onClick={() => onEnterAuth('login')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition font-medium cursor-pointer">
              <Car size={13} className="text-emerald-600" />
              Taxis & Chauffeurs
            </button>
            <button onClick={() => onEnterAuth('login')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition font-medium cursor-pointer">
              <Sparkles size={13} className="text-emerald-600" />
              Guide IA intelligent
            </button>
          </div>
        </div>

        {/* SEO Informational Section (Clean, high contrast text) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left space-y-3 w-full max-w-3xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            {language === 'ar' ? 'اكتشف الجزائر مع رحلة' : 'Explorez le Tourisme en Algérie avec Rahala'}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-sans">
            {language === 'ar' 
              ? 'رحلة هي منصتك السياحية الذكية المخصصة لتنشيط قطاع السياحة في الجزائر (Tourisme Algérie). نسهل عليك التخطيط لرحلتك المقبلة واكتشاف معالم وهران الساحرة (Oran travel) والتمتع بأفضل تجربة سفر (Visit Algeria) مع مرشد ذكي قائم على الذكاء الاصطناعي لحجز الفنادق والسيارات والرحلات.'
              : 'Bienvenue sur Rahala, la plateforme de référence pour le Tourisme Algérie. Notre mission est de vous faire vivre une expérience unique lors de votre voyage en Algérie (Visit Algeria). Que vous planifiez un voyage à Oran (Oran travel), cherchiez des hébergements de charme ou souhaitiez explorer la richesse culturelle algérienne, notre guide intelligent propulsé par l\'IA vous accompagne à chaque étape.'
            }
          </p>
        </div>

        {/* POPULAR DESTINATIONS GRID (Clean like Trivago) */}
        <div className="w-full space-y-4">
          <h2 className="text-lg font-bold text-gray-900 text-left">Destinations populaires en Algérie :</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDestinations.map((dest) => (
              <div 
                key={dest.name} 
                onClick={() => onEnterAuth('login')}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer group"
              >
                <div className="h-32 overflow-hidden relative">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute bottom-2 left-2 text-white font-bold text-sm tracking-wide">{dest.name}</span>
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">{dest.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 3. SIMPLIFIED FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-[10.5px] text-gray-500 font-mono tracking-wider">
        🇩🇿 RAHALA ECOSYSTEM — {t('tagline').toUpperCase()}
      </footer>
    </div>
  );
};
