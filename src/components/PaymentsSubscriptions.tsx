import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, Check, Sparkles, Star, ShieldCheck, Download, 
  ExternalLink, FileText, CheckCircle2, QrCode, Smartphone, 
  ArrowRight, ShieldAlert, AlertCircle, RefreshCw, Send, CheckSquare, UploadCloud,
  X, Printer, Award, Tag
} from 'lucide-react';
import { PriceTag } from './rahala/PriceTag';

export const PaymentsSubscriptions: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { currentUser, setCurrentUser, bookings, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'checkout' | 'invoices' | 'baridimob'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<'dahabia' | 'cib' | 'qr'>('dahabia');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  // Form card state
  const [ccpNumber, setCcpNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Nidal Lattab');
  const [phoneConfirm, setPhoneConfirm] = useState('+213 555-43-91-23');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // QR state
  const [qrTxId, setQrTxId] = useState('');
  const [qrReceiptFile, setQrReceiptFile] = useState<string | null>(null);
  const [qrIsScanning, setQrIsScanning] = useState(false);

  // Coupon Promotion states
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [activePromo, setActivePromo] = useState<string | null>(null);
  const [promoDiscountPct, setPromoDiscountPct] = useState(0); // percentage, e.g. 20 for 20% discount
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');
  const [promoError, setPromoError] = useState('');

  // PDF Invoice detail modal states
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // BaridiMob tutorial phone simulation state
  const [showPhoneSimulator, setShowPhoneSimulator] = useState(false);
  const [simStep, setSimStep] = useState(1);
  const [simCopiedRip, setSimCopiedRip] = useState(false);
  const [simTxnReference, setSimTxnReference] = useState('BD-88041-DZ');
  
  // Custom transaction logs / mock invoices
  const [customInvoices, setCustomInvoices] = useState<any[]>(() => {
    const saved = localStorage.getItem('rihla_custom_invoices');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'INV-DZ-9381',
        title: 'Abonnement Premium Mensuel (Rihla Gold VIP)',
        amount: 1200,
        currency: 'DZD',
        date: '2026-06-10',
        method: 'Carte Dahabia',
        status: 'Payé',
        transactionId: 'TXN-948291073-DZ'
      },
      {
        id: 'INV-DZ-3829',
        title: 'Forfait Visites Immersives & Transport Sahara',
        amount: 4500,
        currency: 'DZD',
        date: '2026-05-18',
        method: 'BaridiMob Sync',
        status: 'Payé',
        transactionId: 'TXN-283918392-DZ'
      },
      {
        id: 'INV-DZ-1928',
        title: 'Guide Historique Casbah d’Alger (Accès Privé)',
        amount: 800,
        currency: 'DZD',
        date: '2026-04-12',
        method: 'Compte CCP',
        status: 'Payé',
        transactionId: 'TXN-102948291-DZ'
      }
    ];
  });

  // Action flow simulation
  const [smsPanelOpen, setSmsPanelOpen] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [timerCount, setTimerCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncingBaridiMob, setSyncingBaridiMob] = useState(false);

  // BaridiMob details
  const officialRip = '007999990021394829 48'; // Rihla Premium CCP Account
  const officialCcp = '21394829 Clé 48';

  useEffect(() => {
    localStorage.setItem('rihla_custom_invoices', JSON.stringify(customInvoices));
  }, [customInvoices]);

  // SMS Timer Simulation
  useEffect(() => {
    let interval: any;
    if (timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerCount]);

  const getSubCost = () => {
    const original = billingPeriod === 'monthly' ? 1200 : 9900;
    return Math.round(original * (1 - promoDiscountPct / 100));
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccessMsg('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'ALGERIA2026') {
      setActivePromo('ALGERIA2026');
      setPromoDiscountPct(20);
      setPromoSuccessMsg(language === 'ar' ? 'تم تطبيق كود الخصم!خصم بقوة 20% على اشتراكك.' : 'Code promo validé ! -20% d’économie appliqués à votre formule.');
      addNotification("Code promo ALGERIA2026 activé avec succès ! (-20%)");
    } else if (code === 'SAHARA_VIP') {
      setActivePromo('SAHARA_VIP');
      setPromoDiscountPct(55);
      setPromoSuccessMsg(language === 'ar' ? 'تم تفعيل كوبون الصحراء! كود VIP بخصم 55%.' : 'Code VIP SAHARA actif! Vous profitez d’une réduction exceptionnelle de -55%.');
      addNotification("Code promo SAHARA_VIP appliqué ! Vous profitez de 55% de réduction.");
    } else {
      setPromoError(language === 'ar' ? 'كود الخصم غير صالح أو منتهي الصلاحية.' : 'Code promotionnel invalide ou expiré.');
    }
  };

  const handlePaySecureCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'qr') {
      handlePaySecureQr();
      return;
    }
    if (!termsAccepted) {
      alert(language === 'ar' ? 'الرجاء الموافقة على شروط الاستخدام أولاً.' : 'Veuillez accepter les termes et conditions pour continuer.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSmsPanelOpen(true);
      setTimerCount(60);
      addNotification("Code de sécurité OTP généré et envoyé à votre mobile de confiance via Algérie Poste.");
    }, 1500);
  };

  const handlePaySecureQr = () => {
    if (!qrTxId) {
      alert(language === 'ar' ? 'يرجى إدخال الرقم المرجعي للتحويل لتأكيد العملية.' : 'Veuillez renseigner le numéro de référence du virement.');
      return;
    }
    if (!termsAccepted) {
      alert(language === 'ar' ? 'الرجاء الموافقة على شروط الاستخدام أولاً.' : 'Veuillez accepter les termes et conditions pour continuer.');
      return;
    }
    setIsProcessing(true);
    const cost = getSubCost();
    setTimeout(() => {
      setIsProcessing(false);
      
      // Update User premium state
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          isPremium: true
        });
      }

      // Add a new invoice
      const newInvoice = {
        id: `INV-DZ-${Math.floor(Math.random() * 8999 + 1000)}`,
        title: `Abonnement Premium ${billingPeriod === 'monthly' ? 'Mensuel' : 'Annuel'} (Rihla Gold VIP)`,
        amount: cost,
        currency: 'DZD',
        date: new Date().toISOString().split('T')[0],
        method: `Virement QR BaridiMob (${qrTxId})`,
        status: 'Payé',
        transactionId: `TXN-${qrTxId}-QR`
      };

      setCustomInvoices(prev => [newInvoice, ...prev]);
      addNotification("Abonnement Premium Activé par QR Code ! Bienvenue dans le club des voyageurs VIP.");
      
      alert(language === 'ar' 
        ? 'تم التحقق من رمز الـ QR وتفعيل اشتراكك بنجاح !' 
        : 'Félicitations ! Votre virement par QR Code a été validé avec succès.'
      );
    }, 2000);
  };

  const handleSmsConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (smsCode.length < 4) {
      alert(language === 'ar' ? 'رمز التحقق غير صالح.' : 'Le code SMS entré est trop court.');
      return;
    }

    setIsProcessing(true);
    const cost = getSubCost();
    
    setTimeout(() => {
      setIsProcessing(false);
      setSmsPanelOpen(false);
      
      // Update User premium state
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          isPremium: true
        });
      }

      // Add a new invoice
      const newInvoice = {
        id: `INV-DZ-${Math.floor(Math.random() * 8999 + 1000)}`,
        title: `Abonnement Premium ${billingPeriod === 'monthly' ? 'Mensuel' : 'Annuel'} (Rihla Gold VIP)`,
        amount: cost,
        currency: 'DZD',
        date: new Date().toISOString().split('T')[0],
        method: paymentMethod === 'dahabia' ? 'Carte Dahabia (Secure)' : 'CIB Card (E-Payments)',
        status: 'Payé',
        transactionId: `TXN-${Math.floor(Math.random() * 899999999 + 100000000)}-DZ`
      };

      setCustomInvoices(prev => [newInvoice, ...prev]);
      addNotification("Abonnement Premium Activé ! Bienvenue dans le club des voyageurs d'élite en Algérie.");
      
      alert(language === 'ar' 
        ? 'تم تفعيل اشتراكك الذهبي بنجاح ورصد الفاتورة في حسابك !' 
        : 'Félicitations ! Votre abonnement PREMIUM a été activé en toute sécurité avec succès.'
      );
    }, 2000);
  };

  const handleBaridiMobSync = () => {
    setSyncingBaridiMob(true);
    setTimeout(() => {
      setSyncingBaridiMob(false);
      addNotification("Synchronisation des comptes effectuée. Factures BaridiNet à jour.");
      alert(language === 'ar'
        ? 'تمت مزامنة حساب بريدي موب بنجاح والتحقق من دفع الرسوم'
        : 'Mise à jour complétée ! Votre espace facturation est synchronisé avec BaridiNet.'
      );
    }, 1500);
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4" id="billing-module-workspace">
      
      {/* Title block */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center space-x-2 space-x-reverse bg-[#d4af37]/10 px-3 py-1 rounded-full text-[#d4af37] text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <CreditCard size={12} />
          <span>{language === 'ar' ? 'مساحة الدفع والاشتراكات الفاخرة' : 'Espace Paiements & Abonnements DZ'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#1a1a1a] dark:text-[#f5f2ed] mb-3">
          {language === 'ar' ? 'بوابة الدفع والفوترة لرحلة الجزائري' : 'Paiement Sécurisé & Gestion d’Abonnements'}
        </h1>
        <p className="text-xs uppercase tracking-widest font-mono text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'إدارة آمنة 100٪ بالتنسيق مع بريد الجزائر والشبكة الوطنية البنكية الموحدة' : 'Transactions e-Commerce certifiées PCI-DSS reliées à Algérie Poste Dahabia & CIB nationales'}
        </p>
      </div>

      {/* Tabs navigation in high contrast premium display */}
      <div className="max-w-6xl mx-auto flex justify-center mb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-4 space-x-reverse overflow-x-auto pb-px scrollbar-none">
          
          <button
            onClick={() => setActiveTab('checkout')}
            className={`px-4 pb-3.5 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'checkout'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {language === 'ar' ? '💳 الاشتراك والدفع المباشر' : '💳 S’abonner & Payer'}
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 pb-3.5 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {language === 'ar' ? '📄 كشوفات الفواتير والايصالات' : '📄 Factures & Reçus'}
            {customInvoices.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[9px] bg-emerald-500 text-white font-mono rounded">
                {customInvoices.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('baridimob')}
            className={`px-4 pb-3.5 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'baridimob'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {language === 'ar' ? '📱 ركن بريدي موب (BaridiMob)' : '📱 BaridiMob & CCP'}
          </button>

        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* TAB 1: CARD CHECKOUT & CORE PACKS */}
        {activeTab === 'checkout' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side: Premium Perks Highlights & Selection */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              <div className="bg-white dark:bg-[#111c2a]/90 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
                
                <div className="flex items-center space-x-3 space-x-reverse mb-2">
                  <div className="p-2.5 rounded-2xl bg-[#d4af37]/10 text-[#d4af37]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-black text-slate-900 dark:text-slate-100">
                      {language === 'ar' ? 'رزمة العضوية الذهبية (Premium Pass)' : 'Abonnement Rihla Gold VIP'}
                    </h3>
                    <p className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37]">
                      {language === 'ar' ? 'محتوى حصري وخدمات سياحية متكاملة' : 'Accès aux Chroniques & Visites Virtuelles Unlocked'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-500/15 flex items-start space-x-3 space-x-reverse">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <strong className="block text-xs font-extrabold text-emerald-800 dark:text-emerald-400">
                        {language === 'ar' ? 'محتوى تاريخي حصري' : 'Accès à contenu exclusif'}
                      </strong>
                      <p className="text-[10px] text-gray-500 dark:text-slate-300 mt-1">
                        Accédez aux légendes de la Casbah, chroniques inédites et cartes d’époque en HD.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-50/40 dark:bg-sky-950/10 border border-sky-500/15 flex items-start space-x-3 space-x-reverse">
                    <CheckCircle2 className="text-sky-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <strong className="block text-xs font-extrabold text-sky-800 dark:text-sky-400">
                        {language === 'ar' ? 'زيارات غامرة متقدمة' : 'Visites immersives avancées'}
                      </strong>
                      <p className="text-[10px] text-gray-500 dark:text-slate-300 mt-1">
                        Ouvrez les jumeaux numériques 3D complets à 360° avec guide audio spatial d’Algérie.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/10 border border-amber-500/15 flex items-start space-x-3 space-x-reverse">
                    <CheckCircle2 className="text-amber-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <strong className="block text-xs font-extrabold text-amber-800 dark:text-[#d4af37]">
                        {language === 'ar' ? 'مرشد الذكاء الاصطناعي بلا حدود' : 'Gemini AI Illimité'}
                      </strong>
                      <p className="text-[10px] text-gray-500 dark:text-slate-300 mt-1">
                        Consultez le compagnon intelligent sans aucune restriction de jetons.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50/40 dark:bg-red-950/10 border border-red-500/15 flex items-start space-x-3 space-x-reverse">
                    <CheckCircle2 className="text-red-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <strong className="block text-xs font-extrabold text-red-800 dark:text-red-400">
                        {language === 'ar' ? 'تخفيضات الفنادق والنقليات' : 'Réductions Hôtels & Taxis'}
                      </strong>
                      <p className="text-[10px] text-gray-500 dark:text-slate-300 mt-1">
                        Bénéficiez de 15% de cashback en DZD sur vos séjours et priorités sur les taxis.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Billing cycle choosing */}
                <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-3">
                    {language === 'ar' ? 'حدد خطتك الدورية المفضلة :' : 'Sélectionnez votre fréquence de facturation :'}
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setBillingPeriod('monthly')}
                      className={`p-4 rounded-xl border flex flex-col justify-between text-start cursor-pointer transition-all ${
                        billingPeriod === 'monthly'
                          ? 'border-[#d4af37] bg-[#d4af37]/5 dark:bg-[#d4af37]/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                          {language === 'ar' ? 'اشتراك شهري' : 'Mensuel'}
                        </span>
                        {billingPeriod === 'monthly' && <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />}
                      </div>
                      <div className="mt-2.5">
                        {promoDiscountPct > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 line-through"><PriceTag amount={1200} className="text-gray-400!" /></span>
                            <span className="text-xl font-bold font-mono text-emerald-500 flex items-center gap-1">
                              <PriceTag amount={Math.round(1200 * (1 - promoDiscountPct / 100))} className="text-emerald-500!" />
                              <span className="text-[10px] font-mono text-slate-500 ml-1">/ mois</span>
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <PriceTag amount={1200} className="text-slate-900 dark:text-slate-100 text-xl font-bold" />
                            <span className="text-[10px] font-mono text-slate-500 ml-1">/ mois</span>
                          </div>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setBillingPeriod('yearly')}
                      className={`p-4 rounded-xl border flex flex-col justify-between text-start cursor-pointer transition-all relative overflow-hidden ${
                        billingPeriod === 'yearly'
                          ? 'border-[#d4af37] bg-[#d4af37]/5 dark:bg-[#d4af37]/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="absolute top-0 right-0 bg-[#d4af37] text-black font-mono text-[8px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                        {language === 'ar' ? 'توفير ٣0٪' : 'Save 30%'}
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                          {language === 'ar' ? 'اشتراك سنوي (كامل)' : 'Passeport Annuel'}
                        </span>
                        {billingPeriod === 'yearly' && <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />}
                      </div>
                      <div className="mt-2.5">
                        {promoDiscountPct > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 line-through"><PriceTag amount={9900} className="text-gray-400!" /></span>
                            <span className="text-xl font-bold font-mono text-emerald-500 flex items-center gap-1">
                              <PriceTag amount={Math.round(9900 * (1 - promoDiscountPct / 100))} className="text-emerald-500!" />
                              <span className="text-[10px] font-mono text-[#d4af37] ml-1">/ an</span>
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <PriceTag amount={9900} className="text-[#d4af37] text-xl font-bold" />
                            <span className="text-[10px] font-mono text-slate-500 ml-1">/ an</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Promo coupon interactive drawer */}
                  <form onSubmit={handleApplyPromo} className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                      {language === 'ar' ? 'هل لديك رمز خصم ترويجي ؟' : 'Code de Réduction Coupon :'}
                    </label>
                    <div className="flex space-x-2 space-x-reverse">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="e.g. ALGERIA2026, SAHARA_VIP"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          className="w-full text-xs font-mono uppercase border border-slate-250 dark:border-slate-800 dark:bg-slate-950 px-3 py-2 rounded-lg focus:outline-none focus:border-[#d4af37]"
                        />
                        <Tag className="absolute right-2.5 top-2.5 text-slate-400" size={13} />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-slate-900 text-white dark:bg-slate-800 hover:bg-[#d4af37] hover:text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition"
                      >
                        {language === 'ar' ? 'تطبيق' : 'Appliquer'}
                      </button>
                    </div>

                    {promoError && (
                      <p className="text-[10px] font-semibold text-red-500 flex items-center space-x-1 space-x-reverse">
                        <AlertCircle size={10} />
                        <span>{promoError}</span>
                      </p>
                    )}

                    {promoSuccessMsg && (
                      <p className="text-[10px] font-semibold text-emerald-500 flex items-center space-x-1 space-x-reverse">
                        <CheckCircle2 size={10} />
                        <span>{promoSuccessMsg}</span>
                      </p>
                    )}

                    <div className="text-[9px] text-gray-400 space-y-0.5">
                      <p>💡 {language === 'ar' ? 'استخدم الأكواد التجريبية :' : 'Codes promotionnels à tester :'} <span className="text-[#d4af37] font-bold underline cursor-pointer" onClick={() => setPromoCodeInput('ALGERIA2026')}>ALGERIA2026</span> (20% OFF) أو <span className="text-[#d4af37] font-bold underline cursor-pointer" onClick={() => setPromoCodeInput('SAHARA_VIP')}>SAHARA_VIP</span> (55% OFF)</p>
                    </div>
                  </form>
                </div>

              </div>

              {/* Secure guarantee badge */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-400 flex items-center space-x-3 space-x-reverse">
                <ShieldCheck className="shrink-0 text-emerald-500" size={24} />
                <p className="font-sans">
                  <strong>{language === 'ar' ? 'حماية مشفرة ثلاثية الأبعاد (3D Secure)' : 'Garantie e-Commerce Algérie'}</strong> : 
                  {language === 'ar' 
                    ? ' تمر جميع المدفوعات عبر معالجات التحقق الثنائي التابعة لبريد الجزائر SATIM لضمان حماية مطلقة.'
                    : ' Vos transactions sont protégées par le système national d’authentification forte par SMS.'}
                </p>
              </div>

            </div>

            {/* Right side: Secure payment checkout form */}
            <div className="lg:col-span-5">
              
              <div className="bg-white dark:bg-[#111c2a]/95 border-2 border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                
                {/* Visual decorative card head */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-white to-red-500" />
                
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center justify-between">
                  <span>{language === 'ar' ? 'تفاصيل السداد الإلكتروني' : 'Saisie Paiement Sécurisé'}</span>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Carte-dahabia.jpg" 
                      alt="Carte Dahabia Placeholder"
                      onError={(e)=>{ (e.target as HTMLImageElement).src="https://img.icons8.com/color/48/000000/magnetic-card.png" }}
                      className="h-5 w-8 object-cover rounded-md border border-slate-200"
                    />
                  </div>
                </h3>

                {/* Secure checkout or validation SMS */}
                {!smsPanelOpen ? (
                  <form onSubmit={handlePaySecureCard} className="space-y-4 text-xs font-sans">
                    
                    {/* Method Choice Selector */}
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-bold">
                        {language === 'ar' ? 'اصنع اختيار وسيلة الدفع :' : 'Sélectionner le mode de règlement :'}
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('dahabia')}
                          className={`py-2 px-1 rounded-lg border text-center font-bold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                            paymentMethod === 'dahabia'
                              ? 'border-[#d4af37] bg-[#d4af37]/5 text-black dark:text-[#d4af37] font-black'
                              : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-850 dark:hover:text-amber-500'
                          }`}
                        >
                          <span className="truncate w-full">{language === 'ar' ? 'الذهبية' : 'Dahabia'}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cib')}
                          className={`py-2 px-1 rounded-lg border text-center font-bold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                            paymentMethod === 'cib'
                              ? 'border-[#d4af37] bg-[#d4af37]/5 text-black dark:text-[#d4af37] font-black'
                              : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-850 dark:hover:text-amber-500'
                          }`}
                        >
                          <span className="truncate w-full">{language === 'ar' ? 'بطاقة CIB' : 'Carte CIB'}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('qr')}
                          className={`py-2 px-1 rounded-lg border text-center font-bold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                            paymentMethod === 'qr'
                              ? 'border-[#d4af37] bg-[#d4af37]/5 text-amber-500 font-extrabold'
                              : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-850 dark:hover:text-amber-500'
                          }`}
                        >
                          <span className="flex items-center space-x-1 space-x-reverse justify-center w-full truncate">
                            <QrCode size={11} className="inline-block" />
                            <span>{language === 'ar' ? 'رمز QR' : 'Code QR'}</span>
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        </button>
                      </div>
                    </div>

                    {paymentMethod !== 'qr' ? (
                      <>
                        {/* Numeric inputs */}
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1 font-bold">
                            {paymentMethod === 'dahabia' 
                              ? (language === 'ar' ? 'رقم البطاقة الذهبية (16 رقماً) :' : 'Numéro de Carte Dahabia (16 chiffres) :') 
                              : (language === 'ar' ? 'رقم بطاقة CIB البنكية :' : 'Numéro de Carte Interbancaire CIB :')}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required={paymentMethod !== 'qr'}
                              placeholder="6280 9300 •••• ••••"
                              maxLength={19}
                              value={ccpNumber}
                              onChange={(e) => {
                                // auto-format space for card feel
                                let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                let matches = val.match(/\d{4,16}/g);
                                let match = matches && matches[0] || '';
                                let parts = [];
                                for (let i=0, len=match.length; i<len; i+=4) {
                                  parts.push(match.substring(i, i+4));
                                }
                                if (parts.length > 0) {
                                  setCcpNumber(parts.join(' '));
                                } else {
                                  setCcpNumber(val);
                                }
                              }}
                              className="w-full text-sm font-mono border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#d4af37]"
                            />
                            <CreditCard className="absolute right-3 top-3 text-slate-400" size={16} />
                          </div>
                        </div>

                        {/* Expiry / CVV block */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1 font-bold">
                              {language === 'ar' ? 'تاريخ نهاية الصلاحية :' : 'Date Exp (MM/AA) :'}
                            </label>
                            <input
                              type="text"
                              required={paymentMethod !== 'qr'}
                              placeholder="09 / 28"
                              maxLength={7}
                              className="w-full text-center font-mono border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2.5 rounded-lg focus:outline-none"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1 font-bold">
                              {language === 'ar' ? 'الرمز السري CVV2 :' : 'Crypto CVV2 (3 chiffres) :'}
                            </label>
                            <input
                              type="password"
                              required={paymentMethod !== 'qr'}
                              placeholder="•••"
                              maxLength={3}
                              className="w-full text-center font-mono border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2.5 rounded-lg focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Custholder */}
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1 font-bold">
                            {language === 'ar' ? 'اسم حامل البطاقة (بالحروف اللاتينية) :' : 'Nom du Titulaire (Lettres capitales) :'}
                          </label>
                          <input
                            type="text"
                            required={paymentMethod !== 'qr'}
                            value={cardHolder}
                            onChange={(e)=>setCardHolder(e.target.value)}
                            placeholder="NIDAL LATTAB"
                            className="w-full font-mono uppercase bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-lg focus:outline-none"
                          />
                        </div>

                        {/* Mobile Notification for OTP */}
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1 font-bold flex items-center justify-between">
                            <span>{language === 'ar' ? 'الهاتف المرتبط بالبطاقة (لتلقي الرمز) :' : 'N° Mobile rattaché à la carte (OTP) :'}</span>
                            <span className="text-[9px] text-[#d4af37] font-semibold">{language === 'ar' ? 'بريد الجزائر' : 'Vérification Forte'}</span>
                          </label>
                          <input
                            type="text"
                            required={paymentMethod !== 'qr'}
                            value={phoneConfirm}
                            onChange={(e)=>setPhoneConfirm(e.target.value)}
                            placeholder="+213 555-43-91-23"
                            className="w-full font-mono border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2.5 rounded-lg focus:outline-none"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* QR Code payment option UI */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-3">
                          <label className="block text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">
                            {language === 'ar' ? 'رمز الاستجابة السريعة للمطابقة السريعة :' : 'CODE QR BARIDIMOB DYNAMIQUE'}
                          </label>

                          <div className="relative p-3.5 bg-white rounded-2xl shadow-md border border-slate-200/60 transition duration-300 hover:scale-[1.02] flex items-center justify-center">
                            {/* SVG QR code */}
                            <svg width="130" height="130" viewBox="0 0 100 100" className="text-slate-900">
                              <rect width="100" height="100" fill="none" />
                              <path d="M 5,5 H 25 V 25 H 5 Z" fill="currentColor" />
                              <path d="M 10,10 H 20 V 20 H 10 Z" fill="white" />
                              <path d="M 75,5 H 95 V 25 H 75 Z" fill="currentColor" />
                              <path d="M 80,10 H 90 V 20 H 80 Z" fill="white" />
                              <path d="M 5,75 H 25 V 95 H 5 Z" fill="currentColor" />
                              <path d="M 10,80 H 20 V 90 H 10 Z" fill="white" />
                              
                              <rect x="35" y="5" width="5" height="5" fill="currentColor" />
                              <rect x="45" y="15" width="10" height="5" fill="currentColor" />
                              <rect x="35" y="25" width="5" height="10" fill="currentColor" />
                              <rect x="60" y="5" width="5" height="15" fill="currentColor" />
                              <rect x="55" y="30" width="15" height="5" fill="currentColor" />
                              <rect x="40" y="45" width="5" height="5" fill="currentColor" />
                              <rect x="15" y="40" width="10" height="5" fill="currentColor" />
                              <rect x="55" y="50" width="15" height="15" fill="currentColor" />
                              <rect x="75" y="40" width="15" height="10" fill="currentColor" />
                              <rect x="85" y="60" width="10" height="5" fill="currentColor" />
                              <rect x="35" y="75" width="15" height="5" fill="currentColor" />
                              <rect x="50" y="85" width="5" height="10" fill="currentColor" />
                              <rect x="65" y="75" width="30" height="5" fill="currentColor" />
                              <rect x="75" y="85" width="5" height="5" fill="currentColor" />
                              
                              {/* Inner brand gold stamp */}
                              <rect x="42" y="42" width="16" height="16" fill="#d4af37" rx="3" />
                              <path d="M 45,47 L 50,53 L 55,47" stroke="black" strokeWidth="2.5" fill="none" />
                            </svg>
                            
                            {/* Scanning pulse bar */}
                            <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-[#d4af37] animate-bounce shadow-md shadow-[#d4af37]/40" />
                          </div>

                          <div className="text-[10px] space-y-1 font-mono">
                            <p className="font-extrabold text-[#d4af37]">{officialRip}</p>
                            <p className="text-gray-500 uppercase">
                              {language === 'ar' 
                                ? `قيمة السداد: ${billingPeriod === 'monthly' ? '1,200' : '9,900'} د.ج` 
                                : `Montant requis : ${billingPeriod === 'monthly' ? '1 200' : '9 900'} DZD`}
                            </p>
                          </div>
                        </div>

                        {/* Drag and Drop uploader receipt */}
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1 font-bold">
                            {language === 'ar' ? 'تحميل إثبات معاملة بريدي موب :' : 'Preuve d’envoi BaridiMob (Reçu) :'}
                          </label>
                          <div 
                            onClick={() => {
                              setQrReceiptFile("Baridi_Recu_" + Math.floor(Math.random() * 89999 + 10000) + ".jpg");
                              addNotification("Écran de transaction BaridiMob chargé !");
                            }}
                            className="p-3.5 border border-dashed border-slate-200 dark:border-slate-800/85 rounded-xl bg-[#d4af37]/5 text-center cursor-pointer transition hover:bg-[#d4af37]/10"
                          >
                            {qrReceiptFile ? (
                              <div className="flex items-center justify-center space-x-2 text-emerald-500 dark:text-emerald-400 font-mono text-xs">
                                <ShieldCheck size={14} className="shrink-0 animate-bounce" />
                                <span className="font-extrabold underline truncate max-w-[200px]">{qrReceiptFile}</span>
                              </div>
                            ) : (
                              <div className="text-slate-400 space-y-1">
                                <UploadCloud className="mx-auto text-[#d4af37] animate-pulse" size={20} />
                                <p className="text-[10px] font-bold">
                                  {language === 'ar' ? 'انقر لإدراج إثبات التحويل المالي' : 'Cliquez pour insérer l’imprimé d’écran'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Reference transaction uploader */}
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1 font-bold">
                            {language === 'ar' ? 'الرمز التعريفي للمعاملة (Id Trans) :' : 'Référence Unique du Virement (ID Trans) :'}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required={paymentMethod === 'qr'}
                              placeholder="e.g. BD-89318-DZ"
                              value={qrTxId}
                              onChange={(e) => setQrTxId(e.target.value.toUpperCase())}
                              className="w-full text-xs font-mono border border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#d4af37]"
                            />
                            <QrCode className="absolute right-3 top-3 text-slate-450" size={14} />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Terms control */}
                    <div className="flex items-start space-x-2.5 space-x-reverse pt-2">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        checked={termsAccepted}
                        onChange={(e)=>setTermsAccepted(e.target.checked)}
                        className="mt-0.5 rounded text-[#d4af37] focus:ring-[#d4af37] cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-[10px] text-gray-500 leading-normal select-none cursor-pointer">
                        {language === 'ar' 
                          ? 'أوافق على اللوائح العامة لبريد الجزائر وأتفهم أن هذه المحاكاة تحترم بروتوكول التشفير الآمن بالكامل للوقاية ضد الاحتيال.'
                          : 'J’accepte les Conditions Générales de Vente Rihla DZ. Mes informations de test sont cryptées localement.'}
                      </label>
                    </div>

                    {/* Pay trigger action */}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full mt-4 py-3.5 bg-slate-900 border border-[#d4af37] dark:bg-[#eae7e1] text-white dark:text-slate-950 hover:bg-[#d4af37] hover:text-black dark:hover:bg-[#d4af37] dark:hover:text-black font-mono font-bold text-xs uppercase tracking-widest transition-all rounded-xl focus:outline-none cursor-pointer flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="animate-spin text-slate-500 shrink-0" size={14} />
                          <span>{language === 'ar' ? 'جاري الاتصال بالنظام والمطابقة...' : 'Connexion et authentification...'}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={14} />
                          <span>
                            {paymentMethod === 'qr' 
                              ? (language === 'ar' ? `تأكيد الدفع بالـ QR` : 'Valider le paiement QR Code')
                              : (language === 'ar' 
                                  ? `تأكيد ودفع ${billingPeriod === 'monthly' ? '1,200' : '9,900'} د.ج` 
                                  : `Valider et Payer ${billingPeriod === 'monthly' ? '1 200' : '9 900'} DZD`)}
                          </span>
                        </>
                      )}
                    </button>

                  </form>
                ) : (
                  
                  // SMS VERIFICATION CODE STEP
                  <div className="space-y-6 text-xs text-slate-900 dark:text-slate-150">
                    <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-xl space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <AlertCircle className="text-amber-500 shrink-0" size={18} />
                        <strong className="font-extrabold text-[#d4af37] uppercase tracking-wider block">
                          {language === 'ar' ? 'التحقق الثنائي لبريد الجزائر' : 'AUTHENTICATION FORTE SMS'}
                        </strong>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {language === 'ar'
                          ? `أدخل رمز التحقق (OTP) المكون من 6 أرقام المرسل إلى الهاتف ${phoneConfirm} لإتمام الدفع بنجاح.`
                          : `Un code de sécurité à 6 chiffres a été expédié au numéro ${phoneConfirm}. Veuillez le renseigner ci-dessous.`}
                      </p>
                    </div>

                    <form onSubmit={handleSmsConfirmation} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-bold text-center">
                          {language === 'ar' ? 'رمز التأكيد OTP :' : 'CODE DE SÉCURITÉ UNIQUE (SMS OTP)'}
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={smsCode}
                          onChange={(e)=>setSmsCode(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="123456"
                          className="w-full text-center text-3xl font-mono tracking-[0.7em] font-extrabold border-2 border-[#d4af37] dark:bg-slate-950 px-4 py-3 rounded-lg focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-between items-center text-[11px] font-mono font-bold">
                        <span className="text-gray-400">
                          {language === 'ar' ? 'صلاحية الرمز تنتهي في :' : 'Le code expire dans :'}
                        </span>
                        <span className={timerCount < 15 ? "text-red-500" : "text-emerald-500"}>
                          {timerCount}s
                        </span>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-extrabold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center space-x-2 space-x-reverse cursor-pointer"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="animate-spin shrink-0" size={14} />
                              <span>{language === 'ar' ? 'جاري التحقق من الرمز...' : 'Vérification en cours...'}</span>
                            </>
                          ) : (
                            <>
                              <CheckSquare size={14} />
                              <span>{language === 'ar' ? 'تأكيد السداد (CONFIRM)' : 'CONFIRMER LE PAIEMENT'}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setTimerCount(60);
                            addNotification("Nouveau code de sécurité OTP réexpédié.");
                          }}
                          className="w-full py-2 bg-transparent text-slate-500 hover:text-[#d4af37] text-[10px] font-mono uppercase tracking-wider text-center"
                        >
                          {language === 'ar' ? 'إعادة إرسال الرمز' : 'Renvoyer le code par SMS'}
                        </button>
                      </div>

                    </form>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: INVOICE MANAGEMENT & HISTORY */}
        {activeTab === 'invoices' && (
          <div className="bg-white dark:bg-[#111c2a]/95 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
              <div>
                <h3 className="text-xl font-serif font-black text-slate-900 dark:text-slate-100">
                  {language === 'ar' ? 'سجل الفواتير والمستندات المالية' : 'Registre des Comptes & Factures'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'ar' ? 'تتبع فواتير الفنادق، الخدمات ونقليات رحلة DZ الصادرة بالدينار الجزائري.' : 'Téléchargez vos justificatifs, relevés de réservations et abonnements Rihla DZ.'}
                </p>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={handleBaridiMobSync}
                  className="px-3.5 py-1.5 bg-[#d4af37]/10 hover:bg-[#d4af37]/25 text-[#d4af37] text-xs font-mono font-bold uppercase tracking-wider rounded-lg border border-[#d4af37]/35 inline-flex items-center space-x-2 space-x-reverse transition"
                >
                  <RefreshCw size={12} className={syncingBaridiMob ? "animate-spin" : ""} />
                  <span>{language === 'ar' ? 'مزامنة مع بريدي موب' : 'Mise à jour BaridiMob'}</span>
                </button>
              </div>
            </div>

            {/* List of custom invoices and bookings */}
            <div className="space-y-4">
              
              {/* Combine local hotel bookings and Premium payment invoice list */}
              {customInvoices.length === 0 && bookings.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-serif italic text-xs">
                  {language === 'ar' ? 'لا توجد فواتير صادرة حالياً.' : 'Aucun relevé de paiement repéré pour le moment.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800/80 text-gray-500 font-mono tracking-widest text-[9px] uppercase">
                        <th className="py-3 text-start">{language === 'ar' ? 'رقم الفاتورة' : 'REF FACTURE'}</th>
                        <th className="py-3 text-start">{language === 'ar' ? 'البيان والخدمة' : 'DESCRIPTION EXPLICATIVE'}</th>
                        <th className="py-3 text-start">{language === 'ar' ? 'التاريخ' : 'DATE'}</th>
                        <th className="py-3 text-start">{language === 'ar' ? 'طريقة الدفع' : 'MÉTHODE'}</th>
                        <th className="py-3 text-start">{language === 'ar' ? 'المبلغ الإجمالي' : 'MONTANT (DZD)'}</th>
                        <th className="py-3 text-center">{language === 'ar' ? 'الوضعية' : 'STATUT'}</th>
                        <th className="py-3 text-end">{language === 'ar' ? 'المستند' : 'ACTION'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      
                      {/* 1. Custom Interactive Premium Tiers Invoices */}
                      {customInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition">
                          <td className="py-4 font-mono font-bold text-slate-900 dark:text-slate-100">{inv.id}</td>
                          <td className="py-4">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">{inv.title}</span>
                            <span className="text-[10px] text-gray-500 font-mono italic">TXN ID: {inv.transactionId}</span>
                          </td>
                          <td className="py-4 font-mono text-gray-550">{inv.date}</td>
                          <td className="py-4">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-350 font-mono font-bold text-[9px]">
                              {inv.method}
                            </span>
                          </td>
                          <td className="py-4 font-mono font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                            <PriceTag amount={inv.amount} />
                          </td>
                          <td className="py-4 text-center">
                            <span className="inline-block px-2.5 py-1 text-[9px] font-mono leading-none tracking-wider uppercase font-extrabold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              {language === 'ar' ? 'مدفوعة' : 'PAYÉE ✓'}
                            </span>
                          </td>
                          <td className="py-4 text-end">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-900 rounded-lg transition"
                              title="Visualiser et Imprimer la facture PDF"
                            >
                              <Download size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* 2. Hotel Room Bookings Integrations */}
                      {bookings.map((bkg) => {
                        const totalCost = Number(bkg.totalCost) || 15000;
                        return (
                          <tr key={bkg.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition">
                            <td className="py-4 font-mono font-bold text-[#d4af37]">{bkg.invoiceNo || 'INV-BKG'}</td>
                            <td className="py-4">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                Réservation de Séjour : {bkg.targetName}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {bkg.nights || 1} {language === 'ar' ? 'ليالي' : 'nuit(s)'} • {bkg.guests || 2} voyageurs
                              </span>
                            </td>
                            <td className="py-4 font-mono text-gray-550">{bkg.checkInDate || '2026-06-16'}</td>
                            <td className="py-4">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-350 font-mono font-bold text-[9px]">
                                E-Payment CIB
                              </span>
                            </td>
                            <td className="py-4 font-mono font-extrabold text-slate-900 dark:text-slate-100">
                              <PriceTag amount={totalCost} />
                            </td>
                            <td className="py-4 text-center">
                              <span className="inline-block px-2.5 py-1 text-[9px] font-mono leading-none tracking-wider uppercase font-extrabold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                {language === 'ar' ? 'مدفوعة' : 'PAYÉE ✓'}
                              </span>
                            </td>
                            <td className="py-4 text-end">
                              <button
                                onClick={() => {
                                  const normalizedBkgInv = {
                                    id: bkg.invoiceNo || `INV-BKG-${bkg.id}`,
                                    title: `Séjour : ${bkg.targetName}`,
                                    amount: totalCost,
                                    date: bkg.checkInDate || '25-05-2026',
                                    method: 'E-Payment CIB',
                                    transactionId: `TXN-BKG-${bkg.id}`
                                  };
                                  setSelectedInvoice(normalizedBkgInv);
                                }}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-900 rounded-lg transition"
                                title="Visualiser la facture du séjour"
                              >
                                <Download size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                    </tbody>
                  </table>
                </div>
              )}

            </div>

            {/* Total summary board details */}
            <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-mono">
              <div className="text-slate-500 text-center sm:text-start mb-4 sm:mb-0">
                <span>{language === 'ar' ? 'إجمالي المدفوعات المسجلة :' : 'TOTAL DE VOS TRANSACTIONS RÉUSSIES :'}</span>
                <span className="font-extrabold text-slate-850 dark:text-white block sm:inline sm:ml-2 text-sm">
                  <PriceTag 
                    amount={
                      customInvoices.reduce((a, b) => a + b.amount, 0) + 
                      bookings.reduce((a, b) => a + (Number(b.totalCost) || 15000), 0)
                    } 
                  />
                </span>
              </div>
              <div className="text-gray-400 text-[10px] text-center sm:text-end uppercase">
                {language === 'ar' ? 'جميع الأسعار تشمل رسوم بريد الجزائر وإدارة الضرائب' : 'Généré conformément aux déclarations d’impôts d’Algérie'}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: BARIDIMOB INTEGRATION */}
        {activeTab === 'baridimob' && (
          <div className="bg-white dark:bg-[#111c2a]/95 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-150 dark:border-slate-800 pb-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="h-14 w-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-xs shadow-lg shadow-amber-500/10">
                  <Smartphone className="shrink-0" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2 space-x-reverse">
                    <span>بريدي موب - بريد الجزائر</span>
                    <span className="text-xs bg-[#d4af37]/10 text-[#d4af37] px-2.5 py-0.5 rounded-full font-mono">
                      Official API Sync
                    </span>
                  </h3>
                  <a 
                    href="https://baridinet.poste.dz/" 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-amber-500 hover:underline flex items-center space-x-1 space-x-reverse mt-1"
                  >
                    <span>Lien officiel BaridiNet : https://baridinet.poste.dz</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div>
                <button
                  onClick={handleBaridiMobSync}
                  disabled={syncingBaridiMob}
                  className="w-full sm:w-auto px-5 py-3 bg-[#d4af37] hover:bg-amber-500 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center space-x-2 space-x-reverse cursor-pointer shadow-lg"
                >
                  {syncingBaridiMob ? (
                    <>
                      <RefreshCw className="animate-spin text-black" size={14} />
                      <span>{language === 'ar' ? 'جاري التحقق من التحويل...' : 'Vérification en cours...'}</span>
                    </>
                  ) : (
                    <>
                      <QrCode size={14} />
                      <span>{language === 'ar' ? 'مزامنة التحويل الآن ⟳' : 'Synchroniser Mon Virement ⟳'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
              
              {/* Box 1: Instructions & details (7 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <h4 className="text-sm uppercase tracking-wider font-mono font-bold text-[#d4af37] flex items-center space-x-2 space-x-reverse">
                  <span>Instructions de virement CCP pour valider manuellement l’abonnement :</span>
                </h4>

                <div className="space-y-4 text-xs font-sans text-slate-750 dark:text-slate-300">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 font-mono">
                    
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-gray-400">RIP (Relevé d'Identité Postale) :</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-extrabold text-[#d4af37]">{officialRip}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(officialRip);
                            addNotification("RIP Copié dans le presse-papier.");
                          }}
                          className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-[9px] font-mono hover:text-white hover:bg-slate-700 rounded"
                        >
                          Copier
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-gray-400">CCP d'affectation :</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-extrabold text-slate-850 dark:text-slate-100">{officialCcp}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(officialCcp);
                            addNotification("Numéro CCP Copié.");
                          }}
                          className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-[9px] font-mono hover:text-white"
                        >
                          Copier
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Bénéficiaire :</span>
                      <span className="font-extrabold text-slate-900 dark:text-white uppercase">Sarl Rihla DZ Voyage</span>
                    </div>

                  </div>

                  {/* Steps list */}
                  <ol className="list-decimal list-inside space-y-4 pt-2 leading-relaxed">
                    <li>
                      <strong>{language === 'ar' ? 'افتح الهاتف المحمول :' : 'Ouvrez votre application BaridiMob'}</strong> 
                      {language === 'ar' 
                        ? ' سجل الدخول وانتقل نحو "virement" (التحويلات المالـية).' 
                        : ' Connectez-vous et rendez-vous dans l’onglet "Virement" (Virement de compte CCP à compte CCP).'}
                    </li>
                    <li>
                      <strong>{language === 'ar' ? 'أدخل معلومات المستفيد :' : 'Renseignez notre RIP ou scannez le QR code adjacent'}</strong> 
                      {language === 'ar'
                        ? ' الصق رقم الـ RIP الموضح بالأعلى لتفادي أي خطأ مالي.'
                        : ' Collez notre code RIP national ou flashez simplement la vignette ci-contre pour charger les coordonnées de Rihla DZ.'}
                    </li>
                    <li>
                      <strong>{language === 'ar' ? 'حول قيمة الاشتراك :' : 'Effectuez le virement'}</strong> 
                      {language === 'ar'
                        ? ' ادخل المبلغ المالي الذي تود تحويله (1,200 د.ج للشهر أو 9,900 د.ج للسنة).'
                        : ' Indiquez la valeur associée à votre abonnement (1,200 DZD ou 9,900 DZD) puis validez.'}
                    </li>
                    <li>
                      <strong>{language === 'ar' ? 'مزامنة المعاملة على رحلة :' : 'Synchronisez vos données sur l’app'}</strong> 
                      {language === 'ar'
                        ? ' انقر على زر المزامنة بالأعلى ليقوم نظامنا بالتحقق الفوري مع نظام بريد الجزائر وتفعيل اشتراكك تلقائياً.'
                        : ' Cliquez sur le bouton "Synchroniser" ci-dessus. Notre système interroge l’API d’Algérie Poste pour libérer instantanément vos droits d’accès VIP.'}
                    </li>
                  </ol>

                  {/* Real-time Phone Simulator Launch button block */}
                  <div className="mt-8 p-4 bg-[#d4af37]/5 dark:bg-[#d4af37]/10 rounded-2xl border border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h5 className="font-bold text-xs text-[#d4af37] flex items-center space-x-1.5 space-x-reverse">
                        <Smartphone size={14} className="text-[#d4af37]" />
                        <span>{language === 'ar' ? 'محاكي تطبيق بريدي موب التفاعلي' : 'Simulateur Virtuel Interactif BaridiMob'}</span>
                      </h5>
                      <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">
                        {language === 'ar'
                          ? 'جرب تحويل الأموال على هاتف وهمي لنسخ كود المعاملة لرحلة.'
                          : 'Faites un virement de test sur un smartphone virtuel pour copier le code de transaction.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPhoneSimulator(true);
                        setSimStep(1);
                      }}
                      className="px-4 py-2 bg-slate-900 border border-slate-700/50 hover:bg-[#d4af37] text-white hover:text-black font-mono font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      {language === 'ar' ? 'تشغيل المحاكي 📱' : 'Lancer le Simulateur 📱'}
                    </button>
                  </div>

                </div>

              </div>

              {/* Box 2: Visual QR code & official login reminder (4 cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] font-bold mb-4">
                    {language === 'ar' ? 'امسح الـ QR الرمز السريع' : 'SCAN SMART QR WI-FI'}
                  </span>
                  
                  {/* Visual QR Code mock crafted with SVG */}
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200/50 mb-4 inline-block">
                    <svg width="150" height="150" viewBox="0 0 100 100" className="text-slate-900">
                      <rect width="100" height="100" fill="none" />
                      {/* Top left marker */}
                      <path d="M 5,5 H 25 V 25 H 5 Z" fill="currentColor" />
                      <path d="M 10,10 H 20 V 20 H 10 Z" fill="white" />
                      {/* Top right marker */}
                      <path d="M 75,5 H 95 V 25 H 75 Z" fill="currentColor" />
                      <path d="M 80,10 H 90 V 20 H 80 Z" fill="white" />
                      {/* Bottom left marker */}
                      <path d="M 5,75 H 25 V 95 H 5 Z" fill="currentColor" />
                      <path d="M 10,80 H 20 V 90 H 10 Z" fill="white" />
                      {/* Random procedural dots to simulate realistic QR */}
                      <rect x="35" y="5" width="5" height="5" fill="currentColor" />
                      <rect x="45" y="15" width="10" height="5" fill="currentColor" />
                      <rect x="35" y="25" width="5" height="10" fill="currentColor" />
                      <rect x="60" y="5" width="5" height="15" fill="currentColor" />
                      <rect x="55" y="30" width="15" height="5" fill="currentColor" />
                      <rect x="40" y="45" width="5" height="5" fill="currentColor" />
                      <rect x="15" y="40" width="10" height="5" fill="currentColor" />
                      <rect x="5" y="55" width="5" height="10" fill="currentColor" />
                      <rect x="50" y="50" width="15" height="15" fill="currentColor" />
                      <rect x="75" y="40" width="15" height="10" fill="currentColor" />
                      <rect x="85" y="60" width="10" height="5" fill="currentColor" />
                      <rect x="35" y="75" width="15" height="5" fill="currentColor" />
                      <rect x="50" y="85" width="5" height="10" fill="currentColor" />
                      <rect x="65" y="75" width="30" height="5" fill="currentColor" />
                      <rect x="75" y="85" width="5" height="5" fill="currentColor" />
                    </svg>
                  </div>

                  <p className="text-[10px] font-mono text-gray-500 max-w-xs">
                    {language === 'ar'
                      ? 'امسح الرمز لتفعيل تحويل RIP مباشر ومؤمن عبر تطبيق الهاتف بريدي موب.'
                      : 'Scan de virement rapide national d’Algérie Poste.'}
                  </p>
                </div>

                {/* Reminder for official postal gateway link */}
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-850 dark:text-orange-400">
                  <p className="font-sans leading-relaxed">
                    <strong>{language === 'ar' ? 'تذكير أمني هام :' : 'Rappel National Recommandé'}</strong> : 
                    {language === 'ar'
                      ? ' بريد الجزائر لا يطلب أبداً معلوماتك السرية أو رمز PIN الخاص ببطاقتك في اتصال غير آمن. تأكد من زيارة الحساب الحقيقي والآمن https://baridinet.poste.dz.'
                      : ' Utilisez uniquement le site officiel d’Algérie Poste pour vos consultations CCP. Ne saisissez jamais vos identifiants confidentiels Dahabia hors de la passerelle.'}
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* MODAL 1: BARIDIMOB SMARTPHONE SIMULATOR */}
        {showPhoneSimulator && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all" id="baridimob-sim-modal">
            <div className="bg-slate-900 border border-slate-700/50 rounded-[40px] p-4 max-w-sm w-full shadow-2xl relative flex flex-col items-center">
              
              {/* Phone Speaker Notch */}
              <div className="w-32 h-5 bg-black rounded-full absolute -top-1 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <div className="w-12 h-1 bg-gray-800 rounded-full" />
                <div className="w-2 h-2 bg-blue-950 rounded-full ml-2 border border-gray-900" />
              </div>

              {/* Header inside phone screen */}
              <div className="w-full bg-slate-950 rounded-[30px] overflow-hidden border-4 border-slate-800/80 text-white flex flex-col relative aspect-[9/19]">
                
                {/* Phone status bar */}
                <div className="bg-amber-600 px-5 pt-2 pb-1 flex justify-between items-center text-[9px] font-mono font-bold">
                  <span>14:32</span>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <span>Mobilis LTE</span>
                    <span className="w-2.5 h-1.5 bg-white rounded-xs inline-block" />
                  </div>
                </div>

                {/* Simulated BaridiMob App Header */}
                <div className="bg-amber-500 py-3.5 px-4 text-center border-b border-amber-600/30 flex justify-between items-center shadow-md">
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                  <span className="font-sans font-black text-xs tracking-wider text-slate-950">BARIDIMOB</span>
                  <button 
                    onClick={() => setShowPhoneSimulator(false)}
                    className="p-1 hover:bg-black/15 text-slate-900 rounded-full transition cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* App Screen Content depends on step */}
                <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
                  {simStep === 1 && (
                    <div className="flex-1 flex flex-col justify-between text-slate-100 font-sans">
                      <div className="space-y-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/15 text-center mt-2">
                          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">Solde Disponible</span>
                          <PriceTag amount={48930} className="text-lg font-mono font-black text-white!" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-[10px] uppercase font-mono text-slate-400">Section Virement</label>
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                            <span className="font-bold">Nouveau Compte RIP</span>
                            <span className="text-[10px] text-amber-500 font-mono font-bold">Sélectionné ✓</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <label className="block text-[10px] uppercase font-mono text-slate-400">RIP Bénéficiaire</label>
                          <div className="relative">
                            <div className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-[10px] font-mono break-all font-bold text-amber-400 pr-16 min-h-[44px]">
                              {simCopiedRip ? officialRip : "RIP Incomplet ou Vide"}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSimCopiedRip(true);
                                addNotification("RIP Rihla collé dans le simulateur !");
                              }}
                              className="absolute right-2 top-2 px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-[9px] uppercase tracking-wider rounded transition-all cursor-pointer"
                            >
                              {simCopiedRip ? 'COLLÉ' : 'COLLER'}
                            </button>
                          </div>
                          {!simCopiedRip && (
                            <p className="text-[9px] text-orange-400 italic font-mono">💡 Veuillez cliquer sur "COLLER" pour charger le RIP de Rihla DZ.</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!simCopiedRip) {
                            alert("Veuillez coller le RIP officiel d'Algérie Poste d'abord.");
                            return;
                          }
                          setSimStep(2);
                        }}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer"
                      >
                        Suivant : Montant
                      </button>
                    </div>
                  )}

                  {simStep === 2 && (
                    <div className="flex-1 flex flex-col justify-between text-slate-100 font-sans">
                      <div className="space-y-4">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/85">
                          <span className="text-[9px] font-mono text-slate-400 uppercase">Bénéficiaire chargé</span>
                          <span className="block text-xs font-bold font-sans text-white mt-0.5">Sarl Rihla DZ Voyage</span>
                          <span className="text-[10px] font-mono text-amber-500">{officialRip}</span>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[10px] uppercase font-mono text-slate-400">Saisir le Montant (DZD)</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              readOnly
                              value={billingPeriod === 'monthly' ? '1200' : '9900'} 
                              className="w-full text-center bg-slate-900 border border-slate-800 p-3 text-xl font-mono font-black text-amber-500 rounded-xl focus:outline-none"
                            />
                            <span className="absolute right-3.5 top-3 text-[10px] uppercase font-mono font-bold text-slate-400">DZD</span>
                          </div>
                          <p className="text-[9px] text-gray-400 font-mono text-center">Correspond à la formule : Premium {billingPeriod === 'monthly' ? 'Mensuel' : 'Annuel'}</p>
                        </div>

                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[10px] text-emerald-400 leading-relaxed font-mono">
                          ✓ Sans frais de transaction nationaux (CIB interbancaire nationale).
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setIsProcessing(true);
                            setTimeout(() => {
                              setIsProcessing(false);
                              setSimStep(3);
                              setQrTxId(simTxnReference); // autofill the actual clipboard
                              addNotification(`Transaction BaridiMob réussie ! Référence: ${simTxnReference}`);
                            }, 1200);
                          }}
                          disabled={isProcessing}
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-black text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw size={12} className="animate-spin text-black" />
                              <span>Envoi en cours...</span>
                            </>
                          ) : (
                            <span>VALIDER & TRANSFERER</span>
                          )}
                        </button>
                        <button 
                          onClick={() => setSimStep(1)}
                          className="w-full text-center py-1 bg-transparent hover:text-amber-500 text-[10px] font-mono uppercase tracking-wider text-slate-400 cursor-pointer"
                        >
                          Retour
                        </button>
                      </div>
                    </div>
                  )}

                  {simStep === 3 && (
                    <div className="flex-1 flex flex-col justify-between text-slate-100 font-sans">
                      <div className="space-y-4 text-center">
                        <div className="mx-auto w-12 h-12 bg-emerald-500/25 text-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-2">
                          <CheckCircle2 size={24} />
                        </div>
                        <h5 className="font-serif font-black text-sm tracking-wide">VIREMENT ENVOYÉ !</h5>
                        
                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-200 text-start font-mono text-[10px] space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Date :</span>
                            <span>Aujourd'hui</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Bénéficiaire :</span>
                            <span className="font-sans font-bold">Rihla Sarl</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span className="text-slate-400">Montant :</span>
                            <span className="text-amber-400 font-black">{billingPeriod === 'monthly' ? '1 200' : '9 900'} DZD</span>
                          </div>
                          
                          <div className="pt-1.5 space-y-1">
                            <span className="text-slate-400 block">Référence de Transaction :</span>
                            <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                              <span className="text-emerald-400 font-bold text-xs">{simTxnReference}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(simTxnReference);
                                  addNotification("Référence copiée dans votre presse-papier !");
                                  alert("Référence copiée ! Vous pouvez maintenant coller ce numéro TXN dans l'onglet S'abonner pour valider.");
                                }}
                                className="px-1.5 py-0.5 bg-slate-850 hover:bg-slate-750 text-[8px] rounded text-white cursor-pointer"
                              >
                                Copier
                              </button>
                            </div>
                          </div>
                        </div>

                        <p className="text-[9px] text-gray-400 leading-snug">
                          {language === 'ar'
                            ? 'مبروك! انسخ كود المعاملة بالأعلى وضعه في كود التحقق في الخطوة ٤ لتأكيد التفعيل.'
                            : 'Copiez le code ci-dessus, fermez le simulateur et renseignez-le dans l’onglet s’abonner.'}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setShowPhoneSimulator(false);
                          // Select QR in main checkout tab so they can immediately paste it!
                          setPaymentMethod('qr');
                          setActiveTab('checkout');
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer"
                      >
                        Terminer & Valider S'abonner
                      </button>
                    </div>
                  )}
                </div>

                {/* Simulated Home Indicator bar */}
                <div className="bg-slate-950 py-3 flex justify-center items-center">
                  <div className="w-24 h-1 bg-gray-600 rounded-full" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MODAL 2: HIGH CONTRAST PDF FACTURE RECEIPT PREVIEW */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto" id="pdf-invoice-modal">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl relative p-6 sm:p-8">
              
              {/* Header Actions bar */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center space-x-2">
                  <FileText size={14} className="text-[#d4af37]" />
                  <span>{language === 'ar' ? 'معاينة الفاتورة الرسمية DZD' : 'Facture Impôt Certifiée Rihla DZ'}</span>
                </span>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    onClick={() => {
                      setIsDownloadingPdf(true);
                      setTimeout(() => {
                        setIsDownloadingPdf(false);
                        addNotification(`PDF Facture ${selectedInvoice.id} téléchargé.`);
                        window.print();
                      }, 1200);
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 text-white dark:bg-slate-800 hover:bg-[#d4af37] hover:text-black font-mono font-bold text-[10px] uppercase tracking-wider rounded-lg border border-transparent transition inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    {isDownloadingPdf ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : (
                      <Printer size={12} />
                    )}
                    <span>{isDownloadingPdf ? 'Impression...' : 'Imprimer / PDF'}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedInvoice(null)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-lg transition cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* PDF Document body */}
              <div className="border border-slate-200 dark:border-slate-800 p-6 sm:p-8 bg-white text-slate-900 rounded-xl space-y-6 relative overflow-hidden font-sans" id="print-view-document">
                
                {/* Visual stamp on document side */}
                <div className="absolute right-6 top-32 -rotate-12 border-4 border-emerald-600/60 rounded-xl p-2 text-center text-emerald-600 font-extrabold font-mono uppercase tracking-widest text-xs select-none pointer-events-none">
                  <div className="text-[9px]">ALGERIE POSTE</div>
                  <div className="text-sm">PAYÉ / SUCCÈS</div>
                  <div className="text-[8px]">ECOMMERCE GATEWAY</div>
                  <div className="text-[7px]">SÉCURISÉ EN DIRECT</div>
                </div>

                {/* Printable row header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-[#d4af37]/10 px-2 py-0.5 rounded text-[#d4af37] text-[10px] font-mono uppercase tracking-widest font-black mb-2">
                      Rihla Premium
                    </div>
                    <h4 className="text-lg font-serif font-black tracking-tight text-slate-950">Sarl Rihla DZ Voyage</h4>
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">NIF : 099839482910748 • Registre National : 16/00-94829B</span>
                    <span className="text-[9px] font-mono text-slate-500 block">Casbah d'Alger, Boulevard des Martyres, Algiers, DZ.</span>
                  </div>
                  <div className="text-end font-mono text-xs">
                    <span className="text-gray-400 block text-[9px] uppercase">Référence Facture</span>
                    <span className="font-extrabold text-sm block tracking-widest">{selectedInvoice.id}</span>
                    <span className="text-[9px] text-[#d4af37] block mt-1">SÉCURITÉ SATIM CERTIFIÉE</span>
                  </div>
                </div>

                {/* Bill to block */}
                <div className="grid grid-cols-2 gap-4 border-y border-slate-150 py-4 font-mono text-[10px]">
                  <div>
                    <span className="text-gray-400 block uppercase">Facturé à :</span>
                    <span className="font-bold text-slate-850 block mt-1">{cardHolder}</span>
                    <span className="text-slate-500 block">Voyageur Membre Rihla DZ VIP</span>
                    <span className="text-slate-500 block">Email: {currentUser?.email || 'Nidal.lattab@gold.dz'}</span>
                  </div>
                  <div className="text-end">
                    <span className="text-gray-400 block uppercase">Détails de Transaction :</span>
                    <span className="block mt-1 font-bold">Date: {selectedInvoice.date}</span>
                    <span className="block text-[9px] text-slate-500">Méthode: {selectedInvoice.method}</span>
                    <span className="block text-[8px] text-emerald-600 font-mono italic">ID: {selectedInvoice.transactionId}</span>
                  </div>
                </div>

                {/* Items pricing tables */}
                <div className="space-y-3 pt-2">
                  <span className="block text-[9px] uppercase tracking-wider font-mono font-bold text-[#d4af37]">Libellé de facturation</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-gray-500 uppercase font-mono text-[9px]">
                          <th className="py-2 text-start">Prestation</th>
                          <th className="py-2 text-center">Quantité</th>
                          <th className="py-2 text-end">Prix HT (81%)</th>
                          <th className="py-2 text-end font-extrabold">Total TTC (DZD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100 font-sans">
                          <td className="py-3 text-start">
                            <span className="font-bold text-slate-900 block">{selectedInvoice.title}</span>
                            <span className="text-[9px] text-gray-400 font-mono">Pack premium accès complet exclusif + guide vocal de voyage</span>
                          </td>
                          <td className="py-3 text-center font-mono">1</td>
                          <td className="py-3 text-end font-mono"><PriceTag amount={Math.round(selectedInvoice.amount * 0.81)} /></td>
                          <td className="py-3 text-end font-mono font-bold text-slate-900"><PriceTag amount={selectedInvoice?.amount || 0} /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cost breakdown */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 font-mono text-[10px] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Hors Taxes (H.T) :</span>
                      <PriceTag amount={Math.round(selectedInvoice.amount * 0.81)} />
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-gray-400">TVA Algérie (19%) :</span>
                      <PriceTag amount={Math.round(selectedInvoice.amount * 0.19)} />
                    </div>
                    <div className="flex justify-between text-xs font-bold pt-1">
                      <span className="text-slate-900 uppercase">Net à Payer (T.T.C) :</span>
                      <PriceTag amount={selectedInvoice?.amount || 0} className="text-emerald-600 text-sm font-black!" />
                    </div>
                  </div>
                </div>

                {/* Footer notes on PDF receipt page */}
                <div className="pt-4 border-t border-slate-100 text-center font-mono text-[8px] text-gray-400 leading-relaxed uppercase">
                  <p>Fait en Algérie • Reçu électronique certifié par SATIM d'Algérie Poste (e-payment gateway)</p>
                  <p>Rihla DZ - Voyagez l’esprit tranquille avec les meilleures technologies web.</p>
                </div>

              </div>

              {/* Close helper button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-mono font-medium rounded-xl text-slate-750 dark:text-slate-350 transition cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق البوابة' : 'Fermer'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
