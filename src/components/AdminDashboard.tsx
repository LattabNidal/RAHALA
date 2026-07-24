import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockLandmarks, mockHotels } from '../data/mockData';
import { PriceTag } from './rahala/PriceTag';
import { LazyImage } from './rahala/LazyImage';
import { 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Star, 
  MapPin, 
  Calendar, 
  Layout, 
  User as UserIcon,
  Trash2, 
  Plus, 
  Edit2, 
  BookOpen, 
  Settings, 
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  Globe,
  Bell
} from 'lucide-react';

interface RegisteredUser {
  name: string;
  email: string;
  role: string;
  isPremium: boolean;
  avatar?: string;
}

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { bookings, addNotification } = useApp();

  // Selected administrative tab: 'stats' (Voir statistiques 📊) | 'users' (Voir utilisateurs 👥) | 'content' (Gérer contenu 🛠️)
  const [activeTab, setActiveTab] = useState<'users' | 'stats' | 'content'>('stats');

  // Multi-type lists and data
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [localLandmarks, setLocalLandmarks] = useState(mockLandmarks);
  const [filterType, setFilterType] = useState<'all' | 'hotel' | 'taxi'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // States for adding new elements
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('password');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user');
  
  const [newLandmarkName, setNewLandmarkName] = useState('');
  const [newLandmarkCategory, setNewLandmarkCategory] = useState('Casbah / Patrimoine');
  const [newLandmarkLocation, setNewLandmarkLocation] = useState('Alger');
  const [newLandmarkRating, setNewLandmarkRating] = useState('4.8');

  // Fetch registered users on load
  useEffect(() => {
    fetchUsersFromStorage();
  }, []);

  const fetchUsersFromStorage = () => {
    const saved = localStorage.getItem('rihla_registered_users');
    if (saved) {
      setRegisteredUsers(JSON.parse(saved));
    } else {
      setRegisteredUsers([
        {
          name: 'Admin RAHLA',
          email: 'admin@rahla.dz',
          role: 'admin',
          isPremium: true,
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
        },
        {
          name: 'Voyageur RAHLA',
          email: 'user@rahla.dz',
          role: 'user',
          isPremium: false,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        },
        {
          name: 'Nidal Lattab',
          email: 'lattab.nidal@gmail.com',
          role: 'user',
          isPremium: true,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
        }
      ]);
    }
  };

  // Admin user creator
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const emailLower = newUserEmail.toLowerCase();
    const isExist = registeredUsers.some(u => u.email.toLowerCase() === emailLower);
    if (isExist) {
      alert("Cet email est déjà enregistré !");
      return;
    }

    const newUserObj = {
      name: newUserName,
      email: emailLower,
      password: newUserPass,
      role: newUserRole,
      isPremium: newUserRole === 'admin',
      avatar: newUserRole === 'admin' 
        ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };

    const nextList = [...registeredUsers, newUserObj];
    setRegisteredUsers(nextList);
    localStorage.setItem('rihla_registered_users', JSON.stringify(nextList));

    // Cleanup form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPass('password');
    addNotification(`Utilisateur créé : "${newUserObj.name}" (${newUserObj.role})`);
  };

  // Toggle user premium status
  const toggleUserPremium = (email: string) => {
    const updated = registeredUsers.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, isPremium: !u.isPremium };
      }
      return u;
    });
    setRegisteredUsers(updated);
    localStorage.setItem('rihla_registered_users', JSON.stringify(updated));
    addNotification(`Statut Premium mis à jour pour : ${email}`);
  };

  // Remove registered user account
  const handleDeleteUser = (email: string) => {
    if (email === 'admin@rahla.dz') {
      alert("Vous ne pouvez pas supprimer le compte administrateur principal !");
      return;
    }
    const filtered = registeredUsers.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    setRegisteredUsers(filtered);
    localStorage.setItem('rihla_registered_users', JSON.stringify(filtered));
    addNotification(`Utilisateur ${email} a été retiré de la base de données.`);
  };

  // Add customized Travel content
  const handleCreateLandmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLandmarkName) return;

    const freshLandmark = {
      id: `custom-landmark-${Date.now()}`,
      name: newLandmarkName,
      category: newLandmarkCategory,
      location: newLandmarkLocation,
      rating: parseFloat(newLandmarkRating) || 4.8,
      reviews: 1,
      image3d: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      tagline: 'Expérience créée par la console administration RAHLA AI',
      facts: ['Ajouté récemment par l’administrateur', 'Patrimoine algérien certifié']
    };

    const nextLandmarks = [freshLandmark, ...localLandmarks];
    setLocalLandmarks(nextLandmarks);
    
    // Reset form fields
    setNewLandmarkName('');
    addNotification(`Nouveau contenu publié : ${freshLandmark.name}`);
  };

  // Delete travel content
  const handleDeleteLandmark = (id: string) => {
    const filtered = localLandmarks.filter(l => l.id !== id);
    setLocalLandmarks(filtered);
    addNotification(`Le site avec l’identifiant "${id}" a été retiré.`);
  };

  // Stats figures calculations
  const totalSubscribers = 3920 + registeredUsers.filter(u => u.isPremium).length;
  const totalVisitsCount = 284300; 
  const estimatedRevenueDZD = bookings.reduce((sum, bkg) => sum + bkg.totalPriceDZD, 4800000);

  const filteredLogs = bookings.filter((bkg) => {
    if (filterType === 'all') return true;
    return bkg.type === filterType;
  });

  const popularSpotsRatings = [
    { name: 'The Casbah of Algiers', capacity: '78,400 touristes', load: '100%' },
    { name: 'Suspension Bridges (Constantine)', capacity: '62,100 touristes', load: '85%' },
    { name: 'Fort Santa Cruz (Oran)', capacity: '54,200 touristes', load: '90%' },
    { name: 'Tassili Rock Paintings (Sahara)', capacity: '48,900 touristes', load: '75%' }
  ];

  // Search filtered lists
  const searchedUsers = registeredUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchedLandmarks = localLandmarks.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4" id="admin-custom-dashboard-view">
      
      {/* Upper Title block */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <span className="inline-block px-3 py-1 bg-emerald-600/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/10 rounded-full font-mono font-bold text-[9px] uppercase tracking-widest mb-3">
          Console Administrative Sécurisée
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <span>Gestion RAHLA AI 🇩🇿</span>
        </h1>
        <p className="mt-2.5 text-xs text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
          Prenez le contrôle de l’application de voyage en pilotant les comptes utilisateurs, le catalogue interactif et la télémétrie en temps réel.
        </p>
      </div>

      {/* THREE-WAY CENTRAL TAB CONTROL PANEL */}
      <div className="flex border-b border-gray-150 dark:border-zinc-805 mb-8 justify-center gap-2 font-mono" id="admin-panel-tabs">
        <button
          onClick={() => { setActiveTab('stats'); setSearchQuery(''); }}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'stats'
              ? 'text-emerald-600 border-emerald-500 bg-emerald-500/5'
              : 'text-gray-500 hover:text-emerald-500 border-transparent hover:border-gray-300'
          }`}
        >
          <BarChart3 size={15} />
          Statistiques 📊
        </button>

        <button
          onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'users'
              ? 'text-emerald-600 border-emerald-500 bg-emerald-500/5'
              : 'text-gray-500 hover:text-emerald-500 border-transparent hover:border-gray-300'
          }`}
        >
          <Users size={15} />
          Utilisateurs 👥
        </button>

        <button
          onClick={() => { setActiveTab('content'); setSearchQuery(''); }}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'content'
              ? 'text-emerald-600 border-emerald-500 bg-emerald-500/5'
              : 'text-gray-500 hover:text-emerald-500 border-transparent hover:border-gray-300'
          }`}
        >
          <Settings size={15} />
          Contenu 🛠️
        </button>
      </div>

      {/* SEARCH BAR (Visible on Users and Content Tabs) */}
      {activeTab !== 'stats' && (
        <div className="max-w-md mx-auto mb-6 relative">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'users' ? "Rechercher un utilisateur par nom, email ou rôle..." : "Rechercher un site touristique, catégorie ou ville..."}
            className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-slate-100 placeholder-slate-400 focus:outline-[#d4af37]}"
          />
        </div>
      )}

      {/* ======================================= */}
      {/* 📊 TAB 1: VOIR STATISTIQUES SECTION     */}
      {/* ======================================= */}
      {activeTab === 'stats' && (
        <div className="space-y-8 animate-fade-in" id="admin-sec-stats">
          {/* Numerical Figures Grid cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Trafic Global</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Users size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-800 dark:text-white font-mono leading-none mb-1">
                  {totalVisitsCount.toLocaleString()}
                </h3>
                <p className="text-[10px] text-gray-400 font-serif font-semibold mt-1">Touristes algériens et étrangers enregistrés</p>
              </div>
              <span className="text-[10px] text-emerald-600 font-extrabold mt-4 self-start bg-emerald-500/10 px-2 py-0.5 rounded-lg font-mono">
                +14.2% ce mois-ci
              </span>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">RAHALA Gold VIP</span>
                <div className="p-2 bg-[#d4af37]/10 text-[#d4af37] rounded-xl">
                  <ShieldAlert size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-800 dark:text-white font-mono leading-none mb-1">
                  {totalSubscribers.toLocaleString()}
                </h3>
                <p className="text-[10px] text-gray-400 font-serif font-semibold mt-1">Membres VIP de la formule Premium</p>
              </div>
              <span className="text-[10px] text-amber-600 dark:text-[#d4af37] font-extrabold mt-4 self-start bg-[#d4af37]/10 px-2 py-0.5 rounded-lg font-mono">
                18.5% de taux de conversion
              </span>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Revenus Cumulés</span>
                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                  <DollarSign size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black font-mono leading-none mb-1 tabular-nums">
                  <PriceTag amount={estimatedRevenueDZD} className="text-emerald-600 dark:text-emerald-400 text-3xl!" />
                </h3>
                <p className="text-[10px] text-gray-400 font-serif font-semibold mt-1">Transactions et réservations hôtelières directes</p>
              </div>
              <span className="text-[10px] text-rose-600 font-extrabold mt-4 self-start bg-rose-500/10 px-2 py-0.5 rounded-lg font-mono">
                Géré via Stripe DZD
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Dynamic Interactive Revenue graph - 8 Columns */}
            <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-4 mb-4">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white flex items-center gap-2">
                    <BarChart3 className="text-emerald-600" size={16} />
                    <span>Fluctuations Mensuelles du Tourisme Algérien (Indice RAHLA 2026)</span>
                  </h4>
                  <span className="text-[9px] font-mono text-gray-400 hidden sm:inline">Statut de connexion en temps réel</span>
                </div>

                {/* Premium custom SVG analytics matrix */}
                <div className="h-[210px] relative w-full flex items-end justify-between px-2 pt-6">
                  
                  <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="0" y1="35" x2="500" y2="35" className="stroke-gray-100 dark:stroke-zinc-850 stroke-1" strokeDasharray="5,5" />
                    <line x1="0" y1="75" x2="500" y2="75" className="stroke-gray-100 dark:stroke-zinc-850 stroke-1" strokeDasharray="5,5" />
                    <line x1="0" y1="115" x2="500" y2="115" className="stroke-gray-100 dark:stroke-zinc-850 stroke-1" strokeDasharray="5,5" />

                    <path d="M 30 130 Q 110 95, 200 100 T 360 45 T 480 25" fill="none" className="stroke-emerald-600 dark:stroke-emerald-400 stroke-[3.5]" />
                    <circle cx="480" cy="25" r="5" className="fill-emerald-600" />
                  </svg>

                  <div className="text-[9px] font-mono font-bold text-gray-400 flex flex-col items-center justify-end h-full"><span>Jan</span></div>
                  <div className="text-[9px] font-mono font-bold text-gray-400 flex flex-col items-center justify-end h-full"><span>Fév</span></div>
                  <div className="text-[9px] font-mono font-bold text-gray-400 flex flex-col items-center justify-end h-full"><span>Mar</span></div>
                  <div className="text-[9px] font-mono font-bold text-gray-400 flex flex-col items-center justify-end h-full"><span>Avr</span></div>
                  <div className="text-[9px] font-mono font-bold text-gray-400 flex flex-col items-center justify-end h-full"><span>Mai</span></div>
                  <div className="text-[9px] font-mono font-black text-white flex flex-col items-center justify-end h-full bg-emerald-600 px-2 py-0.5 rounded-lg"><span>Juin (Courant)</span></div>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-emerald-800 dark:text-emerald-300 rounded-2xl mt-4 flex justify-between items-center font-serif leading-relaxed">
                <span>Le tourisme réceptif en Algérie est sur une trajectoire ascendante de 28% comparé à l'historique 2025.</span>
                <span className="font-mono text-[9px] text-[#d4af37] font-bold">Mis à jour le: 2026-06-19</span>
              </div>
            </div>

            {/* Most Visited places checklist - 4 Columns */}
            <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
              <h4 className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4 flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={15} />
                <span>Hotspots les plus visités</span>
              </h4>

              <div className="space-y-4">
                {popularSpotsRatings.map((spot, id) => (
                  <div key={id} className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-805">
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="text-[11px] font-bold text-gray-800 dark:text-slate-100 truncate max-w-[150px]">{spot.name}</h5>
                      <span className="text-[9px] font-mono font-extrabold text-emerald-600">{spot.load}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: spot.load }} />
                    </div>
                    <span className="text-[8px] font-mono text-gray-400 mt-1 block">{spot.capacity} enregistrements</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction logs table */}
          <div className="bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-zinc-800 pb-4 mb-6 gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Réservations & Transactions Historiques</h4>
                <p className="text-[10px] text-gray-400">Total : {bookings.length} réservations clients compilées</p>
              </div>
              <div className="flex gap-1 bg-gray-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 p-1 rounded-xl text-[9px] font-bold font-mono">
                <button onClick={() => setFilterType('all')} className={`px-2 py-1 rounded-lg ${filterType === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-emerald-550'}`}>Tous</button>
                <button onClick={() => setFilterType('hotel')} className={`px-2 py-1 rounded-lg ${filterType === 'hotel' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-emerald-550'}`}>Hôtels</button>
                <button onClick={() => setFilterType('taxi')} className={`px-2 py-1 rounded-lg ${filterType === 'taxi' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-emerald-550'}`}>Taxis</button>
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400 font-serif italic">
                Aucune réservation active détectée. Bookez un hôtel ou un taxi sur l'espace utilisateur pour alimenter ce tableau !
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-500 dark:text-slate-450 border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-zinc-805 text-[8px] font-mono uppercase tracking-widest text-slate-400">
                      <th className="py-3 px-3">Nº FACTURE</th>
                      <th className="py-3 px-3">REFUGE / SERVICE</th>
                      <th className="py-3 px-3">DATE DU VOYAGE</th>
                      <th className="py-3 px-3">MONTANT DZD</th>
                      <th className="py-3 px-3">STATUT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-805">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-500/5 transition">
                        <td className="py-3 px-3 font-mono font-bold text-[#d4af37]">{log.invoiceNo}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">{log.targetName}</span>
                            <span className="px-1.5 py-0.2 uppercase font-mono text-[7px] bg-emerald-500/10 text-emerald-600 rounded font-bold">{log.type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono">{log.date}</td>
                        <td className="py-3 px-3 font-mono font-extrabold"><PriceTag amount={log.totalPriceDZD || 0} className="text-emerald-600!" /></td>
                        <td className="py-3 px-3"><span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-600 rounded-full text-[8px] font-bold uppercase tracking-wider">Réussi</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ======================================= */}
      {/* 👥 TAB 2: VOIR UTILISATEURS SECTION     */}
      {/* ======================================= */}
      {activeTab === 'users' && (
        <div className="space-y-8 animate-fade-in animate-scale-up" id="admin-sec-users">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 1. Pre-registered Users Table - 8 Columns */}
            <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-850 mb-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
                    <Users className="text-emerald-600" size={16} />
                    <span>Membres et Voyageurs Enregistrés ({searchedUsers.length})</span>
                  </h4>
                  <p className="text-[9px] text-[#d4af37] font-mono mt-0.5">Accès à la simulation en temps réel des rôles</p>
                </div>
              </div>

              {searchedUsers.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-400 font-serif italic">
                  Aucun membre ne correspond à votre recherche.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-500 dark:text-slate-400 border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-zinc-805 text-[8px] font-mono uppercase tracking-widest text-[#93a0b0]">
                        <th className="py-3 px-2">Surnom & Email</th>
                        <th className="py-3 px-2">Privilèges Rôle</th>
                        <th className="py-3 px-2">Abonnement</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-805">
                      {searchedUsers.map((userObj) => (
                        <tr key={userObj.email} className="hover:bg-slate-500/5 transition">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={userObj.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                                alt="avatar"
                                className="w-8 h-8 rounded-full border border-slate-205 object-cover"
                                loading="eager"
                                decoding="async"
                              />
                              <div>
                                <p className="font-extrabold text-slate-800 dark:text-slate-100 leading-snug">{userObj.name}</p>
                                <p className="font-mono text-[9px] text-gray-400 truncate max-w-[150px]">{userObj.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-block px-2.5 py-0.5 font-mono text-[8px] font-black rounded uppercase tracking-wider ${
                              userObj.role === 'admin' 
                                ? 'bg-amber-500/10 text-[#d4af37] border border-[#d4af37]/20SB' 
                                : 'bg-emerald-500/10 text-emerald-600'
                            }`}>
                              {userObj.role}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <button
                              onClick={() => toggleUserPremium(userObj.email)}
                              className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase transition-all tracking-wide ${
                                userObj.isPremium 
                                  ? 'bg-[#d4af37] text-slate-950 font-bold' 
                                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'
                              }`}
                              title="Taper pour intervertir l'abonnement VIP de l'utilisateur"
                            >
                              {userObj.isPremium ? '★ GOLD VIP' : '☆ STANDARD'}
                            </button>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button
                              onClick={() => handleDeleteUser(userObj.email)}
                              className="p-1.5 text-rose-650 hover:bg-rose-50 rounded-lg max-w-[30px] font-mono transition inline-block text-center"
                              title="Révoquer l'utilisateur de la base"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 2. Interactive User Creator Panel - 4 Columns */}
            <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
              <h4 className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white mb-4 border-b border-gray-150 dark:border-zinc-805 pb-3 flex items-center gap-1.5">
                <Plus className="text-[#d4af37]" size={16} />
                <span>Nouveau Membre RAHLA</span>
              </h4>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1a1a1a]/60 dark:text-white/60 mb-1">Nom Complet 👤</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Surnom ou Nom"
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-slate-100 focus:outline-[#d4af37]}"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1a1a1a]/60 dark:text-white/60 mb-1">Adresse Email 📧</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="utilisateur@rahla.dz"
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-slate-100 focus:outline-[#d4af37]}"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1a1a1a]/60 dark:text-white/60 mb-1">Mot De Passe 🔓</label>
                  <input
                    type="password"
                    required
                    value={newUserPass}
                    onChange={(e) => setNewUserPass(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-slate-100 focus:outline-[#d4af37]}"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1a1a1a]/60 dark:text-white/60 mb-1">Attribuer les Privilèges</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as 'user' | 'admin')}
                    className="w-full text-xs font-semibold px-2 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-slate-100 focus:outline-[#d4af37]}"
                  >
                    <option value="user">Utilisateur Standard</option>
                    <option value="admin">Administrateur Platform</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-650 to-emerald-750 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow hover:shadow-emerald-500/10 cursor-pointer"
                >
                  Ajouter à la base 👤
                </button>
              </form>
            </div>

          </div>

        </div>
      )}


      {/* ======================================= */}
      {/* 🛠️ TAB 3: GERER CONTENU SECTION         */}
      {/* ======================================= */}
      {activeTab === 'content' && (
        <div className="space-y-8 animate-fade-in animate-scale-up" id="admin-sec-content">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 1. Landmarks Catalogue Checklist - 8 Columns */}
            <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-850 mb-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
                    <Globe className="text-emerald-600" size={16} />
                    <span>Catalogue de Sites & Monuments Actifs ({searchedLandmarks.length})</span>
                  </h4>
                  <p className="text-[9px] text-[#d4af37] font-mono mt-0.5">Retirer ou injecter du contenu touristique immersif d'Algérie</p>
                </div>
              </div>

              {searchedLandmarks.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-400 font-serif italic">
                  Aucun site ne correspond à votre recherche.
                </div>
              ) : (
                <div className="space-y-3">
                  {searchedLandmarks.map((landmark) => (
                    <div 
                      key={landmark.id} 
                      className="p-4 bg-slate-55/45 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-805/60 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-emerald-500/20 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 relative max-h-[48px] border border-slate-200/30 flex-shrink-0">
                          <LazyImage 
                            src={landmark.image3d || "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=150&q=80"} 
                            alt={landmark.name} 
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 dark:text-slate-100 text-sm leading-snug">{landmark.name}</p>
                          <div className="flex items-center gap-1.5 mt-1 font-mono text-[8px]">
                            <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 rounded-md font-bold uppercase">{landmark.category}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-400 uppercase">{landmark.location}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-[#d4af37] font-bold">★ {landmark.rating} Rating</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteLandmark(landmark.id)}
                        className="py-1.5 px-3 bg-rose-500/10 text-rose-600 font-mono text-[9px] uppercase tracking-wider font-bold rounded-xl hover:bg-rose-550 hover:text-white transition-all self-end sm:self-center cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 size={11} />
                        Retirer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Interactive Catalog Publisher Panel - 4 Columns */}
            <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-emerald-50 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
              <h4 className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white mb-4 border-b border-gray-150 dark:border-zinc-805 pb-3 flex items-center gap-1.5">
                <Plus className="text-[#d4af37]" size={16} />
                <span>Publier un nouveau site</span>
              </h4>

              <form onSubmit={handleCreateLandmark} className="space-y-4">
                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1a1a1a]/60 dark:text-white/60 mb-1">Nom du Monument 🏛️</label>
                  <input
                    type="text"
                    required
                    value={newLandmarkName}
                    onChange={(e) => setNewLandmarkName(e.target.value)}
                    placeholder="Ex. Tombeau de la Chrétienne"
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-slate-100 focus:outline-[#d4af37]}"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1a1a1a]/60 dark:text-white/60 mb-1">Catégorie</label>
                  <select
                    value={newLandmarkCategory}
                    onChange={(e) => setNewLandmarkCategory(e.target.value)}
                    className="w-full text-xs font-semibold px-2 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-slate-100 focus:outline-[#d4af37]}"
                  >
                    <option value="Casbah / Patrimoine">Casbah / Patrimoine 🏛️</option>
                    <option value="Ruines Romaines">Ruines Romaines 🧱</option>
                    <option value="Sahara d’Algérie">Sahara d’Algérie 🏜️</option>
                    <option value="Criques Sauvages">Criques Sauvages 🌊</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1a1a1a]/60 dark:text-white/60 mb-1">Ville / Zone d’Algérie 📍</label>
                  <input
                    type="text"
                    required
                    value={newLandmarkLocation}
                    onChange={(e) => setNewLandmarkLocation(e.target.value)}
                    placeholder="Ex. Tipaza / Constantine"
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-slate-100 focus:outline-[#d4af37]}"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1a1a1a]/60 dark:text-white/60 mb-1">Note Générale ★</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newLandmarkRating}
                    onChange={(e) => setNewLandmarkRating(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-slate-100 focus:outline-[#d4af37]}"
                  />
                </div>

                <div className="p-3 bg-slate-100 dark:bg-zinc-950 rounded-2xl text-[9px] text-gray-500 font-serif leading-relaxed italic border border-slate-200/50">
                  ℹ️ Les nouveaux sites injectés apparaîtront instantanément pour tous les utilisateurs voyageant sur l'application RAHLA.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-amber-600 text-black font-mono font-black text-xs uppercase tracking-widest rounded-xl hover:shadow cursor-pointer"
                >
                  Publier l’expérience 🚀
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
