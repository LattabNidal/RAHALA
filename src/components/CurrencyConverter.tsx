import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRightLeft, Coins, TrendingUp, AlertCircle, 
  RefreshCw, Check, Info, HelpCircle, Search, ChevronDown
} from 'lucide-react';

interface CurrencyConverterProps {
  onClose?: () => void;
}

interface RateData {
  rate: number;
  source: 'api' | 'fallback';
}

// Extensive list of fallback rates (1 unit of currency = X DZD)
const FALLBACK_RATES: Record<string, number> = {
  EUR: 145.2,
  USD: 134.5,
  GBP: 171.8,
  CAD: 98.2,
  CHF: 150.5,
  AUD: 89.1,
  JPY: 0.85,
  SAR: 35.8,
  AED: 36.6,
  MAD: 13.3,
  TND: 43.1,
  TRY: 4.1,
  EGP: 2.8,
  QAR: 36.9,
  KWD: 438.5,
  RUB: 1.5,
  INR: 1.6,
  BRL: 24.5,
  MXN: 7.9,
  NZD: 81.5,
  SEK: 12.8,
  NOK: 12.5,
  DKK: 19.5,
  PLN: 33.7,
  SGD: 99.8,
  HKD: 17.2,
  KRW: 0.098,
  ZAR: 7.2,
  THB: 3.7,
  IDR: 0.0083,
  MYR: 28.5,
  PHP: 2.3,
  ILS: 36.2
};

// Currency Metadata
const CURRENCY_INFO: Record<string, { name: Record<string, string>; flag: string; symbol: string }> = {
  EUR: { name: { en: "Euro", fr: "Euro", ar: "يورو", es: "Euro" }, flag: "🇪🇺", symbol: "€" },
  USD: { name: { en: "US Dollar", fr: "Dollar US", ar: "دولار أمريكي", es: "Dólar" }, flag: "🇺🇸", symbol: "$" },
  GBP: { name: { en: "British Pound", fr: "Livre Sterling", ar: "جنيه إسترليني", es: "Libra" }, flag: "🇬🇧", symbol: "£" },
  CAD: { name: { en: "Canadian Dollar", fr: "Dollar Canadien", ar: "دولار كندي", es: "Dólar can." }, flag: "🇨🇦", symbol: "C$" },
  CHF: { name: { en: "Swiss Franc", fr: "Franc Suisse", ar: "فرنك سويسري", es: "Franco suizo" }, flag: "🇨🇭", symbol: "CHF" },
  AUD: { name: { en: "Australian Dollar", fr: "Dollar Australien", ar: "دولار أسترالي", es: "Dólar aud" }, flag: "🇦🇺", symbol: "A$" },
  JPY: { name: { en: "Japanese Yen", fr: "Yen Japonais", ar: "ين ياباني", es: "Yen" }, flag: "🇯🇵", symbol: "¥" },
  CNY: { name: { en: "Chinese Yuan", fr: "Yuan Chinois", ar: "يوان صيني", es: "Yuan" }, flag: "🇨🇳", symbol: "¥" },
  SAR: { name: { en: "Saudi Riyal", fr: "Riyal Saoudien", ar: "ريال سعودي", es: "Riyal" }, flag: "🇸🇦", symbol: "SR" },
  AED: { name: { en: "UAE Dirham", fr: "Dirham des EAU", ar: "درهم إماراتي", es: "Dirham" }, flag: "🇦🇪", symbol: "AED" },
  MAD: { name: { en: "Moroccan Dirham", fr: "Dirham Marocain", ar: "درهم مغربي", es: "Dirham" }, flag: "🇲🇦", symbol: "DH" },
  TND: { name: { en: "Tunisian Dinar", fr: "Dinar Tunisien", ar: "دينار تونسي", es: "Dinar" }, flag: "🇹🇳", symbol: "DT" },
  TRY: { name: { en: "Turkish Lira", fr: "Lire Turque", ar: "ليرة تركية", es: "Lira" }, flag: "🇹🇷", symbol: "₺" },
  EGP: { name: { en: "Egyptian Pound", fr: "Livre Égyptienne", ar: "جنيه مصري", es: "Libra eg." }, flag: "🇪🇬", symbol: "EGP" },
  QAR: { name: { en: "Qatari Riyal", fr: "Riyal Qatari", ar: "ريال قطري", es: "Riyal qat" }, flag: "🇶🇦", symbol: "QR" },
  KWD: { name: { en: "Kuwaiti Dinar", fr: "Dinar Koweïtien", ar: "دينار كويتي", es: "Dinar kow" }, flag: "🇰🇼", symbol: "KD" },
  RUB: { name: { en: "Russian Ruble", fr: "Rouble Russe", ar: "روبل روسي", es: "Rublo" }, flag: "🇷🇺", symbol: "₽" },
  INR: { name: { en: "Indian Rupee", fr: "Roupie Indienne", ar: "روبية هندية", es: "Rupia" }, flag: "🇮🇳", symbol: "₹" },
  BRL: { name: { en: "Brazilian Real", fr: "Réal Brésilien", ar: "ريال برازيلي", es: "Real" }, flag: "🇧🇷", symbol: "R$" },
  MXN: { name: { en: "Mexican Peso", fr: "Peso Mexicain", ar: "بيزو مكسيكي", es: "Peso" }, flag: "🇲🇽", symbol: "$" },
  NZD: { name: { en: "New Zealand Dollar", fr: "Dollar Néo-Zélandais", ar: "دولار نيوزيلندي", es: "Dólar nz" }, flag: "🇳🇿", symbol: "NZ$" },
  SEK: { name: { en: "Swedish Krona", fr: "Couronne Suédoise", ar: "كرونة سويدية", es: "Corona" }, flag: "🇸🇪", symbol: "kr" },
  NOK: { name: { en: "Norwegian Krone", fr: "Couronne Norvégienne", ar: "كرونة نرويجية", es: "Corona" }, flag: "🇳🇴", symbol: "kr" },
  DKK: { name: { en: "Danish Krone", fr: "Couronne Danoise", ar: "كرونة دنماركية", es: "Corona" }, flag: "🇩🇰", symbol: "kr" },
  PLN: { name: { en: "Polish Zloty", fr: "Zloty Polonais", ar: "زلوتي بولندي", es: "Zloty" }, flag: "🇵🇱", symbol: "zł" },
  SGD: { name: { en: "Singapore Dollar", fr: "Dollar de Singapour", ar: "دولار سنغافوري", es: "S$" }, flag: "🇸🇬", symbol: "S$" },
  HKD: { name: { en: "Hong Kong Dollar", fr: "Dollar de Hong Kong", ar: "دولار هونغ كونغ", es: "HK$" }, flag: "🇭🇰", symbol: "HK$" },
  KRW: { name: { en: "South Korean Won", fr: "Won Sud-Coréen", ar: "وون كوري جنوبي", es: "Won" }, flag: "🇰🇷", symbol: "₩" },
  ZAR: { name: { en: "South African Rand", fr: "Rand Sud-Africain", ar: "راند جنوب أفريقيا", es: "Rand" }, flag: "🇿🇦", symbol: "R" },
  THB: { name: { en: "Thai Baht", fr: "Baht Thaïlandais", ar: "بات تايلاندي", es: "Baht" }, flag: "🇹🇭", symbol: "฿" },
  IDR: { name: { en: "Indonesian Rupiah", fr: "Roupie Indonésienne", ar: "روبية إندونيسية", es: "Rupiah" }, flag: "🇮🇩", symbol: "Rp" },
  MYR: { name: { en: "Malaysian Ringgit", fr: "Ringgit Malais", ar: "رينغيت ماليزي", es: "RM" }, flag: "🇲🇾", symbol: "RM" },
  PHP: { name: { en: "Philippine Peso", fr: "Peso Philippin", ar: "بيزو فلبيني", es: "Peso" }, flag: "🇵🇭", symbol: "₱" },
  ILS: { name: { en: "Israeli Shekel", fr: "Shekel Israélien", ar: "شيكل إسرائيلي", es: "Shekel" }, flag: "🇮🇱", symbol: "₪" }
};

const POPULAR_CURRENCIES = ['EUR', 'USD', 'GBP', 'CAD', 'SAR', 'AED'];

const translations = {
  en: {
    title: "Currency Converter",
    touristHighlight: "Useful for Tourists",
    touristHighlightDesc: "Convert instantly in both directions between foreign currencies and Algerian Dinar (DZD) to verify prices, negotiate, and prevent scams.",
    amountLabel: "Amount to Convert",
    sourceLabel: "From Currency",
    targetLabel: "To Currency",
    convertBtn: "Convert Now",
    loading: "Fetching exchange rates...",
    lastUpdated: "Rates Updated",
    rateInfo: "Official Bank Rate",
    disclaimer: "Rates are official bank rates. Real cash rates (e.g., parallel market like Square Port Said) might be up to 50%+ higher in Algeria.",
    quickButtons: "Quick Amounts",
    dinarLabel: "Algerian Dinar",
    errorFetch: "Using offline backup rates.",
    errorTitle: "Connection Notice",
    retryBtn: "Refresh Rates",
    successRates: "Rates updated successfully",
    searchPlaceholder: "Search currency (code or name)...",
    swapTooltip: "Click to invert direction",
    backBtn: "Back",
    directionLabel: "Conversion Direction"
  },
  fr: {
    title: "Convertisseur de Devises",
    touristHighlight: "Utile pour les Touristes",
    touristHighlightDesc: "Convertissez instantanément dans les deux sens entre les devises étrangères et le Dinar Algérien (DZD) pour vérifier les prix et éviter les arnaques.",
    amountLabel: "Montant à convertir",
    sourceLabel: "Devise d'origine",
    targetLabel: "Devise cible",
    convertBtn: "Convertir",
    loading: "Récupération des taux...",
    lastUpdated: "Taux mis à jour",
    rateInfo: "Taux bancaire officiel",
    disclaimer: "Taux bancaires officiels. Les taux réels en espèces (marché parallèle, ex: Square Port Saïd) peuvent être jusqu'à 50%+ plus élevés en Algérie.",
    quickButtons: "Montants rapides",
    dinarLabel: "Dinar Algérien",
    errorFetch: "Utilisation des taux de secours.",
    errorTitle: "Avis de Connexion",
    retryBtn: "Actualiser les taux",
    successRates: "Taux mis à jour avec succès",
    searchPlaceholder: "Rechercher une devise...",
    swapTooltip: "Cliquez pour inverser le sens",
    backBtn: "Retour",
    directionLabel: "Sens de conversion"
  },
  ar: {
    title: "محول العملات",
    touristHighlight: "مفيد جداً للسياح",
    touristHighlightDesc: "حول العملات في كلا الاتجاهين فوراً بين العملات الأجنبية والدينار الجزائري (DZD) لتتحقق من الأسعار الحقيقية وتتجنب التعرض للغش.",
    amountLabel: "المبلغ المراد تحويله",
    sourceLabel: "العملة الأصلية",
    targetLabel: "العملة المستهدفة",
    convertBtn: "تحويل الآن",
    loading: "جاري جلب أسعار الصرف...",
    lastUpdated: "آخر تحديث للأسعار",
    rateInfo: "سعر الصرف الرسمي للمصارف",
    disclaimer: "هذه هي أسعار الصرف الرسمية. أسعار الصرف النقدية الفعلية (مثل السوق الموازية في سكوار بورسعيد) قد تكون أعلى بنسبة تفوق 50%.",
    quickButtons: "مبالغ سريعة",
    dinarLabel: "الدينار الجزائري",
    errorFetch: "تم استخدام الأسعار الاحتياطية خارج الاتصال.",
    errorTitle: "تنبيه الاتصال",
    retryBtn: "تحديث الأسعار",
    successRates: "تم تحديث الأسعار بنجاح",
    searchPlaceholder: "ابحث بالرمز أو الاسم...",
    swapTooltip: "انقر لعكس الاتجاه",
    backBtn: "رجوع",
    directionLabel: "اتجاه التحويل"
  },
  es: {
    title: "Conversor de Divisas",
    touristHighlight: "Útil para Turistas",
    touristHighlightDesc: "Convierta al instante en ambas direcciones entre divisas extranjeras y Dinar Argelino (DZD) para verificar precios locales y evitar abusos.",
    amountLabel: "Cantidad a convertir",
    sourceLabel: "Moneda de origen",
    targetLabel: "Moneda de destino",
    convertBtn: "Convertir",
    loading: "Cargando tipos de cambio...",
    lastUpdated: "Última actualización",
    rateInfo: "Tipo de cambio oficial",
    disclaimer: "Tasas bancarias oficiales. Los tipos reales en efectivo (por ejemplo, en el mercado paralelo) pueden llegar a ser un 50% o más superiores.",
    quickButtons: "Cantidades rápidas",
    dinarLabel: "Dinar Argelino",
    errorFetch: "Usando tasas de respaldo fuera de línea.",
    errorTitle: "Aviso de Conexión",
    retryBtn: "Actualizar tasas",
    successRates: "Tasas actualizadas correctamente",
    searchPlaceholder: "Buscar moneda...",
    swapTooltip: "Haga clic para invertir dirección",
    backBtn: "Volver",
    directionLabel: "Dirección de conversión"
  }
};

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ onClose }) => {
  const { language, isRtl } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [amount, setAmount] = useState<string>('100');
  const [sourceCurrency, setSourceCurrency] = useState<string>('EUR');
  
  // Directions: true = Foreign -> DZD, false = DZD -> Foreign
  const [isToDzd, setIsToDzd] = useState<boolean>(true);
  
  const [rates, setRates] = useState<Record<string, RateData>>(() => {
    const initial: Record<string, RateData> = {};
    Object.keys(FALLBACK_RATES).forEach((k) => {
      initial[k] = { rate: FALLBACK_RATES[k], source: 'fallback' };
    });
    return initial;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Backup');

  // Searchable custom currency dropdown states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch rates relative to DZD in one go using open.er-api
  const fetchRates = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(false);
    
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/DZD');
      if (!res.ok) throw new Error('API response not ok');
      const data = await res.json();
      
      if (data && data.rates) {
        const updatedRates: Record<string, RateData> = {};
        
        // Loop over known keys and calculate (1 unit of currency = X DZD)
        // DZD is the base in the fetch, so data.rates[CUR] = amount of CUR per 1 DZD.
        // Therefore, 1 unit of CUR = 1 / data.rates[CUR] DZD.
        Object.keys(CURRENCY_INFO).forEach((code) => {
          const rateToDzd = data.rates[code];
          if (rateToDzd && rateToDzd > 0) {
            updatedRates[code] = {
              rate: Number((1 / rateToDzd).toFixed(3)),
              source: 'api'
            };
          } else {
            // Keep fallback
            updatedRates[code] = {
              rate: FALLBACK_RATES[code] || 1,
              source: 'fallback'
            };
          }
        });

        setRates(updatedRates);
        setLastUpdatedTime(new Date().toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }));
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (err) {
      console.warn("Failed to fetch rates, using fallback values.", err);
      setErrorMsg(t.errorFetch);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  };

  const handleSwapDirection = () => {
    setIsToDzd(!isToDzd);
    // Swap amounts logically to keep values looking professional and clean
    if (isToDzd) {
      // Swapping to DZD -> Foreign
      // E.g. if amount is 100 EUR, make amount 15000 DZD
      const selectedRate = rates[sourceCurrency]?.rate || FALLBACK_RATES[sourceCurrency] || 1;
      const currentVal = parseFloat(amount) || 0;
      const approxDzdVal = Math.round((currentVal * selectedRate) / 1000) * 1000 || 10000;
      setAmount(approxDzdVal.toString());
    } else {
      // Swapping to Foreign -> DZD
      // E.g. if amount is 15000 DZD, convert back to rounded foreign amount
      const selectedRate = rates[sourceCurrency]?.rate || FALLBACK_RATES[sourceCurrency] || 1;
      const currentVal = parseFloat(amount) || 0;
      const approxForeignVal = Math.round((currentVal / selectedRate) / 50) * 50 || 100;
      setAmount(approxForeignVal.toString());
    }
  };

  // Calculation helpers
  const selectedRate = rates[sourceCurrency]?.rate || FALLBACK_RATES[sourceCurrency] || 1;
  const numericAmount = parseFloat(amount) || 0;
  
  // Calculate results based on direction
  const resultValue = isToDzd ? (numericAmount * selectedRate) : (numericAmount / selectedRate);
  const resultString = resultValue.toFixed(2);

  // Meta details
  const sourceInfo = CURRENCY_INFO[sourceCurrency] || { name: { en: sourceCurrency }, flag: "🏳️", symbol: sourceCurrency };
  const dzdInfo = { name: { en: "Algerian Dinar", fr: "Dinar Algérien", ar: "دينار جزائري", es: "Dinar Argelino" }, flag: "🇩🇿", symbol: "DZD" };

  // Filter currencies for search
  const filteredCurrencies = Object.keys(CURRENCY_INFO).filter((code) => {
    const info = CURRENCY_INFO[code];
    const nameInLang = (info.name[language] || info.name['en']).toLowerCase();
    const q = searchQuery.toLowerCase();
    return code.toLowerCase().includes(q) || nameInLang.includes(q);
  });

  // Dynamic quick amounts based on current direction
  const quickAmountsList = isToDzd 
    ? [50, 100, 200, 500, 1000]
    : [5000, 10000, 20000, 50000, 100000];

  const currencySymbol = isToDzd ? sourceInfo.symbol : "DZD";
  const resultCurrencySymbol = isToDzd ? "DZD" : sourceInfo.symbol;

  return (
    <div className={`p-5 w-full ${isRtl ? 'text-right font-sans' : 'text-left font-sans'}`}>
      
      {/* Title block */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Coins size={18} className="animate-pulse" />
          </div>
          <h4 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider">
            {t.title}
          </h4>
        </div>
        
        <button 
          onClick={fetchRates}
          disabled={loading}
          className="p-1 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer disabled:opacity-50"
          title={t.retryBtn}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tourist helper alert box */}
      <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4">
        <div className="flex items-center space-x-1.5 space-x-reverse text-emerald-700 dark:text-emerald-400 font-bold text-xs">
          <HelpCircle size={14} className="shrink-0" />
          <span>{t.touristHighlight}</span>
        </div>
        <p className="text-[10px] text-gray-550 dark:text-gray-400 mt-1 leading-relaxed">
          {t.touristHighlightDesc}
        </p>
      </div>

      {/* Conversion Direction Segment Controller */}
      <div className="mb-4">
        <span className="block text-[9px] font-bold text-gray-400 uppercase mb-1.5 tracking-wide">
          {t.directionLabel}
        </span>
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200/50 dark:border-gray-800/80">
          <button
            onClick={() => setIsToDzd(true)}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
              isToDzd 
                ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {sourceInfo.flag} {sourceCurrency} ➔ 🇩🇿 DZD
          </button>
          <button
            onClick={() => setIsToDzd(false)}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
              !isToDzd 
                ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🇩🇿 DZD ➔ {sourceInfo.flag} {sourceCurrency}
          </button>
        </div>
      </div>

      {/* Conversion fields card */}
      <div className="space-y-3.5">
        
        {/* Row with Amount Input and Searchable Currency Selector */}
        <div className="grid grid-cols-12 gap-2">
          
          {/* Amount input - 7 columns */}
          <div className="col-span-7">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wide">
              {t.amountLabel} ({currencySymbol})
            </label>
            <input 
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Searchable Currency select button - 5 columns */}
          <div className="col-span-5 relative" ref={dropdownRef}>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wide text-center">
              {isToDzd ? t.sourceLabel : t.targetLabel}
            </label>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-2.5 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-emerald-500 transition-all cursor-pointer"
            >
              <span className="flex items-center space-x-1 space-x-reverse min-w-0">
                <span className="text-sm shrink-0 leading-none">{sourceInfo.flag}</span>
                <span className="font-mono truncate leading-none">{sourceCurrency}</span>
              </span>
              <ChevronDown size={12} className="text-gray-400 shrink-0 ml-1" />
            </button>

            {/* Currency Search select dropdown container */}
            {dropdownOpen && (
              <div className={`absolute ${isRtl ? 'right-0' : 'left-0'} mt-1.5 w-60 bg-white dark:bg-[#161a22] border border-gray-200 dark:border-gray-850 rounded-xl shadow-2xl z-50 overflow-hidden`}>
                
                {/* Search input field */}
                <div className="p-2 border-b border-gray-100 dark:border-gray-800 flex items-center space-x-1.5 space-x-reverse bg-gray-50 dark:bg-gray-900/50">
                  <Search size={12} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-transparent text-[11px] text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Popular Currencies Quick Select */}
                {searchQuery === '' && (
                  <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="block text-[8px] font-black uppercase text-gray-400 mb-1 tracking-wider">
                      Popular
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {POPULAR_CURRENCIES.map((code) => {
                        const info = CURRENCY_INFO[code];
                        return (
                          <button
                            key={code}
                            onClick={() => {
                              setSourceCurrency(code);
                              setDropdownOpen(false);
                            }}
                            className={`py-1 px-1.5 rounded-md border text-[10px] font-bold text-center transition cursor-pointer ${
                              sourceCurrency === code 
                                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-gray-50 dark:bg-gray-900/55 border-gray-100 dark:border-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {info?.flag} {code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* All Filtered Currencies Scrollable List */}
                <div className="max-h-48 overflow-y-auto py-1 divide-y divide-gray-50 dark:divide-gray-800/50 scrollbar-thin">
                  {filteredCurrencies.length === 0 ? (
                    <div className="p-3 text-[10px] text-gray-400 text-center">
                      No results found
                    </div>
                  ) : (
                    filteredCurrencies.map((code) => {
                      const info = CURRENCY_INFO[code];
                      const name = info.name[language] || info.name['en'];
                      return (
                        <button
                          key={code}
                          onClick={() => {
                            setSourceCurrency(code);
                            setDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left text-[11px] transition-all cursor-pointer ${
                            sourceCurrency === code
                              ? 'bg-emerald-50/75 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/80'
                          }`}
                        >
                          <span className="flex items-center space-x-2 space-x-reverse min-w-0">
                            <span className="text-sm shrink-0 leading-none">{info.flag}</span>
                            <span className="font-mono font-bold shrink-0">{code}</span>
                            <span className="truncate text-gray-400 dark:text-gray-500 font-normal leading-none">- {name}</span>
                          </span>
                          {sourceCurrency === code && <Check size={11} className="text-emerald-500 shrink-0 ml-1" />}
                        </button>
                      );
                    })
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Direction Switch Vector Button & Graphic */}
        <div className="flex items-center justify-center -my-1">
          <button
            onClick={handleSwapDirection}
            className="p-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-emerald-600 hover:text-white hover:bg-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-500/20 shadow-xs hover:rotate-180 transition-all duration-300 cursor-pointer"
            title={t.swapTooltip}
          >
            <ArrowRightLeft size={13} />
          </button>
        </div>

        {/* Quick amounts buttons block */}
        <div>
          <span className="block text-[9px] font-bold text-gray-400 uppercase mb-1.5 tracking-wide">
            {t.quickButtons}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickAmountsList.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className={`px-2.5 py-1 text-[10px] font-mono rounded-lg border transition-all cursor-pointer ${
                  amount === amt.toString()
                    ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-emerald-600/50 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {amt.toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}{currencySymbol}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display results box */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-3.5 relative overflow-hidden">
          {/* Subtle decoration vector */}
          <div className="absolute right-3 bottom-1.5 opacity-[0.06] dark:opacity-[0.1] text-gray-400 pointer-events-none">
            <Coins size={64} />
          </div>

          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              {t.targetLabel}
            </span>
            <div className="flex items-center space-x-1.5 space-x-reverse">
              <span className="text-sm shrink-0 leading-none">{isToDzd ? "🇩🇿" : sourceInfo.flag}</span>
              <span className="text-[10px] font-bold text-gray-500 font-mono leading-none">{isToDzd ? "DZD" : sourceCurrency}</span>
            </div>
          </div>

          <div className="flex items-baseline space-x-1.5 space-x-reverse">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-450 tracking-tight">
              {Number(resultString).toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            <span className="text-xs font-bold text-gray-500">
              {isToDzd ? t.dinarLabel : (sourceInfo.name[language] || sourceInfo.name['en'])}
            </span>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-gray-200/55 dark:border-gray-800/80 flex items-center justify-between text-[10px]">
            <div className="text-gray-400 flex items-center space-x-1 space-x-reverse">
              <TrendingUp size={11} className="text-emerald-500" />
              <span>{t.rateInfo}</span>
            </div>
            <span className="font-mono font-extrabold text-gray-700 dark:text-gray-300">
              1 {sourceCurrency} = {selectedRate.toFixed(2)} DZD
            </span>
          </div>
        </div>

      </div>

      {/* Feedbacks (success/error info) */}
      <div className="mt-3">
        {successMsg && (
          <div className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 space-x-reverse font-bold animate-fade-in">
            <Check size={10} />
            <span>{t.successRates} ({lastUpdatedTime})</span>
          </div>
        )}
        {errorMsg && (
          <div className="text-[9px] text-amber-600 dark:text-amber-450 flex items-center space-x-1 space-x-reverse font-semibold animate-fade-in">
            <AlertCircle size={10} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Disclaimers */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-start space-x-1.5 space-x-reverse text-[9px] text-gray-400 dark:text-gray-500 leading-relaxed text-right">
        <Info size={11} className="shrink-0 mt-0.5 text-gray-300 dark:text-gray-700" />
        <span>{t.disclaimer}</span>
      </div>

    </div>
  );
};
