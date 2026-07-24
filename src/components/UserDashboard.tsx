import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockLandmarks } from '../data/mockData';
import { PriceTag } from './rahala/PriceTag';
import { LazyImage } from './rahala/LazyImage';
import { Calendar, Compass, User, Key, KeyRound, Download, Bookmark, Trash2, Heart, Award, ArrowRight, Database, Wifi, WifiOff, Loader, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseDb';

interface UserDashboardProps {
  setActiveView: (view: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ setActiveView }) => {
  const { t, isRtl } = useLanguage();
  const { currentUser, bookings, cancelBooking, favorites, toggleFavorite, notifications } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'notifs'>('bookings');
  
  // Database connection testing states
  const [dbTestResult, setDbTestResult] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [dbErrorMessage, setDbErrorMessage] = useState('');
  const [dbStats, setDbStats] = useState<{ profilesCount: number; bookingsCount: number } | null>(null);

  const testDatabaseConnection = async () => {
    setDbTestResult('testing');
    setDbErrorMessage('');
    try {
      if (!supabase) {
        throw new Error("L'URL ou la clé d'API anonyme Supabase n'est pas définie dans l'environnement. Veuillez configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.");
      }

      // Quick table probe
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .limit(1);

      if (error) throw error;

      // Also grab bookings count
      const { count: bookingsCount } = await supabase
        .from('bookings_hotels')
        .select('*', { count: 'exact', head: true });

      setDbStats({
        profilesCount: count || 0,
        bookingsCount: bookingsCount || 0
      });
      setDbTestResult('success');
    } catch (err: any) {
      console.error('Supabase diagnostic ping failed:', err);
      setDbTestResult('error');
      setDbErrorMessage(err?.message || 'Erreur inconnue de connexion à Supabase.');
    }
  };

  // filter landmarks favorited
  const favoriteLandmarks = mockLandmarks.filter(l => favorites.includes(l.id));

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 bg-[#F8FAFC]" id="user-dashboard-viewport">
      
      {/* Upper header with premium styling */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-[#334155] font-black uppercase">
          {t('dashboardTitle')}
        </h1>
        <p className="mt-3 text-xs tracking-wider text-[#94A3B8] font-semibold uppercase">
          {t('dashboardSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Profile Stats Panel - 4 Columns */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle gold/blue gradient accent background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3B82F6]/5 to-transparent blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#22D3EE]/10 to-transparent blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center pb-6 border-b border-[#E2E8F0] mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <img 
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                  alt="Profile Avatar"
                  className="relative w-24 h-24 rounded-2xl object-cover ring-2 ring-[#E2E8F0]"
                />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#334155] leading-none mb-2">
                {currentUser?.name}
              </h3>
              <p className="text-[10px] font-mono text-[#94A3B8] tracking-wider">{currentUser?.email}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 text-[9px] font-mono tracking-widest uppercase rounded-full bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]">
                  {currentUser?.role} Account
                </span>
                <span className={`px-3 py-1 text-[9px] font-mono tracking-widest uppercase rounded-full flex items-center gap-1.5 border ${
                  currentUser?.isPremium 
                    ? 'bg-gold/10 text-gold border-gold/20' 
                    : 'bg-[#F8FAFC] text-ink/60 border-[#E2E8F0]'
                }`}>
                  <Award size={10} className="text-gold" />
                  <span>{currentUser?.isPremium ? 'VIP Gold Member' : 'Standard Visitor'}</span>
                </span>
              </div>
            </div>

            {/* Travel stats counters with high contrast */}
            <div className="grid grid-cols-3 gap-3 text-center mb-6">
              <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                <span className="block text-lg font-black font-mono text-gold">{bookings.length}</span>
                <span className="text-[8px] text-ink/60 font-mono uppercase tracking-wider block mt-1">Reserved</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                <span className="block text-lg font-black font-mono text-gold">{favorites.length}</span>
                <span className="text-[8px] text-ink/60 font-mono uppercase tracking-wider block mt-1">Favorites</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                <span className="block text-lg font-black font-mono text-gold">{notifications.length}</span>
                <span className="text-[8px] text-ink/60 font-mono uppercase tracking-wider block mt-1">Notifs</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E2E8F0] text-xs relative z-10">
            {currentUser?.isPremium ? (
              <div className="p-4 bg-gold/5 rounded-2xl border border-gold/25 text-[10.5px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-full blur-xl pointer-events-none" />
                <strong className="text-gold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-mono text-[9px]">
                  ✨ VIP Gold Privileges Active
                </strong>
                <p className="text-ink leading-relaxed font-sans font-medium">
                  Enjoy unlimited high-fidelity virtual 3D twins, non-stop AI smart travel companions, and priority reservation allocations.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-[#F8FAFC] rounded-2xl text-[10.5px] border border-[#E2E8F0]">
                <strong className="text-ink block mb-1 uppercase tracking-wider font-mono text-[9px]">Standard Account</strong>
                <p className="text-ink/60 mt-1 leading-relaxed mb-4">
                  Upgrade your plan to unlock high-fidelity virtual 3D twins, premium smart concierge companion help, and instant taxi routing.
                </p>
                <button
                  onClick={() => setActiveView('explore')}
                  className="text-gold font-extrabold hover:underline block flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Premium Plans &rarr;</span>
                </button>
              </div>
            )}
          </div>

          {/* Supabase Connection Diagnostics Card */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-5 mt-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <Database className="text-gold" size={16} />
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink">
                Cloud Sync (Supabase)
              </h3>
            </div>
            
            <p className="text-[10.5px] text-ink/60 mb-4 leading-relaxed font-semibold">
              Validate real-time synchronization between your tourist profile and the PostgreSQL cloud engine.
            </p>

            {/* Connection Status Badge */}
            <div className="mb-4 relative z-10">
              {supabase ? (
                <div className="p-3 bg-gold/5 rounded-2xl border border-gold/10 text-[10.5px] text-gold flex items-center gap-2">
                  <Wifi size={13} className="text-gold animate-pulse shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-bold block text-ink text-[9px] uppercase tracking-wider">Cloud Connected</span>
                    <span className="text-[8px] text-ink/60 block mt-0.5 truncate" title={import.meta.env.VITE_SUPABASE_URL || ''}>
                      {import.meta.env.VITE_SUPABASE_URL || 'Active Sync Node'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-2xl border border-[#E2E8F0] text-[10.5px] text-ink flex items-center gap-2">
                  <WifiOff size={13} className="text-ink/60 shrink-0" />
                  <div>
                    <span className="font-bold block text-ink/60 text-[9px] uppercase tracking-wider">Local Backup Active</span>
                    <span className="text-[8px] text-ink/60 block mt-0.5">
                      Cloud sync offline. Run in secure sandbox mock state.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Live Testing Area */}
            <div className="space-y-3 relative z-10">
              <button
                onClick={testDatabaseConnection}
                disabled={dbTestResult === 'testing'}
                className="w-full py-2.5 bg-gold hover:bg-[#C29B2E] text-ink rounded-xl text-xs font-mono uppercase tracking-widest transition flex items-center justify-center gap-2 disabled:opacity-50 font-bold border border-gold/10 cursor-pointer"
              >
                {dbTestResult === 'testing' ? (
                  <>
                    <Loader size={12} className="animate-spin text-ink" />
                    <span>Checking Nodes...</span>
                  </>
                ) : (
                  <>
                    <Database size={12} />
                    <span>Ping Cloud Database</span>
                  </>
                )}
              </button>

              {/* Success Result */}
              {dbTestResult === 'success' && (
                <div className="p-3 bg-gold/10 border border-gold/20 rounded-xl text-[10px] text-gold animate-fade-in font-mono">
                  <div className="flex items-center gap-1.5 font-bold mb-1.5">
                    <CheckCircle2 size={12} className="text-gold" />
                    <span className="uppercase tracking-wider">PONG SUCCESSFUL</span>
                  </div>
                  <p className="text-ink mb-2 leading-relaxed">
                    Secure handshake resolved with PostgreSQL cloud.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-center pt-1.5 border-t border-[#E2E8F0]">
                    <div className="bg-white p-1.5 rounded-lg border border-[#E2E8F0]">
                      <span className="text-xs block font-bold text-ink">
                        {dbStats?.profilesCount}
                      </span>
                      <span className="text-[7.5px] text-ink/60 block uppercase tracking-wider">Profiles</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-[#E2E8F0]">
                      <span className="text-xs block font-bold text-ink">
                        {dbStats?.bookingsCount}
                      </span>
                      <span className="text-[7.5px] text-ink/60 block uppercase tracking-wider">Bookings</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Result */}
              {dbTestResult === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[10px] text-red-600 animate-fade-in font-mono">
                  <div className="flex items-center gap-1.5 font-bold mb-1.5">
                    <AlertCircle size={12} className="text-red-500" />
                    <span className="uppercase tracking-wider">SYNC EXCEPTION</span>
                  </div>
                  <p className="leading-relaxed text-red-500 text-[9px] mb-2">
                    {dbErrorMessage}
                  </p>
                  <div className="bg-white p-2 rounded-lg text-[8.5px] text-ink/60 space-y-1 border border-[#E2E8F0]">
                    <p className="font-bold text-ink">Environment Credentials Hint:</p>
                    <ol className="list-decimal list-inside space-y-0.5">
                      <li>Add <code className="text-gold">VITE_SUPABASE_URL</code> in Workspace.</li>
                      <li>Add <code className="text-gold">VITE_SUPABASE_ANON_KEY</code> to enable.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Grid Options - 8 Columns */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Tabs navigation list - Premium Glassmorphic Selector */}
          <div className="flex border border-[#E2E8F0] text-xs bg-white p-1.5 rounded-2xl shadow-sm gap-1">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-3 rounded-xl text-center font-mono uppercase tracking-wider text-[10px] transition-all cursor-pointer font-bold ${
                activeTab === 'bookings' 
                  ? 'bg-gold text-ink shadow-sm font-extrabold' 
                  : 'text-ink/60 hover:text-gold hover:bg-[#F8FAFC]'
              }`}
            >
              My Reserved Stays
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-3 rounded-xl text-center font-mono uppercase tracking-wider text-[10px] transition-all cursor-pointer font-bold ${
                activeTab === 'favorites' 
                  ? 'bg-gold text-ink shadow-sm font-extrabold' 
                  : 'text-ink/60 hover:text-gold hover:bg-[#F8FAFC]'
              }`}
            >
              Bookmarks Favorites
            </button>
            <button
              onClick={() => setActiveTab('notifs')}
              className={`flex-1 py-3 rounded-xl text-center font-mono uppercase tracking-wider text-[10px] transition-all cursor-pointer font-bold ${
                activeTab === 'notifs' 
                  ? 'bg-gold text-ink shadow-sm font-extrabold' 
                  : 'text-ink/60 hover:text-gold hover:bg-[#F8FAFC]'
              }`}
            >
              Logs Notifications ({notifications.length})
            </button>
          </div>

          {/* Tab contents section */}
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-sm flex-1">
            
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="text-ink/60 mx-auto mb-4" size={32} />
                    <p className="text-xs text-ink/60 tracking-wider">No active hotel room bookings on file.</p>
                    <button
                      onClick={() => setActiveView('hotels')}
                      className="mt-6 px-6 py-2.5 bg-gold hover:bg-[#C29B2E] text-ink text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl transition cursor-pointer"
                    >
                      Book a Stay now
                    </button>
                  </div>
                ) : (
                  bookings.map((bkg) => (
                    <div 
                      key={bkg.id}
                      className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-gold/30"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-gold/10 text-gold border border-gold/20 text-[8px] font-mono font-bold rounded-full uppercase tracking-wider">
                            {bkg.type.toUpperCase()}
                          </span>
                          <span className="text-[9px] font-mono text-ink/60 uppercase">Inv: {bkg.invoiceNo}</span>
                        </div>
                        <h4 className="font-serif font-bold text-ink text-sm mt-2">{bkg.targetName}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-ink/60 mt-2 font-mono uppercase tracking-wider">
                          <span>📅 Check-In: {bkg.date}</span>
                          {bkg.endDate && <span>🌙 Check-Out: {bkg.endDate}</span>}
                          {bkg.guests && <span>👥 Guests: {bkg.guests}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-[#E2E8F0] pt-3 sm:pt-0 sm:border-none">
                        <div className="text-left sm:text-right">
                          <span className="block text-[7px] font-mono text-ink/60 uppercase tracking-wider">Paid Amount</span>
                          <PriceTag amount={bkg.totalPriceDZD || 0} />
                        </div>
                        <button
                          onClick={() => cancelBooking(bkg.id)}
                          className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-[#E2E8F0]"
                          title="Cancel Reservation booking"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteLandmarks.length === 0 ? (
                  <div className="col-span-2 text-center py-16">
                    <Heart className="text-ink/60 mx-auto mb-4" size={32} />
                    <span className="text-xs text-ink/60 tracking-wider">No bookmarked landmarks favorite checklist registered.</span>
                  </div>
                ) : (
                  favoriteLandmarks.map((landmark) => (
                    <div 
                      key={landmark.id}
                      className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex justify-between items-center group hover:border-gold/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <LazyImage 
                          src={landmark.image} 
                          alt={landmark.name}
                          className="w-11 h-11 rounded-xl object-cover ring-1 ring-[#E2E8F0]"
                        />
                        <div className="min-w-0">
                          <h4 className="text-[11px] font-serif font-bold text-ink truncate max-w-[150px]">{landmark.name}</h4>
                          <span className="text-[9px] text-ink/60 block truncate max-w-[150px] font-medium">{landmark.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFavorite(landmark.id)}
                        className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-[#E2E8F0]"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'notifs' && (
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-16 text-xs text-ink/60 tracking-wider">
                    No historic notification logs.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-gold/25 transition-all"
                    >
                      <p className="text-xs text-ink leading-relaxed font-sans font-semibold">{notif.message}</p>
                      <span className="text-[9px] text-ink/60 font-mono mt-2 block">{notif.date}</span>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
