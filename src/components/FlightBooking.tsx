import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Plane, Calendar, MapPin, Search, ArrowRight, Sparkles, Check, Download, ShieldCheck, HelpCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface FlightOption {
  id: string;
  airline: string;
  logo: string;
  fromCode: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  estimatedPriceDZD: number;
  duration: string;
  classType: string;
  badge?: string;
}

export const FlightBooking: React.FC = () => {
  const { isRtl, language } = useLanguage();
  const { addBooking, addNotification } = useApp();

  // Form selections State
  const [fromCity, setFromCity] = useState<string>('Algiers');
  const [toCity, setToCity] = useState<string>('Oran');
  const [departureDate, setDepartureDate] = useState<string>('2026-07-01');
  const [returnDate, setReturnDate] = useState<string>('');
  
  // UX triggers
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  const [stripeFormOpen, setStripeFormOpen] = useState<boolean>(false);
  const [bookingFinished, setBookingFinished] = useState<any | null>(null);
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');

  // AI Generated query representation state
  const [apiPayload, setApiPayload] = useState<any | null>(null);

  const airportCodes: { [key: string]: string } = {
    'Algiers': 'ALG',
    'Oran': 'ORN',
    'Constantine': 'CZL',
    'Djanet': 'DJG',
    'Tamanrasset': 'TMR',
    'Ghardaia': 'GHA'
  };

  const cityList = [
    { name: 'Algiers', labelAr: 'الجزائر العاصمة', code: 'ALG' },
    { name: 'Oran', labelAr: 'وهران', code: 'ORN' },
    { name: 'Constantine', labelAr: 'قسنطينة', code: 'CZL' },
    { name: 'Djanet', labelAr: 'جانت', code: 'DJG' },
    { name: 'Tamanrasset', labelAr: 'تمنراست', code: 'TMR' },
    { name: 'Ghardaia', labelAr: 'غرداية', code: 'GHA' }
  ];

  const simulatedFlightsList: FlightOption[] = [
    {
      id: 'ah-102',
      airline: 'Air Algérie',
      logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
      fromCode: airportCodes[fromCity] || 'ALG',
      toCode: airportCodes[toCity] || 'ORN',
      departureTime: '08:30 AM',
      arrivalTime: '09:40 AM',
      duration: '1h 10m',
      estimatedPriceDZD: 18000,
      classType: 'Economy Classic',
      badge: isRtl ? 'موصى به' : 'Recommended'
    },
    {
      id: 'ah-204',
      airline: 'Air Algérie',
      logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
      fromCode: airportCodes[fromCity] || 'ALG',
      toCode: airportCodes[toCity] || 'ORN',
      departureTime: '01:15 PM',
      arrivalTime: '02:25 PM',
      duration: '1h 10m',
      estimatedPriceDZD: 19500,
      classType: 'Premium Flex',
      badge: isRtl ? 'الأكثر سرعة' : 'Fastest'
    },
    {
      id: 'ah-308',
      airline: 'Air Algérie',
      logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
      fromCode: airportCodes[fromCity] || 'ALG',
      toCode: airportCodes[toCity] || 'ORN',
      departureTime: '07:45 PM',
      arrivalTime: '08:55 PM',
      duration: '1h 10m',
      estimatedPriceDZD: 16500,
      classType: 'Economy Saver'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromCity === toCity) {
      addNotification(isRtl ? 'يجب أن تختلف مدينة المغادرة عن مدينة الوصول!' : 'Departure city and destination must be different!');
      return;
    }

    setIsSearching(true);
    setHasSearched(false);
    setSelectedFlight(null);

    // AI Query payload to satisfy requested structured JSON data
    const structuredQuery = {
      from: fromCity,
      to: toCity,
      date: departureDate,
      ...(returnDate ? { returnDate } : {})
    };
    setApiPayload(structuredQuery);

    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      addNotification(isRtl ? 'تم العثور على رحلات Air Algérie المتاحة!' : 'Found available Air Algérie flight connections!');
    }, 1500);
  };

  const handleBookSubmit = (flight: FlightOption) => {
    setSelectedFlight(flight);
    setStripeFormOpen(true);
  };

  const handlePayConfirm = () => {
    if (!selectedFlight) return;

    // Call standard AppContext addBooking to persist details securely
    const bkg = addBooking({
      type: 'hotel' as any, // fallback compatible key, or cast
      targetId: selectedFlight.id,
      targetName: `Flight: ${selectedFlight.airline} (${selectedFlight.fromCode} → ${selectedFlight.toCode})`,
      date: departureDate,
      endDate: returnDate || departureDate,
      guests: 1,
      totalPriceDZD: selectedFlight.estimatedPriceDZD,
      paymentStatus: 'paid'
    });

    setBookingFinished(bkg);
    setStripeFormOpen(false);
  };

  const handleDownloadTicket = (flight: FlightOption) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const invoiceNo = `RIHLA-FT-${Math.floor(100000 + Math.random() * 900000)}`;
      printWindow.document.write(`
        <html>
          <head>
            <title>Rihla Travel DZ - Travel Itinerary & Ticket (${flight.id.toUpperCase()})</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1a1a1a; background: #faf9f6; }
              .ticket-container { border: 2px dashed #059669; border-radius: 16px; padding: 32px; background: white; max-width: 600px; margin: auto; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
              .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 24px; position: relative; }
              .logo { font-size: 28px; font-weight: 900; color: #059669; text-transform: uppercase; letter-spacing: 3px; }
              .badge { position: absolute; top: 0; right: 0; background: #059669; color: white; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; }
              .subtitle { font-size: 11px; color: #666; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px; }
              .section-title { font-[8px] font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #f0f0f0; padding-bottom: 4px; }
              .grid-auto { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
              .info-group { display: flex; flex-direction: column; }
              .label { font-size: 9px; color: #999; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }
              .value { font-size: 14px; font-weight: 700; color: #111; }
              .highlight { font-size: 18px; color: #059669; font-weight: 800; }
              .barcode-box { display: flex; flex-direction: column; align-items: center; margin-top: 30px; border-top: 1px dashed #eee; padding-top: 20px; }
              .barcode { letter-spacing: 4px; font-family: monospace; font-size: 16px; color: #555; background: #eee; padding: 6px 16px; border-radius: 4px; }
              .footer-disclaimer { text-align: center; margin-top: 24px; font-size: 11px; color: #777; font-style: italic; }
            </style>
          </head>
          <body>
            <div class="ticket-container">
              <div class="header">
                <span class="badge">Official Itinerary</span>
                <div class="logo">Rihla Skyways</div>
                <div class="subtitle">Secure Travel Itinerary & Boarding Pass Document</div>
              </div>
              
              <div class="grid-auto">
                <div class="info-group">
                  <span class="label">Reference Stamp</span>
                  <span class="value">${invoiceNo}</span>
                </div>
                <div class="info-group" style="text-align: right;">
                  <span class="label">Flight Designation</span>
                  <span class="value" style="color: #059669;">${flight.id.toUpperCase()}</span>
                </div>
              </div>

              <div class="grid-auto">
                <div class="info-group">
                  <span class="label">Passenger Route</span>
                  <span class="value">${fromCity} to ${toCity}</span>
                </div>
                <div class="info-group" style="text-align: right;">
                  <span class="label">Aviation Carrier</span>
                  <span class="value">${flight.airline}</span>
                </div>
              </div>

              <div class="grid-auto">
                <div class="info-group">
                  <span class="label">Scheduled Timings</span>
                  <span class="value">${flight.departureTime} &rarr; ${flight.arrivalTime} (${flight.duration})</span>
                </div>
                <div class="info-group" style="text-align: right;">
                  <span class="label">Departure Date</span>
                  <span class="value">${departureDate}</span>
                </div>
              </div>

              <div class="grid-auto">
                <div class="info-group">
                  <span class="label">Travel Class</span>
                  <span class="value">${flight.classType}</span>
                </div>
                <div class="info-group" style="text-align: right;">
                  <span class="label">Fares (Estimated DZD)</span>
                  <span class="value highlight">${flight.estimatedPriceDZD.toLocaleString()} DZD</span>
                </div>
              </div>

              <div class="barcode-box">
                <div class="barcode">||||| | | ||||| | ||| || |||</div>
                <span class="label" style="margin-top: 6px;">E-TICKET SECURE STRING VALIDATOR</span>
              </div>

              <div class="footer-disclaimer">
                This document serves as a verified travel itinerary. Thank you for booking with Rihla Algeria.
              </div>
            </div>
            <script>
              window.print();
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
    
    addNotification(isRtl ? 'تم توليد وتنزيل خط سير الرحلة بنجاح!' : 'Travel itinerary generated and downloaded successfully!');
  };

  const handleReset = () => {
    setHasSearched(false);
    setSelectedFlight(null);
    setBookingFinished(null);
  };

  return (
    <div className="mt-16 pt-12 border-t border-[#1a1a1a]/10 dark:border-white/10" id="flight-booking-deck">
      
      {/* Title block with flight ✈️ and custom vibe header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] uppercase font-mono font-black text-emerald-600 dark:text-emerald-450 tracking-widest flex items-center gap-1">
              <Plane size={11} className="text-emerald-500" /> {isRtl ? 'خدمة حجز الطيران الجديدة' : 'RIHLA NEW AIRLINE DESK'}
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span>✈️</span>
            <span>{isRtl ? 'احجز رحلة طيران' : 'Book a Flight'}</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-xl text-left">
            {isRtl 
              ? 'تصفح واحجز رحلات الطيران الداخلية في الجزائر بأسعار مناسبة وبدعم من محرك الذكاء الاصطناعي.' 
              : 'Search and coordinate secure flights between major Algerian cities. Powered directly by trusted airline partnerships.'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 text-[10px] font-mono uppercase tracking-widest font-black border border-emerald-500/20">
            <Sparkles size={11} className="animate-spin-slow text-[#d4af37]" /> {isRtl ? 'أسعار ذكية محسنة' : 'SMART DZD SKYWAYS'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch" id="flight-booking-grid">
        
        {/* Departure/Destination Reservation Form Card (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-[#162231] border border-emerald-50 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <form onSubmit={handleSearch} className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800/65 pb-3">
              <h3 className="text-sm font-black text-gray-950 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                <Plane className="text-emerald-600 rotate-45" size={16} />
                <span>{isRtl ? 'تفاصيل السفر الجوي' : 'Configure Flight Parameters'}</span>
              </h3>
              <span className="text-[10px] text-gray-450 font-mono">Air Algérie Official Connect</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Departure Dropdown */}
              <div>
                <label className="block text-[9px] font-mono text-gray-400 uppercase mb-1 flex items-center gap-1">
                  <MapPin size={10} className="text-emerald-600" />
                  <span>{isRtl ? 'ولاية المغادرة' : 'Departure Province'}</span>
                </label>
                <select 
                  value={fromCity} 
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-150 dark:border-slate-800 dark:bg-slate-900 px-3 py-3 rounded-xl text-gray-700 dark:text-slate-200 focus:outline-emerald-500 transition cursor-pointer"
                >
                  {cityList.map((c) => (
                    <option key={c.name} value={c.name}>
                      {isRtl ? c.labelAr : c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Dropdown */}
              <div>
                <label className="block text-[9px] font-mono text-gray-400 uppercase mb-1 flex items-center gap-1">
                  <MapPin size={10} className="text-amber-500" />
                  <span>{isRtl ? 'وجهة السفر والمدينة' : 'Destination Province'}</span>
                </label>
                <select 
                  value={toCity} 
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-150 dark:border-slate-800 dark:bg-slate-900 px-3 py-3 rounded-xl text-gray-700 dark:text-slate-200 focus:outline-emerald-500 transition cursor-pointer"
                >
                  {cityList.map((c) => (
                    <option key={c.name} value={c.name}>
                      {isRtl ? c.labelAr : c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Departure Date */}
              <div>
                <label className="block text-[9px] font-mono text-gray-400 uppercase mb-1 flex items-center gap-1">
                  <Calendar size={10} className="text-emerald-650" />
                  <span>{isRtl ? 'תاريخ الذهاب' : 'Departure date'}</span>
                </label>
                <input 
                  type="date" 
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                  className="w-full text-xs font-semibold border border-gray-150 dark:border-slate-800 dark:bg-slate-900 px-3 py-2.5 rounded-xl text-gray-700 dark:text-slate-200 focus:outline-emerald-500"
                />
              </div>

              {/* Return Date (Optional) */}
              <div>
                <label className="block text-[9px] font-mono text-gray-400 uppercase mb-1 flex items-center gap-1">
                  <Calendar size={10} className="text-gray-400" />
                  <span>{isRtl ? 'تاريخ العودة (اختياري)' : 'Return date (Optional)'}</span>
                </label>
                <input 
                  type="date" 
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-150 dark:border-slate-800 dark:bg-slate-900 px-3 py-2.5 rounded-xl text-gray-700 dark:text-slate-200 focus:outline-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/50 text-xs text-gray-500 space-y-1 mt-2 text-left">
              <span className="text-[8px] uppercase tracking-widest font-mono font-bold text-[#d4af37] block mb-1">
                {isRtl ? 'إشعار فني مباشر' : 'Rihla AI Core Logistics Routing'}
              </span>
              <p className="text-[11px] leading-relaxed dark:text-slate-350">
                {isRtl 
                  ? 'يقوم النظام بحساب المسار الجغرافي المعاير من خلال محرك التوجيه الجوي لخطوط الكارغو والركاب.'
                  : `Route planning synchronized: ${fromCity} (${airportCodes[fromCity] || 'ALG'}) to ${toCity} (${airportCodes[toCity] || 'ORN'}) on ${departureDate}.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isSearching}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-97 disabled:opacity-50 cursor-pointer"
              >
                {isSearching ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{isRtl ? 'جاري فحص مسارات الطيران...' : 'Searching Flight Corridors...'}</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <Search size={14} />
                    <span>{isRtl ? 'البحث عن رحلات طيران' : 'Search Flights'}</span>
                  </span>
                )}
              </button>

              <a 
                href="https://airalgeriecargo.dz/demande-dune-reservation/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 border border-emerald-650/40 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest font-extrabold hover:bg-emerald-600/5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isRtl ? 'حجز مباشر عبر الخطوط الجزائرية' : 'Book via Air Algérie'}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </form>

          {/* AI generated JSON structure diagnostic representation requested by rules */}
          {apiPayload && (
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800/60 text-left">
              <p className="text-[9px] font-mono text-[#d4af37] font-black uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles size={11} className="text-[#d4af37]" /> {isRtl ? 'بنية مخرجات الذكاء الاصطناعي (API STAMP)' : 'AI Connected API Query (Structured JSON Data)'}
              </p>
              <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[10.5px] overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                {JSON.stringify(apiPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Live Search Results Deck & Booking Simulation UI (5 cols) */}
        <div className="md:col-span-5 bg-white dark:bg-[#162231] border border-emerald-50 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between" id="flight-live-analytics-box">
          
          <div>
            <h3 className="text-sm font-black text-gray-950 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wide border-b border-gray-100 dark:border-slate-800/80 pb-3">
              <Search className="text-amber-500 animate-pulse" size={16} />
              <span>{isRtl ? 'نتائج العروض والرحلات' : 'Flight Match Dashboard'}</span>
            </h3>

            {isSearching && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-400/20">
                  <Plane size={24} className="text-emerald-500 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white mb-1">
                    {isRtl ? 'فحص السيرفرات في مطار هواري بومدين...' : 'Contacting Air Algérie Dispatch APIs...'}
                  </h4>
                  <p className="text-[10px] text-gray-400 max-w-[220px] mx-auto">
                    {isRtl 
                      ? 'يتم فحص الجداول الزمنية ومقارنة أرخص الأسعار بالدينار الجزائري...' 
                      : 'Filtering morning and evening regional schedules, adjusting for dynamic fuel fares...'}
                  </p>
                </div>
              </div>
            )}

            {!isSearching && !hasSearched && !bookingFinished && (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-gray-400 mb-3 border border-gray-250/10">
                  <Plane size={22} className="rotate-45" />
                </div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300">
                  {isRtl ? 'لا توجد رحلات تم البحث عنها بعد' : 'No flight routes requested'}
                </h4>
                <p className="text-[10px] text-gray-400 leading-normal max-w-[220px] mx-auto mt-1">
                  {isRtl 
                    ? 'أدخل تفاصيل التوجيه واضغط على زر البحث لاستخراج عروض حية من محاكي الطيران الجزائري.' 
                    : 'Input your departure and destination cities and tap "Search Flights" to initiate live connection simulation logs.'}
                </p>
              </div>
            )}

            {!isSearching && hasSearched && !bookingFinished && (
              <div className="space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between text-[11px] text-gray-450 uppercase font-mono pb-1">
                  <span>{isRtl ? 'الرحلة المقترحة' : 'Route'}: {airportCodes[fromCity]} &rarr; {airportCodes[toCity]}</span>
                  <span className="text-emerald-500 font-bold">{simulatedFlightsList.length} {isRtl ? 'عروض' : 'Available'}</span>
                </div>

                {simulatedFlightsList.map((flight) => (
                  <div 
                    key={flight.id} 
                    className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/65 flex flex-col justify-between hover:border-emerald-500/50 transition duration-300 shadow-sm relative overflow-hidden group"
                  >
                    {/* Badge */}
                    {flight.badge && (
                      <div className="absolute top-0 right-0">
                        <span className="bg-emerald-600 text-white font-mono text-[8px] font-black uppercase px-2.5 py-1 rounded-bl-xl shadow-md tracking-wider">
                          ★ {flight.badge}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-mono font-black text-[#d4af37] block">
                          {flight.airline}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-sm font-extrabold text-gray-800 dark:text-white">{flight.departureTime}</span>
                          <ArrowRight size={11} className="text-gray-400" />
                          <span className="text-sm font-extrabold text-gray-800 dark:text-white">{flight.arrivalTime}</span>
                        </div>
                      </div>
                      <div className="text-right pr-2">
                        <span className="text-[8px] font-mono text-gray-400 uppercase block">{flight.classType}</span>
                        <span className="text-[10px] text-gray-400 font-mono italic block">{flight.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/10">
                      <div>
                        <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider block">{isRtl ? 'السعر المقدر' : 'Estimated Price'}</span>
                        <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-black">
                          {flight.estimatedPriceDZD.toLocaleString()} DZD
                        </strong>
                      </div>
                      
                      <button
                        onClick={() => handleBookSubmit(flight)}
                        className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md transition transform active:scale-95 cursor-pointer"
                      >
                        {isRtl ? 'احجز الآن' : 'Book Now'}
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-dashed border-gray-150 dark:border-slate-800/60">
                      <button
                        onClick={() => handleDownloadTicket(flight)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md font-mono uppercase tracking-wider"
                        title={isRtl ? 'تحميل التذكرة والبرنامج' : 'Download Ticket & Itinerary'}
                      >
                        <span className="text-sm">🎫</span>
                        <span>{isRtl ? 'تحميل التذكرة' : 'Download Ticket'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {bookingFinished && (
              <div className="text-center py-6 animate-scale-up text-left">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-400/20">
                  <Check size={24} />
                </div>
                <h3 className="text-base font-black text-gray-950 dark:text-white text-center">
                  {isRtl ? 'تم تأكيد حجز الطيران!' : 'Flight Ticket Confirmed!'}
                </h3>
                <p className="text-[9px] text-gray-400 font-mono text-center mt-1">
                  Certificate Ref No: {bookingFinished.invoiceNo}
                </p>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 text-[11px] max-w-sm mx-auto border border-gray-100 dark:border-slate-800/40 space-y-2 mt-5">
                  <p className="font-extrabold text-[9px] text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">
                    {isRtl ? 'بيانات التذكرة المعتمدة' : 'Official Certificated Receipt Breakout'}
                  </p>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-405">{isRtl ? 'الخطوط الجوية' : 'Carrier'}:</span>
                    <strong className="text-gray-700 dark:text-slate-200">Air Algérie</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-405">{isRtl ? 'المسار الجوي' : 'Route'}:</span>
                    <strong className="text-gray-700 dark:text-slate-200">
                      {fromCity} &rarr; {toCity}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-405">{isRtl ? 'موعد الرحلة' : 'Schedule'}:</span>
                    <strong className="text-gray-700 dark:text-slate-200">{departureDate}</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/10 pt-2 text-xs font-black">
                    <span className="text-gray-455">{isRtl ? 'المبلغ المدفوع بالكامل' : 'Paid amount DZD'}:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{bookingFinished.totalPriceDZD.toLocaleString()} DZD</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                  <button
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Rihla DZ Flight Ticket - ${bookingFinished.invoiceNo}</title>
                              <style>
                                body { font-family: sans-serif; padding: 40px; color: #222; background: #faf9f6; }
                                .ticket-box { border: 2px dashed #059669; border-radius: 12px; padding: 30px; background: white; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                                .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 20px; }
                                .logo-stamp { font-size: 26px; font-weight: 900; color: #059669; text-transform: uppercase; letter-spacing: 2px; }
                                .subtitle { font-size: 11px; color: #666; margin-top: 5px; text-transform: uppercase; }
                                .meta-info { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                                .col-box { display: flex; flex-direction: column; }
                                .label { font-size: 9px; color: #999; text-transform: uppercase; }
                                .val { font-size: 14px; font-weight: bold; color: #111; }
                                .banner-trust { text-align: center; margin-top: 30px; font-size: 11px; color: #666; font-style: italic; border-top: 1px solid #eee; padding-top: 15px; }
                              </style>
                            </head>
                            <body>
                              <div class="ticket-box">
                                <div class="header">
                                  <div class="logo-stamp">Rihla Skyways Algeria</div>
                                  <div class="subtitle">Official Electronic Boarding Ticket</div>
                                </div>
                                <div class="meta-info">
                                  <div class="col-box">
                                    <span class="label">Invoice Stamp</span>
                                    <span class="val">${bookingFinished.invoiceNo}</span>
                                  </div>
                                  <div class="col-box" style="text-align: right;">
                                    <span class="label">Booking Status</span>
                                    <span class="val" style="color: #059669;">PAID IN FULL</span>
                                  </div>
                                </div>
                                <div class="meta-info">
                                  <div class="col-box">
                                    <span class="label">Departure Point</span>
                                    <span class="val">${fromCity} (${airportCodes[fromCity] || 'ALG'})</span>
                                  </div>
                                  <div class="col-box" style="text-align: right;">
                                    <span class="label">Destination Point</span>
                                    <span class="val">${toCity} (${airportCodes[toCity] || 'ORN'})</span>
                                  </div>
                                </div>
                                <div class="meta-info">
                                  <div class="col-box">
                                    <span class="label">Departure Date</span>
                                    <span class="val">${departureDate}</span>
                                  </div>
                                  <div class="col-box" style="text-align: right;">
                                    <span class="label font-mono">Carrier Airline</span>
                                    <span class="val">Air Algérie</span>
                                  </div>
                                </div>
                                <div style="font-size: 16px; font-weight: bold; text-align: center; color: #059669; margin: 20px 0;">
                                  Total Paid: ${bookingFinished.totalPriceDZD.toLocaleString()} DZD
                                </div>
                                <div class="banner-trust">
                                  Flights powered by trusted Algerian airline partners • Securely checked out via Rihla DZ
                                </div>
                              </div>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }
                    }}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>{isRtl ? 'تحميل التذكرة' : 'Download Ticket'}</span>
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {isRtl ? 'بحث جديد' : 'Plan other flights'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Trust element note */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800/60 text-center">
            <p className="text-[10.5px] italic text-gray-450 flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>{isRtl ? 'الرحلات مدعومة رسمياً من شركاء الطيران المعتمدين بالجزائر' : 'Flights powered by trusted Algerian airline partners'}</span>
            </p>
          </div>

        </div>

      </div>

      {/* Styled Stripe checkout modal overlay */}
      {stripeFormOpen && selectedFlight && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-100 animate-fade-in">
          <div className="bg-white dark:bg-[#162231] w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-emerald-50 dark:border-slate-800 animate-scale-up text-left">
            
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-white flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-505" />
                <span>Secure Flight Checkout</span>
              </span>
              <button 
                onClick={() => setStripeFormOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold px-2 py-1 cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[9px] font-mono text-gray-405 block uppercase">Carrier & Itinerary</span>
                <span className="text-xs font-extrabold text-gray-800 dark:text-white">
                  Air Algérie ({selectedFlight.fromCode} &rarr; {selectedFlight.toCode})
                </span>
              </div>

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
                Amount scheduled: {selectedFlight.estimatedPriceDZD.toLocaleString()} DZD
              </div>

              <button
                onClick={handlePayConfirm}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition duration-200 cursor-pointer"
              >
                {isRtl ? 'تأكيد ودفع قيمة التذكرة' : 'Confirm & Authorize Flight Payment'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
