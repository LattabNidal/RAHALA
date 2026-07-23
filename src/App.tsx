import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import androidChrome from './assets/images/android-chrome-512x512.png';
import rahalaHeroBanner from './assets/images/rahala_hero_banner_1784119916854.jpg';
import rahalaLogo from './assets/images/android-chrome-512x512.png';
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
import { DashboardLayout } from './components/admin/DashboardLayout';
import { AuthModule } from './components/AuthModule';
import RahalaLanding from './components/rahala/RahalaLanding';
import { DirectionController } from './components/DirectionController';
import { SafeTravel } from './components/SafeTravel';
import { RealPhotoExplorer } from './components/RealPhotoExplorer';
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
            'real-photos': 'real-photos',
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
          const matchedTab = ['explore', 'digital-twin', 'map', 'hotels', 'taxis', 'ai-guide', 'real-photos', 'safe-travel', 'social', 'billing', 'dashboard', 'admin'].find(tab => hash === `#/${tab}`);
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
          const matchedTab = ['explore', 'digital-twin', 'map', 'hotels', 'taxis', 'ai-guide', 'real-photos', 'safe-travel', 'social', 'billing', 'dashboard'].find(tab => hash === `#/${tab}`);
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
          'real-photos': '#/real-photos',
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
      const knownTabs = ['digital-twin', 'map', 'hotels', 'taxis', 'ai-guide', 'real-photos', 'safe-travel', 'social', 'billing', 'dashboard'];
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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-center p-6 animate-fade-in" id="global-verifier-loader">
        <div className="space-y-6 relative max-w-sm">
          {/* Animated Gold/Blue Compass Icon */}
          <div className="w-20 h-20 bg-white border border-[#E2E8F0] text-[#3B82F6] rounded-full flex items-center justify-center mx-auto shadow-sm animate-spin-slow">
            <Compass size={40} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-black tracking-widest text-[#334155]">
              RAHALA 🇩🇿
            </h1>
            <p className="text-xs font-mono font-bold tracking-widest text-[#3B82F6] uppercase">
              Vérification de la session...
            </p>
          </div>
          <p className="text-[10px] text-[#94A3B8] font-serif leading-relaxed italic">
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
        <RahalaLanding 
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
        <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center transition-colors duration-300" id="global-auth-guard-unauthenticated">
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
    <div className="bg-[#F8FAFC] text-[#334155] min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans relative">
      
      {/* React 19 SEO Metadata Injection */}
      <SEOHead 
        title="Rahala - Découvrez l’Algérie, tourisme & plateforme IA" 
        description="Rahala : Guide intelligent et plateforme basée sur l'IA pour explorer l'Algérie, réserver des hôtels, hébergements et taxis locaux." 
        canonicalUrl="https://www.rahala-dz.com/" 
        noindex={currentUser ? true : false} 
      />

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
          <div className="animate-fade-in bg-[#F8FAFC]">
            {/* Clean Trivago-Style Hero Section with background image */}
            <div className="relative py-16 sm:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0] transition-colors overflow-hidden">
              {/* Hero background image integration */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={rahalaHeroBanner} 
                  alt="RAHALA Premium Hero Banner" 
                  className="w-full h-full object-cover object-center transform scale-100 duration-1000"
                  referrerPolicy="no-referrer"
                />
                {/* Modern soft white-to-light gradient overlay to wash out details for perfect readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-[#F8FAFC]/80 to-[#F8FAFC]"></div>
              </div>

              <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center">
                
                {/* Floating Glassmorphic Content Card - Showcases the image fully around it while keeping UI interactive and readable */}
                <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-6 sm:p-10 rounded-[24px] shadow-lg shadow-blue-500/5 max-w-3xl w-full flex flex-col items-center text-center">
                  {/* Clean Simplified Brand Identifier */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-[#E2E8F0] shadow-md bg-white p-1">
                      <img 
                        src={rahalaLogo} 
                        alt="RAHALA Logo Centered" 
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    {/* Standard small flat badges */}
                    <div className="absolute -bottom-1 -left-1 bg-[#3B82F6] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider select-none shadow-sm">
                      Algérie 🇩🇿
                    </div>
                  </div>

                  {/* Slogan title styled with highly readable gorgeous fonts */}
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-[#334155] mb-3 uppercase font-serif">
                    {t('appName')}
                  </h1>
                  
                  {/* Beautiful clean slogan display */}
                  <h2 className="text-lg sm:text-xl font-serif font-bold italic text-[#3B82F6] mb-4">
                    Découvrez l’Algérie autrement
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl mx-auto leading-relaxed mb-6 font-sans">
                    {t('welcomeSubtitle')}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mt-4">
                    <button
                      onClick={() => setActiveView('digital-twin')}
                      className="w-full sm:w-auto px-6 py-3 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-xl shadow-sm cursor-pointer hover:scale-103 active:scale-95 duration-200"
                    >
                      🚀 Lancer l'expérience 3D
                    </button>
                    <button
                      onClick={() => setActiveView('map')}
                      className="w-full sm:w-auto px-6 py-3 bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#334155] font-bold text-xs uppercase tracking-wider transition-all rounded-xl shadow-sm cursor-pointer hover:scale-103 active:scale-95 duration-200"
                    >
                      🗺️ Ouvrir la carte interactive
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Bento Highlights of premium modules */}
            <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 bg-[#F8FAFC]">
              
              <div className="text-center max-w-xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#334155]">
                  Core Pillars of Algeria Stays
                </h2>
                <p className="text-[10px] uppercase font-mono font-bold text-[#3B82F6] tracking-widest mt-2">
                  Immersive engineering from Casbah to Sahara oasis
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: 3D Twin - Soft Blue Theme */}
                <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 flex flex-col justify-between hover:border-[#3B82F6] hover:shadow-md transition duration-300">
                  <div>
                    <div className="w-12 h-12 bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/25 rounded-xl flex items-center justify-center mb-6">
                      <Compass size={22} className="animate-spin-slow" />
                    </div>
                    <h3 className="text-xl font-serif font-black text-[#334155] mb-3">3D Digital Twin Gaze</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed font-sans font-medium">
                      Immerse yourself inside high fidelity simulated 3D panoramas of Algiers Casbah, Trajan roman arches of Timgad, and Constantine cliff edges.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveView('digital-twin')} 
                    className="mt-8 text-xs font-mono uppercase tracking-wider font-extrabold text-[#3B82F6] hover:text-[#22D3EE] self-start cursor-pointer focus:outline-none"
                  >
                    Go Virtual Twin &rarr;
                  </button>
                </div>

                {/* Card 2: AI Guide - Soft Orange Theme */}
                <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 flex flex-col justify-between hover:border-[#FDBA74] hover:shadow-md transition duration-300">
                  <div>
                    <div className="w-12 h-12 bg-[#FDBA74]/15 text-[#3B82F6] border border-[#FDBA74]/25 rounded-xl flex items-center justify-center mb-6">
                      <Sparkles size={22} className="text-[#3B82F6]" />
                    </div>
                    <h3 className="text-xl font-serif font-black text-[#334155] mb-3">Gemini AI Local Guide</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed font-sans font-medium">
                      Query our live generative companion, structured on top of Gemini 3.5, holding wisdom of local languages, transport prices, and recipes.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveView('ai-guide')} 
                    className="mt-8 text-xs font-mono uppercase tracking-wider font-extrabold text-[#3B82F6] hover:text-[#22D3EE] self-start cursor-pointer focus:outline-none"
                  >
                    Consult guide &rarr;
                  </button>
                </div>

                {/* Card 3: Booking hub - Light Cyan Theme */}
                <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 flex flex-col justify-between hover:border-[#22D3EE] hover:shadow-md transition duration-300">
                  <div>
                    <div className="w-12 h-12 bg-[#22D3EE]/10 text-[#3B82F6] border border-[#22D3EE]/25 rounded-xl flex items-center justify-center mb-6">
                      <Hotel size={22} className="text-[#3B82F6]" />
                    </div>
                    <h3 className="text-xl font-serif font-black text-[#334155] mb-3">Transit & Stays Hub</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed font-sans font-medium">
                      Secure room retreats in top Algeria luxury hotels in Algiers/Oran, estimate regional taxi fares, and map corridors in DZD.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveView('hotels')} 
                    className="mt-8 text-xs font-mono uppercase tracking-wider font-extrabold text-[#3B82F6] hover:text-[#22D3EE] self-start cursor-pointer focus:outline-none"
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

              <div className="mt-16 sm:mt-24 pt-12 border-t border-[#E2E8F0]">
                <Subscription />
              </div>

              {/* 🟢 NEW SECTION 1: Explore Top Cities */}
              <div className="mt-16 sm:mt-24 pt-12 border-t border-[#E2E8F0]">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"></span>
                      <p className="text-[10px] uppercase font-mono font-black text-[#3B82F6] tracking-widest flex items-center gap-1">
                        <Sparkles size={11} className="text-[#3B82F6]" /> Recommandé par Rahala AI
                      </p>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#334155]">
                      Explore Top Cities
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1 max-w-xl">
                      Immersez-vous dans les joyaux les plus recherchés d'Algérie, personnalisés selon vos habitudes de voyage.
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-2 items-center text-xs font-mono text-[#94A3B8]">
                    <span className="inline-block px-2 py-1 rounded bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] uppercase font-black tracking-widest">
                      Powered by AI
                    </span>
                  </div>
                </div>

                {/* Horizontal scrollable carousel */}
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-blue-200 snap-x">
                  
                  {/* City Card 1: Algiers (Capital) */}
                  <div className="relative group min-w-[280px] sm:min-w-[340px] h-[400px] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ease-out snap-start flex flex-col justify-end p-6 border border-[#E2E8F0] hover:scale-[1.02]">
                    {/* Background photo */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=800&q=80" 
                        alt="Algiers Skyline at Sunset"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Soft bright gradient overlay to wash details slightly while retaining beauty */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                    </div>

                    {/* AI Badge inside top-left corner */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1 bg-[#3B82F6] text-[10px] text-white font-mono font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                        <Sparkles size={10} className="animate-pulse" /> Recommended
                      </span>
                    </div>

                    {/* Personalisation details inside top-right corner */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 bg-white/90 text-[9px] text-[#334155] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#E2E8F0] backdrop-blur-md">
                        <span>✨</span> High-Match IA
                      </span>
                    </div>

                    {/* Card Content body */}
                    <div className="relative z-10 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-4 rounded-2xl shadow-sm">
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#334155] leading-tight mb-1">
                        Algiers
                      </h3>
                      <p className="text-[11px] text-[#94A3B8] mb-4 font-sans font-medium">
                        Discover the capital of Algeria
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[#3B82F6] tracking-wider uppercase font-extrabold flex items-center gap-1">
                          <Sparkles size={10} /> Match Score: 98.7%
                        </span>
                        <button
                          onClick={() => setActiveView('map')}
                          className="px-4 py-2 bg-[#3B82F6] hover:bg-[#3B82F6]/95 text-white text-xs font-black rounded-full transition shadow-sm active:scale-95 cursor-pointer"
                        >
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* City Card 2: Oran (Coastal City) */}
                  <div className="relative group min-w-[280px] sm:min-w-[340px] h-[400px] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ease-out snap-start flex flex-col justify-end p-6 border border-[#E2E8F0] hover:scale-[1.02]">
                    {/* Background photo */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80" 
                        alt="Oran Coastline Mediterranean"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Soft bright gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                    </div>

                    {/* AI Highlight Badge */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="inline-flex items-center gap-1 bg-[#22D3EE] text-[10px] text-[#334155] font-mono font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                        🔥 Best Choice
                      </span>
                    </div>

                    {/* Top Right Rating badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 bg-[#3B82F6]/90 text-[9px] text-white font-mono font-black px-2.5 py-1 rounded-full shadow-sm">
                        ★ Coastal Energy
                      </span>
                    </div>

                    {/* Card Content body */}
                    <div className="relative z-10 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-4 rounded-2xl shadow-sm">
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#334155] leading-tight mb-1">
                        Oran
                      </h3>
                      <p className="text-[11px] text-[#94A3B8] mb-4 font-sans font-medium">
                        Feel the coastal energy
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[#3B82F6] tracking-wider uppercase font-extrabold flex items-center gap-1">
                          <Sparkles size={10} /> Match Score: 99.4%
                        </span>
                        <button
                          onClick={() => setActiveView('map')}
                          className="px-4 py-2 bg-[#3B82F6] hover:bg-[#3B82F6]/95 text-white text-xs font-black rounded-full transition shadow-sm active:scale-95 cursor-pointer"
                        >
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 🟡 NEW SECTION 2: Special Promotions */}
              <div className="mt-16 sm:mt-24 pt-12 border-t border-[#E2E8F0] mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></span>
                      <p className="text-[10px] uppercase font-mono font-black text-[#3B82F6] tracking-widest flex items-center gap-1">
                        🔥 Offres exclusives de saison
                      </p>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#334155]">
                      Special Promotions
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1 max-w-xl">
                      Saisissez des expériences inoubliables à des tarifs optimisés par notre moteur d'IA. Réservez maintenant pour sécuriser vos places.
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-extrabold bg-[#3B82F6]/10 text-[#3B82F6] px-3 py-1.5 rounded-full border border-[#3B82F6]/20">
                      💡 Powered by AI Personalization Engine
                    </span>
                  </div>
                </div>

                {/* Promotional Horizontal Carousel */}
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-blue-200 snap-x">
                  
                  {/* Promo Card 1: Sahara Adventure */}
                  <div className="relative group min-w-[260px] sm:min-w-[300px] h-[340px] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ease-out snap-start flex flex-col justify-end p-5 border border-[#E2E8F0] hover:scale-[1.01]">
                    {/* Background photo */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80" 
                        alt="Sahara desert experience"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center bg-[#3B82F6] text-white font-mono font-black text-[10px] px-2.5 py-1 rounded-lg tracking-wider shadow-sm">
                        -20% OFF
                      </span>
                    </div>

                    {/* Special label */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-[#22D3EE] text-[#334155] font-mono font-black text-[8px] uppercase px-2 py-0.5 rounded shadow-sm border border-[#22D3EE]/30">
                        ★ Best Value
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-4 rounded-xl shadow-sm">
                      <h3 className="text-lg sm:text-xl font-serif font-black text-[#334155] leading-tight mb-1">
                        Sahara Adventure
                      </h3>
                      <p className="text-[11px] text-[#3B82F6] font-serif leading-snug mb-3">
                        عيش تجربة الصحراء الفريدة
                      </p>
                      
                      <div className="flex items-end justify-between border-t border-[#E2E8F0] pt-3">
                        <div>
                          <p className="text-[8px] uppercase font-mono text-[#94A3B8]">Prix exclusif</p>
                          <p className="text-[#334155] text-xs font-mono font-black">
                            <span className="line-through text-[#94A3B8] text-[10px] mr-1">24,500 DZD</span> 19,600 DZD
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveView('hotels')}
                          className="px-4 py-1.5 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-[10px] font-bold rounded-lg transition shadow-sm cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Promo Card 2: Oran Beach Escape */}
                  <div className="relative group min-w-[260px] sm:min-w-[300px] h-[340px] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ease-out snap-start flex flex-col justify-end p-5 border border-[#E2E8F0] hover:scale-[1.01]">
                    {/* Background photo */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80" 
                        alt="Oran beach escape"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center bg-[#3B82F6] text-white font-mono font-black text-[10px] px-2.5 py-1 rounded-lg tracking-wider shadow-sm">
                        -15% OFF
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-4 rounded-xl shadow-sm">
                      <h3 className="text-lg sm:text-xl font-serif font-black text-[#334155] leading-tight mb-1">
                        Oran Beach Escape
                      </h3>
                      <p className="text-[11px] text-[#3B82F6] font-serif leading-snug mb-3">
                        Relax by the Mediterranean الساحل
                      </p>
                      
                      <div className="flex items-end justify-between border-t border-[#E2E8F0] pt-3">
                        <div>
                          <p className="text-[8px] uppercase font-mono text-[#94A3B8]">Prix exclusif</p>
                          <p className="text-[#334155] text-xs font-mono font-black">
                            <span className="line-through text-[#94A3B8] text-[10px] mr-1">16,500 DZD</span> 14,025 DZD
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveView('hotels')}
                          className="px-4 py-1.5 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-[10px] font-bold rounded-lg transition shadow-sm cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Promo Card 3: Algiers Cultural Tour */}
                  <div className="relative group min-w-[260px] sm:min-w-[300px] h-[340px] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ease-out snap-start flex flex-col justify-end p-5 border border-[#E2E8F0] hover:scale-[1.01]">
                    {/* Background photo */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="/src/assets/images/casbah_d_alger/site_0565_0017-1000-1481-20140721144417.webp" 
                        alt="Algiers casbah cultural escape"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center bg-[#3B82F6] text-white font-mono font-black text-[10px] px-2.5 py-1 rounded-lg tracking-wider shadow-sm">
                        -15% OFF
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10 bg-white/95 backdrop-blur-md border border-[#E2E8F0] p-4 rounded-xl shadow-sm">
                      <h3 className="text-lg sm:text-xl font-serif font-black text-[#334155] leading-tight mb-1">
                        Algiers Cultural Tour
                      </h3>
                      <p className="text-[11px] text-[#3B82F6] font-serif leading-snug mb-3">
                        Exploration de la Casbah historique
                      </p>
                      
                      <div className="flex items-end justify-between border-t border-[#E2E8F0] pt-3">
                        <div>
                          <p className="text-[8px] uppercase font-mono text-[#94A3B8]">Prix exclusif</p>
                          <p className="text-[#334155] text-xs font-mono font-black">
                            <span className="line-through text-[#94A3B8] text-[10px] mr-1">11,500 DZD</span> 9,775 DZD
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveView('hotels')}
                          className="px-4 py-1.5 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-[10px] font-bold rounded-lg transition shadow-sm cursor-pointer"
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

        {/* VIEW 6A: REAL PHOTO EXPLORER */}
        {activeView === 'real-photos' && <RealPhotoExplorer />}

        {/* VIEW 6B: RAHALA SAFE TRAVEL INSURANCE */}
        {activeView === 'safe-travel' && <SafeTravel />}

        {/* VIEW 6C: RAHALA SOCIAL CLUB COMMUNITY FORUM */}
        {activeView === 'social' && <SocialClub />}

        {/* VIEW 7: USER EXPANSION PANEL */}
        {activeView === 'dashboard' && <UserDashboard setActiveView={setActiveView} />}

        {/* VIEW 7B: SECURED PAYMENTS & BILLING PORTAL */}
        {activeView === 'billing' && <PaymentsSubscriptions />}

        {/* VIEW 8: ADMINISTRATIVE PANEL */}
        {activeView === 'admin' && <DashboardLayout />}

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
        <DirectionController />
        <RihlaApp />
      </AppProvider>
    </LanguageProvider>
  );
}
