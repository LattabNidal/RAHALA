import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ShoppingBag, 
  MapPin, 
  Filter, 
  Tag, 
  Clock, 
  X, 
  Check, 
  Phone, 
  MessageSquare, 
  User, 
  Star, 
  Sparkles, 
  Upload, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  PhoneCall as WhatsappIcon,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  Share2
} from 'lucide-react';
import { PriceTag } from './rahala/PriceTag';
import { LazyImage } from './rahala/LazyImage';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export interface Product {
  id: string;
  title: string;
  description: string;
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
    isVerified: boolean;
  };
  postedAt: string;
  viewsCount?: number;
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

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Tapis Zerba Traditionnel M\'Zab en Pure Laine',
    description: 'Authentique tapis artisanal fait main par les tisserandes de la vallée du M\'Zab (Ghardaïa). Laine vierge naturelle aux motifs géométriques berbères séculaires. Dimensions: 200cm x 150cm.',
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
      isVerified: true
    },
    postedAt: 'Il y a 2 heures',
    viewsCount: 142
  },
  {
    id: 'prod-2',
    title: 'Burnous Traditionnel Saharien (Kachabia Chameau)',
    description: 'Kachabia haut de gamme tissée en poil de chameau véritable ( الوبر الصافي ). Chaude, résistante et idéale pour les nuits fraîches du Sahara et les grands froids.',
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
      isVerified: true
    },
    postedAt: 'Il y a 5 heures',
    viewsCount: 98
  },
  {
    id: 'prod-3',
    title: 'Parure Bijoux Kabyles Argent & Corail Véritable',
    description: 'Sublime parure artisanale traditionnelle de Beni Yenni (Tizi Ouzou). Argent massif 925 ciselé et serti de corail rouge naturel certifié. Comprend collier, tadj et bracelets.',
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
      isVerified: true
    },
    postedAt: 'Hier',
    viewsCount: 310
  },
  {
    id: 'prod-4',
    title: 'Tente Bivouac 4 Saisons Spéciale Desert Tassili',
    description: 'Tente de randonnée renforcée contre le vent et le sable, double toit aluminisé anti-UV. Utilisée seulement 2 fois lors d\'un circuit à Djanet. État impeccable.',
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
      isVerified: false
    },
    postedAt: 'Hier',
    viewsCount: 205
  },
  {
    id: 'prod-5',
    title: 'Coffret Dattes Deglet Nour de Biskra (5kg Premium)',
    description: 'Dattes mielleuses Deglet Nour d\'Algérie récolte fraîche des palmeraies de Tolga (Biskra). Qualité d\'exportation supérieure, conditionnées sous vide.',
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
      isVerified: true
    },
    postedAt: 'Il y a 2 jours',
    viewsCount: 420
  },
  {
    id: 'prod-6',
    title: 'Poterie Artisanale Émaillée de Bider Tlemcen',
    description: 'Vase et plats de service en argile cuite et émaillée selon la méthode ancestrale tlemcénienne. Motifs zellige traditionnels peints à la main.',
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
      isVerified: true
    },
    postedAt: 'Il y a 3 jours',
    viewsCount: 180
  },
  {
    id: 'prod-7',
    title: 'Sac de Coucher Grand Froid (-15°C) Trekking Sahara',
    description: 'Sac de couchage ultra-léger garnissage duvet d\'oie. Idéal pour les expéditions hivernales à l\'Assekrem et le bivouac à Tadrart.',
    price: 11200,
    category: 'Équipement Bivouac & Camping',
    wilaya: '33 - Illizi',
    condition: 'Occasion',
    images: [
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Youcef Djanet Guide',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      phone: '+213 663 99 88 77',
      rating: 5.0,
      reviewCount: 29,
      memberSince: 'Mai 2024',
      isVerified: true
    },
    postedAt: 'Il y a 4 jours',
    viewsCount: 230
  },
  {
    id: 'prod-8',
    title: 'Robe Chaoui Traditionnelle Brodée à la Main (Batna)',
    description: 'Robe traditionnelle des Aurès faite sur mesure en velours noir d\'Orient avec broderies d\'or et de soie (Mlhafa Chaouia).',
    price: 16500,
    category: 'Vêtements Traditionnels',
    wilaya: '05 - Batna',
    condition: 'Neuf',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Couture Aurès Prestige',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      phone: '+213 552 33 44 55',
      rating: 4.9,
      reviewCount: 41,
      memberSince: 'Août 2024',
      isVerified: true
    },
    postedAt: 'Il y a 5 jours',
    viewsCount: 350
  }
];

export const RahalaMarket: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useApp();

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

  // Selected Product Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
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
  const [formError, setFormError] = useState('');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rahala_market_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Show temporary toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.wilaya.toLowerCase().includes(searchTerm.toLowerCase());

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

    return matchesSearch && matchesCategory && matchesWilaya && matchesCondition && matchesPrice;
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
        name: currentUser?.name || 'Anonyme RAHALA',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        phone: newPhone.trim(),
        rating: 5.0,
        reviewCount: 1,
        memberSince: 'Aujourd\'hui',
        isVerified: true
      },
      postedAt: 'À l\'instant',
      viewsCount: 1
    };

    setProducts([newProd, ...products]);
    setIsAddModalOpen(false);
    triggerToast('🎉 Votre annonce a été publiée avec succès sur RAHALA Market !');

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewPrice('');
    setNewCategory('Artisanat & Tapis');
    setNewWilaya('16 - Alger');
    setNewCondition('Neuf');
    setUploadedImages([]);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Toutes catégories');
    setSelectedWilaya('Toutes les Wilayas');
    setSelectedCondition('Tous');
    setPriceMin('');
    setPriceMax('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 animate-fade-in font-sans text-[#1E293B]">
      
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
                E-Commerce & Tourism Tourism Market
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#1E293B]">
              Marketplace Local
            </h1>
            <p className="text-sm text-[#1E293B]/70 mt-1 font-medium">
              Achetez et vendez partout en Algérie — Artisanat, équipements de bivouac et souvenirs locaux.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3.5 bg-[#D4AF37] hover:bg-[#C29B2E] text-[#1E293B] font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 shadow-md hover:scale-102 active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            <span>Publier une annonce</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* 2. SEARCH + FILTER BAR (Sticky / Card) */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-sm mb-8 space-y-4">
          
          {/* Main search row */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E293B]/40" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher produit (ex: Tapis, Burnous, Tente, Dattes...)..."
              className="w-full pl-11 pr-10 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] placeholder-[#1E293B]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#1E293B]/40 hover:text-[#1E293B]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Wilaya Filter */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E293B]/60 mb-1">
                Wilaya
              </label>
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
              >
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E293B]/60 mb-1">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E293B]/60 mb-1">
                État du produit
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#F8FAFC] p-1 border border-[#E2E8F0] rounded-xl text-center">
                {(['Tous', 'Neuf', 'Occasion'] as const).map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      selectedCondition === cond
                        ? 'bg-[#1E293B] text-white shadow-xs'
                        : 'text-[#1E293B]/70 hover:text-[#1E293B]'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1E293B]/60 mb-1">
                Prix (DZD)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full py-2 px-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-[#1E293B]/40 text-xs font-bold">-</span>
                <input
                  type="number"
                  placeholder="Max"
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
              Filtres rapides :
            </span>
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
                  {cat}
                </button>
              );
            })}
            
            {(selectedCategory !== 'Toutes catégories' || selectedWilaya !== 'Toutes les Wilayas' || selectedCondition !== 'Tous' || searchTerm || priceMin || priceMax) && (
              <button
                onClick={resetFilters}
                className="shrink-0 ml-auto px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw size={12} />
                Réinitialiser
              </button>
            )}
          </div>

        </div>

        {/* Search Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/60">
            {filteredProducts.length} {filteredProducts.length > 1 ? 'Annonces disponibles' : 'Annonce disponible'}
          </p>
          <div className="text-[11px] text-[#1E293B]/60 italic font-serif">
            Mises à jour quotidiennes de vendeurs vérifiés
          </div>
        </div>

        {/* 3. PRODUCT GRID (MAIN) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm my-12">
            <ShoppingBag size={48} className="mx-auto text-[#D4AF37] mb-4 opacity-50" />
            <h3 className="text-lg font-serif font-black text-[#1E293B] mb-2">
              Aucun produit ne correspond à votre recherche
            </h3>
            <p className="text-xs text-[#1E293B]/60 leading-relaxed mb-6">
              Essayez de réinitialiser vos filtres ou de modifier vos termes de recherche pour découvrir d'autres articles locaux.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#1E293B] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#1E293B]/90 transition cursor-pointer"
            >
              Afficher toutes les annonces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
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
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Condition Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border shadow-xs ${
                        prod.condition === 'Neuf'
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-slate-700 text-white border-slate-600'
                      }`}>
                        {prod.condition}
                      </span>
                    </div>

                    {/* Category Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-mono rounded-md truncate max-w-full">
                        {prod.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-serif font-black text-[#1E293B] line-clamp-2 leading-snug mb-2 group-hover:text-[#D4AF37] transition">
                      {prod.title}
                    </h3>

                    {/* Price tag */}
                    <div className="mb-3">
                      <PriceTag amount={prod.price} className="text-base sm:text-lg text-[#D4AF37] font-black" />
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#1E293B]/70 font-medium truncate mb-2">
                      <MapPin size={13} className="text-[#D4AF37] shrink-0" />
                      <span className="truncate">{prod.wilaya}</span>
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[10px] text-[#1E293B]/60 font-mono">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{prod.postedAt}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#D4AF37] font-bold group-hover:translate-x-0.5 transition">
                    <span>Détails</span>
                    <ChevronRight size={12} />
                  </div>
                </div>

              </div>
            ))}
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
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#D4AF37]/15 text-[#D4AF37] rounded-md border border-[#D4AF37]/30">
                  {selectedProduct.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  selectedProduct.condition === 'Neuf' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {selectedProduct.condition}
                </span>
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
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
                    <img
                      src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
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
                </div>

                {/* Right: Info */}
                <div className="flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1E293B] mb-3 leading-tight">
                      {selectedProduct.title}
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
                        <span>{selectedProduct.postedAt}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono uppercase font-bold text-[#1E293B]/60 mb-2">
                        Description de l'article :
                      </h4>
                      <p className="text-xs sm:text-sm text-[#1E293B]/80 leading-relaxed font-sans">
                        {selectedProduct.description}
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
                            <ShieldCheck size={14} className="text-[#D4AF37] shrink-0" title="Vendeur Vérifié" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#1E293B]/60 font-mono mt-0.5">
                          <span className="flex items-center text-amber-500 font-bold">
                            ★ {selectedProduct.seller.rating} ({selectedProduct.seller.reviewCount} avis)
                          </span>
                          <span>•</span>
                          <span>Membre depuis {selectedProduct.seller.memberSince}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`https://wa.me/${selectedProduct.seller.phone.replace(/[^0-9]/g, '')}?text=Bonjour,%20je%20suis%20intéressé%20par%20votre%20annonce%20sur%20RAHALA%20Market:%20${encodeURIComponent(selectedProduct.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <WhatsappIcon size={14} />
                        WhatsApp
                      </a>

                      <a
                        href={`tel:${selectedProduct.seller.phone}`}
                        className="py-2.5 bg-[#1E293B] hover:bg-[#1E293B]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <Phone size={14} />
                        Appeler
                      </a>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center text-xs font-mono text-[#1E293B]/60">
              <span>Référence Annonce: #{selectedProduct.id}</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  triggerToast('Lien de l\'annonce copié dans le presse-papier ! 📋');
                }}
                className="flex items-center gap-1 text-[#D4AF37] font-bold hover:underline cursor-pointer"
              >
                <Share2 size={13} />
                Partager
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. ADD PRODUCT FLOW (MODAL FORM) */}
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
                    Publier une nouvelle annonce
                  </h3>
                  <p className="text-[11px] text-[#1E293B]/60">
                    Proposez vos articles artisanaux ou de voyage aux utilisateurs de RAHALA.
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
                    Titre de l'annonce *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Tapis Zerba fait main, Burnous..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full py-2.5 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                    Prix (DZD) *
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
                    Catégorie
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] font-semibold focus:outline-none focus:border-[#D4AF37]"
                  >
                    {CATEGORIES.filter(c => c !== 'Toutes catégories').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                    Wilaya
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
                    État
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as 'Neuf' | 'Occasion')}
                    className="w-full py-2.5 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] font-semibold focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Neuf">Neuf</option>
                    <option value="Occasion">Occasion</option>
                  </select>
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                  Téléphone / WhatsApp *
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

              {/* Description */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                  Description détaillée *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Décrivez l'origine, les dimensions, l'état ou les détails de l'article..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Image Upload section */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1E293B]/70 mb-1">
                  Photos de l'article
                </label>
                
                {/* Drag & Drop simulated box / URL adder */}
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-2xl p-4 bg-[#F8FAFC] text-center space-y-3">
                  <Upload size={24} className="mx-auto text-[#D4AF37]" />
                  <p className="text-xs text-[#1E293B]/70 font-medium">
                    Ajoutez des photos de votre produit
                  </p>

                  <div className="flex gap-2 max-w-md mx-auto">
                    <input
                      type="url"
                      placeholder="URL de l'image (https://...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 py-1.5 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={handleCustomImageUrl}
                      className="px-3 py-1.5 bg-[#1E293B] text-white text-xs font-bold rounded-xl hover:bg-[#1E293B]/90 cursor-pointer"
                    >
                      Ajouter
                    </button>
                  </div>

                  {/* Sample presets for quick demo image selection */}
                  <div className="pt-2">
                    <p className="text-[10px] font-mono text-[#1E293B]/50 uppercase mb-2">
                      Ou choisissez une illustration de démonstration :
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        { name: 'Tapis', url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Vêtement', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Bijoux', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Bivouac', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Poterie', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80' }
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
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C29B2E] text-[#1E293B] rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md hover:scale-102 active:scale-95 cursor-pointer"
                >
                  Publier l'annonce
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
