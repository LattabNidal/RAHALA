import React from 'react';
import { Compass, Sparkles, Map, CloudSun, CreditCard } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  language: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeView, setActiveView, language }) => {
  const tabs = [
    {
      id: 'explore',
      label: language === 'ar' ? 'الرئيسية' : language === 'fr' ? 'Accueil' : 'Home',
      icon: Compass,
      hash: '#/home'
    },
    {
      id: 'ai-guide',
      label: language === 'ar' ? 'المخطط' : language === 'fr' ? 'Planner' : 'Planner',
      icon: Sparkles,
      hash: '#/ai-guide'
    },
    {
      id: 'map',
      label: language === 'ar' ? 'الخريطة' : language === 'fr' ? 'Carte' : 'Map',
      icon: Map,
      hash: '#/map'
    },
    {
      id: 'dashboard',
      label: language === 'ar' ? 'الطقس' : language === 'fr' ? 'Météo' : 'Weather',
      icon: CloudSun,
      hash: '#/dashboard'
    },
    {
      id: 'billing',
      label: language === 'ar' ? 'الباقات' : language === 'fr' ? 'Abonnement' : 'Billing',
      icon: CreditCard,
      hash: '#/billing'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FDFBF7] dark:bg-[#16140F] border-t border-[#1E293B]/15 dark:border-white/15 px-2 py-1 pb-[env(safe-area-inset-bottom)] md:hidden shadow-lg backdrop-blur-md">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id || (tab.id === 'explore' && activeView === 'landing');
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveView(tab.id);
                window.location.hash = tab.hash;
              }}
              className={`flex flex-col items-center justify-center py-2 min-h-[48px] rounded-xl transition duration-200 active:scale-95 cursor-pointer ${
                isActive 
                  ? 'text-[#D4AF37] bg-[#1E293B]/5 dark:bg-white/5 font-bold' 
                  : 'text-[#1E293B]/70 dark:text-gray-400 hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-[#D4AF37] scale-110' : ''} />
              <span className="text-[10px] font-mono tracking-tighter mt-1 truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
