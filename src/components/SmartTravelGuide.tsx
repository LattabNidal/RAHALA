import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { SocialShare } from './SocialShare';
import { PriceTag } from './rahala/PriceTag';
import { ScoreTag } from './rahala/ScoreTag';
import { LazyImage } from './rahala/LazyImage';
import { 
  Sparkles, Wallet, Compass, Grid, Calendar, Users, 
  ArrowRight, ArrowLeft, RefreshCw, Bookmark, Share2, Download, QrCode,
  MapPin, Coffee, Info, ChevronDown, ChevronUp, CheckCircle2,
  Facebook, Twitter, Linkedin, Mail, Copy, X
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
  const { addNotification, currentUser } = useApp();

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
  const [activePlanIndex, setActivePlanIndex] = useState<number>(0);

  // Async API State (Premium Smart Guides with Google Places Photos)
  const [smartLoading, setSmartLoading] = useState<boolean>(false);
  const [smartError, setSmartError] = useState<string | null>(null);
  const [smartGuide, setSmartGuide] = useState<any | null>(null);
  const [smartSaved, setSmartSaved] = useState<boolean>(false);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{ title: string; text: string; url: string }>({
    title: '',
    text: '',
    url: ''
  });

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

    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget,
          style,
          preference,
          duration,
          companion,
          language
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error status.');
      }

      const data = await response.json();
      if (!data || (!data.plans && !data.title)) {
        throw new Error('Invalid travel plan response format.');
      }

      setPlan(data);
      setActivePlanIndex(0);
      setActiveDayIndex(0);
      addNotification(
        data.plans 
          ? (language === 'ar' ? 'تم توليد 3 خطط رحلات متميزة كـ DZ Trip Planner!' : '3 DZ Trip Planner itineraries generated!') 
          : (language === 'ar' ? 'تم توليد خطة رحلتك الذكية!' : 'Personalized AI travel plan generated!')
      );
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
    const title = plan.title;
    const text = language === 'ar' 
      ? `شاهد مساري السياحي المخصص في الجزائر: ${title} المولد بالذكاء الاصطناعي مع RAHLA! 🇩🇿`
      : `Check out my custom Algeria travel plan: ${title} generated by RAHLA AI! 🇩🇿✈️`;
    const url = window.location.origin + '/#/ai-guide';
    
    setShareData({ title, text, url });
    setShowShareModal(true);
  };

  const handleSmartShareTrip = () => {
    if (!smartGuide) return;
    const title = smartGuide.destination?.name || smartGuide.destination;
    const text = language === 'ar'
      ? `شاهد الدليل السياحي الذكي لـ ${title} مع صور خرائط غوغل الموثوقة من RAHLA! 🇩🇿`
      : `Check out my smart travel guide for ${title} with authentic Google Maps pictures on RAHLA! 🇩🇿✈️`;
    const url = window.location.origin + '/#/ai-guide';

    setShareData({ title, text, url });
    setShowShareModal(true);
  };

  const handleDownloadPDF = () => {
    let title = '';
    let htmlContent = '';
    const shareUrl = window.location.origin + '/#/ai-guide';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`;

    // User session authentication tokens
    const userSessionId = currentUser?.id || 'usr-928';
    const userSessionEmail = currentUser?.email || 'lattab.nidal@gmail.com';
    const userSessionName = currentUser?.name || 'Nidal Lattab';
    const loginTokenUrl = `${window.location.origin}/#/?auth_token=RIHLA-TOKEN-${userSessionId}-${Date.now().toString().substring(0, 8)}&verify=${encodeURIComponent(userSessionEmail)}`;
    const loginTokenQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(loginTokenUrl)}`;

    // Translation dictionary for 4 languages (AR/FR/EN/ES)
    const dict = {
      authBadge: {
        en: 'CERTIFIED DIGITAL GUIDE',
        fr: 'GUIDE NUMÉRIQUE CERTIFIÉ',
        ar: 'تحقق رقمي معتمد',
        es: 'GUÍA DIGITAL CERTIFICADA'
      },
      authTitle: {
        en: 'Official RAHLA Itinerary Authentication',
        fr: "Authentification Officielle de l'Itinéraire RAHLA",
        ar: 'وثيقة رحلة رسمية وموثقة من RAHLA',
        es: 'Autenticación Oficial del Itinerario RAHLA'
      },
      authDesc: {
        en: "This itinerary has been digitally certified by RAHLA's artificial intelligence. Scan this QR code to open it instantly on your smartphone, view the full site, and activate real-time GPS navigation.",
        fr: "Cet itinéraire a été certifié numériquement par l'intelligence artificielle de RAHLA. Scannez ce QR code pour l'ouvrir instantanément sur votre smartphone, voir le site complet, et activer la navigation GPS en temps réel.",
        ar: 'تم التحقق من صحة هذا المسار رقمياً ومزامنته مع نظام الذكاء الاصطناعي RAHLA. امسح الرمز ضوئياً للفتح المباشر على الهاتف والحصول على اتجاهات الملاحة الحية والتحقق من صحة المعالم.',
        es: "Este itinerario ha sido certificado digitalmente por la inteligencia artificial de RAHLA. Escanee este código QR para abrirlo instantáneamente en su teléfono móvil, ver el sitio completo y activar la navegación GPS en tiempo real."
      },
      sessionBadge: {
        en: 'CERTIFIED USER SESSION',
        fr: 'SESSION UTILISATEUR CERTIFIÉE',
        ar: 'جلسة مستخدم معتمدة وموثقة',
        es: 'SESIÓN DE USUARIO CERTIFICADA'
      },
      sessionTitle: {
        en: 'Traveler Session Authentication',
        fr: 'Authentification de la Session Voyageur',
        ar: 'التحقق الأمني من الجلسة والهوية',
        es: 'Autenticación de la Sesión del Viajero'
      },
      sessionDesc: {
        en: 'This travel document is linked to an active and verified user session.',
        fr: 'Ce document de voyage est rattaché à une session utilisateur active et vérifiée.',
        ar: 'تم ربط وثيقة السفر هذه بجلسة مستخدم نشطة ومصدقة.',
        es: 'Este documento de viaje está vinculado a una sesión de usuario activa y verificada.'
      },
      voyageur: {
        en: 'Traveler',
        fr: 'Voyageur',
        ar: 'الاسم الكامل',
        es: 'Viajero'
      },
      email: {
        en: 'Email Address',
        fr: 'Adresse Email',
        ar: 'البريد الإلكتروني',
        es: 'Correo Electrónico'
      },
      tokenLabel: {
        en: 'Secure Session Connection Token (QR-Token)',
        fr: 'Jeton de Connexion Session (QR-Token)',
        ar: 'رمز تسجيل الدخول الرقمي الآمن (QR)',
        es: 'Token de Conexión de Sesión (QR-Token)'
      },
      scanToVerify: {
        en: 'SCAN TO VERIFY',
        fr: 'SCANNER POUR VÉRIFIER',
        ar: 'امسح للتحقق',
        es: 'ESCANEAR PARA VERIFICAR'
      },
      day: {
        en: 'Day',
        fr: 'Jour',
        ar: 'اليوم',
        es: 'Día'
      },
      budget: {
        en: 'Budget',
        fr: 'Budget',
        ar: 'الميزانية',
        es: 'Presupuesto'
      },
      recommendedHotel: {
        en: 'Recommended Hotel',
        fr: 'Hôtel Recommandé',
        ar: 'الإقامة الموصى بها',
        es: 'Hotel Recomendado'
      },
      placesOverviewDefault: {
        en: 'Smart Places Guide with real Google Photos',
        fr: 'Guide intelligent des lieux avec de vraies photos Google',
        ar: 'دليل الأماكن الحقيقي الذكي مع صور خرائط جوجل',
        es: 'Guía inteligente de lugares con fotos reales de Google'
      },
      hotelDetails: {
        en: 'Recommended Stay Details',
        fr: "Détails de l'hébergement recommandé",
        ar: 'تفاصيل الفندق المقترح',
        es: 'Detalles del alojamiento recomendado'
      },
      landmarksTitle: {
        en: 'Top Curated Places & Landmarks',
        fr: 'Lieux & Monuments Sélectionnés',
        ar: 'الأماكن السياحية الموصى بزيارتها',
        es: 'Lugares y Monumentos Destacados'
      },
      itinerarySummary: {
        en: 'Itinerary Summary',
        fr: "Résumé de l'itinéraire",
        ar: 'ملخص خطة الرحلة',
        es: 'Resumen del itinerario'
      },
      morning: {
        en: 'Morning',
        fr: 'Matin',
        ar: 'الصباح',
        es: 'Mañana'
      },
      afternoon: {
        en: 'Afternoon',
        fr: 'Après-midi',
        ar: 'بعد الظهر',
        es: 'Tarde'
      },
      evening: {
        en: 'Evening',
        fr: 'Soir',
        ar: 'المساء',
        es: 'Noche'
      },
      cuisine: {
        en: 'Local Culinary recommendation',
        fr: 'Recommandation culinaire locale',
        ar: 'توصيات المأكولات التقليدية',
        es: 'Recomendación culinaria local'
      },
      savingTip: {
        en: 'Local Saving advice',
        fr: "Conseil d'économie local",
        ar: 'نصيحة الميزانية والتوفير',
        es: 'Consejo de ahorro local'
      },
      estimatedBudget: {
        en: 'Estimated Total Budget',
        fr: 'Budget total estimé',
        ar: 'الميزانية التقريبية للرحلة',
        es: 'Presupuesto total estimado'
      },
      totalDays: {
        en: 'Total Days',
        fr: 'Durée totale',
        ar: 'مدة الإقامة',
        es: 'Duración total'
      },
      daysCount: {
        en: 'Days',
        fr: 'Jours',
        ar: 'أيام',
        es: 'Días'
      },
      comprehensiveItinerary: {
        en: 'Day-by-Day Comprehensive Itinerary',
        fr: 'Itinéraire journalier complet',
        ar: 'الجدول اليومي المفصل',
        es: 'Itinerario diario completo'
      },
      errorGenerateFirst: {
        en: 'Please generate an itinerary first before downloading!',
        fr: 'Veuillez générer un itinéraire avant de le télécharger !',
        ar: 'يرجى توليد مسار الرحلة أولاً قبل التحميل!',
        es: '¡Por favor, genere un itinerario antes de descargarlo!'
      },
      errorAllowPopups: {
        en: '⚠️ Please allow popups to download your travel PDF',
        fr: '⚠️ Veuillez autoriser les popups pour télécharger votre PDF de voyage',
        ar: '⚠️ يرجى السماح بالنوافذ المنبثقة لتحميل ملف الـ PDF',
        es: '⚠️ Por favor, permita las ventanas emergentes para descargar su PDF de viaje'
      },
      downloadPrintButton: {
        en: 'Download as PDF / Print',
        fr: 'Télécharger en PDF / Imprimer',
        ar: 'تحميل كـ PDF / طباعة',
        es: 'Descargar en PDF / Imprimer'
      },
      footerMsg: {
        en: 'Generated by RAHLA AI Travel Guide',
        fr: 'Généré par RAHLA AI Travel Guide',
        ar: 'تم التوليد بواسطة دليل السفر الذكي RAHLA',
        es: 'Generado por RAHLA AI Travel Guide'
      },
      bonVoyage: {
        en: 'Have a great trip!',
        fr: 'Bon voyage !',
        ar: 'رحلة سعيدة!',
        es: '¡Buen viaje!'
      }
    };

    const getTrans = (translationsObj: Record<string, string>) => {
      return translationsObj[language] || translationsObj['en'];
    };

    const authCardHtml = `
      <div class="auth-card">
        <div class="auth-text">
          <div class="auth-badge">${getTrans(dict.authBadge)}</div>
          <div class="auth-title">${getTrans(dict.authTitle)}</div>
          <p class="auth-desc">
            ${getTrans(dict.authDesc)}
          </p>
        </div>
        <div class="auth-qr">
          <img src="${qrCodeUrl}" alt="QR Code" style="width: 100px; height: 100px; display: block;" referrerPolicy="no-referrer" />
        </div>
      </div>
    `;

    const sessionAuthCardHtml = `
      <div class="auth-card" style="border-color: #10b981; background: #fafdfc; margin-top: -20px; margin-bottom: 35px;">
        <div class="auth-text">
          <div class="auth-badge" style="background: #e6f4ea; border-color: #10b981; color: #137333;">
            ${getTrans(dict.sessionBadge)}
          </div>
          <div class="auth-title">${getTrans(dict.sessionTitle)}</div>
          <p class="auth-desc" style="margin-bottom: 12px; font-weight: 500;">
            ${getTrans(dict.sessionDesc)}
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11px; font-family: 'Inter', sans-serif; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e0f2f1;">
            <div>
              <span style="color: #666; display: block; font-size: 10px; text-transform: uppercase;">${getTrans(dict.voyageur)}</span>
              <strong style="color: #111;">${userSessionName}</strong>
            </div>
            <div>
              <span style="color: #666; display: block; font-size: 10px; text-transform: uppercase;">${getTrans(dict.email)}</span>
              <strong style="color: #111;">${userSessionEmail}</strong>
            </div>
            <div style="grid-column: span 2; border-top: 1px solid #f0f0f0; padding-top: 8px; margin-top: 4px;">
              <span style="color: #666; display: block; font-size: 10px; text-transform: uppercase;">${getTrans(dict.tokenLabel)}</span>
              <strong style="font-family: monospace; color: #10b981; font-size: 10px;">RIHLA-TOKEN-${userSessionId}-${Date.now().toString().substring(0, 8)}</strong>
            </div>
          </div>
        </div>
        <div class="auth-qr" style="border-color: #10b981;">
          <img src="${loginTokenQrUrl}" alt="Login Token QR" style="width: 100px; height: 100px; display: block;" referrerPolicy="no-referrer" />
          <div style="font-size: 8px; font-family: monospace; text-align: center; color: #10b981; margin-top: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">${getTrans(dict.scanToVerify)}</div>
        </div>
      </div>
    `;

    if (guideType === 'premium' && smartGuide) {
      title = smartGuide.destination?.name || smartGuide.destination || 'RAHLA Travel Guide';
      const hotelName = smartGuide.hotel?.name || '';
      const hotelDesc = smartGuide.hotel?.description || '';
      const budgetText = smartGuide.budget || budget;

      const placesHtml = smartGuide.places?.map((place: any, idx: number) => `
        <div class="day-card">
          <div class="day-header">
            <span>📍 ${place.name || `Place ${idx + 1}`}</span>
            <span class="badge">${place.category || 'Sightseeing'}</span>
          </div>
          <p class="activity-text">${place.description || ''}</p>
        </div>
      `).join('') || '';

      const itineraryHtml = smartGuide.itinerary?.map((item: string, idx: number) => `
        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #eee;">
          <strong>${getTrans(dict.day)} ${idx + 1}:</strong> ${item}
        </div>
      `).join('') || '';

      htmlContent = `
        <div class="header">
          <div class="brand">RAHLA AI • ✈️</div>
          <h1 class="title">${title}</h1>
          <p class="overview">${smartGuide.destination?.description || getTrans(dict.placesOverviewDefault)}</p>
        </div>

        <div class="meta-box">
          <div class="meta-item">
            <div class="meta-label">${getTrans(dict.budget)}</div>
            <div style="font-weight: bold; font-size: 16px; margin-top: 4px;">${budgetText}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">${getTrans(dict.recommendedHotel)}</div>
            <div style="font-weight: bold; font-size: 16px; margin-top: 4px;">${hotelName}</div>
          </div>
        </div>

        ${authCardHtml}
        ${sessionAuthCardHtml}

        ${hotelDesc ? `
          <div class="day-card" style="border-inline-start: 4px solid #d4af37;">
            <h3 style="margin-top: 0; color: #111;">🏨 ${getTrans(dict.hotelDetails)}</h3>
            <p class="activity-text">${hotelDesc}</p>
          </div>
        ` : ''}

        <h2 style="font-family: serif; border-bottom: 2px solid #eaeaea; padding-bottom: 8px; margin-top: 40px;">
          📌 ${getTrans(dict.landmarksTitle)}
        </h2>
        ${placesHtml}

        ${itineraryHtml ? `
          <h2 style="font-family: serif; border-bottom: 2px solid #eaeaea; padding-bottom: 8px; margin-top: 40px;">
            📅 ${getTrans(dict.itinerarySummary)}
          </h2>
          <div class="day-card">
            ${itineraryHtml}
          </div>
        ` : ''}
      `;
    } else if (plan) {
      const isMulti = Array.isArray(plan.plans) && plan.plans.length > 0;
      const current = isMulti ? plan.plans[activePlanIndex] || plan.plans[0] : plan;
      title = isMulti ? current.nom : plan.title;
      const daysList = isMulti ? current.jours : plan.days;
      
      const daysHtml = daysList ? daysList.map((day: any, idx: number) => `
        <div class="day-card">
          <div class="day-header">
            <span>🌅 ${getTrans(dict.day)} ${day.jour || day.dayNumber || idx + 1}: ${day.title || 'Programme'}</span>
            <span class="badge">📍 ${day.locationName || 'Algérie'}</span>
          </div>
          
          <div class="activity">
            <div class="activity-title">🌅 ${getTrans(dict.morning)}</div>
            <div class="activity-text">${day.matin || day.morning || ''}</div>
          </div>

          ${day.dejeuner ? `
            <div class="activity">
              <div class="activity-title">🍽️ Déjeuner</div>
              <div class="activity-text">${day.dejeuner}</div>
            </div>
          ` : ''}

          <div class="activity">
            <div class="activity-title">☀️ ${getTrans(dict.afternoon)}</div>
            <div class="activity-text">${day.apres_midi || day.afternoon || ''}</div>
          </div>

          ${day.cafe ? `
            <div class="activity">
              <div class="activity-title">☕ Pause Café</div>
              <div class="activity-text">${day.cafe}</div>
            </div>
          ` : ''}

          ${day.evening ? `
            <div class="activity">
              <div class="activity-title">🌙 ${getTrans(dict.evening)}</div>
              <div class="activity-text">${day.evening}</div>
            </div>
          ` : ''}

          ${day.hebergement ? `
            <div style="margin-top: 15px; padding: 12px; background: #fdfbf7; border-radius: 8px; border-inline-start: 3px solid #d4af37;">
              <strong style="font-size: 12px; text-transform: uppercase; color: #d4af37; display: block; margin-bottom: 4px;">
                🏨 Hébergement
              </strong>
              <span class="activity-text" style="font-weight: bold;">${day.hebergement}</span>
            </div>
          ` : ''}

          ${day.cuisineRecommendation ? `
            <div style="margin-top: 15px; padding: 12px; background: #fdfbf7; border-radius: 8px; border-inline-start: 3px solid #d4af37;">
              <strong style="font-size: 12px; text-transform: uppercase; color: #d4af37; display: block; margin-bottom: 4px;">
                🍽️ ${getTrans(dict.cuisine)}
              </strong>
              <span class="activity-text" style="font-style: italic;">${day.cuisineRecommendation}</span>
            </div>
          ` : ''}

          ${day.budgetTip ? `
            <div style="margin-top: 10px; padding: 12px; background: #f6fbf9; border-radius: 8px; border-inline-start: 3px solid #10b981;">
              <strong style="font-size: 12px; text-transform: uppercase; color: #10b981; display: block; margin-bottom: 4px;">
                💡 ${getTrans(dict.savingTip)}
              </strong>
              <span class="activity-text">${day.budgetTip}</span>
            </div>
          ` : ''}
        </div>
      `).join('') : '';

      htmlContent = `
        <div class="header">
          <div class="brand">RAHLA AI • ✈️</div>
          <h1 class="title">${title}</h1>
          <p class="overview">${plan.overview}</p>
        </div>

        <div class="meta-box">
          <div class="meta-item">
            <div class="meta-label">${getTrans(dict.estimatedBudget)}</div>
            <div style="font-weight: bold; font-size: 16px; margin-top: 4px; color: #10b981;">
              ${plan.totalEstimatedCostDzd.toLocaleString()} DZD
            </div>
          </div>
          <div class="meta-item">
            <div class="meta-label">${getTrans(dict.totalDays)}</div>
            <div style="font-weight: bold; font-size: 16px; margin-top: 4px;">${plan.days.length} ${getTrans(dict.daysCount)}</div>
          </div>
        </div>

        ${authCardHtml}
        ${sessionAuthCardHtml}

        <h2 style="font-family: serif; border-bottom: 2px solid #eaeaea; padding-bottom: 8px; margin-top: 40px; margin-bottom: 20px;">
          📅 ${getTrans(dict.comprehensiveItinerary)}
        </h2>
        ${daysHtml}
      `;
    } else {
      addNotification(getTrans(dict.errorGenerateFirst));
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      addNotification(getTrans(dict.errorAllowPopups));
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
          
          body {
            font-family: ${
              language === 'ar' 
                ? "'Noto Sans Arabic', 'Amiri', serif" 
                : language === 'fr' 
                  ? "'Playfair Display', 'Inter', sans-serif" 
                  : language === 'es' 
                    ? "'Outfit', 'Inter', sans-serif" 
                    : "'Inter', sans-serif"
            };
            color: #1a1a1a;
            background: #ffffff;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            direction: ${language === 'ar' ? 'rtl' : 'ltr'};
          }
          .header {
            border-bottom: 2px solid #d4af37;
            padding-bottom: 24px;
            margin-bottom: 30px;
            text-align: center;
          }
          .brand {
            font-size: 26px;
            font-weight: 800;
            color: #1a1a1a;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-family: 'Inter', sans-serif;
          }
          .title {
            font-size: 30px;
            font-weight: 700;
            margin: 15px 0 10px 0;
            color: #111;
            line-height: 1.3;
          }
          .overview {
            font-size: 15px;
            color: #555;
            margin-bottom: 25px;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.8;
          }
          .meta-box {
            display: flex;
            justify-content: space-around;
            background: #fdfbf7;
            border: 1px solid rgba(212, 175, 55, 0.2);
            padding: 20px;
            border-radius: 16px;
            margin-bottom: 35px;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
          }
          .auth-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fafaf9;
            border: 1.5px solid #d4af37;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 35px;
            gap: 20px;
            page-break-inside: avoid;
          }
          .auth-text {
            flex: 1;
            text-align: ${language === 'ar' ? 'right' : 'left'};
          }
          .auth-badge {
            display: inline-block;
            font-size: 10px;
            font-weight: 800;
            color: #1a1a1a;
            background: #f5f2ed;
            border: 1px solid #d4af37;
            padding: 4px 10px;
            border-radius: 6px;
            margin-bottom: 8px;
            text-transform: uppercase;
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.5px;
          }
          .auth-title {
            font-size: 15px;
            font-weight: bold;
            color: #111;
            margin-bottom: 6px;
          }
          .auth-desc {
            font-size: 12px;
            color: #555;
            margin: 0;
            line-height: 1.5;
          }
          .auth-qr {
            padding: 8px;
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            flex-shrink: 0;
          }
          .meta-item {
            text-align: center;
          }
          .meta-label {
            font-weight: bold;
            color: #888;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
          }
          .day-card {
            background: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 25px;
            page-break-inside: avoid;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .day-header {
            font-size: 21px;
            font-weight: 700;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 12px;
            margin-bottom: 18px;
            color: #d4af37;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .activity {
            margin-bottom: 18px;
          }
          .activity-title {
            font-weight: 700;
            color: #1a1a1a;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .activity-text {
            font-size: 14.5px;
            color: #374151;
            line-height: 1.7;
          }
          .badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: bold;
            background: #f5f2ed;
            color: #1a1a1a;
            font-family: 'Inter', sans-serif;
          }
          .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #eaeaea;
            padding-top: 24px;
            font-family: 'Inter', sans-serif;
          }
          .btn-print {
            display: block;
            width: fit-content;
            margin: 20px auto 40px auto;
            padding: 12px 28px;
            background: #d4af37;
            color: #000000;
            border: none;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4);
            transition: all 0.2s ease;
          }
          .btn-print:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
          }
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <button class="btn-print no-print" onclick="window.print()">${getTrans(dict.downloadPrintButton)}</button>
        
        ${htmlContent}

        <div class="footer">
          <p>${getTrans(dict.footerMsg)} &copy; 2026. ${getTrans(dict.bonVoyage)}</p>
        </div>

        <script>
          // Auto trigger print/save dialog on load
          window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
              window.print();
            }, 500);
          });
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Safe translations helpers
  const labels = {
    budgetTitle: { 
      en: 'Select Travel Budget', 
      fr: 'Sélectionnez votre budget de voyage', 
      ar: 'اختر ميزانية السفر', 
      es: 'Seleccione el presupuesto de viaje' 
    },
    styleTitle: { 
      en: 'Select Travel Style', 
      fr: 'Sélectionnez votre style de voyage', 
      ar: 'اختر أسلوب السفر', 
      es: 'Seleccione el estilo de viaje' 
    },
    preferenceTitle: { 
      en: 'Select Landscape Preference', 
      fr: 'Sélectionnez votre paysage préféré', 
      ar: 'اختر البيئة المفضلة ملائمة لك', 
      es: 'Seleccione su paisaje de preferencia' 
    },
    durationTitle: { 
      en: 'Select Total Duration', 
      fr: 'Sélectionnez la durée totale', 
      ar: 'اختر مدة الإقامة المقررة', 
      es: 'Seleccione la duración total' 
    },
    companionTitle: { 
      en: 'Select Travel Companions', 
      fr: 'Sélectionnez vos compagnons de voyage', 
      ar: 'اختر الرفقة أو الصحبة كالتالي', 
      es: 'Seleccione sus acompañantes de viaje' 
    },
    buttonNext: { 
      en: 'Next', 
      fr: 'Suivant', 
      ar: 'التالي', 
      es: 'Siguiente' 
    },
    buttonPrev: { 
      en: 'Back', 
      fr: 'Retour', 
      ar: 'السابق', 
      es: 'Atrás' 
    },
    buttonGenerate: { 
      en: 'Generate My Plan', 
      fr: 'Générer mon plan de voyage', 
      ar: 'توليد مساري المخصص بالذكاء الاصطناعي', 
      es: 'Generar mi plan de viaje' 
    },
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
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-encre dark:text-ivoire flex items-center gap-2">
            <span>Smart Travel Guide</span>
            <span className="text-encre-soft dark:text-gray-700 font-normal">/</span>
            <span className="font-serif font-bold text-xl sm:text-2xl text-or-sahara dark:text-or-sahara">مرشد الرحلة الذكي</span>
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
      <div className="flex gap-2 p-1 bg-ivoire dark:bg-noir-chaud rounded-xl max-w-md mb-8 border border-border">
        <button
          onClick={() => {
            setGuideType('premium');
            resetSmartWizard();
          }}
          className={`flex-1 py-2.5 px-3 rounded-lg font-mono text-[10px] font-black tracking-wider transition uppercase flex items-center justify-center gap-2 cursor-pointer ${
            guideType === 'premium'
              ? 'bg-or-sahara text-encre shadow-sm'
              : 'text-encre-soft hover:text-encre dark:text-gray-400 dark:hover:text-ivoire'
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
              ? 'bg-or-sahara text-encre shadow-sm'
              : 'text-encre-soft hover:text-encre dark:text-gray-400 dark:hover:text-ivoire'
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

      {guideType === 'premium' && smartGuide && !smartLoading && !smartError && (
        <div className="w-full bg-white dark:bg-[#111111] border border-zinc-200/40 dark:border-zinc-850 rounded-3xl overflow-hidden shadow-2xl animate-fade-in pb-10">
          
          {/* Main Hero Panel */}
          <div className="relative h-72 sm:h-96 flex flex-col justify-end p-6 sm:p-10 z-0">
            <LazyImage 
              src={smartGuide.destination.image_url || 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=1200&q=80'} 
              alt={smartGuide.destination.name || 'Destination Hero'}
              className="absolute inset-0 w-full h-full select-none transition-all duration-700 hover:scale-[1.03]"
              style={{ filter: 'brightness(0.35) contrast(1.05)' }}
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
                <LazyImage 
                  src={smartGuide.hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'} 
                  alt={smartGuide.hotel.name || 'Hotel'}
                  className="absolute inset-0 w-full h-full transition duration-550 group-hover:scale-105"
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
                    <LazyImage 
                      src={place.image_url || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80'} 
                      alt={place.name || `Place ${idx + 1}`}
                      className="absolute inset-0 w-full h-full transition duration-550 group-hover:scale-105"
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

            <SocialShare 
              title={smartGuide?.destination?.name || smartGuide?.destination || 'RAHLA Smart Guide'}
              text={language === 'ar'
                ? `شاهد الدليل السياحي الذكي لـ ${smartGuide?.destination?.name || smartGuide?.destination || 'RAHLA Smart Guide'} مع صور خرائط غوغل الموثوقة من RAHLA! 🇩🇿`
                : `Check out my smart travel guide for ${smartGuide?.destination?.name || smartGuide?.destination || 'RAHLA Smart Guide'} with authentic Google Maps pictures on RAHLA! 🇩🇿✈️`}
              url={window.location.origin + '/#/ai-guide'}
              language={language}
              handleDownloadPDF={handleDownloadPDF}
              addNotification={addNotification}
            />

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
                  onClick={() => {
                    addNotification(language === 'ar' ? 'جاري توجيهك لصفحة الدفع لتأكيد حجز رحلتك المتكاملة...' : 'Redirecting to checkout & billing to secure your booking...');
                    setTimeout(() => {
                      window.location.hash = '#/billing';
                    }, 1000);
                  }}
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
      {guideType === 'classic' && plan && !loading && !error && (() => {
        const isMultiPlan = Array.isArray(plan.plans) && plan.plans.length > 0;
        const currentPlan = isMultiPlan ? plan.plans[activePlanIndex] || plan.plans[0] : plan;
        const currentTitle = isMultiPlan ? currentPlan.nom : plan.title;
        const currentOverview = isMultiPlan ? currentPlan.resume : plan.overview;
        const daysList = isMultiPlan ? currentPlan.jours : plan.days;
        const activeDay = daysList && daysList[activeDayIndex] ? daysList[activeDayIndex] : null;

        const budgetDisplay = isMultiPlan && currentPlan.budget_estime_dzd
          ? `${currentPlan.budget_estime_dzd.min.toLocaleString()} – ${currentPlan.budget_estime_dzd.max.toLocaleString()} DZD`
          : `${(plan.totalEstimatedCostDzd || 35000).toLocaleString()} DZD`;

        return (
          <div className="w-full bg-white dark:bg-[#161616] border border-[#1a1a1a]/15 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            
            {/* Multi-Plan A / B / C Selection Header */}
            {isMultiPlan && (
              <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-slate-950 p-4 sm:p-6 border-b border-emerald-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-[#d4af37]" size={16} />
                  <span className="text-xs font-mono font-black uppercase text-[#d4af37] tracking-wider">
                    {language === 'ar' ? 'اختر أحد الإتيترات الثلاثة (DZ Trip Planner)' : '3 Tailored Itinerary Options (DZ Trip Planner)'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {plan.plans.map((p: any, idx: number) => {
                    const planLabel = idx === 0 ? 'Plan A' : idx === 1 ? 'Plan B' : 'Plan C';
                    const isSelected = activePlanIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActivePlanIndex(idx);
                          setActiveDayIndex(0);
                        }}
                        className={`p-4 rounded-2xl text-left transition cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-600/25 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-400'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                            isSelected ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-amber-400'
                          }`}>
                            {planLabel}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-gray-400">
                            {p.budget_estime_dzd ? `${(p.budget_estime_dzd.min / 1000).toFixed(0)}k–${(p.budget_estime_dzd.max / 1000).toFixed(0)}k DZD` : ''}
                          </span>
                        </div>
                        <h5 className="font-serif font-black text-xs sm:text-sm line-clamp-1 text-white">
                          {p.nom}
                        </h5>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hero Banner with overlay gradient */}
            <div className="relative h-64 sm:h-80 flex flex-col justify-end p-6 sm:p-10 z-0">
              <LazyImage 
                src={getHeroImg()} 
                alt={currentTitle || 'Hero Banner'}
                className="absolute inset-0 w-full h-full select-none"
                style={{ filter: 'brightness(0.4) contrast(1.05)' }}
              />
              {/* Soft gold twilight vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/35"></div>

              {/* AI Pill Badge */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <span className="inline-flex items-center gap-1 bg-emerald-600 text-[10px] text-white font-mono font-black uppercase px-3 py-1 rounded-full border border-emerald-400">
                  <Sparkles size={11} /> DZ TRIP PLANNER
                </span>
                <span className="inline-flex items-center gap-1 bg-[#d4af37] text-[10px] text-slate-950 font-mono font-black uppercase px-3 py-1 rounded-full border border-yellow-250">
                  ★ {isMultiPlan ? `OPTION ${activePlanIndex === 0 ? 'A' : activePlanIndex === 1 ? 'B' : 'C'}` : 'OPTIMIZED'}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="relative z-10 text-white text-left">
                <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#d4af37] block mb-1">
                  {language === 'ar' ? 'مرشدك الشخصي للجزائر في جيبك' : 'Your personal Algerian compass'}
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-black leading-tight mb-2 text-[#fcfcfc] dark:text-white drop-shadow-md">
                  {currentTitle}
                </h3>
                <p className="text-xs text-gray-200/90 font-serif italic max-w-2xl leading-relaxed drop-shadow-sm">
                  {currentOverview}
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
                    <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                      {isMultiPlan && currentPlan.budget_estime_dzd ? (
                        <span className="flex items-center gap-1">
                          <PriceTag amount={currentPlan.budget_estime_dzd.min} />
                          <span>–</span>
                          <PriceTag amount={currentPlan.budget_estime_dzd.max} />
                        </span>
                      ) : (
                        <PriceTag amount={plan.totalEstimatedCostDzd || 35000} />
                      )}
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
                      {daysList ? daysList.length : 0} {language === 'ar' ? 'أيام' : 'Days'}
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
              {daysList && daysList.length > 0 && (
                <div className="flex gap-2 mr-[-10px] overflow-x-auto pb-4 mb-6">
                  {daysList.map((day: any, idx: number) => {
                    const dayNum = day.jour || day.dayNumber || idx + 1;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveDayIndex(idx)}
                        className={`px-4 py-2 font-mono text-[11px] font-black uppercase rounded-lg border tracking-wider transition cursor-pointer ${
                          activeDayIndex === idx 
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                            : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-[#1a1a1a]/10 dark:border-white/10 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {language === 'ar' ? `اليوم ${dayNum}` : `Jour ${dayNum}`}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Active Day detailed block */}
              {activeDay && (
                <div className="bg-[#eae7e1]/25 dark:bg-[#202020]/20 rounded-2xl border border-[#1a1a1a]/5 dark:border-white/5 p-6 sm:p-8 animate-fade-in space-y-6">
                  <div className="flex justify-between items-start gap-4 border-b border-[#1a1a1a]/5 dark:border-white/5 pb-4">
                    <div>
                      <span className="text-[10px] bg-[#d4af37]/20 text-slate-800 dark:text-[#d4af37] uppercase font-mono px-2.5 py-0.5 rounded font-black tracking-widest border border-[#d4af37]/35 inline-block mb-2">
                        {activeDay.locationName || (language === 'ar' ? `اليوم ${activeDay.jour || activeDayIndex + 1}` : `Jour ${activeDay.jour || activeDayIndex + 1}`)}
                      </span>
                      <h5 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                        {activeDay.title || (language === 'ar' ? `أنشطة اليوم ${activeDay.jour || activeDayIndex + 1}` : `Programme du Jour ${activeDay.jour || activeDayIndex + 1}`)}
                      </h5>
                    </div>
                  </div>

                  {/* Morning */}
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-[#d4af37] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                      🌅
                    </span>
                    <div>
                      <p className="text-xs uppercase font-mono font-black text-gray-400 tracking-wider">
                        {language === 'ar' ? 'الصباح والاستكشاف' : 'Matinée'}
                      </p>
                      <p className="text-xs text-slate-700 dark:text-gray-300 mt-1 leading-relaxed">
                        {activeDay.matin || activeDay.morning}
                      </p>
                    </div>
                  </div>

                  {/* Lunch / Déjeuner */}
                  {(activeDay.dejeuner || activeDay.afternoon) && (
                    <div className="flex gap-4">
                      <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                        🍽️
                      </span>
                      <div>
                        <p className="text-xs uppercase font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                          {language === 'ar' ? 'الغداء والتذوق المحلي' : 'Déjeuner & Spécialité Locale'}
                        </p>
                        <p className="text-xs text-slate-700 dark:text-gray-300 mt-1 leading-relaxed">
                          {activeDay.dejeuner || activeDay.afternoon}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Afternoon */}
                  {activeDay.apres_midi && (
                    <div className="flex gap-4">
                      <span className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                        ☀️
                      </span>
                      <div>
                        <p className="text-xs uppercase font-mono font-black text-gray-400 tracking-wider">
                          {language === 'ar' ? 'بعد الظهر' : 'Après-midi'}
                        </p>
                        <p className="text-xs text-slate-700 dark:text-gray-300 mt-1 leading-relaxed">
                          {activeDay.apres_midi}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Evening / Café */}
                  {(activeDay.evening || activeDay.cafe) && (
                    <div className="flex gap-4">
                      <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                        ☕
                      </span>
                      <div>
                        <p className="text-xs uppercase font-mono font-black text-gray-400 tracking-wider">
                          {language === 'ar' ? 'المساء والاستراحة / Café' : 'Soir & Pause Café'}
                        </p>
                        <p className="text-xs text-slate-700 dark:text-gray-300 mt-1 leading-relaxed">
                          {activeDay.cafe || activeDay.evening}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hotel / Hébergement */}
                  {activeDay.hebergement && (
                    <div className="flex gap-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                      <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                        🏨
                      </span>
                      <div>
                        <p className="text-xs uppercase font-mono font-black text-amber-700 dark:text-amber-400 tracking-wider">
                          {language === 'ar' ? 'الإقامة الموصى بها' : 'Hébergement du soir'}
                        </p>
                        <p className="text-xs text-slate-700 dark:text-gray-300 mt-1 font-semibold">
                          {activeDay.hebergement}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Practical Advice & Bonus Section */}
              {(currentPlan.conseils_pratiques || currentPlan.bonus) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#1a1a1a]/10 dark:border-white/10">
                  {currentPlan.conseils_pratiques && (
                    <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-black uppercase">
                        <Info size={14} />
                        <span>{language === 'ar' ? 'نصائح ومعلومات عملية' : 'Conseils Pratiques & Logistique'}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                        {currentPlan.conseils_pratiques}
                      </p>
                    </div>
                  )}

                  {currentPlan.bonus && (
                    <div className="p-5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300 font-mono text-xs font-black uppercase">
                        <Sparkles size={14} />
                        <span>{language === 'ar' ? 'تجربة استثنائية (Bonus)' : 'Expérience "Hors des sentiers battus"'}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-gray-300 italic leading-relaxed">
                        {currentPlan.bonus}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <SocialShare 
                title={currentTitle || 'RAHLA Travel Guide'}
                text={language === 'ar'
                  ? `شاهد مساري السياحي المخصص في الجزائر: ${currentTitle} المولد بالذكاء الاصطناعي مع RAHLA! 🇩🇿`
                  : `Check out my custom Algeria travel plan: ${currentTitle} generated by RAHLA AI! 🇩🇿✈️`}
                url={window.location.origin + '/#/ai-guide'}
                language={language}
                handleDownloadPDF={handleDownloadPDF}
                addNotification={addNotification}
              />

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
                    onClick={() => {
                      addNotification(language === 'ar' ? 'جاري توجيهك لصفحة الدفع لتأكيد حجز رحلتك المتكاملة...' : 'Redirecting to checkout & billing to secure your booking...');
                      setTimeout(() => {
                        window.location.hash = '#/billing';
                      }, 1000);
                    }}
                    className="flex-1 sm:flex-auto px-8 py-3 bg-[#1a1a1a] dark:bg-[#f5f2ed] text-[#f5f2ed] dark:text-[#1a1a1a] font-mono text-xs font-black uppercase tracking-widest hover:bg-[#d4af37] dark:hover:bg-[#d4af37] hover:text-black transition rounded-xl shadow-lg border border-[#d4af37] cursor-pointer"
                  >
                    {language === 'ar' ? 'احجز رحلتك الآن' : 'Book Your Odyssey Now'}
                  </button>
                </div>
              </div>

            </div>

          </div>
        );
      })()}

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
                  {labels.budgetTitle[language] || labels.budgetTitle['en']}
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
                  {labels.styleTitle[language] || labels.styleTitle['en']}
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
                  {labels.preferenceTitle[language] || labels.preferenceTitle['en']}
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
                  {labels.durationTitle[language] || labels.durationTitle['en']}
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
                  {labels.companionTitle[language] || labels.companionTitle['en']}
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
                <span>{labels.buttonPrev[language] || labels.buttonPrev['en']}</span>
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
                <span>{labels.buttonNext[language] || labels.buttonNext['en']}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={generateItinerary}
                className="flex items-center gap-1.5 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-750 hover:bg-emerald-750 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition shadow-lg hover:from-emerald-750 hover:to-emerald-850 active:scale-95 cursor-pointer border border-emerald-500"
              >
                <Sparkles size={14} className="animate-pulse" />
                <span>{labels.buttonGenerate[language] || labels.buttonGenerate['en']}</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* SHARING MODAL OVERLAY */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => setShowShareModal(false)}>
          <div 
            className="w-full max-w-md bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-[#d4af37]" />
                <h3 className="text-lg font-serif font-black text-gray-900 dark:text-white">
                  {language === 'ar' ? 'مشاركة مسار الرحلة' : "Partager l'itinéraire"}
                </h3>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'ar' 
                ? 'اختر منصة التواصل الاجتماعي المفضلة لديك لمشاركة تفاصيل رحلتك المذهلة في الجزائر:' 
                : 'Choisissez votre réseau social préféré pour partager les détails de votre magnifique voyage en Algérie :'}
            </p>

            {/* Social Channels Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + "\n" + shareData.url)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  WA
                </span>
                <span>WhatsApp</span>
              </a>

              {/* Facebook */}
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                <Facebook size={18} className="text-blue-500 shrink-0" />
                <span>Facebook</span>
              </a>

              {/* Twitter / X */}
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-500/10 hover:bg-zinc-500/20 border border-zinc-500/20 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                <Twitter size={18} className="text-zinc-700 dark:text-zinc-300 shrink-0" />
                <span>Twitter / X</span>
              </a>

              {/* LinkedIn */}
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-sky-600/10 hover:bg-sky-600/20 border border-sky-600/20 text-sky-700 dark:text-sky-400 font-mono text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                <Linkedin size={18} className="text-sky-600 shrink-0" />
                <span>LinkedIn</span>
              </a>

              {/* Telegram */}
              <a 
                href={`https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-black shrink-0">
                  TG
                </span>
                <span>Telegram</span>
              </a>

              {/* Email */}
              <a 
                href={`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + "\n\n" + shareData.url)}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400 font-mono text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                <Mail size={18} className="text-red-500 shrink-0" />
                <span>Email</span>
              </a>
            </div>

            {/* Premium PDF Download option inside Share Modal */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  handleDownloadPDF();
                }}
                className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-600/10 hover:from-amber-500/20 hover:to-yellow-600/20 border border-[#d4af37]/35 text-amber-700 dark:text-amber-300 font-mono text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                <Download size={16} className="text-[#d4af37]" />
                <span>
                  {language === 'ar' ? 'تحميل كتيب الرحلة كـ PDF متميز' : 'Télécharger l\'itinéraire en PDF Premium'}
                </span>
              </button>
            </div>

            {/* Link Copy Field */}
            <div className="space-y-2 pt-2">
              <span className="block text-[10px] uppercase font-mono font-bold text-gray-400 dark:text-gray-500">
                {language === 'ar' ? 'رابط المشاركة المباشر' : 'Lien de partage direct'}
              </span>
              <div className="flex gap-2 bg-slate-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 items-center">
                <input 
                  type="text" 
                  readOnly 
                  value={shareData.url}
                  className="flex-1 bg-transparent border-none text-xs font-mono font-bold text-gray-600 dark:text-gray-400 focus:ring-0 outline-none select-all overflow-ellipsis whitespace-nowrap"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareData.url);
                    addNotification(language === 'ar' ? '📋 تم نسخ الرابط بنجاح!' : '📋 Link copied to clipboard!');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-mono text-[10px] font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                >
                  <Copy size={12} />
                  <span>{language === 'ar' ? 'نسخ' : 'Copier'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
