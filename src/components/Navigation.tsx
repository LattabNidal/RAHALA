import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  Menu, X, Bell, Globe, Sparkles, User as UserIcon, 
  ShieldAlert, LogOut, Sun, Moon, CreditCard, Shield,
  Compass, Box, Map, Hotel, Car, Camera, ChevronRight, Coins
} from 'lucide-react';
import { Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CurrencyConverter } from './CurrencyConverter';
import { supabaseDbService } from '../lib/supabaseDb';
import rahalaLogo from '../assets/images/android-chrome-512x512.png';

interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView, darkMode, setDarkMode }) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { currentUser, setCurrentUser, notifications, clearNotifications } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [converterOpen, setConverterOpen] = useState(false);
  const [converterModalOpen, setConverterModalOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const handleLangSelect = (code: Language) => {
    setLanguage(code);
    setLangDropdownOpen(false);
  };

  const toggleUserRole = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      role: currentUser.role === 'admin' ? 'user' : 'admin'
    });
  };

  const togglePremium = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      isPremium: !currentUser.isPremium
    });
  };

  const navItems = [
    { id: 'explore', label: t('navExplore'), icon: Compass },
    { id: 'digital-twin', label: t('navDigitalTwin'), icon: Box },
    { id: 'map', label: t('navInteractiveMap'), icon: Map },
    { id: 'hotels', label: t('navHotels'), icon: Hotel },
    { id: 'taxis', label: t('navTaxis'), icon: Car },
    { id: 'ai-guide', label: t('navAIGuide'), icon: Sparkles },
    { id: 'real-photos', label: t('navRealPhotos'), icon: Camera },
    { id: 'safe-travel', label: t('navSafeTravel'), icon: Shield },
    { id: 'social', label: t('navSocial'), icon: Camera },
    { id: 'billing', label: t('navBilling'), icon: CreditCard },
    { id: 'dashboard', label: t('navDashboard'), icon: UserIcon }
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: t('navAdmin'), icon: ShieldAlert });
  }

  const getSubtitle = (id: string) => {
    if (language === 'ar') {
      switch(id) {
        case 'explore': return 'المستكشف الافتراضي التفاعلي';
        case 'digital-twin': return 'محاكاة ثلاثية الأبعاد ونظرة بانورامية';
        case 'map': return 'خريطة تفاعلية شاملة';
        case 'hotels': return 'فنادق وإقامات فاخرة بكل الولايات';
        case 'taxis': return 'اطلب سائقك المعتمد بكل سهولة';
        case 'ai-guide': return 'مساعد السفر الذكي المدعوم بـ Gemini';
        case 'real-photos': return 'التحقق البصري المباشر من صور غوغل';
        case 'safe-travel': return 'تأمين وضمانات سلامة رحلتك';
        case 'social': return 'نادي المسافرين لمشاركة اللحظات';
        case 'billing': return 'بوابة الدفع وباقات المسافر كارد';
        case 'dashboard': return 'حسابك الشخصي ورحلاتك الشخصية';
        default: return 'إدارة أداء النظام السياحي الإقليمي';
      }
    } else if (language === 'fr') {
      switch(id) {
        case 'explore': return 'Explorateur Virtuel des merveilles';
        case 'digital-twin': return 'Visites virtuelles HD à 360°';
        case 'map': return 'Cartographie touristique complète';
        case 'hotels': return 'Hôtels exclusifs & séjours de prestige';
        case 'taxis': return 'Chauffeurs privés sécurisés et à la demande';
        case 'ai-guide': return 'Intelligence compagnon certifiée Gemini';
        case 'real-photos': return 'Photos réelles certifiées de Google Maps';
        case 'safe-travel': return 'Garanties d’assurance voyage de RAHLA';
        case 'social': return 'Galerie partagée des routards algériens';
        case 'billing': return 'Abonnements Premium & Factures DZD';
        case 'dashboard': return 'Vos favoris, réservations et courses';
        default: return 'Console administrative de contrôle régionale';
      }
    } else {
      switch(id) {
        case 'explore': return 'Virtual heritage exploration room';
        case 'digital-twin': return 'Immersive 3D HD tours';
        case 'map': return 'Interactive layout map & tracking';
        case 'hotels': return 'Premium retreats & luxury hotel stays';
        case 'taxis': return 'Fast dispatch certified private drivers';
        case 'ai-guide': return 'Gemini local wisdom guide companion';
        case 'real-photos': return 'Real verified photos from Google Places';
        case 'safe-travel': return 'Secure coverage and safety policies';
        case 'social': return 'Algeria travelers community hub';
        case 'billing': return 'Abonnements, checkouts & billing';
        case 'dashboard': return 'Personal overview and history logs';
        default: return 'Regional tourism statistics & settings';
      }
    }
  };

  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    'explore': Compass,
    'digital-twin': Box,
    'map': Map,
    'hotels': Hotel,
    'taxis': Car,
    'ai-guide': Sparkles,
    'real-photos': Camera,
    'safe-travel': Shield,
    'social': Camera,
    'billing': CreditCard,
    'dashboard': UserIcon,
    'admin': ShieldAlert
  };

  return (
    <>
      <nav id="navbar-header" className="sticky top-0 z-50 bg-white/85 border-b border-[#E2E8F0] backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                id="drawer-toggle-button"
                onClick={() => setMenuOpen(true)}
                className="p-2 sm:p-2.5 text-ink hover:text-gold bg-[#F8FAFC] hover:bg-[#E2E8F0] rounded-xl transition duration-200 cursor-pointer flex items-center justify-center border border-[#E2E8F0]"
                title="Consulter le menu"
              >
                <Menu size={18} />
              </button>

              <div 
                onClick={() => setActiveView('explore')} 
                className="flex items-center space-x-2.5 space-x-reverse group focus:outline-none p-1 rounded-xl cursor-pointer"
              >
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-gold to-[#B8860B] shadow-sm group-hover:scale-105 transition duration-300">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5">
                    <img 
                      src={rahalaLogo} 
                      alt="RAHALA Logo badge" 
                      loading="eager"
                      decoding="async"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 -right-0.5 w-2.5 h-2.5 bg-gold border-2 border-white rounded-full flex items-center justify-center animate-ping-slow" />
                </div>
                
                <div className="flex flex-col text-right">
                  <span className="text-lg sm:text-xl font-serif font-black tracking-wider bg-gradient-to-r from-gold to-[#B8860B] bg-clip-text text-transparent uppercase select-none">
                    RAHALA
                  </span>
                  <span className="text-[7.5px] tracking-widest font-mono text-ink/60 font-bold uppercase select-none leading-none">
                    L’Algérie Autrement
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 space-x-reverse">
              
              <div className="flex items-center space-x-1.5 space-x-reverse">
                <div className="flex items-center">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-xl leading-none border select-none ${
                    supabaseDbService.isUsingCloud()
                      ? 'bg-gold/10 text-gold border-gold/20'
                      : 'bg-[#F8FAFC] text-ink/60 border-[#E2E8F0]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${supabaseDbService.isUsingCloud() ? 'bg-gold animate-pulse' : 'bg-ink/60'}`} />
                    <span>{supabaseDbService.isUsingCloud() ? 'Cloud Sync Sync' : 'Local Sandbox Offline'}</span>
                  </span>
                </div>
              </div>

              {currentUser && (
                <div className="hidden sm:flex items-center space-x-1 space-x-reverse leading-none bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
                  <button
                    onClick={togglePremium}
                    className={`px-3 py-1.5 text-[9px] font-mono rounded-lg transition select-none cursor-pointer ${
                      currentUser.isPremium 
                        ? 'bg-gold text-ink border border-gold shadow-sm font-black' 
                        : 'border border-dashed border-[#E2E8F0] text-ink/60 hover:bg-gold/10 hover:text-gold'
                    }`}
                    title="Toggle Premium subscription simulated flow"
                  >
                    {currentUser.isPremium ? '★ GOLD VIP' : '☆ STANDARD'}
                  </button>
                </div>
              )}

              {/* Decorative Theme switcher that maintains light theme styling */}
              <button
                id="darkmode-switcher"
                onClick={() => setDarkMode(false)}
                className="p-2 sm:p-2.5 text-ink hover:text-gold hover:bg-[#F8FAFC] rounded-xl transition cursor-pointer flex items-center justify-center"
                title="Thème Premium (Clair)"
              >
                <Sun size={15} />
              </button>

              {/* 🪙 Currency Converter Navbar Trigger */}
              <div className="relative">
                <button
                  id="currency-converter-button"
                  onClick={() => {
                    setConverterOpen(!converterOpen);
                    setLangDropdownOpen(false);
                    setNotifDropdownOpen(false);
                    setProfileDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-1.5 space-x-reverse p-2 text-xs font-bold uppercase rounded-xl transition duration-200 cursor-pointer relative ${
                    converterOpen 
                      ? 'text-gold bg-gold/10' 
                      : 'text-ink hover:text-gold hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Coins size={15} className="text-gold" />
                  <span className="hidden md:inline">
                    {language === 'ar' ? 'تحويل' : language === 'fr' ? 'Convertir' : 'Convert'}
                  </span>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold animate-pulse border border-white" />
                </button>
                
                {converterOpen && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl z-50 animate-fade-in`}>
                    <CurrencyConverter onClose={() => setConverterOpen(false)} />
                  </div>
                )}
              </div>

              {/* Languages Selection Panel */}
              <div className="relative">
                <button
                  id="language-selector-button"
                  onClick={() => {
                    setLangDropdownOpen(!langDropdownOpen);
                    setNotifDropdownOpen(false);
                    setProfileDropdownOpen(false);
                    setConverterOpen(false);
                  }}
                  className="flex items-center space-x-1 space-x-reverse p-2 text-ink hover:text-gold hover:bg-[#F8FAFC] rounded-xl transition cursor-pointer"
                >
                  <Globe size={15} />
                  <span className="hidden sm:inline text-xs font-bold uppercase">
                    {languagesList.find(l => l.code === language)?.flag}
                  </span>
                </button>
                
                {langDropdownOpen && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-44 rounded-xl bg-white border border-[#E2E8F0] shadow-xl py-1.5 z-50 animate-fade-in`}>
                    {languagesList.map((lang) => {
                      const isActive = lang.code === language;
                      return (
                        <button
                           key={lang.code}
                           onClick={() => handleLangSelect(lang.code)}
                           className={`flex items-center justify-between w-full text-start px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                             isActive 
                               ? 'text-gold bg-gold/10 border-l-4 border-gold font-black'
                               : 'text-ink hover:text-gold hover:bg-[#F8FAFC]'
                           }`}
                        >
                          <span className="flex items-center space-x-1.5 space-x-reverse">
                            <span>{lang.label}</span>
                            {isActive && <span className="text-[10px] text-gold">✓</span>}
                          </span>
                          <span className="text-sm">{lang.flag}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Notifications Inbox with Pill alerts */}
              <div className="relative">
                <button
                  id="notifications-bell"
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setLangDropdownOpen(false);
                    setProfileDropdownOpen(false);
                    setConverterOpen(false);
                  }}
                  className="p-2 sm:p-2.5 text-ink hover:text-gold hover:bg-[#F8FAFC] rounded-xl transition relative cursor-pointer"
                >
                  <Bell size={15} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-gold border-2 border-white animate-pulse" />
                  )}
                </button>
                {notifDropdownOpen && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-72 rounded-xl bg-white border border-[#E2E8F0] shadow-xl z-50 animate-fade-in overflow-hidden`}>
                    <div className="px-4 py-3 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] rounded-t-xl">
                      <span className="text-xs font-black uppercase tracking-wider text-ink">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-[10px] font-bold uppercase tracking-wider text-gold hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1.5">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-ink/60 font-serif italic">
                          Pas de messages aujourd'hui
                        </div>
                      ) : (
                        notifications.map((notif) => (
                           <div key={notif.id} className="px-4 py-3 border-b border-[#E2E8F0] last:border-none hover:bg-[#F8FAFC] transition text-left">
                             <p className="text-xs text-ink leading-relaxed font-sans">{notif.message}</p>
                             <span className="text-[9px] text-ink/60 font-mono mt-1 block">{notif.date}</span>
                           </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown trigger */}
              <div className="relative">
                {currentUser ? (
                  <>
                    <button
                      id="profile-dropdown-trigger"
                      onClick={() => {
                        setProfileDropdownOpen(!profileDropdownOpen);
                        setLangDropdownOpen(false);
                        setNotifDropdownOpen(false);
                        setConverterOpen(false);
                      }}
                      className="flex items-center space-x-1.5 space-x-reverse p-1 hover:bg-[#F8FAFC] rounded-xl transition focus:outline-none cursor-pointer"
                    >
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt="avatar profile user"
                        loading="eager"
                        decoding="async"
                        className="w-7 h-7 object-cover rounded-full border border-[#E2E8F0]"
                      />
                    </button>
                    {profileDropdownOpen && (
                      <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-56 rounded-xl bg-white border border-[#E2E8F0] shadow-xl py-1.5 z-50 animate-fade-in`}>
                        <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-lg text-left">
                          <p className="text-xs font-black text-gold truncate mb-1 font-serif italic">{currentUser.name}</p>
                          <p className="text-[10px] text-ink/60 font-mono truncate">{currentUser.email}</p>
                          <div className="mt-2.5 flex space-x-1.5 space-x-reverse">
                            <span className="px-2 py-0.5 text-[8px] font-mono font-black uppercase border border-[#E2E8F0] text-ink rounded bg-[#F8FAFC]">
                              {currentUser.role}
                            </span>
                            {currentUser.isPremium && (
                              <span className="px-2 py-0.5 text-[8px] font-mono font-black uppercase bg-gold/10 text-gold border border-gold/20 rounded">
                                VIP
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveView('dashboard');
                            setProfileDropdownOpen(false);
                            setMenuOpen(false);
                          }}
                          className="flex w-full px-4 py-2.5 text-xs text-ink hover:text-gold hover:bg-[#F8FAFC] items-center space-x-2 space-x-reverse transition uppercase tracking-wider font-extrabold cursor-pointer"
                        >
                          <UserIcon size={12} />
                          <span>{t('navDashboard')}</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentUser(null);
                            window.location.hash = '#/landing';
                            setProfileDropdownOpen(false);
                          }}
                          className="flex w-full px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-50 items-center space-x-2 space-x-reverse border-t border-[#E2E8F0] transition uppercase tracking-wider font-extrabold cursor-pointer"
                        >
                          <LogOut size={12} />
                          <span>{t('seConnecter') ? 'Log Out' : 'Déconnexion'}</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      window.location.hash = '#/login';
                      setActiveView('auth');
                    }}
                    className="px-3.5 py-1.5 bg-or-sahara hover:bg-or-sahara-hover text-encre text-[11px] font-mono font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 border border-or-sahara/10"
                  >
                    {language === 'ar' ? 'تسجيل الدخول' : language === 'fr' ? 'Connexion' : 'Login'}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR MENU DRAWER (SLIDES IN) --- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-[#334155]/40 backdrop-blur-xs z-100 cursor-pointer"
            />
            
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`fixed top-0 bottom-0 ${isRtl ? 'right-0' : 'left-0'} w-80 max-w-full bg-white border-r border-[#E2E8F0] z-101 shadow-2xl flex flex-col justify-between overflow-hidden`}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              
              <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gold/10 p-0.5 border border-gold/20">
                    <img 
                      src={rahalaLogo} 
                      alt="Mini brand logo navigation deck slider" 
                      loading="eager"
                      decoding="async"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-base font-serif font-black tracking-widest text-ink uppercase leading-none block">
                      RAHALA
                    </span>
                    <span className="text-[7.5px] font-mono text-ink/60 font-bold block uppercase mt-0.5">
                      Algerian Smart Companion
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white hover:bg-[#E2E8F0] border border-[#E2E8F0] text-ink transition cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                <p className="px-3 text-[9px] font-mono uppercase tracking-[0.2em] text-ink/60 font-black mb-3">
                  {language === 'ar' ? 'البوابة الذكية لقسنطينة والجزائر' : 'Smart Gateway Portals'}
                </p>

                {navItems.map((item) => {
                  const Icon = iconMap[item.id] || Compass;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center p-3 rounded-2xl transition-all duration-200 text-right font-sans cursor-pointer ${
                        isActive 
                          ? 'bg-gold/10 text-gold font-bold border-l-4 border-gold pl-2 shadow-sm'
                          : 'text-ink hover:bg-[#F8FAFC] hover:text-gold'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-gold text-ink' : 'bg-[#F8FAFC] text-ink/60 border border-[#E2E8F0]'} ml-3`}>
                        <Icon size={16} />
                      </div>
                      
                      <div className="min-w-0 flex-1 text-left">
                        <span className="block text-xs font-black uppercase tracking-wider">{item.label}</span>
                        <span className={`block text-[8px] truncate leading-none mt-0.5 ${isActive ? 'text-gold' : 'text-ink/60'}`}>
                          {getSubtitle(item.id)}
                        </span>
                      </div>
                      
                      <ChevronRight size={12} className={`shrink-0 ${isActive ? 'text-gold' : 'text-ink/60'}`} />
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center space-x-3 space-x-reverse mb-3">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt="user profile avatar miniature file"
                    loading="eager"
                    decoding="async"
                    className="w-10 h-10 object-cover rounded-full border border-[#E2E8F0] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black truncate text-ink leading-tight font-serif italic">
                      {currentUser?.name || (language === 'fr' ? 'Visiteur' : language === 'ar' ? 'زائر' : 'Guest Traveler')}
                    </p>
                    <p className="text-[10px] font-mono truncate text-ink/60 mt-0.5 leading-none">
                      {currentUser?.email || 'guest@rahala-dz.com'}
                    </p>
                    
                    <div className="mt-2 flex flex-wrap gap-1 leading-none">
                      <span className="inline-block px-2.5 py-0.5 text-[8px] font-mono font-black uppercase bg-gold/10 text-gold rounded-full border border-gold/20">
                        Rôle: {currentUser?.role?.toUpperCase() || 'GUEST'}
                      </span>
                      {currentUser?.isPremium && (
                        <span className="inline-block px-2 py-0.5 text-[8px] font-mono font-bold uppercase bg-gold/20 text-gold border border-gold/30 rounded-full animate-pulse">
                          ★ VIP Gold
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {currentUser && (
                  <div className="mt-3 grid grid-cols-2 gap-1.5 leading-none">
                    <button
                      onClick={toggleUserRole}
                      className="px-2 py-1.5 text-[8px] font-mono font-extrabold text-ink bg-white border border-[#E2E8F0] rounded-lg text-center cursor-pointer hover:border-gold/25 select-none"
                    >
                      🔄 Test Rôle
                    </button>
                    <button
                      onClick={togglePremium}
                      className={`px-2 py-1.5 text-[8px] font-mono font-extrabold border rounded-lg text-center cursor-pointer transition select-none ${
                        currentUser.isPremium
                          ? 'bg-gold/10 text-gold border-gold/35'
                          : 'bg-white text-ink/60 border-[#E2E8F0]'
                      }`}
                    >
                      ★ Test VIP Play
                    </button>
                  </div>
                )}

                {currentUser ? (
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      window.location.hash = '#/landing';
                      setMenuOpen(false);
                    }}
                    className="w-full mt-3.5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0 duration-300"
                  >
                    <LogOut size={11} />
                    Se déconnecter
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      window.location.hash = '#/login';
                      setMenuOpen(false);
                    }}
                    className="w-full mt-3.5 py-2.5 bg-gold hover:bg-[#C29B2E] text-ink rounded-xl transition font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0 duration-300"
                  >
                    <UserIcon size={11} />
                    Se connecter
                  </button>
                )}

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {converterModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConverterModalOpen(false)}
              className="fixed inset-0 bg-[#334155]/40 backdrop-blur-xs cursor-pointer"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10"
            >
              <button
                onClick={() => setConverterModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#334155] transition duration-200 cursor-pointer z-20"
                title="Fermer"
              >
                <X size={16} />
              </button>

              <div className="pt-2">
                <CurrencyConverter onClose={() => setConverterModalOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
