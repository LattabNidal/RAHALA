import { createClient } from '@supabase/supabase-js';
import { User, Booking, TaxiRide } from '../types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Expose supabase client safely
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const supabaseDbService = {
  isUsingCloud(): boolean {
    return supabase !== null;
  },

  // =========================================================================
  // AUTHENTICATION & PROFILES (Profiles Table)
  // =========================================================================

  // Sign up a user with Supabase Auth
  async signUp(email: string, password: string, fullName: string): Promise<any> {
    if (!supabase) {
      throw new Error('Supabase is not initialized');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        }
      }
    });
    if (error) throw error;
    return data;
  },

  // Log in a user with Supabase Auth
  async signIn(email: string, password: string): Promise<any> {
    if (!supabase) {
      throw new Error('Supabase is not initialized');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  // Fetch or create profile for user
  async getProfile(userId: string): Promise<User | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          return {
            id: data.id,
            email: data.email,
            name: data.fullName,
            role: data.role as 'user' | 'admin',
            isPremium: data.isPremium || false,
            avatar: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          };
        }
      } catch (err) {
        console.error('Error fetching Supabase user profile:', err);
      }
    }
    return null;
  },

  // Update profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    if (supabase) {
      try {
        const payload: any = {};
        if (updates.name) payload.fullName = updates.name;
        if (updates.avatar) payload.avatarUrl = updates.avatar;
        if (updates.role) payload.role = updates.role;
        if (updates.isPremium !== undefined) payload.isPremium = updates.isPremium;

        const { error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', userId);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Error updating Supabase user profile:', err);
      }
    }
    return false;
  },

  // =========================================================================
  // BOOKINGS (Hotels, Flights, Taxis)
  // =========================================================================

  // Get user bookings (Hotels, Flights, Taxis merged)
  async getBookings(userId: string): Promise<Booking[]> {
    if (supabase) {
      try {
        const bookingsList: Booking[] = [];

        // 1. Get Hotel bookings
        const { data: hotels, error: hotelsError } = await supabase
          .from('bookings_hotels')
          .select('*')
          .eq('userId', userId);

        if (!hotelsError && hotels) {
          hotels.forEach((h: any) => {
            bookingsList.push({
              id: h.id,
              userId: h.userId,
              type: 'hotel',
              targetId: h.id,
              targetName: h.hotelName,
              date: h.checkInDate,
              endDate: h.checkOutDate,
              guests: h.guestsCount,
              totalPriceDZD: parseFloat(h.totalPrice || '0'),
              paymentStatus: h.status === 'confirmed' || h.status === 'completed' ? 'paid' : h.status === 'cancelled' ? 'failed' : 'pending',
              invoiceNo: `INV-HOT-${h.id.substring(0, 6).toUpperCase()}`
            });
          });
        }

        // 2. Get Flight bookings
        const { data: flights, error: flightsError } = await supabase
          .from('bookings_flights')
          .select('*')
          .eq('userId', userId);

        if (!flightsError && flights) {
          flights.forEach((f: any) => {
            bookingsList.push({
              id: f.id,
              userId: f.userId,
              type: 'hotel', // Map to general booking category for UI compatibility
              targetId: f.id,
              targetName: `${f.airline} (Vol ${f.flightNumber}) - ${f.departureCity} ➔ ${f.arrivalCity}`,
              date: f.departureTime ? f.departureTime.split('T')[0] : '',
              guests: 1,
              totalPriceDZD: parseFloat(f.price || '0'),
              paymentStatus: f.status === 'confirmed' || f.status === 'completed' ? 'paid' : f.status === 'cancelled' ? 'failed' : 'pending',
              invoiceNo: `INV-FLI-${f.id.substring(0, 6).toUpperCase()}`
            });
          });
        }

        // 3. Get Taxi bookings
        const { data: taxis, error: taxisError } = await supabase
          .from('bookings_taxis')
          .select('*')
          .eq('userId', userId);

        if (!taxisError && taxis) {
          taxis.forEach((t: any) => {
            bookingsList.push({
              id: t.id,
              userId: t.userId,
              type: 'taxi',
              targetId: t.id,
              targetName: `${t.pickupLocation} ➔ ${t.destination}`,
              date: t.pickupTime ? t.pickupTime.split('T')[0] : '',
              guests: 1,
              totalPriceDZD: parseFloat(t.estimatedPrice || '0'),
              paymentStatus: t.status === 'completed' ? 'paid' : t.status === 'cancelled' ? 'failed' : 'pending',
              invoiceNo: `INV-TAX-${t.id.substring(0, 6).toUpperCase()}`
            });
          });
        }

        return bookingsList.sort((a, b) => b.date.localeCompare(a.date));
      } catch (err) {
        console.error('Error fetching Supabase bookings:', err);
      }
    }

    // Fallback: managed by local component state
    return [];
  },

  // Save Booking
  async createHotelBooking(userId: string, booking: Omit<Booking, 'id' | 'invoiceNo' | 'userId'>): Promise<any> {
    if (supabase) {
      try {
        const id = crypto.randomUUID ? crypto.randomUUID() : 'bkg-hotel-' + Math.random().toString(36).substring(2, 9);
        const { data, error } = await supabase
          .from('bookings_hotels')
          .insert([{
            id,
            userId,
            hotelName: booking.targetName,
            roomType: booking.guests && booking.guests > 2 ? 'Suite Familiale' : 'Chambre double classique',
            checkInDate: booking.date,
            checkOutDate: booking.endDate || booking.date,
            totalPrice: booking.totalPriceDZD,
            guestsCount: booking.guests || 1,
            status: booking.paymentStatus === 'paid' ? 'confirmed' : 'pending'
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Error saving hotel booking on Supabase:', err);
      }
    }
    return null;
  },

  // Save Flight Booking
  async createFlightBooking(userId: string, booking: { flightNumber: string; airline: string; passengerName: string; departureCity: string; arrivalCity: string; departureTime: string; price: number; ticketClass: string }): Promise<any> {
    if (supabase) {
      try {
        const id = crypto.randomUUID ? crypto.randomUUID() : 'bkg-flight-' + Math.random().toString(36).substring(2, 9);
        const { data, error } = await supabase
          .from('bookings_flights')
          .insert([{
            id,
            userId,
            flightNumber: booking.flightNumber,
            airline: booking.airline,
            passengerName: booking.passengerName,
            departureCity: booking.departureCity,
            arrivalCity: booking.arrivalCity,
            departureTime: booking.departureTime,
            price: booking.price,
            seatNumber: `${Math.floor(Math.random() * 25 + 1)}${['A','B','C','D','E','F'][Math.floor(Math.random() * 6)]}`,
            ticketClass: booking.ticketClass,
            status: 'confirmed'
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Error saving flight booking on Supabase:', err);
      }
    }
    return null;
  },

  // Save Taxi Booking
  async createTaxiBooking(userId: string, ride: TaxiRide): Promise<any> {
    if (supabase) {
      try {
        const id = ride.id;
        const { data, error } = await supabase
          .from('bookings_taxis')
          .insert([{
            id,
            userId,
            driverName: ride.driverName || 'En attente...',
            driverPhone: ride.driverPhone || null,
            vehicleInfo: ride.driverCar || null,
            pickupLocation: ride.pickup,
            destination: ride.destination,
            estimatedPrice: ride.priceDZD,
            pickupTime: new Date().toISOString(),
            status: ride.status === 'completed' ? 'completed' : ride.status === 'ongoing' ? 'confirmed' : 'pending'
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Error saving taxi booking on Supabase:', err);
      }
    }
    return null;
  },

  // Cancel Booking
  async cancelHotelBooking(bookingId: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('bookings_hotels')
          .update({ status: 'cancelled' })
          .eq('id', bookingId);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Error cancelling hotel booking in Supabase:', err);
      }
    }
    return false;
  },

  // =========================================================================
  // USER FAVORITES (Bookmarks Checklist)
  // =========================================================================

  // Fetch favorites
  async getFavorites(userId: string): Promise<string[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('landmarkId')
          .eq('userId', userId);

        if (error) throw error;
        return (data || []).map((fav: any) => fav.landmarkId);
      } catch (err) {
        console.error('Error fetching favorites from Supabase:', err);
      }
    }
    return [];
  },

  // Add/Remove favorite
  async toggleFavorite(userId: string, landmarkId: string, isNowFavorite: boolean): Promise<boolean> {
    if (supabase) {
      try {
        if (isNowFavorite) {
          // Check if exists first to avoid conflict
          const { data: existing } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('userId', userId)
            .eq('landmarkId', landmarkId)
            .maybeSingle();

          if (!existing) {
            const { error } = await supabase
              .from('user_favorites')
              .insert([{
                userId,
                landmarkId
              }]);
            if (error) throw error;
          }
        } else {
          const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('userId', userId)
            .eq('landmarkId', landmarkId);
          if (error) throw error;
        }
        return true;
      } catch (err) {
        console.error('Error toggling favorite in Supabase:', err);
      }
    }
    return false;
  },

  // =========================================================================
  // AI CHAT CONVERSATIONS & MEMORY MESSAGES
  // =========================================================================

  // Fetch AI Conversations
  async getConversations(userId: string): Promise<any[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('ai_conversations')
          .select('*')
          .eq('userId', userId)
          .order('createdAt', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching AI conversations:', err);
      }
    }
    return [];
  },

  // Create new conversation
  async createConversation(userId: string, title: string): Promise<any> {
    if (supabase) {
      try {
        const id = crypto.randomUUID ? crypto.randomUUID() : 'conv-' + Math.random().toString(36).substring(2, 9);
        const { data, error } = await supabase
          .from('ai_conversations')
          .insert([{
            id,
            userId,
            title
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Error creating AI conversation:', err);
      }
    }
    return null;
  },

  // Fetch messages of a conversation
  async getMessages(conversationId: string): Promise<any[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('ai_messages')
          .select('*')
          .eq('conversationId', conversationId)
          .order('createdAt', { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching AI messages:', err);
      }
    }
    return [];
  },

  // Add message
  async addMessage(conversationId: string, sender: 'user' | 'ai', messageText: string): Promise<any> {
    if (supabase) {
      try {
        const id = crypto.randomUUID ? crypto.randomUUID() : 'msg-' + Math.random().toString(36).substring(2, 9);
        const { data, error } = await supabase
          .from('ai_messages')
          .insert([{
            id,
            conversationId,
            sender,
            messageText
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Error adding AI message:', err);
      }
    }
    return null;
  },

  // =========================================================================
  // SAFETY REPORTS & DISASTER INCIDENTS (Safe Travel)
  // =========================================================================

  // Fetch safety reports
  async getSafetyReports(): Promise<any[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('safety_reports')
          .select('*')
          .order('createdAt', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching safety reports:', err);
      }
    }
    return [];
  },

  // Create report
  async createSafetyReport(userId: string | null, report: { title: string; description: string; severity: 'low' | 'medium' | 'high'; locationName: string; latitude: number; longitude: number }): Promise<any> {
    if (supabase) {
      try {
        const id = crypto.randomUUID ? crypto.randomUUID() : 'safe-rep-' + Math.random().toString(36).substring(2, 9);
        const { data, error } = await supabase
          .from('safety_reports')
          .insert([{
            id,
            title: report.title,
            description: report.description,
            severity: report.severity,
            locationName: report.locationName,
            latitude: report.latitude,
            longitude: report.longitude,
            reportedBy: userId,
            status: 'active'
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Error creating safety report on Supabase:', err);
      }
    }
    return null;
  },

  // =========================================================================
  // PAYMENTS & BILLING TRANSACTIONS (Subscriptions)
  // =========================================================================

  // Fetch payment transactions
  async getTransactions(userId: string): Promise<any[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('payments_transactions')
          .select('*')
          .eq('userId', userId)
          .order('createdAt', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching payments transactions:', err);
      }
    }
    return [];
  },

  // Record payment transaction
  async createTransaction(userId: string, tx: { amount: number; currency: string; paymentProvider: string; providerTransactionId?: string; planName: string; status: 'pending' | 'succeeded' | 'failed' | 'refunded' }): Promise<any> {
    if (supabase) {
      try {
        const id = crypto.randomUUID ? crypto.randomUUID() : 'tx-' + Math.random().toString(36).substring(2, 9);
        const { data, error } = await supabase
          .from('payments_transactions')
          .insert([{
            id,
            userId,
            amount: tx.amount,
            currency: tx.currency,
            paymentProvider: tx.paymentProvider,
            providerTransactionId: tx.providerTransactionId || null,
            planName: tx.planName,
            status: tx.status
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Error creating payment transaction in Supabase:', err);
      }
    }
    return null;
  }
};
