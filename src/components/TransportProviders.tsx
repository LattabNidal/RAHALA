import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ExternalLink, Phone, Globe, Plane, Car, Sparkles, Filter } from 'lucide-react';

interface TransportProvider {
  id: string;
  name: string;
  nameAr: string;
  type: 'airline' | 'taxi';
  typeLabelEn: string;
  typeLabelAr: string;
  website: string;
  phone?: string;
  logo: string;
}

export const TransportProviders: React.FC = () => {
  const { isRtl, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'airline' | 'taxi'>('all');

  const providers: TransportProvider[] = [
    {
      id: 'air-algerie',
      name: 'Air Algérie',
      nameAr: 'الخطوط الجوية الجزائرية',
      type: 'airline',
      typeLabelEn: 'Airline',
      typeLabelAr: 'طيران',
      website: 'https://airalgerie.dz',
      phone: '+213 21 98 63 63',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3c/Air_Alg%C3%A9rie_Logo.svg/512px-Air_Alg%C3%A9rie_Logo.svg.png'
    },
    {
      id: 'tassili-airlines',
      name: 'Tassili Airlines',
      nameAr: 'طيران الطاسيلي',
      type: 'airline',
      typeLabelEn: 'Airline',
      typeLabelAr: 'طيران',
      website: 'https://tassiliairlines.dz',
      phone: '+213 21 737373',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Tassili_Airlines_logo.svg/512px-Tassili_Airlines_logo.svg.png'
    },
    {
      id: 'yassir',
      name: 'Yassir',
      nameAr: 'يسير',
      type: 'taxi',
      typeLabelEn: 'Taxi App',
      typeLabelAr: 'تطبيق سيارات',
      website: 'https://yassir.com',
      phone: '+213 560 00 00 00',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Yassir_logo.png/512px-Yassir_logo.png'
    },
    {
      id: 'indrive',
      name: 'inDrive',
      nameAr: 'إن درايف',
      type: 'taxi',
      typeLabelEn: 'Taxi App',
      typeLabelAr: 'تطبيق سيارات',
      website: 'https://indrive.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/InDrive_Logo.svg/512px-InDrive_Logo.svg.png'
    },
    {
      id: 'heetch',
      name: 'Heetch',
      nameAr: 'هيتش',
      type: 'taxi',
      typeLabelEn: 'Taxi App',
      typeLabelAr: 'تطبيق سيارات',
      website: 'https://heetch.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Heetch_logo.png/512px-Heetch_logo.png'
    }
  ];

  const filteredProviders = providers.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.type === activeFilter;
  });

  return (
    <div className="mt-16 pt-12 border-t border-[#E2E8F0] mb-16" id="transport-providers-deck">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FDBA74] animate-pulse"></span>
            <p className="text-[10px] uppercase font-mono font-black text-[#3B82F6] tracking-widest flex items-center gap-1">
              <Filter size={11} className="text-[#FDBA74]" /> {language === 'ar' ? 'شركاء النقل المعتمدين' : 'TRUSTED TRAVEL DIRECTORY'}
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#334155] flex items-center gap-2 text-left">
            <span>🇩🇿</span>
            <span>{language === 'ar' ? 'شركات النقل الجوي وخدمات التوصيل في الجزائر' : 'Flight Carriers & Ride Services in Algeria'}</span>
          </h2>
          <p className="text-xs text-[#94A3B8] mt-2 max-w-2xl text-left">
            {language === 'ar' 
              ? 'دليل شامل وموثق لشركات الطيران وحلول سيارات الأجرة الذكية المرخصة للتحرك بأمان داخل التراب الوطني.' 
              : 'Our verified regional catalog of flight operations, charter airlines, and localized ride-seeking services across Algeria.'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-mono uppercase tracking-widest font-black border border-[#3B82F6]/20">
            <Sparkles size={11} className="animate-pulse" /> {language === 'ar' ? 'بوابة التنقل الجزائرية' : 'ALGERIAN LOGISTICS CONNECT'}
          </span>
        </div>
      </div>

      {/* Filter Tabs - UI Design System aligned with premium style */}
      <div className="flex gap-2 p-1 bg-[#F8FAFC] rounded-xl max-w-sm mb-8 border border-[#E2E8F0]">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-2 px-3 rounded-lg font-mono text-[10px] font-black tracking-wider transition uppercase flex items-center justify-center gap-2 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-[#334155]'
          }`}
        >
          <span>{language === 'ar' ? 'الكل' : 'All'}</span>
        </button>
        <button
          onClick={() => setActiveFilter('airline')}
          className={`flex-1 py-2 px-3 rounded-lg font-mono text-[10px] font-black tracking-wider transition uppercase flex items-center justify-center gap-2 cursor-pointer ${
            activeFilter === 'airline'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-[#334155]'
          }`}
        >
          <Plane size={11} />
          <span>{language === 'ar' ? '✈️ طيران' : '✈️ Aviation'}</span>
        </button>
        <button
          onClick={() => setActiveFilter('taxi')}
          className={`flex-1 py-2 px-3 rounded-lg font-mono text-[10px] font-black tracking-wider transition uppercase flex items-center justify-center gap-2 cursor-pointer ${
            activeFilter === 'taxi'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-[#334155]'
          }`}
        >
          <Car size={11} />
          <span>{language === 'ar' ? '🚕 سيارات' : '🚕 Rides'}</span>
        </button>
      </div>

      {/* Grid of Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="transport-providers-grid">
        {filteredProviders.map((provider) => (
          <div 
            key={provider.id} 
            className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group overflow-hidden"
          >
            {/* Soft decorative background glow on hover */}
            <div className="absolute -inset-10 bg-[#3B82F6]/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative z-10 text-left">
              
              {/* Header block: Logo + Name/Type */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-1.5 border border-[#E2E8F0] shrink-0">
                  <img 
                    src={provider.logo} 
                    alt={provider.name} 
                    className="max-w-full max-h-full object-contain filter group-hover:scale-105 transition duration-300"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = provider.type === 'airline' 
                        ? 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80'
                        : 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=80&q=80';
                    }}
                  />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest font-black text-[#3B82F6] uppercase block">
                    {language === 'ar' ? (provider.type === 'airline' ? 'طيران' : 'تطبيق سيارات') : provider.typeLabelEn}
                  </span>
                  <h3 className="text-base font-black text-[#334155] mt-0.5">
                    {language === 'ar' ? provider.nameAr : provider.name}
                  </h3>
                </div>
              </div>

              {/* Official website */}
              <div className="flex items-center gap-2 text-xs text-[#334155] font-mono bg-[#F8FAFC] rounded-xl px-3 py-2 border border-[#E2E8F0] mb-3 justify-between">
                <div className="flex items-center gap-1.5">
                  <Globe size={12} className="text-[#3B82F6]" />
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8]">{language === 'ar' ? 'الموقع الرسمي' : 'Official website'}</span>
                </div>
                <a href={provider.website} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-[#3B82F6] transition truncate max-w-[150px]">
                  {provider.website.replace('https://', '')}
                </a>
              </div>

              {/* Phone number */}
              <div className="flex items-center gap-2 text-xs text-[#334155] font-mono bg-[#F8FAFC] rounded-xl px-3 py-2 border border-[#E2E8F0] mb-4 justify-between">
                <div className="flex items-center gap-1.5">
                  <Phone size={12} className={provider.phone ? "text-[#FDBA74]" : "text-gray-450"} />
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8]">{language === 'ar' ? 'الهاتف' : 'Phone'}</span>
                </div>
                {provider.phone ? (
                  <a href={`tel:${provider.phone.replace(/\s+/g, '')}`} className="font-bold hover:text-[#3B82F6] transition">
                    {provider.phone}
                  </a>
                ) : (
                  <span className="font-medium italic text-gray-400">
                    {language === 'ar' ? 'غير متوفر' : 'Not available'}
                  </span>
                )}
              </div>

            </div>

            {/* Visit Official Website Button */}
            <div className="relative z-10 pt-2 border-t border-[#E2E8F0]">
              <a 
                href={provider.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-2.5 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-xs rounded-xl shadow-sm transition transform active:scale-97 flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <Globe size={13} />
                <span>{language === 'ar' ? 'زيارة الموقع الرسمي' : 'Visit Official Portal'}</span>
                <ExternalLink size={11} />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
