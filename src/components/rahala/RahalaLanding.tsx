import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Map, 
  Globe, 
  Hotel, 
  Car, 
  Shield, 
  CheckCircle, 
  Users, 
  Calendar,
  Lock,
  ArrowRight,
  Eye,
  Star
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';

interface RahalaLandingProps {
  onEnterAuth: (phase: 'login' | 'register') => void;
}

const RahalaLanding: React.FC<RahalaLandingProps> = ({ onEnterAuth }) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const featuredSpots = [
    {
      name: 'Tassili n\'Ajjer',
      region: 'Djanet • Sahara',
      bullets: {
        en: ['Mystical lunar stone forest', 'Ancient rock art paintings'],
        fr: ['Forêt de pierre mystique', 'Art rupestre préhistorique'],
        ar: ['غابة حجرية ساحرة', 'نقوش ورسومات ما قبل التاريخ'],
        es: ['Místico bosque de piedra', 'Arte rupestre milenario']
      },
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
      badge: 'UNESCO Heritage'
    },
    {
      name: 'La Casbah d\'Alger',
      region: 'Alger la Blanche',
      bullets: {
        en: ['Secret Ottoman courtyards', 'Overlooking the deep blue sea'],
        fr: ['Palais ottomans authentiques', 'Vue imprenable sur la mer'],
        ar: ['قصور عثمانية عتيقة', 'إطلالة ساحرة على البحر الأزرق'],
        es: ['Patios otomanos secretos', 'Vista espectacular al mar azul']
      },
      image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=1000&q=80',
      badge: 'Ancient Citadel'
    },
    {
      name: 'Constantine',
      region: 'City of Bridges',
      bullets: {
        en: ['Suspended canyon wonders', 'Soaring millennium bridges'],
        fr: ['Gorges rocheuses majestueuses', 'Ponts suspendus millénaires'],
        ar: ['ممرات صخرية مهيبة', 'جسور معلقة معانقة للسحاب'],
        es: ['Desfiladeros majestuosos', 'Puentes colgantes del milenio']
      },
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      badge: 'Millennium Wonder'
    },
    {
      name: 'Vallée du M\'zab',
      region: 'Ghardaïa',
      bullets: {
        en: ['Fortified cubic harmony', 'Inspirational master architecture'],
        fr: ['Villes fortifiées uniques', 'Inspiration architecturale pure'],
        ar: ['قصور متناغمة ومحصنة', 'إلهام هندسي مستمر عبر القرون'],
        es: ['Armonía cúbica fortificada', 'Inspiración arquitectónica pura']
      },
      image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1000&q=80',
      badge: 'Architectural Gem'
    }
  ];

  return (
    <div className="min-h-screen bg-ivory text-ink font-sans selection:bg-gold selection:text-ink relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Decorative Premium Soft Color Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* --- PREMIUM LIGHT NAV BAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 lg:px-12 ${
        scrolled 
          ? 'py-4 bg-white/85 backdrop-blur-md border-b border-border shadow-md' 
          : 'py-6 bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold via-gold/80 to-gold/60 p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-sm">🇩🇿</div>
            </div>
            <div>
              <span className="text-2xl font-serif font-black tracking-wider bg-gradient-to-r from-gold to-gold/80 bg-clip-text text-transparent">
                RAHALA
              </span>
              <span className="block text-[8px] tracking-[0.2em] font-mono text-ink/60 font-bold uppercase leading-none mt-0.5">
                L’Algérie Autrement
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-extrabold text-ink/80">
            {['Explore', 'Digital Twin', 'AI Companion', 'Retreats', 'Heritage'].map((item, idx) => (
              <a 
                key={idx} 
                href="#features" 
                className="hover:text-gold transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-gold hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-border hover:border-gold/40 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              >
                <Globe size={13} className="text-gold" />
                <span className="text-[10px] text-ink">{language}</span>
                <span className="text-xs">{languagesList.find(l => l.code === language)?.flag}</span>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-40 bg-white border border-border rounded-2xl shadow-xl py-1 z-50 overflow-hidden`}
                  >
                    {languagesList.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-left transition-all ${
                          lang.code === language 
                            ? 'text-gold bg-gold/5 font-black border-l-2 border-gold rtl:border-l-0 rtl:border-r-2'
                            : 'text-ink hover:text-gold hover:bg-ivory'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span>{lang.flag}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => onEnterAuth('login')}
              className="bg-gold hover:bg-[#C29B2E] text-ink px-6 py-2.5 rounded-full font-bold uppercase text-[10px] tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
            >
              {language === 'ar' ? 'دخول' : language === 'fr' ? 'Connexion' : 'Enter'}
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION: MODERN CLEAN AIRY --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=2000&q=90" 
            alt="Algerian Sahara Desert dunes" 
            className="w-full h-full object-cover object-center transform scale-102 animate-zoom-slow"
          />
          {/* Gentle white overlay to wash out the image background details, making it bright and highly legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-ivory/75 to-ivory" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-border mb-8 shadow-sm"
          >
            <Sparkles size={11} className="text-gold animate-pulse" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-ink">
              {t('tagline')}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif text-ink tracking-tight leading-[1.1] font-black mb-6 max-w-4xl"
          >
            {t('welcomeMessage')}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xs sm:text-sm md:text-base text-ink/60 font-medium tracking-wide max-w-2xl leading-relaxed mb-10 text-center"
          >
            {t('welcomeSubtitle')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-md"
          >
            <button 
              onClick={() => onEnterAuth('register')}
              className="group bg-gold hover:bg-[#C29B2E] text-ink px-10 py-4 rounded-full font-bold uppercase text-[10px] tracking-wider transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{language === 'ar' ? 'سجل معنا' : language === 'fr' ? 'S\'enregistrer' : 'Register Now'}</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onEnterAuth('login')}
              className="bg-white hover:bg-ivory text-ink border border-border hover:border-gold/50 px-10 py-4 rounded-full font-bold uppercase text-[10px] tracking-wider transition-all duration-300 active:scale-95 cursor-pointer"
            >
              {language === 'ar' ? 'ولوج الأعضاء' : language === 'fr' ? 'Espace Membre' : 'Member Access'}
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* --- FEATURED LANDMARKS IN TRIVAGO CARD CODES --- */}
      <section id="features" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono font-black text-gold tracking-widest uppercase block mb-3">
            EXPLORATION EXCLUSIVE
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-ink font-black tracking-tight">
            {language === 'ar' ? 'أربعة كنوز وطنية للتأمل' : language === 'fr' ? 'Trésors Secrets d\'Algérie' : 'Secret Treasures of Algeria'}
          </h2>
          <div className="w-12 h-[3px] bg-gradient-to-r from-gold to-gold/80 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredSpots.map((spot, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className="group bg-white border border-border hover:border-gold/30 rounded-[20px] overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="relative h-56 w-full overflow-hidden shrink-0">
                <img 
                  src={spot.image} 
                  alt={spot.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent opacity-80" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 border border-border text-gold text-[8px] font-mono font-bold uppercase rounded-full tracking-wider shadow-xs">
                  {spot.badge}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-ink/60 uppercase font-bold block mb-1">
                    {spot.region}
                  </span>
                  <h3 className="text-lg font-serif text-ink font-bold mb-3 group-hover:text-gold transition-colors leading-tight">
                    {spot.name}
                  </h3>
                  
                  {/* Clean limited text list (2 lines maximum concept) */}
                  <ul className="text-[11px] text-ink/60 font-medium space-y-1 mb-6">
                    {(spot.bullets[language] || spot.bullets['fr']).map((bullet, bidx) => (
                      <li key={bidx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                        <span className="truncate">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => onEnterAuth('login')}
                  className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black uppercase text-gold tracking-wider hover:text-gold/85 transition-colors cursor-pointer self-start focus:outline-none"
                >
                  <span>{language === 'ar' ? 'اكتشف بـ 3D' : language === 'fr' ? 'Explorer en 3D' : 'Explore 3D'}</span>
                  <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- RAHALA AI COMPANION --- */}
      <section className="py-24 relative overflow-hidden bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gold/5 rounded-[40px] blur-3xl pointer-events-none" />
            
            <div className="relative bg-ivory border border-border p-8 rounded-[30px] shadow-sm max-w-md mx-auto overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/25 text-gold">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-ink font-serif italic">Rahala Intelligence</span>
                    <span className="block text-[8px] text-ink/65 font-mono tracking-wider">Gemini 3.5 Active</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-[8px] font-mono text-gold font-bold uppercase">Live</span>
              </div>

              <div className="py-6 space-y-4 font-sans text-xs">
                <div className="bg-white border border-border p-4 rounded-2xl rounded-tl-none max-w-[85%] text-left">
                  <span className="block text-[8px] font-mono text-gold uppercase tracking-wider mb-1">RAHALA AI</span>
                  <p className="text-ink/90 leading-relaxed font-light">
                    {language === 'ar' 
                      ? 'مرحباً بك في الجزائر الفاخرة. سأقوم بتنظيم خطة رحلتك العائلية القادمة في جبال جرجرة وجانت.' 
                      : 'Bonjour. Je conçois pour vous un itinéraire exclusif mariant le charme d’Alger la Blanche et les secrets de Djanet.'}
                  </p>
                </div>

                <div className="bg-gold/5 border border-gold/10 p-4 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-right">
                  <span className="block text-[8px] font-mono text-gold uppercase tracking-wider mb-1">TRAVELER VIP</span>
                  <p className="text-ink/90 leading-relaxed font-light">
                    {language === 'ar' 
                      ? 'رائع! أريد دليلاً خاصاً للثقافة الأمازيغية والطبخ التقليدي.' 
                      : 'Merveilleux. Proposez-moi un hébergement prestigieux près du M\'zab.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-border grid grid-cols-3 gap-2.5 text-center text-[9px] uppercase tracking-wider font-extrabold text-ink">
                  <div className="p-2.5 rounded-xl bg-white border border-border">
                    <Compass size={12} className="mx-auto mb-1.5 text-gold" />
                    {language === 'ar' ? 'خريطة' : 'Route'}
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-border">
                    <Hotel size={12} className="mx-auto mb-1.5 text-gold" />
                    {language === 'ar' ? 'فندق' : 'Retreat'}
                  </div>
                  <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20 text-gold">
                    <Sparkles size={12} className="mx-auto mb-1.5" />
                    {language === 'ar' ? 'تحليل' : 'Gemini'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <span className="text-[10px] font-mono font-bold text-gold tracking-widest uppercase block">
              ALGERIA WITH AI POWERS
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-ink font-black leading-tight">
              {language === 'ar' ? 'مرشدك الشخصي مدعوم بأحدث تقنيات غوغل' : language === 'fr' ? 'Votre Compagnon de Voyage Intellectuel' : 'Your Deeply Knowing Local Guide'}
            </h2>
            <p className="text-ink/60 font-medium leading-relaxed max-w-xl">
              {language === 'ar'
                ? 'استفد من قوة الذكاء الاصطناعي لتخطيط مسارك، وترجمة اللهجات المحلية، وتوفير المساعدة الأمنية وإرشادات الطوارئ طوال 24 ساعة بكل الولايات.'
                : 'Laissez la technologie sublimer votre voyage. Rahala AI configure des circuits sur mesure, calcule les prix des transports officiels et s\'adapte en temps réel à vos besoins et votre budget.'}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-gold mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-ink">{language === 'ar' ? 'أسعار رسمية وشفافة' : 'Tarifs Officiels Garantis'}</h4>
                  <p className="text-xs text-ink/65 mt-0.5">{language === 'ar' ? 'مزامنة مباشرة لأسعار سيارات الأجرة والفنادق' : 'Évitez les mauvaises surprises avec notre convertisseur touristique.'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-gold mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-ink">{language === 'ar' ? 'أمان مطلق وشركاء مرخصون' : 'Chauffeurs Privés Agréés'}</h4>
                  <p className="text-xs text-ink/65 mt-0.5">{language === 'ar' ? 'جميع السائقين معتمدون ومفحوصون من سلطاتنا' : 'Des chauffeurs officiels triés sur le volet pour vos déplacements.'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-gold mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-ink">{language === 'ar' ? 'توائم رقمية حقيقية' : 'Jumeaux Numériques 3D'}</h4>
                  <p className="text-xs text-ink/65 mt-0.5">{language === 'ar' ? 'جولات بانورامية فائقة الوضوح لجميع معالم التراث' : 'Visualisez les monuments historiques de Djemila ou Timgad en immersion.'}</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => onEnterAuth('register')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-ink hover:bg-[#C29B2E] font-bold text-[10px] tracking-wider uppercase rounded-full transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>{language === 'ar' ? 'احصل على حساب مجاني' : 'Créer un Compte Gratuit'}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- PRESTIGE LIGHT FOOTER --- */}
      <footer className="py-16 px-6 lg:px-12 border-t border-border bg-ivory relative z-10 text-center select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-left flex flex-col items-center md:items-start">
            <span className="text-lg font-serif font-black text-ink tracking-wider">RAHALA</span>
            <p className="text-[10px] text-ink/60 tracking-widest mt-1 uppercase">Découvrez l’Algérie autrement • 2026</p>
          </div>

          <p className="text-[10px] text-ink/60 tracking-wider font-mono">
            © {new Date().getFullYear()} RAHALA Tourisme Algérie. All premium privileges reserved. Powered by DeepMind Google Gemini AI.
          </p>

          <div className="flex gap-4 text-xs font-mono font-bold uppercase text-gold">
            <a href="#" className="hover:text-gold/80 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-gold/80 transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-gold/80 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RahalaLanding;
