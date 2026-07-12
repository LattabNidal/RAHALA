import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Star, Check, DollarSign, Calendar, Users, Eye, Coffee, Landmark, ArrowLeft, Download, MapPin, Shield } from 'lucide-react';
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
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4" id="booking-module-room">
      
      {/* Upper header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-display">
          {t('hotelTitle')}
        </h1>
        <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
          {t('hotelSubtitle')}
        </p>
      </div>

      {!selectedHotel ? (
        <>
          {/* Quick city filter */}
          <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-4 justify-start sm:justify-center pr-1 mb-8" id="hotel-city-filters">
            {citiesList.map((city) => (
              <button
                key={city.value}
                onClick={() => setSelectedCity(city.value)}
                className={`px-4 py-2.5 text-[11px] font-bold rounded-xl transition whitespace-nowrap border cursor-pointer ${
                  selectedCity === city.value
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-600 shadow-md'
                    : 'bg-white text-gray-650 border-gray-150 dark:bg-[#162231] dark:border-slate-800 dark:text-slate-300'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>

          {/* Map & Lodging dual workspace list */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="hotel-selection-booking-portal">
            
            {/* Left stays card listing panel (7 cols) */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                  {isRtl ? 'خيارات الفنادق المتاحة' : 'Available Luxury Lodgings'} ({filteredHotels.length})
                </h2>
                <span className="text-[10px] text-gray-400 font-mono">
                  {selectedCity === 'all' ? (isRtl ? 'الجزائر بأكملها' : 'All of Algeria') : selectedCity}
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
                      className={`bg-white dark:bg-[#162231] border rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform ${
                        isHovered 
                          ? 'border-emerald-500/80 scale-[1.02] shadow-lg shadow-emerald-500/5' 
                          : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={hotel.image} 
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-black/55 backdrop-blur-md text-white rounded-lg px-2 py-1 text-[10px] font-bold flex items-center space-x-1">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span>{hotel.rating}</span>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white rounded-lg px-2 py-0.5 text-[9px] font-bold flex items-center gap-1">
                          <MapPin size={9} className="text-emerald-400" />
                          <span>{hotel.location}</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-extrabold text-gray-800 dark:text-white leading-tight mb-1 truncate group-hover:text-emerald-500 transition">
                            {hotel.name}
                          </h3>
                          <p className="text-[10px] font-mono text-gray-400 mb-2">{hotel.location}, Algeria</p>
                          <p className="text-[10.5px] text-gray-500 dark:text-slate-400 leading-normal line-clamp-3 mb-4">
                            {hotel.description[isRtl ? 'ar' : 'en']}
                          </p>
                        </div>

                        <div>
                          {/* Price and Action row */}
                          <div className="flex items-end justify-between border-t border-gray-50 dark:border-slate-800/40 pt-4 mt-2">
                            <div>
                              <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-widest">Starting at</span>
                              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                {hotel.pricePerNight.toLocaleString()} DZD <span className="text-[9px] font-normal text-slate-400">/night</span>
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedHotel(hotel)}
                              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                            >
                              {isRtl ? 'احجز الآن' : 'Book room'}
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
            <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24">
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
        <div className="bg-white dark:bg-[#162231] border border-emerald-50 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto relative overflow-hidden animate-scale-up">
          
          <button
            onClick={() => {
              setSelectedHotel(null);
              setBookingFinished(null);
            }}
            className="absolute top-6 right-6 p-2 bg-gray-50 dark:bg-slate-900 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-850 text-gray-500 transition"
          >
            <ArrowLeft size={16} />
          </button>

          {!bookingFinished ? (
            <>
              <div className="flex items-center space-x-4 space-x-reverse mb-6">
                <img 
                  src={selectedHotel.image} 
                  alt={selectedHotel.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div>
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[9px] rounded-lg font-bold font-mono uppercase tracking-wider">SELECTED STAY</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 leading-none">{selectedHotel.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-1">{selectedHotel.location}, Algeria</p>
                </div>
              </div>

              {/* Form elements selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pt-4 border-t border-gray-50 dark:border-slate-800/80">
                <div>
                  <label className="block text-[9px] font-mono text-gray-400 uppercase mb-1 flex items-center space-x-1 space-x-reverse">
                    <Calendar size={10} />
                    <span>Check-In Date</span>
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs font-semibold border border-gray-150 dark:border-slate-800 dark:bg-slate-900 px-3 py-2.5 rounded-xl text-gray-700 dark:text-slate-200 focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-gray-400 uppercase mb-1 flex items-center space-x-1 space-x-reverse">
                    <Calendar size={10} />
                    <span>Check-Out Date</span>
                  </label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs font-semibold border border-gray-150 dark:border-slate-800 dark:bg-slate-900 px-3 py-2.5 rounded-xl text-gray-700 dark:text-slate-200 focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-gray-400 uppercase mb-1 flex items-center space-x-1 space-x-reverse">
                    <Users size={10} />
                    <span>Guests count</span>
                  </label>
                  <select 
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full text-xs font-semibold border border-gray-150 dark:border-slate-800 dark:bg-slate-900 px-3 py-2.5 rounded-xl text-gray-700 dark:text-slate-200 focus:outline-emerald-500"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calculation panel */}
              <div className="p-4 bg-gray-50/60 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800/80 text-xs text-gray-600 dark:text-slate-350 space-y-2 mb-6 font-sans">
                <div className="flex justify-between">
                  <span>Room price per night:</span>
                  <span className="font-bold text-gray-800 dark:text-white">{selectedHotel.pricePerNight.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between">
                  <span>Total duration of stays:</span>
                  <span className="font-bold text-gray-800 dark:text-white">{getDaysCount()} night{getDaysCount() > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 dark:border-slate-800/40 pt-2 text-sm text-gray-800 dark:text-white font-extrabold">
                  <span>Estimated Total (DZD):</span>
                  <span className="text-emerald-600">{(selectedHotel.pricePerNight * getDaysCount()).toLocaleString()} DZD</span>
                </div>
              </div>

              {/* RAHALA Safe Travel Insurance Banner */}
              {setActiveView && (
                <div className="mb-6 p-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/5 flex items-start gap-3 relative overflow-hidden font-sans">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                    <Shield size={18} className="animate-pulse" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="font-extrabold text-[9px] text-[#d4af37] font-mono tracking-widest uppercase">
                        AI SAFE RECOMMENDATION
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    </div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white mt-1 leading-tight">
                      Protect your journey to {selectedHotel.location}!
                    </h4>
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                      Our system recommends securing your stay with local licensed insurance partners (BNA, AXA, Cardif, CPA).
                    </p>
                    <button
                      onClick={() => setActiveView('safe-travel')}
                      className="mt-2 text-[10px] font-mono font-black uppercase text-emerald-600 hover:text-emerald-700 dark:text-emerald-450 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      Compare Insurance Plans &rarr;
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookSubmit}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                Proceed to Secure Payment Checkout
              </button>
            </>
          ) : (
            /* Post Booking Complete & Invoice panel */
            <div className="text-center py-6 animate-scale-up">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Check size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Room Booking Completed!</h3>
              <p className="text-xs text-gray-400 font-mono mb-6">Invoice Certificate No: {bookingFinished.invoiceNo}</p>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-5 text-xs text-left max-w-sm mx-auto border border-gray-100 dark:border-slate-800/40 space-y-2.5 mb-6">
                <p className="font-bold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-2">Receipt invoice breaksheet</p>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hotel Spot:</span>
                  <span className="font-bold text-gray-700 dark:text-slate-200">{selectedHotel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Check-In:</span>
                  <span className="font-bold text-gray-700 dark:text-slate-200">{startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total days:</span>
                  <span className="font-bold text-gray-700 dark:text-slate-200">{getDaysCount()} nights</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 dark:border-slate-800 pt-2 text-sm font-extrabold">
                  <span className="text-gray-400">Amount Paid:</span>
                  <span className="text-emerald-600">{(selectedHotel.pricePerNight * getDaysCount()).toLocaleString()} DZD</span>
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
                              body { font-family: sans-serif; padding: 40px; color: #333; }
                              .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px; }
                              .title { font-size: 24px; font-weight: bold; color: #059669; }
                              .details { margin: 30px 0; }
                              .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                              .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; color: #059669; }
                              .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #999; }
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
                  className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <Download size={13} />
                  <span>{t('invoiceBtn')}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedHotel(null);
                    setBookingFinished(null);
                  }}
                  className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-100 animate-fade-in">
          <div className="bg-white dark:bg-[#162231] w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-emerald-50 dark:border-slate-800 animate-scale-up">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-white">Secure Checkout (Stripe powered)</span>
              <button 
                onClick={() => setStripeFormOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] font-mono text-gray-400 mb-1">CREDIT/DEBIT CARD NUMBER</label>
                <input 
                  type="text" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-150 dark:border-slate-800 dark:bg-slate-900 px-3 py-2 text-gray-700 dark:text-slate-200 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-mono text-gray-400 mb-1">EXPIRY DATE (MM / YY)</label>
                  <input 
                    type="text" 
                    placeholder="12 / 29"
                    className="w-full text-xs font-semibold border border-gray-150 dark:border-slate-800 dark:bg-slate-900 px-3 py-2 text-gray-700 dark:text-slate-200 rounded-xl focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-gray-400 mb-1">CVV CODE</label>
                  <input 
                    type="text" 
                    placeholder="391"
                    className="w-full text-xs font-semibold border border-gray-150 dark:border-slate-800 dark:bg-slate-900 px-3 py-2 text-gray-700 dark:text-slate-200 rounded-xl focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/25 border border-emerald-100/30 rounded-xl text-emerald-800 dark:text-emerald-300">
                <span className="block font-bold">Safe SSL encrypted channel</span>
                Amount scheduled: {selectedHotel ? (selectedHotel.pricePerNight * getDaysCount()).toLocaleString() : 0} DZD
              </div>

              <button
                onClick={handlePayConfirm}
                className="w-full py-2.5 bg-emerald-650 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
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
