export type Language = 'en' | 'fr' | 'ar' | 'es';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'guest';
  isPremium: boolean;
  avatar: string;
}

export interface Landmark {
  id: string;
  name: string;
  location: string;
  category: 'historical' | 'nature' | 'cultural' | 'sahara';
  rating: number;
  image: string;
  panoramas: string[]; // 360-degree virtual tour step images
  description: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  facts: {
    en: string[];
    fr: string[];
    ar: string[];
    es: string[];
  };
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number; // in DZD
  image: string;
  amenities: string[];
  description: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  latitude?: number;
  longitude?: number;
}

export interface TaxiRide {
  id: string;
  pickup: string;
  destination: string;
  priceDZD: number;
  status: 'searching' | 'assigned' | 'ongoing' | 'completed';
  driverName?: string;
  driverPhone?: string;
  driverCar?: string;
  estimatedMinutes: number;
  polyline: { x: number; y: number }[];
}

export interface Booking {
  id: string;
  userId: string;
  type: 'hotel' | 'taxi';
  targetId: string; // Hotel ID or Taxi ID
  targetName: string;
  date: string;
  endDate?: string;
  guests?: number;
  totalPriceDZD: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  invoiceNo: string;
}

export interface Review {
  id: string;
  landmarkId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
