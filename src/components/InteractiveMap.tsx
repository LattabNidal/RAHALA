import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Check, 
  Star, 
  Search, 
  Sparkles, 
  Layers, 
  Route, 
  Info, 
  X, 
  Utensils, 
  ChevronRight, 
  Car, 
  Footprints, 
  Bus, 
  Plus, 
  Volume2, 
  Phone,
  Settings,
  AlertCircle,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { Landmark, Hotel } from '../types';
import { heritageDb, HeritageItem } from '../data/heritageData';
import { EnhancedPlaceDetails } from './EnhancedPlaceDetails';
import { UnescoDocumentModal } from './UnescoDocumentModal';
import { SantaCruzDocumentModal } from './SantaCruzDocumentModal';
import { TassiliDocumentModal } from './TassiliDocumentModal';

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const santaCruzFolderModules = import.meta.glob('/src/assets/images/Santa Cruz Fort & Chapelle Notre-Dame du Salut/*.{webp,jpg,JPG,jpeg,png}', { eager: true, import: 'default' });
const santaCruzImagesList = Object.values(santaCruzFolderModules) as string[];

const primarySantaCruzImage = santaCruzImagesList.find(img => img.includes('Capture+d’écran') || img.includes('Capture') || img.includes('Fort_Santa_Cruz_Oran1') || img.includes('Fort-de-Santa-Cruz'))
  || santaCruzImagesList[0] 
  || '/src/assets/images/santa_cruz_oran_chapel_1784672157047.jpg';

const constantineFolderModules = import.meta.glob('/src/assets/images/Suspension Bridges of Constantine/*.{webp,jpg,JPG,jpeg,png}', { eager: true, import: 'default' });
const constantineImagesList = Object.values(constantineFolderModules) as string[];

const primaryConstantineImage = constantineImagesList.find(img => img.includes('shutterstock') || img.includes('images')) 
  || constantineImagesList[0] 
  || '/src/assets/images/Suspension Bridges of Constantine/images.webp';

const timgadFolderModules = import.meta.glob('/src/assets/images/Timgad Roman Ruins/*.{webp,jpg,JPG,jpeg,png,jfif,JFIF}', { eager: true, import: 'default' });
const timgadImagesList = Array.from(new Set(Object.values(timgadFolderModules) as string[])).filter(Boolean);

const primaryTimgadImage = timgadImagesList.find(img => img.includes('1536x864_cmsv2') || img.includes('Ruins-Roman-City') || img.includes('ruins-of-timgad') || img.includes('shutterstock')) 
  || timgadImagesList[0] 
  || '/src/assets/images/Timgad Roman Ruins/1536x864_cmsv2_2dc330f0-bb03-5e8b-a79c-6039766aa6d4-6820234.webp';

export interface PlaceItem {
  id: string;
  name: string;
  category: 'hotel' | 'restaurant' | 'monument' | 'plage' | 'favorite' | 'hidden-gem';
  lat: number;
  lng: number;
  rating: number;
  image: string;
  price?: string;
  description: {
    en: string;
    fr: string;
    ar: string;
    es?: string;
  };
  address: string;
  specialty?: {
    en: string;
    fr: string;
    ar: string;
    es?: string;
  };
}

// Coordinate projection helper mapping lat/lng to 800x600 SVG vector dimensions
const projectLatLngToSVG = (lat: number, lng: number) => {
  const minLng = -2.5;
  const maxLng = 10.5;
  const minLat = 22.0;
  const maxLat = 37.5;

  const x = 120 + ((lng - minLng) / (maxLng - minLng)) * 560;
  const y = 480 - ((lat - minLat) / (maxLat - minLat)) * 420;

  return {
    x: Math.max(90, Math.min(710, x)),
    y: Math.max(50, Math.min(530, y))
  };
};

const placesDb: PlaceItem[] = [
  {
    id: 'maqam-chahid',
    name: 'Mémorial des Martyrs (Maqam El Chahid)',
    category: 'monument',
    lat: 36.7456,
    lng: 3.0697,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1596120206305-c10b0058bcde?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Teeming dome in Algiers commemorating the war of independence. Symbol of modern Algeria.',
      fr: 'Le monument emblématique d\'Alger de la révolution d\'indépendance. Offre un dôme majestueux.',
      ar: 'مقام الشهيد الرمز الخالد لمدينة الجزائر المخلّد لثورة التحرير المظفرة.'
    },
    address: 'Chemin El-Anasser, Alger',
    specialty: {
      en: 'Historic Centerpiece',
      fr: 'Édifice Historique Majeur',
      ar: 'معلم تاريخي مركزي'
    }
  },
  {
    id: 'bastion-23',
    name: 'Palais des Raïs (Bastion 23)',
    category: 'monument',
    lat: 36.7845,
    lng: 3.0624,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'An impressive historic fortress on the sea showing Algiers corsair-era maritime architecture.',
      fr: 'Merveilleux ensemble de palais ottomans fortifiés face au port d\'Alger.',
      ar: 'قصر الرايس (البستيون 23) مجمع عثماني فاخر على شاطئ البحر يروي التاريخ.'
    },
    address: 'Boulevard Amara Rachid, Alger',
    specialty: {
      en: 'Ottoman Architecture',
      fr: 'Architecture Ottomane',
      ar: 'عمارة عثمانية أصيلة'
    }
  },
  {
    id: 'el-aurassi',
    name: 'Maison d\'Hôtes El Aurassi',
    category: 'hotel',
    lat: 36.7812,
    lng: 3.0515,
    rating: 4.7,
    price: '18,500 DZD',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Perched high in Algiers offering panoramic harbor views and beautiful custom stays.',
      fr: 'Surplombant la baie d\'Alger, cet hôtel de prestige offre un panorama unique.',
      ar: 'فندق الأوراسي الفاخر المطل على خليج الجزائر الساحر.'
    },
    address: '2 Avenue Frantz Fanon, Alger',
    specialty: {
      en: 'Panoramic Bay Views',
      fr: 'Vue sur la Baie',
      ar: 'إطلالة بانورامية كاملة'
    }
  },
  {
    id: 'caracoya-rest',
    name: 'Le Caracoya',
    category: 'restaurant',
    lat: 36.7562,
    lng: 3.0610,
    rating: 4.9,
    price: '3,800 DZD',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Authentic traditional central Algiers dining with custom clay-pot recipes.',
      fr: 'Tajine parfumé et couscous cuit au feu traditionnel au cœur de la Casbah.',
      ar: 'مطعم الكاراكويا يقدم أشهى الأطباق العاصمية والجزائرية التقليدية.'
    },
    address: 'Vieille Casbah (Bas), Alger',
    specialty: {
      en: 'Authentic Algerois Couscous',
      fr: 'Couscous Algérois Fait Maison',
      ar: 'الكسكسي العاصمي التقليدي'
    }
  },
  {
    id: 'el-boustene-rest',
    name: 'Restaurant El-Boustene',
    category: 'restaurant',
    lat: 36.7459,
    lng: 3.0712,
    rating: 4.7,
    price: '4,500 DZD',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Delightful garden restaurant under the Martyrs monument with classical heritage menus.',
      fr: 'Grande table prestigieuse nichée dans le parc avec plats traditionnels revisités.',
      ar: 'مطعم البستان الشهير لتجربة أرقى المأكولات بجوار مقام الشهيد.'
    },
    address: 'Parc de Riad El Feth, Alger',
    specialty: {
      en: 'Imperial Tagine El Bey',
      fr: 'Tagine Royal de l\'Émir',
      ar: 'طاجين الباي الملكي'
    }
  },
  {
    id: 'fort-santa-cruz',
    name: 'Fort de Santa Cruz',
    category: 'monument',
    lat: 35.6971,
    lng: -0.6308,
    rating: 4.9,
    image: primarySantaCruzImage,
    description: {
      en: 'Historic fort built on Mt Murdjadjo by Spanish rulers with breathtaking coast views.',
      fr: 'Fort historique majestueux dominant la ville d\'Oran depuis le mont Murdjadjo.',
      ar: 'حصن سانتا كروز الشهير المعلق على جبل مرجاجو في وهران الباهية.'
    },
    address: 'Mont Murdjadjo, Oran',
    specialty: {
      en: 'Panoramic Coast Overlook',
      fr: 'Panorama Maritime Unique',
      ar: 'إطلالة بحرية بانورامية'
    }
  },
  {
    id: 'royal-hotel-oran',
    name: 'Royal Hotel - MGallery',
    category: 'hotel',
    lat: 35.7018,
    lng: -0.6322,
    rating: 4.8,
    price: '21,000 DZD',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Historic luxury boutique hotel in Oran with neoclassic designs.',
      fr: 'Prestigieux hôtel 5 étoiles d\'époque au grand style architectural.',
      ar: 'فندق رويال إم جاليري الفاخر التاريخي وسط مدينة وهران.'
    },
    address: '1 Boulevard de la Soummam, Oran',
    specialty: {
      en: 'Neo-Classical Luxury',
      fr: 'Prestige Néo-classique',
      ar: 'فخامة كلاسيكية ملكية'
    }
  },
  {
    id: 'tyrolien-rest',
    name: 'Le Tyrolien Oran',
    category: 'restaurant',
    lat: 35.7001,
    lng: -0.6354,
    rating: 4.8,
    price: '3,200 DZD',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Cozy coastal bistro serving ocean grill collections and Mediterranean specials.',
      fr: 'Un superbe restaurant méditerranéen servant la pêche fraîche d\'Oran.',
      ar: 'مطعم التيروليان يقدم أشهى ثمار البحر المتوسطية الطازجة بوهران.'
    },
    address: 'Rue Pasteur, Oran',
    specialty: {
      en: 'Fresh Seafood Catch',
      fr: 'Poissons Grillés & Fruits de Mer',
      ar: 'ثمار البحر المشوية'
    }
  },
  {
    id: 'sidi-mcid-bridge',
    name: 'Pont Suspendu Sidi M\'Cid',
    category: 'monument',
    lat: 36.3695,
    lng: 6.6171,
    rating: 4.9,
    image: primaryConstantineImage,
    description: {
      en: 'The spectacular suspension bridge suspended 175m above the rocky gorge of Rhumel.',
      fr: 'Le chef d\'œuvre légendaire reliant les falaises de Constantine à hauteur vertigineuse.',
      ar: 'جعر سيدي مسيد المعلق التاريخي رمز عراقة قسنطينة الخالد.'
    },
    address: 'Route Sidi M\'Cid, Constantine',
    specialty: {
      en: 'Extreme Canyon Heights',
      fr: 'Frisson Vertigineux unique',
      ar: 'إطلالة الجرف الشامخة'
    }
  },
  {
    id: 'ruines-timgad',
    name: 'Ruines de Timgad (Thamugadi)',
    category: 'monument',
    lat: 35.4844,
    lng: 6.4681,
    rating: 4.9,
    image: primaryTimgadImage,
    description: {
      en: 'Known as the Pompeii of North Africa, created by Emperor Trajan in AD 100.',
      fr: 'Surnommée la Pompéi d\'Afrique du Nord, colonie militaire romaine fondée par Trajan en l\'an 100.',
      ar: 'مدينة تيمقاد الأثرية الرومانية الشامخة بباتنة المصنفة تراثاً عالمياً.'
    },
    address: 'Timgad, Batna',
    specialty: {
      en: 'UNESCO Roman Heritage',
      fr: 'Cité Romaine Classée UNESCO',
      ar: 'موقع روماني عالمي اليونسكو'
    }
  },
  {
    id: 'marriott-constantine',
    name: 'Constantine Marriott Hotel',
    category: 'hotel',
    lat: 36.3481,
    lng: 6.6310,
    rating: 4.9,
    price: '24,000 DZD',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Sumptuous imperial suites inspired by classic palatial design of Cirta.',
      fr: 'Complexe hôtelier prestigieux de haut standard avec dôme et jardins royaux.',
      ar: 'منتجع ماريوت قسنطينة المعماري الراقي بضيافة متميزة.'
    },
    address: 'Cité Universitaire, Constantine',
    specialty: {
      en: 'Palace Style Living',
      fr: 'Luxe Arabesque Impérial',
      ar: 'طراز القصور الأندلسي'
    }
  },
  {
    id: 'coin-dor-rest',
    name: 'Le Coin d\'Or Constantine',
    category: 'restaurant',
    lat: 36.3638,
    lng: 6.6120,
    rating: 4.7,
    price: '2,800 DZD',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Acclaimed Constantine traditional bistro with wood-fired slow stews.',
      fr: 'Table locale célèbre servant l\'authentique Chakhchoukha de l\'est.',
      ar: 'مطعم العائلة القسنطينية الأصيلة للشخشوخة وتريدة العز.'
    },
    address: 'Boulevard Belouizdad, Constantine',
    specialty: {
      en: 'Traditional Chakhchoukha',
      fr: 'Authentique Chakhchoukha',
      ar: 'تريدة قسنطينية فخمة'
    }
  },
  {
    id: 'ksar-ghardaia',
    name: 'M\'zab Valley Old Ksar',
    category: 'monument',
    lat: 32.4909,
    lng: 3.6730,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1530521951415-32410a74134f?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Beautiful centuries-old dessert architecture arranged inside pyramids around the mosque.',
      fr: 'Cité médiévale de Ghardaïa classée par l\'UNESCO à l\'incroyable structure en terre cuite.',
      ar: 'قصر غرداية الأثري الفريد بهندسة معمارية بوادي ميزاب مصنف باليونسكو.'
    },
    address: 'Vieux Ksar, Ghardaïa',
    specialty: {
      en: 'UNESCO Brick Architecture',
      fr: 'Habitat Ocre Classé',
      ar: 'عمارة صحراوية ميزابية'
    }
  },
  {
    id: 'oasis-nomad',
    name: 'Oasis Desert Caravan Tent',
    category: 'restaurant',
    lat: 24.5550,
    lng: 9.4862,
    rating: 4.9,
    price: '2,200 DZD',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Desert dunes tent cooking fresh taguella bread directly under Sahara coals.',
      fr: 'Expérience authentique sous tente nomade : pain de sable Touareg et thé.',
      ar: 'خيمة الضيافة الطارقية الأصلية لخبز الملا والشاي الأزوادي بجانت.'
    },
    address: 'Zelouaz Center, Djanet',
    specialty: {
      en: 'Authentic Desert Taguella',
      fr: 'Taguella Traditionnelle',
      ar: 'خبز الملا الطارقي الفاخر'
    }
  },
  {
    id: 'tin-akachaker',
    name: 'Camp Tin Akachaker',
    category: 'hotel',
    lat: 24.2100,
    lng: 9.7200,
    rating: 5.0,
    price: '16,000 DZD',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Elite Saharan glamping nestled in incredible red sand canyons.',
      fr: 'Dômes de toile luxueux posés au milieu de dunes spectaculaires de Djanet.',
      ar: 'مخيم فخم وسط كثبان حمراء ساحرة بصحراء جانت العظيمة.'
    },
    address: 'Dunes Rouges de Djanet, Sahara',
    specialty: {
      en: 'Sahara Star Gazing',
      fr: 'Bivouac Étoilé Magique',
      ar: 'ضيافة أزواديّة تحت الشهب'
    }
  },
  {
    id: 'plage-madagh',
    name: 'Plage de Madagh (Oran)',
    category: 'plage',
    lat: 35.6358,
    lng: -0.9634,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'A gorgeous pristine beach flanked by lush green pine forests near Oran.',
      fr: 'Une plage sauvage paradisiaque nichée entre d’imposantes collines boisées à Oran.',
      ar: 'شاطئ مداغ العذري الخلاب المحاط بالغابات الكثيفة غرب وهران الباهية.',
      es: 'Una playa virgen paradisíaca rodeada de colinas boscosas en Orán.'
    },
    address: 'Plage Madagh I, Oran',
    specialty: {
      en: 'Pristine Wilderness Cove',
      fr: 'Crique sauvage naturelle',
      ar: 'خليج طبيعي بكر',
      es: 'Caleta natural salvaje'
    }
  },
  {
    id: 'plage-sidi-fredj',
    name: 'Plage Ouest de Sidi Fredj',
    category: 'plage',
    lat: 36.7628,
    lng: 2.8485,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: {
      en: 'Beautiful golden sandy beach and historical port area with water sports.',
      fr: 'Magnifique plage de sable doré bordant le port historique de Sidi Fredj.',
      ar: 'شاطئ سيدي فرج الذهبي الجميل بجوار الميناء التاريخي والرياضات المائية.',
      es: 'Hermosa playa de arena dorada junto al puerto histórico de Sidi Fredj.'
    },
    address: 'Presqu\'île de Sidi Fredj, Alger',
    specialty: {
      en: 'Water Sports & Resort',
      fr: 'Sports nautiques & Marina',
      ar: 'رياضات مائية ومنتجع سياحي',
      es: 'Deportes acuáticos y puerto deportivo'
    }
  }
];

interface InteractiveMapProps {
  setActiveView: (view: string) => void;
  setSelectedHotel?: (hotel: Hotel | null) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ setActiveView, setSelectedHotel }) => {
  const { t, isRtl, language } = useLanguage();
  const { addBooking } = useApp();

  // Categories visibility filters initialized from URL query parameters if present
  const getInitialFilterState = (categoryKey: string) => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    if (typeParam) {
      const activeTypes = typeParam.toLowerCase().split(',').map(t => t.trim());
      if (categoryKey === 'monuments') return activeTypes.includes('monuments') || activeTypes.includes('monument');
      if (categoryKey === 'plages') return activeTypes.includes('plages') || activeTypes.includes('plage') || activeTypes.includes('beaches');
      if (categoryKey === 'hotels') return activeTypes.includes('hotels') || activeTypes.includes('hotel');
      if (categoryKey === 'restaurants') return activeTypes.includes('restaurants') || activeTypes.includes('restaurant');
      if (categoryKey === 'favorites') return activeTypes.includes('favorites') || activeTypes.includes('favorite');
      if (categoryKey === 'hidden-gems') return activeTypes.includes('hidden-gems') || activeTypes.includes('hidden-gem') || activeTypes.includes('gems');
    }
    return true;
  };

  const [filterHotels, setFilterHotels] = useState(() => getInitialFilterState('hotels'));
  const [filterRestaurants, setFilterRestaurants] = useState(() => getInitialFilterState('restaurants'));
  const [filterMonuments, setFilterMonuments] = useState(() => getInitialFilterState('monuments'));
  const [filterPlages, setFilterPlages] = useState(() => getInitialFilterState('plages'));
  const [filterFavorites, setFilterFavorites] = useState(() => getInitialFilterState('favorites'));
  const [filterHiddenGems, setFilterHiddenGems] = useState(() => getInitialFilterState('hidden-gems'));

  // Sync category filter changes to the URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const activeList: string[] = [];
    if (filterMonuments) activeList.push('monuments');
    if (filterPlages) activeList.push('plages');
    if (filterHotels) activeList.push('hotels');
    if (filterRestaurants) activeList.push('restaurants');
    if (filterFavorites) activeList.push('favorites');
    if (filterHiddenGems) activeList.push('hidden-gems');

    if (activeList.length === 6) {
      params.delete('type');
    } else {
      params.set('type', activeList.join(','));
    }

    const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState({}, '', newUrl);
  }, [filterMonuments, filterPlages, filterHotels, filterRestaurants, filterFavorites, filterHiddenGems]);

  // Sync filters from URL if back/forward button is pressed (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type');
      if (typeParam) {
        const activeTypes = typeParam.toLowerCase().split(',').map(t => t.trim());
        setFilterMonuments(activeTypes.includes('monuments') || activeTypes.includes('monument'));
        setFilterPlages(activeTypes.includes('plages') || activeTypes.includes('plage') || activeTypes.includes('beaches'));
        setFilterHotels(activeTypes.includes('hotels') || activeTypes.includes('hotel'));
        setFilterRestaurants(activeTypes.includes('restaurants') || activeTypes.includes('restaurant'));
        setFilterFavorites(activeTypes.includes('favorites') || activeTypes.includes('favorite'));
        setFilterHiddenGems(activeTypes.includes('hidden-gems') || activeTypes.includes('hidden-gem') || activeTypes.includes('gems'));
      } else {
        setFilterMonuments(true);
        setFilterPlages(true);
        setFilterHotels(true);
        setFilterRestaurants(true);
        setFilterFavorites(true);
        setFilterHiddenGems(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Custom Favorites & Hidden Gems pins
  const [customPins, setCustomPins] = useState<PlaceItem[]>(() => {
    try {
      const saved = sessionStorage.getItem('RAHALA_CUSTOM_PINS');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveCustomPins = (pins: PlaceItem[]) => {
    setCustomPins(pins);
    try {
      sessionStorage.setItem('RAHALA_CUSTOM_PINS', JSON.stringify(pins));
    } catch (e) {
      console.warn("Could not save custom pins to sessionStorage:", e);
    }
  };

  // Pin Modal states
  const [showPinModal, setShowPinModal] = useState(false);
  const [customPinForm, setCustomPinForm] = useState<{ lat: number; lng: number; x: number; y: number } | null>(null);
  const [pinName, setPinName] = useState('');
  const [pinCategory, setPinCategory] = useState<'favorite' | 'hidden-gem'>('favorite');
  const [pinDescription, setPinDescription] = useState('');

  // Long press refs
  const svgRef = useRef<SVGSVGElement | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartPosRef = useRef<{ x: number, y: number } | null>(null);

  const startLongPressTimer = (clientX: number, clientY: number) => {
    pressStartPosRef.current = { x: clientX, y: clientY };
    if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
    longPressTimeoutRef.current = setTimeout(() => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((clientX - rect.left) / rect.width) * 800;
      const svgY = ((clientY - rect.top) / rect.height) * 600;

      // Convert back to Lat/Lng
      const minLng = -2.5;
      const maxLng = 10.5;
      const minLat = 22.0;
      const maxLat = 37.5;

      const lng = minLng + ((svgX - 120) / 560) * (maxLng - minLng);
      const lat = minLat + ((480 - svgY) / 420) * (maxLat - minLat);

      const finalLat = Math.max(19.0, Math.min(38.0, lat));
      const finalLng = Math.max(-9.0, Math.min(12.0, lng));

      setCustomPinForm({
        lat: Number(finalLat.toFixed(4)),
        lng: Number(finalLng.toFixed(4)),
        x: Math.round(svgX),
        y: Math.round(svgY)
      });
      setPinName('');
      setPinDescription('');
      setPinCategory('favorite');
      setShowPinModal(true);
      longPressTimeoutRef.current = null;
    }, 600); // 600ms for long-press threshold
  };

  const cancelLongPressTimer = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (e.button !== 0) return;
    startLongPressTimer(e.clientX, e.clientY);
  };

  const handleSvgTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length > 0) {
      startLongPressTimer(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleSvgMouseUp = () => { cancelLongPressTimer(); };
  const handleSvgTouchEnd = () => { cancelLongPressTimer(); };
  const handleSvgMouseLeave = () => { cancelLongPressTimer(); };

  const handleAddCustomPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinName.trim() || !customPinForm) return;

    const favoriteImages = [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596120206305-c10b0058bcde?auto=format&fit=crop&w=800&q=80'
    ];
    const gemImages = [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80'
    ];
    const chosenImage = pinCategory === 'favorite' 
      ? favoriteImages[Math.floor(Math.random() * favoriteImages.length)]
      : gemImages[Math.floor(Math.random() * gemImages.length)];

    const newPin: PlaceItem = {
      id: `custom-pin-${Date.now()}`,
      name: pinName.trim(),
      category: pinCategory,
      lat: customPinForm.lat,
      lng: customPinForm.lng,
      rating: 5.0,
      image: chosenImage,
      description: {
        en: pinDescription.trim() || 'Custom user pinned marker',
        fr: pinDescription.trim() || 'Épingle personnalisée',
        ar: pinDescription.trim() || 'معلم مخصص'
      },
      address: `Algérie (Épingle: ${customPinForm.lat.toFixed(4)}°N, ${customPinForm.lng.toFixed(4)}°E)`
    };

    const nextPins = [...customPins, newPin];
    saveCustomPins(nextPins);
    setSelectedPlace(newPin);
    setNavigationRouteActive(false);
    setShowPinModal(false);
  };

  // Algerian Classified Cultural Heritage Engine States
  const [activeEngine, setActiveEngine] = useState<'standard' | 'heritage'>('heritage');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [selectedHeritageType, setSelectedHeritageType] = useState<string>('all');
  const [selectedHeritage, setSelectedHeritage] = useState<HeritageItem>(heritageDb[0]);
  const [itinerary, setItinerary] = useState<HeritageItem[]>([]);
  const [heritageGroupByCity, setHeritageGroupByCity] = useState<boolean>(false);
  const [showDeveloperHub, setShowDeveloperHub] = useState(false);
  const [unescoModalOpen, setUnescoModalOpen] = useState(false);
  const [santaCruzModalOpen, setSantaCruzModalOpen] = useState(false);
  const [tassiliModalOpen, setTassiliModalOpen] = useState(false);

  // Map settings
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem>(placesDb[0]);
  const [showConfigApiKey, setShowConfigApiKey] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [showInvoiceAlert, setShowInvoiceAlert] = useState<string | null>(null);

  // Dynamic Google Maps configuration read from environment or state
  const [mapsApiKey, setMapsApiKey] = useState(() => {
    const fromStorage = localStorage.getItem('GOOGLE_MAPS_KEY_STORED') || '';
    return fromStorage;
  });

  const [useGoogleMapMode, setUseGoogleMapMode] = useState(true);

  useEffect(() => {
    // Fetch backend configuration to activate the Google Maps Pro engine automatically
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.mapsApiKey) {
          setMapsApiKey(data.mapsApiKey);
          setUseGoogleMapMode(true);
        }
      })
      .catch((err) => console.warn('Could not auto-fetch backend Google Maps key:', err));
  }, []);

  useEffect(() => {
    if (mapsApiKey) {
      setUseGoogleMapMode(true);
    }
  }, [mapsApiKey]);

  // GPS navigation states
  const [gpsOriginPreset, setGpsOriginPreset] = useState('airport-alger');
  const [transitMode, setTransitMode] = useState<'DRIVING' | 'WALKING' | 'TRANSIT'>('DRIVING');
  const [navigationRouteActive, setNavigationRouteActive] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [navigationStepIndex, setNavigationStepIndex] = useState(0);
  const [navigationRunning, setNavigationRunning] = useState(false);

  // Presets positions
  const originCoordinates: Record<string, { name: string; lat: number; lng: number }> = {
    'airport-alger': { name: 'Aéroport d\'Alger (ALG)', lat: 36.6910, lng: 3.2154 },
    'center-oran': { name: 'Gare Historique d\'Oran', lat: 35.7005, lng: -0.6272 },
    'center-constantine': { name: 'Place des Martyrs, Constantine', lat: 36.3653, lng: 6.6111 },
    'desert-ghardaia': { name: 'Oasis du M\'zab, Ghardaïa', lat: 32.4891, lng: 3.6744 },
    'desert-djanet': { name: 'Base d\'Excursions, Djanet', lat: 24.5555, lng: 9.4842 }
  };

  const activeOriginDetail = originCoordinates[gpsOriginPreset] || originCoordinates['airport-alger'];

  // Geodesic distance calculator in KM
  const calculateDistanceKM = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth ratio
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const rawGeodesicDistance = calculateDistanceKM(
    activeOriginDetail.lat,
    activeOriginDetail.lng,
    selectedPlace.lat,
    selectedPlace.lng
  );

  // Corrected actual track route distance
  const trackRouteDistance = rawGeodesicDistance * 1.28;

  // Travel time estimation depending on modality
  const getTravelTimeMinutes = () => {
    let speed = 65; // km/h driving
    let delay = 10;
    if (transitMode === 'WALKING') {
      speed = 5.2;
      delay = 0;
    } else if (transitMode === 'TRANSIT') {
      speed = 35;
      delay = 15;
    }
    const mins = (trackRouteDistance / speed) * 60 + delay;
    return Math.max(2, Math.round(mins));
  };

  const travelTimeMinutes = getTravelTimeMinutes();

  // Generate dynamic directions step instructions
  const getNavigationSteps = () => {
    const isFr = language === 'fr';
    const isAr = language === 'ar';

    const steps = [
      {
        text: isFr 
          ? `Départ depuis votre point de contact : ${activeOriginDetail.name} (Négociation des couloirs)`
          : isAr 
            ? `الانطلاق من نقطة المغادرة: ${activeOriginDetail.name}`
            : `Depart from your local terminal: ${activeOriginDetail.name}`,
        dist: '0.0 km',
        soundCue: 'Démarrage du copilote intelligent'
      },
      {
        text: isFr
          ? `Rejoindre l'autoroute nationale algérienne en direction du nord-est.`
          : isAr
            ? `الالتحاق بالطريق الوطني السريع في اتجاه الشمال الشرقي.`
            : `Merge on the Algeria National Highway heading Northeast.`,
        dist: `${(trackRouteDistance * 0.3).toFixed(1)} km`,
        soundCue: 'Continuez sur la route nationale principale'
      },
      {
        text: isFr
          ? `Suivre la signalisation régionale vers le secteur populaire : ${selectedPlace.address}.`
          : isAr
            ? `اتبع لافتات الطريق نحو الوجهة: ${selectedPlace.address}.`
            : `Follow road boards toward local district: ${selectedPlace.address}.`,
        dist: `${(trackRouteDistance * 0.5).toFixed(1)} km`,
        soundCue: 'Dans un kilomètre, restez sur la file de droite'
      },
      {
        text: isFr
          ? `Arriver à destination à droite : ${selectedPlace.name}. Merci d'utiliser RAHALA.`
          : isAr
            ? `الوصول إلى الوجهة على اليمين: ${selectedPlace.name}. شكراً لاستخدامك رحالة.`
            : `Arrive at your final destination on the right: ${selectedPlace.name}. Thank you for traveling with RAHALA.`,
        dist: '0.1 km',
        soundCue: 'Arrivée imminente à votre lieu favori'
      }
    ];
    return steps;
  };

  const navSteps = getNavigationSteps();

  // Real-time relative proximity algorithm ("Lieux proches") including custom pins
  const allPlacesForFilter = [...placesDb, ...customPins];

  const proximitySuggestions = allPlacesForFilter
    .filter(p => p.id !== selectedPlace.id)
    .map(p => {
      const dist = calculateDistanceKM(selectedPlace.lat, selectedPlace.lng, p.lat, p.lng);
      return { ...p, distance: dist };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3); // top 3 closest

  // Filter main places list based on queries and checkboxes
  const filteredPlaces = allPlacesForFilter.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (place.description && (
                            place.description.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            place.description.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            place.description.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (place.description.es && place.description.es.toLowerCase().includes(searchQuery.toLowerCase()))
                          ));
    
    if (place.category === 'hotel') return matchesSearch && filterHotels;
    if (place.category === 'restaurant') return matchesSearch && filterRestaurants;
    if (place.category === 'monument') return matchesSearch && filterMonuments;
    if (place.category === 'plage') return matchesSearch && filterPlages;
    if (place.category === 'favorite') return matchesSearch && filterFavorites;
    if (place.category === 'hidden-gem') return matchesSearch && filterHiddenGems;
    return false;
  });

  // Filter heritage list based on selectedWilaya, selectedHeritageType, and Search Query
  const filteredHeritage = heritageDb.filter((item) => {
    const matchesWilaya = selectedWilaya === 'all' || item.wilaya.toLowerCase() === selectedWilaya.toLowerCase();
    const matchesType = selectedHeritageType === 'all' || item.type === selectedHeritageType;
    const matchesSearch = searchQuery === '' || 
      item.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesWilaya && matchesType && matchesSearch;
  });

  // Precise coordinate map rendering helpers
  const projectedOrigin = projectLatLngToSVG(activeOriginDetail.lat, activeOriginDetail.lng);
  const projectedDest = projectLatLngToSVG(selectedPlace.lat, selectedPlace.lng);

  // Trigger simulated navigation progression in a thread loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (navigationRunning) {
      interval = setInterval(() => {
        setSimulatedProgress((prev) => {
          const next = prev + 8;
          if (next >= 100) {
            setNavigationRunning(false);
            setNavigationStepIndex(navSteps.length - 1);
            return 100;
          }
          // Increment steps proportionally
          const stepRatio = 100 / navSteps.length;
          const currentStep = Math.min(navSteps.length - 1, Math.floor(next / stepRatio));
          setNavigationStepIndex(currentStep);
          return next;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [navigationRunning, navSteps.length]);

  const handleStartGPSNavigation = () => {
    setSimulatedProgress(0);
    setNavigationStepIndex(0);
    setNavigationRouteActive(true);
    setNavigationRunning(true);
  };

  const handleRegisterApiKey = () => {
    if (customKeyInput.trim()) {
      localStorage.setItem('GOOGLE_MAPS_KEY_STORED', customKeyInput.trim());
      setMapsApiKey(customKeyInput.trim());
      setUseGoogleMapMode(true);
      setShowConfigApiKey(false);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('GOOGLE_MAPS_KEY_STORED');
    setMapsApiKey('');
    setUseGoogleMapMode(false);
  };

  const directBookInstantHotel = (place: PlaceItem) => {
    const rawPriceDigits = place.price ? parseInt(place.price.replace(/[^0-9]/g, '')) : 12000;
    const bkg = addBooking({
      type: 'hotel',
      targetId: place.id,
      targetName: place.name,
      date: new Date().toLocaleDateString(),
      endDate: new Date(Date.now() + 86400000 * 2).toLocaleDateString(),
      guests: 2,
      totalPriceDZD: rawPriceDigits * 2,
      paymentStatus: 'paid'
    });
    setShowInvoiceAlert(bkg.id);
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 font-sans" id="rahala-smartmap-workspace">
      
      {/* Header and Banner Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-100 dark:border-slate-800 gap-4">
        <div>
          <span className="inline-flex items-center space-x-2 space-x-reverse bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-full mb-3" id="gps-intelligence-badge">
            <Sparkles size={11} className="animate-pulse" />
            <span>Navigation GPS & Proximité en temps réel</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-none">
            {t('mapTitle')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
            Explorez l'Algérie avec notre guide immersif d'Hôtels, Restaurants & Monuments historique.
          </p>
        </div>

        {/* Engine switcher with elegant animated colors */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfigApiKey(true)}
            className="flex items-center space-x-1.5 space-x-reverse text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-xl bg-slate-50 dark:bg-slate-900 dark:text-slate-300 transition duration-200 cursor-pointer text-slate-700"
          >
            <Settings size={14} className="text-emerald-500" />
            <span>Clé Google Maps API</span>
          </button>
          
          <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl flex items-center border border-slate-200 dark:border-slate-850">
            <button
              onClick={() => setUseGoogleMapMode(false)}
              className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !useGoogleMapMode 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Carte Vectorielle
            </button>
            <button
              onClick={() => {
                setUseGoogleMapMode(true);
              }}
              className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
                useGoogleMapMode 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
              }`}
            >
              Google Maps Live
            </button>
          </div>
        </div>
      </div>

      {/* Main dual-engine alert block */}
      {!mapsApiKey && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-600/10 via-amber-500/5 to-red-500/5 border-l-4 border-emerald-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 space-x-reverse">
            <Info className="text-emerald-500 mt-0.5 sm:mt-0 flex-shrink-0" size={18} />
            <div className="text-xs">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 block">Solution Automatique Google Maps Activée !</span>
              <p className="text-gray-500 dark:text-slate-350 mt-1">
                Le moteur RAHALA affiche automatiquement la carte interactive Google Maps en temps réel pour chaque lieu. Basculez sur "Carte Vectorielle" si vous souhaitez voir le simulateur GPS hors-ligne.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowConfigApiKey(true)}
            className="text-xs font-extrabold bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white px-3.5 py-1.5 rounded-lg whitespace-nowrap shadow-md transition cursor-pointer"
          >
            Clé Google Pro (Optionnelle) &rarr;
          </button>
        </div>
      )}

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column sidebar filters & list (3 cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          
          {/* Active Engine Segment Toggle */}
          <div className="bg-slate-200 dark:bg-slate-900 border border-slate-350 dark:border-slate-800 p-1 rounded-xl flex items-center shadow-sm">
            <button
              id="switch-standard-btn"
              onClick={() => setActiveEngine('standard')}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeEngine === 'standard' 
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-805 dark:hover:text-slate-200'
              }`}
            >
              💼 Guide Pro
            </button>
            <button
              id="switch-heritage-btn"
              onClick={() => setActiveEngine('heritage')}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeEngine === 'heritage' 
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-805 dark:hover:text-slate-200'
              }`}
            >
              🏛️ Patrimoine 🇩🇿
            </button>
          </div>

          {activeEngine === 'heritage' ? (
            /* HERITAGE FILTERS PANEL */
            <div className="bg-white dark:bg-[#111c2a]/90 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  <span>🏛️</span> Filtres Nationaux
                </span>
                <span className="text-[10px] bg-amber-500/10 text-amber-600 border border-amber-500/25 px-2 py-0.5 rounded-full font-bold">JO n°77</span>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-gray-400 mb-1">Filtre Wilaya :</label>
                <select
                  id="wilaya-select-filter"
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Toutes (Algérie)</option>
                  <option value="adrar">01. Adrar (Touat/Gourara)</option>
                  <option value="chlef">02. Chlef (El Asnam)</option>
                  <option value="laghouat">03. Laghouat (Atlas Saharien)</option>
                  <option value="oum el bouaghi">04. Oum El Bouaghi</option>
                  <option value="batna">05. Batna (Aurès/Timgad)</option>
                  <option value="bejaïa">06. Bejaïa (Bougie)</option>
                  <option value="biskra">07. Biskra (Ziban)</option>
                  <option value="béchar">08. Béchar (Saoura/Taghit)</option>
                  <option value="blida">09. Blida (La Ville des Roses)</option>
                  <option value="bouira">10. Bouira (Djurdjura/Auzia)</option>
                  <option value="tébessa">12. Tébessa (Theveste/Caracalla)</option>
                  <option value="tlemcen">13. Tlemcen (Perle du Maghreb)</option>
                  <option value="tiaret">14. Tiaret (Sersou/Capitale Rustumide)</option>
                  <option value="tizi ouzou">15. Tizi Ouzou (Grande Kabylie/Ait Kaci)</option>
                  <option value="alger">16. Alger (El Bahdja)</option>
                  <option value="djelfa">17. Djelfa (Atlas Ouled Naïl)</option>
                  <option value="sétif">19. Sétif (Cuicul-Djemila)</option>
                  <option value="saïda">20. Saïda (Eaux Thermales/Cité de l'Émir)</option>
                  <option value="skikda">21. Skikda (Philippeville)</option>
                  <option value="constantine">25. Constantine (Cirta)</option>
                  <option value="oran">31. Oran (Wahran)</option>
                  <option value="ghardaïa">47. Ghardaïa (M'zab)</option>
                  <option value="touggourt">55. Touggourt (Témacine)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-gray-400 mb-1">Filtre de Classification :</label>
                <select
                  id="type-select-filter"
                  value={selectedHeritageType}
                  onChange={(e) => setSelectedHeritageType(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Toutes catégories</option>
                  <option value="Monument historique">🏛️ Monument historique</option>
                  <option value="Site archéologique">🏺 Site archéologique</option>
                  <option value="Musée">🖼️ Musée</option>
                  <option value="Lieu religieux">⛪ Lieu religieux</option>
                </select>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Nom de monument, ksar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 pl-9 pr-3.5 py-2 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          ) : (
            /* QUICK STANDARD FILTERS (Original) */
            <div className="bg-white dark:bg-[#111c2a]/90 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xl">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2 space-x-reverse">
                <Layers size={15} className="text-emerald-600" />
                <span>{language === 'ar' ? 'تصنيفات الاستكشاف' : language === 'fr' ? 'Filtres de catégories' : language === 'es' ? 'Filtros de Categoría' : 'Category Filters'}</span>
              </h3>
              
              {/* Dynamic horizontal grid of category toggles */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setFilterMonuments(!filterMonuments)}
                  className={`py-2 px-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    filterMonuments 
                      ? 'bg-rose-50/70 border-rose-500 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 font-extrabold shadow-xs' 
                      : 'border-slate-200 dark:border-slate-800 dark:text-slate-400 opacity-60 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">🏛️</span>
                  <span className="text-[10px] font-bold truncate">{t('filterMonuments')}</span>
                </button>

                <button
                  onClick={() => setFilterPlages(!filterPlages)}
                  className={`py-2 px-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    filterPlages 
                      ? 'bg-sky-50/70 border-sky-500 dark:bg-sky-950/20 text-sky-800 dark:text-sky-450 font-extrabold shadow-xs' 
                      : 'border-slate-200 dark:border-slate-800 dark:text-slate-400 opacity-60 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">🏖️</span>
                  <span className="text-[10px] font-bold truncate">{t('filterBeaches')}</span>
                </button>

                <button
                  onClick={() => setFilterHotels(!filterHotels)}
                  className={`py-2 px-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    filterHotels 
                      ? 'bg-emerald-50/70 border-emerald-500 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 font-extrabold shadow-xs' 
                      : 'border-slate-200 dark:border-slate-800 dark:text-slate-400 opacity-60 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">🏨</span>
                  <span className="text-[10px] font-bold truncate">{t('filterHotels')}</span>
                </button>

                <button
                  onClick={() => setFilterRestaurants(!filterRestaurants)}
                  className={`py-2 px-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    filterRestaurants 
                      ? 'bg-amber-50/70 border-amber-500 dark:bg-amber-950/20 text-amber-800 dark:text-[#d4af37] font-extrabold shadow-xs' 
                      : 'border-slate-200 dark:border-slate-800 dark:text-slate-400 opacity-60 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">🍽️</span>
                  <span className="text-[10px] font-bold truncate">{t('filterRestaurants')}</span>
                </button>
              </div>

              {/* Extras block */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setFilterFavorites(!filterFavorites)}
                  className={`py-1.5 px-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    filterFavorites 
                      ? 'bg-pink-50/70 border-pink-500 dark:bg-pink-950/20 text-pink-800 dark:text-pink-400 font-extrabold shadow-xs' 
                      : 'border-slate-200 dark:border-slate-800 dark:text-slate-400 opacity-60 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs">🌟</span>
                  <span className="text-[9px] font-bold truncate">
                    {language === 'ar' ? 'مفضلاتي' : language === 'fr' ? 'Mes Favoris' : language === 'es' ? 'Mis Favoritos' : 'My Favorites'}
                  </span>
                </button>

                <button
                  onClick={() => setFilterHiddenGems(!filterHiddenGems)}
                  className={`py-1.5 px-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    filterHiddenGems 
                      ? 'bg-indigo-50/70 border-indigo-500 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400 font-extrabold shadow-xs' 
                      : 'border-slate-200 dark:border-slate-800 dark:text-slate-400 opacity-60 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs">💎</span>
                  <span className="text-[9px] font-bold truncate">
                    {language === 'ar' ? 'كنوز خفية' : language === 'fr' ? 'Inédits' : language === 'es' ? 'Inéditos' : 'Hidden Gems'}
                  </span>
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder={
                    language === 'ar' 
                      ? 'ابحث عن معلم، فندق أو مدينة...' 
                      : language === 'fr' 
                        ? 'Rechercher un monument, hôtel, ville...' 
                        : language === 'es'
                          ? 'Buscar monumento, hotel, ciudad...'
                          : 'Search landmark, hotel, city...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 pl-9 pr-3.5 py-2 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* List of active locations matching query */}
          <div className="bg-white dark:bg-[#111c2a]/90 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xl flex-1 flex flex-col min-h-[300px]">
            {activeEngine === 'heritage' ? (
              <>
                <div className="flex items-center justify-between mb-3 border-b border-dashed border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest leading-normal">
                      Monuments Classés ({filteredHeritage.length})
                    </h3>
                    <span className="text-[9px] font-mono text-gray-450">National: {heritageDb.length}</span>
                  </div>
                  <button
                    onClick={() => setHeritageGroupByCity(!heritageGroupByCity)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                      heritageGroupByCity 
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30' 
                        : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {heritageGroupByCity ? '🗂️ Groupé / Ville' : '📋 Liste Simple'}
                  </button>
                </div>

                <div className="space-y-2 overflow-y-auto flex-1 max-h-[390px] pr-1">
                  {filteredHeritage.length === 0 ? (
                    <div className="text-center py-10">
                      <span className="text-3xl block filter">🏜️</span>
                      <span className="text-xs text-gray-400 block mt-3 font-sans">Aucun monument patrimonial classé trouvé.</span>
                    </div>
                  ) : heritageGroupByCity ? (
                    (() => {
                      const groupedHeritage = filteredHeritage.reduce((acc, item) => {
                        const city = item.ville;
                        if (!acc[city]) acc[city] = [];
                        acc[city].push(item);
                        return acc;
                      }, {} as Record<string, HeritageItem[]>);

                      return Object.entries(groupedHeritage).map(([city, items]) => (
                        <div key={city} className="space-y-1.5 mt-3 first:mt-0">
                          <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/5 dark:bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/10 dark:border-amber-500/20 flex items-center justify-between">
                            <span className="flex items-center gap-1">📍 {city}</span>
                            <span className="text-[9px] bg-amber-500/20 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-mono font-black border border-amber-500/10">{items.length}</span>
                          </div>
                          <div className="space-y-1.5 pl-2 border-l-2 border-amber-500/20 ml-2 dark:border-amber-500/10">
                            {items.map((item) => {
                              const isCur = selectedHeritage?.id === item.id;
                              const hasArt = !!item.oeuvreAssociee;
                              const catColor = 
                                item.type === 'Site archéologique' 
                                  ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400' 
                                  : item.type === 'Lieu religieux'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450'
                                    : item.type === 'Musée'
                                      ? 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400'
                                      : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-450';
                              
                              return (
                                <div
                                  key={item.id}
                                  onClick={() => {
                                    setSelectedHeritage(item);
                                  }}
                                  className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer group flex items-start space-x-2 space-x-reverse ${
                                    isCur 
                                      ? 'border-amber-500 bg-amber-500/5 shadow-md shadow-amber-500/5' 
                                      : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                                  }`}
                                >
                                  <img
                                    src={item.image}
                                    alt={item.nom}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1 leading-none mb-0.5">
                                      <span className={`text-[7px] font-extrabold uppercase px-1 py-0.2 rounded border ${catColor}`}>
                                        {item.type.split(' ')[0]}
                                      </span>
                                      <span className="text-[7px] text-amber-600 font-extrabold uppercase">
                                        ★ {item.popularite}
                                      </span>
                                    </div>
                                    <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-amber-600 transition">
                                      {item.nom}
                                    </h4>
                                    <p className="text-[8px] text-gray-450 dark:text-slate-400 truncate mt-0.5">
                                      {item.source.split('par')[0].replace('Classé parmi les ', '').substring(0, 45)}...
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ));
                    })()
                  ) : (
                    filteredHeritage.map((item) => {
                      const isCur = selectedHeritage?.id === item.id;
                      const hasArt = !!item.oeuvreAssociee;
                      const catColor = 
                        item.type === 'Site archéologique' 
                          ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400' 
                          : item.type === 'Lieu religieux'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450'
                            : item.type === 'Musée'
                              ? 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400'
                              : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-450';
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedHeritage(item);
                          }}
                          className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer group flex items-start space-x-3 space-x-reverse ${
                            isCur 
                              ? 'border-amber-500 bg-amber-500/5 shadow-md shadow-amber-500/5' 
                              : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.nom}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 leading-none mb-1">
                              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${catColor}`}>
                                {item.type.split(' ')[0]}
                              </span>
                              <div className="flex items-center gap-1">
                                {hasArt && (
                                  <span className="text-[10px]" title="Oeuvre d'art picturale classée existante !">🎨</span>
                                )}
                                <span className="text-[8px] text-amber-600 font-extrabold block uppercase">
                                  ★ {item.popularite}
                                </span>
                              </div>
                            </div>
                            <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-100 truncate group-hover:text-amber-600 transition">
                              {item.nom}
                            </h4>
                            <p className="text-[9px] text-gray-400 dark:text-slate-400 truncate mt-0.5">
                              📍 {item.ville} ({item.wilaya})
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest">
                    Résultats ({filteredPlaces.length})
                  </h3>
                  <span className="text-[9px] font-mono text-gray-400">Total: {allPlacesForFilter.length}</span>
                </div>

                <div className="space-y-2 overflow-y-auto flex-1 max-h-[390px] pr-1">
                  {filteredPlaces.length === 0 ? (
                    <div className="text-center py-10">
                      <span className="text-3xl block filter grayscale">🏜️</span>
                      <span className="text-xs text-gray-400 block mt-3">Aucun lieu répertorié ne correspond.</span>
                    </div>
                  ) : (
                    filteredPlaces.map((place) => {
                      const isCur = selectedPlace?.id === place.id;
                      const catColorClass = 
                        place.category === 'hotel' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450' 
                          : place.category === 'restaurant'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-[#d4af37]'
                            : place.category === 'monument'
                              ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450'
                              : place.category === 'plage'
                                ? 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400'
                                : place.category === 'favorite'
                                  ? 'bg-pink-50 text-pink-800 border-pink-200 dark:bg-pink-950/20 dark:text-pink-400'
                                  : 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400';
                      
                      return (
                        <div
                          key={place.id}
                          onClick={() => {
                            setSelectedPlace(place);
                            setNavigationRouteActive(false);
                          }}
                          className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer group flex items-start space-x-3 space-x-reverse ${
                            isCur 
                              ? 'border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/5' 
                              : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                          }`}
                        >
                          <img
                            src={place.image}
                            alt={place.name}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 leading-none mb-1">
                              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${catColorClass}`}>
                                {place.category === 'hotel' 
                                  ? (language === 'ar' ? '🏨 فندق' : language === 'fr' ? '🏨 Hôtel' : language === 'es' ? '🏨 Hotel' : '🏨 Hotel') 
                                  : place.category === 'restaurant' 
                                    ? (language === 'ar' ? '🍽️ مطعم' : language === 'fr' ? '🍽️ Resto' : language === 'es' ? '🍽️ Resto' : '🍽️ Bistro') 
                                    : place.category === 'monument' 
                                      ? (language === 'ar' ? '🏛️ معلم' : language === 'fr' ? '🏛️ Monument' : language === 'es' ? '🏛️ Monumento' : '🏛️ Monument')
                                      : place.category === 'plage'
                                        ? (language === 'ar' ? '🏖️ شاطئ' : language === 'fr' ? '🏖️ Plage' : language === 'es' ? '🏖️ Playa' : '🏖️ Beach')
                                        : place.category === 'favorite'
                                          ? (language === 'ar' ? '🌟 مفضلة' : language === 'fr' ? '🌟 Favori' : language === 'es' ? '🌟 Favorito' : '🌟 Favorite')
                                          : (language === 'ar' ? '💎 جوهرة' : language === 'fr' ? '💎 Inédit' : language === 'es' ? '💎 Inédito' : '💎 Unique')}
                              </span>
                              <span className="flex items-center text-[9px] text-amber-500 font-extrabold">
                                <Star size={9} className="fill-amber-500 mr-0.5" />
                                {place.rating.toFixed(1)}
                              </span>
                            </div>
                            <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 transition">
                              {place.name}
                            </h4>
                            <p className="text-[9px] text-gray-400 dark:text-slate-400 truncate mt-0.5">
                              📍 {place.address}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>

        </div>

        {/* Center column map viewer & GPS navigation HUD in beautiful wide landscape layout */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Map Section (md:col-span-12 or lg:col-span-8 depending on wide screen layout) */}
          <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-[#111c2a]/90 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between overflow-hidden min-h-[580px] relative">
            
            {/* Quick status pill floating */}
            <div className="absolute top-4 left-4 z-10 flex items-center bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/40 text-[9px] font-mono tracking-wider font-extrabold text-slate-850 dark:text-slate-300">
              <span className="w-1.5 h-1.5 bg-emerald-500 border border-white rounded-full animate-ping mr-2"></span>
              <span>
                {useGoogleMapMode 
                  ? (mapsApiKey ? 'Google Maps API Pro (Satellite)' : 'Google Maps Interactif (Sans Clé)') 
                  : 'RAHALA Vector Engine V3'}
              </span>
            </div>

            {/* GPS HUD trace summary when path is traced */}
            {navigationRouteActive && (
              <div className="absolute top-4 right-4 z-10 bg-slate-900/95 text-white backdrop-blur-md px-3 py-2 rounded-xl shadow-xl text-[9px] font-mono select-none border border-red-500/30">
                <p className="text-red-400 font-extrabold flex items-center space-x-1 space-x-reverse uppercase">
                  <Route size={10} className="text-red-500 animate-pulse" />
                  <span>GPS Tracé Actif</span>
                </p>
                <p className="mt-0.5 font-bold">Total: {trackRouteDistance.toFixed(1)} km</p>
                <p className="opacity-90">Mode: {transitMode === 'DRIVING' ? 'Voiture 🚗' : transitMode === 'WALKING' ? 'À Pied 🚶' : 'Tram/Bus 🚌'}</p>
              </div>
            )}

            {/* Primary canvas box */}
            <div className="flex-1 w-full h-full min-h-[500px] flex items-center justify-center relative bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-950/70 rounded-2xl border-2 border-dashed border-slate-200/30 overflow-hidden">
              
              {useGoogleMapMode ? (
                mapsApiKey ? (
                  // DYNAMIC GOOGLE MAPS LAYER
                  <div className="w-full h-full absolute inset-0 text-xs text-slate-800">
                    <APIProvider apiKey={mapsApiKey} version="weekly">
                      <Map
                        defaultCenter={activeEngine === 'heritage' ? { lat: selectedHeritage.latitude, lng: selectedHeritage.longitude } : { lat: selectedPlace.lat, lng: selectedPlace.lng }}
                        defaultZoom={activeEngine === 'heritage' ? 9 : 11}
                        center={activeEngine === 'heritage' ? { lat: selectedHeritage.latitude, lng: selectedHeritage.longitude } : { lat: selectedPlace.lat, lng: selectedPlace.lng }}
                        mapId="RAHALA_MAP_3D"
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                        style={{ width: '100%', height: '100%', minHeight: '500px' }}
                        onDblclick={(e: any) => {
                          if (e.detail && e.detail.latLng) {
                            setCustomPinForm({
                              lat: Number(e.detail.latLng.lat.toFixed(4)),
                              lng: Number(e.detail.latLng.lng.toFixed(4)),
                              x: 400,
                              y: 300
                            });
                            setPinName('');
                            setPinDescription('');
                            setPinCategory('favorite');
                            setShowPinModal(true);
                          }
                        }}
                      >
                        {activeEngine === 'heritage' ? (
                          filteredHeritage.map((item) => {
                            const isCurSelected = item.id === selectedHeritage.id;
                            const pinColor = item.type === 'Site archéologique' ? '#d97706' : item.type === 'Lieu religieux' ? '#059669' : item.type === 'Musée' ? '#8b5cf6' : '#2563eb';
                            return (
                              <AdvancedMarker
                                key={item.id}
                                position={{ lat: item.latitude, lng: item.longitude }}
                                onClick={() => setSelectedHeritage(item)}
                              >
                                <Pin 
                                  background={pinColor} 
                                  borderColor="#ffffff" 
                                  glyphColor="#ffffff" 
                                  scale={isCurSelected ? 1.25 : 0.85}
                                />
                              </AdvancedMarker>
                            );
                          })
                        ) : (
                          filteredPlaces.map((pl) => {
                            const isCurSelected = pl.id === selectedPlace.id;
                            const pinColor = 
                              pl.category === 'hotel' ? '#059669' : 
                              pl.category === 'restaurant' ? '#d97706' : 
                              pl.category === 'monument' ? '#b91c1c' : 
                              pl.category === 'plage' ? '#0284c7' : 
                              pl.category === 'favorite' ? '#ec4899' : '#6366f1';
                            return (
                              <AdvancedMarker
                                key={pl.id}
                                position={{ lat: pl.lat, lng: pl.lng }}
                                onClick={() => setSelectedPlace(pl)}
                              >
                                <Pin 
                                  background={pinColor} 
                                  borderColor="#ffffff" 
                                  glyphColor="#ffffff" 
                                  scale={isCurSelected ? 1.25 : 0.85}
                                />
                              </AdvancedMarker>
                            );
                          })
                        )}
                      </Map>
                    </APIProvider>
                  </div>
                ) : (
                  // AUTOMATIC ZERO-KEY GOOGLE MAPS EMBED IFRAME (PRO ENGINE)
                  <div className="w-full h-full absolute inset-0 text-xs text-slate-800">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: '500px' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full rounded-2xl"
                      src={
                        activeEngine === 'heritage'
                          ? `https://maps.google.com/maps?q=${encodeURIComponent(selectedHeritage?.nom + ", " + selectedHeritage?.ville + ", Algérie")}&t=m&z=13&ie=UTF8&iwloc=&output=embed`
                          : `https://maps.google.com/maps?q=${encodeURIComponent(selectedPlace?.name + ", " + selectedPlace?.address + ", Algérie")}&t=m&z=15&ie=UTF8&iwloc=&output=embed`
                      }
                    ></iframe>
                  </div>
                )
              ) : (
                 // BEAUTIFUL stylised High-Fidelity Custom SVG map (Fallback engine)
                 <div className="w-full h-full absolute inset-0 p-2 flex flex-col items-center justify-center">
                   
                   {/* Instruction overlay badge */}
                   <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/80 text-[9px] text-white/90 backdrop-blur px-3 py-1 rounded-full pointer-events-none z-10 flex items-center gap-1.5 font-sans font-bold border border-white/10 animate-pulse">
                     <span>💡</span>
                     <span>Appui long n'importe où sur la carte pour épingler un favori</span>
                   </div>

                   <svg
                     ref={svgRef}
                     viewBox="0 0 800 600"
                     className="w-full max-h-[450px] drop-shadow-2xl select-none cursor-crosshair"
                     id="algeria-vector-canvas"
                     onMouseDown={handleSvgMouseDown}
                     onMouseUp={handleSvgMouseUp}
                     onMouseLeave={handleSvgMouseLeave}
                     onTouchStart={handleSvgTouchStart}
                     onTouchEnd={handleSvgTouchEnd}
                   >
                    {/* Outline of Algeria */}
                    <path
                      d="M 120 180 Q 200 120, 280 140 T 420 80 T 580 110 T 630 115 T 660 140 T 680 190 T 660 220 T 700 320 T 780 430 Q 720 540, 680 570 T 560 520 T 440 590 T 360 510 T 260 480 Q 210 400, 180 340 T 110 320 T 80 270 Z"
                      className="fill-slate-100 dark:fill-slate-900/80 stroke-slate-300 dark:stroke-slate-800 stroke-[5] transition-all"
                    />
                    <path
                      d="M 120 180 Q 200 120, 280 140 T 420 80 T 580 110 T 630 115 T 660 140 T 680 190 T 660 220 T 700 320 T 780 430 Q 720 540, 680 570 T 560 520 T 440 590 T 360 510 T 260 480 Q 210 400, 180 340 T 110 320 T 80 270 Z"
                      fill="none"
                      className="stroke-emerald-600/10 stroke-[2] pointer-events-none"
                    />

                    {/* Stylised dunes overlays */}
                    <path d="M 330 380 Q 400 420, 480 370 T 640 430" fill="none" className="stroke-amber-500/10 dark:stroke-slate-800/40 stroke-2" />
                    <path d="M 280 430 Q 360 470, 440 420 T 580 470" fill="none" className="stroke-amber-500/10 dark:stroke-slate-800/40 stroke-2" />

                    {/* Draw GPS route lines if navigation mode is active */}
                    {navigationRouteActive && projectedOrigin && projectedDest && (
                      <>
                        {/* Glowing orange route line */}
                        <path
                          d={`M ${projectedOrigin.x} ${projectedOrigin.y} Q ${(projectedOrigin.x + projectedDest.x)/2} ${((projectedOrigin.y + projectedDest.y)/2) - 50}, ${projectedDest.x} ${projectedDest.y}`}
                          fill="none"
                          className="stroke-red-500 stroke-[5.5] animate-dash-offset"
                          style={{ strokeDasharray: '8, 8' }}
                        />
                        {/* Interactive vehicle navigator position */}
                        <g 
                          transform={`translate(${
                            projectedOrigin.x + (projectedDest.x - projectedOrigin.x) * (simulatedProgress / 100)
                          }, ${
                            (projectedOrigin.y + (projectedDest.y - projectedOrigin.y) * (simulatedProgress / 100)) - Math.sin((simulatedProgress * Math.PI) / 100) * 50
                          })`}
                        >
                          <circle r="12" fill="#ef4444" className="animate-ping" />
                          <circle r="8" fill="#b91c1c" className="stroke-white stroke-[2]" />
                          <path d="M-3-3 L3 0 L-3 3 Z" fill="#fff" transform="rotate(25)" />
                        </g>

                        {/* Starting pin */}
                        <g transform={`translate(${projectedOrigin.x - 10}, ${projectedOrigin.y - 24})`}>
                          <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                            className="fill-blue-600 drop-shadow-md"
                            transform="scale(0.8)"
                          />
                          <text x="8" y="32" className="text-[9px] font-mono font-extrabold fill-blue-700 dark:fill-blue-400" textAnchor="middle">GPS Départ</text>
                        </g>
                      </>
                    )}

                    {/* Active filtered location markers depending on engine */}
                    {activeEngine === 'heritage' ? (
                      filteredHeritage.map((item) => {
                        const isCurSelected = item.id === selectedHeritage?.id;
                        const proj = projectLatLngToSVG(item.latitude, item.longitude);
                        const markerIcon = item.type === 'Site archéologique' ? '🏺' : item.type === 'Lieu religieux' ? '⛪' : item.type === 'Musée' ? '🖼️' : '🏛️';
                        const circleColor = 
                          item.type === 'Site archéologique' 
                            ? 'fill-amber-500' 
                            : item.type === 'Lieu religieux' 
                              ? 'fill-emerald-600 dark:fill-emerald-400' 
                              : item.type === 'Musée'
                                ? 'fill-purple-600'
                                : 'fill-blue-600';

                        return (
                          <g
                            key={item.id}
                            className="cursor-pointer group"
                            onClick={() => {
                              setSelectedHeritage(item);
                            }}
                          >
                            {/* Pulse ring for active selection */}
                            {isCurSelected && (
                              <circle
                                cx={proj.x}
                                cy={proj.y}
                                r="26"
                                className="fill-none stroke-amber-500/40 stroke-2 animate-ping-slow origin-center"
                                style={{ transformOrigin: `${proj.x}px ${proj.y}px` }}
                              />
                            )}

                            {/* Outer pin ring */}
                            <circle
                              cx={proj.x}
                              cy={proj.y}
                              r={isCurSelected ? '13' : '10'}
                              className={`transition-all duration-300 ${circleColor} stroke-white ${isCurSelected ? 'stroke-2' : 'stroke-[1.5]'}`}
                            />

                            {/* Floating Emoji inside marker */}
                            <text
                              x={proj.x}
                              y={proj.y + (isCurSelected ? 3.5 : 3)}
                              textAnchor="middle"
                              className="text-[10px] select-none"
                            >
                              {markerIcon}
                            </text>

                            {/* Dynamic Name Tag */}
                            <text
                              x={proj.x}
                              y={proj.y + (isCurSelected ? 24 : 18)}
                              textAnchor="middle"
                              className={`text-[9px] font-sans font-extrabold tracking-wider p-0.5 ${
                                isCurSelected 
                                  ? 'fill-amber-700 dark:fill-amber-400 text-sm' 
                                  : 'fill-slate-600 dark:fill-slate-400 group-hover:fill-amber-600'
                              }`}
                            >
                              {isCurSelected ? item.nom.split(' (')[0] : ''}
                            </text>
                          </g>
                        );
                      })
                    ) : (
                      filteredPlaces.map((pl) => {
                        const isCurSelected = pl.id === selectedPlace.id;
                        const proj = projectLatLngToSVG(pl.lat, pl.lng);
                        const markerIcon = 
                          pl.category === 'hotel' ? '🏨' : 
                          pl.category === 'restaurant' ? '🍽️' : 
                          pl.category === 'monument' ? '🏛️' : 
                          pl.category === 'plage' ? '🏖️' : 
                          pl.category === 'favorite' ? '🌟' : '💎';
                        const circleColor = 
                          pl.category === 'hotel' 
                            ? 'fill-emerald-600 dark:fill-emerald-500' 
                            : pl.category === 'restaurant' 
                              ? 'fill-amber-500' 
                              : pl.category === 'monument'
                                ? 'fill-red-600'
                                : pl.category === 'plage'
                                  ? 'fill-sky-500'
                                  : pl.category === 'favorite'
                                    ? 'fill-pink-500'
                                    : 'fill-indigo-500';

                        return (
                          <g
                            key={pl.id}
                            className="cursor-pointer group"
                            onClick={() => {
                              setSelectedPlace(pl);
                              setNavigationRouteActive(false);
                            }}
                          >
                            {/* Pulse ring for active selection */}
                            {isCurSelected && (
                              <circle
                                cx={proj.x}
                                cy={proj.y}
                                r="26"
                                className="fill-none stroke-emerald-500/40 stroke-2 animate-ping-slow origin-center"
                                style={{ transformOrigin: `${proj.x}px ${proj.y}px` }}
                              />
                            )}

                            {/* Outer pin ring */}
                            <circle
                              cx={proj.x}
                              cy={proj.y}
                              r={isCurSelected ? '13' : '10'}
                              className={`transition-all duration-300 ${circleColor} stroke-white ${isCurSelected ? 'stroke-2' : 'stroke-[1.5]'}`}
                            />

                            {/* Floating Emoji inside marker */}
                            <text
                              x={proj.x}
                              y={proj.y + (isCurSelected ? 3.5 : 3)}
                              textAnchor="middle"
                              className="text-[10px] select-none"
                            >
                              {markerIcon}
                            </text>

                            {/* Dynamic Name Tag */}
                            <text
                              x={proj.x}
                              y={proj.y + (isCurSelected ? 24 : 20)}
                              textAnchor="middle"
                              className={`text-[9px] font-sans font-extrabold tracking-wider p-0.5 ${
                                isCurSelected 
                                  ? 'fill-emerald-700 dark:fill-emerald-400 text-sm' 
                                  : 'fill-slate-600 dark:fill-slate-400 group-hover:fill-emerald-600'
                              }`}
                            >
                              {isCurSelected ? pl.name.split(' (')[0] : ''}
                            </text>
                          </g>
                        );
                      })
                    )}
                  </svg>
                </div>
              )}
            </div>

            {/* Bottom mini-bar actions */}
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-gray-400 font-mono">
                  Coordonnées du lieu : {activeEngine === 'heritage' ? selectedHeritage?.latitude.toFixed(4) : selectedPlace?.lat?.toFixed(4)}°N, {activeEngine === 'heritage' ? selectedHeritage?.longitude.toFixed(4) : selectedPlace?.lng?.toFixed(4)}°E
                </span>
                <button 
                  onClick={() => {
                    setUseGoogleMapMode(!useGoogleMapMode);
                    if (!mapsApiKey) setShowConfigApiKey(true);
                  }}
                  className="text-[10px] font-extrabold text-emerald-600 dark:text-[#d4af37] flex items-center space-x-1 space-x-reverse cursor-pointer uppercase tracking-widest hover:underline"
                >
                  <span>Changer d'émulateur</span>
                  <ChevronRight size={10} />
                </button>
              </div>

            </div>

            {/* Right Column details & dynamic proximity suggestions & GPS tracker (md:col-span-12 or md:col-span-5 depending on screen size) */}
            <div className="md:col-span-12 lg:col-span-5 flex flex-col space-y-4">
              
              {/* Primary selection box detail block */}
              {activeEngine === 'heritage' ? (
              <div id="heritage-marker-details" className="bg-white dark:bg-[#111c2a]/90 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xl relative overflow-hidden transition duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 text-[8px] font-mono font-extrabold tracking-widest bg-amber-500/10 text-amber-700 dark:text-amber-400 uppercase rounded border border-amber-500/20 flex items-center gap-1 animate-pulse">
                    🏛️ CLASSIFIÉ ALGÉRIE
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-400">Région {selectedHeritage.region}</span>
                </div>

                <img
                  src={selectedHeritage.image}
                  alt={selectedHeritage.nom}
                  className="w-full h-32 object-cover rounded-xl mb-3 shadow-md border border-slate-100 dark:border-slate-800"
                />

                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {selectedHeritage.nom}
                </h3>
                
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5 mb-2.5">
                  <span className="text-[10px] font-mono text-amber-600 dark:text-[#d4af37] font-extrabold">
                    📍 {selectedHeritage.ville}, Wilaya de {selectedHeritage.wilaya}
                  </span>
                  <span className="text-[9px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">
                    Conservation : {selectedHeritage.etat}
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-slate-350 leading-relaxed mb-3">
                  {selectedHeritage.description}
                </p>

                {/* Document PDF Inspector button */}
                {selectedHeritage?.nom.toLowerCase().includes('tassili') || selectedHeritage?.id.includes('tassili') ? (
                  <button
                    onClick={() => setTassiliModalOpen(true)}
                    className="w-full py-2 px-3 mb-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>📄</span>
                      <span>Consulter Dossier UNESCO N° 179 (Tassili)</span>
                    </span>
                    <span className="font-mono text-[10px]">&rarr;</span>
                  </button>
                ) : selectedHeritage?.nom.toLowerCase().includes('santa') || selectedHeritage?.id.includes('santa') ? (
                  <button
                    onClick={() => setSantaCruzModalOpen(true)}
                    className="w-full py-2 px-3 mb-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>📄</span>
                      <span>Consulter Dossier Chapelle Santa-Cruz (PDF)</span>
                    </span>
                    <span className="font-mono text-[10px]">&rarr;</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setUnescoModalOpen(true)}
                    className="w-full py-2 px-3 mb-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>📄</span>
                      <span>Consulter Dossier UNESCO N° 555 (PDF)</span>
                    </span>
                    <span className="font-mono text-[10px]">&rarr;</span>
                  </button>
                )}

                {/* Associated artwork section */}
                {selectedHeritage.oeuvreAssociee && (
                  <div className="bg-amber-500/5 p-3 rounded-xl text-[10.5px] mt-4 border border-amber-550/15">
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-[#d4af37] font-extrabold mb-1">
                      <span>🎨</span>
                      <span>Chef-d'œuvre de Peinture Classée</span>
                    </div>
                    <div className="space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                      <p><span className="text-slate-450">Artiste :</span> <strong>{selectedHeritage.oeuvreAssociee.artiste}</strong></p>
                      <p><span className="text-slate-450">Titre :</span> <span className="italic">"{selectedHeritage.oeuvreAssociee.titre}"</span></p>
                      <p><span className="text-slate-450">Technique :</span> {selectedHeritage.oeuvreAssociee.technique} ({selectedHeritage.oeuvreAssociee.dimensions})</p>
                      <p className="text-[9px] text-[#b45309] dark:text-amber-400 mt-1">
                        🏠 Lieu de garde : <span className="font-extrabold">{selectedHeritage.oeuvreAssociee.lieuConservation}</span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-[9px] text-gray-400 block mt-3 italic font-mono">
                  Source: Le Journal Officiel N° 77, République Algérienne.
                </div>

                <EnhancedPlaceDetails 
                  name={selectedHeritage.nom} 
                  lat={selectedHeritage.latitude} 
                  lng={selectedHeritage.longitude} 
                  category="monument" 
                  language={language} 
                />

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {itinerary.some(item => item.id === selectedHeritage.id) ? (
                    <button
                      onClick={() => setItinerary(prev => prev.filter(item => item.id !== selectedHeritage.id))}
                      className="w-full py-2 bg-red-650 hover:bg-red-700 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition cursor-pointer"
                    >
                      &times; Ôter du circuit
                    </button>
                  ) : (
                    <button
                      onClick={() => setItinerary(prev => [...prev, selectedHeritage])}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl shadow-md transition cursor-pointer"
                    >
                      + Joindre au circuit
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setNavigationRouteActive(true);
                      setNavigationRunning(true);
                      setSimulatedProgress(0);
                    }}
                    className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 dark:hover:bg-slate-750 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition cursor-pointer"
                  >
                    Simuler GPS
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#111c2a]/90 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xl relative overflow-hidden transition duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-center space-x-2 space-x-reverse mb-3">
                  <span className="px-2 py-0.5 text-[8px] font-mono font-extrabold tracking-widest bg-emerald-50 text-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-400 uppercase rounded border border-emerald-500/20">
                    {selectedPlace.category === 'favorite' 
                      ? '🌟 Favori' 
                      : selectedPlace.category === 'hidden-gem' 
                        ? '💎 Inédit' 
                        : selectedPlace.category}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400">ID: {selectedPlace.id}</span>
                </div>

                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.name}
                  className="w-full h-28 object-cover rounded-xl mb-3.5 shadow-xs"
                />

                <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                  {selectedPlace.name}
                </h3>
                <p className="text-[10px] font-mono text-emerald-600 dark:text-[#d4af37] font-extrabold mt-1">
                  📍 {selectedPlace.address}
                </p>

                <p className="text-[11px] text-gray-500 dark:text-slate-350 leading-relaxed mt-2.5">
                  {language === 'ar' ? selectedPlace.description.ar : language === 'fr' ? selectedPlace.description.fr : selectedPlace.description.en}
                </p>

                {selectedPlace.specialty && (
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl text-[10px] mt-3 border border-slate-100 dark:border-slate-850 flex items-start space-x-2 space-x-reverse">
                    <Sparkles size={11} className="text-[#d4af37] mt-0.5" />
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">Point fort recommandé :</span>
                      <p className="text-gray-400 mt-0.5">
                        {language === 'ar' ? selectedPlace.specialty.ar : language === 'fr' ? selectedPlace.specialty.fr : selectedPlace.specialty.en}
                      </p>
                    </div>
                  </div>
                )}

                <EnhancedPlaceDetails 
                  name={selectedPlace.name} 
                  lat={selectedPlace.lat} 
                  lng={selectedPlace.lng} 
                  category={selectedPlace.category} 
                  language={language} 
                />

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {selectedPlace.category === 'hotel' ? (
                    <button
                      onClick={() => directBookInstantHotel(selectedPlace)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl shadow-md transition cursor-pointer"
                    >
                      Réserver {selectedPlace.price || '12000 DZD'}
                    </button>
                  ) : (
                    <div className="py-2 px-1 text-center bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-[10px] font-black text-slate-500 rounded-xl">
                      Tarif {selectedPlace.price || 'Entrée Libre / Varié'}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setActiveView('digital-twin');
                    }}
                    className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 dark:hover:bg-slate-750 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition cursor-pointer"
                  >
                    Visite Virtuelle 360°
                  </button>
                </div>
              </div>
            )}

            {/* GPS integrated Navigation computer */}
            <div className="bg-[#111c2a] text-white p-5 rounded-2xl shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono font-black tracking-widest uppercase text-red-500 flex items-center space-x-2 space-x-reverse mb-4">
                  <Navigation size={13} className="text-red-500 animate-spin-slow" />
                  <span>Calculateur GPS Intégral</span>
                </h4>

                {/* Grid Inputs selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs font-mono">
                  <div>
                    <label className="block text-[8px] text-gray-400 tracking-wider uppercase mb-1">🎯 Point de départ</label>
                    <select
                      value={gpsOriginPreset}
                      onChange={(e) => {
                        setGpsOriginPreset(e.target.value);
                        setNavigationRouteActive(false);
                      }}
                      className="w-full text-[10px] bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1.5 focus:outline-emerald-500 text-white"
                    >
                      <option value="airport-alger">Aéroport d'Alger (ALG)</option>
                      <option value="center-oran">Gares ferroviaires Oran</option>
                      <option value="center-constantine">Ponts Constantine</option>
                      <option value="desert-ghardaia">M'zab Oasis, Ghardaïa</option>
                      <option value="desert-djanet">Quartier Oasis Djanet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] text-gray-400 tracking-wider uppercase mb-1">🏁 Destination</label>
                    <input
                      type="text"
                      className="w-full text-[10px] bg-slate-950/30 border border-slate-800 px-2 py-1.5 rounded-lg text-slate-350 cursor-not-allowed"
                      disabled
                      value={selectedPlace.name.split(' (')[0]}
                    />
                  </div>
                </div>

                {/* Modality chooser */}
                <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
                  <button
                    onClick={() => {
                      setTransitMode('DRIVING');
                      setNavigationRouteActive(false);
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer ${
                      transitMode === 'DRIVING' 
                        ? 'bg-red-500 border-red-500 text-white' 
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Car size={15} />
                    <span className="text-[8px] font-mono font-bold mt-1">Voiture</span>
                  </button>
                  <button
                    onClick={() => {
                      setTransitMode('WALKING');
                      setNavigationRouteActive(false);
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer ${
                      transitMode === 'WALKING' 
                        ? 'bg-red-500 border-red-500 text-white' 
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Footprints size={15} />
                    <span className="text-[8px] font-mono font-bold mt-1">À Pied</span>
                  </button>
                  <button
                    onClick={() => {
                      setTransitMode('TRANSIT');
                      setNavigationRouteActive(false);
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer ${
                      transitMode === 'TRANSIT' 
                        ? 'bg-red-500 border-red-500 text-white' 
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Bus size={15} />
                    <span className="text-[8px] font-mono font-bold mt-1">Transit</span>
                  </button>
                </div>

                {/* Route computer info or active tracker */}
                {navigationRouteActive ? (
                  <div className="bg-slate-910/70 border border-slate-850 p-3 rounded-xl text-[11px] font-mono text-slate-300">
                    <div className="flex items-center justify-between font-black text-rose-500 text-[10px] mb-2 uppercase tracking-wide">
                      <span>Guidage GPS en temps-réel</span>
                      <span className="animate-pulse">● {navigationRunning ? 'En Route...' : 'Arrivé'}</span>
                    </div>

                    {/* Active Navigation Steps slider */}
                    <div className="flex items-start space-x-2 space-x-reverse mb-3 p-1 rounded-lg bg-black/20">
                      <Volume2 size={15} className="text-red-500 flex-shrink-0 mt-0.5 animate-bounce" />
                      <div className="flex-1">
                        <span className="text-[8px] uppercase tracking-wider text-red-400 font-bold">Assistance Vocale RAHALA</span>
                        <p className="text-[10px] text-white leading-tight font-extrabold">"{navSteps[navigationStepIndex]?.soundCue}"</p>
                      </div>
                    </div>

                    {/* List route details */}
                    <div className="space-y-1.5 text-[10px] border-l border-red-500/40 pl-3">
                      <p className="text-white font-extrabold">{navSteps[navigationStepIndex]?.text}</p>
                      <p className="text-gray-400 text-[9px]">Distance restante pour cette étape : {navSteps[navigationStepIndex]?.dist}</p>
                    </div>

                    {/* Simulated process bar */}
                    <div className="mt-3">
                      <div className="flex justify-between items-center text-[9px] mb-1">
                        <span>Progression de l'itinéraire</span>
                        <span>{simulatedProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-red-500 h-full transition-all duration-300"
                          style={{ width: `${simulatedProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/30 p-4 border border-slate-850/60 rounded-xl text-center">
                    <p className="text-xs text-gray-300 font-serif italic mb-1">Évaluation du trajet estimé :</p>
                    <p className="text-xl font-mono font-black text-emerald-400">
                      {trackRouteDistance.toFixed(1)} km <span className="text-xs text-slate-400">({travelTimeMinutes} min)</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                {navigationRouteActive ? (
                  <button
                    onClick={() => {
                      setNavigationRouteActive(false);
                      setNavigationRunning(false);
                    }}
                    className="w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Quitter le Guidage GPS
                  </button>
                ) : (
                  <button
                    onClick={handleStartGPSNavigation}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 space-x-reverse shadow-md shadow-red-600/20 active:scale-98"
                  >
                    <Navigation size={13} className="rotate-45" />
                    <span>Lancer la navigation GPS</span>
                  </button>
                )}
              </div>
            </div>

            {/* Smart real-time relative suggestions box ("Suggestions Lieux proches") */}
            <div className="bg-white dark:bg-[#111c2a]/90 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xl">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3.5 flex items-center space-x-2 space-x-reverse">
                <Sparkles className="text-amber-500 fill-amber-500" size={14} />
                <span>Suggestions en temps réel : Lieux proches</span>
              </h4>
              
              <div className="space-y-2.5">
                {proximitySuggestions.map((p) => {
                  const icon = p.category === 'hotel' ? '🏨' : p.category === 'restaurant' ? '🍽️' : '🏛️';
                  return (
                    <div 
                      key={p.id}
                      className="p-3 bg-slate-50/70 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-850/60 flex items-center justify-between group hover:border-[#d4af37]"
                    >
                      <div className="flex items-center space-x-2.5 space-x-reverse min-w-0">
                        <span className="text-xl flex-shrink-0">{icon}</span>
                        <div className="min-w-0">
                          <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-100 truncate max-w-[130px] sm:max-w-none">
                            {p.name.split(' (')[0]}
                          </h5>
                          <p className="text-[9px] text-amber-600 dark:text-[#d4af37] font-extrabold font-mono">
                            📏 À seulement {p.distance.toFixed(1)} km <span className="text-slate-400 font-normal">({Math.round(p.distance * 1.5)} mins)</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedPlace(p);
                          setNavigationRouteActive(false);
                        }}
                        className="px-2.5 py-1 text-[9px] font-mono font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-lg whitespace-nowrap cursor-pointer"
                      >
                        Voir & S'y Rendre
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* API Key Modal setup wizard */}
      {showConfigApiKey && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111c2a] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-emerald-500/20 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowConfigApiKey(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Configuration Google Maps</h3>
              <p className="text-xs text-gray-400 mt-1">Activez l'itinéraire Google officiel de l'Algérie</p>
            </div>

            <div className="space-y-4 text-xs text-gray-600 dark:text-slate-350 leading-relaxed font-sans">
              <p className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-150 dark:border-slate-800">
                L'application dispose d'une <strong>Carte Vectorielle Tactile</strong> qui fonctionne sans connexion externe. Pour voir l'Afrique du Nord en satellite de précision, fournissez une clé d'API Google Maps.
              </p>

              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400 mb-1">
                  Saisir GOOGLE_MAPS_PLATFORM_KEY
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-amber-500/10 p-3 rounded-xl text-amber-800 dark:text-amber-400 border border-amber-500/20 text-[11px]">
                <p className="font-bold flex items-center gap-1.5"><AlertCircle size={13} /> Alternative recommandée :</p>
                <p className="mt-1">
                  Vous pouvez également configurer la clé comme un secret dans Google AI Studio en ouvrant les <strong>Paramètres</strong> (icône d'engrenage &agrave; droite), puis en ajoutant l'environnement <code>GOOGLE_MAPS_PLATFORM_KEY</code>.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRegisterApiKey}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Générer et Activer
                </button>
                {mapsApiKey && (
                  <button
                    onClick={handleClearApiKey}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Effacer clé
                  </button>
                )}
                <button
                  onClick={() => setShowConfigApiKey(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice modal helper popup */}
      {showInvoiceAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111c2a] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-emerald-500/20 animate-scale-up">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">Chambre payée avec succès !</h3>
              <p className="text-[10px] text-gray-400 font-mono mt-1">Référence Réservation : {showInvoiceAlert}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 space-y-2 text-xs mb-4 border border-slate-100 dark:border-slate-850">
              <div className="flex justify-between text-gray-500 dark:text-slate-400">
                <span>Séjour standard :</span>
                <span className="font-bold text-gray-800 dark:text-slate-100">2 Nuits (Double Deluxe)</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-slate-400">
                <span>Inclus :</span>
                <span className="font-bold text-gray-800 dark:text-slate-105">Petit déjeuner traditionnel</span>
              </div>
              <div className="flex justify-between border-t border-gray-150 dark:border-slate-800 pt-2 text-slate-850 dark:text-white font-extrabold">
                <span>Statut facture :</span>
                <span className="text-emerald-600 font-bold">Soldé (DZD)</span>
              </div>
            </div>

            <button
               onClick={() => {
                 setShowInvoiceAlert(null);
                 setActiveView('dashboard');
               }}
               className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
             >
               Aller au tableau de bord voyage &rarr;
             </button>
           </div>
         </div>
       )}

       {/* Custom Pin creation modal */}
       {showPinModal && customPinForm && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
           <div className="bg-white dark:bg-[#111c2a] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-emerald-500/30 animate-scale-up">
             
             <div className="text-center mb-4">
               <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-2">
                 <span className="text-2xl">📍</span>
               </div>
               <h3 className="text-base font-bold text-gray-900 dark:text-white">Épingler un nouveau lieu mémorisé</h3>
               <p className="text-[10px] text-emerald-600 dark:text-[#d4af37] font-mono mt-1">
                 Latitude: {customPinForm.lat}°N | Longitude: {customPinForm.lng}°E
               </p>
             </div>

             <form onSubmit={handleAddCustomPin} className="space-y-4">
               <div>
                 <label className="block text-[10px] uppercase font-mono font-bold text-gray-400 mb-1">
                   Nom du lieu <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="text"
                   required
                   placeholder="Ex: Ma crique secrète de Tipaza, Point de vue d'Oran..."
                   value={pinName}
                   onChange={(e) => setPinName(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                 />
               </div>

               <div>
                 <label className="block text-[10px] uppercase font-mono font-bold text-gray-400 mb-1">
                   Type de l'emplacement
                 </label>
                 <div className="grid grid-cols-2 gap-3">
                   <button
                     type="button"
                     onClick={() => setPinCategory('favorite')}
                     className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                       pinCategory === 'favorite'
                         ? 'bg-pink-55 border-pink-500 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400'
                         : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                     }`}
                   >
                     <span>🌟</span>
                     <span>Mon Favori</span>
                   </button>

                   <button
                     type="button"
                     onClick={() => setPinCategory('hidden-gem')}
                     className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                       pinCategory === 'hidden-gem'
                         ? 'bg-indigo-55 border-indigo-500 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                         : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                     }`}
                   >
                     <span>💎</span>
                     <span>Trésor Inédit</span>
                   </button>
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] uppercase font-mono font-bold text-gray-400 mb-1">
                   Description ou Note (facultative)
                 </label>
                 <textarea
                   rows={2}
                   placeholder="Ex: Une eau turquoise cristalline et aucun touriste à l'horizon..."
                   value={pinDescription}
                   onChange={(e) => setPinDescription(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none"
                 />
               </div>

               <div className="flex gap-3 pt-2">
                 <button
                   type="submit"
                   className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                 >
                   Enregistrer l'épingle
                 </button>
                 <button
                   type="button"
                   onClick={() => {
                     setShowPinModal(false);
                     setCustomPinForm(null);
                   }}
                   className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-705 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                 >
                   Annuler
                 </button>
               </div>
             </form>

           </div>
         </div>
       )}

        <UnescoDocumentModal
          isOpen={unescoModalOpen}
          onClose={() => setUnescoModalOpen(false)}
          siteName={selectedHeritage?.nom || "La Casbah d'Alger"}
        />

        <SantaCruzDocumentModal
          isOpen={santaCruzModalOpen}
          onClose={() => setSantaCruzModalOpen(false)}
          siteName={selectedHeritage?.nom || "Chapelle de Santa-Cruz (Oran)"}
        />

        <TassiliDocumentModal
          isOpen={tassiliModalOpen}
          onClose={() => setTassiliModalOpen(false)}
          siteName={selectedHeritage?.nom || "Parc National du Tassili n'Ajjer (Djanet)"}
        />
     </div>
   );
 };
