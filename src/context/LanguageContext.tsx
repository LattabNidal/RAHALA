import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
}

export const translations: Translations = {
  appName: {
    en: 'RAHALA',
    fr: 'RAHALA',
    ar: 'رحالة',
    es: 'RAHALA'
  },
  tagline: {
    en: 'DISCOVER ALGERIA DIFFERENTLY',
    fr: "DÉCOUVREZ L'ALGÉRIE AUTREMENT",
    ar: 'اكتشف الجزائر بطريقة أخرى',
    es: 'DESCUBRE ARGELIA DIFERENTEMENTE'
  },
  navExplore: {
    en: 'Virtual Explorer',
    fr: 'Explorateur Virtuel',
    ar: 'المستكشف الافتراضي',
    es: 'Explorador Virtual'
  },
  navDigitalTwin: {
    en: 'Digital Twin Tours',
    fr: 'Jumeau Numérique 3D',
    ar: 'الجولات التوأمية ثلاثية الأبعاد',
    es: 'Tours Digital Twin'
  },
  navInteractiveMap: {
    en: 'Algeria Map',
    fr: 'Carte interactive',
    ar: 'خريطة الجزائر التفاعلية',
    es: 'Mapa Argelia'
  },
  navHotels: {
    en: 'Stays & Hotels',
    fr: 'Séjours & Hôtels',
    ar: 'حجوزات الفنادق',
    es: 'Hospedajes'
  },
  navTaxis: {
    en: 'Taxi Dispatch',
    fr: 'Réserver Chauffeur',
    ar: 'طلب سائق تاكسي',
    es: 'Llamar Taxi'
  },
  navAIGuide: {
    en: 'AI Local Guide',
    fr: 'Guide IA Local',
    ar: 'المرشد الذكي للرحلة',
    es: 'Guía de IA Local'
  },
  navDashboard: {
    en: 'My Dashboard',
    fr: 'Espace Perso',
    ar: 'لوحة التحكم الخاصة بي',
    es: 'Mi Panel'
  },
  navSafeTravel: {
    en: '🛡️ Safe Travel',
    fr: '🛡️ Voyage Sûr',
    ar: '🛡️ سفر آمن',
    es: '🛡️ Viaje Seguro'
  },
  navBilling: {
    en: 'Payments & VIP',
    fr: 'Paiement & Abonnements',
    ar: 'الدفع والاشتراكات 💳',
    es: 'Pagos y Abonos'
  },
  navSocial: {
    en: 'Social Club 📸',
    fr: 'Social Club 📸',
    ar: 'النادي الإجتماعي 📸',
    es: 'Social Club 📸'
  },
  navAdmin: {
    en: 'Admin Control',
    fr: 'Gestion Admin',
    ar: 'إدارة النظام',
    es: 'Control Admin'
  },
  subFree: {
    en: 'Standard Access',
    fr: 'Accès Standard',
    ar: 'العضوية المجانية',
    es: 'Acceso Estándar'
  },
  subPremium: {
    en: 'Premium VIP Club',
    fr: 'Club VIP Premium',
    ar: 'عضوية رحالة الذهبية VIP',
    es: 'Plan Premium VIP'
  },
  languageName: {
    en: 'English 🇬🇧',
    fr: 'Français 🇫🇷',
    ar: 'العربية 🇩🇿',
    es: 'Español 🇪🇸'
  },
  welcomeMessage: {
    en: 'Unveil the Wonders of Algeria',
    fr: 'Découvrez les Merveilles de l’Algérie',
    ar: 'اكتشف روائع ومخبوءات الجزائر العظيمة',
    es: 'Descubre las Maravillas de Argelia'
  },
  welcomeSubtitle: {
    en: 'From the alleys of Algiers Casbah to the towering mountains of Constantine and the golden horizons of Sahara, explore Algerian heritage with immersive 3D twins, live smart AI guidance, and integrated travel bookings.',
    fr: "Des ruelles de la Casbah d'Alger aux ponts suspendus de Constantine et aux horizons dorés du Sahara, explorez notre patrimoine avec des jumeaux numériques 3D, un guide IA de pointe et des réservations simplifiées.",
    ar: 'من أزقة القصبة العتيقة بالجزائر العاصمة، إلى جسور قسنطينة المعلقة في الأعالي، ورمال جانت الذهبية الخلابة؛ استكشف تاريخنا بالتوأم الرقمي، مرشد الذكاء الاصطناعي الفتاك، وحجوزات السفر المتكاملة.',
    es: 'Desde los callejones de la Casbah de Argel hasta los puentes colgantes de Constantina y las dunas del Sahara.'
  },
  twinTitle: {
    en: 'Algerian Landmark Digital Twins',
    fr: 'Jumeau Numérique du Patrimoine',
    ar: 'التوأم الرقمي للمعالم الأثرية',
    es: 'Patrimonio Digital Twin'
  },
  twinSubtitle: {
    en: 'Immersive virtual tours powered by detailed 360-degree panoramas, historic data sheets, and spatial audio feedback.',
    fr: 'Visites virtuelles immersives enrichies de panoramas à 360 degrés, de fiches datées exclusives et d’ambiances sonores.',
    ar: 'جولات تفاعلية غامرة تدعمها لوحات بانورامية ٣٦٠ درجة، وقواعد بيانات تاريخية دقيقة مع تغذية صوتية ثلاثية الأبعاد.',
    es: 'Visitas virtuales inmersivas enriquecidas con panoramas de 360 grados y fichas históricas.'
  },
  landmarkCategory: {
    en: 'Category',
    fr: 'Catégorie',
    ar: 'التصنيف',
    es: 'Categoría'
  },
  rating: {
    en: 'Rating',
    fr: 'Note globale',
    ar: 'التقييم العام',
    es: 'Valoración'
  },
  exploreBtn: {
    en: 'Enter 3D Digital Twin',
    fr: 'Entrer dans le Jumeau 3D',
    ar: 'دخول التوأم الرقمي ثلاثي الأبعاد',
    es: 'Entrar en el J Twin'
  },
  closeBtn: {
    en: 'Exit Tour',
    fr: 'Quitter la visite',
    ar: 'الخروج من الجولة',
    es: 'Salir de la Vista'
  },
  chatWithAI: {
    en: 'Ask our AI Tour Guide about this historic place...',
    fr: 'Interrogez notre guide IA sur ce site historique...',
    ar: 'اسأل مرشدنا السياحي الذكي عن تاريخ هذا المعلم الفخم...',
    es: 'Pregúntale a nuestro Guía de IA sobre este sitio...'
  },
  twinHotspot: {
    en: 'Look Around & Discover Details',
    fr: 'Explorez et Découvrez les détails',
    ar: 'تفحص التفاصيل واكتشف محيط المعلم الأثري',
    es: 'Explore y descubra los detalles'
  },
  quickFacts: {
    en: 'Heritage Chronicle Logs',
    fr: 'Chroniques du Patrimoine',
    ar: 'سجلات المخطوطات والوقائع التاريخية',
    es: 'Crónicas de la Historia'
  },
  mapTitle: {
    en: 'Algeria Comprehensive Tourist Map Room',
    fr: 'Plan Touristique Interactif d’Algérie',
    ar: 'غرفة خرائط الجزائر السياحية الشاملة',
    es: 'Plataforma de Mapas de Argelia'
  },
  mapSubtitle: {
    en: 'Locate monuments, pinpoint surrounding stays/hotels, watch real-time taxi tracking corridors, and calculate DZD transit pricing.',
    fr: 'Monuments, hébergements à proximité, suivi de taxi en temps réel et estimation des itinéraires.',
    ar: 'حدد مواقع الآثار ومستويات الفنادق المحيطة بها، مع رصد مسارات سيارات الأجرة وتقدير كلفة النقل بالدينار الجزائري.',
    es: 'Ubicación de monumentos, hoteles y taxis cercanos con estimaciones de precios de tránsito.'
  },
  markerMonument: {
    en: 'Monument Landmark',
    fr: 'Site Touristique',
    ar: 'معلم أثري رئيسي',
    es: 'Punto Turístico'
  },
  markerHotel: {
    en: 'Stays & Hotels',
    fr: 'Option d’Hôtel',
    ar: 'فندق إقامة مفضل',
    es: 'Hôtel'
  },
  hotelTitle: {
    en: 'Hotel Selection & Booking Portal',
    fr: 'Hôtels & Réservation Séjour',
    ar: 'بوابة اختيار وتأكيد حجوزات الفنادق',
    es: 'Reserva de Hoteles de Argelia'
  },
  hotelSubtitle: {
    en: 'Book premium high-end retreats in Algeria with secure date pickers, price calculation in DZD/USD, and official invoice generation.',
    fr: 'Réservez des séjours haut de gamme avec tarification claire en Dinar Algérien DZD et reçus certifiés.',
    ar: 'احجز أماكن المبيت المفضلة لديك بالدينار الجزائري مع حساب دقيق لعدد الليالي وإنشاء الفاتورة المالية فوراً.',
    es: 'Reserve estancias con tarifas claras y facturación certificada.'
  },
  checkoutSuccess: {
    en: 'Booking Placed and Paid Successfully!',
    fr: 'Réservation Enregistrée et Payée avec Succès !',
    ar: 'تم تسجيل وتفعيل الحجز المالي ودفع القيمة بنجاح!',
    es: '¡Reserva Registrada y Pagada con Éxito!'
  },
  invoiceBtn: {
    en: 'Download Official Invoice',
    fr: 'Télécharger la Facture Officielle',
    ar: 'تحميل الفاتورة المالية المعتمدة كـ PDF',
    es: 'Descargar Factura Oficial'
  },
  taxiTitle: {
    en: 'Elite Algerian Taxi Dispatch',
    fr: 'Centrale de Transport Inter-villes',
    ar: '🚕 بوابة التنقل الذكي وحجز الرحلات',
    es: 'Servicio de Despacho de Taxi'
  },
  taxiSubtitle: {
    en: 'Estimate city-to-landmark trips inside Algeria, dispatch designated vetted local drivers, and track simulated vehicle courses.',
    fr: 'Estimez vos trajets urbains, générez un chauffeur agréé Rihla DZ et observez l’avancée sur la carte.',
    ar: 'احجز تنقلاتك بسهولة واستمتع بتجربة سفر ذكية وآمنة',
    es: 'Estime sus viajes interurbanos, asigne un conductor verificado de Rihla DZ y realice el seguimiento en tiempo real.'
  },
  aiGuideTitle: {
    en: 'Rihla local intelligent companion',
    fr: 'Rihla Compagnon Touristique IA',
    ar: 'مرشد الرحلة الذكي والناصح الأمين',
    es: 'Rihla DZ Guía Inteligente'
  },
  aiGuideSubtitle: {
    en: 'A server-side generative artificial intelligence powered by Gemini 3.5, holding complete wisdom of Algerian culture, ancient history, dining spots, and local transport advice.',
    fr: 'Une intelligence artificielle générative propulsée par Gemini 3.5, experte en histoire, gastronomie et secrets de voyage en Algérie.',
    ar: 'نظام ذكاء اصطناعي متكامل يعمل عبر معالجات جيميناي ٣.٥ السحابية لمساعدتك في فهم ثقافة، طبخ، وتاريخ مدن الجزائر الفاخرة.',
    es: 'Una inteligencia artificial generativa impulsada por Gemini 3.5 para guiarle sobre la historia y comida argelina.'
  },
  subTitle: {
    en: 'Rihla Premium Membership Passes',
    fr: 'Abonnements Premium Rihla DZ',
    ar: 'بطاقات وعضويات السفر الفاخرة لـ رحلة',
    es: 'Planes de Membresía Premium'
  },
  subSubtitle: {
    en: 'Unlock flawless high-fidelity 3D digital tours, unlimited server-side Gemini AI consultations, promotional hotel vouchers, and premium taxi priorities.',
    fr: 'Débloquez les visites jumeaux numériques HD, les requêtes IA illimitées et des priorités de navettes.',
    ar: 'افتح الجولات الافتراضية عالية الدقة بالكامل، واستشارات غير محدودة من معالجات الذكاء الاصطناعي، وخصومات الفنادق.',
    es: 'Desbloquee recorridos virtuales de alta fidelidad, consultas ilimitadas con la IA y prioridades de taxis.'
  },
  dashboardTitle: {
    en: 'My Personal Travel Hub',
    fr: 'Tableau de bord de Voyage',
    ar: 'رواق رحلاتي وبوابتي الشخصية ورصيد رحلة',
    es: 'Panel de Viajes de Rihla'
  },
  dashboardSubtitle: {
    en: 'Monitor room bookings, upcoming taxi courses, premium status clearances, invoice histories, and bookmarked landmarks.',
    fr: 'Suivi de vos réservations d’hôtels, trajets planifiés, abonnements et favoris.',
    ar: 'راقب حالة حجز فندقك، وحجوزات التاكسي النشطة، وتفاصيل عضويتك الذهبية والتاريخ المالي لفواتيرك.',
    es: 'Seguimiento de sus reservas de hoteles, taxis, membresía y favoritos.'
  },
  adminTitle: {
    en: 'Rihla Regional Tourism Admin Board',
    fr: 'Console de Contrôle Algérien Rihla DZ',
    ar: 'مجلس إدارة شؤون السياحة الجزائرية الشاملة',
    es: 'Consola de Control de Turismo Rihla DZ'
  },
  adminSubtitle: {
    en: 'Real-time performance audits: tracking subscriber conversion matrices, ongoing stays, and total collected tourist DZD flows.',
    fr: 'Analyses financières, suivi des réservations et des nouveaux inscrits VIP.',
    ar: 'تدقيق الأداء في وقت حقيقي: مراقبة نسب المشتركين الذهبيين، إجمالي الدخل بالدينار الجزائري ومستويات الاستجابة.',
    es: 'Análisis financieros, seguimiento de reservas y nuevos suscriptores VIP.'
  },
  commencer: {
    en: 'Get Started',
    fr: 'Commencer',
    ar: 'ابدأ الرحلة',
    es: 'Comenzar'
  },
  seConnecter: {
    en: 'Login',
    fr: 'Se Connecter',
    ar: 'تسجيل الدخول',
    es: 'Iniciar Sesión'
  },
  creerCompte: {
    en: 'Register',
    fr: 'Créer un Compte',
    ar: 'إنشاء حساب جديد',
    es: 'Registrarse'
  },
  adresseMail: {
    en: 'Email Address',
    fr: 'Adresse Email',
    ar: 'البريد الإلكتروني',
    es: 'Correo Electrónico'
  },
  motDePasse: {
    en: 'Password',
    fr: 'Mot de passe',
    ar: 'كلمة المرور',
    es: 'Contraseña'
  },
  confirmPass: {
    en: 'Confirm Password',
    fr: 'Confirmer le mot de passe',
    ar: 'تأكيد كلمة المرور',
    es: 'Confirmar Contraseña'
  },
  nomComplet: {
    en: 'Full Name',
    fr: 'Nom complet',
    ar: 'الاسم الكامل',
    es: 'Nombre Completo'
  },
  retour: {
    en: 'Back',
    fr: 'Retour',
    ar: 'رجوع',
    es: 'Volver'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('rihla_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rihla_lang', lang);
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    // Inject dir rtl to html index layout for true native Arabic styling flow
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]['en'];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      <div className={isRtl ? 'text-right' : 'text-left'}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
