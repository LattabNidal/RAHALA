import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { DigitalTwin } from './components/DigitalTwin';
import { InteractiveMap } from './components/InteractiveMap';
import { AIGuide } from './components/AIGuide';
import { BookingModule } from './components/BookingModule';
import { TaxiBooking } from './components/TaxiBooking';
import { Subscription } from './components/Subscription';
import { PaymentsSubscriptions } from './components/PaymentsSubscriptions';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModule } from './components/AuthModule';
import { LandingPage } from './components/LandingPage';
import { SafeTravel } from './components/SafeTravel';
import { SEOHead } from './SEOHead';
import { WeatherWidget } from './components/WeatherWidget';
import { SmartTravelGuide } from './components/SmartTravelGuide';
import { PromoVideo } from './components/PromoVideo';
import { SocialClub } from './components/SocialClub';
import { mockLandmarks } from './data/mockData';
import { Sparkles, Heart, Compass, Star, ChevronLeft, ChevronRight, BookOpen, Hotel, Moon, Sun, ShieldCheck } from 'lucide-react';

function RihlaApp() {
  const { t, isRtl, language } = useLanguage();
  const { currentUser } = useApp();
  
  const [activeView, setActiveView] = useState('landing');
  const [darkMode, setDarkMode] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isSessionVerifying, setIsSessionVerifying] = useState(true);

  // Simulate global AuthService style verification at app startup (Bonus Loader)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSessionVerifying(false);
    }, 950);
    return () => clearTimeout(timer);
  }, []);

  // Sync URL hash with component routing views & handle the global AuthGuard
  useEffect(() => {
    if (isSessionVerifying) return;

    const handleHashSync = () => {
      const hash = window.location.hash;

      // 1. IF NO USER IS LOGGED IN (AuthGuard: lock restricted views, permit public views)
      if (!currentUser) {
        if (!hash || hash === '#/' || hash === '#' || hash === '#/landing' || hash === '#landing') {
          setActiveView('landing');
        } else if (
          hash === '#/auth' || hash === '#auth' ||
          hash === '#/login' || hash === '#login' ||
          hash === '#/signup' || hash === '#signup' ||
          hash === '#/register' || hash === '#register'
        ) {
          setActiveView('auth');
        } else {
          const cleanHash = hash.replace('#/', '').replace('#', '');
          const publicTabsMap: Record<string, string> = {
            'home': 'explore',
            'explore': 'explore',
            'digital-twin': 'digital-twin',
            'map': 'map',
            'hotels': 'hotels',
            'taxis': 'taxis',
            'ai-guide': 'ai-guide',
            'safe-travel': 'safe-travel',
            'social': 'social'
          };
          
          if (cleanHash in publicTabsMap) {
            setActiveView(publicTabsMap[cleanHash]);
          } else if (['dashboard', 'billing', 'admin', 'admin-dashboard'].includes(cleanHash)) {
            // Restricted views direct access redirects to /login
            window.location.hash = '#/login';
            setActiveView('auth');
          } else {
            // Default fallback
            setActiveView('landing');
          }
        }
        return;
      }

      // 2. IF USER IS LOGGED IN, GUARD PERMISSIONS & ROUTING LOGIC
      // Admin guard
      if (currentUser.role === 'admin') {
        if (hash === '#/admin-dashboard' || hash === '#admin-dashboard' || hash === '#/admin' || hash === '#admin') {
          setActiveView('admin');
        } else if (hash === '#/home' || hash === '#home') {
          setActiveView('explore'); // Defaults to main explore page with the RAHLA logo container
        } else if (hash === '#/landing' || hash === '#/auth' || hash === '#/login' || hash === '#/signup' || !hash) {
          window.location.hash = '#/admin-dashboard';
          setActiveView('admin');
        } else {
          // Permit accessing regular tabs with normal hash
          const matchedTab = ['explore', 'digital-twin', 'map', 'hotels', 'taxis', 'ai-guide', 'safe-travel', 'social', 'billing', 'dashboard', 'admin'].find(tab => hash === `#/${tab}`);
          if (matchedTab) {
            setActiveView(matchedTab);
          }
        }
      } 
      // Regular User guard
      else {
        if (
          hash === '#/admin' || hash === '#admin' ||
          hash === '#/admin-dashboard' || hash === '#admin-dashboard'
        ) {
          // Block regular users from admin screens completely -> force redirect /home
          window.location.hash = '#/home';
          setActiveView('explore');
        } else if (hash === '#/home' || hash === '#home') {
          setActiveView('explore');
        } else if (hash === '#/landing' || hash === '#/auth' || hash === '#/login' || hash === '#/signup' || !hash) {
          window.location.hash = '#/home';
          setActiveView('explore');
        } else {
          // Permit standard tab switches
          const matchedTab = ['explore', 'digital-twin', 'map', 'hotels', 'taxis', 'ai-guide', 'safe-travel', 'social', 'billing', 'dashboard'].find(tab => hash === `#/${tab}`);
          if (matchedTab) {
            setActiveView(matchedTab);
          }
        }
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, [isSessionVerifying, currentUser]);

  // Sync internal activeView changes back into URL hashes
  useEffect(() => {
    if (isSessionVerifying) return;

    if (!currentUser) {
      if (activeView === 'landing') {
        if (window.location.hash !== '#/landing') window.location.hash = '#/landing';
      } else if (activeView === 'auth') {
        if (
          window.location.hash !== '#/auth' &&
          window.location.hash !== '#/login' &&
          window.location.hash !== '#/signup'
        ) {
          window.location.hash = '#/auth';
        }
      } else {
        // Sync public guest views to URL hashes
        const publicHashesMap: Record<string, string> = {
          'explore': '#/home',
          'digital-twin': '#/digital-twin',
          'map': '#/map',
          'hotels': '#/hotels',
          'taxis': '#/taxis',
          'ai-guide': '#/ai-guide',
          'safe-travel': '#/safe-travel',
          'social': '#/social'
        };
        if (activeView in publicHashesMap) {
          const targetHash = publicHashesMap[activeView];
          if (window.location.hash !== targetHash) {
            window.location.hash = targetHash;
          }
        }
      }
      return;
    }

    // Authenticated syncing
    if (activeView === 'admin' && currentUser.role === 'admin') {
      if (window.location.hash !== '#/admin-dashboard') window.location.hash = '#/admin-dashboard';
    } else if (activeView === 'explore') {
      // User main
      if (window.location.hash !== '#/home' && window.location.hash !== '#/explore') {
        window.location.hash = '#/home';
      }
    } else {
      const knownTabs = ['digital-twin', 'map', 'hotels', 'taxis', 'ai-guide', 'safe-travel', 'social', 'billing', 'dashboard'];
      if (knownTabs.includes(activeView)) {
        if (window.location.hash !== `#/${activeView}`) {
          window.location.hash = `#/${activeView}`;
        }
      }
    }
  }, [activeView, currentUser, isSessionVerifying]);

  // Loading Screen (Bonus)
  if (isSessionVerifying) {
    return (
      <div className="min-h-screen bg-[#0d2218] flex flex-col items-center justify-center text-center p-6 animate-fade-in" id="global-verifier-loader">
        <div className="space-y-6 relative max-w-sm">
          {/* Animated Gold/Emerald Compass Icon */}
          <div className="w-20 h-20 bg-emerald-950/40 border-2 border-[#d4af37] text-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-2xl animate-spin-slow">
            <Compass size={40} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-black tracking-widest text-[#d4af37]">
              RAHALA 🇩🇿
            </h1>
            <p className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Vérification de la session...
            </p>
          </div>
          <p className="text-[10px] text-emerald-500/60 font-serif leading-relaxed italic">
            "Le voyageur va là où son cœur se pose." - Voyagez l’Algérie autrement
          </p>
        </div>
      </div>
    );
  }

  // Authentication gate simulator (Permit landing and login states early; others fallback to layout)
  if (!currentUser) {
    if (activeView === 'landing') {
      return (
        <LandingPage 
          onEnterAuth={(phase) => {
            if (phase === 'register') {
              window.location.hash = '#/signup';
            } else {
              window.location.hash = '#/login';
            }
            setActiveView('auth');
          }} 
        />
      );
    }

    if (activeView === 'auth') {
      return (
        <div className={`${darkMode ? 'dark bg-[#111111]' : 'bg-[#f5f2ed]'} min-h-screen flex items-center justify-center transition-colors duration-300`} id="global-auth-guard-unauthenticated">
          <AuthModule onSuccess={(targetRole) => {
            if (targetRole === 'admin') {
              window.location.hash = '#/admin-dashboard';
              setActiveView('admin');
            } else {
              window.location.hash = '#/home';
              setActiveView('explore');
            }
          }} />
        </div>
      );
    }
  }

  return (
    <div className={`${darkMode ? 'dark bg-[#111111]/75 text-[#f5f2ed]' : 'bg-[#f5f2ed]/65 text-[#1a1a1a]'} min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans relative`}>
      
      {/* React 19 SEO Metadata Injection */}
      <SEOHead 
        title="Rahala - Découvrez l’Algérie, tourisme & plateforme IA" 
        description="Rahala : Guide intelligent et plateforme basée sur l'IA pour explorer l'Algérie, réserver des hôtels, hébergements et taxis locaux." 
        canonicalUrl="https://www.rahala-dz.com/" 
        noindex={currentUser ? true : false} 
      />
      
      {/* Full-screen Immersive fixed RAHALA promotional background image */}
      <div className="fixed inset-0 -z-50 pointer-events-none select-none overflow-hidden">
        <img 
          src="/src/assets/images/rahala_logo_1781612694384.jpg" 
          alt="RAHALA Background Image"
          className="w-full h-full object-cover filter blur-[4px] brightness-[0.52] dark:brightness-[0.38] transition-all duration-1000 animate-zoom-slow"
          referrerPolicy="no-referrer"
        />
        {/* Dark vertical gradient overlay to ensure ultimate accessibility & pristine text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/45 via-transparent to-[#111111]/85"></div>
      </div>

      {/* Dynamic multi-language navigation layout */}
      <Navigation 
        activeView={activeView} 
        setActiveView={setActiveView} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />

      {/* Main viewport block controller */}
      <main className="flex-1">
        
        {/* VIEW 1: EXPLORE LANDING HERO */}
        {activeView === 'explore' && (
          <div className="animate-fade-in">
            {/* Immersive Algerian Sahara Sunset Hero Section */}
            <div className="relative h-[500px] sm:h-[560px] flex items-center justify-center overflow-hidden border-b border-[#1a1a1a]/15 dark:border-white/10">
              <div className="absolute inset-0 z-0 select-none">
                <img 
                  src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1800&q=80" 
                  alt="Algerian golden Sahara desert dunes"
                  className="w-full h-full object-cover transition duration-1000 scale-100"
                  style={{ filter: 'brightness(0.35) contrast(1.1)' }}
                />
                {/* Vintage vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/45 to-transparent"></div>
              </div>

              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white flex flex-col items-center">
                
                {/* ADVANCED BRAND HERO IDENT - LOGO BIEN EN AVANT */}
                <div className="relative mb-8 group">
                  {/* Outer vibrant animated glowing rings (representing Emerald Green & Crescent Red of Algeria) */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 via-white to-red-650 rounded-full blur-xl opacity-80 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-[#d4af37] to-red-600 rounded-full opacity-90 group-hover:scale-105 transition duration-500"></div>
                  
                  {/* Central branding mask */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-[3px] border-white shadow-2xl bg-slate-900">
                    <img 
                      src="/src/assets/images/rahala_logo_1781612694384.jpg" 
                      alt="RAHALA Logo Centered" 
                      className="w-full h-full object-cover transform scale-102 hover:scale-110 transition duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Interactive status pill badges in beautiful vibrant tones */}
                  <div className="absolute -bottom-2 -left-2 bg-emerald-600 text-white text-[9px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-450 shadow-lg select-none">
                    ★ Algérie
                  </div>
                  <div className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-500 shadow-lg select-none">
                    Immersif 3D
                  </div>
                </div>

                {/* Slogan title styled with highly readable gorgeous fonts */}
                <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-none mb-4 drop-shadow-lg">
                  <span className="bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
                    RAHALA
                  </span>
                </h1>
                
                {/* Beautiful luxury slogan display */}
                <h2 className="text-2xl sm:text-4xl font-serif font-black italic tracking-wide text-white leading-tight mb-4 drop-shadow-md">
                  Découvrez l’Algérie autrement
                </h2>
                
                <p className="text-xs sm:text-sm text-gray-200/95 max-w-2xl mx-auto leading-relaxed mb-8 font-serif">
                  {t('welcomeSubtitle')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveView('digital-twin')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-750 text-white hover:from-emerald-700 hover:to-emerald-850 font-mono font-extrabold text-xs uppercase tracking-widest border border-emerald-500 transition-all rounded-xs shadow-lg shadow-emerald-600/30 active:scale-97 cursor-pointer"
                  >
                    🚀 Lancer l'expérience 3D
                  </button>
                  <button
                    onClick={() => setActiveView('map')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 font-mono font-extrabold text-xs uppercase tracking-widest border border-red-500 transition-all rounded-xs shadow-lg shadow-red-650/30 active:scale-97 cursor-pointer"
                  >
                    🗺️ Ouvrir la carte interactive
                  </button>
                </div>
              </div>
            </div>

            {/* Core Bento Highlights of premium modules */}
            <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
              
              <div className="text-center max-w-xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold italic tracking-tight text-[#1a1a1a] dark:text-[#f5f2ed]">
                  Core Pillars of Algeria Stays
                </h2>
                <p className="text-[10px] uppercase font-mono font-semibold text-[#d4af37] tracking-widest mt-2">
                  Immersive engineering from Casbah to Sahara oasis
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: 3D Twin - Emerald Green Theme */}
                <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-500/10 dark:border-emerald-500/15 rounded-xl p-8 flex flex-col justify-between hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 transition duration-300">
                  <div>
                    <div className="w-12 h-12 bg-emerald-600 dark:bg-emerald-500 text-white border border-emerald-500/30 rounded-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-600/25">
                      <Compass size={22} className="animate-spin-slow" />
                    </div>
                    <h3 className="text-xl font-serif font-black text-emerald-800 dark:text-emerald-400 mb-3">3D Digital Twin Gaze</h3>
                    <p className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed font-sans">
                      Immerse yourself inside high fidelity simulated 3D panoramas of Algiers Casbah, Trajan roman arches of Timgad, and Constantine cliff edges.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveView('digital-twin')} 
                    className="mt-8 text-xs font-mono uppercase tracking-wider font-extrabold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 self-start cursor-pointer"
                  >
                    Go Virtual Twin &rarr;
                  </button>
                </div>

                {/* Card 2: AI Guide - Sahara Gold Theme */}
                <div className="bg-amber-50/30 dark:bg-amber-950/10 border border-amber-500/10 dark:border-amber-500/15 rounded-xl p-8 flex flex-col justify-between hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/5 transition duration-300">
                  <div>
                    <div className="w-12 h-12 bg-amber-500 text-white border border-amber-400/30 rounded-lg flex items-center justify-center mb-6 shadow-md shadow-amber-500/25">
                      <Sparkles size={22} />
                    </div>
                    <h3 className="text-xl font-serif font-black text-amber-800 dark:text-[#d4af37] mb-3">Gemini AI Local Guide</h3>
                    <p className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed font-sans">
                      Query our live generative companion, structured on top of Gemini 3.5, holding wisdom of local languages, transport prices, and recipes.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveView('ai-guide')} 
                    className="mt-8 text-xs font-mono uppercase tracking-wider font-extrabold text-amber-600 hover:text-amber-700 dark:text-[#d4af37] dark:hover:text-amber-400 self-start cursor-pointer"
                  >
                    Consult guide &rarr;
                  </button>
                </div>

                {/* Card 3: Booking hub - Crescent Red Theme */}
                <div className="bg-red-50/30 dark:bg-red-950/10 border border-red-500/10 dark:border-red-500/15 rounded-xl p-8 flex flex-col justify-between hover:border-red-500 hover:shadow-xl hover:shadow-red-500/5 transition duration-300">
                  <div>
                    <div className="w-12 h-12 bg-red-600 text-white border border-red-500/30 rounded-lg flex items-center justify-center mb-6 shadow-md shadow-red-600/25">
                      <Hotel size={22} />
                    </div>
                    <h3 className="text-xl font-serif font-black text-red-800 dark:text-red-400 mb-3">Transit & Stays Hub</h3>
                    <p className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed font-sans">
                      Secure room retreats in top Algeria luxury hotels in Algiers/Oran, estimate regional taxi fares, and map corridors in DZD.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveView('hotels')} 
                    className="mt-8 text-xs font-mono uppercase tracking-wider font-extrabold text-red-650 hover:text-red-750 dark:text-red-400 dark:hover:text-red-300 self-start cursor-pointer"
                  >
                    Book hotelstay &rarr;
                  </button>
                </div>
              </div>

              {/* Cinematic Algerian Promo Video Showcase Deck */}
              <div className="mt-16 sm:mt-24">
                <PromoVideo />
              </div>

              {/* Live Real-Time Algerian Weather Widget Pinned and Loaded */}
              <div className="mt-16 sm:mt-24">
                <WeatherWidget />
              </div>

              {/* Subscriptions comparison banner shortcut */}
              <div className="mt-16 sm:mt-24 pt-12 border-t border-[#1a1a1a]/10 dark:border-white/10">
                <Subscription />
              </div>

              {/* 🟢 NEW SECTION 1: Explore Top Cities */}
              <div className="mt-16 sm:mt-24 pt-12 border-t border-[#1a1a1a]/10 dark:border-white/10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <p className="text-[10px] uppercase font-mono font-black text-emerald-600 dark:text-emerald-450 tracking-widest flex items-center gap-1">
                        <Sparkles size={11} className="text-[#d4af37]" /> Recommandé par Rahala AI
                      </p>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 dark:text-white">
                      Explore Top Cities
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                      Immersez-vous dans les joyaux les plus recherchés d'Algérie, personnalisés selon vos habitudes de voyage.
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-2 items-center text-xs font-mono text-gray-400 dark:text-gray-500">
                    <span className="inline-block px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 text-[10px] uppercase font-black tracking-widest">
                      Powered by AI
                    </span>
                  </div>
                </div>

                {/* Horizontal scrollable carousel */}
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-emerald-500 snap-x">
                  
                  {/* City Card 1: Algiers (Capital) */}
                  <div className="relative group min-w-[280px] sm:min-w-[340px] h-[400px] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 ease-out snap-start flex flex-col justify-end p-6 border border-slate-200/10 hover:scale-[1.02]">
                    {/* Background photo */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=800&q=80" 
                        alt="Algiers Skyline at Sunset"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        referrerPolicy="no-referrer"
                      />
                      {/* Deep dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    </div>

                    {/* AI Badge inside top-left corner */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1 bg-emerald-600/90 text-[10px] text-white/95 font-mono font-black uppercase px-3 py-1 rounded-full tracking-wider border border-emerald-450/40 shadow-lg shadow-emerald-500/10">
                        <Sparkles size={10} className="animate-pulse" /> Recommended
                      </span>
                    </div>

                    {/* Personalisation details inside top-right corner */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 bg-black/60 text-[9px] text-[#f5f2ed]/80 font-mono font-medium px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-xs">
                        <span>✨</span> High-Match IA
                      </span>
                    </div>

                    {/* Card Content body */}
                    <div className="relative z-10">
                      <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight mb-1">
                        Algiers
                      </h3>
                      <p className="text-[11px] text-gray-200/95 mb-4 font-sans font-medium">
                        Discover the capital of Algeria
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[#d4af37] tracking-wider uppercase font-extrabold flex items-center gap-1">
                          <Sparkles size={10} /> Match Score: 98.7%
                        </span>
                        <button
                          onClick={() => setActiveView('map')}
                          className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-slate-900 hover:text-emerald-800 text-xs font-black rounded-full transition shadow-md active:scale-95 cursor-pointer"
                        >
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* City Card 2: Oran (Coastal City) */}
                  <div className="relative group min-w-[280px] sm:min-w-[340px] h-[400px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out snap-start flex flex-col justify-end p-6 border border-emerald-500/30 hover:scale-[1.02]">
                    {/* Background photo */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" 
                        alt="Oran Coastline Mediterranean"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        referrerPolicy="no-referrer"
                      />
                      {/* Deep dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                    </div>

                    {/* AI Highlight Badge with custom modern pill pulse glow */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="inline-flex items-center gap-1 bg-[#d4af37] text-[10px] text-slate-950 font-mono font-black uppercase px-3 py-1 rounded-full tracking-wider border border-yellow-200 shadow-xl animate-pulse">
                        🔥 Best choice for you
                      </span>
                    </div>

                    {/* Top Right Rating badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 bg-red-600/90 text-[9px] text-white font-mono font-black px-2.5 py-1 rounded-full border border-red-500">
                        ★ Coastal Energy
                      </span>
                    </div>

                    {/* Card Content body */}
                    <div className="relative z-10">
                      <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight mb-1">
                        Oran
                      </h3>
                      <p className="text-[11px] text-gray-200/95 mb-4 font-sans font-medium">
                        Feel the coastal energy
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-emerald-400 tracking-wider uppercase font-extrabold flex items-center gap-1">
                          <Sparkles size={10} /> Match Score: 99.4%
                        </span>
                        <button
                          onClick={() => setActiveView('map')}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-amber-505 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-full transition shadow-md active:scale-95 cursor-pointer"
                        >
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 🟡 NEW SECTION 2: Special Promotions */}
              <div className="mt-16 sm:mt-24 pt-12 border-t border-[#1a1a1a]/10 dark:border-white/10 mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                      <p className="text-[10px] uppercase font-mono font-black text-red-650 dark:text-red-400 tracking-widest flex items-center gap-1">
                        🔥 Offres exclusives de saison
                      </p>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 dark:text-white">
                      Special Promotions
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                      Saisissez des expériences inoubliables à des tarifs optimisés par notre moteur d'IA. Réservez maintenant pour sécuriser vos places.
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-705">
                      💡 Powered by AI Personalization Engine
                    </span>
                  </div>
                </div>

                {/* Promotional Horizontal Carousel */}
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-amber-500 snap-x">
                  
                  {/* Promo Card 1: Sahara Adventure */}
                  <div className="relative group min-w-[260px] sm:min-w-[300px] h-[340px] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-out snap-start flex flex-col justify-end p-5 border border-slate-200/10 hover:scale-[1.01]">
                    {/* Background photo */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80" 
                        alt="Sahara desert experience"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center bg-red-600 text-white font-mono font-black text-[10px] px-2.5 py-1 rounded-lg tracking-wider border border-red-400 shadow-md">
                        -20% OFF
                      </span>
                    </div>

                    {/* Special label */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-amber-500/90 text-slate-950 font-mono font-black text-[8px] uppercase px-2 py-0.5 rounded border border-amber-300">
                        ★ Best Value
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10">
                      <h3 className="text-lg sm:text-xl font-serif font-black text-white leading-tight mb-1">
                        Sahara Adventure
                      </h3>
                      <p className="text-[11px] text-[#f5f2ed]/90 font-serif leading-snug mb-3">
                        عيش تجربة الصحراء الفريدة
                      </p>
                      
                      <div className="flex items-end justify-between border-t border-white/10 pt-3">
                        <div>
                          <p className="text-[8px] uppercase font-mono text-gray-400">Prix exclusif</p>
                          <p className="text-white text-xs font-mono font-black">
                            <span className="line-through text-gray-500 text-[10px] mr-1">24,500 DZD</span> 19,600 DZD
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveView('hotels')}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition shadow-md cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Promo Card 2: Oran Beach Escape */}
                  <div className="relative group min-w-[260px] sm:min-w-[300px] h-[340px] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-out snap-start flex flex-col justify-end p-5 border border-slate-200/10 hover:scale-[1.01]">
                    {/* Background photo */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80" 
                        alt="Oran beach escape"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center bg-orange-600 text-white font-mono font-black text-[10px] px-2.5 py-1 rounded-lg tracking-wider border border-orange-400 shadow-md">
                        -15% OFF
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10">
                      <h3 className="text-lg sm:text-xl font-serif font-black text-white leading-tight mb-1">
                        Oran Beach Escape
                      </h3>
                      <p className="text-[11px] text-[#f5f2ed]/90 font-serif leading-snug mb-3">
                        Relax by the Mediterranean الساحل
                      </p>
                      
                      <div className="flex items-end justify-between border-t border-white/10 pt-3">
                        <div>
                          <p className="text-[8px] uppercase font-mono text-gray-400">Prix exclusif</p>
                          <p className="text-white text-xs font-mono font-black">
                            <span className="line-through text-gray-500 text-[10px] mr-1">16,500 DZD</span> 14,025 DZD
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveView('hotels')}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition shadow-md cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Promo Card 3: Algiers Cultural Tour */}
                  <div className="relative group min-w-[260px] sm:min-w-[300px] h-[340px] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-out snap-start flex flex-col justify-end p-5 border border-slate-200/10 hover:scale-[1.01]">
                    {/* Background photo */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80" 
                        alt="Algiers casbah cultural escape"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center bg-[#d4af37] text-slate-950 font-mono font-black text-[10px] px-2.5 py-1 rounded-lg tracking-wider border border-yellow-200 shadow-md">
                        -15% OFF
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10">
                      <h3 className="text-lg sm:text-xl font-serif font-black text-white leading-tight mb-1">
                        Algiers Cultural Tour
                      </h3>
                      <p className="text-[11px] text-[#f5f2ed]/90 font-serif leading-snug mb-3">
                        Exploration de la Casbah historique
                      </p>
                      
                      <div className="flex items-end justify-between border-t border-white/10 pt-3">
                        <div>
                          <p className="text-[8px] uppercase font-mono text-gray-400">Prix exclusif</p>
                          <p className="text-white text-xs font-mono font-black">
                            <span className="line-through text-gray-500 text-[10px] mr-1">11,500 DZD</span> 9,775 DZD
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveView('hotels')}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition shadow-md cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Smart Travel Guide Advisor Section */}
              <SmartTravelGuide />

            </div>
          </div>
        )}

        {/* VIEW 2: DIGITAL TWIN DECK */}
        {activeView === 'digital-twin' && <DigitalTwin />}

        {/* VIEW 3: INTERACTIVE MAP AND TAXIS */}
        {activeView === 'map' && <InteractiveMap setActiveView={setActiveView} />}

        {/* VIEW 4: HOTEL STAYS */}
        {activeView === 'hotels' && <BookingModule setActiveView={setActiveView} />}

        {/* VIEW 5: TAXI DISPATCH */}
        {activeView === 'taxis' && <TaxiBooking />}

        {/* VIEW 6: INTELLIGENT COMPANION */}
        {activeView === 'ai-guide' && <AIGuide />}

        {/* VIEW 6B: RAHALA SAFE TRAVEL INSURANCE */}
        {activeView === 'safe-travel' && <SafeTravel />}

        {/* VIEW 6C: RAHALA SOCIAL CLUB COMMUNITY FORUM */}
        {activeView === 'social' && <SocialClub />}

        {/* VIEW 7: USER EXPANSION PANEL */}
        {activeView === 'dashboard' && <UserDashboard setActiveView={setActiveView} />}

        {/* VIEW 7B: SECURED PAYMENTS & BILLING PORTAL */}
        {activeView === 'billing' && <PaymentsSubscriptions />}

        {/* VIEW 8: ADMINISTRATIVE PANEL */}
        {activeView === 'admin' && <AdminDashboard />}

      </main>

      {/* Structured footer layout */}
      <footer className="bg-[#eae7e1]/80 dark:bg-[#121212]/80 border-t border-[#1a1a1a]/15 dark:border-white/10 py-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 dark:text-[#f5f2ed]/60 font-mono">
          <p className="mb-2 font-bold text-[#d4af37]">© 2026 Rihla DZ — Independent Algeria Chronicles</p>
          <p className="lowercase font-sans text-xs tracking-normal font-semibold text-gray-500">Secured with luxury standards and powered by state-of-the-art Gemini local intelligence.</p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <RihlaApp />
      </AppProvider>
    </LanguageProvider>
  );
}
