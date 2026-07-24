import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { PriceTag } from './rahala/PriceTag';
import { LazyImage } from './rahala/LazyImage';
import { 
  Star, Check, DollarSign, Calendar, Users, Eye, 
  Coffee, Landmark, ArrowLeft, Download, MapPin, 
  Shield, Search, ChevronDown, Sparkles
} from 'lucide-react';
import { mockHotels } from '../data/mockData';
import { Hotel } from '../types';
import { HotelInteractiveMap } from './HotelInteractiveMap';

interface BookingModuleProps {
  setActiveView?: (view: string) => void;
}

export const BookingModule: React.FC<BookingModuleProps> = ({ setActiveView }) => {
  const { t, isRtl } = useLanguage();
  const { addBooking } = useApp();

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [hoveredHotelId, setHoveredHotelId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('2026-06-20');
  const [endDate, setEndDate] = useState<string>('2026-06-25');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [stripeFormOpen, setStripeFormOpen] = useState(false);
  const [bookingFinished, setBookingFinished] = useState<any | null>(null);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  const citiesList = [
    { value: 'all', label: isRtl ? 'كل الولايات' : 'All provinces' },
    { value: 'Algiers', label: isRtl ? 'الجزائر العاصمة' : 'Algiers (Capital)' },
    { value: 'Oran', label: isRtl ? 'وهران الباهية' : 'Oran (West Coast)' },
    { value: 'Constantine', label: isRtl ? 'قسنطينة العتيقة' : 'Constantine (East Rock Gorges)' },
    { value: 'Djanet', label: isRtl ? 'جانت الساحرة' : 'Djanet (Sahara Oasis)' }
  ];

  const filteredHotels = mockHotels.filter(hotel => {
    if (selectedCity === 'all') return true;
    return hotel.location.toLowerCase().includes(selectedCity.toLowerCase());
  });

  const getDaysCount = () => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const handleBookSubmit = () => {
    if (!selectedHotel) return;
    setStripeFormOpen(true);
  };

  const handlePayConfirm = () => {
    if (!selectedHotel) return;
    const days = getDaysCount();
    const cost = selectedHotel.pricePerNight * days;

    const bkg = addBooking({
      type: 'hotel',
      targetId: selectedHotel.id,
      targetName: selectedHotel.name,
      date: startDate,
      endDate: endDate,
      guests: guestCount,
      totalPriceDZD: cost,
      paymentStatus: 'paid'
    });

    setBookingFinished(bkg);
    setStripeFormOpen(false);
  };

  return (
    <div className="py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans text-ink bg-[#F8FAFC]" id="booking-module-room">
      
      {/* Upper header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
        <span className="text-[10px] font-mono font-black text-gold tracking-[0.2em] uppercase block mb-2">
          {isRtl ? 'إقامات جزائرية معتمدة' : 'PREMIUM LODGING INDEX'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-ink">
          {t('hotelTitle')}
        </h1>
        <p className="mt-3 text-xs text-ink/60 leading-relaxed max-w-md mx-auto">
          {t('hotelSubtitle')}
        </p>
      </div>

      {!selectedHotel ? (
        <>
          {/* --- TRIVAGO-STYLE CENTRAL SEARCH WIDGET --- */}
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-5 sm:p-6 shadow-md shadow-gold/5 max-w-5xl mx-auto mb-12" id="trivago-search-bar-panel">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Destination Dropdown Selector */}
              <div className="md:col-span-4 relative text-left">
                <label className="block text-[8px] font-mono uppercase tracking-wider text-ink/60 mb-1">
                  {isRtl ? 'الوجهة السياحية' : 'DESTINATION'}
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-xs font-black bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 rounded-xl text-ink focus:outline-none focus:border-gold appearance-none cursor-pointer"
                  >
                    {citiesList.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/60 pointer-events-none" />
                </div>
              </div>

              {/* Check-In Date */}
              <div className="md:col-span-3 text-left">
                <label className="block text-[8px] font-mono uppercase tracking-wider text-ink/60 mb-1 flex items-center gap-1">
                  <Calendar size={10} className="text-gold" />
                  <span>{isRtl ? 'تاريخ الدخول' : 'CHECK-IN'}</span>
                </label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs font-black bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 rounded-xl text-ink focus:outline-none focus:border-gold cursor-pointer"
                />
              </div>

              {/* Check-Out Date */}
              <div className="md:col-span-3 text-left">
                <label className="block text-[8px] font-mono uppercase tracking-wider text-ink/60 mb-1 flex items-center gap-1">
                  <Calendar size={10} className="text-gold" />
                  <span>{isRtl ? 'تاريخ الخروج' : 'CHECK-OUT'}</span>
                </label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs font-black bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 rounded-xl text-ink focus:outline-none focus:border-gold cursor-pointer"
                />
              </div>

              {/* Guest Count Dropdown */}
              <div className="md:col-span-2 text-left">
                <label className="block text-[8px] font-mono uppercase tracking-wider text-ink/60 mb-1 flex items-center gap-1">
                  <Users size={10} className="text-gold" />
                  <span>{isRtl ? 'عدد النزلاء' : 'GUESTS'}</span>
                </label>
                <div className="relative">
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full text-xs font-black bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 rounded-xl text-ink focus:outline-none focus:border-gold appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? (isRtl ? 'شخص' : 'Guest') : (isRtl ? 'أشخاص' : 'Guests')}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/60 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Simulated search status badge */}
            <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-ink/60 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-gold animate-pulse" />
                <span>{isRtl ? 'البحث التلقائي الذكي مفعل' : 'Auto-filtering matches instantly'}</span>
              </span>
              <span className="font-bold text-gold">
                {filteredHotels.length} {isRtl ? 'فنادق مطابقة' : 'stays found'}
              </span>
            </div>
          </div>

          {/* Map & Lodging dual workspace list */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="hotel-selection-booking-portal">
            
            {/* Left stays card listing panel (7 cols) */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <h2 className="text-xs font-black uppercase text-ink tracking-wider">
                  {isRtl ? 'الفنادق المتاحة للحجز' : 'Luxury retreats matching search'} ({filteredHotels.length})
                </h2>
                <span className="px-2.5 py-1 bg-gold/10 text-gold rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border border-gold/20">
                  {selectedCity === 'all' ? (isRtl ? 'كل الولايات' : 'Algeria') : selectedCity}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHotels.map((hotel) => {
                  const isHovered = hoveredHotelId === hotel.id;
                  return (
                    <div 
                      key={hotel.id}
                      onMouseEnter={() => setHoveredHotelId(hotel.id)}
                      onMouseLeave={() => setHoveredHotelId(null)}
                      className={`bg-white border rounded-[20px] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between transform ${
                        isHovered 
                          ? 'border-gold/50 scale-[1.01]' 
                          : 'border-[#E2E8F0]'
                      }`}
                    >
                      <div className="relative h-44 overflow-hidden">
                        <LazyImage 
                          src={hotel.image} 
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white/95 border border-[#E2E8F0] text-ink rounded-xl px-2 py-1 text-[10px] font-bold flex items-center space-x-1 space-x-reverse shadow-xs">
                          <Star size={10} className="fill-gold text-gold" />
                          <span>{hotel.rating}</span>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-white/90 border border-[#E2E8F0] text-ink rounded-xl px-2 py-1 text-[9px] font-bold flex items-center gap-1 shadow-xs">
                          <MapPin size={9} className="text-gold" />
                          <span>{hotel.location}</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-black text-ink leading-tight mb-2 truncate hover:text-gold transition-colors">
                            {hotel.name}
                          </h3>
                          <p className="text-[10px] text-ink/60 font-semibold mb-3">
                            {hotel.location}, Algeria
                          </p>
                          <p className="text-[11px] text-ink/70 leading-relaxed line-clamp-3 mb-5">
                            {hotel.description[isRtl ? 'ar' : 'en']}
                          </p>
                        </div>

                        <div>
                          {/* Price and Action row */}
                          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4 mt-2">
                            <div>
                              <span className="block text-[8px] font-mono text-ink/60 uppercase tracking-wider">Starting at</span>
                              <PriceTag amount={hotel.pricePerNight} />
                            </div>
                            <button
                              onClick={() => setSelectedHotel(hotel)}
                              className="px-4 py-2.5 bg-gold hover:bg-[#C29B2E] text-ink rounded-xl text-xs font-bold transition shadow-xs cursor-pointer focus:outline-none"
                            >
                              {isRtl ? 'احجز الآن' : 'Book stay'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Map workspace panel (5 cols) */}
            <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 border border-[#E2E8F0] rounded-[24px] overflow-hidden bg-white shadow-xs p-1">
              <div className="bg-[#F8FAFC] py-2 px-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-ink tracking-wider">Interactive Stays Map</span>
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              </div>
              <HotelInteractiveMap
                hotels={filteredHotels}
                selectedHotel={selectedHotel}
                onSelectHotel={(hotel) => setSelectedHotel(hotel)}
                hoveredHotelId={hoveredHotelId}
                setHoveredHotelId={setHoveredHotelId}
              />
            </div>

          </div>
        </>
      ) : (
        /* Selected Room Booking sheet */
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-md max-w-2xl mx-auto relative overflow-hidden animate-scale-up">
          
          <button
            onClick={() => {
              setSelectedHotel(null);
              setBookingFinished(null);
            }}
            className="absolute top-6 right-6 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:bg-[#E2E8F0] text-ink transition cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>

          {!bookingFinished ? (
            <>
              <div className="flex items-center space-x-4 space-x-reverse mb-6">
                <LazyImage 
                  src={selectedHotel.image} 
                  alt={selectedHotel.name}
                  className="w-20 h-20 rounded-xl object-cover border border-[#E2E8F0]"
                />
                <div className="text-left">
                  <span className="px-2.5 py-0.5 bg-gold/10 text-gold border border-gold/20 text-[9px] rounded-lg font-bold font-mono uppercase tracking-wider">SELECTED STAY</span>
                  <h3 className="text-lg font-serif font-black text-ink mt-1.5 leading-none">{selectedHotel.name}</h3>
                  <p className="text-[10px] text-ink/60 mt-1 font-semibold">{selectedHotel.location}, Algeria</p>
                </div>
              </div>

              {/* Form elements selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pt-4 border-t border-[#E2E8F0]">
                <div className="text-left">
                  <label className="block text-[9px] font-mono text-ink/60 uppercase mb-1.5 flex items-center gap-1">
                    <Calendar size={10} className="text-gold" />
                    <span>Check-In Date</span>
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs font-bold border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 rounded-xl text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-[9px] font-mono text-ink/60 uppercase mb-1.5 flex items-center gap-1">
                    <Calendar size={10} className="text-gold" />
                    <span>Check-Out Date</span>
                  </label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs font-bold border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 rounded-xl text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-[9px] font-mono text-ink/60 uppercase mb-1.5 flex items-center gap-1">
                    <Users size={10} className="text-gold" />
                    <span>Guests count</span>
                  </label>
                  <select 
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 rounded-xl text-ink focus:outline-none focus:border-gold cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calculation panel */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs text-ink space-y-2.5 mb-6">
                <div className="flex justify-between">
                  <span className="text-ink/60 font-medium">Room price per night:</span>
                  <PriceTag amount={selectedHotel.pricePerNight} />
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60 font-medium">Total duration of stays:</span>
                  <span className="font-mono tabular-nums font-bold">{getDaysCount()} night{getDaysCount() > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between border-t border-[#E2E8F0] pt-2 text-sm font-black">
                  <span className="text-ink">Estimated Total:</span>
                  <PriceTag amount={selectedHotel.pricePerNight * getDaysCount()} />
                </div>
              </div>

              {/* RAHALA Safe Travel Insurance Banner */}
              {setActiveView && (
                <div className="mb-6 p-4 rounded-xl border border-gold/20 bg-gold/5 flex items-start gap-3 relative overflow-hidden text-left">
                  <div className="w-9 h-9 rounded-full bg-gold text-ink flex items-center justify-center shrink-0">
                    <Shield size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="font-black text-[8px] text-gold font-mono tracking-widest uppercase">
                        AI SAFE RECOMMENDATION
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                    </div>
                    <h4 className="text-xs font-bold text-ink mt-1">
                      Protect your journey to {selectedHotel.location}!
                    </h4>
                    <p className="text-[10px] text-ink/60 leading-relaxed mt-1">
                      Our system recommends securing your stay with local licensed insurance partners (BNA, AXA, Cardif, CPA).
                    </p>
                    <button
                      onClick={() => setActiveView('safe-travel')}
                      className="mt-2 text-[9px] font-mono font-black uppercase text-gold hover:text-[#C29B2E] flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      Compare Insurance Plans &rarr;
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookSubmit}
                className="w-full py-3 bg-gold hover:bg-[#C29B2E] text-ink font-bold text-xs rounded-xl shadow-xs transition cursor-pointer focus:outline-none"
              >
                Proceed to Secure Payment Checkout
              </button>
            </>
          ) : (
            /* Post Booking Complete & Invoice panel */
            <div className="text-center py-6 animate-scale-up">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/25">
                <Check size={24} />
              </div>
              <h3 className="text-xl font-serif font-black text-ink mb-2">Room Booking Completed!</h3>
              <p className="text-xs text-ink/60 font-mono mb-6">Invoice Certificate No: {bookingFinished.invoiceNo}</p>

              <div className="bg-[#F8FAFC] rounded-2xl p-5 text-xs text-left max-w-sm mx-auto border border-[#E2E8F0] space-y-2.5 mb-6">
                <p className="font-bold text-[9px] text-ink/60 uppercase tracking-widest border-b border-[#E2E8F0] pb-2">Receipt invoice breaksheet</p>
                <div className="flex justify-between">
                  <span className="text-ink/60">Hotel Spot:</span>
                  <span className="font-bold text-ink">{selectedHotel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Check-In:</span>
                  <span className="font-bold text-ink">{startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Total days:</span>
                  <span className="font-bold text-ink">{getDaysCount()} nights</span>
                </div>
                <div className="flex justify-between border-t border-[#E2E8F0] pt-2 text-sm font-black">
                  <span className="text-ink">Amount Paid:</span>
                  <PriceTag amount={selectedHotel.pricePerNight * getDaysCount()} />
                </div>
              </div>

              <div className="flex space-x-2 space-x-reverse justify-center max-w-sm mx-auto">
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Rihla DZ Travel Invoice - ${bookingFinished.invoiceNo}</title>
                            <style>
                              body { font-family: sans-serif; padding: 40px; color: #1E293B; background: #FDFBF7; }
                              .header { text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; }
                              .title { font-size: 24px; font-weight: bold; color: #D4AF37; }
                              .details { margin: 30px 0; }
                              .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #E2E8F0; padding-bottom: 5px; }
                              .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; color: #D4AF37; }
                              .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #1E293B; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <div class="title">Rihla DZ International Tourism Platform</div>
                              <p>Algeria Smart Tourism Bureau Certification</p>
                            </div>
                            <div class="details">
                              <h3>Official Booking Travel Invoice</h3>
                              <div class="row"><span>Invoice ID:</span><strong>${bookingFinished.invoiceNo}</strong></div>
                              <div class="row"><span>Vessel Stay Location:</span><strong>${selectedHotel.name} (${selectedHotel.location})</strong></div>
                              <div class="row"><span>Check-In Starting:</span><strong>${startDate}</strong></div>
                              <div class="row"><span>Check-Out Date:</span><strong>${endDate}</strong></div>
                              <div class="row"><span>Vetted guests size:</span><strong>${guestCount} Adults</strong></div>
                              <div class="total">Total Paid In Full: ${(selectedHotel.pricePerNight * getDaysCount()).toLocaleString()} DZD</div>
                            </div>
                            <div class="footer">
                              <p>Protected by Rihla DZ Smart SSL Shield. Secured checkout facilitated in Algiers, DZ.</p>
                            </div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }}
                  className="flex-1 py-2.5 bg-ink hover:bg-ink/90 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 space-x-reverse cursor-pointer"
                >
                  <Download size={13} />
                  <span>{t('invoiceBtn')}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedHotel(null);
                    setBookingFinished(null);
                  }}
                  className="flex-1 py-2.5 bg-gold/10 text-gold hover:bg-gold/20 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Book other stays
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Stripe payment sheet modal */}
      {stripeFormOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[24px] p-6 shadow-xl relative border border-[#E2E8F0] animate-scale-up text-left">
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3 mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-ink">Secure Checkout (Stripe powered)</span>
              <button 
                onClick={() => setStripeFormOpen(false)}
                className="text-xs text-ink/60 hover:text-ink font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[8px] font-mono text-ink/60 mb-1">CREDIT/DEBIT CARD NUMBER</label>
                <input 
                  type="text" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full text-xs font-black border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-ink rounded-xl focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-mono text-ink/60 mb-1">EXPIRY DATE (MM / YY)</label>
                  <input 
                    type="text" 
                    placeholder="12 / 29"
                    className="w-full text-xs font-black border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-ink rounded-xl focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-ink/60 mb-1">CVV CODE</label>
                  <input 
                    type="text" 
                    placeholder="391"
                    className="w-full text-xs font-black border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-ink rounded-xl focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="p-3 bg-gold/5 border border-gold/15 rounded-xl text-ink font-medium leading-relaxed">
                <span className="block font-black text-xs mb-1 text-gold">Safe SSL encrypted channel</span>
                Amount scheduled: <PriceTag amount={selectedHotel ? (selectedHotel.pricePerNight * getDaysCount()) : 0} />
              </div>

              <button
                onClick={handlePayConfirm}
                className="w-full py-2.5 bg-gold hover:bg-[#C29B2E] text-ink font-bold text-xs rounded-xl shadow-xs transition cursor-pointer focus:outline-none"
              >
                Confirm Payment & Authorize
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
