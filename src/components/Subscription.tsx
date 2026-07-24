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
    t('perkFree1'),
    t('perkFree2'),
    t('perkFree3'),
    t('perkFree4')
  ];

  const perksPremium = [
    t('perkPremium1'),
    t('perkPremium2'),
    t('perkPremium3'),
    t('perkPremium4'),
    t('perkPremium5'),
    t('perkPremium6')
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
      addNotification(language === 'ar' ? 'تم تفعيل العضوية الذهبية VIP بنجاح!' : 'Premium VIP Access activated! Unlimited 3D Twins & Gemini Guide unlocked.');
    }
    setStripeSelectOpen(false);
  };

  const { language } = useLanguage();

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4" id="dashboard-premium-pricing">
      
      {/* Title block */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold italic tracking-tight text-ink dark:text-[#f5f2ed]">
          {t('subTitle')}
        </h1>
        <p className="mt-3 text-xs uppercase tracking-widest font-mono text-gray-500 dark:text-gray-400">
          {t('subSubtitle')}
        </p>
      </div>

      {/* billing toggle */}
      <div className="flex justify-center items-center space-x-3 space-x-reverse mb-12">
        <span className={`text-xs uppercase tracking-wider font-semibold ${billingPeriod === 'monthly' ? 'text-ink dark:text-[#f5f2ed]' : 'text-gray-450'}`}>{t('billingMonthly')}</span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
          className="w-12 h-6 bg-ink dark:bg-[#eae7e1] p-0.5 relative transition border border-[#d4af37] cursor-pointer"
        >
          <div className={`w-4 h-[18px] bg-[#d4af37] transition-all ${billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
        <span className={`text-xs uppercase tracking-wider font-semibold ${billingPeriod === 'yearly' ? 'text-[#1a1a1a] dark:text-[#f5f2ed]' : 'text-gray-450'} flex items-center space-x-1.5 space-x-reverse`}>
          <span>{t('billingYearly')}</span>
          <span className="px-2 py-0.5 border border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37] text-[8px] font-mono uppercase tracking-widest leading-none">{t('save30')}</span>
        </span>
      </div>

      {/* Plans comparison grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
        
        {/* FREE PLAN CARD */}
        <div className="bg-white dark:bg-[#161a23] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">{t('standardExplorerPass')}</span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">{t('freeTravelTier')}</h3>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white">0</span>
                <span className="text-xs text-gray-400 font-normal ml-1.5 font-sans lowercase">DZD / {billingPeriod === 'monthly' ? 'month' : 'year'}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {perksFree.map((perk, id) => (
                <li key={id} className="flex items-start space-x-2.5 space-x-reverse text-xs text-gray-650 dark:text-gray-400 font-sans">
                  <Check className="text-or-sahara shrink-0 mt-0.5" size={12} />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            disabled
            className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-550 text-xs font-bold uppercase tracking-wider rounded-xl cursor-not-allowed text-center"
          >
            {t('currentlyActive')}
          </button>
        </div>

        {/* PREMIUM GOLD PLAN CARD */}
        <div className="bg-white dark:bg-[#161a23] border-2 border-or-sahara dark:border-or-sahara rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-md overflow-hidden">
          
          <div className="absolute top-4 right-4 bg-or-sahara text-encre font-mono px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest flex items-center space-x-1 rounded-md">
            <Star size={8} className="fill-white" />
            <span>{t('vipElite')}</span>
          </div>

          <div>
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
              <span className="text-[9px] font-mono text-or-sahara dark:text-or-sahara uppercase tracking-widest font-bold">{t('eliteSeries')}</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {t('rihlaGoldVip')}
              </h3>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-extrabold font-mono text-or-sahara dark:text-or-sahara">
                  {billingPeriod === 'monthly' ? '1,200' : '9,900'}
                </span>
                <span className="text-xs font-bold text-or-sahara dark:text-or-sahara ml-1 leading-none">DZD</span>
                <span className="text-xs text-gray-500 font-normal ml-1.5 font-sans lowercase">/ {billingPeriod === 'monthly' ? 'month' : 'year'}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {perksPremium.map((perk, id) => (
                <li key={id} className="flex items-start space-x-2.5 space-x-reverse text-xs text-gray-750 dark:text-gray-300 font-sans">
                  <Sparkles className="text-or-sahara shrink-0 mt-0.5" size={11} />
                  <span className="font-semibold">{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          {!currentUser?.isPremium ? (
            <button
              onClick={handleUpgradeTrigger}
              className="w-full py-3 bg-or-sahara hover:bg-or-sahara-hover text-encre font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              {t('grabPremiumPass')}
            </button>
          ) : (
            <div className="p-3 border border-or-sahara dark:border-or-sahara bg-or-sahara/10 dark:bg-or-sahara/10 rounded-xl text-center text-xs font-bold uppercase tracking-wider text-or-sahara dark:text-or-sahara">
              {t('lifetimeVipHolder')}
            </div>
          )}        </div>

      </div>

      {/* Stripe sheet mock wrapper */}
      {stripeSelectOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-100 animate-fade-in">
          <div className="bg-white dark:bg-[#161a23] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-up">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">{language === 'ar' ? 'بوابة الدفع الآمنة للبطاقة الذهبية' : 'VIP PASS SECURE CHECKOUT'}</span>
              <button 
                onClick={() => setStripeSelectOpen(false)}
                className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 cursor-pointer"
              >
                {t('retour')}
              </button>
            </div>

            <div className="space-y-5 text-xs">
              <div className="bg-gray-50 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200 p-4 rounded-xl border-l-4 border-or-sahara">
                <strong className="font-serif italic text-sm block">{t('rihlaGoldVip')}</strong>
                <p className="mt-1 font-mono text-[10px]">{language === 'ar' ? `المبلغ المجدول: ${selectedPlanCost.toLocaleString()} دج (${billingPeriod === 'monthly' ? 'دفع شهري' : 'جواز سنوي'})` : `Scheduled Payment: ${selectedPlanCost.toLocaleString()} DZD (${billingPeriod === 'monthly' ? 'Monthly Access' : 'Yearly Access'})`}</p>
              </div>

              <div>
                <label className="block text-[8px] font-mono text-gray-500 mb-1 tracking-widest uppercase">{language === 'ar' ? 'تفاصيل بطاقة الائتمان المشفرة SSL' : 'SSL CREDIT CARD DETAILS'}</label>
                <input 
                  type="text" 
                  value="4242 •••• •••• 4242"
                  disabled
                  className="w-full border border-gray-200 dark:border-gray-800 dark:bg-gray-900 px-3 py-2 text-gray-500 rounded-xl font-mono focus:outline-none cursor-not-allowed"
                />
              </div>

              <button
                onClick={handleStripeSuccess}
                className="w-full py-3 bg-or-sahara hover:bg-or-sahara-hover text-encre font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                {language === 'ar' ? 'تأكيد الترقية وتفعيل الـ VIP' : 'Confirm Upgrade & Unlock VIP'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
