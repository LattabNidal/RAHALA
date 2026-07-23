import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  ShieldCheck, 
  Lock, 
  Check, 
  ExternalLink, 
  Phone, 
  Compass, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Activity, 
  Info, 
  Globe, 
  ArrowRight, 
  ChevronRight,
  RefreshCw,
  Clock,
  Heart,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InsuranceProvider {
  id: string;
  name: string;
  logoColor: string;
  logoText: string;
  accentColor: string;
  bgGradient: string;
  link: string;
  phone: string;
  pricing: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  coverage: {
    en: string[];
    fr: string[];
    ar: string[];
    es: string[];
  };
  description: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
}

export const ALGERIAN_WILAYAS = [
  { id: 1, code: 'Adrar', nameEn: '01 - Adrar', nameAr: '01 - أدرار', flag: '🏜️' },
  { id: 2, code: 'Chlef', nameEn: '02 - Chlef', nameAr: '02 - الشلف', flag: '🏙️' },
  { id: 3, code: 'Laghouat', nameEn: '03 - Laghouat', nameAr: '03 - الأغواط', flag: '🏜️' },
  { id: 4, code: 'Oum El Bouaghi', nameEn: '04 - Oum El Bouaghi', nameAr: '04 - أم البواقي', flag: '⛰️' },
  { id: 5, code: 'Batna', nameEn: '05 - Batna', nameAr: '05 - باتنة', flag: '⛰️' },
  { id: 6, code: 'Bejaia', nameEn: '06 - Béjaïa', nameAr: '06 - بجاية', flag: '🌊' },
  { id: 7, code: 'Biskra', nameEn: '07 - Biskra', nameAr: '07 - بسكرة', flag: '🌴' },
  { id: 8, code: 'Bechar', nameEn: '08 - Béchar', nameAr: '08 - بشار', flag: '🏜️' },
  { id: 9, code: 'Blida', nameEn: '09 - Blida', nameAr: '09 - البليدة', flag: '🌹' },
  { id: 10, code: 'Bouira', nameEn: '10 - Bouira', nameAr: '10 - البويرة', flag: '⛰️' },
  { id: 11, code: 'Tamanrasset', nameEn: '11 - Tamanrasset', nameAr: '11 - تمنراست', flag: '🏜️' },
  { id: 12, code: 'Tebessa', nameEn: '12 - Tébessa', nameAr: '12 - تبسة', flag: '🏛️' },
  { id: 13, code: 'Tlemcen', nameEn: '13 - Tlemcen', nameAr: '13 - تلمسان', flag: '🕌' },
  { id: 14, code: 'Tiaret', nameEn: '14 - Tiaret', nameAr: '14 - تيارت', flag: '🐎' },
  { id: 15, code: 'Tizi Ouzou', nameEn: '15 - Tizi Ouzou', nameAr: '15 - تيزي وزو', flag: '⛰️' },
  { id: 16, code: 'Algiers', nameEn: '16 - Algiers', nameAr: '16 - الجزائر العاصمة', flag: '🏙️' },
  { id: 17, code: 'Djelfa', nameEn: '17 - Djelfa', nameAr: '17 - الجلفة', flag: '🐏' },
  { id: 18, code: 'Jijel', nameEn: '18 - Jijel', nameAr: '18 - جيجل', flag: '🌊' },
  { id: 19, code: 'Setif', nameEn: '19 - Sétif', nameAr: '19 - سطيف', flag: '🏛️' },
  { id: 20, code: 'Saida', nameEn: '20 - Saïda', nameAr: '20 - سعيدة', flag: '🏞️' },
  { id: 21, code: 'Skikda', nameEn: '21 - Skikda', nameAr: '21 - سكيكدة', flag: '🌊' },
  { id: 22, code: 'Sidi Bel Abbes', nameEn: '22 - Sidi Bel Abbès', nameAr: '22 - سيدي بلعباس', flag: '🏛️' },
  { id: 23, code: 'Annaba', nameEn: '23 - Annaba', nameAr: '23 - عنابة', flag: '🌊' },
  { id: 24, code: 'Guelma', nameEn: '24 - Guelma', nameAr: '24 - قالمة', flag: '⛲' },
  { id: 25, code: 'Constantine', nameEn: '25 - Constantine', nameAr: '25 - قسنطينة', flag: '🌉' },
  { id: 26, code: 'Medea', nameEn: '26 - Médéa', nameAr: '26 - المدية', flag: '⛰️' },
  { id: 27, code: 'Mostaganem', nameEn: '27 - Mostaganem', nameAr: '27 - مستغانم', flag: '🌊' },
  { id: 28, code: "M'Sila", nameEn: "28 - M'Sila", nameAr: '28 - المسيلة', flag: '🌾' },
  { id: 29, code: 'Mascara', nameEn: '29 - Mascara', nameAr: '29 - معسكر', flag: '🌾' },
  { id: 30, code: 'Ouargla', nameEn: '30 - Ouargla', nameAr: '30 - ورقلة', flag: '🌴' },
  { id: 31, code: 'Oran', nameEn: '31 - Oran', nameAr: '31 - وهران', flag: '🌊' },
  { id: 32, code: 'El Bayadh', nameEn: '32 - El Bayadh', nameAr: '32 - البيض', flag: '🐑' },
  { id: 33, code: 'Illizi', nameEn: '33 - Illizi', nameAr: '33 - إليزي', flag: '🏜️' },
  { id: 34, code: 'Bordj Bou Arreridj', nameEn: '34 - Bordj Bou Arréridj', nameAr: '34 - برج بوعريريج', flag: '🏭' },
  { id: 35, code: 'Boumerdes', nameEn: '35 - Boumerdès', nameAr: '35 - بومرداس', flag: '🌊' },
  { id: 36, code: 'El Tarf', nameEn: '36 - El Tarf', nameAr: '36 - الطارف', flag: '🌳' },
  { id: 37, code: 'Tindouf', nameEn: '37 - Tindouf', nameAr: '37 - تندوف', flag: '🏜️' },
  { id: 38, code: 'Tissemsilt', nameEn: '38 - Tissemsilt', nameAr: '38 - تيسمسيلت', flag: '🌲' },
  { id: 39, code: 'El Oued', nameEn: '39 - El Oued', nameAr: '39 - الوادي', flag: '🏜️' },
  { id: 40, code: 'Khenchela', nameEn: '40 - Khenchela', nameAr: '40 - خنشلة', flag: '🌲' },
  { id: 41, code: 'Souk Ahras', nameEn: '41 - Souk Ahras', nameAr: '41 - سوق أهراس', flag: '🦁' },
  { id: 42, code: 'Tipaza', nameEn: '42 - Tipaza', nameAr: '42 - تيبازة', flag: '🌊' },
  { id: 43, code: 'Mila', nameEn: '43 - Mila', nameAr: '43 - ميلة', flag: '⛲' },
  { id: 44, code: 'Ain Defla', nameEn: '44 - Aïn Defla', nameAr: '44 - عين الدفلى', flag: '🍊' },
  { id: 45, code: 'Naama', nameEn: '45 - Naâma', nameAr: '45 - النعامة', flag: '🌾' },
  { id: 46, code: 'Ain Temouchent', nameEn: '46 - Aïn Témouchent', nameAr: '46 - عين تموشنت', flag: '🌊' },
  { id: 47, code: 'Ghardaia', nameEn: '47 - Ghardaïa', nameAr: '47 - غرداية', flag: '🧱' },
  { id: 48, code: 'Relizane', nameEn: '48 - Relizane', nameAr: '48 - غليزان', flag: '🌾' },
  { id: 49, code: 'Timimoun', nameEn: '49 - Timimoun', nameAr: '49 - تيميمون', flag: '🏜️' },
  { id: 50, code: 'Bordj Badji Mokhtar', nameEn: '50 - Bordj Badji Mokhtar', nameAr: '50 - برج باجي مختار', flag: '🏜️' },
  { id: 51, code: 'Ouled Djellal', nameEn: '51 - Ouled Djellal', nameAr: '51 - أولاد جلال', flag: '🐑' },
  { id: 52, code: 'Beni Abbes', nameEn: '52 - Béni Abbès', nameAr: '52 - بني عباس', flag: '🏜️' },
  { id: 53, code: 'In Salah', nameEn: '53 - In Salah', nameAr: '53 - عين صالح', flag: '🔥' },
  { id: 54, code: 'In Guezzam', nameEn: '54 - In Guezzam', nameAr: '54 - عين قزام', flag: '🏜️' },
  { id: 55, code: 'Touggourt', nameEn: '55 - Touggourt', nameAr: '55 - تقرت', flag: '🌴' },
  { id: 56, code: 'Djanet', nameEn: '56 - Djanet', nameAr: '56 - جانت', flag: '🏜️' },
  { id: 57, code: "El M'Ghair", nameEn: "57 - El M'Ghair", nameAr: "57 - المغير", flag: '🌴' },
  { id: 58, code: 'El Meniaa', nameEn: '58 - El Meniaa', nameAr: '58 - المنيعة', flag: '🏝️' }
];

export const SafeTravel: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { currentUser } = useApp();

  // Interactive AI Parameters
  const [destination, setDestination] = useState<string>('Djanet');
  const [duration, setDuration] = useState<number>(7);
  const [activity, setActivity] = useState<string>('desert'); // desert | city | hiking
  
  // AI Analyzing State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [recommendedId, setRecommendedId] = useState<string>('axa-algeria');

  // Booking/Payment Panel State
  const [paymentPortalOpen, setPaymentPortalOpen] = useState<boolean>(false);
  const [payingProvider, setPayingProvider] = useState<InsuranceProvider | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Input states for Checkout
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>(currentUser?.name || 'TRAVELLER DZ');
  const [expiry, setExpiry] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [mobileProvider, setMobileProvider] = useState<'baridimob' | 'wimpay'>('baridimob');

  // Voice Over / Subtitle State
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [subtitleStep, setSubtitleStep] = useState<number>(0);
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null);

  // Final Confirmed screen
  const [isFullyConfirmed, setIsFullyConfirmed] = useState<boolean>(false);

  // Multilingual Translations Localized inside Component
  const contentTranslations: Record<string, Record<string, string>> = {
    title: {
      en: 'RAHALA Safe Travel',
      fr: 'RAHALA Voyage Sûr',
      ar: 'رحالة للسفر الآمن',
      es: 'RAHALA Viaje Seguro'
    },
    subtitle: {
      en: 'AI-personalized Algerian Travel Insurance Hub',
      fr: 'Pôle d’assurances voyage algériennes adaptées par IA',
      ar: 'المنصة الذكية المخصصة للتأمين على السفر في الجزائر',
      es: 'Eje de seguros de viaje argelinos personalizados por IA'
    },
    promptTitle: {
      en: 'Secure Your Journey',
      fr: 'Sécurisez votre voyage',
      ar: 'أمن رحلتك بذكاء',
      es: 'Asegure su viaje'
    },
    promptDesc: {
      en: 'Before confirming your Algerian exploration, our intelligent assistant advises securing your transit through certified partners.',
      fr: 'Avant de confirmer votre exploration de l’Algérie, l’IA vous recommande d’assurer votre séjour chez l’un de nos partenaires agréés.',
      ar: 'قبل تأكيد مغامرتك الجزائرية الفريدة، يرشدك نظام الذكاء الاصطناعي لتأمين رحلتك وحماية نفسك عبر أحد شركائنا المعتمدين.',
      es: 'Antes de confirmar su exploración, nuestro asistente inteligente le aconseja asegurar su viaje con socios certificados.'
    },
    setupTrip: {
      en: 'Configure Your Travel Plan',
      fr: 'Configurez votre plan de route',
      ar: 'بيانات خطة السفر النشطة',
      es: 'Configure su plan de viaje'
    },
    analyzingText: {
      en: 'Generative AI is analyzing risks, duration, and terrain...',
      fr: 'L’IA générative analyse les risques, la durée et le terrain...',
      ar: 'يقوم الذكاء الاصطناعي بتحليل المخاطر الميدانية والمدة التقديرية...',
      es: 'La IA generativa está analizando riesgos, duración y terreno...'
    },
    recommendedTag: {
      en: 'Recommended for you',
      fr: 'Recommandé pour vous',
      ar: 'خيار الذكاء الاصطناعي الأفضل لك',
      es: 'Recomendado para ti'
    },
    recommendedReason: {
      en: 'Best matches your interests and desert safety guidelines.',
      fr: 'Adaptation optimale à vos activités et aux directives de sécurité.',
      ar: 'يطابق تماماً رغبتك بالاستكشاف الصحراوي ومخططات الطوارئ.',
      es: 'La mejor opción para tus intereses y seguridad en el desierto.'
    },
    durationLabel: {
      en: 'Travel Duration',
      fr: 'Durée du séjour',
      ar: 'مدة الإقامة التقديرية',
      es: 'Duración del viaje'
    },
    destLabel: {
      en: 'Destination Province',
      fr: 'Province de Destination',
      ar: 'ولاية الوجهة السياحية',
      es: 'Provincia de destino'
    },
    activityLabel: {
      en: 'Primary Activity',
      fr: 'Activité Principale',
      ar: 'نوع النشاط السياحي الرئيس',
      es: 'Actividad Principal'
    },
    activityDesert: {
      en: 'Sahara Desert Expedition',
      fr: 'Expédition au Sahara',
      ar: 'رحلات واستكشاف الصحراء الكبرى',
      es: 'Expedición al Desierto del Sahara'
    },
    activityHiking: {
      en: 'Altitudes & Coast Hiking',
      fr: 'Randonnée & Hauteurs',
      ar: 'مسارات تسلق المرتفعات والغابات',
      es: 'Senderismo y Montañas'
    },
    activityCity: {
      en: 'Metropolitan Sightseeing',
      fr: 'Visite Urbaine & Musées',
      ar: 'جولات ثقافية في المدن والمعالم',
      es: 'Turismo Urbano y Museos'
    },
    visitWebsite: {
      en: 'Visit Website',
      fr: 'Visiter le site',
      ar: 'زيارة الموقع الرسمي',
      es: 'Visitar Sitio Web'
    },
    subscribeNow: {
      en: 'Subscribe Now',
      fr: 'Souscrire maintenant',
      ar: 'اشتراك وتأمين فوري',
      es: 'Suscribirse Ahora'
    },
    paySecureTitle: {
      en: 'Secure Algerian Checkout',
      fr: 'Paiement en ligne sécurisé',
      ar: 'بوابة الدفع الآمنة المباشرة',
      es: 'Pago Seguro en Línea'
    },
    cardPayment: {
      en: 'Credit Card (DZD)',
      fr: 'Carte Bancaire (CIB / Dahabia)',
      ar: 'بطاقة بنكية (CIB / الذهبية)',
      es: 'Tarjeta Bancaria (DZD)'
    },
    mobilePayment: {
      en: 'Mobile Wallet Transfer',
      fr: 'Virement Mobile (BaridiMob / WimPay)',
      ar: 'الدفع الإلكتروني (بريدي موب / WimPay)',
      es: 'Pago Móvil Wallet'
    },
    cardNoHolder: {
      en: 'Card Number',
      fr: 'Numéro de Carte',
      ar: 'رقم بطاقتك الائتمانية',
      es: 'Número de Tarjeta'
    },
    cardNameHolder: {
      en: 'Cardholder Full Name',
      fr: 'Nom complet du titulaire',
      ar: 'اسم صاحب البطاقة الكامل',
      es: 'Nombre del Titular'
    },
    cancelBtn: {
      en: 'Cancel',
      fr: 'Annuler',
      ar: 'إلغاء العملية',
      es: 'Cancelar'
    },
    processPayment: {
      en: 'Secure & Authorize Payment',
      fr: 'Confirmer et payer en DZD',
      ar: 'تأكيد ودفع الرسوم بالدينار',
      es: 'Confirmar y Pagar en DZD'
    },
    payingTitle: {
      en: 'Connecting to Secure Server...',
      fr: 'Connexion au serveur sécurisé...',
      ar: 'جاري الاتصال بخوادم البنك المشفرة...',
      es: 'Conectando con el Servidor Seguro...'
    },
    payingDesc: {
      en: 'Your transaction is being processed via SATIM and local Algerian banking interfaces.',
      fr: 'Votre transaction est en cours de traitement via SATIM et les réseaux bancaires locaux.',
      ar: 'يتم معالجة العملية المالية بموثوقية عالية عبر شبكة نقد كارت وخدمات الساتيم الوطنية.',
      es: 'Su transacción se está procesando a través de SATIM y de la red bancaria argelina.'
    },
    successTitle: {
      en: 'Travel Secured successfully!',
      fr: 'Voyage Sécurisé avec succès !',
      ar: 'تم الاشتراك وتأمين رحلتك بنجاح!',
      es: '¡Viaje Asegurado con Éxito!'
    },
    successDesc: {
      en: 'Your digital insurance certificate has been synthesized and certified by the Algerian Ministry of Finance.',
      fr: 'Votre certificat d’assurance numérique a été généré et validé par le Ministère des Finances.',
      ar: 'تم إصدار شهادة التأمين الإلكترونية المعتمدة بنجاح وإرسال الرمز لبريدك الإلكتروني المسجل.',
      es: 'Su certificado de seguro digital ha sido generado y certificado por el Ministerio de Finanzas.'
    },
    continueJourney: {
      en: 'Continue Sahara Journey Confidently',
      fr: 'Continuer le voyage l’esprit tranquille',
      ar: 'متابعة الرحلة في الصحراء باطمئنان كلي',
      es: 'Continuar el Viaje por el Sahara con Confianza'
    },
    supportNo: {
      en: 'Customer Support',
      fr: 'Assistance Client',
      ar: 'رقم دعم المشتركين المباشر',
      es: 'Atención al Cliente'
    }
  };

  const currentT = (key: string): string => {
    return contentTranslations[key]?.[language] || contentTranslations[key]?.['en'] || key;
  };

  // Official Insurance Providers List
  const insuranceProviders: InsuranceProvider[] = [
    {
      id: 'bna-assurance',
      name: 'BNA Assurance',
      logoColor: 'from-emerald-700 to-green-600',
      logoText: 'BNA',
      accentColor: 'emerald',
      bgGradient: 'bg-emerald-50/40 dark:bg-emerald-950/15',
      link: 'https://www.bna.dz/fr/assurance-ava/',
      phone: '021 64 15 15',
      pricing: {
        en: '4,500 DZD / Trip',
        fr: '4 500 DZD / Séjour',
        ar: '4,500 دج / للرحلة',
        es: '4.500 DZD / Viaje'
      },
      description: {
        en: 'Official AVA travel coverage in partnership with Banque Nationale d’Algérie for flexible global & local trips.',
        fr: 'Couverture voyage AVA officielle en partenariat avec la Banque Nationale d’Algérie pour des séjours sûrs.',
        ar: 'تأمين السفر AVA الرسمي بالتعاون مع البنك الوطني الجزائري لتغطية كاملة وشاملة لمختلف الظروف.',
        es: 'Cobertura oficial de viaje AVA en asociación con el Banco Nacional de Argelia para viajes seguros.'
      },
      coverage: {
        en: ['Hospitalization up to 1,200,000 DZD', 'Urgent medical assistance & medication', 'Administrative legal help in Algeria'],
        fr: ['Hospitalisation jusqu’à 1 200 000 DZD', 'Soins urgents et médicaments pris en charge', 'Assistance juridique en Algérie'],
        ar: ['تغطية استشفائية حتى 1,200,000 دج', 'التكفل بالرعاية الطبية الطارئة والأدوية', 'المرافقة القانونية والإدارية الاحترافية'],
        es: ['Hospitalización hasta 1.200.000 DZD', 'Asistencia médica urgente y medicamentos', 'Asistencia jurídica en Argelia']
      }
    },
    {
      id: 'cardif-el-djazair',
      name: 'Cardif El Djazair',
      logoColor: 'from-teal-800 to-cyan-700',
      logoText: 'CARDIF',
      accentColor: 'teal',
      bgGradient: 'bg-teal-50/40 dark:bg-teal-900/10',
      link: 'https://cardifeldjazair.dz/assurance-voyage/',
      phone: '021 79 98 00',
      pricing: {
        en: '4,200 DZD / Trip',
        fr: '4 200 DZD / Séjour',
        ar: '4,200 دج / للرحلة',
        es: '4.200 DZD / Viaje'
      },
      description: {
        en: 'A premier European-standards subsidiary of BNP Paribas in Algeria, offering robust medical rescue and luggage protection.',
        fr: 'Filiale de BNP Paribas de standard international, offrant un service réactif de secours médicaux et perte de bagages.',
        ar: 'فرع معتمد بمواصفات عالمية تابعة لـ BNP Paribas في الجزائر، يضمن لك سرعة الإغاثة الطبية وحماية المفقودات.',
        es: 'Filial de BNP Paribas de estándar internacional, que ofrece un servicio reactivo para emergencias y pérdida de equipaje.'
      },
      coverage: {
        en: ['Lost luggage dynamic compensation', 'Emergency medical repatriation coverage', '24/7 bilingual premium hotline support'],
        fr: ['Indemnisation dynamique perte de bagages', 'Rapatriement médical urgent entièrement couvert', 'Ligne d’assistance Premium 24h/24'],
        ar: ['تعويض فوري عن ضياع أو تأخر الأمتعة والملفات', 'التكفل التام بالنقل الطبي والترحيل الاضطراري', 'دعم ناطق بالعربية والفرنسية على مدار 24 ساعة'],
        es: ['Compensación dinámica por pérdida de equipaje', 'Repatriación médica de urgencia cubierta', 'Asistencia premium 24h en varios idiomas']
      }
    },
    {
      id: 'cpa-moussafer',
      name: 'CPA Moussafer',
      logoColor: 'from-red-750 to-orange-600',
      logoText: 'CPA',
      accentColor: 'red',
      bgGradient: 'bg-red-50/40 dark:bg-red-950/15',
      link: 'https://www.cpa-bank.dz/index.php/fr/nos-produits/bancassurance/assurance-personnes/assurance-voyage-moussafer',
      phone: '021 63 56 12',
      pricing: {
        en: '5,000 DZD / Trip',
        fr: '5 000 DZD / Séjour',
        ar: '5,000 دج / للرحلة',
        es: '5.000 DZD / Viaje'
      },
      description: {
        en: 'Credit Populaire d’Algerie high performance insurance designed for internal desert journeys, hiking, and deep sahara trips.',
        fr: 'Bancassurance sur-mesure du Crédit Populaire d’Algérie conçue pour les treks sahariens, altitudes et imprévus au grand sud.',
        ar: 'منتج السفر المميز من القرض الشعبي الجزائري المصمم خصيصاً للمغامرات الصحراوية ومسارات المرتفعات.',
        es: 'Bancassurance del Crédit Populaire d’Algérie diseñada para senderismo y excursiones en el desierto del Sahara.'
      },
      coverage: {
        en: ['Helicopter mountain rescue assistance', 'Extreme conditions & desert sickness aid', 'Local hospital cashless billing guarantees'],
        fr: ['Assistance recherche et secours par hélicoptère', 'Prise en charge déshydratation & conditions extrêmes', 'Garantie de paiement sans avance aux hôpitaux'],
        ar: ['تغطية البحث والإنقاذ المروحي في المناطق الشاهقة والصحراء', 'رعاية فائقة لضربات الشمس والجفاف والظروف المناخية الصعبة', 'ميزة الدفع المباشر للمستشفيات المحلية دون سداد مسبق'],
        es: ['Asistencia de búsqueda y rescate en helicóptero', 'Ayuda para condiciones extremas y deshidratación', 'Garantía de facturación directa con hospitales locales']
      }
    },
    {
      id: 'axa-algeria',
      name: 'AXA Algeria',
      logoColor: 'from-blue-700 to-indigo-600',
      logoText: 'AXA',
      accentColor: 'blue',
      bgGradient: 'bg-blue-50/40 dark:bg-blue-950/15',
      link: 'https://www.axa.dz/particuliers/assurance-voyage/',
      phone: '021 98 00 00',
      pricing: {
        en: '5,800 DZD / Trip',
        fr: '5 800 DZD / Séjour',
        ar: '5,800 دج / للرحلة',
        es: '5.800 DZD / Viaje'
      },
      description: {
        en: 'Comprehensive multinational backing in Algeria providing immediate elite medical coverage, flight delay coverages, and premium assistance.',
        fr: 'Soutien d’un leader mondial pour une couverture médicale d’élite, contre les retards de vol et l’assistance médicale complète.',
        ar: 'الحماية الشاملة من شركة أليانز مع دعم دولي لتغطية طبية فائقة ومواجهة إلغاء وتأخر الرحلات والظروف الاستثنائية.',
        es: 'Respaldo del líder mundial para la máxima cobertura médica de élite, retrasos de vuelos y asistencia integral.'
      },
      coverage: {
        en: ['Unlimited emergency medical costs in Algeria', 'Personalized transport booking delays coverage', 'Loss of travel documents rapid renewal assistance'],
        fr: ['Frais médicaux urgents illimités sur le territoire', 'Indemnisation retard de correspondance et de transport', 'Aide immédiate au renouvellement des documents de voyage'],
        ar: ['تغطية التكاليف الطبية الطارئة والعمليات الجراحية', 'تعويض مجزٍ لحالات تأخر النقل الجوي والبري والربط', 'المساعدة في التجديد السريع لجميع مستندات السفر المفقودة'],
        es: ['Gastos médicos de urgencia ilimitados en Argelia', 'Compensación por retraso de correspondencia y vuelos', 'Ayuda inmediata para renovación de documentos perdidos']
      }
    }
  ];

  // AI Recommendation Logic based on parameters!
  const triggerAIAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate real AI Analysis
    setTimeout(() => {
      let idealId = 'axa-algeria'; // default

      if (activity === 'desert') {
        idealId = 'cpa-moussafer'; // CPA has excellent desert & helicopter assistance
      } else if (activity === 'hiking') {
        idealId = 'axa-algeria'; // AXA has top extreme medical altitude coverage
      } else if (destination === 'Algiers') {
        idealId = 'cardif-el-djazair'; // Cardif excels in Algiers business & luggage delays
      } else {
        idealId = 'bna-assurance'; // BNA for general high rating coastal stays
      }

      setRecommendedId(idealId);
      setIsAnalyzing(false);

      // Play contextual voice line automatically if narrator toggled
      if (isAudioPlaying) {
        speakSubtitles(1);
      }
    }, 2200);
  };

  // Subtitle voice lines in different languages
  const narrationSubtitles = [
    {
      en: "With Rahala, travel with absolute safety and confidence. Your protection is our priority.",
      fr: "Avec Rahala, voyagez en toute sécurité. Votre protection est notre priorité absolue.",
      ar: "مع رحالة، يمكنك السفر بأمان تام وثقة كاملة. سلامتك هي أولويتنا.",
      es: "Con Rahala, viaje con absoluta seguridad y confianza. Su protección es nuestra prioridad."
    },
    {
      en: "Artificial intelligence analyzes your route to suggest the absolute best insurances tailored for your journey.",
      fr: "L’intelligence artificielle analyse votre trajet pour vous proposer les meilleures assurances adaptées à votre voyage.",
      ar: "يقوم نظام الذكاء الاصطناعي بتحليل خط سير رحلتك ليقترح عليك أفضل خطط تأمين مخصصة لظروفك.",
      es: "La inteligencia artificial analiza su ruta para sugerirle los mejores seguros adaptados a su viaje."
    },
    {
      en: "Compare official offers instantly, choose simply, and pay online with state-of-the-art secure DZD checkout.",
      fr: "Comparez les offres, choisissez facilement… et payez en ligne en toute sécurité.",
      ar: "قارن العروض الرسمية، اختر ما يناسبك بسهولة... وسدد الرسوم عبر الإنترنت بأمان تام.",
      es: "Compare las ofertas oficiales al instante, elija con sencillez y pague en línea de forma segura en DZD."
    }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'ar') {
        utterance.lang = 'ar-DZ';
      } else if (language === 'fr') {
        utterance.lang = 'fr-FR';
      } else if (language === 'es') {
        utterance.lang = 'es-ES';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = 1.0;
      utterance.onend = () => {
        // Automatically progress to next step after speech ends
        setSubtitleStep((prev) => {
          if (prev < 2) {
            const next = prev + 1;
            speakText(narrationSubtitles[next][language] || narrationSubtitles[next]['en']);
            return next;
          } else {
            setIsAudioPlaying(false);
            return 0;
          }
        });
      };
      setSpeechInstance(utterance);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleNarrator = () => {
    if (isAudioPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAudioPlaying(false);
      setSubtitleStep(0);
    } else {
      setIsAudioPlaying(true);
      setSubtitleStep(0);
      const textToSpeak = narrationSubtitles[0][language] || narrationSubtitles[0]['en'];
      speakText(textToSpeak);
    }
  };

  const speakSubtitles = (step: number) => {
    setSubtitleStep(step);
    const textToSpeak = narrationSubtitles[step][language] || narrationSubtitles[step]['en'];
    speakText(textToSpeak);
  };

  useEffect(() => {
    // Initial recommendation trigger on mount
    triggerAIAnalysis();

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [destination, activity]);

  const handleOpenPayment = (provider: InsuranceProvider) => {
    setPayingProvider(provider);
    setPaymentPortalOpen(true);
    setPaymentStatus('idle');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setMobileNumber('');

    // Trigger subtitle step 2 for checkout
    if (isAudioPlaying) {
      speakSubtitles(2);
    }
  };

  const processSecureCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');

    setTimeout(() => {
      setPaymentStatus('success');
    }, 3200);
  };

  const confirmFullInsurance = () => {
    setIsFullyConfirmed(true);
    setPaymentPortalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 transition-colors duration-300" id="rahala-safe-travel-feature">
      <div className="max-w-7xl mx-auto">
        
        {/* Dynamic header banner with shield and glowing effects */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-slate-950 to-red-950 rounded-2xl p-8 mb-8 border border-emerald-500/30 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <Shield size={180} className="text-emerald-400 animate-pulse-slow" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-450 text-[10px] uppercase font-mono font-black tracking-widest px-3 py-1 rounded-full mb-3">
                <Sparkles size={12} className="animate-spin-slow" />
                PREMIUM EXPERIENCE
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-none">
                {currentT('title')}
              </h1>
              <p className="text-sm font-serif italic text-amber-300/90 mt-2">
                {currentT('subtitle')}
              </p>
            </div>
            
            {/* Cinematic voice narrator trigger with animated waveform */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <button
                onClick={toggleNarrator}
                className={`inline-flex items-center gap-2.5 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                  isAudioPlaying 
                    ? 'bg-red-600 border-red-500 text-white shadow-lg animate-pulse' 
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                }`}
              >
                {isAudioPlaying ? (
                  <>
                    <VolumeX size={15} />
                    MUTE NARRATION
                  </>
                ) : (
                  <>
                    <Volume2 size={15} />
                    PLAY NARRATOR
                  </>
                )}
              </button>
              
              {/* Animated audio waves */}
              <div className="flex items-center gap-0.5 h-4 px-2">
                {[1, 2, 3, 4, 5, 4, 3, 2, 3, 5, 4, 2, 1, 3, 4].map((h, i) => (
                  <span 
                    key={i} 
                    className={`w-0.5 rounded-full transition-all duration-300 ${isAudioPlaying ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}
                    style={{ height: isAudioPlaying ? `${h * 4}px` : '4px' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Voice-over active Subtitles banner */}
          <div className="mt-6 pt-4 border-t border-white/10 bg-black/45 rounded-xl p-4 flex items-start gap-3 border border-emerald-500/10">
            <div className="min-w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <div>
              <span className="block text-[8px] font-mono tracking-widest uppercase text-emerald-450 font-extrabold mb-1">
                RAHALA AI NARRATOR NIFTI (VOICE OVER) — STEP {subtitleStep + 1}/3
              </span>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans font-medium italic">
                "{narrationSubtitles[subtitleStep][language] || narrationSubtitles[subtitleStep]['en']}"
              </p>
              <div className="flex gap-2 mt-2">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => speakSubtitles(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${subtitleStep === idx ? 'bg-emerald-450 w-6' : 'bg-white/35 hover:bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Main Grid Layout: Interactive Left Panel (Settings) and Central Phone Simulator Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 5-COLS: AI Plan Optimizer Panel (Travel settings) */}
          {!isFullyConfirmed && (
            <div className="lg:col-span-5 bg-white dark:bg-[#111622] rounded-2xl p-6 border border-slate-150 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <Compass className="text-emerald-600 dark:text-emerald-450 animate-spin-slow" size={24} />
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100 font-display">
                    {currentT('setupTrip')}
                  </h2>
                  <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
                    REAL-TIME AI CLASSIFICATION
                  </p>
                </div>
              </div>

              {/* Set Destination */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-300 mb-2">
                  🗺️ {currentT('destLabel')}
                </label>
                
                {/* 4 Quick tourist hotspots shortcut buttons */}
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 mb-2 font-bold">
                  {language === 'ar' ? 'الوجهات الأكثر شعبية ✦' : '✦ Popular Hotspots'}
                </span>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { code: 'Djanet', label: language === 'ar' ? 'جانت' : 'Djanet (Sahara)', flag: '🏜️' },
                    { code: 'Algiers', label: language === 'ar' ? 'الجزائر' : 'Algiers (Capital)', flag: '🏙️' },
                    { code: 'Oran', label: language === 'ar' ? 'وهران' : 'Oran (Coast)', flag: '🌊' },
                    { code: 'Constantine', label: language === 'ar' ? 'قسنطينة' : 'Constantine (Bridges)', flag: '🌉' }
                  ].map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => setDestination(loc.code)}
                      type="button"
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        destination === loc.code
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <span>{loc.label}</span>
                      <span>{loc.flag}</span>
                    </button>
                  ))}
                </div>

                {/* All 58 Algerian Wilayas Selector dropdown */}
                <div className="relative mt-2">
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 font-bold">
                    {language === 'ar' ? 'عرض تصفح كافة الولايات الجزائرية (58 ولاية) ✦' : '✦ Explore All 58 Algerian Wilayas'}
                  </span>
                  <div className="relative">
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-xs font-black text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer pr-10 rtl:pl-10 rtl:pr-4"
                    >
                      {ALGERIAN_WILAYAS.map((w) => (
                        <option key={w.code} value={w.code} className="bg-white dark:bg-slate-950 font-sans font-medium text-slate-850 dark:text-slate-150">
                          {w.flag} {language === 'ar' ? w.nameAr : w.nameEn}
                        </option>
                      ))}
                    </select>
                    {/* Custom Arrow indicator inside selector */}
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 rotate-90 scale-75">
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Set Primary Activity */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-300 mb-2">
                  🔥 {currentT('activityLabel')}
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'desert', label: currentT('activityDesert'), icon: '🏜️' },
                    { id: 'hiking', label: currentT('activityHiking'), icon: '⛰️' },
                    { id: 'city', label: currentT('activityCity'), icon: '🕌' }
                  ].map((act) => (
                    <button
                      key={act.id}
                      onClick={() => setActivity(act.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                        activity === act.id
                          ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <span className="text-lg">{act.icon}</span>
                      <span>{act.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Set Travel Duration slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-300">
                    📅 {currentT('durationLabel')}
                  </label>
                  <span className="text-xs font-mono font-extrabold px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-emerald-600 dark:text-emerald-400">
                    {duration} Days / {duration - 1} Nights
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>3 Days (Weekend)</span>
                  <span>30 Days (Full expedition)</span>
                </div>
              </div>

              {/* Assistant Suggestion alert */}
              <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 flex gap-3">
                <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                  <span className="font-extrabold text-amber-600 dark:text-[#d4af37]">
                    {currentT('promptTitle')} :{' '}
                  </span>
                  {currentT('promptDesc')}
                </div>
              </div>

              <button
                onClick={triggerAIAnalysis}
                disabled={isAnalyzing}
                className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-mono text-xs font-extrabold uppercase tracking-widest rounded-xl hover:shadow-lg shadow-emerald-600/20 active:scale-98 transition duration-200 border border-emerald-500 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
                LET AI ANALYZE & RECOMMEND
              </button>
            </div>
          )}

          {/* CENTRAL 7-COLS (If not confirmed) or FULL 12-COLS: Top-tier Smartphone Simulator Interface */}
          <div className={`${isFullyConfirmed ? 'lg:col-span-12' : 'lg:col-span-7'} flex flex-col items-center justify-center`}>
            
            <AnimatePresence mode="wait">
              {!isFullyConfirmed ? (
                
                /* DEEP PHONE DEVICE MOCKUP FRAME */
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="relative w-full max-w-[470px] bg-slate-900 border-[10px] border-[#384252] dark:border-[#1a2333] rounded-[48px] shadow-2xl p-1 overflow-hidden"
                  id="mobile-viewport-emulator"
                >
                  {/* Smartphone Top Notch Sensor Bar / Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-slate-800 block border border-slate-700/50"></span>
                    <span className="w-12 h-1 bg-slate-950 rounded-full block ml-2"></span>
                  </div>

                  {/* Simulator Status bar details */}
                  <div className="bg-[#151c2c] text-slate-400 text-[10px] font-mono px-6 pt-5 pb-3 flex justify-between items-center z-20 relative select-none">
                    <div className="flex items-center gap-1">
                      <Clock size={11} className="text-emerald-500" />
                      <span>08:26 (DZD)</span>
                    </div>
                    <div className="bg-emerald-500/15 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 text-[8px] tracking-wider">
                      ● RAHALA LIVE
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>4G LTE</span>
                      <div className="w-4 h-2.5 bg-slate-700 rounded-xs relative overflow-hidden border border-slate-600">
                        <span className="h-full bg-emerald-500 block w-[85%]"></span>
                      </div>
                    </div>
                  </div>

                  {/* Inside Screen Container */}
                  <div className="bg-[#fcfbfa] min-h-[580px] max-h-[720px] overflow-y-auto px-4 py-4 relative scrollbar-none">
                    
                    {/* If Payment Portal modal is open */}
                    <AnimatePresence>
                      {paymentPortalOpen && payingProvider && (
                        <motion.div 
                          initial={{ opacity: 0, y: 150 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 250 }}
                          className="absolute inset-0 z-40 bg-[#fcfbfa] p-5 flex flex-col justify-between overflow-y-auto"
                        >
                          <div>
                            {/* Securing badge */}
                            <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-5">
                              <h3 className="text-sm font-black uppercase text-slate-800 font-mono tracking-wider flex items-center gap-2">
                                <Lock size={15} className="text-emerald-500 animate-pulse" />
                                {currentT('paySecureTitle')}
                              </h3>
                              <button 
                                onClick={() => setPaymentPortalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-xs font-mono font-bold uppercase transition"
                              >
                                CLOSE ✕
                              </button>
                            </div>

                            {/* Provider Summary */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] mb-5 flex items-center justify-between">
                              <div>
                                <span className="block text-[8px] font-mono tracking-widest text-[#d4af37] font-black uppercase">
                                  SUBSCRIBING FOR
                                </span>
                                <span className="font-extrabold text-[#334155] block text-sm">
                                  {payingProvider.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="block text-xs font-mono font-black text-emerald-600">
                                  {payingProvider.pricing[language] || payingProvider.pricing['en']}
                                </span>
                                <span className="text-[9px] text-[#94A3B8] block">
                                  {duration} Days Covered
                                </span>
                              </div>
                            </div>

                            {/* Payment channels toggle tab */}
                            <div className="grid grid-cols-2 gap-2 mb-5">
                              <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={`py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                                  paymentMethod === 'card'
                                    ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-md'
                                    : 'bg-white border-slate-200 text-slate-600'
                                  }`}
                              >
                                <CreditCard size={13} />
                                <span>CIB / DAHABIA</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPaymentMethod('mobile')}
                                className={`py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                                  paymentMethod === 'mobile'
                                    ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-md'
                                    : 'bg-white border-slate-200 text-[#334155]'
                                }`}
                              >
                                <Smartphone size={13} />
                                <span>BARIDIMOB</span>
                              </button>
                            </div>

                            {paymentStatus === 'idle' && (
                              <form onSubmit={processSecureCheckout} className="space-y-4">
                                {paymentMethod === 'card' ? (
                                  <>
                                    {/* Gorgeous Virtual Card Preview */}
                                    <div className="h-36 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white p-4 border border-indigo-500/20 shadow-lg relative flex flex-col justify-between overflow-hidden">
                                      <div className="absolute top-0 right-0 p-3 opacity-15">
                                        <Globe size={110} />
                                      </div>
                                      
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <span className="block text-[8px] font-mono tracking-widest text-[#d4af37] font-extrabold uppercase">
                                            BANQUE D'ALGERIE
                                          </span>
                                          <div className="flex gap-1.5 items-center mt-0.5">
                                            <span className="bg-[#d4af37] w-6 h-4.5 rounded-sm inline-block"></span>
                                            <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-emerald-450">
                                              CIB PREMIUM
                                            </span>
                                          </div>
                                        </div>
                                        <span className="text-xs font-mono font-black border border-white/30 rounded-md px-1.5 text-slate-300">
                                          SATIM
                                        </span>
                                      </div>

                                      <div className="font-mono tracking-widest text-sm text-center font-extrabold">
                                        {cardNumber ? cardNumber : '4242 •••• •••• 4242'}
                                      </div>

                                      <div className="flex justify-between items-center text-[10px] font-mono">
                                        <div>
                                          <span className="block text-[6px] uppercase text-slate-400">Cardholder</span>
                                          <span>{cardHolder.toUpperCase()}</span>
                                        </div>
                                        <div className="text-right">
                                          <span className="block text-[6px] uppercase text-slate-400">Expiry</span>
                                          <span>{expiry ? expiry : '12/29'}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Credit Card inputs */}
                                    <div className="grid grid-cols-1 gap-3">
                                      <div>
                                        <label className="block text-[9px] font-bold uppercase text-[#94A3B8] mb-1">
                                          {currentT('cardNameHolder')}
                                        </label>
                                        <input
                                          type="text"
                                          required
                                          placeholder="e.g. MOHAMED BENALIA"
                                          value={cardHolder}
                                          onChange={(e) => setCardHolder(e.target.value)}
                                          className="w-full text-xs p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[9px] font-bold uppercase text-[#94A3B8] mb-1">
                                          {currentT('cardNoHolder')}
                                        </label>
                                        <input
                                          type="text"
                                          required
                                          placeholder="1234 5678 1234 5678"
                                          maxLength={19}
                                          value={cardNumber}
                                          onChange={(e) => setCardNumber(e.target.value)}
                                          className="w-full font-mono text-xs p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                                        />
                                      </div>

                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[9px] font-bold uppercase text-[#94A3B8] mb-1">
                                            Expiry (MM/YY)
                                          </label>
                                          <input
                                            type="text"
                                            required
                                            maxLength={5}
                                            placeholder="12/28"
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            className="w-full text-xs p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[9px] font-bold uppercase text-[#94A3B8] mb-1">
                                            CVV / Code
                                          </label>
                                          <input
                                            type="password"
                                            required
                                            maxLength={3}
                                            placeholder="•••"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            className="w-full text-xs p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {/* Mobile Post Algerian post transfer BaridiMob/Wimpay */}
                                    <div className="p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 flex flex-col justify-between space-y-4">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-extrabold text-[10px]">
                                            AP
                                          </div>
                                          <div>
                                            <span className="block text-[10px] font-extrabold text-[#d4af37]">
                                              BARIDIMOB CHANNELS
                                            </span>
                                            <span className="text-[9px] text-[#94A3B8] block">
                                              Algérie Poste Gateway
                                            </span>
                                          </div>
                                        </div>
                                        <span className="text-[10px] font-bold bg-emerald-600/20 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                          Instant
                                        </span>
                                      </div>

                                      <div className="space-y-3">
                                        <div>
                                          <label className="block text-[9px] font-bold uppercase text-[#94A3B8] mb-1">
                                            RIP / CCP Account Number
                                          </label>
                                          <input
                                            type="text"
                                            required
                                            placeholder="007999990001234567 89"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                            className="w-full font-mono text-xs p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                                          />
                                        </div>

                                        <div className="flex gap-2">
                                          <button
                                            type="button"
                                            onClick={() => setMobileProvider('baridimob')}
                                            className={`text-[10px] font-extrabold uppercase py-1 px-3 rounded-full border transition cursor-pointer ${
                                              mobileProvider === 'baridimob' 
                                                ? 'bg-amber-400 border-amber-400 text-slate-950 font-black' 
                                                : 'bg-transparent text-[#334155] border-[#E2E8F0] hover:bg-slate-50'
                                            }`}
                                          >
                                            BARIDI MOB
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setMobileProvider('wimpay')}
                                            className={`text-[10px] font-extrabold uppercase py-1 px-3 rounded-full border transition cursor-pointer ${
                                              mobileProvider === 'wimpay' 
                                                ? 'bg-red-500 border-red-500 text-white font-black' 
                                                : 'bg-transparent text-[#334155] border-[#E2E8F0] hover:bg-slate-50'
                                            }`}
                                          >
                                            WIMPAY (CPA)
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-[10px] text-[#94A3B8] leading-snug">
                                      * A secure transfer alert request will be sent directly to your registered BaridiMob application. Accept the task pin to finish.
                                    </div>
                                  </>
                                )}

                                <div className="mt-8 flex gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setPaymentPortalOpen(false)}
                                    className="flex-1 py-3 border border-[#E2E8F0] rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                  >
                                    {currentT('cancelBtn')}
                                  </button>
                                  <button
                                    type="submit"
                                    className="flex-2 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-850 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shadow-emerald-600/25 active:scale-97 cursor-pointer"
                                  >
                                    {currentT('processPayment')}
                                  </button>
                                </div>
                              </form>
                            )}

                            {/* PROCESSING LOADING ANIMATION SCREEN */}
                            {paymentStatus === 'processing' && (
                              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                <div className="relative">
                                  {/* Multi glowing rings */}
                                  <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                                  <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-emerald-500 border-r-emerald-500 animate-spin flex items-center justify-center">
                                    <Lock size={32} className="text-emerald-500" />
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-base font-black text-[#334155] font-mono tracking-wider">
                                    {currentT('payingTitle')}
                                  </h4>
                                  <p className="text-xs text-[#94A3B8] max-w-sm mt-3 leading-relaxed">
                                    {currentT('payingDesc')}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* SUCCESS CONFIRMATION OVERLAY WITH SHIELD AND CHECKMARKS */}
                            {paymentStatus === 'success' && (
                              <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
                                <div className="relative">
                                  {/* Glowing green emerald wave rings */}
                                  <div className="absolute -inset-6 bg-emerald-500/25 rounded-full blur-xl animate-ping-slow"></div>
                                  <div className="w-24 h-24 rounded-full bg-emerald-600 text-white flex items-center justify-center border-4 border-emerald-500/50 shadow-2xl animate-bounce-slow">
                                    <ShieldCheck size={48} className="animate-pulse" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-xl font-extrabold text-[#334155] font-display">
                                    {currentT('successTitle')}
                                  </h4>
                                  <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed px-4">
                                    {currentT('successDesc')}
                                  </p>
                                </div>

                                {/* Summary details list */}
                                <div className="w-full bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-left space-y-2 font-mono text-[10px]">
                                  <div className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-1.5">
                                    <span className="text-slate-400">ORGANIZATION:</span>
                                    <span className="font-bold text-[#334155]">{payingProvider.name}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-1.5">
                                    <span className="text-slate-400">DESTINATION:</span>
                                    <span className="font-bold text-emerald-600">{destination.toUpperCase()}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-1.5">
                                    <span className="text-slate-400">DURATION KEY:</span>
                                    <span className="font-bold text-[#334155]">{duration} DAYS</span>
                                  </div>
                                  <div className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-1.5">
                                    <span className="text-slate-400">TRANSACTION REF ID:</span>
                                    <span className="font-bold text-amber-500">DZ-SAFE-781612-A</span>
                                  </div>
                                  <div className="flex justify-between pt-1 font-bold text-xs text-[#334155]">
                                    <span>TOTAL PRICE VALUE:</span>
                                    <span className="text-emerald-500">{payingProvider.pricing[language] || payingProvider.pricing['en']}</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={confirmFullInsurance}
                                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl hover:shadow-lg transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <Check size={14} />
                                  CONFIRM & CONTINUE
                                </button>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Default Mobile Screen Comparison Flow */}
                    <div>
                      {/* Active Travel Plan banner inside app */}
                      <div className="bg-gradient-to-tr from-[#3B82F6]/5 via-[#22D3EE]/5 to-[#FDBA74]/5 rounded-2xl p-5 text-[#334155] mb-6 border border-[#E2E8F0] shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono tracking-widest text-[#d4af37] font-extrabold uppercase">
                            ACTIVE DETAILED EXPEDITION
                          </span>
                          <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                            Status: Secure
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-red-500" />
                            <span className="font-extrabold">{destination} (Algeria)</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono">
                            <Calendar size={13} className="text-amber-500" />
                            <span>{duration} Days</span>
                          </div>
                        </div>

                        {/* Real-time AI recommendation active card details */}
                        <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                          <span className="text-[10px] font-sans text-[#94A3B8]">
                            Preferred Risk Activator:
                          </span>
                          <span className="text-xs uppercase font-mono font-extrabold text-amber-300">
                            {activity.toUpperCase()} TREKKING
                          </span>
                        </div>
                      </div>

                      {/* Insurance Listings Compare */}
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-mono font-black uppercase text-slate-500 tracking-wider">
                            Algerian Providers Offers ({insuranceProviders.length})
                          </h3>
                          {isAnalyzing && (
                            <span className="text-[9px] font-bold text-amber-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                              AI Optimizing...
                            </span>
                          )}
                        </div>

                        {insuranceProviders.map((provider) => {
                          const isRecommended = recommendedId === provider.id;
                          return (
                            <motion.div
                              key={provider.id}
                              whileHover={{ scale: 1.01 }}
                              className={`rounded-2xl p-5 border relative transition-all overflow-hidden ${
                                isRecommended
                                  ? 'border-emerald-500 bg-white shadow-xl ring-2 ring-emerald-500/20'
                                  : 'border-[#E2E8F0] bg-white hover:border-[#3B82F6] shadow-sm'
                              }`}
                            >
                              {/* Renders Glowing recommended badge */}
                              {isRecommended && (
                                <>
                                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-mono font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 animate-pulse border-b border-l border-emerald-500 select-none">
                                    <Sparkles size={11} className="animate-spin-slow" />
                                    {currentT('recommendedTag')}
                                  </div>
                                  {/* Glowing background aura */}
                                  <div className="absolute -inset-10 bg-emerald-500/5 blur-2xl pointer-events-none rounded-full" />
                                </>
                              )}

                              <div className="flex-col space-y-3 relative z-10">
                                
                                {/* Company Logo Top Left container & Name */}
                                <div className="flex items-start gap-3">
                                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${provider.logoColor} text-white flex flex-col items-center justify-center font-black text-xs shadow-md shrink-0 border border-white/20 uppercase`}>
                                    {provider.logoText}
                                  </div>
                                  <div>
                                    <h4 className="font-extrabold text-[#334155] text-sm">
                                      {provider.name}
                                    </h4>
                                    <span className="text-[9px] font-mono font-black tracking-widest text-[#d4af37]">
                                      ALGERIAN LICENSED
                                    </span>
                                  </div>
                                </div>

                                {/* Price / Nights display */}
                                <div className="flex justify-between items-center py-2 border-y border-dashed border-[#E2E8F0] my-2">
                                  <span className="text-xs text-slate-400 font-sans">
                                    Estimated Safe Premium
                                  </span>
                                  <span className="text-sm font-mono font-black text-emerald-600">
                                    {provider.pricing[language] || provider.pricing['en']}
                                  </span>
                                </div>

                                {/* Custom descriptions */}
                                <p className="text-xs text-[#334155] leading-relaxed italic">
                                  {provider.description[language] || provider.description['en']}
                                </p>

                                {/* Bullet points coverage details */}
                                <div className="space-y-1.5 py-1">
                                  {(provider.coverage[language] || provider.coverage['en']).map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed font-serif">
                                      <span className="text-emerald-500 font-black mt-0.5">✔</span>
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Support clickable phone line */}
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-2">
                                  <Phone size={11} className="text-emerald-500" />
                                  <span>{currentT('supportNo')}: </span>
                                  <a 
                                    href={`tel:${provider.phone}`} 
                                    className="font-extrabold text-slate-700 hover:underline"
                                  >
                                    {provider.phone}
                                  </a>
                                </div>

                                {/* Action Buttons Panel */}
                                <div className="grid grid-cols-2 gap-3 pt-3">
                                  {/* Visit Website external redirect button */}
                                  <a
                                    href={provider.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 rounded-xl text-[10px] font-mono font-extrabold uppercase text-[#334155] hover:bg-slate-50 transition"
                                  >
                                    <span>{currentT('visitWebsite')}</span>
                                    <ExternalLink size={11} />
                                  </a>

                                  {/* Subscribe Button */}
                                  <button
                                    onClick={() => handleOpenPayment(provider)}
                                    className={`py-2 px-3 rounded-xl text-[10.5px] font-mono font-black uppercase text-center transition tracking-wider cursor-pointer ${
                                      isRecommended
                                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 shadow-md shadow-emerald-500/25'
                                        : 'bg-slate-800 text-white hover:bg-slate-900'
                                    }`}
                                  >
                                    {currentT('subscribeNow')}
                                  </button>
                                </div>

                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </motion.div>
                
              ) : (
                
                /* FINAL SUCCESS SCREEN: Traveler Confident in Sahara (CONFIRMED JOURNEY VIEW) */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl p-6 relative"
                  id="final-safetravel-success-certificate"
                >
                  {/* Decorative background vectors for Sahara confidences */}
                  <div className="absolute inset-0 opacity-10 select-none pointer-events-none">
                    <img 
                      src="https://images.unsplash.com/photo-1545231027-63b3f16260cd?auto=format&fit=crop&w=1200&q=80" 
                      alt="Sahara desert silhouettes dunes"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Glowing Floating Golden Shield Shield */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center py-6">
                    <div className="relative mb-6">
                      <div className="absolute -inset-8 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-650 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                      <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500 via-[#d4af37] to-amber-600 text-white flex items-center justify-center shadow-2xl border-4 border-white">
                        <ShieldCheck size={56} className="animate-bounce-slow" />
                      </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-800 dark:text-white uppercase tracking-tight">
                      RAHALA CHRONICLES SECURED
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-450 font-mono tracking-widest font-extrabold uppercase mt-1">
                      ★ EXPEDITION LEVEL - COHERENT SECURITY INTEGRATED ★
                    </p>

                    <div className="max-w-md mx-auto my-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left space-y-4">
                      
                      <div className="flex items-start gap-3">
                        <FileCheck size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 font-mono">
                            OFFICIAL E-INSURANCE RECEIPT
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                            Your secure booking voucher contains a fully active SATIM coverage payload certified for extreme Saharan altitudes, hiking coordinates, and desert treks.
                          </p>
                        </div>
                      </div>

                      {/* Receipt items list */}
                      <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 space-y-2 font-mono text-[10px] text-slate-600 dark:text-slate-300">
                        <div className="flex justify-between">
                          <span>REGISTERED EXPLORER:</span>
                          <span className="font-extrabold uppercase text-slate-800 dark:text-slate-100">{currentUser?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DESIGNATED PROVINCE:</span>
                          <span className="font-extrabold uppercase text-slate-800 dark:text-slate-100">{destination} (Sahara)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>COVERAGE TIMELINE:</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-100">{duration} Days Covered</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ASSURANCE PROVIDER:</span>
                          <span className="font-extrabold text-emerald-500">{payingProvider?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>STATUS PAYMENTS CIB:</span>
                          <span className="text-emerald-500 font-black">✔ PAID (AUTHENTICATED)</span>
                        </div>
                      </div>

                      {/* Realistic simulation mockup QR Code */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white dark:bg-[#161c2b] p-3 rounded-xl border border-slate-150 dark:border-slate-800">
                        <div className="text-center sm:text-left">
                          <span className="block text-[8px] font-mono tracking-widest text-[#d4af37] font-black uppercase">
                            MOBILE PASS VOUCHER
                          </span>
                          <span className="block text-[11px] font-black font-sans text-slate-800 dark:text-slate-200">
                            Scan at Ghardaia or Djanet airport
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-1">
                            Ref: DZ-612694-AVA-E
                          </span>
                        </div>
                        
                        {/* QR Code Container */}
                        <div className="w-20 h-20 bg-white border border-slate-300 p-1 rounded-lg shrink-0 flex items-center justify-center select-none">
                          <div className="w-full h-full bg-slate-900 rounded flex flex-wrap p-0.5 justify-center items-center content-center">
                            {/* Realistic micro QR pixels mock */}
                            {[1,1,0,1,1,1,1,0,1,0,1,0,1,1,1,0,0,1,0,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1].map((p, i) => (
                              <span key={i} className={`w-[9.5%] h-[9.5%] inline-block mr-[0.5%] mb-[0.5%] ${p === 1 ? 'bg-slate-900' : 'bg-white'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm font-serif italic mb-6">
                      "Avec Rahala, voyagez en toute sécurité." (Securely logged in your profile dashboard)
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <button
                        onClick={() => {
                          setIsFullyConfirmed(false);
                          setPaymentPortalOpen(false);
                          setPaymentStatus('idle');
                        }}
                        className="flex-1 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                      >
                        ← Modify Insurance coverage
                      </button>
                      <button
                        onClick={() => {
                          // Complete flow and back to explore or dashboard!
                          window.location.reload();
                        }}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition shadow-lg active:scale-97 cursor-pointer"
                      >
                        {currentT('continueJourney')} →
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>

        </div>

      </div>
    </div>
  );
};
