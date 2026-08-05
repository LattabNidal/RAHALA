import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  X, 
  Phone, 
  Sparkles, 
  Upload, 
  ShieldCheck, 
  ChevronRight, 
  PhoneCall as WhatsappIcon,
  RefreshCw,
  Share2,
  Navigation,
  Globe,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Compass
} from 'lucide-react';
import { PriceTag } from './rahala/PriceTag';
import { LazyImage } from './rahala/LazyImage';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export interface Product {
  id: string;
  title: string;
  titleAr?: string;
  titleEn?: string;
  titleEs?: string;
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionEs?: string;
  price: number;
  category: string;
  wilaya: string;
  wilayaCode?: string;
  condition: 'Neuf' | 'Occasion';
  images: string[];
  seller: {
    name: string;
    avatar: string;
    phone: string;
    rating: number;
    reviewCount: number;
    memberSince: string;
    memberSinceAr?: string;
    memberSinceEn?: string;
    memberSinceEs?: string;
    isVerified: boolean;
    facebookProfileUrl?: string;
  };
  postedAt: string;
  postedAtAr?: string;
  postedAtEn?: string;
  postedAtEs?: string;
  viewsCount?: number;
  isFacebookMarketplace?: boolean;
  facebookMarketplaceUrl?: string;
  facebookMessengerUrl?: string;
}

const CATEGORIES = [
  'Toutes catégories',
  'Artisanat & Tapis',
  'Vêtements Traditionnels',
  'Bijoux Kabyles & Sahariens',
  'Équipement Bivouac & Camping',
  'Souvenirs & Poterie',
  'Produits du Terroir'
];

const CATEGORY_TRANSLATIONS: Record<string, { fr: string; ar: string; en: string; es: string }> = {
  'Toutes catégories': {
    fr: 'Toutes catégories',
    ar: 'جميع الفئات',
    en: 'All Categories',
    es: 'Todas las categorías'
  },
  'Artisanat & Tapis': {
    fr: 'Artisanat & Tapis',
    ar: 'صناعة تقليدية وزرابي',
    en: 'Crafts & Rugs',
    es: 'Artesanía y Alfombras'
  },
  'Vêtements Traditionnels': {
    fr: 'Vêtements Traditionnels',
    ar: 'ملابس تقليدية',
    en: 'Traditional Clothing',
    es: 'Ropa Tradicional'
  },
  'Bijoux Kabyles & Sahariens': {
    fr: 'Bijoux Kabyles & Sahariens',
    ar: 'مجوهرات قبائلية وصحراوية',
    en: 'Kabyle & Saharan Jewelry',
    es: 'Joyas Cabilas y Saharauis'
  },
  'Équipement Bivouac & Camping': {
    fr: 'Équipement Bivouac & Camping',
    ar: 'معدات تخييم ورحلات',
    en: 'Bivouac & Camping Gear',
    es: 'Equipo de Acampada'
  },
  'Souvenirs & Poterie': {
    fr: 'Souvenirs & Poterie',
    ar: 'تحف وفخار تذكاري',
    en: 'Souvenirs & Pottery',
    es: 'Recuerdos y Alfarería'
  },
  'Produits du Terroir': {
    fr: 'Produits du Terroir',
    ar: 'منتجات محلية وطبيعية',
    en: 'Local & Organic Produce',
    es: 'Productos Locales'
  }
};

const WILAYAS = [
  'Toutes les Wilayas',
  '01 - Adrar',
  '03 - Laghouat',
  '05 - Batna',
  '06 - Béjaïa',
  '07 - Biskra',
  '11 - Tamanrasset',
  '13 - Tlemcen',
  '15 - Tizi Ouzou',
  '16 - Alger',
  '17 - Djelfa',
  '19 - Sétif',
  '23 - Annaba',
  '25 - Constantine',
  '31 - Oran',
  '33 - Illizi',
  '39 - El Oued',
  '47 - Ghardaïa',
  '58 - El M\'Ghair'
];

// Coordinates for Algerian Wilayas (center points for distance math)
const WILAYA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '01 - Adrar': { lat: 27.8742, lng: -0.2939 },
  '03 - Laghouat': { lat: 33.8000, lng: 2.8651 },
  '05 - Batna': { lat: 35.5559, lng: 6.1743 },
  '06 - Béjaïa': { lat: 36.7558, lng: 5.0843 },
  '07 - Biskra': { lat: 34.8500, lng: 5.7300 },
  '11 - Tamanrasset': { lat: 22.7850, lng: 5.5220 },
  '13 - Tlemcen': { lat: 34.8783, lng: -1.3150 },
  '15 - Tizi Ouzou': { lat: 36.7118, lng: 4.0459 },
  '16 - Alger': { lat: 36.7538, lng: 3.0588 },
  '17 - Djelfa': { lat: 34.6728, lng: 3.2630 },
  '19 - Sétif': { lat: 36.1900, lng: 5.4100 },
  '23 - Annaba': { lat: 36.9000, lng: 7.7667 },
  '25 - Constantine': { lat: 36.3650, lng: 6.6147 },
  '31 - Oran': { lat: 35.6971, lng: -0.6308 },
  '33 - Illizi': { lat: 24.5500, lng: 9.4800 },
  '39 - El Oued': { lat: 33.3683, lng: 6.8674 },
  '47 - Ghardaïa': { lat: 32.4900, lng: 3.6700 },
  '58 - El M\'Ghair': { lat: 33.9500, lng: 5.9200 }
};

// Calculate Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

const MARKET_TEXTS: Record<string, { fr: string; ar: string; en: string; es: string }> = {
  tagline: {
    fr: 'E-COMMERCE ET MARKETPLACE TOURISTIQUE',
    ar: 'سوق رحالة للسياحة والصناعات التقليدية',
    en: 'E-COMMERCE & TOURISM MARKETPLACE',
    es: 'MERCADO TURÍSTICO Y DE COMERCIO LOCAL'
  },
  title: {
    fr: 'Marketplace Local',
    ar: 'السوق المحلي',
    en: 'Local Marketplace',
    es: 'Mercado Local'
  },
  subtitle: {
    fr: 'Achetez et vendez partout en Algérie — Artisanat, équipements de bivouac et souvenirs locaux.',
    ar: 'اشترِ وبع في جميع أنحاء الجزائر — صناعات تقليدية، معدات تخييم، وهدايا تذكارية محلية.',
    en: 'Buy and sell across Algeria — Local crafts, bivouac gear, and authentic souvenirs.',
    es: 'Compra y vende en toda Argelia: artesanías, equipo de acampada y recuerdos locales.'
  },
  publishBtn: {
    fr: 'Publier une annonce',
    ar: 'نشر إعلان',
    en: 'Post an Ad',
    es: 'Publicar anuncio'
  },
  searchPlaceholder: {
    fr: 'Rechercher un produit (ex: Tapis, Burnous, Tente, Dattes...)...',
    ar: 'البحث عن منتج (مثال: زرابية، قشابية، خيمة، تمور...)...',
    en: 'Search product (e.g. Rug, Burnous, Tent, Dates...)...',
    es: 'Buscar producto (ej: Alfombra, Burnous, Tienda, Dátiles...)...'
  },
  wilayaLabel: {
    fr: 'Wilaya',
    ar: 'الولاية',
    en: 'Wilaya',
    es: 'Wilaya'
  },
  allWilayas: {
    fr: 'Toutes les Wilayas',
    ar: 'جميع الولايات',
    en: 'All Wilayas',
    es: 'Todas las Wilayas'
  },
  categoryLabel: {
    fr: 'Catégorie',
    ar: 'الفئة',
    en: 'Category',
    es: 'Categoría'
  },
  conditionLabel: {
    fr: 'État du produit',
    ar: 'حالة المنتج',
    en: 'Condition',
    es: 'Estado del producto'
  },
  condAll: {
    fr: 'Tous',
    ar: 'الكل',
    en: 'All',
    es: 'Todos'
  },
  condNew: {
    fr: 'Neuf',
    ar: 'جديد',
    en: 'New',
    es: 'Nuevo'
  },
  condUsed: {
    fr: 'Occasion',
    ar: 'مستعمل',
    en: 'Used',
    es: 'Usado'
  },
  priceLabel: {
    fr: 'Prix (DZD)',
    ar: 'السعر (دج)',
    en: 'Price (DZD)',
    es: 'Precio (DZD)'
  },
  priceMin: {
    fr: 'Min',
    ar: 'الأدنى',
    en: 'Min',
    es: 'Mín'
  },
  priceMax: {
    fr: 'Max',
    ar: 'الأقصى',
    en: 'Max',
    es: 'Máx'
  },
  quickFilters: {
    fr: 'Filtres rapides :',
    ar: 'تصفية سريعة:',
    en: 'Quick filters:',
    es: 'Filtros rápidos:'
  },
  reset: {
    fr: 'Réinitialiser',
    ar: 'إعادة ضبط',
    en: 'Reset',
    es: 'Restablecer'
  },
  availableListings: {
    fr: 'Annonces disponibles',
    ar: 'إعلانات متاحة',
    en: 'Listings available',
    es: 'Anuncios disponibles'
  },
  dailyUpdates: {
    fr: 'Mises à jour quotidiennes de vendeurs vérifiés',
    ar: 'تحديثات يومية من بائعين معتمدين',
    en: 'Daily updates from verified sellers',
    es: 'Actualizaciones diarias de vendedores verificados'
  },
  noResultsTitle: {
    fr: 'Aucun produit ne correspond à votre recherche',
    ar: 'لا توجد منتجات تطابق بحثك',
    en: 'No products match your search',
    es: 'No hay productos que coincidan con tu búsqueda'
  },
  noResultsSub: {
    fr: 'Essayez de réinitialiser vos filtres ou de modifier vos termes de recherche.',
    ar: 'جرب إعادة ضبط الفلاتر أو تغيير كلمات البحث للاكتشاف المزيد من المنتجات.',
    en: 'Try resetting your filters or changing search terms to discover more local items.',
    es: 'Prueba a restablecer los filtros o cambiar tus términos de búsqueda.'
  },
  showAllBtn: {
    fr: 'Afficher toutes les annonces',
    ar: 'عرض جميع الإعلانات',
    en: 'Show all listings',
    es: 'Mostrar todos los anuncios'
  },
  viewDetails: {
    fr: 'Détails',
    ar: 'التفاصيل',
    en: 'Details',
    es: 'Detalles'
  },
  itemDesc: {
    fr: "Description de l'article :",
    ar: 'وصف المنتج:',
    en: 'Item description:',
    es: 'Descripción del artículo:'
  },
  verifiedSeller: {
    fr: 'Vendeur Vérifié',
    ar: 'بائع معتمد',
    en: 'Verified Seller',
    es: 'Vendedor Verificado'
  },
  reviews: {
    fr: 'avis',
    ar: 'تقييمات',
    en: 'reviews',
    es: 'reseñas'
  },
  memberSince: {
    fr: 'Membre depuis',
    ar: 'عضو منذ',
    en: 'Member since',
    es: 'Miembro desde'
  },
  whatsapp: {
    fr: 'WhatsApp',
    ar: 'واتساب',
    en: 'WhatsApp',
    es: 'WhatsApp'
  },
  call: {
    fr: 'Appeler',
    ar: 'اتصال',
    en: 'Call',
    es: 'Llamar'
  },
  refAd: {
    fr: 'Référence Annonce:',
    ar: 'رقم الإعلان:',
    en: 'Listing Ref:',
    es: 'Ref. Anuncio:'
  },
  share: {
    fr: 'Partager',
    ar: 'مشاركة',
    en: 'Share',
    es: 'Compartir'
  },
  modalNewTitle: {
    fr: 'Publier une nouvelle annonce',
    ar: 'نشر إعلان جديد',
    en: 'Post a New Ad',
    es: 'Publicar un nuevo anuncio'
  },
  modalNewSub: {
    fr: 'Proposez vos articles artisanaux ou de voyage aux utilisateurs de RAHALA.',
    ar: 'اعرض منتجاتك التقليدية أو معدات السفر لمستخدمي رحالة.',
    en: 'Offer your artisanal items or travel gear to RAHALA users.',
    es: 'Ofrece tus artículos artesanales o de viaje a los usuarios de RAHALA.'
  },
  formTitle: {
    fr: "Titre de l'annonce *",
    ar: 'عنوان الإعلان *',
    en: 'Ad Title *',
    es: 'Título del anuncio *'
  },
  formPrice: {
    fr: 'Prix (DZD) *',
    ar: 'السعر (دج) *',
    en: 'Price (DZD) *',
    es: 'Precio (DZD) *'
  },
  formPhone: {
    fr: 'Téléphone / WhatsApp *',
    ar: 'الهاتف / واتساب *',
    en: 'Phone / WhatsApp *',
    es: 'Teléfono / WhatsApp *'
  },
  formDesc: {
    fr: 'Description détaillée *',
    ar: 'وصف تفصيلي *',
    en: 'Detailed Description *',
    es: 'Descripción detallada *'
  },
  formPhotos: {
    fr: "Photos de l'article",
    ar: 'صور المنتج',
    en: 'Product Photos',
    es: 'Fotos del artículo'
  },
  formPhotosAdd: {
    fr: 'Ajoutez des photos de votre produit',
    ar: 'أضف صورًا لمنتجك',
    en: 'Add photos of your product',
    es: 'Añade fotos de tu producto'
  },
  formUrlPlaceholder: {
    fr: "URL de l'image (https://...)",
    ar: 'رابط الصورة (https://...)',
    en: 'Image URL (https://...)',
    es: 'URL de la imagen (https://...)'
  },
  formAddBtn: {
    fr: 'Ajouter',
    ar: 'إضافة',
    en: 'Add',
    es: 'Añadir'
  },
  formDemoImages: {
    fr: 'Ou choisissez une illustration de démonstration :',
    ar: 'أو اختر صورة توضيحية تجريبية:',
    en: 'Or pick a demo illustration image:',
    es: 'O elige una imagen de demostración:'
  },
  cancel: {
    fr: 'Annuler',
    ar: 'إلغاء',
    en: 'Cancel',
    es: 'Cancelar'
  },
  publishSubmit: {
    fr: "Publier l'annonce",
    ar: 'نشر الإعلان',
    en: 'Publish Ad',
    es: 'Publicar anuncio'
  },
  toastSuccess: {
    fr: '🎉 Votre annonce a été publiée avec succès sur RAHALA Market !',
    ar: '🎉 تم نشر إعلانك بنجاح في سوق رحالة!',
    en: '🎉 Your ad has been successfully published on RAHALA Market!',
    es: '🎉 ¡Tu anuncio se ha publicado con éxito en RAHALA Market!'
  },
  linkCopied: {
    fr: 'Lien de l\'annonce copié dans le presse-papier ! 📋',
    ar: 'تم نسخ رابط الإعلان إلى الحافظة! 📋',
    en: 'Listing link copied to clipboard! 📋',
    es: '¡Enlace del anuncio copiado al portapapeles! 📋'
  },
  // New Distance & Geolocation Translations
  distanceFilter: {
    fr: 'Distance max (Proximité)',
    ar: 'أقصى مسافة (القرب)',
    en: 'Max Distance (Proximity)',
    es: 'Distancia máx (Proximidad)'
  },
  anyDistance: {
    fr: 'Toute l\'Algérie (Pas de limite)',
    ar: 'كل الجزائر (بدون حد)',
    en: 'All Algeria (No limit)',
    es: 'Toda Argelia (Sin límite)'
  },
  detectGps: {
    fr: 'Ma position GPS 🎯',
    ar: 'موقعي الجغرافي 🎯',
    en: 'My GPS Location 🎯',
    es: 'Mi ubicación GPS 🎯'
  },
  locationDetected: {
    fr: 'Position GPS activée',
    ar: 'تم تفعيل الموقع الجغرافي',
    en: 'GPS location enabled',
    es: 'Ubicación GPS activada'
  },
  awayFromYou: {
    fr: 'de votre position',
    ar: 'من موقعك الحالي',
    en: 'away from you',
    es: 'de tu ubicación'
  },
  // New Facebook Marketplace Translations
  fbPlatformFilter: {
    fr: 'Plateforme',
    ar: 'المنصة',
    en: 'Platform',
    es: 'Plataforma'
  },
  fbAll: {
    fr: 'Toutes les sources',
    ar: 'جميع المصادر',
    en: 'All Sources',
    es: 'Todas las fuentes'
  },
  fbOnly: {
    fr: 'Facebook Marketplace 🌐',
    ar: 'فيسبوك ماركت بليس 🌐',
    en: 'Facebook Marketplace 🌐',
    es: 'Facebook Marketplace 🌐'
  },
  rahalaOnly: {
    fr: 'Vendeurs Directs Rahala 🛍️',
    ar: 'بائعو رحالة المباشرون 🛍️',
    en: 'Direct Rahala Sellers 🛍️',
    es: 'Vendedores Directos Rahala 🛍️'
  },
  fbBadge: {
    fr: 'Disponible sur Facebook Marketplace',
    ar: 'متاح في فيسبوك ماركت بليس',
    en: 'Available on Facebook Marketplace',
    es: 'Disponible en Facebook Marketplace'
  },
  openFbMarketplace: {
    fr: 'Voir l\'annonce sur Facebook 🌐',
    ar: 'عرض الإعلان في فيسبوك 🌐',
    en: 'View listing on Facebook 🌐',
    es: 'Ver anuncio en Facebook 🌐'
  },
  messengerContact: {
    fr: 'Messenger 💬',
    ar: 'مسنجر 💬',
    en: 'Messenger 💬',
    es: 'Messenger 💬'
  },
  exportToFb: {
    fr: 'Exporter vers Facebook Marketplace 📲',
    ar: 'تصدير الإعلان إلى فيسبوك ماركت 📲',
    en: 'Export to Facebook Marketplace 📲',
    es: 'Exportar a Facebook Marketplace 📲'
  },
  fbFormCheckbox: {
    fr: 'Synchroniser également sur Facebook Marketplace 🌐',
    ar: 'مزامنة الإعلان أيضاً في فيسبوك ماركت بليس 🌐',
    en: 'Also sync to Facebook Marketplace 🌐',
    es: 'Sincronizar también en Facebook Marketplace 🌐'
  },
  fbFormUrl: {
    fr: 'Lien Profil Facebook / Messenger (Optionnel)',
    ar: 'رابط ملف فيسبوك / مسنجر (اختياري)',
    en: 'Facebook Profile / Messenger Link (Optional)',
    es: 'Enlace del perfil de Facebook / Messenger (Opcional)'
  },
  exportModalTitle: {
    fr: 'Exporter sur Facebook Marketplace',
    ar: 'تصدير إلى فيسبوك ماركت بليس',
    en: 'Export to Facebook Marketplace',
    es: 'Exportar a Facebook Marketplace'
  },
  exportModalSub: {
    fr: 'Copiez la description optimisée ci-dessous et publiez-la directement sur Facebook Marketplace.',
    ar: 'انسخ الوصف المنسق أدناه وقم بنشره مباشرة في فيسبوك ماركت بليس.',
    en: 'Copy the optimized description below and publish it directly to Facebook Marketplace.',
    es: 'Copia la descripción optimizada a continuación y publícala en Facebook Marketplace.'
  },
  copyDescription: {
    fr: 'Copier le texte complet',
    ar: 'نسخ النص الكامل',
    en: 'Copy full description',
    es: 'Copiar texto completo'
  },
  copiedSuccess: {
    fr: 'Texte copié ! Prêt à coller sur Facebook Marketplace. 📋',
    ar: 'تم نسخ النص! جاهز للزيادة في فيسبوك ماركت بليس. 📋',
    en: 'Text copied! Ready to paste into Facebook Marketplace. 📋',
    es: '¡Texto copiado! Listo para pegar en Facebook Marketplace. 📋'
  },
  launchFbCreate: {
    fr: 'Ouvrir Facebook Marketplace ↗',
    ar: 'فتح فيسبوك ماركت بليس ↗',
    en: 'Open Facebook Marketplace ↗',
    es: 'Abrir Facebook Marketplace ↗'
  }
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Tapis Zerba Traditionnel M\'Zab en Pure Laine',
    titleAr: 'زرابية ميزابية تقليدية من الصوف الخالص',
    titleEn: 'Pure Wool Traditional M\'Zab Zerba Rug',
    titleEs: 'Alfombra Tradicional M\'Zab Zerba en Pura Lana',
    description: 'Authentique tapis artisanal fait main par les tisserandes de la vallée du M\'Zab (Ghardaïa). Laine vierge naturelle aux motifs géométriques berbères séculaires. Dimensions: 200cm x 150cm.',
    descriptionAr: 'زرابية تقليدية أصيلة مصنوعة يدويًا من قبل نسج وادي ميزاب (غرداية). صوف طبيعي خالص بنقوش بربرية هندسية عريقة. الأبعاد: 200سم × 150سم.',
    descriptionEn: 'Authentic handmade artisanal rug by weavers of M\'Zab valley (Ghardaia). Natural pure wool with ancient Berber geometric patterns. Dimensions: 200cm x 150cm.',
    descriptionEs: 'Auténtica alfombra artesanal hecha a mano por las tejedoras del valle del M\'Zab (Ghardaïa). Lana virgen natural con motivos geométricos bereberes ancestrales.',
    price: 38000,
    category: 'Artisanat & Tapis',
    wilaya: '47 - Ghardaïa',
    condition: 'Neuf',
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Maison de l\'Artisanat M\'Zab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      phone: '+213 661 23 45 67',
      rating: 4.9,
      reviewCount: 34,
      memberSince: 'Mars 2024',
      memberSinceAr: 'مارس 2024',
      memberSinceEn: 'March 2024',
      memberSinceEs: 'Marzo 2024',
      isVerified: true,
      facebookProfileUrl: 'https://facebook.com/marketplace'
    },
    postedAt: 'Il y a 2 heures',
    postedAtAr: 'منذ ساعتين',
    postedAtEn: '2 hours ago',
    postedAtEs: 'Hace 2 horas',
    viewsCount: 142,
    isFacebookMarketplace: true,
    facebookMarketplaceUrl: 'https://www.facebook.com/marketplace/item/100019283749',
    facebookMessengerUrl: 'https://m.me/rahalamarketplace'
  },
  {
    id: 'prod-2',
    title: 'Burnous Traditionnel Saharien (Kachabia Chameau)',
    titleAr: 'قشابية وربنوس صحراوي تقليدي (وبر الإبل الخالص)',
    titleEn: 'Traditional Saharan Burnous (Camel Wool Kachabia)',
    titleEs: 'Burnous Tradicional Sahariano (Kachabia de Camello)',
    description: 'Kachabia haut de gamme tissée en poil de chameau véritable ( الوبر الصافي ). Chaude, résistante et idéale pour les nuits fraîches du Sahara et les grands froids.',
    descriptionAr: 'قشابية فاخرة منسوجة من وبر الإبل الأصلي الصافي. دافئة، متينة ومثالية لليالي الصحراء الباردة والشتاء.',
    descriptionEn: 'High-end Kachabia woven from genuine camel hair (الوبر الصافي). Warm, durable, ideal for chilly Saharan nights and extreme cold.',
    descriptionEs: 'Kachabia de alta gama tejida con auténtico pelo de camello (الوبر الصافي). Cálida, resistente e ideal para las noches frescas del Sáhara.',
    price: 24500,
    category: 'Vêtements Traditionnels',
    wilaya: '17 - Djelfa',
    condition: 'Neuf',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'El-Baraka Djelfa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      phone: '+213 550 98 76 54',
      rating: 4.8,
      reviewCount: 22,
      memberSince: 'Janvier 2025',
      memberSinceAr: 'جانفي 2025',
      memberSinceEn: 'January 2025',
      memberSinceEs: 'Enero 2025',
      isVerified: true
    },
    postedAt: 'Il y a 5 heures',
    postedAtAr: 'منذ 5 ساعات',
    postedAtEn: '5 hours ago',
    postedAtEs: 'Hace 5 horas',
    viewsCount: 98,
    isFacebookMarketplace: true,
    facebookMarketplaceUrl: 'https://www.facebook.com/marketplace/item/200029384758',
    facebookMessengerUrl: 'https://m.me/elbarakadjelfa'
  },
  {
    id: 'prod-3',
    title: 'Parure Bijoux Kabyles Argent & Corail Véritable',
    titleAr: 'مجوهرات قبائلية تقليدية من الفضة والمرجان الطبيعي',
    titleEn: 'Authentic Silver & Coral Kabyle Jewelry Set',
    titleEs: 'Juego de Joyas Cabilas en Plata y Coral Natural',
    description: 'Sublime parure artisanale traditionnelle de Beni Yenni (Tizi Ouzou). Argent massif 925 ciselé et serti de corail rouge naturel certifié. Comprend collier, tadj et bracelets.',
    descriptionAr: 'طقم مجواهرات تقليدي فاخر من بني يني (تيزي وزو). فضة خالصة 925 مع مرجان أحمر طبيعي أصلي.',
    descriptionEn: 'Sublime traditional handcrafted jewelry from Beni Yenni (Tizi Ouzou). Solid 925 silver set with certified natural red coral.',
    descriptionEs: 'Juego de joyas tradicionales artesanales de Beni Yenni (Tizi Ouzou). Plata maciza 925 con coral rojo natural certificado.',
    price: 19500,
    category: 'Bijoux Kabyles & Sahariens',
    wilaya: '15 - Tizi Ouzou',
    condition: 'Neuf',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Atelier Bijoux Djurdjura',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      phone: '+213 770 12 34 56',
      rating: 5.0,
      reviewCount: 48,
      memberSince: 'Novembre 2023',
      memberSinceAr: 'نوفمبر 2023',
      memberSinceEn: 'November 2023',
      memberSinceEs: 'Noviembre 2023',
      isVerified: true
    },
    postedAt: 'Hier',
    postedAtAr: 'الأمس',
    postedAtEn: 'Yesterday',
    postedAtEs: 'Ayer',
    viewsCount: 310,
    isFacebookMarketplace: false
  },
  {
    id: 'prod-4',
    title: 'Tente Bivouac 4 Saisons Spéciale Desert Tassili',
    titleAr: 'خيمة تخييم 4 فصول خاصة بصحراء الطاسيلي',
    titleEn: '4-Season Bivouac Tent Special Tassili Desert',
    titleEs: 'Tienda de Acampada 4 Estaciones Especial Desierto Tassili',
    description: 'Tente de randonnée renforcée contre le vent et le sable, double toit aluminisé anti-UV. Utilisée seulement 2 fois lors d\'un circuit à Djanet.',
    descriptionAr: 'خيمة رحلات مقاومة للرياح والرمال مع غطاء مضاد للأشعة فوق البنفسجية. استُخدمت مرتين فقط في جولة بجانت.',
    descriptionEn: 'Hiking tent reinforced against wind and sand, UV-resistant flysheet. Used twice during a tour in Djanet. Excellent condition.',
    descriptionEs: 'Tienda de senderismo reforzada contra el viento y la arena. Usada solo 2 veces en un circuito en Djanet.',
    price: 13500,
    category: 'Équipement Bivouac & Camping',
    wilaya: '11 - Tamanrasset',
    condition: 'Occasion',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Karim Randonneur',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      phone: '+213 662 44 55 66',
      rating: 4.7,
      reviewCount: 15,
      memberSince: 'Février 2025',
      memberSinceAr: 'فيفري 2025',
      memberSinceEn: 'February 2025',
      memberSinceEs: 'Febrero 2025',
      isVerified: false
    },
    postedAt: 'Hier',
    postedAtAr: 'الأمس',
    postedAtEn: 'Yesterday',
    postedAtEs: 'Ayer',
    viewsCount: 205,
    isFacebookMarketplace: true,
    facebookMarketplaceUrl: 'https://www.facebook.com/marketplace/item/300049583726',
    facebookMessengerUrl: 'https://m.me/karimrandonneur'
  },
  {
    id: 'prod-5',
    title: 'Coffret Dattes Deglet Nour de Biskra (5kg Premium)',
    titleAr: 'علبة تمور دقلة نور من بسكرة (5 كغ ممتازة)',
    titleEn: 'Biskra Deglet Nour Dates Box (5kg Premium)',
    titleEs: 'Caja de Dátiles Deglet Nour de Biskra (5kg Premium)',
    description: 'Dattes mielleuses Deglet Nour d\'Algérie récolte fraîche des palmeraies de Tolga (Biskra). Qualité d\'exportation supérieure.',
    descriptionAr: 'تمور دقلة نور الجزائرية العسلية جني حديث من بسكرة (طولقة). جودة تصدير ممتازة.',
    descriptionEn: 'Honey-sweet Algerian Deglet Nour dates fresh harvest from Tolga palm groves (Biskra). Premium export grade.',
    descriptionEs: 'Dátiles sabrosos Deglet Nour de Argelia, cosechados en los palmerales de Biskra (Tolga). Calidad superior.',
    price: 4500,
    category: 'Produits du Terroir',
    wilaya: '07 - Biskra',
    condition: 'Neuf',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Oasis Biskra Terroir',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      phone: '+213 555 11 22 33',
      rating: 4.9,
      reviewCount: 62,
      memberSince: 'Octobre 2024',
      memberSinceAr: 'أكتوبر 2024',
      memberSinceEn: 'October 2024',
      memberSinceEs: 'Octubre 2024',
      isVerified: true
    },
    postedAt: 'Il y a 2 jours',
    postedAtAr: 'منذ يومين',
    postedAtEn: '2 days ago',
    postedAtEs: 'Hace 2 días',
    viewsCount: 420,
    isFacebookMarketplace: false
  },
  {
    id: 'prod-6',
    title: 'Poterie Artisanale Émaillée de Bider Tlemcen',
    titleAr: 'فخار حرفي مطلي من بيدر تلمسان',
    titleEn: 'Handcrafted Glazed Pottery from Tlemcen',
    titleEs: 'Cerámica Artesanal Esmaltada de Tremecén',
    description: 'Vase et plats de service en argile cuite et émaillée selon la méthode ancestrale tlemcénienne. Motifs zellige traditionnels peints à la main.',
    descriptionAr: 'زهريات وأطباق من الطين الفخاري المطلي بالطريقة التلمسانية العريقة. نقوش زليج تقليدية مرسومة يدويًا.',
    descriptionEn: 'Handmade glazed clay vase and serving dishes using traditional Tlemcen techniques. Hand-painted zellige motifs.',
    descriptionEs: 'Jarrón y platos de arcilla esmaltada según el método ancestral de Tremecén. Motivos de zellige pintados a mano.',
    price: 6800,
    category: 'Souvenirs & Poterie',
    wilaya: '13 - Tlemcen',
    condition: 'Neuf',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Artisanat Andalou',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      phone: '+213 771 88 99 00',
      rating: 4.8,
      reviewCount: 19,
      memberSince: 'Décembre 2024',
      memberSinceAr: 'ديسمبر 2024',
      memberSinceEn: 'December 2024',
      memberSinceEs: 'Diciembre 2024',
      isVerified: true
    },
    postedAt: 'Il y a 3 jours',
    postedAtAr: 'منذ 3 أيام',
    postedAtEn: '3 days ago',
    postedAtEs: 'Hace 3 días',
    viewsCount: 180,
    isFacebookMarketplace: true,
    facebookMarketplaceUrl: 'https://www.facebook.com/marketplace/item/400059682711',
    facebookMessengerUrl: 'https://m.me/artisanatandalou'
  }
];

export const RahalaMarket: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { currentUser } = useApp();

  const getTxt = (key: string): string => {
    const item = MARKET_TEXTS[key];
    if (!item) return key;
    return item[language as 'fr' | 'ar' | 'en' | 'es'] || item.fr || key;
  };

  const getCategoryLabel = (catKey: string): string => {
    const item = CATEGORY_TRANSLATIONS[catKey];
    if (!item) return catKey;
    return item[language as 'fr' | 'ar' | 'en' | 'es'] || item.fr || catKey;
  };

  const getProductTitle = (prod: Product): string => {
    if (language === 'ar' && prod.titleAr) return prod.titleAr;
    if (language === 'en' && prod.titleEn) return prod.titleEn;
    if (language === 'es' && prod.titleEs) return prod.titleEs;
    return prod.title;
  };

  const getProductDesc = (prod: Product): string => {
    if (language === 'ar' && prod.descriptionAr) return prod.descriptionAr;
    if (language === 'en' && prod.descriptionEn) return prod.descriptionEn;
    if (language === 'es' && prod.descriptionEs) return prod.descriptionEs;
    return prod.description;
  };

  const getPostedAt = (prod: Product): string => {
    if (language === 'ar' && prod.postedAtAr) return prod.postedAtAr;
    if (language === 'en' && prod.postedAtEn) return prod.postedAtEn;
    if (language === 'es' && prod.postedAtEs) return prod.postedAtEs;
    return prod.postedAt;
  };

  const getMemberSince = (prod: Product): string => {
    if (language === 'ar' && prod.seller.memberSinceAr) return prod.seller.memberSinceAr;
    if (language === 'en' && prod.seller.memberSinceEn) return prod.seller.memberSinceEn;
    if (language === 'es' && prod.seller.memberSinceEs) return prod.seller.memberSinceEs;
    return prod.seller.memberSince;
  };

  const getConditionText = (cond: 'Neuf' | 'Occasion' | 'Tous'): string => {
    if (cond === 'Neuf') return getTxt('condNew');
    if (cond === 'Occasion') return getTxt('condUsed');
    return getTxt('condAll');
  };

  // State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('rahala_market_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
      }
    } catch (e) {
      console.error('Failed to parse saved products', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes catégories');
  const [selectedWilaya, setSelectedWilaya] = useState('Toutes les Wilayas');
  const [selectedCondition, setSelectedCondition] = useState<'Tous' | 'Neuf' | 'Occasion'>('Tous');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');

  // Geolocation & Distance Filter State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; label: string } | null>(() => {
    // Default to Alger (Wilaya 16) as default user center if not detected
    return { lat: 36.7538, lng: 3.0588, label: '16 - Alger' };
  });
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | null>(null); // null means All distances
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Facebook Marketplace Filter State
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'FB' | 'RAHALA'>('ALL');

  // Selected Product Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Facebook Export Modal
  const [exportProduct, setExportProduct] = useState<Product | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Artisanat & Tapis');
  const [newWilaya, setNewWilaya] = useState('16 - Alger');
  const [newCondition, setNewCondition] = useState<'Neuf' | 'Occasion'>('Neuf');
  const [newPhone, setNewPhone] = useState(currentUser?.email ? '+213 655 00 11 22' : '');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [newIsFbMarketplace, setNewIsFbMarketplace] = useState(true);
  const [newFbProfileUrl, setNewFbProfileUrl] = useState('');
  const [formError, setFormError] = useState('');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rahala_market_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Update user reference coordinates when selectedWilaya changes (if GPS not manually set)
  useEffect(() => {
    if (selectedWilaya !== 'Toutes les Wilayas' && WILAYA_COORDINATES[selectedWilaya]) {
      const coords = WILAYA_COORDINATES[selectedWilaya];
      setUserCoords({ lat: coords.lat, lng: coords.lng, label: selectedWilaya });
    }
  }, [selectedWilaya]);

  // Detect user's actual GPS location
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      triggerToast('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGps(false);
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Position GPS'
        });
        triggerToast(getTxt('locationDetected'));
      },
      (error) => {
        setIsDetectingGps(false);
        console.warn('Geolocation error:', error);
        triggerToast('Impossible d\'obtenir la position GPS. Utilisation de la Wilaya de référence.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Helper to compute distance for a product
  const getProductDistance = (prod: Product): number | null => {
    if (!userCoords) return null;
    const prodCoords = WILAYA_COORDINATES[prod.wilaya];
    if (!prodCoords) return null;
    return calculateDistanceKm(userCoords.lat, userCoords.lng, prodCoords.lat, prodCoords.lng);
  };

  // Show temporary toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    const titleMatch = getProductTitle(product).toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = getProductDesc(product).toLowerCase().includes(searchTerm.toLowerCase());
    const origTitleMatch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const wilayaMatch = product.wilaya.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSearch = searchTerm === '' || titleMatch || descMatch || origTitleMatch || wilayaMatch;

    // Category filter
    const matchesCategory = selectedCategory === 'Toutes catégories' || product.category === selectedCategory;

    // Wilaya filter
    const matchesWilaya = selectedWilaya === 'Toutes les Wilayas' || product.wilaya === selectedWilaya;

    // Condition filter
    const matchesCondition = selectedCondition === 'Tous' || product.condition === selectedCondition;

    // Price filter
    const min = priceMin ? parseFloat(priceMin) : 0;
    const max = priceMax ? parseFloat(priceMax) : Infinity;
    const matchesPrice = product.price >= min && product.price <= max;

    // Distance filter
    let matchesDistance = true;
    if (maxDistanceKm !== null) {
      const dist = getProductDistance(product);
      matchesDistance = dist !== null && dist <= maxDistanceKm;
    }

    // Platform (Facebook Marketplace) filter
    let matchesPlatform = true;
    if (platformFilter === 'FB') {
      matchesPlatform = Boolean(product.isFacebookMarketplace);
    } else if (platformFilter === 'RAHALA') {
      matchesPlatform = !product.isFacebookMarketplace;
    }

    return matchesSearch && matchesCategory && matchesWilaya && matchesCondition && matchesPrice && matchesDistance && matchesPlatform;
  });

  // Handle image upload simulation
  const handleAddSampleImage = (url: string) => {
    if (!uploadedImages.includes(url)) {
      setUploadedImages([...uploadedImages, url]);
    }
  };

  const handleCustomImageUrl = () => {
    if (newImageUrl.trim()) {
      setUploadedImages([...uploadedImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  // Form Submit Handler
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newTitle.trim()) {
      setFormError('Le titre de l\'annonce est requis.');
      return;
    }
    if (!newPrice || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
      setFormError('Veuillez saisir un prix valide en DZD.');
      return;
    }
    if (!newDescription.trim()) {
      setFormError('Veuillez décrire le produit.');
      return;
    }
    if (!newPhone.trim()) {
      setFormError('Un numéro de téléphone ou WhatsApp est requis.');
      return;
    }

    const defaultSampleImage = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80';
    const finalImages = uploadedImages.length > 0 ? uploadedImages : [defaultSampleImage];

    const cleanPhone = newPhone.replace(/[^0-9]/g, '');

    const newProd: Product = {
      id: `prod-user-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      price: Number(newPrice),
      category: newCategory,
      wilaya: newWilaya,
      condition: newCondition,
      images: finalImages,
      seller: {
        name: currentUser?.name || 'Artisan RAHALA',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        phone: newPhone.trim(),
        rating: 5.0,
        reviewCount: 1,
        memberSince: 'Aujourd\'hui',
        memberSinceAr: 'اليوم',
        memberSinceEn: 'Today',
        memberSinceEs: 'Hoy',
        isVerified: true,
        facebookProfileUrl: newFbProfileUrl.trim() || undefined
      },
      postedAt: 'À l\'instant',
      postedAtAr: 'الآن',
      postedAtEn: 'Just now',
      postedAtEs: 'Ahora mismo',
      viewsCount: 1,
      isFacebookMarketplace: newIsFbMarketplace,
      facebookMarketplaceUrl: newIsFbMarketplace ? 'https://www.facebook.com/marketplace/create/item' : undefined,
      facebookMessengerUrl: cleanPhone ? `https://m.me/${cleanPhone}` : undefined
    };

    setProducts([newProd, ...products]);
    setIsAddModalOpen(false);
    triggerToast(getTxt('toastSuccess'));

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewPrice('');
    setNewCategory('Artisanat & Tapis');
    setNewWilaya('16 - Alger');
    setNewCondition('Neuf');
    setUploadedImages([]);
    setNewIsFbMarketplace(true);
    setNewFbProfileUrl('');
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Toutes catégories');
    setSelectedWilaya('Toutes les Wilayas');
    setSelectedCondition('Tous');
    setPriceMin('');
    setPriceMax('');
    setMaxDistanceKm(null);
    setPlatformFilter('ALL');
  };

  // Generate Facebook Marketplace optimized copy text
  const generateFbExportText = (prod: Product): string => {
    return `🛍️ ${getProductTitle(prod).toUpperCase()}
💰 PRIX : ${prod.price.toLocaleString()} DZD
📍 LOCALISATION : ${prod.wilaya} (Algérie)
✨ ÉTAT : ${prod.condition}
📂 CATÉGORIE : ${getCategoryLabel(prod.category)}

📝 DESCRIPTION :
${getProductDesc(prod)}

📞 CONTACT VENDEUR / WHATSAPP : ${prod.seller.phone}
🌐 Publié via RAHALA Market - Marketplace Touristique & Artisanale Algérie`;
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] pb-24 animate-fade-in font-sans text-[#1E293B] ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 max-w-md bg-[#1E293B] text-white p-4 rounded-2xl shadow-2xl border border-[#D4AF37] flex items-center gap-3 animate-bounce">
          <Sparkles className="text-[#D4AF37] shrink-0" size={20} />
          <p className="text-xs font-semibold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* 1. HEADER SECTION */}
      <div className="bg-white border-b border-[#E2E8F0] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <ShoppingBag size={20} />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                {getTxt('tagline')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#1E293B]">
              {getTxt('title')}
            </h1>
            <p className="text-sm text-[#1E293B]/70 mt-1 font-medium">
              {getTxt('subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDetectGps}
              disabled={isDetectingGps}
              className="inline-flex items-center gap-2 px-4 py-3.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              <Navigation size={16} className={isDetectingGps ? 'animate-spin text-sky-600' : 'text-sky-600'} />
              <span>{isDetectingGps ? 'Détection...' : getTxt('detectGps')}</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D4AF37] hover:bg-[#C29B2E] text-[#1E293B] font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 shadow-md hover:scale-102 active:scale-95 cursor-pointer"
            >
              <Plus size={18} />
              <span>{getTxt('publishBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* 2. SEARCH + FILTER BAR */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-sm mb-8 space-y-4">
          
          {/* Main search input */}
          <div className="relative flex-1">
            <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-[#1E293B]/40`} size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={getTxt('searchPlaceholder')}
              className={`w-full ${isRtl ? 'pr-11 pl-10' : 'pl-11 pr-10'} py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] placeholder-[#1E293B]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition`}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 p-1 text-[#1E293B]/40 hover:text-[#1E293B]`}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Wilaya Filter */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E293B]/60 mb-1">
                {getTxt('wilayaLabel')}
              </label>
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
              >
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w === 'Toutes les Wilayas' ? getTxt('allWilayas') : w}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E293B]/60 mb-1">
                {getTxt('categoryLabel')}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* Distance Filter (Proximity Option) */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E293B]/60 mb-1 flex items-center justify-between">
                <span>{getTxt('distanceFilter')}</span>
                <Compass size={12} className="text-sky-600" />
              </label>
              <select
                value={maxDistanceKm === null ? 'ALL' : String(maxDistanceKm)}
                onChange={(e) => {
                  const val = e.target.value;
                  setMaxDistanceKm(val === 'ALL' ? null : Number(val));
                }}
                className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="ALL">{getTxt('anyDistance')}</option>
                <option value="50">&lt; 50 km</option>
                <option value="150">&lt; 150 km</option>
                <option value="300">&lt; 300 km</option>
                <option value="500">&lt; 500 km</option>
              </select>
            </div>

            {/* Platform / Facebook Marketplace Filter */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E293B]/60 mb-1 flex items-center gap-1">
                <Globe size={12} className="text-blue-600" />
                <span>{getTxt('fbPlatformFilter')}</span>
              </label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value as 'ALL' | 'FB' | 'RAHALA')}
                className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="ALL">{getTxt('fbAll')}</option>
                <option value="FB">{getTxt('fbOnly')}</option>
                <option value="RAHALA">{getTxt('rahalaOnly')}</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E293B]/60 mb-1">
                {getTxt('priceLabel')}
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder={getTxt('priceMin')}
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full py-2 px-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-[#1E293B]/40 text-xs font-bold">-</span>
                <input
                  type="number"
                  placeholder={getTxt('priceMax')}
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full py-2 px-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-[#E2E8F0]">
            <span className="text-[10px] font-mono uppercase font-bold text-[#1E293B]/50 shrink-0 mr-1">
              {getTxt('quickFilters')}
            </span>

            {/* Facebook Marketplace Quick Pill */}
            <button
              onClick={() => setPlatformFilter(platformFilter === 'FB' ? 'ALL' : 'FB')}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                platformFilter === 'FB'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Globe size={13} />
              <span>Facebook Marketplace</span>
            </button>

            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#1E293B] font-bold shadow-xs'
                      : 'bg-[#F8FAFC] text-[#1E293B]/70 hover:bg-[#E2E8F0] border border-[#E2E8F0]'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              );
            })}
            
            {(selectedCategory !== 'Toutes catégories' || selectedWilaya !== 'Toutes les Wilayas' || selectedCondition !== 'Tous' || maxDistanceKm !== null || platformFilter !== 'ALL' || searchTerm || priceMin || priceMax) && (
              <button
                onClick={resetFilters}
                className="shrink-0 ml-auto px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw size={12} />
                {getTxt('reset')}
              </button>
            )}
          </div>

        </div>

        {/* Search Results Summary & Active Location info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/60">
              {filteredProducts.length} {getTxt('availableListings')}
            </p>
            {userCoords && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 font-medium">
                <MapPin size={11} className="text-sky-600" />
                <span>Base: {userCoords.label}</span>
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#1E293B]/60 italic font-serif">
            {getTxt('dailyUpdates')}
          </div>
        </div>

        {/* 3. PRODUCT GRID (MAIN) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm my-12">
            <ShoppingBag size={48} className="mx-auto text-[#D4AF37] mb-4 opacity-50" />
            <h3 className="text-lg font-serif font-black text-[#1E293B] mb-2">
              {getTxt('noResultsTitle')}
            </h3>
            <p className="text-xs text-[#1E293B]/60 leading-relaxed mb-6">
              {getTxt('noResultsSub')}
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#1E293B] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#1E293B]/90 transition cursor-pointer"
            >
              {getTxt('showAllBtn')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => {
              const distance = getProductDistance(prod);
              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setActiveImageIndex(0);
                  }}
                  className="group bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container 4:3 Ratio */}
                    <div className="relative aspect-[4/3] bg-[#F8FAFC] overflow-hidden">
                      <LazyImage
                        src={prod.images[0]}
                        alt={getProductTitle(prod)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Condition Badge */}
                      <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} flex flex-col gap-1 items-start`}>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border shadow-xs ${
                          prod.condition === 'Neuf'
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : 'bg-slate-700 text-white border-slate-600'
                        }`}>
                          {getConditionText(prod.condition)}
                        </span>

                        {prod.isFacebookMarketplace && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white border border-blue-400 shadow-xs flex items-center gap-1">
                            <Globe size={10} />
                            FB Market
                          </span>
                        )}
                      </div>

                      {/* Distance Tag (If available) */}
                      {distance !== null && (
                        <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'}`}>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-xs flex items-center gap-1">
                            <Navigation size={10} className="text-sky-400" />
                            ~{distance} km
                          </span>
                        </div>
                      )}

                      {/* Category Overlay */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="inline-block px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-mono rounded-md truncate max-w-full">
                          {getCategoryLabel(prod.category)}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <h3 className="text-sm font-serif font-black text-[#1E293B] line-clamp-2 leading-snug mb-2 group-hover:text-[#D4AF37] transition">
                        {getProductTitle(prod)}
                      </h3>

                      {/* Price tag */}
                      <div className="mb-3">
                        <PriceTag amount={prod.price} className="text-base sm:text-lg text-[#D4AF37] font-black" />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#1E293B]/70 font-medium truncate mb-2">
                        <div className="flex items-center gap-1 truncate">
                          <MapPin size={13} className="text-[#D4AF37] shrink-0" />
                          <span className="truncate">{prod.wilaya}</span>
                        </div>
                        {distance !== null && (
                          <span className="text-[10px] text-sky-700 font-semibold shrink-0">
                            ({distance} km)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[10px] text-[#1E293B]/60 font-mono">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{getPostedAt(prod)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#D4AF37] font-bold group-hover:translate-x-0.5 transition">
                      <span>{getTxt('viewDetails')}</span>
                      <ChevronRight size={12} className={isRtl ? 'rotate-180' : ''} />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 4. PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          
          {/* Backdrop */}
          <div
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-xs cursor-pointer"
          />

          <div className="relative bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden z-10 my-8">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#D4AF37]/15 text-[#D4AF37] rounded-md border border-[#D4AF37]/30">
                  {getCategoryLabel(selectedProduct.category)}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  selectedProduct.condition === 'Neuf' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {getConditionText(selectedProduct.condition)}
                </span>

                {selectedProduct.isFacebookMarketplace && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-blue-100 text-blue-800 rounded-md border border-blue-200 flex items-center gap-1">
                    <Globe size={12} />
                    Facebook Marketplace
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-xl bg-white hover:bg-[#E2E8F0] border border-[#E2E8F0] text-[#1E293B] transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left: Gallery */}
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm relative">
                    <img
                      src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                      alt={getProductTitle(selectedProduct)}
                      className="w-full h-full object-cover"
                    />
                    {getProductDistance(selectedProduct) !== null && (
                      <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 border border-white/20">
                        <Navigation size={12} className="text-sky-400" />
                        <span>~{getProductDistance(selectedProduct)} km {getTxt('awayFromYou')}</span>
                      </div>
                    )}
                  </div>

                  {selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedProduct.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                            activeImageIndex === idx ? 'border-[#D4AF37] scale-105' : 'border-[#E2E8F0] opacity-70'
                          }`}
                        >
                          <img src={img} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Facebook Marketplace Special Banner */}
                  {selectedProduct.isFacebookMarketplace && (
                    <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-blue-800">
                        <Globe size={16} />
                        <span>{getTxt('fbBadge')}</span>
                      </div>
                      <p className="text-[11px] text-blue-700 leading-snug">
                        Cette annonce est certifiée et disponible sur Facebook Marketplace Algérie avec contact direct via Messenger ou WhatsApp.
                      </p>
                      {selectedProduct.facebookMarketplaceUrl && (
                        <a
                          href={selectedProduct.facebookMarketplaceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] transition cursor-pointer shadow-xs"
                        >
                          <span>{getTxt('openFbMarketplace')}</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Info */}
                <div className="flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1E293B] mb-3 leading-tight">
                      {getProductTitle(selectedProduct)}
                    </h2>

                    <div className="mb-4">
                      <p className="text-2xl font-black text-[#D4AF37]">
                        <PriceTag amount={selectedProduct.price} />
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#1E293B]/70 font-medium mb-4 pb-4 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-[#D4AF37]" />
                        <span>{selectedProduct.wilaya}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-[#D4AF37]" />
                        <span>{getPostedAt(selectedProduct)}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono uppercase font-bold text-[#1E293B]/60 mb-2">
                        {getTxt('itemDesc')}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#1E293B]/80 leading-relaxed font-sans">
                        {getProductDesc(selectedProduct)}
                      </p>
                    </div>
                  </div>

                  {/* Seller Box */}
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedProduct.seller.avatar}
                        alt={selectedProduct.seller.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-[#1E293B] truncate">
                            {selectedProduct.seller.name}
                          </p>
                          {selectedProduct.seller.isVerified && (
                            <span title={getTxt('verifiedSeller')}>
                              <ShieldCheck size={14} className="text-[#D4AF37] shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#1E293B]/60 font-mono mt-0.5">
                          <span className="flex items-center text-amber-500 font-bold">
                            ★ {selectedProduct.seller.rating} ({selectedProduct.seller.reviewCount} {getTxt('reviews')})
                          </span>
                          <span>•</span>
                          <span>{getTxt('memberSince')} {getMemberSince(selectedProduct)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`https://wa.me/${selectedProduct.seller.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          language === 'ar'
                            ? `مرحبًا، أنا مهتم بإعلانك في سوق رحالة: ${getProductTitle(selectedProduct)}`
                            : `Bonjour, je suis intéressé par votre annonce sur RAHALA Market: ${getProductTitle(selectedProduct)}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <WhatsappIcon size={14} />
                        {getTxt('whatsapp')}
                      </a>

                      {selectedProduct.facebookMessengerUrl ? (
                        <a
                          href={selectedProduct.facebookMessengerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                        >
                          <MessageCircle size={14} />
                          {getTxt('messengerContact')}
                        </a>
                      ) : (
                        <a
                          href={`tel:${selectedProduct.seller.phone}`}
                          className="py-2.5 bg-[#1E293B] hover:bg-[#1E293B]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                        >
                          <Phone size={14} />
                          {getTxt('call')}
                        </a>
                      )}
                    </div>

                    {/* Export / Share to FB Marketplace button */}
                    <button
                      onClick={() => {
                        setExportProduct(selectedProduct);
                        setCopiedExport(false);
                      }}
                      className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer mt-1"
                    >
                      <Globe size={14} className="text-blue-600" />
                      <span>{getTxt('exportToFb')}</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center text-xs font-mono text-[#1E293B]/60">
              <span>{getTxt('refAd')} #{selectedProduct.id}</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  triggerToast(getTxt('linkCopied'));
                }}
                className="flex items-center gap-1 text-[#D4AF37] font-bold hover:underline cursor-pointer"
              >
                <Share2 size={13} />
                {getTxt('share')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. FACEBOOK MARKETPLACE EXPORT MODAL */}
      {exportProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div
            onClick={() => setExportProduct(null)}
            className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-xs cursor-pointer"
          />

          <div className="relative bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 my-8">
            
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-blue-50">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-600 text-white">
                  <Globe size={18} />
                </span>
                <div>
                  <h3 className="text-base font-serif font-black text-blue-950">
                    {getTxt('exportModalTitle')}
                  </h3>
                  <p className="text-[11px] text-blue-800/80">
                    {getTxt('exportModalSub')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setExportProduct(null)}
                className="p-1.5 rounded-xl bg-white text-[#1E293B] hover:bg-slate-100 border border-blue-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-[#F8FAFC] p-4 border border-[#E2E8F0] rounded-2xl font-mono text-xs text-[#1E293B] whitespace-pre-wrap max-h-60 overflow-y-auto select-all">
                {generateFbExportText(exportProduct)}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(generateFbExportText(exportProduct));
                    setCopiedExport(true);
                    triggerToast(getTxt('copiedSuccess'));
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                    copiedExport ? 'bg-emerald-600 text-white' : 'bg-[#1E293B] text-white hover:bg-[#1E293B]/90'
                  }`}
                >
                  {copiedExport ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedExport ? getTxt('copiedSuccess') : getTxt('copyDescription')}</span>
                </button>

                <a
                  href="https://www.facebook.com/marketplace/create/item"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <span>{getTxt('launchFbCreate')}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. ADD PRODUCT FLOW (MODAL FORM) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-xs cursor-pointer"
          />

          <div className="relative bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 my-8">
            
            {/* Header */}
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Plus size={18} />
                </span>
                <div>
                  <h3 className="text-lg font-serif font-black text-[#1E293B]">
                    {getTxt('modalNewTitle')}
                  </h3>
                  <p className="text-[11px] text-[#1E293B]/60">
                    {getTxt('modalNewSub')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl bg-white hover:bg-[#E2E8F0] border border-[#E2E8F0] text-[#1E293B] transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateProduct} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {formError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                  {formError}
                </div>
              )}

              {/* Title & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                    {getTxt('formTitle')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'ar' ? 'مثال: زرابية يد محلية، قشابية صوف...' : 'Ex: Tapis Zerba fait main, Burnous...'}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full py-2.5 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                    {getTxt('formPrice')}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 15000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full py-2.5 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Category, Wilaya, Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                    {getTxt('categoryLabel')}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] font-semibold focus:outline-none focus:border-[#D4AF37]"
                  >
                    {CATEGORIES.filter(c => c !== 'Toutes catégories').map((c) => (
                      <option key={c} value={c}>{getCategoryLabel(c)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                    {getTxt('wilayaLabel')}
                  </label>
                  <select
                    value={newWilaya}
                    onChange={(e) => setNewWilaya(e.target.value)}
                    className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] font-semibold focus:outline-none focus:border-[#D4AF37]"
                  >
                    {WILAYAS.filter(w => w !== 'Toutes les Wilayas').map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                    {getTxt('conditionLabel')}
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as 'Neuf' | 'Occasion')}
                    className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] font-semibold focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Neuf">{getTxt('condNew')}</option>
                    <option value="Occasion">{getTxt('condUsed')}</option>
                  </select>
                </div>
              </div>

              {/* Contact Phone & Facebook Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                    {getTxt('formPhone')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+213 6XX XX XX XX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full py-2.5 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                    {getTxt('fbFormUrl')}
                  </label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/yourprofile"
                    value={newFbProfileUrl}
                    onChange={(e) => setNewFbProfileUrl(e.target.value)}
                    className="w-full py-2.5 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Facebook Marketplace Checkbox */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                <input
                  type="checkbox"
                  id="fbSyncCheck"
                  checked={newIsFbMarketplace}
                  onChange={(e) => setNewIsFbMarketplace(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="fbSyncCheck" className="text-xs font-bold text-blue-900 cursor-pointer">
                  {getTxt('fbFormCheckbox')}
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                  {getTxt('formDesc')}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={language === 'ar' ? 'صف التفاصيل والأبعاد وحالة المنتج...' : 'Décrivez l\'origine, les dimensions, l\'état ou les détails de l\'article...'}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Image Upload section */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                  {getTxt('formPhotos')}
                </label>
                
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-2xl p-4 bg-[#F8FAFC] text-center space-y-3">
                  <Upload size={24} className="mx-auto text-[#D4AF37]" />
                  <p className="text-xs text-[#1E293B]/70 font-medium">
                    {getTxt('formPhotosAdd')}
                  </p>

                  <div className="flex gap-2 max-w-md mx-auto">
                    <input
                      type="url"
                      placeholder={getTxt('formUrlPlaceholder')}
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 py-1.5 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={handleCustomImageUrl}
                      className="px-3 py-1.5 bg-[#1E293B] text-white text-xs font-bold rounded-xl hover:bg-[#1E293B]/90 cursor-pointer"
                    >
                      {getTxt('formAddBtn')}
                    </button>
                  </div>

                  {/* Sample presets */}
                  <div className="pt-2">
                    <p className="text-[10px] font-mono text-[#1E293B]/50 uppercase mb-2">
                      {getTxt('formDemoImages')}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        { name: language === 'ar' ? 'زرابية' : 'Tapis', url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80' },
                        { name: language === 'ar' ? 'لباس' : 'Vêtement', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
                        { name: language === 'ar' ? 'مجوهرات' : 'Bijoux', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
                        { name: language === 'ar' ? 'تخييم' : 'Bivouac', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80' },
                        { name: language === 'ar' ? 'فخار' : 'Poterie', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80' }
                      ].map((sample) => (
                        <button
                          key={sample.name}
                          type="button"
                          onClick={() => handleAddSampleImage(sample.url)}
                          className="px-2.5 py-1 bg-white border border-[#E2E8F0] text-[10px] font-semibold text-[#1E293B] rounded-lg hover:border-[#D4AF37] cursor-pointer"
                        >
                          + {sample.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Uploaded thumbnails */}
                {uploadedImages.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {uploadedImages.map((img, i) => (
                      <div key={i} className="relative w-16 h-12 rounded-lg overflow-hidden border border-[#E2E8F0] shrink-0">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-black/70 text-white rounded-full"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#E2E8F0] flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#1E293B] rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  {getTxt('cancel')}
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C29B2E] text-[#1E293B] rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md hover:scale-102 active:scale-95 cursor-pointer"
                >
                  {getTxt('publishSubmit')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
