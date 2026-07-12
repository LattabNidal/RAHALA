import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Share2, 
  Plus, 
  MapPin, 
  Star, 
  Camera, 
  X, 
  Sliders, 
  Filter, 
  Check, 
  Calendar, 
  ArrowLeft, 
  Search, 
  Send,
  Sparkles,
  ExternalLink,
  Copy,
  Facebook,
  PhoneCall as Whatsapp,
  MessageSquare,
  Activity,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  MessageCircle
} from 'lucide-react';
import { socialService, UnifiedPost, UnifiedReview } from '../lib/supabase';


export interface SocialPost {
  id: string;
  image: string; // base64 or Unsplash URL
  description: string;
  location: string;
  rating: number; // 1 to 5 star rating
  likes: number;
  likedByCurrentUser: boolean;
  createdAt: string;
  authorName: string;
  authorAvatar: string;
  tags: string[];
  filters?: {
    brightness: number;
    contrast: number;
    grayscale: number;
    saturate: number;
    sepia: number;
  };
}

const DEFAULT_POSTS: SocialPost[] = [
  {
    id: "post-seed-1",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    description: "Coucher de soleil magique sur le Tassili n'Ajjer. Une immensité mystique et des paysages lunaires inoubliables. #Sahara #Algerie #Tassili #Aventure",
    location: "Tassili n'Ajjer, Djanet 🇩🇿",
    rating: 5,
    likes: 124,
    likedByCurrentUser: false,
    createdAt: "2026-06-18T18:30:00.000Z",
    authorName: "Sofiane El Rihla",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    tags: ["Sahara", "Algerie", "Tassili", "Aventure"],
    filters: {
      brightness: 105,
      contrast: 110,
      grayscale: 0,
      saturate: 120,
      sepia: 10
    }
  },
  {
    id: "post-seed-2",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    description: "La majestueuse ville des ponts suspendus sous une brume matinale féerique. Une merveille d'architecture et de courage humain. #Constantine #Patrimoine #Histoire",
    location: "Sidi M'Cid, Constantine 🇩🇿",
    rating: 5,
    likes: 98,
    likedByCurrentUser: false,
    createdAt: "2026-06-19T09:15:00.000Z",
    authorName: "Amira Travel",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    tags: ["Constantine", "Patrimoine", "Histoire"],
    filters: {
      brightness: 100,
      contrast: 105,
      grayscale: 0,
      saturate: 110,
      sepia: 0
    }
  },
  {
    id: "post-seed-3",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
    description: "Flânerie dans les ruelles blanchies à la chaux de la Casbah historique d’Alger. Une âme incomparable, chargée d'histoire et de jasmin. #Algers #Casbah #Tradition",
    location: "La Casbah, Alger 🇩🇿",
    rating: 4,
    likes: 83,
    likedByCurrentUser: false,
    createdAt: "2026-06-20T11:40:00.000Z",
    authorName: "Yacine Dz",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    tags: ["Algers", "Casbah", "Tradition"],
    filters: {
      brightness: 95,
      contrast: 115,
      grayscale: 0,
      saturate: 105,
      sepia: 5
    }
  }
];

export const SocialClub: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser } = useApp();

  // Storage and lists
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'feed' | 'create' | 'review'>('feed');
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);

  // Reviews Tab States (ReviewSection)
  const [reviewsList, setReviewsList] = useState<UnifiedReview[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<string>('landmark-casbah');
  const [landmarkRating, setLandmarkRating] = useState<number>(5);
  const [landmarkComment, setLandmarkComment] = useState<string>("");
  const [isSubmitReviewLoading, setIsSubmitReviewLoading] = useState<boolean>(false);

  const LANDMARKS_LIST = [
    { id: 'landmark-casbah', name: "La Casbah d'Alger 🕌", region: 'Alger', desc: "La citadelle monumentale d'Alger-la-Blanche." },
    { id: 'landmark-tassili', name: "Tassili n'Ajjer 🌅", region: 'Djanet, Sahara', desc: "Un musée à ciel ouvert de l'art rupestre préhistorique." },
    { id: 'landmark-constantine', name: "Les Ponts Suspendus 🌉", region: 'Constantine', desc: "La vertigineuse cité perchée au bord du gouffre du Rhummel." },
    { id: 'landmark-gardaia', name: "La Vallée du M'zab 🌴", region: 'Ghardaïa', desc: "Une merveille d'architecture oasienne unique." },
    { id: 'landmark-timgad', name: "Les Ruines de Timgad 🏛️", region: 'Batna', desc: "L'ancienne colonie romaine d'Afrique du Nord aux portes des Aurès." }
  ];

  // Interactive share modals
  const [shareDropdownPostId, setShareDropdownPostId] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [sharingPost, setSharingPost] = useState<SocialPost | null>(null);
  const [instagramCopied, setInstagramCopied] = useState<boolean>(false);

  // Full screen Lightroom/Lightbox
  const [lightboxPost, setLightboxPost] = useState<SocialPost | null>(null);

  // Post Creator parameters
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [creatorImage, setCreatorImage] = useState<string | null>(null);
  const [creatorDesc, setCreatorDesc] = useState("");
  const [creatorLoc, setCreatorLoc] = useState("");
  const [creatorRating, setCreatorRating] = useState<number>(5);
  const [creatorSelectedTags, setCreatorSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");
  
  // Real-time Photo Filters
  const [filterBrightness, setFilterBrightness] = useState(100);
  const [filterContrast, setFilterContrast] = useState(100);
  const [filterGrayscale, setFilterGrayscale] = useState(0);
  const [filterSaturate, setFilterSaturate] = useState(100);
  const [filterSepia, setFilterSepia] = useState(0);

  // Popular preseeded filters
  const filterPresets = [
    { name: "Normal", b: 100, c: 100, g: 0, sat: 100, sep: 0 },
    { name: "Sahara Gold", b: 105, c: 110, g: 0, sat: 125, sep: 15 },
    { name: "Vintage Casbah", b: 95, c: 105, g: 0, sat: 90, sep: 35 },
    { name: "Constantine Mist", b: 110, c: 92, g: 10, sat: 115, sep: 5 },
    { name: "Cinematic High Contrast", b: 102, c: 125, g: 0, sat: 130, sep: 0 },
    { name: "B&W Nostalgia", b: 100, c: 120, g: 100, sat: 0, sep: 10 }
  ];

  // Hot Algerian Hashtags
  const HOT_TAGS = ["Sahara", "Algerie", "Tassili", "Aventure", "Constantine", "Patrimoine", "Histoire", "Algers", "Casbah", "Tradition", "Oran", "Plage", "Gastronomie"];

  // Helper to extract hashtags from text
  const extractHashtags = (text: string): string[] => {
    const matches = text.match(/#\w+/g);
    if (!matches) return [];
    return matches.map(m => m.substring(1));
  };

  // Initialize and load from service
  const loadPostsFromService = async () => {
    setIsLoadingPosts(true);
    try {
      const dbPosts = await socialService.getPosts(currentUser?.id || 'visitor');
      const mapped: SocialPost[] = dbPosts.map(p => ({
        id: p.id,
        image: p.image_url,
        description: p.description,
        location: p.location,
        rating: p.rating || 5,
        likes: p.likes_count,
        likedByCurrentUser: p.liked_by_user,
        createdAt: p.created_at,
        authorName: p.author_name || "Voyageur Rahala",
        authorAvatar: p.author_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        tags: extractHashtags(p.description)
      }));
      setPosts(mapped);
    } catch (e) {
      console.error("Failed to fetch posts:", e);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const loadReviewsFromService = async () => {
    try {
      const list = await socialService.getReviews(selectedLandmark);
      setReviewsList(list);
    } catch (e) {
      console.error("Failed to load reviews:", e);
    }
  };

  useEffect(() => {
    loadPostsFromService();
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'review') {
      loadReviewsFromService();
    }
  }, [selectedLandmark, activeTab]);

  // Deep linking and URL Share check
  useEffect(() => {
    const handleUrlDeepLink = () => {
      const params = new URLSearchParams(window.location.search);
      const postIdParam = params.get('postId');
      if (postIdParam && posts.length > 0) {
        const matched = posts.find(p => p.id === postIdParam);
        if (matched) {
          setLightboxPost(matched);
        }
      }
    };
    handleUrlDeepLink();
  }, [posts]);

  // Like toggle with dynamic counter
  const handleLike = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentUserId = currentUser?.id || 'visitor-uuid';
    try {
      const result = await socialService.toggleLike(id, currentUserId);
      const updated = posts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            likedByCurrentUser: result.liked,
            likes: result.currentCount
          };
        }
        return post;
      });
      setPosts(updated);

      if (lightboxPost && lightboxPost.id === id) {
        setLightboxPost({
          ...lightboxPost,
          likedByCurrentUser: result.liked,
          likes: result.currentCount
        });
      }
    } catch (err) {
      console.error("Failed to toggle like on server:", err);
    }
  };

  // Image upload FileReader converter
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCreatorImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick preset loader
  const applyPreset = (preset: typeof filterPresets[0]) => {
    setFilterBrightness(preset.b);
    setFilterContrast(preset.c);
    setFilterGrayscale(preset.g);
    setFilterSaturate(preset.sat);
    setFilterSepia(preset.sep);
  };

  // Creator tags manager
  const handleToggleCreatorTag = (tag: string) => {
    if (creatorSelectedTags.includes(tag)) {
      setCreatorSelectedTags(creatorSelectedTags.filter(t => t !== tag));
    } else {
      setCreatorSelectedTags([...creatorSelectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim().replace(/^#/, '');
    if (trimmed && !creatorSelectedTags.includes(trimmed)) {
      setCreatorSelectedTags([...creatorSelectedTags, trimmed]);
      setCustomTagInput("");
    }
  };

  // Publish final post!
  const handlePublish = async () => {
    if (!creatorImage) {
      alert("S'il vous plaît, ajoutez d'abord une photo de votre voyage ! 📸");
      return;
    }

    const currentUserId = currentUser?.id || 'visitor-uuid';
    const authorName = currentUser?.name || "Voyageur Rahala";
    const authorAvatar = currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80";

    const tagString = creatorSelectedTags.map(t => `#${t}`).join(' ');
    const finalDesc = `${creatorDesc} ${tagString}`.trim();

    try {
      await socialService.createPost({
        user_id: currentUserId,
        image_url: creatorImage,
        description: finalDesc,
        location: creatorLoc.trim() || t('navExplore') || "Algérie 🇩🇿",
        rating: creatorRating,
        author_name: authorName,
        author_avatar: authorAvatar
      });

      await loadPostsFromService();

      // Reset fields & switch tabs
      setCreatorImage(null);
      setCreatorDesc("");
      setCreatorLoc("");
      setCreatorRating(5);
      setCreatorSelectedTags([]);
      
      setFilterBrightness(100);
      setFilterContrast(100);
      setFilterGrayscale(0);
      setFilterSaturate(100);
      setFilterSepia(0);

      setActiveTab('feed');
    } catch (err) {
      console.error("Failed to publish post:", err);
    }
  };

  // Submit Interactive Monument Review (ReviewSection)
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landmarkComment.trim()) return;

    const currentUserId = currentUser?.id || 'visitor-uuid';
    const authorName = currentUser?.name || "Voyageur Rahala";
    const authorAvatar = currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80";

    setIsSubmitReviewLoading(true);
    try {
      await socialService.postReview({
        user_id: currentUserId,
        landmark_id: selectedLandmark,
        rating: landmarkRating,
        comment: landmarkComment.trim(),
        author_name: authorName,
        author_avatar: authorAvatar
      });

      setLandmarkComment("");
      setLandmarkRating(5);
      await loadReviewsFromService();
    } catch (err) {
      console.error("Failed to post landmark review:", err);
    } finally {
      setIsSubmitReviewLoading(false);
    }
  };


  // Direct Social Share URLs
  const getShareUrl = (postId: string) => {
    return `${window.location.origin}${window.location.pathname}?postId=${postId}`;
  };

  const handleShareFacebook = (postId: string) => {
    const url = encodeURIComponent(getShareUrl(postId));
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShareDropdownPostId(null);
  };

  const handleShareWhatsapp = (post: SocialPost) => {
    const text = encodeURIComponent(`Découvrez le magnifique voyage de ${post.authorName} à ${post.location} avec RAHALA ! 📸🇩🇿 : ${getShareUrl(post.id)}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShareDropdownPostId(null);
  };

  const handleShareTwitter = (post: SocialPost) => {
    const url = encodeURIComponent(getShareUrl(post.id));
    const text = encodeURIComponent(`Découvrez le magnifique voyage de ${post.authorName} à ${post.location} sur RAHALA ! 📸🇩🇿`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    setShareDropdownPostId(null);
  };

  const handleShareLinkedin = (postId: string) => {
    const url = encodeURIComponent(getShareUrl(postId));
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    setShareDropdownPostId(null);
  };

  const handleShareTelegram = (post: SocialPost) => {
    const url = encodeURIComponent(getShareUrl(post.id));
    const text = encodeURIComponent(`Découvrez le magnifique voyage de ${post.authorName} à ${post.location} avec RAHALA ! 📸🇩🇿`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    setShareDropdownPostId(null);
  };

  const handleShareEmail = (post: SocialPost) => {
    const url = getShareUrl(post.id);
    const subject = encodeURIComponent(`Voyage magique en Algérie : ${post.location}`);
    const body = encodeURIComponent(`Bonjour,\n\nJe voulais partager avec vous cette magnifique photo de voyage de ${post.authorName} à ${post.location} sur l'application RAHALA ! \n\nDécouvrez sa publication ici : ${url}\n\nBon voyage !`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setShareDropdownPostId(null);
  };

  const handleShareNative = async (post: SocialPost) => {
    const url = getShareUrl(post.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RAHALA Social Club',
          text: `Découvrez cette sublime photo de ${post.location} partagée sur RAHALA !`,
          url: url,
        });
      } catch (err) {
        console.warn("Native share aborted or failed:", err);
      }
    } else {
      // Fallback: Copy link
      handleCopyLink(post.id);
    }
    setShareDropdownPostId(null);
  };

  const handleCopyLink = (postId: string) => {
    const url = getShareUrl(postId);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2500);
    }).catch(err => {
      console.error("Failed to copy URL:", err);
    });
  };

  // Filtering posts based on selected search and tags
  const filteredPosts = posts.filter(post => {
    const matchesTag = selectedTag ? post.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()) : true;
    const matchesQuery = searchQuery ? (
      post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true;
    return matchesTag && matchesQuery;
  });

  // Calculate formatted times
  const formatTimeAgo = (isoDateStr: string) => {
    try {
      const date = new Date(isoDateStr);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMin / 6000);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMin < 60) return `Il y s ${diffMin} min`;
      if (diffHours < 24) return `Il y a ${diffHours} h`;
      return `Il y a ${diffDays} jours`;
    } catch (e) {
      return "Récemment";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 relative" id="social-club-container">
      
      {/* Decorative Golden Stars Backsplash */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header Segment */}
      <div className="text-center mb-8 relative">
        <span className="inline-block px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-mono rounded-full font-bold uppercase tracking-widest mb-2 border border-[#d4af37]/20 select-none">
          ✨ Communauté de Voyageurs RAHALA
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-widest text-[#d4af37] dark:text-white uppercase">
          RAHALA Social Club 📸
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
          Partagez vos explorations en Algérie, donnez votre avis, appliquez des filtres cinématiques et partagez de superbes souvenirs avec vos proches en toute simplicité.
        </p>
        
        {/* Dynamic Database Connection Indicator Badge */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold font-mono tracking-wider ${
            socialService.isUsingCloud() 
              ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/35 shadow-[0_0_15px_rgba(212,175,55,0.15)] animate-pulse' 
              : 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${socialService.isUsingCloud() ? 'bg-[#d4af37] animate-ping' : 'bg-emerald-400'}`}></span>
            {socialService.isUsingCloud() ? "SYSTÈME SUPABASE LIVE CLOUD ☁️" : "MODE LOCAL SÉCURISÉ ACTIF 💻 (LOCALSTORAGE)"}
          </span>
        </div>
      </div>

      {/* Inner Tabs Controls */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-305 cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-white/10 text-slate-705 dark:text-slate-300 hover:bg-white/15 border border-slate-300/30'
          }`}
        >
          <Filter size={13} />
          Fil d'actu (Feed)
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-305 cursor-pointer ${
            activeTab === 'create'
              ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30'
              : 'bg-white/10 text-slate-705 dark:text-slate-300 hover:bg-white/15 border border-slate-300/30'
          }`}
        >
          <Plus size={13} />
          Créer un Post 📸
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-305 cursor-pointer ${
            activeTab === 'review'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-white/10 text-slate-705 dark:text-slate-305 hover:bg-white/15 border border-slate-300/30'
          }`}
        >
          <Star size={13} className="fill-current" />
          Avis Monuments ⭐
        </button>
      </div>


      {activeTab === 'feed' && (
        // ==================== TAB 1: FEED MODULE ====================
        <div className="space-y-6">
          
          {/* Tag filtering and Search bar */}
          <div className="bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-md rounded-2xl p-4 border border-zinc-200/35 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Tag pills */}
            <div className="w-full md:w-3/4">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-2">🏷️ Filtrer par Tag Populaire :</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                    !selectedTag 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-200/60 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
                  }`}
                >
                  Tous #
                </button>
                {HOT_TAGS.slice(0, 7).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                      selectedTag === tag 
                        ? 'bg-[#d4af37] text-black shadow-xs font-bold' 
                        : 'bg-slate-200/60 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input bar */}
            <div className="w-full md:w-1/4 relative">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-2 invisible md:visible">Chercher :</span>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Lieu, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

          </div>

          {/* Social cards feed grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredPosts.map((post) => {
                  const filterString = post.filters 
                    ? `brightness(${post.filters.brightness}%) contrast(${post.filters.contrast}%) grayscale(${post.filters.grayscale}%) saturate(${post.filters.saturate}%) sepia(${post.filters.sepia}%)`
                    : 'none';

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={post.id}
                      className="bg-white dark:bg-zinc-950/80 rounded-2xl overflow-hidden border border-zinc-200/35 dark:border-white/10 shadow-md group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Post Author slot */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={post.authorAvatar} 
                            alt={post.authorName}
                            className="w-9 h-9 rounded-full object-cover border-2 border-[#d4af37]/30"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                              {post.authorName}
                            </p>
                            <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 leading-none mt-1 flex items-center gap-1">
                              <Calendar size={10} />
                              {formatTimeAgo(post.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Location mini pin click */}
                        {post.location && (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            <MapPin size={9} />
                            {post.location.split(',')[0]}
                          </span>
                        )}
                      </div>

                      {/* Photo element with custom stored filters */}
                      <div 
                        onClick={() => setLightboxPost(post)}
                        className="relative pt-[75%] bg-black overflow-hidden cursor-zoom-in"
                      >
                        <img 
                          src={post.image || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80'} 
                          alt="Sublime voyage d'Algérie" 
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover select-none group-hover:scale-104 transition duration-700"
                          style={{ filter: filterString }}
                        />

                        {/* Starpinned ratings layer */}
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-[#d4af37] text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-0.5">
                          <Star size={10} className="fill-[#d4af37]" />
                          <span>{post.rating}.0 / 5.0</span>
                        </div>
                      </div>

                      {/* Actions row: like + share buttons */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Likes & Comments tally status */}
                          <div className="flex items-center justify-between mb-2">
                            <button
                              onClick={(e) => handleLike(post.id, e)}
                              className="flex items-center gap-1.5 focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                            >
                              <Heart 
                                size={18} 
                                className={`transition-colors duration-200 ${
                                  post.likedByCurrentUser 
                                    ? 'text-rose-500 fill-rose-500' 
                                    : 'text-zinc-400 dark:text-zinc-300'
                                }`} 
                              />
                              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                                {post.likes} likes
                              </span>
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setShareDropdownPostId(shareDropdownPostId === post.id ? null : post.id)}
                                className="p-1 px-2.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-500 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                              >
                                <Share2 size={13} />
                                Partager
                              </button>

                              {/* Sharing Dropdown Menu */}
                              {shareDropdownPostId === post.id && (
                                <div className="absolute right-0 bottom-full mb-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl py-1.5 shadow-xl w-52 z-30 animate-fade-in text-left">
                                  <button
                                    onClick={() => { setSharingPost(post); setShareDropdownPostId(null); }}
                                    className="w-full font-bold text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[11px] text-indigo-650 dark:text-indigo-400 flex items-center justify-between gap-2"
                                  >
                                    <span className="flex items-center gap-1.5 font-extrabold text-xs">
                                      <span>🌐</span> Multi-Partage PRO
                                    </span>
                                    <span className="bg-indigo-100 dark:bg-indigo-950/50 text-[9px] px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-300">Nouveau</span>
                                  </button>
                                  <div className="border-t border-slate-100 dark:border-zinc-830 my-1"></div>
                                  <button
                                    onClick={() => handleShareFacebook(post.id)}
                                    className="w-full font-bold text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[11px] text-slate-800 dark:text-zinc-200 flex items-center gap-2"
                                  >
                                    <Facebook size={12} className="text-blue-600 fill-blue-600" />
                                    <span>Partager sur Facebook</span>
                                  </button>
                                  <button
                                    onClick={() => handleShareWhatsapp(post)}
                                    className="w-full font-bold text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[11px] text-slate-800 dark:text-zinc-200 flex items-center gap-2"
                                  >
                                    <Whatsapp size={12} className="text-emerald-500 fill-emerald-500" />
                                    <span>Partager sur WhatsApp</span>
                                  </button>
                                  <button
                                    onClick={() => handleShareTwitter(post)}
                                    className="w-full font-bold text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[11px] text-slate-800 dark:text-zinc-200 flex items-center gap-2"
                                  >
                                    <Twitter size={12} className="text-sky-500 fill-sky-500" />
                                    <span>Partager sur Twitter (X)</span>
                                  </button>
                                  <button
                                    onClick={() => handleShareTelegram(post)}
                                    className="w-full font-bold text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[11px] text-slate-800 dark:text-zinc-200 flex items-center gap-2"
                                  >
                                    <MessageCircle size={12} className="text-cyan-500" />
                                    <span>Envoyer sur Telegram</span>
                                  </button>
                                  <div className="border-t border-slate-100 dark:border-zinc-800 my-1"></div>
                                  <button
                                    onClick={() => handleCopyLink(post.id)}
                                    className="w-full font-extrabold text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[11px] text-[#d4af37] flex items-center gap-2"
                                  >
                                    <Copy size={11} />
                                    <span>Copier l'URL direct</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Copied link banner */}
                          {copiedPostId === post.id && (
                            <div className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-1 px-2 rounded-lg font-bold mb-2 shadow-inner text-center animate-pulse">
                              Lien copié dans le presse-papiers ! 🔗
                            </div>
                          )}

                          {/* Description text */}
                          <p className="text-[11.5px] text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-sm">
                            {post.description}
                          </p>

                          {/* Location details */}
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 font-mono flex items-center gap-1">
                            <MapPin size={10} className="text-[#d4af37]" />
                            {post.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white/40 dark:bg-[#1a1a1a]/40 border border-zinc-200/25 dark:border-white/5 py-16 px-6 text-center rounded-2xl max-w-lg mx-auto">
              <Camera size={44} className="text-slate-400 mx-auto mb-3 animate-bounce" />
              <p className="text-sm font-bold text-slate-800 dark:text-white">Aucun post ne correspond à vos filtres</p>
              <p className="text-xs text-slate-400 mt-1">Soit le tag ou la recherche n'a pas donné de résultats. Réinitialisez pour voir tout le monde !</p>
              <button
                onClick={() => { setSelectedTag(null); setSearchQuery(""); }}
                className="mt-4 px-4 py-1.5 bg-emerald-600 text-white font-mono text-[10px] uppercase rounded-xl tracking-wider font-bold"
              >
                Tout réinitialiser
              </button>
            </div>
          )}

        </div>
      )}

      {activeTab === 'create' && (
        // ==================== TAB 2: CREATOR MODULE ====================
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-200/35 dark:border-white/10 shadow-xl transition-all duration-300">
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-150 dark:border-zinc-800">
            <Camera size={20} className="text-[#d4af37]" />
            <h3 className="text-lg font-serif font-black uppercase text-slate-900 dark:text-white">
              Publier un nouveau souvenir de voyage 🎬
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Selector & FileReader Drop Area */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">1. Ajouter une Photo *</span>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-[#d4af37] cursor-pointer rounded-xl bg-slate-50 dark:bg-zinc-900 overflow-hidden relative pt-[100%] flex flex-col items-center justify-center text-center transition group"
              >
                {creatorImage ? (
                  <div className="absolute inset-0">
                    <img 
                      src={creatorImage} 
                      alt="Aperçu avant publication" 
                      className="w-full h-full object-cover"
                      style={{ 
                        filter: `brightness(${filterBrightness}%) contrast(${filterContrast}%) grayscale(${filterGrayscale}%) saturate(${filterSaturate}%) sepia(${filterSepia}%)`
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-center text-white text-[9px] font-mono select-none group-hover:bg-[#d4af37]/80 group-hover:text-black transition">
                      Changer de photo 🔄
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <Camera size={32} className="text-zinc-400 group-hover:text-[#d4af37] transition mb-2" />
                    <p className="text-[11px] font-bold text-zinc-650 dark:text-zinc-300">Cliquer pour sélectionner une photo</p>
                    <p className="text-[9px] text-zinc-400 mt-1 max-w-[160px]">Supporte .jpg, .png, .webp (Fichier local)</p>
                  </div>
                )}
              </div>

              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Adjust Photo Filters (Slider Bonus) */}
              {creatorImage && (
                <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-3.5 border border-zinc-200/40 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-700 dark:text-slate-350">
                    <Sliders size={12} className="text-[#d4af37]" />
                    <span>Filtres Cinématiques</span>
                  </div>

                  {/* Built-in Filter presets picker */}
                  <div className="flex flex-wrap gap-1 mb-4 select-none">
                    {filterPresets.map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9px] font-bold rounded hover:bg-[#d4af37] hover:text-black transition"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>

                  {/* Precise Sliders */}
                  <div className="space-y-2.5 text-[10.5px]">
                    <div>
                      <div className="flex justify-between font-mono text-[9.5px] text-zinc-500 mb-0.5">
                        <span>Luminosité (Brightness)</span>
                        <span>{filterBrightness}%</span>
                      </div>
                      <input 
                        type="range" min="50" max="150" value={filterBrightness}
                        onChange={(e) => setFilterBrightness(Number(e.target.value))}
                        className="w-full accent-emerald-600 h-1 rounded-sm bg-zinc-300 dark:bg-zinc-750"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[9.5px] text-zinc-500 mb-0.5">
                        <span>Contraste</span>
                        <span>{filterContrast}%</span>
                      </div>
                      <input 
                        type="range" min="55" max="145" value={filterContrast}
                        onChange={(e) => setFilterContrast(Number(e.target.value))}
                        className="w-full accent-emerald-600 h-1 rounded-sm bg-zinc-300 dark:bg-zinc-750"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[9.5px] text-zinc-500 mb-0.5">
                        <span>Saturation</span>
                        <span>{filterSaturate}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="200" value={filterSaturate}
                        onChange={(e) => setFilterSaturate(Number(e.target.value))}
                        className="w-full accent-emerald-600 h-1 rounded-sm bg-zinc-300 dark:bg-zinc-750"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <div className="flex justify-between font-mono text-[9px] text-zinc-500 mb-0.5">
                          <span>Grayscale</span>
                          <span>{filterGrayscale}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" value={filterGrayscale}
                          onChange={(e) => setFilterGrayscale(Number(e.target.value))}
                          className="w-full accent-emerald-600 h-1 rounded-sm bg-zinc-300 dark:bg-zinc-750"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between font-mono text-[9px] text-zinc-500 mb-0.5">
                          <span>Sépia</span>
                          <span>{filterSepia}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" value={filterSepia}
                          onChange={(e) => setFilterSepia(Number(e.target.value))}
                          className="w-full accent-emerald-600 h-1 rounded-sm bg-zinc-300 dark:bg-zinc-750"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Input Details form */}
            <div className="flex flex-col gap-4">
              
              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  2. Description de l'exploration *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Décrivez votre ressenti, ce que vous avez mangé, l'ambiance, les tarifs..."
                  value={creatorDesc}
                  onChange={(e) => setCreatorDesc(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white font-medium"
                ></textarea>
              </div>

              {/* Exact Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  3. Localisation précise *
                </label>
                <div className="relative">
                  <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="Ex: Tassili n'Ajjer, Djanet"
                    value={creatorLoc}
                    onChange={(e) => setCreatorLoc(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 pl-8 pr-4 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Travel Star Score Slider */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  4. Note globale du site
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(starNum => (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => setCreatorRating(starNum)}
                      className="p-1 focus:outline-none focus:scale-110 transition cursor-pointer"
                    >
                      <Star 
                        size={20} 
                        className={`transition-colors ${
                          starNum <= creatorRating 
                            ? 'text-[#d4af37] fill-[#d4af37]' 
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-[11.5px] font-mono text-zinc-500 ml-2 font-bold select-none">
                    ({creatorRating}.0 / 5.0)
                  </span>
                </div>
              </div>

              {/* Tags/Hashtags Pills Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  5. Ajouter des Hashtags
                </label>
                
                {/* Popular selectable pills */}
                <div className="flex flex-wrap gap-1.5 mb-2.5 select-none">
                  {HOT_TAGS.slice(0, 8).map(tag => {
                    const isSelected = creatorSelectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleCreatorTag(tag)}
                        className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition ${
                          isSelected 
                            ? 'bg-[#d4af37] text-black font-extrabold' 
                            : 'bg-zinc-100 dark:bg-zinc-900 text-slate-650 dark:text-slate-350 hover:bg-zinc-200/50'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>

                {/* Custom tag add */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="tag personnalisé..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomTag(); } }}
                    className="flex-1 text-xs bg-slate-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="p-2 border border-slate-300/30 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-bold"
                  >
                    + Ajouter
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Action Row */}
          <div className="mt-8 pt-4 border-t border-zinc-150 dark:border-zinc-800 flex justify-between gap-4">
            <button
              onClick={() => setActiveTab('feed')}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-slate-700 dark:text-white rounded-xl text-xs font-bold hover:bg-zinc-300 dark:hover:bg-zinc-750"
            >
              Annuler
            </button>
            <button
              onClick={handlePublish}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-950/20 active:scale-95 transition"
            >
              <Send size={12} />
              Publier mon post 🚀
            </button>
          </div>

        </div>
      )}

      {activeTab === 'review' && (
        // ==================== TAB 3: REVIEW SECTION (AVIS MONUMENTS) ====================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto animate-fade-in" id="landmark-reviews-panel">
          
          {/* LEFT SIDEBAR: LANDMARK LIST CARD & ADD REVIEW FORM */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Monument Selector list */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-5 border border-zinc-200/35 dark:border-white/10 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-[#d4af37] tracking-widest uppercase block mb-3">
                1. Sélectionner un monument 🕌
              </span>
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {LANDMARKS_LIST.map((landmark) => {
                  const isSelected = selectedLandmark === landmark.id;
                  return (
                    <button
                      key={landmark.id}
                      onClick={() => setSelectedLandmark(landmark.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex flex-col gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400 dark:text-indigo-300 font-extrabold'
                          : 'bg-slate-50 dark:bg-zinc-900/60 border-transparent text-slate-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-800'
                      }`}
                    >
                      <span className="text-xs font-bold leading-none">{landmark.name}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">{landmark.region}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Leave a review Form (Étoiles interactives + champ commentaire) */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-5 border border-zinc-200/35 dark:border-white/10 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-[#d4af37] tracking-widest uppercase block mb-3">
                2. Rédiger votre avis ⭐
              </span>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Visual tactile stars selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Note de votre expérience :
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-900/65 py-2 px-3 rounded-xl border border-zinc-150 dark:border-zinc-800">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setLandmarkRating(s)}
                        className="p-0.5 hover:scale-110 focus:outline-none transition-transform cursor-pointer"
                      >
                        <Star
                          size={20}
                          className={`transition-colors ${
                            s <= landmarkRating
                              ? 'text-[#d4af37] fill-[#d4af37]'
                              : 'text-zinc-300 dark:text-zinc-800'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[11px] font-mono font-extrabold text-[#d4af37] ml-auto">
                      ({landmarkRating}.0 / 5)
                    </span>
                  </div>
                </div>

                {/* Comment box */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Votre commentaire :
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={landmarkComment}
                    onChange={(e) => setLandmarkComment(e.target.value)}
                    placeholder="Qu'avez-vous visité ? Racontez vos impressions, conseils secrets, ou guides de voyage..."
                    className="w-full text-xs bg-slate-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* User reference badge info */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-zinc-900/70 border border-zinc-200/30 dark:border-zinc-800 rounded-xl">
                  <img
                    src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                    alt="Auteur"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-[10px] text-zinc-500 font-medium">Posté avec : <b>{currentUser?.name || "Voyageur"}</b></span>
                </div>

                {/* Publish button */}
                <button
                  type="submit"
                  disabled={isSubmitReviewLoading}
                  className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:bg-zinc-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-indigo-950/20"
                >
                  <Send size={11} />
                  <span>{isSubmitReviewLoading ? "Publication..." : "Publier l'avis 🚀"}</span>
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT SIDEBAR: REVIEWS FEED */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-200/35 dark:border-white/10 shadow-xl min-h-[450px] flex flex-col justify-between">
            
            <div>
              {/* Header section with Stats analysis */}
              {(() => {
                const landmark = LANDMARKS_LIST.find(l => l.id === selectedLandmark);
                const avgRating = reviewsList.length > 0
                  ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
                  : "5.0";
                
                return (
                  <div className="pb-5 mb-5 border-b border-zinc-150 dark:border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-serif font-black uppercase text-slate-900 dark:text-white leading-tight">
                        {landmark?.name}
                      </h3>
                      <p className="text-xs text-[#d4af37] font-medium italic mt-1 font-mono flex items-center gap-1 animate-pulse">
                        <MapPin size={11} /> {landmark?.region}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900/80 p-3 rounded-xl border border-zinc-200/30 dark:border-zinc-800 shrink-0">
                      <div className="text-center pr-3 border-r border-zinc-200 dark:border-zinc-800">
                        <span className="text-2xl font-black font-mono text-[#d4af37]">{avgRating}</span>
                        <span className="text-[10px] text-zinc-400 block font-bold">sur 5.0</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-0.5 text-[#d4af37]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < Math.round(Number(avgRating)) ? "text-[#d4af37] fill-[#d4af37]" : "text-zinc-300 dark:text-zinc-700"}
                            />
                          ))}
                        </div>
                        <span className="text-[10.5px] font-mono text-zinc-500 font-bold block mt-0.5">
                          {reviewsList.length} avis voyageurs
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Comments list feed */}
              {reviewsList.length > 0 ? (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {reviewsList.map((r, rIdx) => (
                      <motion.div
                        key={r.id || `r-${rIdx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 flex gap-3 shadow-inner"
                      >
                        <img
                          src={r.author_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/20 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-zinc-100 truncate">
                              {r.author_name || "Voyageur Rahala"}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
                              {formatTimeAgo(r.created_at)}
                            </span>
                          </div>

                          {/* Individual Star ratings */}
                          <div className="flex items-center gap-0.5 text-[#d4af37] mt-1 mb-2">
                            {Array.from({ length: 5 }).map((_, starI) => (
                              <Star
                                key={starI}
                                size={11}
                                className={starI < r.rating ? "text-[#d4af37] fill-[#d4af37]" : "text-zinc-300 dark:text-zinc-750"}
                              />
                            ))}
                          </div>

                          <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal whitespace-pre-wrap">
                            {r.comment}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-16">
                  <MessageSquare size={36} className="text-slate-400 dark:text-zinc-700 mx-auto mb-3 animate-pulse" />
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Aucun avis de voyageur publié pour ce monument</p>
                  <p className="text-[11px] text-zinc-450 dark:text-zinc-500 max-w-sm mx-auto mt-1">
                    Soyez le tout premier explorateur à partager vos ressentis ou conseils pratiques sur cet endroit merveilleux de l'Algérie !
                  </p>
                </div>
              )}
            </div>

            {/* Premium footnote indicator */}
            <div className="border-t border-zinc-150 dark:border-zinc-800 pt-4 mt-6 text-center">
              <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-mono italic">
                Avis cryptés et synchronisés en temps réel sur la table Supabase `reviews`. 🏕️
              </span>
            </div>

          </div>

        </div>
      )}


      {/* ==================== FULLSCREEN LIGHTBOX MODE (BONUS) ==================== */}
      <AnimatePresence>
        {lightboxPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setLightboxPost(null)}
          >
            {/* Inner frame modal */}
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Absolut Close button */}
              <button
                onClick={() => setLightboxPost(null)}
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Photo Area */}
              <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] sm:min-h-[400px]">
                <img 
                  src={lightboxPost.image} 
                  alt="Agrandissement" 
                  referrerPolicy="no-referrer"
                  className="max-h-[500px] w-full object-contain"
                  style={{ 
                    filter: lightboxPost.filters 
                      ? `brightness(${lightboxPost.filters.brightness}%) contrast(${lightboxPost.filters.contrast}%) grayscale(${lightboxPost.filters.grayscale}%) saturate(${lightboxPost.filters.saturate}%) sepia(${lightboxPost.filters.sepia}%)`
                      : 'none'
                  }}
                />
              </div>

              {/* Travel review stats sidebar */}
              <div className="md:w-2/5 p-6 flex flex-col justify-between text-white border-t md:border-t-0 md:border-l border-zinc-850 bg-zinc-950">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={lightboxPost.authorAvatar} 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-full object-cover border border-[#d4af37]"
                    />
                    <div>
                      <p className="text-sm font-extrabold text-white leading-tight">{lightboxPost.authorName}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{formatTimeAgo(lightboxPost.createdAt)}</p>
                    </div>
                  </div>

                  {/* Rating Stars indicators */}
                  <div className="flex items-center gap-1 text-[#d4af37] mb-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star 
                        key={index} 
                        size={14} 
                        className={index < lightboxPost.rating ? "fill-[#d4af37]" : "text-zinc-700"} 
                      />
                    ))}
                    <span className="text-[11px] font-mono font-bold text-zinc-400 ml-1.5">({lightboxPost.rating}.0 / 5)</span>
                  </div>

                  <p className="text-zinc-300 text-xs leading-relaxed max-h-[160px] overflow-y-auto pr-1">
                    {lightboxPost.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-4">
                    {lightboxPost.tags.map(tag => (
                      <span key={tag} className="text-[10.5px] font-bold text-[#d4af37]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-[10.5px] italic text-[#d4af37] flex items-center gap-1 mt-4 font-mono">
                    <MapPin size={11} />
                    {lightboxPost.location}
                  </p>
                </div>

                {/* Bottom line: quick actions */}
                <div className="border-t border-zinc-900 pt-4 mt-6">
                  <div className="flex items-center justify-between gap-4">
                    
                    {/* Quick Like */}
                    <button
                      onClick={(e) => handleLike(lightboxPost.id, e)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition text-xs font-bold"
                    >
                      <Heart 
                        size={15} 
                        className={lightboxPost.likedByCurrentUser ? 'text-rose-500 fill-rose-500' : 'text-slate-400'} 
                      />
                      <span>{lightboxPost.likes} Likes</span>
                    </button>

                    {/* Social Shares Quick triggers */}
                    <div className="flex items-center gap-1.5 animate-pulse">
                      <button
                        onClick={() => setSharingPost(lightboxPost)}
                        title="Options avancées de partage (Instagram, Twitter, Telegram, etc.)"
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>🌐 Partage Pro</span>
                      </button>
                      <button
                        onClick={() => handleShareFacebook(lightboxPost.id)}
                        title="Partager sur Facebook"
                        className="p-2 hover:bg-white/10 rounded-lg text-blue-500 transition cursor-pointer"
                      >
                        <Facebook size={14} />
                      </button>
                      <button
                        onClick={() => handleShareWhatsapp(lightboxPost)}
                        title="Envoyer sur WhatsApp"
                        className="p-2 hover:bg-white/10 rounded-lg text-emerald-500 transition cursor-pointer"
                      >
                        <Whatsapp size={14} />
                      </button>
                      <button
                        onClick={() => handleCopyLink(lightboxPost.id)}
                        title="Copier le lien url"
                        className="p-2 hover:bg-white/10 rounded-lg text-[#d4af37] transition cursor-pointer"
                      >
                        <Copy size={13} />
                      </button>
                    </div>

                  </div>

                  {/* Link action indicator */}
                  {copiedPostId === lightboxPost.id && (
                    <div className="text-[9.5px] bg-emerald-500/20 text-emerald-400 p-1.5 mt-2 rounded-lg text-center font-bold">
                      Lien direct copié ! Partagez-le partout ! 🎉
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}

        {sharingPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => { setSharingPost(null); setInstagramCopied(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-white dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl relative p-6 text-slate-900 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => { setSharingPost(null); setInstagramCopied(false); }}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-650 transition cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-lg">🌐</span>
                <h3 className="text-base font-serif font-black uppercase tracking-tight text-slate-900 dark:text-zinc-100">
                  Partager l'Exploration
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-5 leading-tight text-left">
                Choisissez votre réseau social d'Algérie favori ou copiez le lien direct de la publication :
              </p>

              {/* Miniature Post Preview Card */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-2xl border border-slate-200/35 dark:border-white/5 mb-6 text-left">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200/40 dark:border-zinc-800 animate-pulse">
                  <img
                    src={sharingPost.image}
                    alt={sharingPost.location}
                    className="w-full h-full object-cover"
                    style={{
                      filter: sharingPost.filters
                        ? `brightness(${sharingPost.filters.brightness}%) contrast(${sharingPost.filters.contrast}%) grayscale(${sharingPost.filters.grayscale}%) saturate(${sharingPost.filters.saturate}%) sepia(${sharingPost.filters.sepia}%)`
                        : undefined
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate flex items-center gap-1">
                    <MapPin size={11} className="text-[#d4af37]" /> {sharingPost.location}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                    Par <b>{sharingPost.authorName}</b>
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-300 line-clamp-1 mt-1 font-normal italic">
                    "{sharingPost.description}"
                  </p>
                </div>
              </div>

              {/* Real Interactive Sharing Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
                
                {/* Facebook */}
                <button
                  onClick={() => handleShareFacebook(sharingPost.id)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-500/10 hover:border-blue-500/35 bg-blue-500/5 hover:bg-blue-600 dark:hover:bg-blue-600/20 text-[#1877f2] hover:text-white transition duration-200 text-left text-xs font-bold cursor-pointer"
                >
                  <Facebook size={14} className="fill-current shrink-0" />
                  <span>Facebook</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => handleShareWhatsapp(sharingPost)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/35 bg-emerald-500/5 hover:bg-emerald-600 dark:hover:bg-emerald-600/20 text-[#25d366] hover:text-white transition duration-200 text-left text-xs font-bold cursor-pointer"
                >
                  <Whatsapp size={14} className="shrink-0" />
                  <span>WhatsApp</span>
                </button>

                {/* Twitter (X) */}
                <button
                  onClick={() => handleShareTwitter(sharingPost)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-500/10 hover:border-zinc-550/35 bg-zinc-500/5 hover:bg-zinc-800 text-zinc-900 dark:text-white hover:text-white transition duration-200 text-left text-xs font-bold cursor-pointer"
                >
                  <Twitter size={14} className="fill-current shrink-0" />
                  <span>Twitter / X</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => handleShareLinkedin(sharingPost.id)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-sky-500/10 hover:border-sky-500/35 bg-sky-500/5 hover:bg-sky-600 dark:hover:bg-sky-600/20 text-[#0a66c2] hover:text-white transition duration-200 text-left text-xs font-bold cursor-pointer"
                >
                  <Linkedin size={14} className="fill-current shrink-0" />
                  <span>LinkedIn</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => handleShareTelegram(sharingPost)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-cyan-500/10 hover:border-cyan-500/35 bg-cyan-500/5 hover:bg-cyan-600 dark:hover:bg-cyan-600/20 text-[#0088cc] hover:text-white transition duration-200 text-left text-xs font-bold cursor-pointer"
                >
                  <MessageCircle size={14} className="shrink-0" />
                  <span>Telegram</span>
                </button>

                {/* Email */}
                <button
                  onClick={() => handleShareEmail(sharingPost)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-rose-500/10 hover:border-rose-500/35 bg-rose-500/5 hover:bg-rose-600 dark:hover:bg-rose-600/20 text-rose-600 hover:text-white transition duration-200 text-left text-xs font-bold cursor-pointer"
                >
                  <Mail size={14} className="shrink-0" />
                  <span>E-mail</span>
                </button>

              </div>

              {/* Instagram Story Sharing Wizard Section */}
              <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/15 dark:border-pink-500/15 p-4 rounded-2xl mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Instagram size={15} className="text-pink-550 dark:text-pink-400 shrink-0" />
                  <span className="text-xs font-black text-slate-800 dark:text-zinc-100 uppercase tracking-wide">
                    Instagram Story Helper 📸
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-zinc-300 leading-relaxed mb-3">
                  Instagram n'autorise pas le partage de liens directs depuis l'extérieur en un clic. Suivez ce guide pour une story d'exception :
                </p>
                <div className="space-y-1.5 text-[9.5px] text-zinc-500 dark:text-zinc-400 mb-4 pl-1">
                  <p>1. Cliquez ci-dessous pour copier le message et les tags.</p>
                  <p>2. Enregistrez la photo magnifiée par vos filtres.</p>
                  <p>3. Ouvrez Instagram, publiez l'image, et ajoutez le sticker <b>Lien</b> avec l'URL copiée !</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${sharingPost.description} #Rahala #AlgerieTourisme`);
                      setInstagramCopied(true);
                      setTimeout(() => setInstagramCopied(false), 2000);
                    }}
                    className="flex-1 py-1.5 px-3 bg-white dark:bg-zinc-900 border border-pink-500/30 text-pink-600 dark:text-pink-400 font-extrabold text-[10px] rounded-lg transition-transform hover:scale-102 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{instagramCopied ? "Légende Copiée ! ✓" : "Copier la Légende"}</span>
                  </button>
                  <a
                    href={sharingPost.image}
                    download={`rahala-explore-${sharingPost.id}.jpg`}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="py-1.5 px-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-extrabold text-[10px] rounded-lg transition-transform hover:scale-102 flex items-center justify-center gap-1 cursor-pointer no-underline block text-center"
                  >
                    <span>Télécharger l'Image</span>
                  </a>
                </div>
              </div>

              {/* Direct Url Copy Field */}
              <div className="text-left">
                <label className="block text-[10px] font-mono font-bold text-[#d4af37] tracking-wider uppercase mb-1.5">
                  Lien Direct de la publication :
                </label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1.5 rounded-xl text-left">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl(sharingPost.id)}
                    className="w-full text-[10px] font-mono text-zinc-650 dark:text-zinc-250 bg-transparent border-none focus:ring-0 outline-none px-2 text-left"
                  />
                  <button
                    onClick={() => handleCopyLink(sharingPost.id)}
                    className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold text-[10px] rounded-lg shrink-0 transition cursor-pointer"
                  >
                    {copiedPostId === sharingPost.id ? "Copié !" : "Copier"}
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
