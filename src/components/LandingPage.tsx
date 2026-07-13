import React, { useState } from 'react';
import { Sparkles, Compass, Map, Globe, ArrowRight, Hotel, Car, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'stays' | 'taxis' | 'guide'>('stays');

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const popularDestinations = [
    { name: 'Oran', desc: 'La Radieuse - Fort Santa Cruz & Front de mer', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80', rating: '4.9' },
    { name: 'Alger', desc: 'La Blanche - Casbah historique & Jardin d\'Essai', image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=600&q=80', rating: '4.8' },
    { name: 'Constantine', desc: 'La ville des ponts suspendus millénaires', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80', rating: '4.9' },
    { name: 'Ghardaïa', desc: 'La vallée mystique du Mzab & architecture unique', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80', rating: '4.7' }
  ];

  const whyChooseUs = [
    {
      title: language === 'ar' ? 'توأمة رقمية ثلاثية الأبعاد' : language === 'fr' ? 'Jumeau Numérique 3D' : '3D Digital Twin',
      desc: language === 'ar' ? 'استكشف المعالم الأثرية والمواقع التاريخية بجولات افتراضية غامرة.' : language === 'fr' ? 'Visitez virtuellement les monuments historiques avant de vous y rendre.' : 'Immerse yourself inside high fidelity simulated 3D panoramas before visiting.',
      icon: <Compass className="text-emerald-600" size={20} />
    },
    {
      title: language === 'ar' ? 'مرشد ذكي قائم على الذكاء الاصطناعي' : language === 'fr' ? 'Guide IA local intelligent' : 'Intelligent AI Guide',
      desc: language === 'ar' ? 'مساعدك الشخصي المدعوم بـ Gemini لتقديم النصائح وتسهيل سفرك.' : language === 'fr' ? 'Votre compagnon de voyage intelligent alimenté par Gemini pour vous guider.' : 'Your personal travel companion structured on Gemini 3.5 for local tips.',
      icon: <Sparkles className="text-emerald-600" size={20} />
    },
    {
      title: language === 'ar' ? 'سفر آمن وموثوق' : language === 'fr' ? 'Voyage Sûr & Tarifs Transparent' : 'Safe & Transparent Travel',
      desc: language === 'ar' ? 'تحقق من الأسعار الحقيقية وتجنب التعرض للمغالاة مع محول العملات للضيوف.' : language === 'fr' ? 'Comparez les prix réels des hôtels et taxis pour un séjour en toute sécurité.' : 'Verify real prices and exchange rates dynamically with our tourist portal.',
      icon: <Shield className="text-emerald-600" size={20} />
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#fafafc] text-[#1a1a1a] font-sans flex flex-col justify-between" id="rahala-luxury-landing" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEOHead 
        title="RAHALA - Plateforme Touristique Intelligente | Visit Algeria" 
        description="Découvrez l'Algérie autrement avec Rahala, la plateforme intelligente dédiée au tourisme en Algérie. Planifiez votre séjour, réservez des hôtels et explorez Oran et d'autres destinations." 
        canonicalUrl="https://www.rahala-dz.com/" 
        noindex={false}
      />

      {/* 1. PREMIUM HEADER BAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src="/src/assets/images/rahala_logo_1781612694384.jpg" 
            alt="RAHALA Logo" 
            className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-xs"
          />
          <div>
            <span className="block text-xl font-black tracking-tight text-emerald-600 font-display leading-none">
              {t('appName')}
            </span>
            <span className="block text-[8px] tracking-wider uppercase text-gray-400 font-mono font-bold mt-1">
              Tourisme Algérie 🇩🇿
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold uppercase transition duration-150 cursor-pointer"
            >
              <Globe size={14} className="text-emerald-600" />
              <span className="hidden sm:inline">{languagesList.find(l => l.code === language)?.label}</span>
              <span>{languagesList.find(l => l.code === language)?.flag}</span>
            </button>
            
            {langOpen && (
              <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden`}>
                {languagesList.map((lang) => {
                  const isActive = lang.code === language;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-start ${
                        isActive 
                          ? 'text-emerald-600 bg-emerald-50/50 font-extrabold border-l-2 border-emerald-600 rtl:border-l-0 rtl:border-r-2'
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

          {/* Action buttons */}
          <button 
            onClick={() => onEnterAuth('login')}
            className="text-xs font-bold text-gray-700 hover:text-emerald-600 px-3 py-1.5 transition cursor-pointer"
          >
            {t('seConnecter')}
          </button>
          <button 
            onClick={() => onEnterAuth('register')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs hover:shadow-md cursor-pointer"
          >
            {t('commencer')}
          </button>
        </div>
      </header>

      {/* 2. MAIN HERO SECTION */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-14 flex flex-col gap-12 sm:gap-16">
        
        {/* Slogan Intro */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
            <Sparkles size={11} className="animate-pulse" />
            {language === 'ar' ? 'الجيل القادم من السياحة الذكية' : language === 'fr' ? 'La nouvelle ère du tourisme intelligent' : 'The New Era of Intelligent Tourism'}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-950 leading-tight">
            {language === 'ar' ? 'اكتشف سحر وجاذبية' : 'Découvrez le charme de l\''}<span className="text-emerald-600">{language === 'ar' ? ' الجزائر' : 'Algérie'}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto font-sans leading-relaxed">
            {t('welcomeSubtitle')}
          </p>
          
          {/* SEO Tags */}
          <div className="text-[10px] text-emerald-600/80 font-mono uppercase tracking-widest flex flex-wrap gap-2 justify-center pt-1">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200/60 shadow-xs">🇩🇿 Tourisme Algérie</span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200/60 shadow-xs">✨ Visit Algeria</span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200/60 shadow-xs">📍 Oran Travel Guide</span>
          </div>
        </div>

        {/* TRIVAGO/AIRBNB HYBRID LUXURY SEARCH CARD */}
        <div className="w-full bg-white border border-gray-100 rounded-3xl shadow-xl p-5 sm:p-7 space-y-5 max-w-3xl mx-auto relative overflow-hidden">
          
          {/* Booking / Taxi / Guide Category tabs */}
          <div className="flex border-b border-gray-100 pb-3 gap-6 text-xs sm:text-sm">
            <button 
              onClick={() => setActiveTab('stays')}
              className={`flex items-center gap-1.5 pb-2 font-bold cursor-pointer transition border-b-2 ${
                activeTab === 'stays' ? 'text-emerald-600 border-emerald-600' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              <Hotel size={15} />
              {language === 'ar' ? 'الفنادق والإقامة' : 'Hôtels & Hébergements'}
            </button>
            <button 
              onClick={() => setActiveTab('taxis')}
              className={`flex items-center gap-1.5 pb-2 font-bold cursor-pointer transition border-b-2 ${
                activeTab === 'taxis' ? 'text-emerald-600 border-emerald-600' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              <Car size={15} />
              {language === 'ar' ? 'حجز تاكسي وسائق' : 'Taxis & Chauffeurs'}
            </button>
            <button 
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 pb-2 font-bold cursor-pointer transition border-b-2 ${
                activeTab === 'guide' ? 'text-emerald-600 border-emerald-600' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              <Sparkles size={15} />
              {language === 'ar' ? 'المرشد الذكي بالذكاء الاصطناعي' : 'Guide IA Local'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
                <Compass size={18} />
              </span>
              <input 
                type="text"
                placeholder={
                  activeTab === 'stays'
                    ? (language === 'ar' ? 'أين تريد الإقامة في الجزائر؟ (مثال: وهران، الجزائر...)' : 'Où voulez-vous séjourner en Algérie ? (ex: Oran, Alger...)')
                    : activeTab === 'taxis'
                    ? (language === 'ar' ? 'أدخل نقطة الانطلاق والوصول...' : 'Où voulez-vous aller en taxi ? (ex: Aéroport d\'Oran, Casbah...)')
                    : (language === 'ar' ? 'ماذا تريد أن تعرف عن الجزائر؟' : 'Que voulez-vous savoir sur l\'Algérie ? (ex: Prix, spécialités...)')
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-gray-800"
              />
            </div>
            
            {/* Action Buttons */}
            <button 
              onClick={() => onEnterAuth('register')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition duration-150 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{language === 'ar' ? 'ابحث الآن' : 'Rechercher'}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Quick tips label */}
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <span className="font-bold text-emerald-600 uppercase tracking-wider">Note:</span>
            <span>
              {language === 'ar' 
                ? 'استمتع بالوصول الفوري إلى ميزة الجولات الافتراضية ثلاثية الأبعاد والتنبؤ الذكي بالأسعار بعد التسجيل.'
                : 'Inscrivez-vous gratuitement pour débloquer les jumeaux numériques 3D et le simulateur de prix de séjour.'}
            </span>
          </p>
        </div>

        {/* 3. CORE BENEFITS GRID */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-900">
              {language === 'ar' ? 'لماذا تختار رحالة؟' : 'Pourquoi voyager avec RAHALA ?'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'منصة ذكية متكاملة مصممة خصيصاً للزوار والسياح' : 'Une technologie exclusive conçue pour un séjour serein et immersif.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition duration-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-950 mb-1.5">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. POPULAR DESTINATIONS GRID */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                {language === 'ar' ? 'الوجهات الأكثر شعبية' : 'Destinations populaires en Algérie'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {language === 'ar' ? 'الوجهات المفضلة التي يوصي بها خبراؤنا هذا الموسم' : 'Les joyaux incontournables recommandés pour votre prochain voyage.'}
              </p>
            </div>
            <button 
              onClick={() => onEnterAuth('login')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'Tout voir'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {popularDestinations.map((dest) => (
              <div 
                key={dest.name} 
                onClick={() => onEnterAuth('login')}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-350 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span className="absolute bottom-3 left-3 text-white font-extrabold text-lg tracking-wide">{dest.name}</span>
                    <span className="absolute top-3 right-3 bg-white/95 text-gray-950 font-bold text-[10px] px-2 py-0.5 rounded-lg border border-gray-100 flex items-center gap-0.5 shadow-sm">
                      ★ {dest.rating}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 font-medium leading-relaxed font-sans">{dest.desc}</p>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-gray-50 mt-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{language === 'ar' ? 'استكشف الآن' : 'Explorer'}</span>
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition duration-200">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. DYNAMIC INFO CARD */}
        <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <Compass size={320} className="text-emerald-400" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Soutenu par l'Intelligence Artificielle
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {language === 'ar' ? 'احصل على تجربة سياحية فريدة تناسب ميزانيتك' : 'Une expérience personnalisée selon votre budget et vos envies'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-350 leading-relaxed font-sans">
              {language === 'ar' 
                ? 'رحالة ليست مجرد منصة حجز عادية. بفضل محاكي الأسعار بالدينار الجزائري، ومحول العملات الفوري، والذكاء الاصطناعي، يمكنك التخطيط لرحلتك المقبلة بثقة كاملة وتجنب التعرض للمغالاة والأسعار العشوائية.'
                : 'RAHALA n\'est pas un site de voyage traditionnel. Grâce à notre simulateur de Dinar Algérien (DZD), nos guides d\'exploration 3D et notre assistant IA connecté en direct, vous pouvez voyager à travers l\'Algérie en toute confiance, comme un local.'
              }
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button 
                onClick={() => onEnterAuth('register')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                {t('commencer')}
              </button>
              <button 
                onClick={() => onEnterAuth('login')}
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                {t('seConnecter')}
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* 6. FOOTER */}
      <footer className="bg-white border-t border-gray-150 py-8 text-center text-xs text-gray-500 font-mono tracking-wider space-y-2 mt-12">
        <div className="flex justify-center items-center gap-1">
          <span>🇩🇿</span>
          <span className="font-extrabold text-emerald-600">{t('appName')}</span>
          <span>— {t('tagline').toUpperCase()}</span>
        </div>
        <p className="text-[10px] text-gray-400 font-sans">
          &copy; {new Date().getFullYear()} Rahala Inc. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
        </p>
      </footer>
    </div>
  );
};
