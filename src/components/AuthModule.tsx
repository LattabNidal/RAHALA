import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  LogIn, 
  Key, 
  Sparkles, 
  UserCheck, 
  ShieldAlert, 
  User as UserIcon, 
  Mail, 
  Lock, 
  ArrowLeft, 
  PlusCircle, 
  ShieldCheck, 
  BookOpen, 
  UserPlus, 
  Eye, 
  EyeOff, 
  Compass,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { User, Language } from '../types';

interface AuthModuleProps {
  onSuccess: (view: string) => void;
}

// Default initial accounts pre-registered for testing out-of-the-box
const DEFAULT_ACCOUNTS = [
  {
    name: 'Admin RAHLA 👨💼',
    email: 'admin@rahala.com',
    password: '1234',
    role: 'admin',
    isPremium: true,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Voyageur RAHLA 👤',
    email: 'user@rahla.dz',
    password: 'password',
    role: 'user',
    isPremium: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Nidal Lattab 🇩🇿',
    email: 'lattab.nidal@gmail.com',
    password: 'lattab.nidal@gmail.com',
    role: 'user',
    isPremium: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  }
];

export const AuthModule: React.FC<AuthModuleProps> = ({ onSuccess }) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const { setCurrentUser, addNotification } = useApp();

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  // Phase controller: 'login' | 'register'
  const [phase, setPhase] = useState<'login' | 'register'>('login');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Synchronize URL Hash with Phase State (Support /login, /signup, /auth routes)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/login' || hash === '#login') {
        setPhase('login');
      } else if (hash === '#/signup' || hash === '#/register' || hash === '#signup' || hash === '#register') {
        setPhase('register');
      } else if (hash === '#/auth' || hash === '#auth') {
        setPhase('login');
      } else {
        // Fallback to login inside auth module if none of above matches
        setPhase('login');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (phase === 'login') {
      if (window.location.hash !== '#/login' && window.location.hash !== '#/auth') {
        window.location.hash = '#/login';
      }
    } else if (phase === 'register') {
      if (window.location.hash !== '#/signup') {
        window.location.hash = '#/signup';
      }
    }
  }, [phase]);

  // Input fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [adminCode, setAdminCode] = useState('');

  // UI helpers
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  // Initialize database of users in localStorage and ensure lattab.nidal@gmail.com is fully configured
  useEffect(() => {
    const savedUsers = localStorage.getItem('rihla_registered_users');
    let usersList = [];
    if (savedUsers) {
      try {
        usersList = JSON.parse(savedUsers);
      } catch (e) {
        usersList = [...DEFAULT_ACCOUNTS];
      }
    } else {
      usersList = [...DEFAULT_ACCOUNTS];
    }

    // Force/Upsert lattab.nidal@gmail.com with requested temporary credentials
    const targetEmail = 'lattab.nidal@gmail.com';
    const index = usersList.findIndex((u: any) => u.email.toLowerCase() === targetEmail);
    if (index >= 0) {
      usersList[index].password = 'lattab.nidal@gmail.com';
      usersList[index].name = 'Nidal Lattab 🇩🇿';
      usersList[index].isPremium = true;
    } else {
      usersList.push({
        name: 'Nidal Lattab 🇩🇿',
        email: 'lattab.nidal@gmail.com',
        password: 'lattab.nidal@gmail.com',
        role: 'user',
        isPremium: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
      });
    }
    localStorage.setItem('rihla_registered_users', JSON.stringify(usersList));
  }, []);

  // Helper to fetch custom users lists
  const getRegisteredUsers = () => {
    const saved = localStorage.getItem('rihla_registered_users');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  };

  const handleApplyTestCredentials = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setErrorMessage('');
    setPhase('login');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage('Veuillez remplir tous les champs requis ⚠️');
      return;
    }

    setIsLoadingAuth(true);

    setTimeout(() => {
      let matchedUser: any = null;

      // Direct requested check: email = admin@rahala.com and password = 1234 -> ADMIN
      if (email.toLowerCase() === 'admin@rahala.com' && password === '1234') {
        matchedUser = {
          name: 'Admin RAHLA 👨💼',
          email: 'admin@rahala.com',
          role: 'admin',
          isPremium: true,
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
        };
      } else {
        const users = getRegisteredUsers();
        matchedUser = users.find(
          (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
      }

      setIsLoadingAuth(false);

      if (matchedUser) {
        const activeUser: User = {
          id: `usr-${Math.floor(Math.random() * 8999 + 1000)}`,
          email: matchedUser.email,
          name: matchedUser.name,
          role: matchedUser.role,
          isPremium: matchedUser.isPremium || false,
          avatar: matchedUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        };

        setCurrentUser(activeUser);
        addNotification(`Heureux de vous revoir, ${activeUser.name}!`);
        
        // Phase 4: Smart Redirection
        if (activeUser.role === 'admin') {
          onSuccess('admin'); // Going towards Admin Dashboard
        } else {
          onSuccess('hotels'); // Going towards Plan my trip ("Planifier mon voyage 💰" which is hotels & lodges module)
        }
      } else {
        setErrorMessage('Email ou mot de passe incorrect ❌');
      }
    }, 850);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Veuillez remplir tous les détails requis ⚠️');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas ⚠️');
      return;
    }

    // Email duplication check
    const users = getRegisteredUsers();
    const isDuplicated = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (isDuplicated) {
      setErrorMessage("Cet email est déjà enregistré.");
      return;
    }

    // SÉCURITÉ ADMIN: Pour créer un Admin
    if (role === 'admin') {
      if (adminCode !== 'RAHLA2025') {
        setErrorMessage("❌ Code administrateur incorrect. Accès admin refusé, retour au type Utilisateur.");
        setRole('user');
        setAdminCode('');
        return;
      }
    }

    setIsLoadingAuth(true);

    setTimeout(() => {
      // Create user object
      const newAccount = {
        name,
        email: email.toLowerCase(),
        password,
        role,
        isPremium: role === 'admin' ? true : false,
        avatar: role === 'admin'
          ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };

      // Save in storage
      const updatedUsersList = [...users, newAccount];
      localStorage.setItem('rihla_registered_users', JSON.stringify(updatedUsersList));

      setIsLoadingAuth(false);
      setSuccessMessage(`🎉 Compte créé avec succès ! Veuillez vous connecter.`);
      
      // Auto redirect back to login tab after brief interval (as requested: "Après inscription : Rediriger vers LOGIN")
      setTimeout(() => {
        setPhase('login');
        setErrorMessage('');
      }, 1200);
    }, 1000);
  };

  const handleGuestLogin = () => {
    setIsLoadingAuth(true);
    setTimeout(() => {
      const activeUser: User = {
        id: `guest-${Math.floor(Math.random() * 8999 + 1000)}`,
        email: 'guest@rahla.dz',
        name: 'Invité RAHLA 👤',
        role: 'guest',
        isPremium: false,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
      setIsLoadingAuth(false);
      setCurrentUser(activeUser);
      addNotification(`Bienvenue sur RAHLA en mode Invité (Accès limité) !`);
      onSuccess('explore'); // Mode invité redirection to 'explore' view which allows destinations browsing
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-br from-[#051c0f] via-[#092516] to-[#040e09] relative overflow-hidden font-sans select-none" id="rahla-auth-authmodule" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* FLOATING HIGH-CONTRAST LANGUAGE CHANGER SELECTOR */}
      <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-50 flex items-center gap-2`}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/85 hover:bg-slate-900 text-white hover:text-[#d4af37] border border-white/15 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-xl cursor-pointer"
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
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all text-start ${
                      isActive 
                        ? 'text-[#d4af37] bg-white/10 font-bold border-l-2 border-[#d4af37] rtl:border-l-0 rtl:border-r-2'
                        : 'text-slate-300 hover:text-[#d4af37] hover:bg-white/5'
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

      {/* Decorative stars / geometric patterns on background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

      {/* Standalone card styled beautifully as a "Carte Blanche" with shadow + rounded corners */}
      <div className="bg-white dark:bg-[#121413] w-full max-w-md border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Algerian theme visual line accent inside card */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-[#d4af37] to-red-650"></div>
        
        {/* Top Branding Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="relative mb-3 group">
            <div className="absolute -inset-1-5 bg-gradient-to-r from-emerald-500 via-[#d4af37] to-emerald-700 rounded-full blur-md opacity-80 animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#d4af37]/40 shadow-xl bg-slate-900">
              <img 
                src="/src/assets/images/rahala_logo_1781612694384.jpg" 
                alt="RAHALA Logo" 
                className="w-full h-full object-cover transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h2 className="text-3xl font-serif font-black tracking-widest bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 dark:from-emerald-400 dark:via-[#d4af37] dark:to-emerald-200 bg-clip-text text-transparent leading-none font-bold">RAHALA</h2>
          <p className="text-[10px] font-mono tracking-wider font-extrabold text-[#d4af37] dark:text-[#d4af37] uppercase mt-1">
            Assistant Intelligent de Voyage 🇩🇿
          </p>
        </div>

        {/* Dynamic Global Loader Overlay for UI smoothness */}
        {isLoadingAuth && (
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono font-bold tracking-widest text-[#d4af37] uppercase">Vérification en cours...</p>
          </div>
        )}

        {/* --- DUAL TAB SWITCHERS : LOGIN vs SIGNUP (Unconditional) --- */}
        <div className="flex border border-slate-200 dark:border-zinc-800 mb-6 bg-slate-50 dark:bg-zinc-900 rounded-2xl p-1 z-10 relative">
          <button
            type="button"
            onClick={() => { setPhase('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              phase === 'login' 
                ? 'bg-slate-900 text-white dark:bg-[#d4af37] dark:text-slate-950 shadow-md font-extrabold' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <LogIn size={13} /> Connexion 🔑
          </button>
          <button
            type="button"
            onClick={() => { setPhase('register'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              phase === 'register' 
                ? 'bg-slate-900 text-white dark:bg-[#d4af37] dark:text-slate-950 shadow-md font-extrabold' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <UserPlus size={13} /> Inscription 📝
          </button>
        </div>

        {/* --- PHASE 2 : CONNEXION LOGIN PAGE --- */}
        {phase === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in" id="auth-phase-login">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => window.location.hash = '#/landing'}
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-705 font-sans font-bold transition-all focus:outline-none"
              >
                <ArrowLeft size={13} />
                Menu Principal
              </button>
              <span className="text-[10px] font-mono font-black text-slate-700 dark:text-[#d4af37] uppercase tracking-wider">Accès Sécurisé</span>
            </div>

            {/* QUICK CONNEXION OPTION: USER VS ADMIN */}
            <div className="bg-slate-50 dark:bg-zinc-900/60 p-2.5 border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex items-center justify-between gap-2.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Sélection Rapide :</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('user@rahla.dz');
                    setPassword('password');
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
                >
                  Voyageur 👤
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@rahala.com');
                    setPassword('1234');
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-black uppercase rounded-lg bg-amber-500/10 text-[#c2410c] dark:text-[#d4af37] border border-[#d4af37]/30 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  Admin 👨💼
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-red-950/40 border-l-4 border-rose-500 text-rose-800 dark:text-rose-200 text-xs font-bold leading-relaxed animate-bounce flex items-center gap-2 rounded-r-xl">
                <AlertTriangle size={15} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-emerald-500 text-emerald-800 dark:text-emerald-250 text-xs font-bold leading-relaxed flex items-center gap-2 rounded-r-xl animate-pulse">
                <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={14} />
                <input 
                  type="email" 
                  value={email}
                  placeholder="admin@rahala.com ou votre email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold pl-10 pr-3.5 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-805/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Mot de Passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={14} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  placeholder="Saisissez votre mot de passe"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs font-semibold pl-10 pr-10 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-805/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-650 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 active:scale-97 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={14} />
              Se connecter 🔑
            </button>

            {/* Link toggle for Sign up from login */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">Pas de compte ? </span>
              <button
                type="button"
                onClick={() => {
                  setPhase('register');
                  setSuccessMessage('');
                  setErrorMessage('');
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-450 hover:underline hover:text-emerald-750"
              >
                S'inscrire 📝
              </button>
            </div>

            {/* Alternatif mode invité rapide */}
            <div className="text-center pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
              <p className="text-[10px] text-slate-400">Rattaché aux comptes de test ci-dessous pour simplifier l'évaluation.</p>
              <button
                type="button"
                onClick={handleGuestLogin}
                className="text-xs font-bold text-[#d4af37] hover:underline"
              >
                Continuer sans compte (mode invité) 👀
              </button>
            </div>
          </form>
        )}

        {/* --- PHASE 3 : INSCRIPTION REGISTER PAGE --- */}
        {phase === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in" id="auth-phase-register">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => window.location.hash = '#/landing'}
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-705 font-sans font-bold transition-all focus:outline-none"
              >
                <ArrowLeft size={13} />
                Menu Principal
              </button>
              <span className="text-[10px] font-mono font-black text-slate-700 dark:text-[#d4af37] uppercase tracking-wider">Créer un Compte</span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-red-950/40 border-l-4 border-rose-500 text-rose-800 dark:text-rose-200 text-xs font-bold leading-relaxed animate-bounce flex items-center gap-2 rounded-r-xl">
                <AlertTriangle size={15} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-emerald-500 text-emerald-800 dark:text-emerald-250 text-xs font-bold leading-relaxed flex items-center gap-2 rounded-r-xl">
                <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Nom complet 👤</label>
              <input 
                type="text" 
                value={name}
                placeholder="Ex. Nidal Lattab"
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-805/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Email 📧</label>
              <input 
                type="email" 
                value={email}
                placeholder="Ex. nidal@rahla.dz"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-805/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Mot de passe 🔒</label>
              <input 
                type="password" 
                value={password}
                placeholder="Mot de passe sécurisé"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-805/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Confirmation mot de passe 🔒</label>
              <input 
                type="password" 
                value={confirmPassword}
                placeholder="Confirmez votre mot de passe"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-805/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Type de compte</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex-1 py-2.5 text-xs font-bold border rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      role === 'user' 
                        ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500' 
                        : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <UserIcon size={12} />
                    Utilisateur 👤
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 py-2.5 text-xs font-bold border rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      role === 'admin' 
                        ? 'bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]' 
                        : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <ShieldCheck size={12} />
                    Admin 👨💼
                  </button>
                </div>
              </div>
            </div>

            {/* --- SÉCURITÉ ADMIN : Code Secret d'Administration --- */}
            {role === 'admin' && (
              <div className="p-3 bg-amber-500/5 border border-[#d4af37]/20 rounded-2xl animate-fade-in">
                <label className="block text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#d4af37] mb-1.5 flex items-center gap-1">
                  <Key size={11} /> Code administrateur requis
                </label>
                <input 
                  type="password" 
                  value={adminCode}
                  placeholder="Ex: RAHLA2025"
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-[#d4af37]/30 rounded-lg text-slate-900 dark:text-amber-100 placeholder-amber-700/50 focus:outline-none"
                  required={role === 'admin'}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-slate-900 to-slate-850 dark:from-[#d4af37] dark:to-amber-600 text-white dark:text-black font-mono font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-amber-500/20 active:scale-97 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <UserCheck size={14} />
              Créer mon compte 🌍
            </button>

            {/* Link toggle for Login from Sign up */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">Déjà un compte ? </span>
              <button
                type="button"
                onClick={() => {
                  setPhase('login');
                  setSuccessMessage('');
                  setErrorMessage('');
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-450 hover:underline hover:text-emerald-750"
              >
                Se connecter 🔑
              </button>
            </div>
          </form>
        )}

        {/* Dynamic bottom information widget */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 flex flex-col items-center">
          <button
            onClick={() => setShowTestAccounts(!showTestAccounts)}
            className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500 hover:text-emerald-600 transition-colors"
          >
            {showTestAccounts ? '[- FERMER L’EXPLORATEUR]' : '[+ COMPTES DE TEST DISPONIBLES]'}
          </button>
          
          {showTestAccounts && (
            <div className="mt-3 w-full bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-4 border border-slate-200 dark:border-emerald-500/10 text-[10px] space-y-2 text-slate-600 dark:text-slate-300 select-text animate-slide-down">
              <p className="font-mono text-[9px] font-bold text-emerald-700 dark:text-[#d4af37] uppercase">Identifiants de démonstration pour validation :</p>
              
              <div className="border-t border-slate-200/50 dark:border-white/5 pt-2 flex justify-between items-center">
                <div>
                  <p className="font-extrabold text-[#d4af37]">👨💼 Administrateur de test :</p>
                  <p className="font-mono text-slate-500 dark:text-slate-400">Email: <span className="text-emerald-700 dark:text-emerald-450 font-bold">admin@rahala.com</span></p>
                  <p className="font-mono text-slate-500 dark:text-slate-400">Mot de passe: <span className="font-bold text-slate-800 dark:text-white">1234</span></p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTestCredentials('admin@rahala.com', '1234')}
                  className="px-2 py-1 bg-emerald-600 text-white font-mono rounded cursor-pointer text-[8px]"
                >
                  Remplir
                </button>
              </div>

              <div className="border-t border-slate-200/50 dark:border-white/5 pt-2 flex justify-between items-center">
                <div>
                  <p className="font-extrabold text-slate-700 dark:text-slate-200">👤 Voyageur Standard RAHLA :</p>
                  <p className="font-mono text-slate-500 dark:text-slate-400">Email: <span className="text-emerald-700 dark:text-emerald-450 font-bold">user@rahla.dz</span></p>
                  <p className="font-mono text-slate-500 dark:text-slate-400">Mot de passe: <span className="font-bold text-slate-800 dark:text-white">password</span></p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTestCredentials('user@rahla.dz', 'password')}
                  className="px-2 py-1 bg-emerald-600 text-white font-mono rounded cursor-pointer text-[8px]"
                >
                  Remplir
                </button>
              </div>

              <div className="border-t border-[#1a1a1a]/5 dark:border-white/5 pt-2 flex justify-between items-center">
                <div>
                  <p className="font-extrabold text-slate-700 dark:text-slate-200">👤 Voyageur Premium (Nidal) :</p>
                  <p className="font-mono text-slate-500 dark:text-slate-400">Email: <span className="text-emerald-700 dark:text-emerald-450 font-bold">lattab.nidal@gmail.com</span></p>
                  <p className="font-mono text-slate-500 dark:text-slate-400">Mot de passe: <span className="font-bold text-slate-800 dark:text-white">lattab.nidal@gmail.com</span></p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTestCredentials('lattab.nidal@gmail.com', 'lattab.nidal@gmail.com')}
                  className="px-2 py-1 bg-emerald-600 text-white font-mono rounded cursor-pointer text-[8px]"
                >
                  Remplir
                </button>
              </div>

              <p className="border-t border-[#1a1a1a]/5 dark:border-white/5 pt-2 text-[8px] font-sans text-emerald-700 dark:text-emerald-400 flex items-center gap-1 italic">
                ℹ️ Pour créer un Administrateur depuis l’onglet Inscription, utilisez le code : <span className="font-bold font-mono text-slate-950 dark:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-zinc-800 px-1 rounded">RAHLA2025</span>.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

