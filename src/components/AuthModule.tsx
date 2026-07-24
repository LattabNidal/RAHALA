import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import rahalaLogo from '../assets/images/android-chrome-512x512.png';
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
import { supabaseDbService } from '../lib/supabaseDb';

interface AuthModuleProps {
  onSuccess: (view: string) => void;
}

// Default initial accounts pre-registered for testing out-of-the-box
const DEFAULT_ACCOUNTS = [
  {
    name: 'Admin RAHLA 👨‍💼',
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

    // Force/Upsert lattab.nidal@gmail.com with credentials
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

  // Helper to fetch registered users lists
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage(t('errAllFieldsRequired'));
      return;
    }

    setIsLoadingAuth(true);

    if (supabaseDbService.isUsingCloud()) {
      try {
        const authData = await supabaseDbService.signIn(email, password);
        if (authData?.user) {
          const profile = await supabaseDbService.getProfile(authData.user.id);
          const activeUser: User = profile || {
            id: authData.user.id,
            email: authData.user.email || email,
            name: authData.user.user_metadata?.fullName || email.split('@')[0],
            role: 'user',
            isPremium: false,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          };
          
          setIsLoadingAuth(false);
          setCurrentUser(activeUser);
          addNotification(`${t('welcomeBackUser')}${activeUser.name}!`);
          onSuccess(activeUser.role === 'admin' ? 'admin' : 'hotels');
          return;
        }
      } catch (err: any) {
        console.warn('Supabase Auth failed, checking local fallback...', err);
      }
    }

    // Local Fallback
    setTimeout(() => {
      let matchedUser: any = null;

      if (email.toLowerCase() === 'admin@rahala.com' && password === '1234') {
        matchedUser = {
          name: 'Admin RAHLA 👨‍💼',
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
        addNotification(`${t('welcomeBackUser')}${activeUser.name}!`);
        
        if (activeUser.role === 'admin') {
          onSuccess('admin');
        } else {
          onSuccess('hotels');
        }
      } else {
        setErrorMessage(t('errInvalidCredentials'));
      }
    }, 850);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage(t('errAllFieldsRequired'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('errPasswordsDoNotMatch'));
      return;
    }

    // SECURITY ADMIN: code verification
    if (role === 'admin') {
      if (adminCode !== 'RAHLA2025') {
        setErrorMessage(t('errIncorrectAdminCode'));
        setRole('user');
        setAdminCode('');
        return;
      }
    }

    setIsLoadingAuth(true);

    if (supabaseDbService.isUsingCloud()) {
      try {
        const authData = await supabaseDbService.signUp(email, password, name);
        if (authData?.user) {
          await supabaseDbService.updateProfile(authData.user.id, {
            name,
            role,
            isPremium: role === 'admin'
          });
        }
      } catch (err: any) {
        console.error('Supabase Sign-up failed:', err);
        setErrorMessage(err.message || 'Supabase Sign-up error');
        setIsLoadingAuth(false);
        return;
      }
    }

    // Local mirror register for fallback
    const users = getRegisteredUsers();
    const isDuplicated = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!isDuplicated) {
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
      const updatedUsersList = [...users, newAccount];
      localStorage.setItem('rihla_registered_users', JSON.stringify(updatedUsersList));
    }

    setIsLoadingAuth(false);
    setSuccessMessage(t('successAccountCreated'));
    
    setTimeout(() => {
      setPhase('login');
      setErrorMessage('');
    }, 1200);
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
      addNotification(t('welcomeGuest'));
      onSuccess('explore');
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 bg-[#F8FAFC] relative overflow-hidden font-sans select-none" id="rahla-auth-authmodule" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* FLOATING LANG CHANGER */}
      <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} z-50 flex items-center gap-2`}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F8FAFC] text-ink border border-[#E2E8F0] rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-sm cursor-pointer"
          >
            <Globe size={13} className="text-gold" />
            <span>{languagesList.find(l => l.code === language)?.label}</span>
            <span className="text-sm">{languagesList.find(l => l.code === language)?.flag}</span>
          </button>
          
          {langOpen && (
            <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-40 bg-white border border-[#E2E8F0] rounded-2xl shadow-md py-1.5 z-50 overflow-hidden`}>
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
                        ? 'text-gold bg-gold/5 font-bold border-l-2 border-gold'
                        : 'text-ink hover:text-gold hover:bg-[#F8FAFC]'
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

      {/* Decorative premium ambient glows with bright brand colors */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Standalone clean white card container */}
      <div className="bg-white w-full max-w-md border border-[#E2E8F0] rounded-[32px] p-6 sm:p-10 shadow-sm relative overflow-hidden transition-all duration-300">
        
        {/* Accent strip */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-gold to-[#B8860B]"></div>
        
        {/* Top Branding Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="relative mb-4 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold to-[#B8860B] rounded-full blur opacity-20"></div>
            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-[#E2E8F0] shadow-sm bg-[#F8FAFC] p-0.5">
              <img 
                src={rahalaLogo} 
                alt="RAHALA Logo" 
                className="w-full h-full rounded-full object-cover"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h2 className="text-3xl font-serif tracking-tight text-ink font-black leading-none uppercase">RAHALA</h2>
          <p className="text-[9px] font-mono tracking-[0.2em] font-black text-gold uppercase mt-2 leading-none">
            {t('assistantSub')}
          </p>
        </div>

        {/* Loading Overlay */}
        {isLoadingAuth && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gold uppercase">{t('verifying')}</p>
          </div>
        )}

        {/* DUAL TAB SWITCHERS */}
        <div className="flex border border-[#E2E8F0] mb-8 bg-[#F8FAFC] rounded-2xl p-1 z-10 relative">
          <button
            type="button"
            onClick={() => { setPhase('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              phase === 'login' 
                ? 'bg-gold text-ink shadow-sm font-extrabold' 
                : 'text-ink/60 hover:text-gold'
            }`}
          >
            <LogIn size={12} /> {t('loginTab')}
          </button>
          <button
            type="button"
            onClick={() => { setPhase('register'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              phase === 'register' 
                ? 'bg-gold text-ink shadow-sm font-extrabold' 
                : 'text-ink/60 hover:text-gold'
            }`}
          >
            <UserPlus size={12} /> {t('registerTab')}
          </button>
        </div>

        {/* CONNEXION LOGIN PAGE */}
        {phase === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4" id="auth-phase-login">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => window.location.hash = '#/landing'}
                className="flex items-center gap-1.5 text-xs text-ink/60 hover:text-gold font-sans font-bold transition-all focus:outline-none"
              >
                <ArrowLeft size={13} />
                {t('mainMenu')}
              </button>
              <span className="text-[10px] font-mono font-black text-gold uppercase tracking-widest">{t('secureAccess')}</span>
            </div>

            {/* QUICK CONNEXION SELECTION */}
            <div className="bg-[#F8FAFC] p-3 border border-[#E2E8F0] rounded-2xl flex items-center justify-between gap-2.5">
              <span className="text-[10px] font-mono font-bold text-ink/60 uppercase tracking-wider pl-1">{t('quickSelection')}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('user@rahla.dz');
                    setPassword('password');
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all cursor-pointer"
                >
                  {t('travelerRole')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@rahala.com');
                    setPassword('1234');
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-black uppercase rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all cursor-pointer"
                >
                  {t('adminRole')}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold leading-relaxed flex items-center gap-2 rounded-r-xl">
                <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs font-bold leading-relaxed flex items-center gap-2 rounded-r-xl">
                <ShieldCheck size={15} className="text-emerald-500 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-ink/60 mb-1.5">{t('adresseMail')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-ink/60" size={14} />
                <input 
                  type="email" 
                  value={email}
                  placeholder={t('emailPlaceholder')}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold pl-10 pr-3.5 py-3 bg-white border border-[#E2E8F0] rounded-xl text-ink placeholder-ink/40 focus:outline-none focus:border-gold transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-ink/60 mb-1.5">{t('motDePasse')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-ink/60" size={14} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  placeholder={t('passwordPlaceholder')}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs font-semibold pl-10 pr-10 py-3 bg-white border border-[#E2E8F0] rounded-xl text-ink placeholder-ink/40 focus:outline-none focus:border-gold transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-ink/60 hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-gold hover:bg-[#C29B2E] text-ink font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2 border border-gold/10"
            >
              <LogIn size={14} />
              {t('loginBtn')}
            </button>

            {/* Switch link */}
            <div className="text-center pt-2">
              <span className="text-xs text-ink/60 font-sans">{t('noAccount')} </span>
              <button
                type="button"
                onClick={() => {
                  setPhase('register');
                  setSuccessMessage('');
                  setErrorMessage('');
                }}
                className="text-xs font-bold text-gold hover:underline"
              >
                {t('signupBtn')}
              </button>
            </div>

            {/* Quick Guest login option */}
            <div className="text-center pt-3 border-t border-[#E2E8F0] space-y-2">
              <p className="text-[10px] text-ink/60">{t('demoAccountsHint')}</p>
              <button
                type="button"
                onClick={handleGuestLogin}
                className="text-xs font-bold text-gold hover:underline"
              >
                {t('guestModeBtn')}
              </button>
            </div>
          </form>
        )}

        {/* INSCRIPTION REGISTER PAGE */}
        {phase === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4" id="auth-phase-register">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => window.location.hash = '#/landing'}
                className="flex items-center gap-1.5 text-xs text-ink/60 hover:text-gold font-sans font-bold transition-all focus:outline-none"
              >
                <ArrowLeft size={13} />
                {t('mainMenu')}
              </button>
              <span className="text-[10px] font-mono font-black text-gold uppercase tracking-wider">{t('creerCompte')}</span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold leading-relaxed flex items-center gap-2 rounded-r-xl animate-shake">
                <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs font-bold leading-relaxed flex items-center gap-2 rounded-r-xl">
                <ShieldCheck size={15} className="text-emerald-500" />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-ink/60 mb-1.5">{t('fullNameLabel')}</label>
              <input 
                type="text" 
                value={name}
                placeholder={t('fullNamePlaceholder')}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-3 bg-white border border-[#E2E8F0] rounded-xl text-ink placeholder-ink/40 focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-ink/60 mb-1.5">{t('emailLabel')}</label>
              <input 
                type="email" 
                value={email}
                placeholder={t('emailRegPlaceholder')}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-3 bg-white border border-[#E2E8F0] rounded-xl text-ink placeholder-ink/40 focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-ink/60 mb-1.5">{t('passwordLabel')}</label>
              <input 
                type="password" 
                value={password}
                placeholder={t('passwordRegPlaceholder')}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-3 bg-white border border-[#E2E8F0] rounded-xl text-ink placeholder-ink/40 focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-ink/60 mb-1.5">{t('confirmPasswordLabel')}</label>
              <input 
                type="password" 
                value={confirmPassword}
                placeholder={t('confirmPasswordPlaceholder')}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-3 bg-white border border-[#E2E8F0] rounded-xl text-ink placeholder-ink/40 focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[9px] font-mono uppercase tracking-widest text-ink/60 mb-1.5">{t('accountTypeLabel')}</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex-1 py-2.5 text-xs font-bold border rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      role === 'user' 
                        ? 'bg-gold/10 text-gold border-gold' 
                        : 'border-[#E2E8F0] text-ink/60 hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <UserIcon size={12} />
                    {t('userTypeBtn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 py-2.5 text-xs font-bold border rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      role === 'admin' 
                        ? 'bg-gold/10 text-gold border-gold' 
                        : 'border-[#E2E8F0] text-ink/60 hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <ShieldCheck size={12} />
                    {t('adminTypeBtn')}
                  </button>
                </div>
              </div>
            </div>

            {/* Admin safety verification code field */}
            {role === 'admin' && (
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl animate-fade-in">
                <label className="block text-[10px] font-mono font-extrabold uppercase tracking-widest text-ink mb-1.5 flex items-center gap-1">
                  <Key size={11} /> {t('adminCodeLabel')}
                </label>
                <input 
                  type="password" 
                  value={adminCode}
                  placeholder={t('adminCodePlaceholder')}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-ink placeholder-ink/40 focus:outline-none"
                  required={role === 'admin'}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-gold hover:bg-[#C29B2E] text-ink font-mono font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <UserCheck size={14} />
              {t('createAccountBtn')}
            </button>

            {/* Toggle link */}
            <div className="text-center pt-2">
              <span className="text-xs text-ink/60 font-sans">{t('alreadyHaveAccount')}</span>
              <button
                type="button"
                onClick={() => {
                  setPhase('login');
                  setSuccessMessage('');
                  setErrorMessage('');
                }}
                className="text-xs font-bold text-gold hover:underline"
              >
                {t('loginBtn')}
              </button>
            </div>
          </form>
        )}

        {/* Dynamic test accounts helper */}
        <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex flex-col items-center">
          <button
            onClick={() => setShowTestAccounts(!showTestAccounts)}
            className="text-[10px] font-mono font-bold tracking-widest uppercase text-ink/60 hover:text-gold transition-colors"
          >
            {showTestAccounts ? t('hideTestAccountsBtn') : t('showTestAccountsBtn')}
          </button>
          
          {showTestAccounts && (
            <div className="mt-3 w-full bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] text-[10px] space-y-2 text-ink select-text animate-slide-down">
              <p className="font-mono text-[9px] font-bold text-gold uppercase">{t('demoCredentialsTitle')}</p>
              
              <div className="border-t border-[#E2E8F0] pt-2 flex justify-between items-center">
                <div>
                  <p className="font-extrabold text-gold">{t('demoAdminTitle')}</p>
                  <p className="font-mono text-ink/60">Email: <span className="text-gold font-bold">admin@rahala.com</span></p>
                  <p className="font-mono text-ink/60">Mot de passe: <span className="font-bold text-ink">1234</span></p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTestCredentials('admin@rahala.com', '1234')}
                  className="px-2.5 py-1 bg-gold text-ink font-mono font-bold rounded cursor-pointer text-[8px]"
                >
                  {t('fillBtn')}
                </button>
              </div>

              <div className="border-t border-[#E2E8F0] pt-2 flex justify-between items-center">
                <div>
                  <p className="font-extrabold text-ink">{t('demoUserTitle')}</p>
                  <p className="font-mono text-ink/60">Email: <span className="text-gold font-bold">user@rahla.dz</span></p>
                  <p className="font-mono text-ink/60">Mot de passe: <span className="font-bold text-ink">password</span></p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTestCredentials('user@rahla.dz', 'password')}
                  className="px-2.5 py-1 bg-gold text-ink font-mono font-bold rounded cursor-pointer text-[8px]"
                >
                  {t('fillBtn')}
                </button>
              </div>

              <div className="border-t border-[#E2E8F0] pt-2 flex justify-between items-center">
                <div>
                  <p className="font-extrabold text-ink">{t('demoPremiumUserTitle')}</p>
                  <p className="font-mono text-ink/60">Email: <span className="text-gold font-bold">lattab.nidal@gmail.com</span></p>
                  <p className="font-mono text-ink/60">Mot de passe: <span className="font-bold text-ink">lattab.nidal@gmail.com</span></p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyTestCredentials('lattab.nidal@gmail.com', 'lattab.nidal@gmail.com')}
                  className="px-2.5 py-1 bg-gold text-ink font-mono font-bold rounded cursor-pointer text-[8px]"
                >
                  {t('fillBtn')}
                </button>
              </div>

              <p className="border-t border-[#E2E8F0] pt-2 text-[8px] font-sans text-gold flex items-center gap-1 italic font-medium">
                {t('adminCreationHint')} <span className="font-bold font-mono text-ink bg-white border border-[#E2E8F0] px-1 rounded">RAHLA2025</span>.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
