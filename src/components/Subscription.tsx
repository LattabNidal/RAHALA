import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Check, Sparkles, Star, ShieldCheck, Heart } from 'lucide-react';

export const Subscription: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser, setCurrentUser, addNotification } = useApp();
  
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [stripeSelectOpen, setStripeSelectOpen] = useState(false);
  const [selectedPlanCost, setSelectedPlanCost] = useState(0);

  const perksFree = [
    'Basic Virtual Explorers access',
    '3 standard AI companion replies per day',
    'Static map view points locator',
    'Standard Hotel reviews lists'
  ];

  const perksPremium = [
    'Unlimited high-fidelity 3D Digital Twin tours',
    'Unlimited server-side Gemini AI guide interactions',
    'Live integrated taxi route calculation & tracking',
    '15% Promotional hotel cashbacks/vouchers',
    'Exclusive historical chronicles logs library access',
    'Priority local driver assignments'
  ];

  const handleUpgradeTrigger = () => {
    const cost = billingPeriod === 'monthly' ? 1200 : 9900; // in DZD
    setSelectedPlanCost(cost);
    setStripeSelectOpen(true);
  };

  const handleStripeSuccess = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        isPremium: true
      });
      addNotification('Premium VIP Access activated! Unlimited 3D Twins & Gemini Guide unlocked.');
    }
    setStripeSelectOpen(false);
  };

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4" id="dashboard-premium-pricing">
      
      {/* Title block */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold italic tracking-tight text-[#1a1a1a] dark:text-[#f5f2ed]">
          {t('subTitle')}
        </h1>
        <p className="mt-3 text-xs uppercase tracking-widest font-mono text-gray-500 dark:text-gray-400">
          {t('subSubtitle')}
        </p>
      </div>

      {/* billing toggle */}
      <div className="flex justify-center items-center space-x-3 space-x-reverse mb-12">
        <span className={`text-xs uppercase tracking-wider font-semibold ${billingPeriod === 'monthly' ? 'text-[#1a1a1a] dark:text-[#f5f2ed]' : 'text-gray-450'}`}>Monthly billing</span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
          className="w-12 h-6 bg-[#1a1a1a] dark:bg-[#eae7e1] p-0.5 relative transition border border-[#d4af37] cursor-pointer"
        >
          <div className={`w-4 h-[18px] bg-[#d4af37] transition-all ${billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
        <span className={`text-xs uppercase tracking-wider font-semibold ${billingPeriod === 'yearly' ? 'text-[#1a1a1a] dark:text-[#f5f2ed]' : 'text-gray-450'} flex items-center space-x-1.5 space-x-reverse`}>
          <span>Yearly passport</span>
          <span className="px-2 py-0.5 border border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37] text-[8px] font-mono uppercase tracking-widest leading-none">Save 30%</span>
        </span>
      </div>

      {/* Plans comparison grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
        
        {/* FREE PLAN CARD */}
        <div className="bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">Standard Explorer Pass</span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">Free Travel Tier</h3>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white">0</span>
                <span className="text-xs text-gray-400 font-normal ml-1.5 font-sans lowercase">DZD / month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {perksFree.map((perk, id) => (
                <li key={id} className="flex items-start space-x-2.5 space-x-reverse text-xs text-gray-650 dark:text-gray-400 font-sans">
                  <Check className="text-emerald-600 shrink-0 mt-0.5" size={12} />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            disabled
            className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-550 text-xs font-bold uppercase tracking-wider rounded-xl cursor-not-allowed text-center"
          >
            Currently Active
          </button>
        </div>

        {/* PREMIUM GOLD PLAN CARD */}
        <div className="bg-white dark:bg-[#161a23] border-2 border-emerald-600 dark:border-emerald-500 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-md overflow-hidden">
          
          <div className="absolute top-4 right-4 bg-emerald-600 text-white font-mono px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest flex items-center space-x-1 rounded-md">
            <Star size={8} className="fill-white" />
            <span>VIP ELITE</span>
          </div>

          <div>
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-bold">Rahala Elite Series</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                Rihla Gold VIP
              </h3>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  {billingPeriod === 'monthly' ? '1,200' : '9,900'}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-1 leading-none">DZD</span>
                <span className="text-xs text-gray-500 font-normal ml-1.5 font-sans lowercase">/ {billingPeriod === 'monthly' ? 'month' : 'year'}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {perksPremium.map((perk, id) => (
                <li key={id} className="flex items-start space-x-2.5 space-x-reverse text-xs text-gray-750 dark:text-gray-300 font-sans">
                  <Sparkles className="text-emerald-600 shrink-0 mt-0.5" size={11} />
                  <span className="font-semibold">{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          {!currentUser?.isPremium ? (
            <button
              onClick={handleUpgradeTrigger}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Grab Premium Gold Pass
            </button>
          ) : (
            <div className="p-3 border border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-center text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              ✓ Lifetime VIP Access Holder
            </div>
          )}        </div>

      </div>

      {/* Stripe sheet mock wrapper */}
      {stripeSelectOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-100 animate-fade-in">
          <div className="bg-white dark:bg-[#161a23] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-up">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">VIP PASS SECURE CHECKOUT</span>
              <button 
                onClick={() => setStripeSelectOpen(false)}
                className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-5 text-xs">
              <div className="bg-gray-50 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200 p-4 rounded-xl border-l-4 border-emerald-600">
                <strong className="font-serif italic text-sm block">Rihla Gold VIP Active Pass</strong>
                <p className="mt-1 font-mono text-[10px]">Scheduled Payment: {selectedPlanCost.toLocaleString()} DZD ({billingPeriod === 'monthly' ? 'Monthly Access' : 'Yearly Access'})</p>
              </div>

              <div>
                <label className="block text-[8px] font-mono text-gray-500 mb-1 tracking-widest uppercase">SSL CREDIT CARD DETAILS</label>
                <input 
                  type="text" 
                  value="4242 •••• •••• 4242"
                  disabled
                  className="w-full border border-gray-200 dark:border-gray-800 dark:bg-gray-900 px-3 py-2 text-gray-500 rounded-xl font-mono focus:outline-none cursor-not-allowed"
                />
              </div>

              <button
                onClick={handleStripeSuccess}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Confirm Upgrade & Unlock VIP
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
