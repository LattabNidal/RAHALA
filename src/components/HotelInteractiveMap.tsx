import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Hotel } from '../types';
import { Sparkles, MapPin, Search, Star, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HotelInteractiveMapProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  onSelectHotel: (hotel: Hotel) => void;
  hoveredHotelId: string | null;
  setHoveredHotelId: (id: string | null) => void;
}

export const HotelInteractiveMap: React.FC<HotelInteractiveMapProps> = ({
  hotels,
  selectedHotel,
  onSelectHotel,
  hoveredHotelId,
  setHoveredHotelId
}) => {
  const { language, isRtl } = useLanguage();
  const [mapsApiKey, setMapsApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Attempt automatic retrieval of backend-configured Google Maps key
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.mapsApiKey) {
          setMapsApiKey(data.mapsApiKey);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Could not retrieve API key configuration:', err);
        setLoading(false);
      });
  }, []);

  // Determine which hotel is currently focused for centering the Map
  const focusHotel = selectedHotel || hotels.find(h => h.id === hoveredHotelId) || hotels[0];

  const defaultCenter = focusHotel && focusHotel.latitude && focusHotel.longitude
    ? { lat: focusHotel.latitude, lng: focusFocusLng(focusHotel) }
    : { lat: 36.7538, lng: 3.0588 }; // Center on Algiers by default

  function focusFocusLng(h: Hotel): number {
    return h.longitude ?? 3.0515;
  }

  // Create an embed URL for zero-key mode
  const getEmbedUrl = () => {
    let query = 'Hôtels Algérie';
    if (selectedHotel) {
      query = `${selectedHotel.name}, ${selectedHotel.location}, Algérie`;
    } else if (hoveredHotelId) {
      const h = hotels.find((item) => item.id === hoveredHotelId);
      if (h) {
        query = `${h.name}, ${h.location}, Algérie`;
      }
    } else if (hotels.length > 0) {
      query = `${hotels[0].name}, ${hotels[0].location}, Algérie`;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="bg-slate-50 dark:bg-[#111c2a] border border-slate-205 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg p-1" id="hotel-map-viewport">
      {/* Map Header with micro stats */}
      <div className="px-5 py-3.5 bg-white dark:bg-[#111c2a] rounded-t-3xl flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1">
              <span>🗺️</span> {language === 'ar' ? 'خارطة الفنادق التفاعلية' : 'Carte Interactive des Hôtels'}
            </h3>
            <span className="text-[9px] text-slate-400 font-mono">
              {hotels.length} {language === 'ar' ? 'فنادق متوفرة في القائمة' : 'hôtels tracés à proximité'}
            </span>
          </div>
        </div>
        <div className="text-[10px] bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
          {mapsApiKey ? 'Google Live Engine' : 'Google Embed Sandbox'}
        </div>
      </div>

      <div className="h-[430px] w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900/90">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : mapsApiKey ? (
          <APIProvider apiKey={mapsApiKey} version="weekly">
            <Map
              defaultCenter={defaultCenter}
              defaultZoom={11}
              center={defaultCenter}
              mapId="HOTELS_MAP_3D"
              style={{ width: '100%', height: '100%' }}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            >
              {hotels.map((hotel) => {
                const isSelected = selectedHotel?.id === hotel.id;
                const isHovered = hoveredHotelId === hotel.id;
                const pinScale = isSelected ? 1.3 : isHovered ? 1.15 : 0.9;
                const pinColor = isSelected ? '#ef4444' : isHovered ? '#10b981' : '#047857';

                if (!hotel.latitude || !hotel.longitude) return null;

                return (
                  <AdvancedMarker
                    key={hotel.id}
                    position={{ lat: hotel.latitude, lng: hotel.longitude }}
                    onClick={() => onSelectHotel(hotel)}
                    title={hotel.name}
                  >
                    <div
                      onMouseEnter={() => setHoveredHotelId(hotel.id)}
                      onMouseLeave={() => setHoveredHotelId(null)}
                      className="cursor-pointer transition-transform"
                    >
                      <Pin
                        background={pinColor}
                        borderColor="#ffffff"
                        glyphColor="#ffffff"
                        scale={pinScale}
                      />
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        ) : (
          /* High quality interactive iframe zero-key fallback with exact Google search query */
          <div className="w-full h-full">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer"
              src={getEmbedUrl()}
              className="w-full h-full"
            ></iframe>

            {/* Float HUD listing options and clickable to pan map */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-205 dark:border-slate-800 p-3 rounded-2xl shadow-xl max-h-[100px] overflow-x-auto flex items-center space-x-3 space-x-reverse scrollbar-thin">
              <span className="text-[9.5px] font-black uppercase text-slate-500 whitespace-nowrap orientation-sideways block rotate-180 border-r dark:border-slate-800 pr-2">
                🏠 POI
              </span>
              {hotels.map((h) => {
                const isActive = selectedHotel?.id === h.id || hoveredHotelId === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => {
                      onSelectHotel(h);
                      setHoveredHotelId(h.id);
                    }}
                    onMouseEnter={() => setHoveredHotelId(h.id)}
                    onMouseLeave={() => setHoveredHotelId(null)}
                    className={`px-3 py-1.5 rounded-xl text-left transition whitespace-nowrap text-xs border cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md scale-105'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-750 hover:border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]">🏨</span>
                      <div>
                        <span className="font-extrabold block leading-tight text-[11px]">{h.name.replace('Hotel ', '')}</span>
                        <span className="text-[9px] opacity-75 font-mono">{h.pricePerNight.toLocaleString()} DZD</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Info panel indicating the current location selection */}
        {focusHotel && (
          <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md text-white px-3 py-2 rounded-2xl text-[10.5px] max-w-[240px] shadow-lg border border-white/10 flex flex-col space-y-1">
            <span className="font-black text-emerald-400 uppercase tracking-widest text-[8px] flex items-center gap-1">
              <MapPin size={10} />
              {focusHotel.location}
            </span>
            <span className="font-extrabold truncate text-[11px] leading-tight block">{focusHotel.name}</span>
            <div className="flex items-center justify-between mt-1 text-[9px] text-slate-300">
              <span className="flex items-center gap-0.5">
                <Star size={9} className="fill-amber-400 text-amber-400" />
                {focusHotel.rating}
              </span>
              <span className="font-mono text-emerald-300 font-bold">{focusHotel.pricePerNight.toLocaleString()} DZD</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-white dark:bg-[#111c2a] rounded-b-3xl text-center text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
        📌 {language === 'ar' ? 'حدد أي فندق من الخارطة لعرض أسعار الغرف أو البدء في الحجز الفوري.' : 'Sélectionnez un hôtel sur la carte pour consulter les tarifs et lancer la réservation.'}
      </div>
    </div>
  );
};
