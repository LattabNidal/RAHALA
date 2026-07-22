import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import androidChrome from '../assets/images/android-chrome-512x512.png';
import rahalaHeroBanner from '../assets/images/rahala_hero_banner_1784119916854.jpg';
import rahalaLogo from '../assets/images/android-chrome-512x512.png';
import { 
  Menu, X, Bell, Globe, Sparkles, User as UserIcon, 
  ShieldAlert, LogOut, Sun, Moon, CreditCard, Shield,
  Compass, Box, Map, Hotel, Car, Camera, ChevronRight, Coins
} from 'lucide-react';
import { Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CurrencyConverter } from './CurrencyConverter';
import { supabaseDbService } from '../lib/supabaseDb';

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

  // Close sidebar drawer on window resize above mobile screen if unwanted
  // but since we replace horizontal links completely as requested, 
  // keeping the sliding sidebar for desktop too provides a consistent, high-fidelity experience!

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

  // Dual-language descriptive sub-labels for luxury tourist finish
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

  // Custom Lucide Icon mapping
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
      <nav id="navbar-header" className="sticky top-0 z-50 bg-white/95 dark:bg-[#111317]/95 border-b border-gray-200 dark:border-gray-800 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Area: Hamburger and Brand Logo */}
            <div className="flex items-center space-x-3 space-x-reverse">
              {/* Modern Rounded Hamburger Trigger */}
              <button
                id="hamburger-menu-trigger"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 sm:p-2.5 text-[#1a1a1a]/80 hover:text-emerald-600 dark:text-[#f5f2ed]/85 dark:hover:text-[#d4af37] bg-[#1a1a1a]/5 dark:bg-white/5 hover:bg-[#1a1a1a]/10 dark:hover:bg-white/10 rounded-xl transition duration-250 cursor-pointer flex items-center justify-center border border-slate-300/10"
                title="Ouvrir le menu de navigation"
              >
                <Menu size={20} className="transition-transform duration-200 hover:scale-105" />
              </button>

              {/* Brand Logo Identity */}
              <button 
                id="navbar-brand-button"
                onClick={() => {
                  setActiveView('explore');
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-2.5 space-x-reverse group focus:outline-none focus:ring-2 focus:ring-emerald-500/50 p-1 rounded-xl"
              >
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-emerald-600 via-white to-red-650 shadow-md shadow-emerald-500/15 group-hover:scale-105 transition duration-300">
                  <img 
                    src={rahalaLogo}
                    alt="RAHALA Logo"
                    className="w-10 h-10 rounded-full object-cover border border-white"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center animate-ping-slow"></span>
                </div>
                
                <div className="text-right flex flex-col justify-center select-none">
                  <span className="block text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-emerald-600 via-emerald-500 to-red-600 bg-clip-text text-transparent leading-none">
                    {t('appName')}
                  </span>
                  <span className="block text-[8px] tracking-wider uppercase text-emerald-600 dark:text-[#d4af37] font-mono font-black mt-0.5">
                    Algérie 🇩🇿
                  </span>
                </div>
              </button>
            </div>

            {/* Right Action Hub (Languages, Notifications, Dark Mode, Profile) */}
            <div className="flex items-center space-x-1.5 space-x-reverse">
              {/* Cloud Sync Database Status Badge */}
              <div className="flex items-center">
                <span className={`flex items-center gap-1.5 px-2 py-1.5 text-[9px] font-mono font-bold uppercase rounded-xl leading-none border select-none ${
                  supabaseDbService.isUsingCloud()
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}
                title={supabaseDbService.isUsingCloud() ? 'Live synchronization with Supabase cloud database active' : 'Running in offline backup mode using client-side localStorage'}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${supabaseDbService.isUsingCloud() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="hidden lg:inline">{supabaseDbService.isUsingCloud() ? 'Supabase Connected' : 'Local DB Mode'}</span>
                  <span className="lg:hidden">{supabaseDbService.isUsingCloud() ? 'Cloud' : 'Local'}</span>
                </span>
              </div>

              {/* Preserved Testing widgets for preview reviewers to toggle standard/admin roles seamlessly */}
              {currentUser && (
                <div className="hidden md:flex items-center space-x-1 space-x-reverse leading-none bg-[#1a1a1a]/5 dark:bg-white/5 p-1 rounded-xl border border-slate-300/15">
                  <button 
                    onClick={toggleUserRole}
                    className="px-2 py-1 text-[9px] font-mono border border-dashed border-[#1a1a1a]/30 text-[#1a1a1a]/80 dark:border-white/30 dark:text-[#f5f2ed]/80 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all rounded-md cursor-pointer"
                    title="Toggle active user role for simulation purposes"
                  >
                    ROLE: {currentUser.role.toUpperCase()}
                  </button>
                  <button 
                    onClick={togglePremium}
                    className={`px-2 py-1 text-[9px] font-mono border transition-all rounded-md cursor-pointer ${
                      currentUser.isPremium 
                        ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-xs font-black' 
                        : 'border-dashed border-[#1a1a1a]/30 text-[#1a1a1a]/70 hover:bg-[#d4af37]/10 dark:border-white/30 dark:text-white/75'
                    }`}
                    title="Toggle Premium subscription simulated flow"
                  >
                    {currentUser.isPremium ? '★ GOLD VIP' : '☆ STANDARD'}
                  </button>
                </div>
              )}

              {/* Dark Mode Theme Switcher */}
              <button
                id="darkmode-switcher"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 sm:p-2.5 text-[#1a1a1a]/70 hover:text-[#d4af37] hover:bg-[#1a1a1a]/5 dark:text-[#f5f2ed]/70 dark:hover:bg-white/5 rounded-xl transition cursor-pointer flex items-center justify-center"
                title="Togglage Theme"
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
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
                      ? 'text-emerald-600 bg-emerald-50/50 dark:text-emerald-400 dark:bg-emerald-950/20' 
                      : 'text-[#1a1a1a]/70 hover:text-emerald-600 hover:bg-[#1a1a1a]/5 dark:text-[#f5f2ed]/70 dark:hover:bg-white/5'
                  }`}
                  title={language === 'ar' ? 'محول العملات' : language === 'fr' ? 'Convertisseur' : 'Currency Converter'}
                >
                  <Coins size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden md:inline">
                    {language === 'ar' ? 'تحويل' : language === 'fr' ? 'Convertir' : language === 'es' ? 'Convertir' : 'Convert'}
                  </span>
                  {/* Small "Tourist" subtle pulse indicator badge */}
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-white dark:border-zinc-900" title="Useful for tourists" />
                </button>
                
                {converterOpen && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#161a22] border border-gray-200 dark:border-gray-800 shadow-2xl z-50 animate-fade-in`}>
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
                  className="flex items-center space-x-1 space-x-reverse p-2 text-[#1a1a1a]/70 hover:text-[#d4af37] hover:bg-[#1a1a1a]/5 dark:text-[#f5f2ed]/70 dark:hover:bg-white/5 rounded-xl transition cursor-pointer"
                >
                  <Globe size={15} />
                  <span className="hidden sm:inline text-xs font-bold uppercase">
                    {languagesList.find(l => l.code === language)?.flag}
                  </span>
                </button>
                
                {langDropdownOpen && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-44 rounded-xl bg-white dark:bg-[#161a22] border border-gray-200 dark:border-gray-800 shadow-xl py-1.5 z-50 animate-fade-in`}>
                    {languagesList.map((lang) => {
                      const isActive = lang.code === language;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleLangSelect(lang.code)}
                          className={`flex items-center justify-between w-full text-start px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isActive 
                              ? 'text-emerald-600 bg-emerald-50/50 dark:text-emerald-400 dark:bg-emerald-950/20 border-l-4 border-emerald-600 font-black'
                              : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50 dark:text-gray-350 dark:hover:text-emerald-400 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          <span className="flex items-center space-x-1.5 space-x-reverse">
                            <span>{lang.label}</span>
                            {isActive && <span className="text-[10px] text-[#d4af37]">✓</span>}
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
                  className="p-2 sm:p-2.5 text-[#1a1a1a]/70 hover:text-[#d4af37] hover:bg-[#1a1a1a]/5 dark:text-[#f5f2ed]/70 dark:hover:bg-white/5 rounded-xl transition relative cursor-pointer"
                >
                  <Bell size={15} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#d4af37] border-2 border-[#f5f2ed] dark:border-[#121212] animate-pulse" />
                  )}
                </button>
                {notifDropdownOpen && (
                  <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-72 rounded-xl bg-white dark:bg-[#161a22] border border-gray-200 dark:border-gray-800 shadow-xl z-50 animate-fade-in overflow-hidden`}>
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-t-xl">
                      <span className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-450 hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1.5">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-[#1a1a1a]/60 dark:text-[#f5f2ed]/60 font-serif italic">
                          Pas de messages aujourd'hui
                        </div>
                      ) : (
                        notifications.map((notif) => (
                           <div key={notif.id} className="px-4 py-3 border-b border-[#1a1a1a]/5 dark:border-white/5 last:border-none hover:bg-[#1a1a1a]/5 dark:hover:bg-white/5 transition text-left">
                             <p className="text-xs text-[#1a1a1a] dark:text-[#f5f2ed] leading-relaxed font-sans">{notif.message}</p>
                             <span className="text-[9px] text-gray-500 font-mono mt-1 block">{notif.date}</span>
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
                      className="flex items-center space-x-1.5 space-x-reverse p-1 hover:bg-[#1a1a1a]/5 dark:hover:bg-white/5 rounded-xl transition focus:outline-none cursor-pointer"
                    >
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt="avatar profile user"
                        className="w-7 h-7 object-cover rounded-full border border-gray-400/35"
                      />
                    </button>
                    {profileDropdownOpen && (
                      <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-56 rounded-xl bg-white dark:bg-[#161a22] border border-gray-200 dark:border-gray-800 shadow-xl py-1.5 z-50 animate-fade-in`}>
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-t-lg text-left">
                          <p className="text-xs font-black text-gray-900 dark:text-gray-100 truncate mb-1 font-serif italic">{currentUser.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono truncate">{currentUser.email}</p>
                          <div className="mt-2.5 flex space-x-1.5 space-x-reverse">
                            <span className="px-2 py-0.5 text-[8px] font-mono font-black uppercase border border-emerald-500/30 text-emerald-600 dark:text-emerald-450 rounded bg-emerald-500/5">
                              {currentUser.role}
                            </span>
                            {currentUser.isPremium && (
                              <span className="px-2 py-0.5 text-[8px] font-mono font-black uppercase bg-emerald-100 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded">
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
                          className="flex w-full px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 items-center space-x-2 space-x-reverse transition uppercase tracking-wider font-extrabold cursor-pointer"
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
                          className="flex w-full px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/25 items-center space-x-2 space-x-reverse border-t border-[#1a1a1a]/10 dark:border-white/10 transition uppercase tracking-wider font-extrabold cursor-pointer"
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
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-750 hover:from-emerald-700 hover:to-emerald-850 text-white text-[11px] font-mono font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/10 active:scale-95"
                  >
                    {language === 'ar' ? 'تسجيل الدخول' : language === 'fr' ? 'Connexion' : language === 'es' ? 'Iniciar sesión' : 'Login'}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* 🔮 MODERN SLIDING SIDEBAR / DRAWER COMPONENT INTERFACE */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dark blur overlay backdrop click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-950/50 dark:bg-black/75 backdrop-blur-xs cursor-pointer"
            />

            {/* Draggable Slide-out Sidebar Box Drawer */}
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 27, stiffness: 220 }}
              drag="x"
              dragConstraints={isRtl ? { left: 0, right: 350 } : { left: -350, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, info) => {
                // Swipe validation for mobile swipe support
                const swipeThreshold = 80;
                const isSwipeClose = isRtl ? info.offset.x > swipeThreshold : info.offset.x < -swipeThreshold;
                if (isSwipeClose) {
                  setMenuOpen(false);
                }
              }}
              className={`fixed top-0 bottom-0 ${isRtl ? 'right-0' : 'left-0'} z-[70] w-80 max-w-[85vw] h-screen bg-white/95 dark:bg-[#121212]/95 border-r border-gray-200 dark:border-gray-800 backdrop-blur-md shadow-2xl flex flex-col justify-between overflow-hidden select-none text-left`}
            >
              
              {/* Header section (La photo/logo en haut du menu) */}
              <div className="relative p-6 border-b border-gray-200 dark:border-gray-800 shrink-0 overflow-hidden bg-slate-50/50 dark:bg-black/30">
                {/* Immersive Algeria scenic textured backdrop */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                  <img 
                    src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80" 
                    alt="Immersive scenic desert background helper"
                    className="w-full h-full object-cover filter blur-[2px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#121212]"></div>
                </div>

                {/* Close Button "X" inside top-corner */}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-200/60 dark:bg-zinc-800/80 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 hover:text-black dark:text-zinc-400 dark:hover:text-white transition duration-200 cursor-pointer"
                  title="Fermer le menu"
                >
                  <X size={16} />
                </button>

                {/* Main Brand Centered Logo inside header block */}
                <div className="relative z-10 flex flex-col items-center text-center mt-3">
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-emerald-600 via-white to-red-650 shadow-lg mb-3">
                    <img
                      src={rahalaLogo}
                      alt="Centered RAHLA circular emblem logo"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-zinc-900"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full border border-white flex items-center justify-center text-[10px] text-white">🇩🇿</div>
                  </div>

                  <h3 className="text-xl font-black tracking-tight font-display bg-gradient-to-r from-emerald-600 via-emerald-500 to-red-600 bg-clip-text text-transparent leading-none">
                    {t('appName')}
                  </h3>
                  <p className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-[#d4af37] mt-1.5 leading-none">
                    {t('tagline') || 'Découvrez l’Algérie autrement'}
                  </p>
                </div>
              </div>

              {/* Scrollable vertical navigation list (Contenu du menu) */}
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin dark:scrollbar-thumb-zinc-800">
                
                {/* Prominent Tourist Currency Converter option in mobile/drawer list */}
                <button
                  onClick={() => {
                    setConverterModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden cursor-pointer bg-emerald-500/5 hover:bg-emerald-600/10 border border-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                >
                  <div className="p-2 rounded-xl bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0">
                    <Coins size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="block text-xs font-black uppercase tracking-wider">
                        {language === 'ar' ? 'محول العملات' : language === 'fr' ? 'Convertisseur' : language === 'es' ? 'Conversor de divisas' : 'Currency Converter'}
                      </span>
                      <span className="px-1.5 py-0.5 text-[8px] font-mono font-black uppercase bg-emerald-600 text-white rounded-md animate-pulse">
                        TOURIST
                      </span>
                    </div>
                    <span className="block text-[9px] text-emerald-600/75 dark:text-emerald-450 truncate mt-0.5 leading-none">
                      {language === 'ar' ? 'تحويل العملات للدينار الجزائري' : language === 'fr' ? 'Dinar Algérien (DZD) en temps réel' : 'Real-time Algerian Dinar (DZD) exchange'}
                    </span>
                  </div>
                </button>

                {navItems.map((item) => {
                  const Icon = iconMap[item.id] || Sparkles;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 font-extrabold border-l-4 border-emerald-550'
                          : 'text-slate-800 dark:text-zinc-350 hover:bg-slate-100/65 dark:hover:bg-zinc-900 hover:text-emerald-600 dark:hover:text-emerald-400'
                      }`}
                    >
                      <div className={`p-2 rounded-xl transition shrink-0 ${
                        isActive
                          ? 'bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-zinc-800/50 group-hover:bg-emerald-600/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                      }`}>
                        <Icon size={16} />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="block text-xs font-bold uppercase tracking-wider">{item.label}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>}
                        </div>
                        <span className="block text-[9px] text-gray-400 dark:text-zinc-500 truncate mt-0.5 leading-none">
                          {getSubtitle(item.id)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Secure Footer module (Section en bas : Rôle + Bouton Déconnexion) */}
              <div className="p-4 border-t border-[#1a1a1a]/10 dark:border-white/10 bg-slate-100/50 dark:bg-black/30 shrink-0">
                
                {/* User Profile Info Card */}
                <div className="flex items-center gap-3 bg-white/40 dark:bg-white/5 p-3 rounded-2xl border border-slate-300/15 dark:border-zinc-800/40">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt="user profile avatar miniature file"
                    className="w-10 h-10 object-cover rounded-full border border-gray-400/35 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black truncate text-[#1a1a1a] dark:text-[#f5f2ed] leading-tight font-serif italic">
                      {currentUser?.name || (language === 'fr' ? 'Visiteur' : language === 'ar' ? 'زائر' : 'Guest Traveler')}
                    </p>
                    <p className="text-[10px] font-mono truncate text-gray-500 mt-0.5 leading-none">
                      {currentUser?.email || 'guest@rahala-dz.com'}
                    </p>
                    
                    <div className="mt-2 flex flex-wrap gap-1 leading-none">
                      <span className="inline-block px-2.5 py-0.5 text-[8px] font-mono font-black uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450 rounded-full border border-emerald-500/20">
                        Rôle: {currentUser?.role?.toUpperCase() || 'GUEST'}
                      </span>
                      {currentUser?.isPremium && (
                        <span className="inline-block px-2 py-0.5 text-[8px] font-mono font-bold uppercase bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 rounded-full animate-pulse">
                          ★ VIP Gold
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Instant preview triggers for layout inspectors */}
                {currentUser && (
                  <div className="mt-3 grid grid-cols-2 gap-1.5 leading-none">
                    <button
                      onClick={toggleUserRole}
                      className="px-2 py-1.5 text-[8px] font-mono font-extrabold text-slate-800 dark:text-zinc-300 bg-white/40 dark:bg-zinc-900 border border-slate-300/35 dark:border-zinc-800 rounded-lg text-center cursor-pointer hover:border-emerald-500/25 select-none"
                      title="Basculer le rôle pour l'inspection"
                    >
                      🔄 Test Rôle
                    </button>
                    <button
                      onClick={togglePremium}
                      className={`px-2 py-1.5 text-[8px] font-mono font-extrabold border rounded-lg text-center cursor-pointer transition select-none ${
                        currentUser.isPremium
                          ? 'bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/35 shadow-xs'
                          : 'bg-white/40 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-300/25 dark:border-zinc-800'
                      }`}
                      title="Basculer l'accès VIP Gold pour l'inspection"
                    >
                      ★ Test VIP Play
                    </button>
                  </div>
                )}

                {/* Se Déconnecter / Se Connecter Button */}
                {currentUser ? (
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      window.location.hash = '#/landing';
                      setMenuOpen(false);
                    }}
                    className="w-full mt-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-white dark:text-rose-400 rounded-xl transition font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-red-500/10 hover:-translate-y-0.5 active:translate-y-0 duration-300"
                    title="Déconnecter RAHLA"
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
                    className="w-full mt-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-500/10 hover:-translate-y-0.5 active:translate-y-0 duration-300"
                    title="Se connecter à RAHLA"
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

      {/* 🪙 MOBILE CURRENCY CONVERTER MODAL OVERLAY */}
      <AnimatePresence>
        {converterModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConverterModalOpen(false)}
              className="fixed inset-0 bg-slate-950/65 dark:bg-black/80 backdrop-blur-xs cursor-pointer"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative bg-white dark:bg-[#121418] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10"
            >
              {/* Close Button "X" inside top-corner */}
              <button
                onClick={() => setConverterModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition duration-200 cursor-pointer z-20"
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
