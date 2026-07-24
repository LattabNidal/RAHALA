import React, { useState } from 'react';
import { Compass, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StreetView360Props {
  title: string;
  panoId?: string;
  lat: number;
  lng: number;
  heading?: number;
  pitch?: number;
  fov?: number;
  apiKey: string;
  className?: string;
}

export const StreetView360: React.FC<StreetView360Props> = ({
  title, panoId, lat, lng, heading = 0, pitch = 0, fov = 90, apiKey, className = '',
}) => {
  const { t, isRtl } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const src = panoId
    ? `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&pano=${panoId}&heading=${heading}&pitch=${pitch}&fov=${fov}`
    : `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${lat},${lng}&heading=${heading}&pitch=${pitch}&fov=${fov}`;

  if (!apiKey) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-encre/10 dark:border-white/10 bg-white dark:bg-black p-8 text-center ${className}`}>
        <AlertTriangle size={22} className="text-or-sahara" />
        <p className="text-sm font-sans text-encre/70 dark:text-white/70">
          {t('streetViewKeyMissing') || 'Clé Google Maps non configurée.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-encre/10 dark:border-white/10 bg-white dark:bg-black ${className}`}>
      <div className={`absolute top-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-or-sahara/10 backdrop-blur-sm border border-or-sahara/20 ${isRtl ? 'right-3' : 'left-3'}`}>
        <Compass size={12} className="text-or-sahara" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-or-sahara">
          {t('view360') || 'Vue 360°'}
        </span>
      </div>
      {!loaded && !errored && (
        <div className="absolute inset-0 animate-pulse bg-encre/5 dark:bg-white/5">
          <div className="w-full h-full bg-gradient-to-br from-encre/5 via-encre/10 to-encre/5 dark:from-white/5 dark:via-white/10 dark:to-white/5" />
        </div>
      )}
      {errored ? (
        <div className="flex flex-col items-center justify-center gap-2 aspect-video p-8 text-center">
          <AlertTriangle size={22} className="text-or-sahara" />
          <p className="text-sm font-sans text-encre/70 dark:text-white/70">
            {t('streetViewUnavailable') || "Cette vue 360° n'est pas disponible pour le moment."}
          </p>
        </div>
      ) : (
        <iframe
          title={`Street View 360 — ${title}`}
          src={src}
          className="w-full aspect-video"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{ border: 0 }}
        />
      )}
    </div>
  );
};
