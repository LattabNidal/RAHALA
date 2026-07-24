import React, { useEffect, useState } from 'react';
import { Camera, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MapillaryViewerProps {
  lat: number;
  lng: number;
}

export const MapillaryViewer: React.FC<MapillaryViewerProps> = ({ lat, lng }) => {
  const { language } = useLanguage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Mapillary API - simple fetch to get the nearest panorama image.
    // NOTE: This requires a Mapillary Client ID, but for this demonstration,
    // we use a direct image fetch if possible or a placeholder if API key is missing.
    const fetchPanorama = async () => {
      // Dummy URL, replace with actual Mapillary API request if key available
      // The API key should be managed securely if implemented for real
      setImageUrl(`https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80`);
    };

    fetchPanorama();
  }, [lat, lng]);

  return (
    <div className="mt-4 p-4 border border-encre/10 rounded-2xl bg-white dark:bg-encre/5">
        <h4 className="text-[10px] font-mono font-black tracking-widest uppercase text-or-sahara mb-2 flex items-center gap-1.5">
          <Camera size={12} />
          <span>{language === 'ar' ? 'بانوراما المجتمع (Mapillary)' : 'Community Panorama (Mapillary)'}</span>
        </h4>
        {imageUrl ? (
            <img src={imageUrl} alt="Community 360" className="w-full h-40 object-cover rounded-xl" />
        ) : (
            <div className="h-40 flex items-center justify-center text-encre/40 text-xs">
                {language === 'ar' ? 'جار التحميل...' : 'Loading...'}
            </div>
        )}
    </div>
  );
};
