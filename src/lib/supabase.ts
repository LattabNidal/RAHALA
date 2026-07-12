import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Initialize client only if keys are present to prevent crashes
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Mock initial data if using localStorage
const DEFAULT_POSTS = [
  {
    id: "post-seed-1",
    user_id: "sofiane-uid",
    image_url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    description: "Coucher de soleil magique sur le Tassili n'Ajjer. Une immensité mystique et des paysages lunaires inoubliables. #Sahara #Algerie #Tassili #Aventure",
    location: "Tassili n'Ajjer, Djanet 🇩🇿",
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    author_name: "Sofiane El Rihla",
    author_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    likes_count: 124,
    liked_by_user: false
  },
  {
    id: "post-seed-2",
    user_id: "amira-uid",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    description: "La majestueuse ville des ponts suspendus sous une brume matinale féerique. Une merveille d'architecture et de courage humain. #Constantine #Patrimoine #Histoire",
    location: "Sidi M'Cid, Constantine 🇩🇿",
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    author_name: "Amira Travel",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    likes_count: 98,
    liked_by_user: false
  },
  {
    id: "post-seed-3",
    user_id: "yacine-uid",
    image_url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
    description: "Flânerie dans les ruelles blanchies à la chaux de la Casbah historique d’Alger. Une âme incomparable, chargée d'histoire et de jasmin. #Algers #Casbah #Tradition",
    location: "La Casbah, Alger 🇩🇿",
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    author_name: "Yacine Dz",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 4,
    likes_count: 83,
    liked_by_user: false
  }
];

const DEFAULT_REVIEWS = [
  {
    id: "rev-seed-1",
    user_id: "sofiane-uid",
    author_name: "Sofiane El Rihla",
    author_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    landmark_id: "landmark-constantine",
    rating: 5,
    comment: "Tout simplement grandiose, l'histoire résonne à chaque pont.",
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
  },
  {
    id: "rev-seed-2",
    user_id: "amira-uid",
    author_name: "Amira Travel",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    landmark_id: "landmark-casbah",
    rating: 4,
    comment: "Une visite bouleversante, de merveilleux artisans locaux !",
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  }
];

export interface UnifiedPost {
  id: string;
  user_id: string;
  image_url: string;
  description: string;
  location: string;
  created_at: string;
  // Dynamic hydration fields
  author_name?: string;
  author_avatar?: string;
  rating?: number;
  likes_count: number;
  liked_by_user: boolean;
}

export interface UnifiedReview {
  id: string;
  user_id: string;
  landmark_id: string;
  rating: number;
  comment: string;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
}

export interface UnifiedLike {
  id: string;
  user_id: string;
  post_id: string;
}

// Unified Service handling operations across LocalStorage or Supabase
export const socialService = {
  // Check if we are connected to active Supabase or fall back
  isUsingCloud(): boolean {
    return supabase !== null;
  },

  // GET ALL POSTS
  async getPosts(currentUserId?: string): Promise<UnifiedPost[]> {
    if (supabase) {
      try {
        // Fetch posts from live Supabase
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*, profiles(fullName, avatarUrl)')
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        // Fetch likes to see if they are liked by current user
        let userLikes: string[] = [];
        if (currentUserId) {
          const { data: likesData } = await supabase
            .from('likes')
            .select('post_id')
            .eq('user_id', currentUserId);
          if (likesData) {
            userLikes = likesData.map(l => l.post_id);
          }
        }

        // Fetch likes count for posts
        const { data: allLikes } = await supabase
          .from('likes')
          .select('post_id');

        return (postsData || []).map((p: any) => {
          const pLikes = (allLikes || []).filter((l: any) => l.post_id === p.id);
          return {
            id: p.id,
            user_id: p.user_id,
            image_url: p.image_url,
            description: p.description,
            location: p.location,
            created_at: p.created_at,
            author_name: p.profiles?.fullName || "Voyageur Rahala",
            author_avatar: p.profiles?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
            rating: p.rating || 5,
            likes_count: pLikes.length,
            liked_by_user: userLikes.includes(p.id)
          };
        });
      } catch (err) {
        console.warn("Supabase Fetch Posts failed, falling back to local database:", err);
      }
    }

    // LocalStorage Fallback database
    let local = localStorage.getItem('rahala_supa_posts');
    if (!local) {
      localStorage.setItem('rahala_supa_posts', JSON.stringify(DEFAULT_POSTS));
      local = JSON.stringify(DEFAULT_POSTS);
    }
    const posts: UnifiedPost[] = JSON.parse(local);

    // Sync with likes DB
    let localLikes = localStorage.getItem('rahala_supa_likes');
    if (!localLikes) {
      localStorage.setItem('rahala_supa_likes', JSON.stringify([]));
      localLikes = "[]";
    }
    const likes: UnifiedLike[] = JSON.parse(localLikes);

    return posts.map(p => {
      const pLikes = likes.filter(l => l.post_id === p.id);
      const isLiked = currentUserId ? likes.some(l => l.post_id === p.id && l.user_id === currentUserId) : false;
      return {
        ...p,
        likes_count: pLikes.length > 0 ? pLikes.length : (p.likes_count || 0),
        liked_by_user: isLiked
      };
    });
  },

  // CREATE POST
  async createPost(post: Omit<UnifiedPost, 'id' | 'created_at' | 'likes_count' | 'liked_by_user'>): Promise<UnifiedPost> {
    const id = crypto.randomUUID ? crypto.randomUUID() : 'post-' + Math.random().toString(36).substring(2, 11);
    const created_at = new Date().toISOString();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .insert([{
            id,
            user_id: post.user_id,
            image_url: post.image_url,
            description: post.description,
            location: post.location,
            rating: post.rating || 5,
            created_at
          }])
          .select('*, profiles(fullName, avatarUrl)')
          .single();

        if (!error && data) {
          return {
            id: data.id,
            user_id: data.user_id,
            image_url: data.image_url,
            description: data.description,
            location: data.location,
            created_at: data.created_at,
            author_name: data.profiles?.fullName || post.author_name || "Voyageur Rahala",
            author_avatar: data.profiles?.avatarUrl || post.author_avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
            rating: data.rating || 5,
            likes_count: 0,
            liked_by_user: false
          };
        }
        throw error;
      } catch (err) {
        console.warn("Supabase Create Post failed, adding to local storage:", err);
      }
    }

    const newPost: UnifiedPost = {
      id,
      ...post,
      created_at,
      likes_count: 0,
      liked_by_user: false
    };

    let local = localStorage.getItem('rahala_supa_posts');
    const posts: UnifiedPost[] = local ? JSON.parse(local) : DEFAULT_POSTS;
    posts.unshift(newPost);
    localStorage.setItem('rahala_supa_posts', JSON.stringify(posts));

    return newPost;
  },

  // TOGGLE LIKE
  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; currentCount: number }> {
    if (supabase) {
      try {
        // Check if like exists
        const { data: existingLike } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .maybeSingle();

        if (existingLike) {
          // Unlike
          await supabase
            .from('likes')
            .delete()
            .eq('id', existingLike.id);
        } else {
          // Like
          await supabase
            .from('likes')
            .insert([{
              user_id: userId,
              post_id: postId
            }]);
        }

        // Return count
        const { data: allLikes } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postId);

        return {
          liked: !existingLike,
          currentCount: allLikes?.length || 0
        };
      } catch (err) {
        console.warn("Supabase Toggle Like failed, working locally:", err);
      }
    }

    // Local handling
    let localLikes = localStorage.getItem('rahala_supa_likes') || '[]';
    let likes: UnifiedLike[] = JSON.parse(localLikes);

    const existingIndex = likes.findIndex(l => l.post_id === postId && l.user_id === userId);
    let liked = false;

    if (existingIndex > -1) {
      likes.splice(existingIndex, 1);
    } else {
      likes.push({
        id: 'like-' + Math.random().toString(36).substring(2, 11),
        user_id: userId,
        post_id: postId
      });
      liked = true;
    }

    localStorage.setItem('rahala_supa_likes', JSON.stringify(likes));
    const currentCount = likes.filter(l => l.post_id === postId).length;

    return { liked, currentCount };
  },

  // GET REVIEWS BY LANDMARK OR GENERAL
  async getReviews(landmarkId: string): Promise<UnifiedReview[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*, profiles(fullName, avatarUrl)')
          .eq('landmark_id', landmarkId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((r: any) => ({
          id: r.id,
          user_id: r.user_id,
          landmark_id: r.landmark_id,
          rating: r.rating,
          comment: r.comment,
          created_at: r.created_at,
          author_name: r.profiles?.fullName || "Voyageur",
          author_avatar: r.profiles?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
        }));
      } catch (err) {
        console.warn("Supabase Fetch Reviews failed, working locally:", err);
      }
    }

    // Local fallback
    let local = localStorage.getItem('rahala_supa_reviews');
    if (!local) {
      localStorage.setItem('rahala_supa_reviews', JSON.stringify(DEFAULT_REVIEWS));
      local = JSON.stringify(DEFAULT_REVIEWS);
    }
    const reviews: UnifiedReview[] = JSON.parse(local);

    return reviews
      .filter(r => r.landmark_id === landmarkId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // POST REVIEW
  async postReview(review: Omit<UnifiedReview, 'id' | 'created_at'>): Promise<UnifiedReview> {
    const id = 'rev-' + Math.random().toString(36).substring(2, 11);
    const created_at = new Date().toISOString();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert([{
            id,
            user_id: review.user_id,
            landmark_id: review.landmark_id,
            rating: review.rating,
            comment: review.comment,
            created_at
          }])
          .select('*, profiles(fullName, avatarUrl)')
          .single();

        if (!error && data) {
          return {
            id: data.id,
            user_id: data.user_id,
            landmark_id: data.landmark_id,
            rating: data.rating,
            comment: data.comment,
            created_at: data.created_at,
            author_name: data.profiles?.fullName || review.author_name || "Voyageur",
            author_avatar: data.profiles?.avatarUrl || review.author_avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
          };
        }
        throw error;
      } catch (err) {
        console.warn("Supabase Post Review failed, adding locally:", err);
      }
    }

    const newReview: UnifiedReview = {
      id,
      ...review,
      created_at
    };

    let local = localStorage.getItem('rahala_supa_reviews');
    const reviews: UnifiedReview[] = local ? JSON.parse(local) : DEFAULT_REVIEWS;
    reviews.push(newReview);
    localStorage.setItem('rahala_supa_reviews', JSON.stringify(reviews));

    return newReview;
  }
};
