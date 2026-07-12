import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Wallet, Compass, Grid, Calendar, Users, 
  ArrowRight, ArrowLeft, RefreshCw, Bookmark, Share2, 
  MapPin, Coffee, Info, ChevronDown, ChevronUp, CheckCircle2 
} from 'lucide-react';

interface ItineraryDay {
  dayNumber: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  cuisineRecommendation?: string;
  budgetTip?: string;
  estimatedCostDzd?: number;
  locationName: string;
}

interface TravelPlan {
  title: string;
  overview: string;
  totalEstimatedCostDzd: number;
  days: ItineraryDay[];
}

export const SmartTravelGuide: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { addNotification } = useApp();

  // Mode Selection: 'classic' or 'premium' (default to premium as per request)
  const [guideType, setGuideType] = useState<'classic' | 'premium'>('premium');

  // Wizard State
  const [step, setStep] = useState<number>(1);
  const [budget, setBudget] = useState<string>('moderate'); // economy, moderate, luxury
  const [style, setStyle] = useState<string>('Culture'); // Relax, Adventure, Culture, Luxury
  const [preference, setPreference] = useState<string>('City'); // Beach, Desert, City, Nature
  const [duration, setDuration] = useState<number>(3); // numeric: 3, 5, 8
  const [companion, setCompanion] = useState<string>('Solo'); // Solo, Couple, Family, Friends

  // Async API State (Classic Plan)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  // Async API State (Premium Smart Guides with Google Places Photos)
  const [smartLoading, setSmartLoading] = useState<boolean>(false);
  const [smartError, setSmartError] = useState<string | null>(null);
  const [smartGuide, setSmartGuide] = useState<any | null>(null);
  const [smartSaved, setSmartSaved] = useState<boolean>(false);

  // Load saved trip from localStorage if any on initialization
  useEffect(() => {
    const cached = localStorage.getItem('rahala_saved_ai_trip');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.title) {
          setPlan(parsed);
          setSaved(true);
        }
      } catch (e) {
        console.warn('Failed to parse cached trip');
      }
    }

    const cachedSmart = localStorage.getItem('rahala_saved_smart_guide');
    if (cachedSmart) {
      try {
        const parsed = JSON.parse(cachedSmart);
        if (parsed && parsed.destination) {
          setSmartGuide(parsed);
          setSmartSaved(true);
        }
      } catch (e) {
        console.warn('Failed to parse cached smart guide');
      }
    }
  }, []);

  const resetWizard = () => {
    if (guideType === 'premium') {
      resetSmartWizard();
    } else {
      setPlan(null);
      setStep(1);
      setSaved(false);
      setError(null);
    }
  };

  const resetSmartWizard = () => {
    setSmartGuide(null);
    setStep(1);
    setSmartSaved(false);
    setSmartError(null);
  };

  const getMappedInterest = (styleOpt: string, prefOpt: string) => {
    if (styleOpt === 'Adventure' || prefOpt === 'Desert') return 'desert';
    if (styleOpt === 'Relax' || prefOpt === 'Beach') return 'coastal';
    if (prefOpt === 'Nature') return 'coastal';
    if (styleOpt === 'Culture' || prefOpt === 'City') return 'history';
    return 'culture';
  };

  const generateSmartGuide = async () => {
    setSmartLoading(true);
    setSmartError(null);
    setSmartGuide(null);

    const interest = getMappedInterest(style, preference);

    try {
      const response = await fetch('/api/smart-places-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget,
          interest,
          duration,
          language
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error status.');
      }

      const data = await response.json();
      if (!data || !data.destination || !data.hotel) {
        throw new Error('Invalid travel plan response format.');
      }

      setSmartGuide(data);
      addNotification(language === 'ar' ? 'تم توليد دليل الأماكن الحقيقي الذكي مع صور خرائط جوجل!' : 'Smart Places Guide with real Google Photos generated!');
    } catch (err: any) {
      console.error(err);
      setSmartError(
        language === 'ar' 
          ? 'عذراً، فشل في توليد دليل الأماكن الحقيقي. يرجى تجربة إعادة المحاولة.' 
          : 'Could not fetch Google Places travel guide. Please retry.'
      );
    } finally {
      setSmartLoading(false);
    }
  };

  const generateItinerary = async () => {
    if (guideType === 'premium') {
      await generateSmartGuide();
      return;
    }

    setLoading(true);
    setError(null);
    setPlan(null);

    const interest = getMappedInterest(style, preference);

    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget,
          interest,
          duration,
          language
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error status.');
      }

      const data = await response.json();
      if (!data || !data.title || !data.days || data.days.length === 0) {
        throw new Error('Invalid travel plan response format.');
      }

      setPlan(data);
      setActiveDayIndex(0);
      addNotification(language === 'ar' ? 'تم توليد خطة رحلتك الذكية!' : 'Personalized AI travel plan generated!');
    } catch (err: any) {
      console.error(err);
      setError(
        language === 'ar' 
          ? 'عذراً، فشل في توليد الخطة الذكية. هل ترغب في إعادة المحاولة؟' 
          : 'Could not contact the offline system or initialize AI architect. Please retry.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = () => {
    if (!plan) return;
    if (saved) {
      localStorage.removeItem('rahala_saved_ai_trip');
      setSaved(false);
      addNotification(language === 'ar' ? 'تمت إزالة الخطة من المفضلة' : 'Removed plan from saved trips');
    } else {
      localStorage.setItem('rahala_saved_ai_trip', JSON.stringify(plan));
      setSaved(true);
      addNotification(language === 'ar' ? '❤️ تم حفظ الخطة في المفضلة المحلية!' : '❤️ AI Plan pinned to your local favorites!');
    }
  };

  const handleShareTrip = () => {
    if (!plan) return;
    const shareText = `Explore my Algerian dream trip: ${plan.title}. Generated with Rahala AI!`;
    navigator.clipboard.writeText(window.location.href);
    addNotification(
      language === 'ar' 
        ? '📋 تم نسخ رابط التطبيق لمشاركة رحلتك الذكية!' 
        : '📋 Copying page link! Share your personalized plan.'
    );
  };

  // Safe translations helpers
  const labels = {
    budgetTitle: { en: 'Select Travel Budget', ar: 'اختر ميزانية السفر' },
    styleTitle: { en: 'Select Travel Style', ar: 'اختر أسلوب السفر' },
    preferenceTitle: { en: 'Select Landscape Preference', ar: 'اختر البيئة المفضلة ملائمة لك' },
    durationTitle: { en: 'Select Total Duration', ar: 'اختر مدة الإقامة المقررة' },
    companionTitle: { en: 'Select Travel Companions', ar: 'اختر الرفقة أو الصحبة كالتالي' },
    buttonNext: { en: 'Next', ar: 'التالي' },
    buttonPrev: { en: 'Back', ar: 'السابق' },
    buttonGenerate: { en: 'Generate My Plan', ar: 'توليد مساري المخصص بالذكاء الاصطناعي' },
  };

  const getHeroImg = () => {
    if (preference === 'Desert') {
      return 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';
    } else if (preference === 'Beach') {
      return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
    } else if (preference === 'Nature') {
      return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=1200&q=80'; // City
  };

  return (
    <div className="mt-16 sm:mt-24 pt-12 border-t border-[#1a1a1a]/10 dark:border-white/10 mb-16" id="smart-travel-guide-advisor">
      {/* Dynamic Bilingual Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] uppercase font-mono font-black text-emerald-600 dark:text-emerald-450 tracking-widest flex items-center gap-1">
              <Sparkles size={11} className="text-[#d4af37]" /> MULTIMODAL ASSISTANT
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span>Smart Travel Guide</span>
            <span className="text-gray-300 dark:text-gray-700 font-normal">/</span>
            <span className="font-serif font-bold text-xl sm:text-2xl text-emerald-800 dark:text-emerald-400">مرشد الرحلة الذكي</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-xl text-left">
            {language === 'ar' 
              ? 'صمم خطة رحلتك المخصصة والملهمة في الجزائر فوراً باستخدام محرك الذكاء الاصطناعي جيميناي 3.5.'
              : 'Design your authentic personalized dream journey across Algeria instantly with our deep Gemini-3.5 engine.'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-mono uppercase tracking-widest font-black border border-[#d4af37]/30">
            <Sparkles size={11} className="animate-spin-slow" /> COGNITIVE VIP INSIGHTS
          </span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl max-w-md mb-8 border border-zinc-200/20">
        <button
          onClick={() => {
            setGuideType('premium');
            resetSmartWizard();
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg font-mono text-[10px] font-black tracking-wider transition uppercase flex items-center justify-center gap-2 cursor-pointer ${
            guideType === 'premium'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-950 dark:hover:text-white'
          }`}
        >
          <Sparkles size={12} className={guideType === 'premium' ? 'animate-pulse' : ''} />
          <span>{language === 'ar' ? '✨ دليل الصور الحقيقي' : '✨ Real Places Guide'}</span>
        </button>
        <button
          onClick={() => {
            setGuideType('classic');
            resetWizard();
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg font-mono text-[10px] font-black tracking-wider transition uppercase flex items-center justify-center gap-2 cursor-pointer ${
            guideType === 'classic'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-950 dark:hover:text-white'
          }`}
        >
          <Compass size={12} />
          <span>{language === 'ar' ? '📋 مسار تقليدي متكامل' : '📋 Classic Itinerary'}</span>
        </button>
      </div>

      {loading && (
        <div className="w-full bg-[#eae7e1]/35 dark:bg-[#151515]/35 border border-amber-500/20 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[300px] text-center backdrop-blur-sm">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <Sparkles size={24} className="absolute inset-0 m-auto text-[#d4af37] animate-pulse" />
          </div>
          <h4 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-2 text-center">
            {language === 'ar' ? 'مرشد الذكاء الاصطناعي يصمم مسارك المستقبلي...' : 'AI is generating your trip...'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs animate-pulse mx-auto">
            {language === 'ar' 
              ? 'يتم دمج نكهات الطبخ العاصمي ومحطات الصحراء في واحات غرداية وتغيت...' 
              : 'Combining traditional gastronomy, historic hotels, and transport coordination...'}
          </p>
          
          {/* Skeleton loader wrapper */}
          <div className="mt-8 space-y-3 w-full max-w-sm">
            <div className="h-4 bg-gray-300/40 dark:bg-gray-800/40 rounded-full w-3/4 mx-auto animate-pulse"></div>
            <div className="h-3 bg-gray-300/30 dark:bg-gray-800/30 rounded-full w-5/6 mx-auto animate-pulse"></div>
            <div className="h-3 bg-gray-300/30 dark:bg-gray-800/30 rounded-full w-2/3 mx-auto animate-pulse"></div>
          </div>
        </div>
      )}

      {smartLoading && (
        <div className="w-full bg-[#eae7e1]/35 dark:bg-[#151515]/35 border border-emerald-500/20 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[320px] text-center backdrop-blur-sm animate-fade-in">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <Sparkles size={24} className="absolute inset-0 m-auto text-[#d4af37] animate-pulse" />
          </div>
          <h4 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-2 text-center">
            {language === 'ar' ? 'جاري الاتصال بخرائط جوجل وتوليد خطتك البصرية الحقيقية...' : 'Contacting Google Places API & loading real images...'}
          </h4>
          <p className="text-xs text-slate-550 dark:text-gray-400 max-w-md animate-pulse mx-auto">
            {language === 'ar' 
              ? 'يتم جلب الصور الجغرافية المحدثة للفنادق والمعالم وتفاصيل الإقامة المناسبة لميزانيتك الفردية...' 
              : 'Fetching real images and details from Google Maps for hotels, parks, and traditional souks...'}
          </p>
          
          <div className="mt-8 space-y-3 w-full max-w-sm">
            <div className="h-4 bg-gray-300/40 dark:bg-gray-800/40 rounded-full w-3/4 mx-auto animate-pulse"></div>
            <div className="h-3 bg-gray-300/30 dark:bg-gray-800/30 rounded-full w-5/6 mx-auto animate-pulse"></div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="w-full bg-red-500/5 border border-red-500/20 rounded-3xl p-8 text-center min-h-[220px] flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-red-650 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={generateItinerary}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-mono uppercase text-xs tracking-widest font-bold hover:bg-red-700 transition active:scale-95 rounded-lg shadow-md"
          >
            {language === 'ar' ? 'إعادة المحاولة' : 'Retry Generator'}
          </button>
        </div>
      )}

      {smartError && !smartLoading && (
        <div className="w-full bg-red-500/5 border border-red-500/20 rounded-3xl p-8 text-center min-h-[220px] flex flex-col items-center justify-center animate-fade-in">
          <p className="text-sm font-semibold text-red-650 dark:text-red-400 mb-4">{smartError}</p>
          <button 
            onClick={generateSmartGuide}
            className="px-6 py-2.5 bg-[#1a1a1a] dark:bg-white text-white dark:text-black font-mono uppercase text-xs tracking-widest font-bold hover:bg-[#d4af37] transition active:scale-95 rounded-lg shadow-md"
          >
            {language === 'ar' ? 'إعادة المحاولة' : 'Retry Google Places Fetch'}
          </button>
        </div>
      )}

      {smartGuide && !smartLoading && !smartError && (
        <div className="w-full bg-white dark:bg-[#111111] border border-zinc-200/40 dark:border-zinc-850 rounded-3xl overflow-hidden shadow-2xl animate-fade-in pb-10">
          
          {/* Main Hero Panel */}
          <div className="relative h-72 sm:h-96 flex flex-col justify-end p-6 sm:p-10 z-0">
            <img 
              src={smartGuide.destination.image_url || 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=1200&q=80'} 
              alt={smartGuide.destination.name}
              className="absolute inset-0 w-full h-full object-cover select-none transition-all duration-700 hover:scale-[1.03]"
              style={{ filter: 'brightness(0.35) contrast(1.05)' }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/35"></div>
            
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-[10px] text-white font-mono font-black uppercase px-3 py-1 rounded-full border border-emerald-400">
                <Sparkles size={11} className="animate-spin-slow" /> GOOGLE PLACES SYNCED
              </span>
              <span className="inline-flex items-center gap-1 bg-[#d4af37] text-[10px] text-slate-950 font-mono font-black uppercase px-3 py-1 rounded-full border border-yellow-250">
                ★ {smartGuide.budget ? smartGuide.budget : budget.toUpperCase() + ' BUDGET'}
              </span>
            </div>

            <div className="relative z-10 text-white text-left">
              <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#d4af37] block mb-1">
                {language === 'ar' ? 'صورة حية من خرائط جوجل • الوجهة الأساسية' : 'Google Maps Live Photo • Core Destination'}
              </span>
              <h3 className="text-3xl sm:text-5xl font-serif font-black leading-tight mb-2 text-white drop-shadow-md">
                {smartGuide.destination.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-200/95 font-serif italic max-w-2xl leading-relaxed drop-shadow-sm">
                {smartGuide.destination.description || (language === 'ar' ? 'استمتع بأروع التفاصيل البصرية لوجهتك السياحية المميزة.' : 'Enjoy high-fidelity visuals of your dream destination.')}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-12">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8 border-b border-zinc-200/45 dark:border-zinc-800/45 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Wallet size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                    {language === 'ar' ? 'الميزانية الإجمالية المقدرة' : 'Total Estimated Budget'}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {smartGuide.budget}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center shrink-0">
                  <Compass size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                    {language === 'ar' ? 'الاهتمام والعاطفة' : 'Primary Vibe'}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white uppercase font-mono">
                    {style}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                    {language === 'ar' ? 'رفيق السفر' : 'Companions'}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {companion}
                  </span>
                </div>
              </div>
            </div>

            {/* RECOMMENDED HOTEL DECK */}
            <div className="space-y-6">
              <h4 className="text-xl font-serif font-black text-gray-900 dark:text-white flex items-center gap-2 text-left">
                <span className="w-1.5 h-6 bg-[#d4af37] rounded-full"></span>
                <span>{language === 'ar' ? 'الإقامة الموصى بها مسبقاً' : 'Selected Hotel Accommodation'}</span>
              </h4>
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-zinc-200/30 dark:border-zinc-805 shadow-md group">
                <img 
                  src={smartGuide.hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'} 
                  alt={smartGuide.hotel.name}
                  className="absolute inset-0 w-full h-full object-cover transition duration-550 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <span className="text-[9px] font-mono tracking-widest text-[#d4af37] uppercase block mb-1">
                    {language === 'ar' ? 'مزامنة خرائط جوجل • الفندق المفضل' : 'GOOGLE PLACES MATCHED • PREFERRED CHOICE'}
                  </span>
                  <h5 className="text-2xl font-serif font-black">{smartGuide.hotel.name}</h5>
                  <p className="text-xs text-gray-200 mt-2 max-w-xl">
                    {smartGuide.hotel.description || (language === 'ar' ? 'موقع استراتيجي ممتاز لتسهيل التنقل والاستمتاع بإطلالة باهرة.' : 'Strategically matched hotel choice for seamless commute and premium local comfort.')}
                  </p>
                </div>
              </div>
            </div>

            {/* MUST-VISIT ATTRACTIONS DECK */}
            <div className="space-y-6">
              <h4 className="text-xl font-serif font-black text-gray-900 dark:text-white flex items-center gap-2 text-left">
                <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
                <span>{language === 'ar' ? 'أبرز معالم الجذب السياحي' : 'Must-Visit Tourist Spots'}</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                {smartGuide.places.map((place: any, idx: number) => (
                  <div key={idx} className="relative h-60 rounded-2xl overflow-hidden border border-zinc-200/30 dark:border-zinc-800 shadow-md group">
                    <img 
                      src={place.image_url || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80'} 
                      alt={place.name}
                      className="absolute inset-0 w-full h-full object-cover transition duration-550 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-slate-950/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                      <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase block mb-1">
                        {language === 'ar' ? `المعلم ${idx + 1}` : `ATTRACTION ${idx + 1}`}
                      </span>
                      <h5 className="text-xl font-black">{place.name}</h5>
                      <p className="text-[11px] text-gray-200 mt-1 line-clamp-2 leading-relaxed">
                        {place.description || (language === 'ar' ? 'وجهة سياحية عريقة تمنحك فرصة استكشاف تفاصيل التاريخ ومشاعر الدفء المحلية.' : 'Iconic landmark to experience the rich cultural tapestry.')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXPEDITION ITINERARY PLAN */}
            <div className="space-y-6 pt-6 border-t border-zinc-200/40 dark:border-zinc-800/40 text-left">
              <h4 className="text-xl font-serif font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                <span>{language === 'ar' ? 'برنامج الرحلة خطوة بخطوة' : 'Step-by-Step Exploration Schedule'}</span>
              </h4>
              <div className="space-y-4">
                {smartGuide.itinerary.map((item: string, idx: number) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/35 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition duration-300">
                    <span className="w-8 h-8 rounded-full bg-[#d4af37] text-slate-950 flex items-center justify-center shrink-0 font-mono text-[11px] font-black italic">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-gray-300 font-serif leading-relaxed text-left">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save & Reset Panel */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-zinc-200/40 dark:border-zinc-800/40 w-full">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    localStorage.setItem('rahala_saved_smart_guide', JSON.stringify(smartGuide));
                    setSmartSaved(true);
                    addNotification(language === 'ar' ? 'تم حفظ دليل الرحلة لخرائط جوجل في رحلاتك!' : 'Saved this Google Places guide successfully!');
                  }}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl border font-mono text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    smartSaved 
                      ? 'bg-red-500/10 border-red-500 text-red-550' 
                      : 'hover:bg-slate-100 dark:hover:bg-zinc-900 border-zinc-200/30 dark:border-zinc-800 text-gray-700 dark:text-white'
                  }`}
                >
                  <Bookmark size={14} className={smartSaved ? 'fill-red-500' : ''} />
                  <span>{smartSaved ? (language === 'ar' ? 'تم الحفظ ❤️ ' : 'Saved') : (language === 'ar' ? 'حفظ الخطة' : 'Save Plan')}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    addNotification(language === 'ar' ? 'تم نسخ رابط الموقع لمشاركته!' : 'Link copied to clipboard!');
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zinc-200/30 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 font-mono text-xs font-black uppercase tracking-wider text-gray-700 dark:text-white transition cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>{language === 'ar' ? 'مشاركة' : 'Share Plan'}</span>
                </button>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={resetSmartWizard}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl hover:bg-slate-150 dark:hover:bg-zinc-900 font-mono text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-455 transition cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>{language === 'ar' ? 'البدء من جديد' : 'New Custom Trip'}</span>
                </button>

                <button
                  onClick={() => addNotification(language === 'ar' ? 'سيتم ربطك بحجوزات مباشر للفنادق قريباً!' : 'Opening seamless integration with booking systems soon!')}
                  className="flex-1 sm:flex-auto px-8 py-3 bg-[#1a1a1a] dark:bg-[#f5f2ed] text-[#f5f2ed] dark:text-[#1a1a1a] font-mono text-xs font-black uppercase tracking-widest hover:bg-[#d4af37] dark:hover:bg-[#d4af37] hover:text-black transition rounded-xl shadow-lg border border-[#d4af37] cursor-pointer"
                >
                  {language === 'ar' ? 'احجز رحلتك الآن' : 'Book Your Odyssey Now'}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* RESULT VISUALIZATION CARD */}
      {plan && !loading && !error && (
        <div className="w-full bg-white dark:bg-[#161616] border border-[#1a1a1a]/15 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
          
          {/* Hero Banner with overlay gradient */}
          <div className="relative h-64 sm:h-80 flex flex-col justify-end p-6 sm:p-10 z-0">
            <img 
              src={getHeroImg()} 
              alt={plan.title}
              className="absolute inset-0 w-full h-full object-cover select-none"
              style={{ filter: 'brightness(0.4) contrast(1.05)' }}
              referrerPolicy="no-referrer"
            />
            {/* Soft gold twilight vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/35"></div>

            {/* AI Pill Badge */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-[10px] text-white font-mono font-black uppercase px-3 py-1 rounded-full border border-emerald-400">
                <Sparkles size={11} /> AI RECOMMENDED
              </span>
              <span className="inline-flex items-center gap-1 bg-[#d4af37] text-[10px] text-slate-950 font-mono font-black uppercase px-3 py-1 rounded-full border border-yellow-250">
                ★ OPTIMIZED DURATION
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="relative z-10 text-white text-left">
              <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#d4af37] block mb-1">
                {language === 'ar' ? 'مرشدك الشخصي للجزائر في جيبك' : 'Your personal Algerian compass'}
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-black leading-tight mb-2 text-[#fcfcfc] dark:text-white drop-shadow-md">
                {plan.title}
              </h3>
              <p className="text-xs text-gray-200/90 font-serif italic max-w-2xl leading-relaxed drop-shadow-sm">
                {plan.overview}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {/* Top Stat Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8 border-b border-[#1a1a1a]/10 dark:border-white/10 mb-8 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Wallet size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                    {language === 'ar' ? 'الميزانية المقدرة' : 'Estimated Budget'}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {(plan.totalEstimatedCostDzd || 35000).toLocaleString()} DZD
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 dark:text-[#d4af37] flex items-center justify-center shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                    {language === 'ar' ? 'عدد الأيام' : 'Duration'}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {plan.days.length} {language === 'ar' ? 'أيام' : 'Days'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                    {language === 'ar' ? 'رفيق السفر' : 'Companions'}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {companion}
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <h4 className="text-lg font-serif font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Compass size={18} className="text-emerald-500" />
              <span>{language === 'ar' ? 'تفاصيل جدول الرحلة اليومي' : 'Day-by-Day Expedition Itinerary'}</span>
            </h4>

            {/* Day Selector Buttons */}
            <div className="flex gap-2 mr-[-10px] overflow-x-auto pb-4 mb-6">
              {plan.days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2 font-mono text-[11px] font-black uppercase rounded-lg border tracking-wider transition ${
                    activeDayIndex === idx 
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                      : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-[#1a1a1a]/10 dark:border-white/10 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {language === 'ar' ? `اليوم ${day.dayNumber}` : `Day ${day.dayNumber}`}
                </button>
              ))}
            </div>

            {/* Active Day detailed block */}
            {plan.days[activeDayIndex] && (
              <div className="bg-[#eae7e1]/25 dark:bg-[#202020]/20 rounded-2xl border border-[#1a1a1a]/5 dark:border-white/5 p-6 sm:p-8 animate-fade-in">
                <div className="flex justify-between items-start gap-4 mb-6 border-b border-[#1a1a1a]/5 dark:border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] bg-[#d4af37]/20 text-slate-800 dark:text-[#d4af37] uppercase font-mono px-2.5 py-0.5 rounded font-black tracking-widest border border-[#d4af37]/35 inline-block mb-2">
                      {plan.days[activeDayIndex].locationName || 'Algeria'}
                    </span>
                    <h5 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                      {plan.days[activeDayIndex].title}
                    </h5>
                  </div>
                  {plan.days[activeDayIndex].estimatedCostDzd && (
                    <div className="text-right shrink-0">
                      <span className="text-[9px] uppercase font-mono text-gray-400 tracking-wider block">Coût Journalier</span>
                      <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-450">
                        {plan.days[activeDayIndex].estimatedCostDzd.toLocaleString()} DZD
                      </span>
                    </div>
                  )}
                </div>

                {/* Day detailed blocks */}
                <div className="space-y-6">
                  {/* Morning */}
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-[#d4af37] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                      🌅
                    </span>
                    <div>
                      <p className="text-xs uppercase font-mono font-black text-gray-400 tracking-wider">
                        {language === 'ar' ? 'الصباح والاستكشاف الأولي' : 'Morning Sightseeing'}
                      </p>
                      <p className="text-xs text-slate-700 dark:text-gray-300 mt-1 leading-relaxed">
                        {plan.days[activeDayIndex].morning}
                      </p>
                    </div>
                  </div>

                  {/* Afternoon */}
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                      ☀️
                    </span>
                    <div>
                      <p className="text-xs uppercase font-mono font-black text-gray-400 tracking-wider">
                        {language === 'ar' ? 'بعد الظهر والغداء' : 'Afternoon Adventures & local hub'}
                      </p>
                      <p className="text-xs text-slate-700 dark:text-gray-300 mt-1 leading-relaxed">
                        {plan.days[activeDayIndex].afternoon}
                      </p>
                    </div>
                  </div>

                  {/* Evening */}
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                      🌙
                    </span>
                    <div>
                      <p className="text-xs uppercase font-mono font-black text-gray-400 tracking-wider">
                        {language === 'ar' ? 'المساء والراحة والعشاء' : 'Evening Chillout'}
                      </p>
                      <p className="text-xs text-slate-700 dark:text-gray-300 mt-1 leading-relaxed">
                        {plan.days[activeDayIndex].evening}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cuisine & Tips expansion bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#1a1a1a]/5 dark:border-white/5">
                  {plan.days[activeDayIndex].cuisineRecommendation && (
                    <div className="p-4 bg-amber-500/5 hover:bg-amber-500/10 transition border border-amber-500/10 rounded-xl">
                      <div className="flex items-center gap-1.5 mb-1.5 text-amber-750 dark:text-amber-400 uppercase font-mono text-[10px] font-bold">
                        <Coffee size={12} />
                        <span>{language === 'ar' ? 'توصيات المأكولات التقليدية' : 'Tradition Culinary Pick'}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300 italic">
                        {plan.days[activeDayIndex].cuisineRecommendation}
                      </p>
                    </div>
                  )}

                  {plan.days[activeDayIndex].budgetTip && (
                    <div className="p-4 bg-emerald-500/5 hover:bg-emerald-500/10 transition border border-emerald-500/10 rounded-xl">
                      <div className="flex items-center gap-1.5 mb-1.5 text-emerald-850 dark:text-emerald-400 uppercase font-mono text-[10px] font-bold">
                        <Info size={12} />
                        <span>{language === 'ar' ? 'نصيحة الميزانية والتراخيص' : 'Local Money Saving advice'}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300">
                        {plan.days[activeDayIndex].budgetTip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-10 pt-8 border-t border-[#1a1a1a]/10 dark:border-white/10">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveTrip}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl border font-mono text-xs font-black uppercase tracking-wider transition ${
                    saved 
                      ? 'bg-red-500/10 border-red-500 text-red-500' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900 border-[#1a1a1a]/15 dark:border-white/10 text-gray-700 dark:text-white'
                  }`}
                >
                  <Bookmark size={14} className={saved ? 'fill-red-500' : ''} />
                  <span>{saved ? (language === 'ar' ? 'تم الحفظ ❤️ ' : 'Saved') : (language === 'ar' ? 'حفظ الخطة' : 'Save Plan')}</span>
                </button>

                <button
                  onClick={handleShareTrip}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#1a1a1a]/15 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-900 font-mono text-xs font-black uppercase tracking-wider text-gray-700 dark:text-white transition"
                >
                  <Share2 size={14} />
                  <span>{language === 'ar' ? 'مشاركة' : 'Share Plan'}</span>
                </button>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={resetWizard}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 font-mono text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 transition"
                >
                  <RefreshCw size={12} />
                  <span>{language === 'ar' ? 'البدء من جديد' : 'New Custom Trip'}</span>
                </button>

                <button
                  onClick={() => addNotification(language === 'ar' ? 'سيتم التوجيه نحو قائمة الفنادق وحجز غرفكم!' : 'Connecting layout for direct booking!')}
                  className="flex-1 sm:flex-auto px-8 py-3 bg-[#1a1a1a] dark:bg-[#f5f2ed] text-[#f5f2ed] dark:text-[#1a1a1a] font-mono text-xs font-black uppercase tracking-widest hover:bg-[#d4af37] dark:hover:bg-[#d4af37] hover:text-black transition rounded-xl shadow-lg border border-[#d4af37]"
                >
                  {language === 'ar' ? 'احجز رحلتك الآن' : 'Book Your Odyssey Now'}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MULTISTEP WIZARD (OPTION A) */}
      {!plan && !smartGuide && !loading && !smartLoading && !error && !smartError && (
        <div className="w-full bg-[#eae7e1]/20 dark:bg-[#161616]/20 border border-[#1a1a1a]/15 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-lg backdrop-blur-sm">
          
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-2">
              <span className="uppercase font-bold tracking-wider">
                {language === 'ar' ? `الخطوة ${step} من 5` : `Step ${step} of 5`}
              </span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-450">
                {step * 20}% {language === 'ar' ? 'مكتمل' : 'Completed'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                style={{ width: `${step * 20}%` }}
              ></div>
            </div>
          </div>

          {/* STEP 1: BUDGET SELECTION */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="text-emerald-500" size={18} />
                <h4 className="text-lg font-serif font-black text-gray-900 dark:text-white">
                  {labels.budgetTitle[language === 'ar' ? 'ar' : 'en']}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                
                {/* Low Budget */}
                <button
                  type="button"
                  onClick={() => setBudget('economy')}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition cursor-pointer ${
                    budget === 'economy' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md scale-[1.01]' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40 bg-white/50 dark:bg-black/30'
                  }`}
                >
                  <span className="text-2xl">💰</span>
                  <div>
                    <h5 className="font-bold text-sm text-gray-950 dark:text-white mb-1">
                      {language === 'ar' ? 'ميزانية منخفضة / اقتصادية' : 'Low Budget'}
                    </h5>
                    <p className="text-[11px] text-gray-400">
                      {language === 'ar' ? 'أكل الشوارع والمواصلات المشتركة' : 'Economy street eats & transit'}
                    </p>
                  </div>
                </button>

                {/* Medium Budget */}
                <button
                  type="button"
                  onClick={() => setBudget('moderate')}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition cursor-pointer ${
                    budget === 'moderate' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md scale-[1.01]' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40 bg-white/50 dark:bg-black/30'
                  }`}
                >
                  <span className="text-2xl">💰💰</span>
                  <div>
                    <h5 className="font-bold text-sm text-gray-950 dark:text-white mb-1">
                      {language === 'ar' ? 'ميزانية متوسطة' : 'Medium Budget'}
                    </h5>
                    <p className="text-[11px] text-gray-400">
                      {language === 'ar' ? 'فنادق محلية ومطاعم عاصمية مريحة' : 'Comfort guesthouses & local foods'}
                    </p>
                  </div>
                </button>

                {/* High Budget */}
                <button
                  type="button"
                  onClick={() => setBudget('luxury')}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition cursor-pointer ${
                    budget === 'luxury' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md scale-[1.01]' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40 bg-white/50 dark:bg-black/30'
                  }`}
                >
                  <span className="text-2xl">💰💰💰</span>
                  <div>
                    <h5 className="font-bold text-sm text-gray-950 dark:text-white mb-1">
                      {language === 'ar' ? 'ميزانية فاخرة / كبار شخصيات' : 'Luxury VIP Budget'}
                    </h5>
                    <p className="text-[11px] text-gray-400">
                      {language === 'ar' ? 'سائق خاص وفنادق خمس نجوم مميزة' : 'Elite hotels, private driver & fine dining'}
                    </p>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* STEP 2: TRAVEL STYLE SELECTION */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="text-emerald-500" size={18} />
                <h4 className="text-lg font-serif font-black text-gray-900 dark:text-white">
                  {labels.styleTitle[language === 'ar' ? 'ar' : 'en']}
                </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                
                {/* Relax */}
                <button
                  type="button"
                  onClick={() => setStyle('Relax')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-32 transition cursor-pointer ${
                    style === 'Relax' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="text-3xl mb-2">🏖️</span>
                  <span className="font-bold text-xs text-gray-950 dark:text-white">
                    {language === 'ar' ? 'استرخاء' : 'Relax'}
                  </span>
                </button>

                {/* Adventure */}
                <button
                  type="button"
                  onClick={() => setStyle('Adventure')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-32 transition cursor-pointer ${
                    style === 'Adventure' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="text-3xl mb-2">🏜️</span>
                  <span className="font-bold text-xs text-gray-950 dark:text-white">
                    {language === 'ar' ? 'مغامرة وتخييم' : 'Adventure'}
                  </span>
                </button>

                {/* Culture */}
                <button
                  type="button"
                  onClick={() => setStyle('Culture')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-32 transition cursor-pointer ${
                    style === 'Culture' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="text-3xl mb-2">🏛️</span>
                  <span className="font-bold text-xs text-gray-950 dark:text-white">
                    {language === 'ar' ? 'ثقافة وتاريخ' : 'Culture'}
                  </span>
                </button>

                {/* Luxury */}
                <button
                  type="button"
                  onClick={() => setStyle('Luxury')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-32 transition cursor-pointer ${
                    style === 'Luxury' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="text-3xl mb-2">✨</span>
                  <span className="font-bold text-xs text-gray-950 dark:text-white">
                    {language === 'ar' ? 'رفاهية متكاملة' : 'Luxury'}
                  </span>
                </button>

              </div>
            </div>
          )}

          {/* STEP 3: LANDSCAPE PREFERENCE */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Grid className="text-emerald-500" size={18} />
                <h4 className="text-lg font-serif font-black text-gray-900 dark:text-white">
                  {labels.preferenceTitle[language === 'ar' ? 'ar' : 'en']}
                </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                
                {/* Beach */}
                <button
                  type="button"
                  onClick={() => setPreference('Beach')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-32 transition cursor-pointer ${
                    preference === 'Beach' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="text-3xl mb-2">🌊</span>
                  <span className="font-bold text-xs text-gray-950 dark:text-white">
                    {language === 'ar' ? 'شواطئ وبحار' : 'Beach'}
                  </span>
                </button>

                {/* Desert */}
                <button
                  type="button"
                  onClick={() => setPreference('Desert')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-32 transition cursor-pointer ${
                    preference === 'Desert' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="text-3xl mb-2">🐪</span>
                  <span className="font-bold text-xs text-gray-950 dark:text-white">
                    {language === 'ar' ? 'صحراء ميزاب وتغيت' : 'Desert'}
                  </span>
                </button>

                {/* City */}
                <button
                  type="button"
                  onClick={() => setPreference('City')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-32 transition cursor-pointer ${
                    preference === 'City' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="text-3xl mb-2">🏙️</span>
                  <span className="font-bold text-xs text-gray-950 dark:text-white">
                    {language === 'ar' ? 'مدن عاصمية وأزقة' : 'City Center'}
                  </span>
                </button>

                {/* Nature */}
                <button
                  type="button"
                  onClick={() => setPreference('Nature')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-32 transition cursor-pointer ${
                    preference === 'Nature' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="text-3xl mb-2">🌄</span>
                  <span className="font-bold text-xs text-gray-950 dark:text-white">
                    {language === 'ar' ? 'طبيعة وجبال' : 'Nature Hills'}
                  </span>
                </button>

              </div>
            </div>
          )}

          {/* STEP 4: TOUR DURATION */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-emerald-500" size={18} />
                <h4 className="text-lg font-serif font-black text-gray-900 dark:text-white">
                  {labels.durationTitle[language === 'ar' ? 'ar' : 'en']}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                
                {/* 1-3 Days */}
                <button
                  type="button"
                  onClick={() => setDuration(3)}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-32 transition cursor-pointer ${
                    duration === 3 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40 bg-white/50 dark:bg-black/30'
                  }`}
                >
                  <span className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">1–3 DAYS</span>
                  <h5 className="font-bold text-sm text-gray-950 dark:text-white mt-2">
                    {language === 'ar' ? 'إجازة سريعة وخفيفة' : 'Short Escape'}
                  </h5>
                </button>

                {/* 4-7 Days */}
                <button
                  type="button"
                  onClick={() => setDuration(5)}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-32 transition cursor-pointer ${
                    duration === 5 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40 bg-white/50 dark:bg-black/30'
                  }`}
                >
                  <span className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">4–7 DAYS</span>
                  <h5 className="font-bold text-sm text-gray-950 dark:text-white mt-2">
                    {language === 'ar' ? 'استكشاف سياحي متوازن' : 'Balanced Tour'}
                  </h5>
                </button>

                {/* 1 week+ */}
                <button
                  type="button"
                  onClick={() => setDuration(8)}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-32 transition cursor-pointer ${
                    duration === 8 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40 bg-white/50 dark:bg-black/30'
                  }`}
                >
                  <span className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">1 WEEK+</span>
                  <h5 className="font-bold text-sm text-gray-950 dark:text-white mt-2">
                    {language === 'ar' ? 'رحلة ملحمية عميقة' : 'Epic Odyssey'}
                  </h5>
                </button>

              </div>
            </div>
          )}

          {/* STEP 5: COMPANIONS */}
          {step === 5 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-emerald-500" size={18} />
                <h4 className="text-lg font-serif font-black text-gray-900 dark:text-white">
                  {labels.companionTitle[language === 'ar' ? 'ar' : 'en']}
                </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                
                {/* Solo */}
                <button
                  type="button"
                  onClick={() => setCompanion('Solo')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-28 transition cursor-pointer ${
                    companion === 'Solo' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="font-bold text-sm text-gray-950 dark:text-white">
                    {language === 'ar' ? 'منفرد' : 'Solo'}
                  </span>
                </button>

                {/* Couple */}
                <button
                  type="button"
                  onClick={() => setCompanion('Couple')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-28 transition cursor-pointer ${
                    companion === 'Couple' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="font-bold text-sm text-gray-950 dark:text-white">
                    {language === 'ar' ? 'زوجين / ثنائي' : 'Couple'}
                  </span>
                </button>

                {/* Family */}
                <button
                  type="button"
                  onClick={() => setCompanion('Family')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-28 transition cursor-pointer ${
                    companion === 'Family' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="font-bold text-sm text-gray-950 dark:text-white">
                    {language === 'ar' ? 'عائلة' : 'Family'}
                  </span>
                </button>

                {/* Friends */}
                <button
                  type="button"
                  onClick={() => setCompanion('Friends')}
                  className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center h-28 transition cursor-pointer ${
                    companion === 'Friends' 
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-[#1a1a1a]/10 dark:border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="font-bold text-sm text-gray-950 dark:text-white">
                    {language === 'ar' ? 'أصدقاء' : 'Friends'}
                  </span>
                </button>

              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center border-t border-[#1a1a1a]/10 dark:border-white/10 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#1a1a1a]/10 dark:border-white/10 text-gray-600 dark:text-gray-400 font-mono text-xs font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{labels.buttonPrev[language === 'ar' ? 'ar' : 'en']}</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer"
              >
                <span>{labels.buttonNext[language === 'ar' ? 'ar' : 'en']}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={generateItinerary}
                className="flex items-center gap-1.5 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-750 hover:bg-emerald-750 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition shadow-lg hover:from-emerald-750 hover:to-emerald-850 active:scale-95 cursor-pointer border border-emerald-500"
              >
                <Sparkles size={14} className="animate-pulse" />
                <span>{labels.buttonGenerate[language === 'ar' ? 'ar' : 'en']}</span>
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
