import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Sparkles, 
  Camera, 
  MapPin, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Image as ImageIcon,
  Compass,
  Check,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PhotoItem {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions: string[];
  url: string;
}

interface PlaceResult {
  name: string;
  address: string;
  place_id: string;
  photos?: PhotoItem[];
  message?: string;
  computedName?: string;
  computedLink?: string;
}

export const RealPhotoExplorer: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlaceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // API Key management
  const [customKey, setCustomKey] = useState(() => {
    return localStorage.getItem('GOOGLE_MAPS_KEY_STORED') || '';
  });
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [serverKeyLoaded, setServerKeyLoaded] = useState(false);
  const [testKeyStatus, setTestKeyStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  // Verify server-side key status on load
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.mapsApiKey) {
          setServerKeyLoaded(true);
        }
      })
      .catch((err) => console.warn('Could not check server API key status:', err));
  }, []);

  // Quick preset destinations as requested
  const presetPlaces = [
    { name: "Cathédrale d'Oran", label: { en: "Oran Cathedral", fr: "Cathédrale de d'Oran", ar: "كاتدرائية وهران" } },
    { name: "Grande Mosquée d'Alger", label: { en: "Great Mosque of Algiers", fr: "Grande Mosquée d'Alger", ar: "جامع الجزائر الأعظم" } },
    { name: "Basilique Notre-Dame d'Afrique", label: { en: "Notre-Dame d'Afrique", fr: "Notre-Dame d'Afrique", ar: "كنيسة السيدة الإفريقية" } },
    { name: "Jardin d'Essai d'Hamma", label: { en: "Hamma Test Garden", fr: "Jardin d'Essai d'Hamma", ar: "حديقة التجارب الحامة" } },
    { name: "Mémorial du Martyr Alger", label: { en: "Martyrs' Memorial", fr: "Mémorial du Martyr", ar: "مقام الشهيد" } },
    { name: "Ruines Romaines de Tipaza", label: { en: "Tipaza Roman Ruins", fr: "Ruines de Tipaza", ar: "الآثار الرومانية بتيبازة" } }
  ];

  // Primary fetch handler implementation
  const handleSearch = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    setActivePhotoIdx(0);

    try {
      let url = `/api/places/photos?query=${encodeURIComponent(queryToSearch)}`;
      if (customKey) {
        url += `&custom_key=${encodeURIComponent(customKey)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'API_KEY_MISSING') {
          setError(
            language === 'ar' 
              ? 'مفتاح Google Maps API مفقود. يرجى تهيئته في الإعدادات أو كتابة مفتاحك الخاص.'
              : language === 'fr'
              ? 'Clé API Google Maps manquante. Veuillez la configurer dans vos Secrets ou saisir une clé personnalisée.'
              : 'Google Maps API key is missing. Please configure it in your Secrets or enter your custom key.'
          );
        } else {
          setError(data.message || data.error || 'Failed to retrieve place images');
        }
        setLoading(false);
        return;
      }

      let placeName = data.name || queryToSearch;
      let city = "";

      // Smartly parse/extract city from the input query or Google returned address
      const knownCities = ["Oran", "Alger", "Algiers", "Constantine", "Annaba", "Tlemcen", "Ghardaia", "Bejaia", "Tipaza", "Biskra", "Batna", "Setif", "Chlef", "Sidi Bel Abbes"];

      for (const knownCity of knownCities) {
        const regex = new RegExp(`\\b${knownCity}\\b`, 'i');
        if (regex.test(queryToSearch) || (data.address && regex.test(data.address))) {
          city = knownCity;
          break;
        }
      }

      // If no city detected, try to parse it from user's text space separated
      if (!city) {
        const words = queryToSearch.trim().split(/\s+/);
        if (words.length > 1) {
          city = words[words.length - 1]; // assume last word is city
        }
      }

      if (!city) {
        city = "Alger"; // Default country capital
      }

      // Format the exact name of the place
      // If it already ends with the city, don't duplicate it. Let's make sure it's clean
      let cleanPlace = placeName;
      // If the placeName already includes the city, e.g. "Cathédrale d'Oran", we don't need to append 'Oran' again
      const containsCity = new RegExp(`\\b${city}\\b`, 'i').test(cleanPlace);
      
      let computedName = "";
      if (containsCity) {
        computedName = `${cleanPlace} Algeria`;
      } else {
        computedName = `${cleanPlace} ${city} Algeria`;
      }

      // Format clean double spaces
      computedName = computedName.replace(/\s+/g, ' ').trim();

      const computedLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(computedName)}`;

      if (data.photos && data.photos.length > 0) {
        setResult({
          ...data,
          computedName,
          computedLink
        });
      } else {
        setResult({
          name: data.name || queryToSearch,
          address: data.address || '',
          place_id: data.place_id || '',
          photos: [],
          message: data.message || 'No real images available for this place',
          computedName,
          computedLink
        });
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(
        language === 'ar'
          ? 'حدث خطأ أثناء الاتصال بالخادم.'
          : 'Une erreur est survenue lors de la communication avec le serveur.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomKey = () => {
    localStorage.setItem('GOOGLE_MAPS_KEY_STORED', customKey);
    setTestKeyStatus('success');
    setTimeout(() => {
      setTestKeyStatus('idle');
      setShowKeyConfig(false);
    }, 1500);
  };

  const handleClearCustomKey = () => {
    localStorage.removeItem('GOOGLE_MAPS_KEY_STORED');
    setCustomKey('');
    setTestKeyStatus('idle');
  };

  // Perform default load on first view to showcase the app capabilities
  useEffect(() => {
    handleSearch("Cathédrale d'Oran");
  }, []);

  const hasPhotos = result && result.photos && result.photos.length > 0;
  const currentPhoto = hasPhotos ? result!.photos![activePhotoIdx] : null;

  return (
    <div className="min-h-[85vh] bg-[#fafafc] dark:bg-[#0d1013] text-[#1a1a1a] dark:text-[#f5f2ed] p-4 sm:p-8 transition-colors duration-300" id="real-photo-explorer-view">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-450 text-[10px] uppercase font-mono font-black tracking-widest px-3 py-1 rounded-full">
              <Camera size={12} className="animate-pulse" />
              {language === 'ar' ? 'التحقق البصري المباشر' : 'Vérification Visuelle Live'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-gray-950 dark:text-white">
              {language === 'ar' ? 'معرض الصور الحقيقية من Google' : 'Explorateur de Photos Réelles'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-sans max-w-xl">
              {language === 'ar' 
                ? 'استكشف لقطات حقيقية ملتقطة مباشرة من خرائط Google لتجنب الصور المزيفة أو التقريبية.'
                : 'Affichez uniquement des photos réelles de Google Maps de l’endroit exact pour planifier votre voyage en toute transparence.'}
            </p>
          </div>

          {/* Config Key Trigger Button */}
          <button
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition cursor-pointer ${
              serverKeyLoaded || customKey 
                ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                : 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
            }`}
          >
            <Key size={14} />
            <span>
              {serverKeyLoaded || customKey 
                ? (language === 'ar' ? 'تم تفعيل مفتاح API' : 'Clé API Google Activée ✓') 
                : (language === 'ar' ? 'إعداد مفتاح الخرائط' : 'Configurer Clé Google Maps ⚠')}
            </span>
          </button>
        </div>

        {/* API KEY MANAGE MODAL OR DRAWER IF OPEN */}
        <AnimatePresence>
          {showKeyConfig && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    {language === 'ar' ? 'مفتاح Google Maps Platform API' : 'Configuration Google Maps Platform'}
                  </h4>
                  <p className="text-xs text-amber-700/80 dark:text-amber-500/80 leading-relaxed font-sans">
                    {language === 'ar'
                      ? 'النظام يستخدم المفتاح المدمج بالخادم افتراضياً. إذا كنت تريد استخدام مفتاحك الخاص للبحث بلا قيود، يمكنك إدخاله وحفظه محلياً في متصفحك.'
                      : 'L\'application utilise automatiquement la clé serveur par défaut. Si vous préférez utiliser votre propre clé Google Maps API, insérez-la ci-dessous (enregistrée uniquement localement dans votre navigateur).'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs font-mono text-amber-950 dark:text-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCustomKey}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {testKeyStatus === 'success' ? <Check size={14} /> : null}
                    <span>{language === 'ar' ? 'حفظ المفتاح' : 'Enregistrer'}</span>
                  </button>
                  {customKey && (
                    <button
                      onClick={handleClearCustomKey}
                      className="px-3 py-2.5 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      {language === 'ar' ? 'حذف' : 'Effacer'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEARCH BAR PANEL */}
        <div className="bg-white dark:bg-[#111417] border border-gray-150 dark:border-gray-800 rounded-3xl shadow-xl p-5 sm:p-7 space-y-5">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400 dark:text-gray-500">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder={
                  language === 'ar' 
                    ? 'أدخل اسم المكان بدقة (مثال: Cathédrale d\'Oran أو جامع الجزائر الأعظم)...' 
                    : "Entrez le nom d'un monument ou lieu exact en Algérie..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-[#15191d] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all font-medium text-gray-800 dark:text-gray-200"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-bold text-sm rounded-2xl transition duration-150 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer shrink-0"
            >
              {loading ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <Search size={15} />
              )}
              <span>{language === 'ar' ? 'بحث وتحقق' : 'Rechercher les photos'}</span>
            </button>
          </form>

          {/* Preset Buttons Grid */}
          <div className="space-y-2">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500">
              ⚡ {language === 'ar' ? 'وجهات سريعة نموذجية' : 'Exemples de lieux réels à explorer'}
            </span>
            <div className="flex flex-wrap gap-2">
              {presetPlaces.map((place) => (
                <button
                  key={place.name}
                  onClick={() => {
                    setSearchQuery(place.name);
                    handleSearch(place.name);
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                    result?.name === place.name || searchQuery === place.name
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-450 font-semibold'
                      : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-450 hover:bg-emerald-500/5 hover:border-emerald-500/20 hover:text-emerald-600'
                  }`}
                >
                  {place.label[language] || place.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest animate-pulse">
              {language === 'ar' ? 'جاري الاتصال بـ Google Maps...' : 'Interrogation de l’API Google...'}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-700 dark:text-red-400 p-5 rounded-2xl flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold">{language === 'ar' ? 'فشل جلب البيانات' : 'Erreur de chargement'}</h4>
              <p className="text-xs font-sans leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* SEARCH RESULT CONTENT PANEL */}
        {!loading && result && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header info about the current place */}
            <div className="bg-white dark:bg-[#111417] border border-gray-150 dark:border-gray-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-0.5 rounded-md">
                  Google Verified Place
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  {result.name}
                </h2>
                {result.address && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 font-sans">
                    <MapPin size={13} className="text-emerald-500 shrink-0" />
                    <span>{result.address}</span>
                  </p>
                )}
              </div>

              {hasPhotos && (
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ImageIcon size={14} />
                  <span>{result.photos?.length} {language === 'ar' ? 'صور حقيقية معتمدة' : 'Photos réelles'}</span>
                </div>
              )}
            </div>

            {/* GOOGLE MAPS FORMULA / CONSTRUCTED QUERY CARD */}
            {result.computedName && result.computedLink && (
              <div className="bg-slate-50 dark:bg-[#13171c] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-500" />
                  <span className="text-xs font-black uppercase font-mono tracking-wider text-slate-800 dark:text-slate-200">
                    {language === 'ar' ? 'رابط خريطة غوغل الدقيقة المصممة' : 'Générateur de Requête Google Maps'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom complet section */}
                  <div className="bg-white dark:bg-[#181d22] border border-slate-150 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between gap-2 shadow-xs">
                    <div>
                      <span className="block text-[10px] uppercase font-mono font-bold text-gray-400 dark:text-gray-500 mb-1">
                        1. Nom complet du lieu
                      </span>
                      <p className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 break-words">
                        {result.computedName}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(result.computedName || '');
                        alert(language === 'ar' ? 'تم نسخ الاسم!' : 'Nom copié !');
                      }}
                      className="self-start text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={12} />
                      <span>{language === 'ar' ? 'نسخ الاسم' : 'Copier le nom'}</span>
                    </button>
                  </div>

                  {/* Lien cliquable section */}
                  <div className="bg-white dark:bg-[#181d22] border border-slate-150 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between gap-2 shadow-xs">
                    <div>
                      <span className="block text-[10px] uppercase font-mono font-bold text-gray-400 dark:text-gray-500 mb-1">
                        2. Lien de recherche Google Maps
                      </span>
                      <a
                        href={result.computedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline break-all block"
                      >
                        {result.computedLink}
                      </a>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(result.computedLink || '');
                          alert(language === 'ar' ? 'تم نسخ الرابط!' : 'Lien copié !');
                        }}
                        className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={12} />
                        <span>{language === 'ar' ? 'نسخ الرابط' : 'Copier le lien'}</span>
                      </button>
                      <a
                        href={result.computedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>{language === 'ar' ? 'فتح في غوغل' : 'Ouvrir sur Maps ↗'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN IMAGE COMPONENT DISPLAY */}
            {hasPhotos ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Image Stage View (8 cols) */}
                <div className="lg:col-span-8 bg-black border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden relative shadow-lg flex flex-col justify-center min-h-[450px]">
                  
                  {/* Photo itself */}
                  <img
                    src={currentPhoto!.url}
                    alt={`${result.name} photo ${activePhotoIdx + 1}`}
                    className="w-full h-full max-h-[550px] object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top Quality Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white font-mono text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 z-10">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>📸 Real images from Google Maps</span>
                  </div>

                  {/* Image Navigation Arrows */}
                  {result.photos!.length > 1 && (
                    <>
                      <button
                        onClick={() => setActivePhotoIdx((prev) => (prev === 0 ? result.photos!.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/85 text-white rounded-full flex items-center justify-center transition-all border border-white/10 hover:scale-105 cursor-pointer"
                        title="Previous photo"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setActivePhotoIdx((prev) => (prev === result.photos!.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/85 text-white rounded-full flex items-center justify-center transition-all border border-white/10 hover:scale-105 cursor-pointer"
                        title="Next photo"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Info Overlay Panel */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                        Photo {activePhotoIdx + 1} of {result.photos!.length}
                      </p>
                      <p className="text-sm font-black tracking-tight">{result.name}</p>
                    </div>

                    {currentPhoto!.html_attributions && currentPhoto!.html_attributions.length > 0 && (
                      <div className="text-[9px] font-mono text-gray-300 opacity-80" 
                           dangerouslySetInnerHTML={{ __html: currentPhoto!.html_attributions.join(', ') }} />
                    )}
                  </div>
                </div>

                {/* Sidebar Thumbnails Panel (4 cols) */}
                <div className="lg:col-span-4 bg-white dark:bg-[#111417] border border-gray-150 dark:border-gray-800 rounded-3xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="block text-[10px] font-mono font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      📂 {language === 'ar' ? 'معرض صور غوغل' : 'Index de la galerie'}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'ar'
                        ? 'تصفح قائمة الصور الحقيقية المصنفة لهذا المكان بالتفصيل.'
                        : 'Sélectionnez une miniature pour charger l’image haute définition correspondante.'}
                    </p>

                    <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin">
                      {result.photos!.map((photo, index) => (
                        <button
                          key={photo.photo_reference}
                          onClick={() => setActivePhotoIdx(index)}
                          className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            activePhotoIdx === index
                              ? 'border-emerald-600 scale-[0.98]'
                              : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt={`${result.name} thumb ${index + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/10"></div>
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white font-mono text-[8px] px-1 rounded">
                            {index + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Safety & Anti-Fake disclaimer block */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <Sparkles size={14} className="shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {language === 'ar' ? 'ضمان الدقة البصرية' : 'Zéro approximation'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                      {language === 'ar'
                        ? 'هذه الصور مأخوذة مباشرة من حسابات المستخدمين الموثقين والزوار الميدانيين على خرائط Google، مما يضمن لك لقطة أصيلة وحقيقية 100٪.'
                        : 'Ces clichés sont capturés par des voyageurs réels sur place et hébergés par Google Maps, vous garantissant une vue 100% authentique sans filtre marketing ni génération artificielle.'}
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              /* NO PHOTOS FOUND CONTAINER */
              <div className="bg-amber-50 dark:bg-amber-950/15 border border-amber-200/50 dark:border-amber-900/30 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-450 rounded-full flex items-center justify-center mx-auto">
                  <ImageIcon size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-amber-950 dark:text-amber-200">
                    {language === 'ar' ? 'لا توجد صور حقيقية متوفرة' : 'No real images available for this place'}
                  </h3>
                  <p className="text-xs text-amber-800/80 dark:text-amber-500/80 leading-relaxed font-sans">
                    {language === 'ar'
                      ? 'تم العثور على المكان، ولكن لا توجد صور مرتبطة به في قاعدة بيانات خرائط Google حالياً.'
                      : 'Le lieu a été trouvé, mais aucune photo certifiée n\'est actuellement disponible sur la base Google Maps pour cette fiche.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
