import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Booking, TaxiRide } from '../types';
import { supabaseDbService } from '../lib/supabaseDb';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'invoiceNo' | 'userId'>) => Booking;
  cancelBooking: (id: string) => void;
  favorites: string[]; // Landmark IDs
  toggleFavorite: (landmarkId: string) => void;
  notifications: { id: string; message: string; date: string; read: boolean }[];
  addNotification: (message: string) => void;
  clearNotifications: () => void;
  activeTaxiRide: TaxiRide | null;
  setActiveTaxiRide: (ride: TaxiRide | null) => void;
  triggerMockTaxiRideProgress: (rideId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('rihla_user');
      if (!saved || saved === 'null' || saved === 'undefined') return null;
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored user:', e);
      return null;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('rihla_bookings');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('rihla_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<{ id: string; message: string; date: string; read: boolean }[]>(() => {
    const saved = localStorage.getItem('rihla_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'welcome',
        message: 'Welcome to Rihla DZ! Explore Algeria with immersive virtual 3D twins & intelligent AI Guidance.',
        date: new Date().toLocaleTimeString(),
        read: false
      }
    ];
  });

  const [activeTaxiRide, setActiveTaxiRide] = useState<TaxiRide | null>(null);

  // Sync state with localStorage as primary/local storage
  useEffect(() => {
    if (currentUser === null) {
      localStorage.removeItem('rihla_user');
    } else {
      localStorage.setItem('rihla_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('rihla_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('rihla_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('rihla_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sync state with Supabase dynamically when currentUser changes
  useEffect(() => {
    const syncDataFromSupabase = async () => {
      if (currentUser && supabaseDbService.isUsingCloud()) {
        try {
          // Fetch bookings from Cloud Supabase
          const cloudBookings = await supabaseDbService.getBookings(currentUser.id);
          if (cloudBookings && cloudBookings.length > 0) {
            setBookings(cloudBookings);
          }
          
          // Fetch favorites from Cloud Supabase
          const cloudFavorites = await supabaseDbService.getFavorites(currentUser.id);
          if (cloudFavorites) {
            setFavorites(cloudFavorites);
          }

          addNotification('Synced successfully with Supabase Cloud Database!');
        } catch (err) {
          console.warn('Failed to fetch from Supabase Cloud on login:', err);
        }
      }
    };
    syncDataFromSupabase();
  }, [currentUser]);

  const addBooking = (newBookingData: Omit<Booking, 'id' | 'invoiceNo' | 'userId'>) => {
    const invoiceNo = `INV-2026-${Math.floor(Math.random() * 89999 + 10000)}`;
    const id = `bkg-${Math.floor(Math.random() * 89999 + 10000)}`;
    const freshBooking: Booking = {
      ...newBookingData,
      id,
      invoiceNo,
      userId: currentUser?.id || 'anonymous'
    };

    setBookings((prev) => [freshBooking, ...prev]);
    addNotification(`Success: Placed booking for "${freshBooking.targetName}". Invoice ID: ${freshBooking.invoiceNo}`);

    // Sync booking with Supabase if connected
    if (currentUser && supabaseDbService.isUsingCloud()) {
      if (newBookingData.type === 'hotel') {
        supabaseDbService.createHotelBooking(currentUser.id, newBookingData);
      } else if (newBookingData.type === 'taxi' && activeTaxiRide) {
        supabaseDbService.createTaxiBooking(currentUser.id, activeTaxiRide);
      }
    }

    return freshBooking;
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    addNotification(`Booking reservation cancelled.`);

    // Sync with Supabase if connected
    if (currentUser && supabaseDbService.isUsingCloud()) {
      supabaseDbService.cancelHotelBooking(id);
    }
  };

  const toggleFavorite = (landmarkId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(landmarkId);
      let nextFavs;
      if (isFav) {
        nextFavs = prev.filter((id) => id !== landmarkId);
        addNotification(`Removed landmark from bookmarks.`);
        
        // Sync with Supabase
        if (currentUser && supabaseDbService.isUsingCloud()) {
          supabaseDbService.toggleFavorite(currentUser.id, landmarkId, false);
        }
      } else {
        nextFavs = [...prev, landmarkId];
        addNotification(`Added landmark to your favorites checklist!`);
        
        // Sync with Supabase
        if (currentUser && supabaseDbService.isUsingCloud()) {
          supabaseDbService.toggleFavorite(currentUser.id, landmarkId, true);
        }
      }
      return nextFavs;
    });
  };

  const addNotification = (message: string) => {
    const newNotif = {
      id: `notif-${Math.random()}`,
      message,
      date: new Date().toLocaleTimeString(),
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const triggerMockTaxiRideProgress = (rideId: string) => {
    if (!activeTaxiRide || activeTaxiRide.id !== rideId) return;

    // Simulate real-time taxi tracking progression across intervals
    // Searching -> Assigned -> Ongoing -> Completed
    setTimeout(() => {
      setActiveTaxiRide((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'assigned',
          driverName: 'Mohamed Kassimi',
          driverPhone: '+213 555 423 912',
          driverCar: 'Dacia Logan (Grey - 16-39129)',
          estimatedMinutes: 8
        };
      });
      addNotification('Taxi status: Mohamed Kassimi assigned. Arriving in 8 mins.');
    }, 2500);

    setTimeout(() => {
      setActiveTaxiRide((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'ongoing',
          estimatedMinutes: 4
        };
      });
      addNotification('Taxi status: Ongoing. Mohamed is driving you safely.');
    }, 7000);

    setTimeout(() => {
      setActiveTaxiRide((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'completed',
          estimatedMinutes: 0
        };
      });
      addNotification('Taxi ride completed. DZD calculation invoice compiled.');
    }, 15000);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        bookings,
        addBooking,
        cancelBooking,
        favorites,
        toggleFavorite,
        notifications,
        addNotification,
        clearNotifications,
        activeTaxiRide,
        setActiveTaxiRide,
        triggerMockTaxiRideProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
