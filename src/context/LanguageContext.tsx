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
  navRealPhotos: {
    en: 'Real Photos 📸',
    fr: 'Photos Réelles 📸',
    ar: 'الصور الحقيقية 📸',
    es: 'Fotos Reales 📸'
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
  filterMonuments: {
    en: 'Monuments',
    fr: 'Monuments',
    ar: 'المعالم الأثرية',
    es: 'Monumentos'
  },
  filterBeaches: {
    en: 'Beaches',
    fr: 'Plages',
    ar: 'الشواطئ',
    es: 'Playas'
  },
  filterHotels: {
    en: 'Hotels',
    fr: 'Hôtels',
    ar: 'الفنادق',
    es: 'Hoteles'
  },
  filterRestaurants: {
    en: 'Restaurants',
    fr: 'Restaurants',
    ar: 'المطاعم',
    es: 'Restaurantes'
  },
  filterAll: {
    en: 'All Categories',
    fr: 'Toutes Catégories',
    ar: 'جميع التصنيفات',
    es: 'Todas las Categorías'
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
  },
  assistantSub: {
    en: 'Intelligent Travel Assistant 🇩🇿',
    fr: 'Assistant Intelligent de Voyage 🇩🇿',
    ar: 'مساعد السفر الذكي 🇩🇿',
    es: 'Asistente Inteligente de Viaje 🇩🇿'
  },
  verifying: {
    en: 'Verifying...',
    fr: 'Vérification en cours...',
    ar: 'جاري التحقق...',
    es: 'Verificando...'
  },
  loginTab: {
    en: 'Login 🔑',
    fr: 'Connexion 🔑',
    ar: 'تسجيل الدخول 🔑',
    es: 'Conectarse 🔑'
  },
  registerTab: {
    en: 'Register 📝',
    fr: 'Inscription 📝',
    ar: 'إنشاء حساب 📝',
    es: 'Registrarse 📝'
  },
  mainMenu: {
    en: 'Main Menu',
    fr: 'Menu Principal',
    ar: 'القائمة الرئيسية',
    es: 'Menú Principal'
  },
  secureAccess: {
    en: 'Secure Access',
    fr: 'Accès Sécurisé',
    ar: 'ولوج آمن',
    es: 'Acceso Seguro'
  },
  quickSelection: {
    en: 'Quick Selection:',
    fr: 'Sélection Rapide :',
    ar: 'اختيار سريع:',
    es: 'Selección Rápida:'
  },
  travelerRole: {
    en: 'Traveler 👤',
    fr: 'Voyageur 👤',
    ar: 'مسافر 👤',
    es: 'Viajero 👤'
  },
  adminRole: {
    en: 'Admin 👨‍💼',
    fr: 'Admin 👨‍💼',
    ar: 'إدارة 👨‍💼',
    es: 'Admin 👨‍💼'
  },
  emailPlaceholder: {
    en: 'admin@rahala.com or your email',
    fr: 'admin@rahala.com ou votre email',
    ar: 'admin@rahala.com أو بريدك الإلكتروني',
    es: 'admin@rahala.com o su correo'
  },
  passwordPlaceholder: {
    en: 'Enter your password',
    fr: 'Saisissez votre mot de passe',
    ar: 'أدخل كلمة المرور الخاصة بك',
    es: 'Introduzca su contraseña'
  },
  loginBtn: {
    en: 'Login 🔑',
    fr: 'Se connecter 🔑',
    ar: 'تسجيل الدخول 🔑',
    es: 'Iniciar sesión 🔑'
  },
  noAccount: {
    en: 'No account? ',
    fr: 'Pas de compte ? ',
    ar: 'ليس لديك حساب؟ ',
    es: '¿No tiene cuenta? '
  },
  signupBtn: {
    en: 'Register 📝',
    fr: "S'inscrire 📝",
    ar: 'تسجيل 📝',
    es: 'Registrarse 📝'
  },
  demoAccountsHint: {
    en: 'Linked to the test accounts below to simplify evaluation.',
    fr: 'Rattaché aux comptes de test ci-dessous pour simplifier l\'évaluation.',
    ar: 'مرتبط بحسابات التجربة أدناه لتسهيل التقييم.',
    es: 'Vinculado a las cuentas de prueba a continuación para simplificar la evaluación.'
  },
  guestModeBtn: {
    en: 'Continue as guest 👀',
    fr: 'Continuer sans compte (mode invité) 👀',
    ar: 'المتابعة كزائر 👀',
    es: 'Continuar como invitado 👀'
  },
  fullNameLabel: {
    en: 'Full Name 👤',
    fr: 'Nom complet 👤',
    ar: 'الاسم الكامل 👤',
    es: 'Nombre completo 👤'
  },
  fullNamePlaceholder: {
    en: 'e.g. Nidal Lattab',
    fr: 'Ex. Nidal Lattab',
    ar: 'مثال: نضال العطاب',
    es: 'Ej. Nidal Lattab'
  },
  emailLabel: {
    en: 'Email 📧',
    fr: 'Email 📧',
    ar: 'البريد الإلكتروني 📧',
    es: 'Correo electrónico 📧'
  },
  emailRegPlaceholder: {
    en: 'e.g. nidal@rahla.dz',
    fr: 'Ex. nidal@rahla.dz',
    ar: 'مثال: nidal@rahla.dz',
    es: 'Ej. nidal@rahla.dz'
  },
  passwordLabel: {
    en: 'Password 🔒',
    fr: 'Mot de passe 🔒',
    ar: 'كلمة المرور 🔒',
    es: 'Contraseña 🔒'
  },
  passwordRegPlaceholder: {
    en: 'Secure password',
    fr: 'Mot de passe sécurisé',
    ar: 'كلمة مرور آمنة',
    es: 'Contraseña segura'
  },
  confirmPasswordLabel: {
    en: 'Confirm Password 🔒',
    fr: 'Confirmation mot de passe 🔒',
    ar: 'تأكيد كلمة المرور 🔒',
    es: 'Confirmar contraseña 🔒'
  },
  confirmPasswordPlaceholder: {
    en: 'Confirm your password',
    fr: 'Confirmez votre mot de passe',
    ar: 'أكد كلمة المرور الخاصة بك',
    es: 'Confirme su contraseña'
  },
  accountTypeLabel: {
    en: 'Account Type',
    fr: 'Type de compte',
    ar: 'نوع الحساب',
    es: 'Tipo de cuenta'
  },
  userTypeBtn: {
    en: 'User 👤',
    fr: 'Utilisateur 👤',
    ar: 'مستخدم 👤',
    es: 'Usuario 👤'
  },
  adminTypeBtn: {
    en: 'Admin 👨‍💼',
    fr: 'Admin 👨‍💼',
    ar: 'إدارة 👨‍💼',
    es: 'Administrador 👨‍💼'
  },
  adminCodeLabel: {
    en: 'Admin code required',
    fr: 'Code administrateur requis',
    ar: 'مطلوب رمز الإدارة',
    es: 'Código de administrador requerido'
  },
  adminCodePlaceholder: {
    en: 'e.g. RAHLA2025',
    fr: 'Ex: RAHLA2025',
    ar: 'مثال: RAHLA2025',
    es: 'Ej: RAHLA2025'
  },
  createAccountBtn: {
    en: 'Create account 🌍',
    fr: 'Créer mon compte 🌍',
    ar: 'إنشاء حسابي 🌍',
    es: 'Crear mi cuenta 🌍'
  },
  alreadyHaveAccount: {
    en: 'Already have an account? ',
    fr: 'Déjà un compte ? ',
    ar: 'لديك حساب بالفعل؟ ',
    es: '¿Ya tiene una cuenta? '
  },
  showTestAccountsBtn: {
    en: '[+ SHOW TEST ACCOUNTS]',
    fr: '[+ COMPTES DE TEST DISPONIBLES]',
    ar: '[+ إظهار حسابات التجربة المتاحة]',
    es: '[+ VER CUENTAS DE PRUEBA]'
  },
  hideTestAccountsBtn: {
    en: '[- CLOSE EXPLORER]',
    fr: '[- FERMER L’EXPLORATEUR]',
    ar: '[- إغلاق مستكشف الحسابات]',
    es: '[- CERRAR EXPLORADOR]'
  },
  demoCredentialsTitle: {
    en: 'Demo credentials for validation:',
    fr: 'Identifiants de démonstration pour validation :',
    ar: 'معلومات الدخول التجريبية للتقييم:',
    es: 'Credenciales de demostración para validación:'
  },
  demoAdminTitle: {
    en: '👨‍💼 Test Administrator:',
    fr: '👨‍💼 Administrateur de test :',
    ar: '👨‍💼 مسؤول النظام التجريبي:',
    es: '👨‍💼 Administrador de prueba:'
  },
  demoUserTitle: {
    en: '👤 Standard Traveler RAHLA:',
    fr: '👤 Voyageur Standard RAHLA :',
    ar: '👤 مسافر رحالة القياسي:',
    es: '👤 Viajero estándar de RAHLA:'
  },
  demoPremiumUserTitle: {
    en: '👤 Premium Traveler (Nidal):',
    fr: '👤 Voyageur Premium (Nidal) :',
    ar: '👤 مسافر ذهبي بريميوم (نضال):',
    es: '👤 Viajero Premium (Nidal):'
  },
  fillBtn: {
    en: 'Fill',
    fr: 'Remplir',
    ar: 'تعبئة تلقائية',
    es: 'Llenar'
  },
  adminCreationHint: {
    en: 'ℹ️ To create an Administrator from the Register tab, use code:',
    fr: 'ℹ️ Pour créer un Administrateur depuis l’onglet Inscription, utilisez le code :',
    ar: 'ℹ️ لإنشاء حساب إدارة من علامة التبويب التسجيل، استخدم الرمز:',
    es: 'ℹ️ Para crear un Administrador desde la pestaña Registro, use el código:'
  },
  errEmailRegistered: {
    en: 'This email is already registered.',
    fr: 'Cet email est déjà enregistré.',
    ar: 'هذا البريد الإلكتروني مسجل بالفعل.',
    es: 'Este correo ya está registrado.'
  },
  errAllFieldsRequired: {
    en: 'Please fill in all required fields ⚠️',
    fr: 'Veuillez remplir tous les champs requis ⚠️',
    ar: 'يرجى ملء جميع الحقول المطلوبة ⚠️',
    es: 'Por favor, complete todos los campos obligatorios ⚠️'
  },
  errPasswordsDoNotMatch: {
    en: 'Passwords do not match ⚠️',
    fr: 'Les mots de passe ne correspondent pas ⚠️',
    ar: 'كلمات المرور غير متطابقة ⚠️',
    es: 'Las contraseñas no coinciden ⚠️'
  },
  errIncorrectAdminCode: {
    en: '❌ Incorrect admin code. Admin access denied, reverting to User type.',
    fr: '❌ Code administrateur incorrect. Accès admin refusé, retour au type Utilisateur.',
    ar: '❌ رمز الإدارة غير صحيح. تم رفض صلاحية المسؤول والعودة لرتبة مستخدم.',
    es: '❌ Código de administrador incorrecto. Acceso denegado, volviendo al tipo de Usuario.'
  },
  errInvalidCredentials: {
    en: 'Incorrect email or password ❌',
    fr: 'Email ou mot de passe incorrect ❌',
    ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة ❌',
    es: 'Correo o contraseña incorrectos ❌'
  },
  successAccountCreated: {
    en: '🎉 Account created successfully! Please log in.',
    fr: '🎉 Compte créé avec succès ! Veuillez vous connecter.',
    ar: '🎉 تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.',
    es: '🎉 ¡Cuenta creada con éxito! Por favor inicie sesión.'
  },
  welcomeBackUser: {
    en: 'Glad to see you again, ',
    fr: 'Heureux de vous revoir, ',
    ar: 'سعداء برؤيتك مجدداً يا ',
    es: '¡Qué bueno verte de nuevo, '
  },
  welcomeGuest: {
    en: 'Welcome to RAHLA in Guest Mode (Limited Access)!',
    fr: 'Bienvenue sur RAHLA en mode Invité (Accès limité) !',
    ar: 'مرحباً بك في رحالة كزائر (ولوج محدود)!',
    es: '¡Bienvenido a RAHLA en Modo Invitado (Acceso limitado)!'
  },
  promoTvLabel: {
    en: 'Rahala TV / Promo',
    fr: 'Rahala TV / Promo',
    ar: 'تلفزيون رحالة / ترويجي',
    es: 'Rahala TV / Promo'
  },
  promoTitle: {
    en: "Algeria like you have never seen it.",
    fr: "L'Algérie comme vous ne l'avez jamais vue.",
    ar: "الجزائر كما لم ترها من قبل.",
    es: "Argelia como nunca la ha visto."
  },
  promoSubtitle: {
    en: "Explore the rolling dunes of the great Tassili, follow the footsteps of our Touareg traveler connected to his RAHALA AI guide, and dive into the heart of Numidian and Roman history. An original immersive production.",
    fr: "Explorez les dunes ondoyantes du grand Tassili, suivez les pas de notre voyageur Touareg connecté à son guide RAHALA AI, et plongez au cœur de l'histoire numide et romaine. Une production immersive originale.",
    ar: "استكشف الكثبان الرملية المتموجة في الطاسيلي العظيم، وتتبع خطوات مسافرنا التارقي المتصل بمرشده الذكي RAHALA AI، واغطس في أعماق التاريخ النوميدي والروماني. إنتاج أصلي غامر.",
    es: "Explore las dunas onduladas del gran Tassili, siga los pasos de nuestro viajero tuareg conectado a su guía RAHALA AI y sumérjase en el corazón de la historia numidia y romana. Una producción inmersiva original."
  },
  didYouKnow: {
    en: "Did you know?",
    fr: "Le saviez-vous ?",
    ar: "هل تعلم؟",
    es: "¿Sabía que?"
  },
  didYouKnowText: {
    en: "The traveler in blue shown in the video uses the instant assistant RAHALA to navigate the Casbah of Algiers and the mystical corners of the southern Sahara.",
    fr: "Le voyageur en bleu représenté dans la vidéo utilise l'assistant instantané RAHALA pour naviguer la Casbah d'Alger et les recoins mystiques du Sahara méridional.",
    ar: "المسافر بالزي الأزرق في الفيديو يستخدم مساعد رحالة الفوري للتنقل في قصبة الجزائر العاصمة والأركان الروحانية للصحراء الجنوبية.",
    es: "El viajero de azul que se muestra en el video utiliza el asistente instantáneo RAHALA para recorrer la Casbah de Argel y los rincones místicos del Sahara meridional."
  },
  dragVideoPlaceholder: {
    en: "Drag your presentation video or the Trailer here",
    fr: "Glissez votre vidéo de présentation ou le Trailer ici",
    ar: "اسحب فيديو العرض الخاص بك أو الإعلان هنا",
    es: "Arrastre su video de presentación o el tráiler aquí"
  },
  videoActiveLabel: {
    en: "Active video: ",
    fr: "Vidéo active : ",
    ar: "الفيديو النشط: ",
    es: "Video activo: "
  },
  dragVideoSub: {
    en: "📥 Drag and drop the video file (.mp4) you just sent me!",
    fr: "📥 Glissez-déposez le fichier vidéo (.mp4) que vous venez de m'envoyer !",
    ar: "📥 اسحب وأسقط ملف الفيديو (.mp4) الذي أرسلته لي للتو!",
    es: "📥 ¡Arrastre y suelte el archivo de video (.mp4) que me acaba de enviar!"
  },
  clickToChangeVideo: {
    en: "Click to change video",
    fr: "Cliquez pour changer de vidéo",
    ar: "انقر لتغيير الفيديو",
    es: "Haga clic para cambiar de video"
  },
  indexedDbWarning: {
    en: "The player will save it securely locally (IndexedDB) so it works instantly offline.",
    fr: "Le lecteur l'enregistrera localement de manière sécurisée (IndexedDB) pour qu'elle fonctionne instantanément sans connexion.",
    ar: "سيقوم المشغل بحفظه محليًا بشكل آمن (IndexedDB) ليعمل على الفور بدون اتصال بالإنترنت.",
    es: "El reproductor lo guardará localmente de forma segura (IndexedDB) para que funcione instantáneamente sin conexión."
  },
  hideUrlFormBtn: {
    en: "Hide URL Form",
    fr: "Masquer formulaire URL",
    ar: "إخفاء نموذج الرابط",
    es: "Ocultar formulario de URL"
  },
  enterVideoUrlBtn: {
    en: "🔗 Enter a video URL",
    fr: "🔗 Saisir une URL vidéo",
    ar: "🔗 إدخال رابط فيديو",
    es: "🔗 Ingresar una URL de video"
  },
  resetVideoDefaultBtn: {
    en: "🔄 Reset to default video",
    fr: "🔄 Réinitialiser la vidéo par défaut",
    ar: "🔄 إعادة تعيين الفيديو الافتراضي",
    es: "🔄 Restablecer al video predeterminado"
  },
  streamingUrlLabel: {
    en: "Insert a direct streaming URL (.mp4, .webm):",
    fr: "Insérez une URL de streaming direct (.mp4, .webm) :",
    ar: "أدخل رابط البث المباشر للفيديو (.mp4, .webm):",
    es: "Inserte una URL de transmisión directa (.mp4, .webm):"
  },
  activateBtn: {
    en: "Activate",
    fr: "Activer",
    ar: "تفعيل",
    es: "Activar"
  },
  playbackGuideTitle: {
    en: "Rahala Trailer Playback Guide 🎬",
    fr: "Guide de lecture du Trailer Rahala 🎬",
    ar: "دليل تشغيل إعلان رحالة 🎬",
    es: "Guía de reproducción del tráiler de Rahala 🎬"
  },
  browserRestrictionsText: {
    en: "Your browser's security restrictions or AdBlocker extensions sometimes block access to external cloud streaming servers.",
    fr: "Les restrictions de sécurité de votre navigateur ou de vos extensions AdBlockers bloquent parfois l'accès aux serveurs de streaming cloud externes.",
    ar: "قد تحظر قيود أمان متصفحك أو إضافات مانع الإعلانات أحيانًا الوصول إلى خوادم البث السحابي الخارجية.",
    es: "Las restricciones de seguridad de su navegador o las extensiones de AdBlocker a veces bloquean el acceso a servidores externos de transmisión en la nube."
  },
  localLoadSuggestion: {
    en: "To watch the wonderful video you just sent me, download it to your device and then simply load it below!",
    fr: "Pour regarder la magnifique vidéo que vous viens de m'envoyer, téléchargez-la sur votre appareil puis chargez-la simplement ci-dessous !",
    ar: "لمشاهدة الفيديو الرائع الذي أرسلته لي للتو، قم بتنزيله على جهازك ثم قم بتحميله ببساطة أدناه!",
    es: "¡Para ver el maravilloso video que me acaba de enviar, descárguelo en su dispositivo y luego simplemente cárguelo a continuación!"
  },
  selectVideoFileBtn: {
    en: "📁 Select video file (.mp4)",
    fr: "📁 Sélectionner le fichier vidéo (.mp4)",
    ar: "📁 اختر ملف الفيديو (.mp4)",
    es: "📁 Seleccionar archivo de video (.mp4)"
  },
  muteActiveLabel: {
    en: "Mute active",
    fr: "Sourdine active",
    ar: "كتم الصوت مفعل",
    es: "Silencio activo"
  },
  optimizedExperienceLabel: {
    en: "Optimized experience based on your exclusive videos of the Casbah and Hoggar",
    fr: "Expérience optimisée d'après vos vidéos exclusives de la Casbah et du Hoggar",
    ar: "تجربة محسنة بناءً على مقاطع الفيديو الحصرية للقصبة والهقار",
    es: "Experiencia optimizada basada en sus videos exclusivos de la Casbah y Hoggar"
  },
  pauseBtnTitle: {
    en: "Pause",
    fr: "Mettre en pause",
    ar: "إيقاف مؤقت",
    es: "Pausar"
  },
  playBtnTitle: {
    en: "Play",
    fr: "Lancer la lecture",
    ar: "تشغيل",
    es: "Reproducir"
  },
  unmuteBtnTitle: {
    en: "Unmute",
    fr: "Activer le son",
    ar: "تفعيل الصوت",
    es: "Activar sonido"
  },
  muteBtnTitle: {
    en: "Mute",
    fr: "Couper le son",
    ar: "كتم الصوت",
    es: "Silenciar"
  },
  theaterFullscreenTitle: {
    en: "Theater Fullscreen",
    fr: "Plein écran théatral",
    ar: "شاشة كاملة مسرحية",
    es: "Pantalla completa teatral"
  },
  authSharePortal: {
    en: "Authentication & Sharing Portal",
    fr: "Portail d'Authentification & Partage",
    ar: "بوابة المشاركة والتحقق الرقمي",
    es: "Portal de Autenticación y Compartir"
  },
  sharePortalSubtitle: {
    en: "Authentication and synchronization options for your itinerary to ",
    fr: "Options d'authentification et de synchronisation pour votre itinéraire à ",
    ar: "خيارات المصادقة والمزامنة لمخطط رحلتك إلى ",
    es: "Opciones de autenticación y sincronización para su itinerario a "
  },
  certifiedSession: {
    en: "CERTIFIED TRAVEL SESSION",
    fr: "SESSION DE VOYAGE CERTIFIÉE",
    ar: "جلسة سفر معتمدة",
    es: "SESIÓN DE VIAJE CERTIFICADA"
  },
  activeLabel: {
    en: "Active",
    fr: "Actif",
    ar: "نشط",
    es: "Activo"
  },
  shareLinkLabel: {
    en: "Share Link",
    fr: "Lien de Partage",
    ar: "رابط المشاركة",
    es: "Enlace para Compartir"
  },
  shareLinkDescription: {
    en: "Copy the interactive itinerary link to share or open it instantly.",
    fr: "Copiez le lien de l'itinéraire interactif pour le partager ou l'ouvrir instantanément.",
    ar: "انسخ رابط المسار التفاعلي لمشاركته أو فتحه فورًا.",
    es: "Copie el enlace del itinerario interactivo para compartirlo o abrirlo al instante."
  },
  shareLabel: {
    en: "Share:",
    fr: "Partage :",
    ar: "مشاركة:",
    es: "Compartir:"
  },
  syncQrCode: {
    en: "Synchronization QR Code",
    fr: "Code QR de Synchronisation",
    ar: "رمز الاستجابة السريعة للمزامنة",
    es: "Código QR de Sincronización"
  },
  syncQrDescription: {
    en: "Scan with your mobile to synchronize and activate live GPS.",
    fr: "Scannez avec votre mobile pour synchroniser et activer le GPS en direct.",
    ar: "امسح الرمز بهاتفك لمزامنة وتفعيل نظام التوجيه الحي.",
    es: "Escanee con su móvil para sincronizar y activar el GPS en vivo."
  },
  scanSmartphone: {
    en: "SMARTPHONE SCAN",
    fr: "SCAN SMARTPHONE",
    ar: "مسح الهاتف الذكي",
    es: "ESCANEAR CON SMARTPHONE"
  },
  mobileAccessOptimized: {
    en: "Instant access optimized for mobile.",
    fr: "Accès instantané optimisé mobile.",
    ar: "وصول فوري محسن للهواتف.",
    es: "Acceso instantáneo optimizado para móviles."
  },
  pdfTravelGuide: {
    en: "PDF Travel Guide",
    fr: "Guide de Voyage PDF",
    ar: "دليل السفر بصيغة PDF",
    es: "Guía de Viaje en PDF"
  },
  pdfTravelDescription: {
    en: "Download a certified PDF folder including your bookings and safety token.",
    fr: "Téléchargez un dossier PDF certifié incluant vos réservations et votre jeton de sécurité.",
    ar: "قم بتنزيل ملف PDF معتمد يحتوي على حجوزاتك ورمز الأمان الخاص بك.",
    es: "Descargue una carpeta PDF certificada que incluya sus reservas y token de seguridad."
  },
  downloadPdfBtn: {
    en: "Download PDF",
    fr: "Télécharger le PDF",
    ar: "تحميل ملف PDF",
    es: "Descargar PDF"
  },
  withIntegratedToken: {
    en: "WITH INTEGRATED TOKEN",
    fr: "AVEC JETON INTÉGRÉ",
    ar: "مع رمز أمان مدمج",
    es: "CON TOKEN INTEGRADO"
  },
  uniqueCertificationRef: {
    en: "UNIQUE CERTIFICATION REFERENCE: ",
    fr: "RÉFÉRENCE DE CERTIFICATION UNIQUE : ",
    ar: "المرجع الفريد للمطابقة والتحقق: ",
    es: "REFERENCIA DE CERTIFICACIÓN ÚNICA: "
  },
  unifiedAuthenticationSystem: {
    en: "RAHLA UNIFIED DIGITAL VALIDATION SYSTEM",
    fr: "SYSTÈME D'AUTHENTICATION UNIFIÉ RAHLA",
    ar: "نظام التحقق الرقمي الموحد لرحالة RAHLA",
    es: "SISTEMA DE AUTENTICACIÓN UNIFICADO RAHLA"
  },
  itineraryLinkCopied: {
    en: "Direct itinerary link copied! 📋",
    fr: "Lien direct de l'itinéraire copié ! 📋",
    ar: "تم نسخ الرابط المباشر للمسار! 📋",
    es: "¡Enlace directo del itinerario copiado! 📋"
  },
  nextGenTourism: {
    en: "The New Era of Intelligent Tourism",
    fr: "La nouvelle ère du tourisme intelligent",
    ar: "الجيل القادم من السياحة الذكية",
    es: "La nueva era del turismo inteligente"
  },
  discoverCharms: {
    en: "Discover the charms of ",
    fr: "Découvrez le charme de l'",
    ar: "اكتشف سحر وجاذبية ",
    es: "Descubre el encanto de "
  },
  algeriaCountry: {
    en: "Algeria",
    fr: "Algérie",
    ar: "الجزائر",
    es: "Argelia"
  },
  launch3DExp: {
    en: "🚀 Launch 3D Experience",
    fr: "🚀 Lancer l'expérience 3D",
    ar: "🚀 إطلاق التجربة ثلاثية الأبعاد",
    es: "🚀 Lanzar Experiencia 3D"
  },
  openInteractiveMap: {
    en: "🗺️ Open Interactive Map",
    fr: "🗺️ Ouvrir la carte interactive",
    ar: "🗺️ افتح الخريطة التفاعلية",
    es: "🗺️ Abrir Mapa Interactivo"
  },
  corePillarsTitle: {
    en: "Core Pillars of Algeria Stays",
    fr: "Piliers fondateurs des séjours en Algérie",
    ar: "الركائز الأساسية للإقامة في الجزائر",
    es: "Pilares Esenciales de Estancia en Argelia"
  },
  corePillarsSubtitle: {
    en: "Immersive engineering from Casbah to Sahara oasis",
    fr: "Ingénierie immersive de la Casbah à l'oasis du Sahara",
    ar: "هندسة غامرة من القصبة العتيقة إلى واحات الصحراء",
    es: "Ingeniería inmersiva desde la Casbah hasta el oasis del Sahara"
  },
  pillar1Title: {
    en: "3D Digital Twin Gaze",
    fr: "Jumeau Numérique 3D",
    ar: "التوأم الرقمي ثلاثي الأبعاد",
    es: "Gemelo Digital 3D"
  },
  pillar1Desc: {
    en: "Immerse yourself inside high fidelity simulated 3D panoramas of Algiers Casbah, Trajan roman arches of Timgad, and Constantine cliff edges.",
    fr: "Immergez-vous dans des panoramas 3D simulés haute fidélité de la Casbah d’Alger, des arches romaines de Timgad et des falaises de Constantine.",
    ar: "احصل على جولات بانورامية ثلاثية الأبعاد مذهلة في قصبة الجزائر العاصمة، وأقواس تيمقاد الرومانية، وجروف قسنطينة.",
    es: "Sumérjase en panoramas 3D simulados de alta fidelidad de la Casbah de Argel, los arcos romanos de Timgad y las colinas de Constantina."
  },
  pillar1Cta: {
    en: "Go Virtual Twin →",
    fr: "Visiter le Jumeau Virtuel →",
    ar: "اذهب للتوأم الافتراضي ←",
    es: "Ir al Gemelo Virtual →"
  },
  pillar2Title: {
    en: "Gemini AI Local Guide",
    fr: "Guide Local IA Gemini",
    ar: "مرشد الذكاء الاصطناعي المحلي",
    es: "Guía Local de IA Gemini"
  },
  pillar2Desc: {
    en: "Query our live generative companion, structured on top of Gemini 3.5, holding wisdom of local languages, transport prices, and recipes.",
    fr: "Interrogez notre compagnon génératif basé sur Gemini 3.5, détenteur du savoir sur les langues locales, les prix des transports et les recettes.",
    ar: "استشر رفيقنا التوليدي المباشر المبني على Gemini 3.5، لمعرفة الأسعار المحلية والوصفات الشعبية ولغات البلد.",
    es: "Consulte a nuestro compañero generativo basado en Gemini 3.5, con conocimiento de idiomas locales, precios de transporte y recetas."
  },
  pillar2Cta: {
    en: "Consult guide →",
    fr: "Consulter le guide →",
    ar: "استشر المرشد ←",
    es: "Consultar guía →"
  },
  pillar3Title: {
    en: "Transit & Stays Hub",
    fr: "Hub des Transports & Séjours",
    ar: "مركز النقل والإقامة",
    es: "Centro de Tránsito y Hospedaje"
  },
  pillar3Desc: {
    en: "Secure room retreats in top Algeria luxury hotels in Algiers/Oran, estimate regional taxi fares, and map corridors in DZD.",
    fr: "Réservez des chambres dans les meilleurs hôtels de luxe d'Alger ou d'Oran, estimez les tarifs de taxi et affichez les trajets en DZD.",
    ar: "احجز غرفتك في أفضل فنادق الجزائر العاصمة ووهران الفاخرة، وقدر أسعار سيارات الأجرة المحلية بالدينار الجزائري.",
    es: "Reserve habitaciones en los mejores hoteles de lujo de Argel u Orán, estime tarifas de taxi y vea rutas en DZD."
  },
  pillar3Cta: {
    en: "Book hotelstay →",
    fr: "Réserver un séjour →",
    ar: "احجز الإقامة الآن ←",
    es: "Reservar hospedaje →"
  },
  billingMonthly: {
    en: "Monthly billing",
    fr: "Facturation mensuelle",
    ar: "الدفع شهرياً",
    es: "Facturación mensual"
  },
  billingYearly: {
    en: "Yearly passport",
    fr: "Passeport annuel",
    ar: "جواز سنوي",
    es: "Pasaporte anual"
  },
  save30: {
    en: "Save 30%",
    fr: "Économisez 30%",
    ar: "وفر 30%",
    es: "Ahorre 30%"
  },
  standardExplorerPass: {
    en: "Standard Explorer Pass",
    fr: "Pass Explorateur Standard",
    ar: "بطاقة المستكشف القياسية",
    es: "Pase de Explorador Estándar"
  },
  freeTravelTier: {
    en: "Free Travel Tier",
    fr: "Niveau Voyage Gratuit",
    ar: "الفئة المجانية للسفر",
    es: "Nivel de Viaje Gratis"
  },
  dzdMonth: {
    en: "DZD / month",
    fr: "DZD / mois",
    ar: "دج / شهرياً",
    es: "DZD / mes"
  },
  dzdYear: {
    en: "DZD / year",
    fr: "DZD / an",
    ar: "دج / سنوياً",
    es: "DZD / año"
  },
  currentlyActive: {
    en: "Currently Active",
    fr: "Actif actuellement",
    ar: "نشط حالياً",
    es: "Activo Actualmente"
  },
  vipElite: {
    en: "VIP ELITE",
    fr: "VIP ÉLITE",
    ar: "نخبة الـ VIP",
    es: "VIP ÉLITE"
  },
  eliteSeries: {
    en: "Rahala Elite Series",
    fr: "Série Élite Rahala",
    ar: "سلسلة نخبة رحالة",
    es: "Serie Élite de Rahala"
  },
  rihlaGoldVip: {
    en: "Rihla Gold VIP",
    fr: "Rihla Gold VIP",
    ar: "رتبة رحلة الذهبية VIP",
    es: "Rihla Gold VIP"
  },
  grabPremiumPass: {
    en: "Grab Premium Gold Pass",
    fr: "Obtenir le Pass Or Premium",
    ar: "احصل على البطاقة الذهبية",
    es: "Obtener Pase Premium Oro"
  },
  lifetimeVipHolder: {
    en: "✓ Lifetime VIP Access Holder",
    fr: "✓ Détenteur d’un accès VIP à vie",
    ar: "✓ حامل عضوية VIP الذهبية مدى الحياة",
    es: "✓ Propietario de acceso VIP de por vida"
  },
  perkFree1: {
    en: "Basic Virtual Explorers access",
    fr: "Accès basique à l’explorateur virtuel",
    ar: "دخول أساسي للمستكشف الافتراضي",
    es: "Acceso básico al explorador virtual"
  },
  perkFree2: {
    en: "3 standard AI companion replies per day",
    fr: "3 réponses d’accompagnateur IA par jour",
    ar: "3 إجابات مجانية من رفيق الذكاء الاصطناعي يومياً",
    es: "3 respuestas de compañero IA estándar por día"
  },
  perkFree3: {
    en: "Static map view points locator",
    fr: "Localisateur de points de vue sur carte statique",
    ar: "محدد مواقع معالم الخريطة الثابتة",
    es: "Localizador de puntos de vista en mapa estático"
  },
  perkFree4: {
    en: "Standard Hotel reviews lists",
    fr: "Listes d’avis d’hôtels standard",
    ar: "قوائم مراجعة وتقييم الفنادق القياسية",
    es: "Listas estándar de opiniones de hoteles"
  },
  perkPremium1: {
    en: "Unlimited high-fidelity 3D Digital Twin tours",
    fr: "Visites illimitées des jumeaux numériques 3D HD",
    ar: "جولات غير محدودة للتوأم الرقمي ثلاثي الأبعاد عالي الدقة",
    es: "Tours ilimitados de gemelos digitales 3D de alta fidelidad"
  },
  perkPremium2: {
    en: "Unlimited server-side Gemini AI guide interactions",
    fr: "Interactions illimitées avec le guide IA Gemini",
    ar: "استشارات غير محدودة لمرشد الذكاء الاصطناعي السحابي جيميناي",
    es: "Consultas ilimitadas de guía de IA Gemini del lado del servidor"
  },
  perkPremium3: {
    en: "Live integrated taxi route calculation & tracking",
    fr: "Calcul et suivi d’itinéraires de taxi en direct",
    ar: "حساب وتتبع مسارات سيارات الأجرة المباشرة المتكاملة",
    es: "Cálculo y seguimiento de rutas de taxi integradas en vivo"
  },
  perkPremium4: {
    en: "15% Promotional hotel cashbacks/vouchers",
    fr: "15% de réduction et coupons de remboursement sur les hôtels",
    ar: "خصومات وكوبونات كاش باك للفنادق بقيمة 15%",
    es: "15% de descuento promocional en hoteles y reembolsos"
  },
  perkPremium5: {
    en: "Exclusive historical chronicles logs library access",
    fr: "Accès exclusif à la bibliothèque de chroniques historiques",
    ar: "وصول حصري لمكتبة سجلات الوقائع التاريخية المخطوطة",
    es: "Acceso exclusivo a la biblioteca de crónicas históricas"
  },
  perkPremium6: {
    en: "Priority local driver assignments",
    fr: "Attribution prioritaire de chauffeurs locaux",
    ar: "أولوية التعيين والطلب للسائقين المحليين",
    es: "Asignación prioritaria de conductores locales"
  },
  exploreTopCitiesTitle: {
    en: "Explore Top Cities",
    fr: "Explorez les meilleures villes",
    ar: "استكشف أشهر المدن",
    es: "Explore las principales ciudades"
  },
  exploreTopCitiesSubtitle: {
    en: "Immerse yourself inside Algeria's most sought-after gems, customized to your travel habits.",
    fr: "Immergez-vous dans les joyaux les plus recherchés d'Algérie, personnalisés selon vos habitudes de voyage.",
    ar: "انغمس في أثمن جواهر الجزائر، والمخصصة لتناسب أسلوب سفرك الشخصي.",
    es: "Sumérjase en las joyas más buscadas de Argelia, adaptadas a sus hábitos de viaje."
  },
  recommendedLabel: {
    en: "Recommended",
    fr: "Recommandé",
    ar: "موصى به",
    es: "Recomendado"
  },
  highMatchIa: {
    en: "High-Match IA",
    fr: "Haute affinité IA",
    ar: "توافق عالي بالذكاء الاصطناعي",
    es: "Alta afinidad de IA"
  },
  matchScore: {
    en: "Match Score",
    fr: "Score d’affinité",
    ar: "نسبة التوافق",
    es: "Puntuación de coincidencia"
  },
  exploreBtnShort: {
    en: "Explore",
    fr: "Explorer",
    ar: "استكشف",
    es: "Explorar"
  },
  bestChoiceForYou: {
    en: "Best choice for you",
    fr: "Le meilleur choix pour vous",
    ar: "الخيار الأفضل لك",
    es: "La mejor opción para usted"
  },
  coastalEnergy: {
    en: "Coastal Energy",
    fr: "Énergie côtière",
    ar: "طاقة الساحل والبلاد",
    es: "Energía Costera"
  },
  discoverAlgiersDesc: {
    en: "Discover the capital of Algeria",
    fr: "Découvrez la capitale de l’Algérie",
    ar: "اكتشف عاصمة الجزائر الرائعة وجدران القصبة",
    es: "Descubra la capital de Argelia"
  },
  feelOranDesc: {
    en: "Feel the coastal energy",
    fr: "Ressentez l’énergie côtière",
    ar: "اشعر بالنشاط والروح الساحلية الباهية",
    es: "Sienta la energía costera"
  },
  specialPromotionsTitle: {
    en: "Special Promotions",
    fr: "Promotions Spéciales",
    ar: "عروض ترويجية خاصة",
    es: "Promociones Especiales"
  },
  specialPromotionsSubtitle: {
    en: "Seize unforgettable experiences at prices optimized by our AI engine. Book now to secure your places.",
    fr: "Saisissez des expériences inoubliables à des tarifs optimisés par notre moteur d'IA. Réservez maintenant pour sécuriser vos places.",
    ar: "اغتنم تجارب لا تُنسى بأسعار محسّنة بواسطة محرك الذكاء الاصطناعي. احجز الآن لتأمين مقعدك.",
    es: "Aproveche experiencias inolvidables a precios optimizados por nuestro motor de IA. Reserve ahora para asegurar su lugar."
  },
  bestValue: {
    en: "Best Value",
    fr: "Meilleur Tarif",
    ar: "أفضل قيمة مالية",
    es: "Mejor Valor"
  },
  exclusivePrice: {
    en: "Exclusive price",
    fr: "Prix exclusif",
    ar: "سعر حصري",
    es: "Precio exclusivo"
  },
  bookNow: {
    en: "Book Now",
    fr: "Réserver",
    ar: "احجز الآن",
    es: "Reservar Ahora"
  },
  saharaAdventureTitle: {
    en: "Sahara Adventure",
    fr: "Aventure au Sahara",
    ar: "مغامرة الصحراء العظمى",
    es: "Aventura en el Sahara"
  },
  saharaAdventureSub: {
    en: "Live the unique desert experience",
    fr: "Vivez l’expérience unique du désert",
    ar: "عيش تجربة الصحراء الفريدة",
    es: "Viva la experiencia única del desierto"
  },
  oranBeachTitle: {
    en: "Oran Beach Escape",
    fr: "Évasion Plage à Oran",
    ar: "نزهة شواطئ وهران الباهية",
    es: "Escapada a la Playa de Orán"
  },
  oranBeachSub: {
    en: "Relax by the Mediterranean coast",
    fr: "Détendez-vous sur la côte méditerranéenne",
    ar: "استرخ على ساحل البحر الأبيض المتوسط",
    es: "Relájese junto a la costa mediterránea"
  },
  algiersCulturalTitle: {
    en: "Algiers Cultural Tour",
    fr: "Tour Culturel d’Alger",
    ar: "جولة القصبة الثقافية بالجزائر العاصمة",
    es: "Tour Cultural de Argel"
  },
  algiersCulturalSub: {
    en: "Exploration of the historic Casbah",
    fr: "Exploration de la Casbah historique",
    ar: "استكشاف القصبة التاريخية العتيقة",
    es: "Exploración de la Casbah histórica"
  },
  noteLabel: {
    en: "Note:",
    fr: "Note :",
    ar: "ملاحظة:",
    es: "Nota:"
  },
  noteTextLanding: {
    en: "Sign up for free to unlock 3D digital twins and price simulator of stay.",
    fr: "Inscrivez-vous gratuitement pour débloquer les jumeaux numériques 3D et le simulateur de prix de séjour.",
    ar: "استمتع بالوصول الفوري إلى ميزة الجولات الافتراضية ثلاثية الأبعاد والتنبؤ الذكي بالأسعار بعد التسجيل.",
    es: "Regístrese gratis para desbloquear gemelos digitales 3D y el simulador de precios de estadías."
  },
  whyChooseTitle: {
    en: "Why travel with RAHLA?",
    fr: "Pourquoi voyager avec RAHALA ?",
    ar: "لماذا تختار رحالة؟",
    es: "¿Por qué viajar con RAHALA?"
  },
  whyChooseSubtitle: {
    en: "An exclusive technology designed for a serene and immersive stay.",
    fr: "Une technologie exclusive conçue pour un séjour serein et immersif.",
    ar: "منصة ذكية متكاملة مصممة خصيصاً للزوار والسياح",
    es: "Una tecnología exclusiva diseñada para una estancia tranquila e inmersiva."
  },
  popularDestinationsTitle: {
    en: "Popular Destinations in Algeria",
    fr: "Destinations populaires en Algérie",
    ar: "الوجهات الأكثر شعبية",
    es: "Destinos Populares en Argelia"
  },
  popularDestinationsSub: {
    en: "The must-visit gems recommended for your next trip.",
    fr: "Les joyaux incontournables recommandés pour votre prochain voyage.",
    ar: "الوجهات المفضلة التي يوصي بها خبراؤنا هذا الموسم",
    es: "Las joyas imperdibles recomendadas para su próximo viaje."
  },
  viewAllBtn: {
    en: "View All",
    fr: "Tout voir",
    ar: "عرض الكل",
    es: "Ver Todo"
  },
  supportedByAi: {
    en: "Supported by Artificial Intelligence",
    fr: "Soutenu par l'Intelligence Artificielle",
    ar: "مدعوم بالذكاء الاصطناعي",
    es: "Soportado por Inteligencia Artificial"
  },
  experienceTailored: {
    en: "A personalized experience according to your budget and desires",
    fr: "Une expérience personnalisée selon votre budget et vos envies",
    ar: "احصل على تجربة سياحية فريدة تناسب ميزانيتك",
    es: "Una experiencia personalizada según su presupuesto y deseos"
  },
  experienceTailoredDesc: {
    en: "RAHALA is not a traditional travel site. Thanks to our Algerian Dinar (DZD) price simulator, our 3D exploration guides and our live connected AI assistant, you can travel across Algeria with complete confidence, like a local.",
    fr: "RAHALA n'est pas un site de voyage traditionnel. Grâce à notre simulateur de Dinar Algérien (DZD), nos guides d'exploration 3D et notre assistant IA connecté en direct, vous pouvez voyager à travers l'Algérie en toute confiance, comme un local.",
    ar: "رحالة ليست مجرد منصة حجز عادية. بفضل محاكي الأسعار بالدينار الجزائري، ومحول العملات الفوري، والذكاء الاصطناعي، يمكنك التخطيط لرحلتك المقبلة بثقة كاملة وتجنب التعرض للمغالاة والأسعار العشوائية.",
    es: "RAHALA no es un sitio de viajes tradicional. Gracias a nuestro simulador de Dinar Argelino (DZD), nuestras guías de exploración 3D y nuestro asistente de IA conectado en vivo, puede viajar por Argelia con total confianza, como un local."
  },
  allRightsReserved: {
    en: "All rights reserved.",
    fr: "Tous droits réservés.",
    ar: "جميع الحقوق محفوظة.",
    es: "Todos los derechos reservados."
  },
  offresExclusives: {
    en: "Exclusive Seasonal Offers",
    fr: "Offres exclusives de saison",
    ar: "عروض ترويجية موسمية حصرية",
    es: "Ofertas exclusivas de temporada"
  },
  recommandedByRahala: {
    en: "Recommended by Rahala AI",
    fr: "Recommandé par Rahala AI",
    ar: "موصى به بواسطة ذكاء رحالة",
    es: "Recomendado por Rahala AI"
  },
  poweredByAiEngine: {
    en: "Powered by AI Personalization Engine",
    fr: "Propulsé par le moteur de personnalisation IA",
    ar: "يعمل بمحرك التخصيص الذكي",
    es: "Impulsado por el motor de personalización de IA"
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
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && ['en', 'fr', 'ar', 'es'].includes(urlLang)) {
      return urlLang as Language;
    }
    const saved = localStorage.getItem('rihla_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rihla_lang', lang);
    const params = new URLSearchParams(window.location.search);
    params.set('lang', lang);
    const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState({}, '', newUrl);
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang && ['en', 'fr', 'ar', 'es'].includes(urlLang) && urlLang !== language) {
        setLanguageState(urlLang as Language);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [language]);

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
