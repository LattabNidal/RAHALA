import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, Camera, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StreetView360ViewerProps {
  poiId: string;
  lat: number;
  lng: number;
}

export const StreetView360Viewer: React.FC<StreetView360ViewerProps> = ({ poiId, lat, lng }) => {
  const { t, language } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const [isStreetViewAvailable, setIsStreetViewAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!mapRef.current || !(window as any).google) return;

    const panorama = new (window as any).google.maps.StreetViewPanorama(mapRef.current, {
      position: { lat, lng },
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      disableDefaultUI: false,
    });

    const service = new (window as any).google.maps.StreetViewService();
    service.getPanorama({ location: { lat, lng }, radius: 50 }, (data: any, status: any) => {
      if (status === 'OK') {
        setIsStreetViewAvailable(true);
      } else {
        setIsStreetViewAvailable(false);
      }
    });

  }, [lat, lng]);

  if (isStreetViewAvailable === false) {
    return (
      <div className="h-64 flex flex-col items-center justify-center p-6 border border-dashed border-encre/10 rounded-2xl bg-white dark:bg-encre/5 text-center">
        <Camera size={32} className="text-or-sahara mb-3" />
        <p className="text-encre dark:text-white text-xs font-bold font-sans">
          {language === 'ar' ? 'عذراً، لا توجد تغطية تجول افتراضي في هذا الموقع.' : 'Sorry, no Street View coverage at this location.'}
        </p>
        <p className="text-encre/60 dark:text-white/60 text-[10px] mt-1">
          {language === 'ar' ? 'يرجى استكشاف المعرض ثلاثي الأبعاد البديل.' : 'Please explore the alternative 360° digital twin gallery.'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-sm border border-encre/10 bg-white dark:bg-encre/5">
      <div ref={mapRef} className="h-full w-full" />
      {isStreetViewAvailable === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-encre/5">
          <RefreshCw size={24} className="animate-spin text-or-sahara" />
        </div>
      )}
    </div>
  );
};
