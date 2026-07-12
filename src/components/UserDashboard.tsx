import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockLandmarks } from '../data/mockData';
import { Calendar, Compass, User, Key, KeyRound, Download, Bookmark, Trash2, Heart, Award, ArrowRight } from 'lucide-react';

interface UserDashboardProps {
  setActiveView: (view: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ setActiveView }) => {
  const { t, isRtl } = useLanguage();
  const { currentUser, bookings, cancelBooking, favorites, toggleFavorite, notifications } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'notifs'>('bookings');

  // filter landmarks favorited
  const favoriteLandmarks = mockLandmarks.filter(l => favorites.includes(l.id));

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4" id="user-dashboard-viewport">
      
      {/* Upper header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {t('dashboardTitle')}
        </h1>
        <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
          {t('dashboardSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Profile Stats Panel - 4 Columns */}
        <div className="lg:col-span-4 bg-white dark:bg-[#162231] border border-emerald-50 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-center pb-6 border-b border-gray-100 dark:border-slate-800 mb-6">
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt="Profile Avatar"
                className="w-20 h-20 rounded-2xl object-cover mx-auto ring-4 ring-emerald-500/20 mb-4"
              />
              <h3 className="text-base font-bold text-gray-800 dark:text-white leading-none mb-1">
                {currentUser?.name}
              </h3>
              <p className="text-[10px] font-mono text-gray-400">{currentUser?.email}</p>

              <div className="mt-4 flex justify-center space-x-2 space-x-reverse">
                <span className="px-2.5 py-1 text-[9px] font-bold uppercase rounded bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                  {currentUser?.role} account
                </span>
                <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded flex items-center space-x-1 ${
                  currentUser?.isPremium 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <Award size={10} className="fill-amber-400" />
                  <span>{currentUser?.isPremium ? 'Gold VIP Member' : 'Standard Visitor'}</span>
                </span>
              </div>
            </div>

            {/* Travel stats counters */}
            <div className="grid grid-cols-3 gap-3 text-center mb-6">
              <div className="p-3 bg-gray-50/50 dark:bg-slate-900 rounded-2xl">
                <span className="block text-[14px] font-black font-mono text-gray-800 dark:text-white">{bookings.length}</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest block mt-0.5">Stays Reserved</span>
              </div>
              <div className="p-3 bg-gray-50/50 dark:bg-slate-900 rounded-2xl">
                <span className="block text-[14px] font-black font-mono text-gray-800 dark:text-white">{favorites.length}</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest block mt-0.5">Favorites</span>
              </div>
              <div className="p-3 bg-gray-50/50 dark:bg-slate-900 rounded-2xl">
                <span className="block text-[14px] font-black font-mono text-gray-800 dark:text-white">{notifications.length}</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest block mt-0.5">Alerts Logs</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-slate-800 text-xs">
            {currentUser?.isPremium ? (
              <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900/60 dark:to-[#1a2332] rounded-2xl border border-amber-200/40 text-[10.5px]">
                <strong className="text-amber-800 dark:text-amber-400 flex items-center space-x-1.5 space-x-reverse mb-1">
                  <span>✨ VIP Gold Privilege active</span>
                </strong>
                <p className="text-gray-500 leading-normal">
                  Enjoy unlimited virtual twin look-arounds, unlimited live smart AI chat guides, and 15% cashback priorities on stay reservations.
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-gray-50/50 dark:bg-slate-900/60 rounded-2xl text-[10.5px] border border-gray-100 dark:border-slate-800/40">
                <strong>Standard Account limitations</strong>
                <p className="text-gray-400 mt-1 leading-normal mb-3">Upgrade plan to unlock high-fidelity virtual 3D twins, non-stop AI guide help, and priorities on taxi booking.</p>
                <button
                  onClick={() => setActiveView('explore')}
                  className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline block flex items-center space-x-1"
                >
                  <span>Explore Membership &rarr;</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Tabs Grid Options - 8 Columns */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Tabs navigation list */}
          <div className="flex border-b border-gray-100 dark:border-slate-800 text-xs font-bold bg-white dark:bg-[#162231] p-2 rounded-2xl shadow-md space-x-1 space-x-reverse justify-around">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-2 rounded-xl text-center transition ${
                activeTab === 'bookings' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/40 dark:text-slate-350'
              }`}
            >
              My Reserved Stays
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-2 rounded-xl text-center transition ${
                activeTab === 'favorites' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/40 dark:text-slate-350'
              }`}
            >
              Bookmarks Favorites
            </button>
            <button
              onClick={() => setActiveTab('notifs')}
              className={`flex-1 py-2 rounded-xl text-center transition ${
                activeTab === 'notifs' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/40 dark:text-slate-350'
              }`}
            >
              Logs Notifications ({notifications.length})
            </button>
          </div>

          {/* Tab contents section */}
          <div className="bg-white dark:bg-[#162231] border border-emerald-50 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex-1">
            
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="text-gray-300 mx-auto mb-3" size={24} />
                    <p className="text-xs text-gray-400">No active hotel room bookings on file.</p>
                    <button
                      onClick={() => setActiveView('hotels')}
                      className="mt-4 px-4 py-2 bg-emerald-600 text-white text-[11px] font-bold rounded-xl shadow-md hover:bg-emerald-700"
                    >
                      Book a Stay now
                    </button>
                  </div>
                ) : (
                  bookings.map((bkg) => (
                    <div 
                      key={bkg.id}
                      className="p-4 bg-gray-50/50 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 text-[8px] font-bold rounded uppercase">
                            {bkg.type.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">Invoice: {bkg.invoiceNo}</span>
                        </div>
                        <h4 className="font-bold text-gray-800 dark:text-white text-xs mt-1.5">{bkg.targetName}</h4>
                        <div className="flex space-x-3 space-x-reverse text-[10px] text-gray-500 dark:text-slate-400 mt-1 font-mono">
                          <span>📅 Check-In: {bkg.date}</span>
                          {bkg.endDate && <span>🌙 Check-Out: {bkg.endDate}</span>}
                          {bkg.guests && <span>👥 Guests: {bkg.guests}</span>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 space-x-reverse w-full sm:w-auto justify-between sm:justify-end border-t border-gray-100 dark:border-slate-800 pt-3 sm:pt-0 sm:border-none">
                        <div className="text-left">
                          <span className="block text-[8px] font-mono text-gray-400 uppercase">Paid amount</span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs font-mono">{bkg.totalPriceDZD.toLocaleString()} DZD</span>
                        </div>
                        <button
                          onClick={() => cancelBooking(bkg.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition"
                          title="Cancel Reservation booking"
                        >
                          <Trash2 size={14} />
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
                  <div className="col-span-2 text-center py-10 text-xs text-gray-405">
                    <Heart className="text-gray-300 mx-auto mb-3" size={24} />
                    <span>No bookmarked landmarks favorite checklist registered.</span>
                  </div>
                ) : (
                  favoriteLandmarks.map((landmark) => (
                    <div 
                      key={landmark.id}
                      className="p-3 bg-gray-50/50 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800/40 flex justify-between items-center group"
                    >
                      <div className="flex items-center space-x-2.5 space-x-reverse">
                        <img 
                          src={landmark.image} 
                          alt={landmark.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-[11px] font-bold text-gray-800 dark:text-white truncate max-w-[130px]">{landmark.name}</h4>
                          <span className="text-[9px] text-gray-400">{landmark.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFavorite(landmark.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'notifs' && (
              <div className="space-y-3.5">
                {notifications.length === 0 ? (
                  <div className="text-center py-10 text-xs text-gray-400">
                    No historic notification logs.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className="p-3 bg-gray-50/20 dark:bg-slate-900/45 rounded-xl border border-gray-100 dark:border-slate-800/20"
                    >
                      <p className="text-xs text-gray-700 dark:text-slate-350 leading-relaxed font-sans">{notif.message}</p>
                      <span className="text-[9px] text-gray-400 font-mono mt-1 block">{notif.date}</span>
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
