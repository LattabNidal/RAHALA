import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, Car, Phone, ShieldCheck, DollarSign, Clock, Check, ArrowRight, Star } from 'lucide-react';
import { FlightBooking } from './FlightBooking';
import { TransportProviders } from './TransportProviders';
import { PriceTag } from './rahala/PriceTag';

export const TaxiBooking: React.FC = () => {
  const { t } = useLanguage();
  const { activeTaxiRide, setActiveTaxiRide, triggerMockTaxiRideProgress } = useApp();

  const [pickup, setPickup] = useState('Houari Boumediene Airport (ALG) Terminal 1');
  const [destination, setDestination] = useState('Hotel El Aurassi (Algiers Center)');
  const [isOrdering, setIsOrdering] = useState(false);

  const popularDestinations = [
    { name: 'Hotel El Aurassi (Algiers Center)', price: 950 },
    { name: 'The Casbah historical alleys', price: 1200 },
    { name: 'Sidi M’Cid Suspension Gorges (Constantine)', price: 3500 },
    { name: 'Santa Cruz church lookout (Oran)', price: 2800 },
    { name: 'Djanet Dunes Sunset Camp (Sahara)', price: 4500 }
  ];

  const handleCreateOrder = () => {
    setIsOrdering(true);
    
    // Find expected pricing based on custom selection matching
    const match = popularDestinations.find(p => p.name === destination);
    const estCost = match ? match.price : Math.floor(1000 + Math.random() * 1800);

    const freshRide = {
      id: `taxi-${Math.floor(Math.random() * 90000 + 10000)}`,
      pickup,
      destination,
      priceDZD: estCost,
      status: 'searching' as const,
      estimatedMinutes: 10,
      polyline: []
    };

    setActiveTaxiRide(freshRide);
    triggerMockTaxiRideProgress(freshRide.id);

    setTimeout(() => {
      setIsOrdering(false);
    }, 1500);
  };

  const handleCancel = () => {
    setActiveTaxiRide(null);
  };

  return (
    <div className="py-6 sm:py-10 max-w-4xl mx-auto px-4" id="taxi-booking-console">
      
      {/* Upper Title block */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#334155]">
          {t('taxiTitle')}
        </h1>
        <p className="mt-3 text-xs text-[#94A3B8]">
          {t('taxiSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Reservation Dispatcher - 7 Columns */}
        <div className="md:col-span-7 bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          
          <div>
            <h3 className="text-base font-bold text-[#334155] mb-6 flex items-center space-x-2 space-x-reverse">
              <Car className="text-[#3B82F6]" size={18} />
              <span>Route directions Dispatcher</span>
            </h3>

            <div className="space-y-4 mb-6 relative">
              {/* Connecting line spacer visually decoration */}
              <div className="absolute top-10 left-3.5 w-0.5 h-12 bg-dashed border-l-2 border-[#E2E8F0]"></div>

              <div>
                <label className="block text-[9px] font-mono text-[#94A3B8] uppercase mb-1 flex items-center space-x-1 space-x-reverse">
                  <MapPin size={10} className="text-[#3B82F6]" />
                  <span>Your Pickup Point</span>
                </label>
                <input 
                  type="text" 
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full text-xs font-semibold border border-[#E2E8F0] px-4 py-3 rounded-xl text-[#334155] focus:outline-[#3B82F6] bg-white"
                  placeholder="Enter starting street or airport name..."
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-[#94A3B8] uppercase mb-1 flex items-center space-x-1 space-x-reverse">
                  <MapPin size={10} className="text-[#FDBA74]" />
                  <span>Target Destination Landmark</span>
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs font-semibold border border-[#E2E8F0] px-3 py-3 rounded-xl text-[#334155] focus:outline-[#3B82F6] bg-white"
                >
                  {popularDestinations.map((dest, id) => (
                    <option key={id} value={dest.name}>{dest.name} ({dest.price} DZD)</option>
                  ))}
                  <option value="custom">Other custom destination (Estimator calculates)</option>
                </select>
              </div>
            </div>

            {/* Price Estimator summary */}
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-xs mb-6 space-y-1.5 text-[#94A3B8]">
              <div className="flex justify-between">
                <span>Vetted City Transit Grade:</span>
                <span className="font-bold text-[#334155]">Rihla Premium Companion VIP</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Base Rate cost:</span>
                <PriceTag amount={250} className="text-[#334155]!" />
              </div>
              <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-2 text-sm font-extrabold text-[#334155] tabular-nums">
                <span>Estimated cost DZD:</span>
                <PriceTag amount={popularDestinations.find(p => p.name === destination)?.price || 1500} className="text-[#3B82F6] font-bold text-base" />
              </div>
            </div>
          </div>

          {!activeTaxiRide ? (
            <button
              onClick={handleCreateOrder}
              disabled={isOrdering}
              className="w-full py-3 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isOrdering ? 'Dispatching driver...' : 'Order Rihla Vetted Car Now'}
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="w-full py-3 bg-red-50 text-red-650 hover:bg-red-100 rounded-xl text-xs font-bold transition cursor-pointer border border-red-150"
            >
              Cancel Travel Ride Reservation
            </button>
          )}

        </div>

        {/* Live Tracking Simulator - 5 Columns */}
        <div className="md:col-span-5 bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          
          <div>
            <h3 className="text-base font-bold text-[#334155] mb-4 flex items-center space-x-2 space-x-reverse">
              <Clock className="text-[#FDBA74] animate-pulse" size={18} />
              <span>Dispatcher Center Telemetry</span>
            </h3>

            {activeTaxiRide ? (
              <div className="space-y-6">
                
                {/* Horizontal status flow indicator */}
                <div className="bg-[#F8FAFC] p-4 border border-[#E2E8F0] rounded-2xl">
                  <span className="block text-[8px] font-mono text-[#94A3B8] uppercase tracking-widest mb-2">Progress log</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeTaxiRide.status ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <span className="text-[11px] font-bold text-[#334155] capitalize">
                      State: {activeTaxiRide.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#94A3B8] mt-1 leading-normal">
                    {activeTaxiRide.status === 'searching' && 'Analyzing coordinates for nearest available drivers...'}
                    {activeTaxiRide.status === 'assigned' && 'Driver found! Mohamed Kassimi is heading to pickup point.'}
                    {activeTaxiRide.status === 'ongoing' && 'Transit active. Enjoy safety standards inside Algeria.'}
                    {activeTaxiRide.status === 'completed' && 'Destination reached successfully. Thank you for traveling with Rihla DZ.'}
                  </p>
                </div>

                {/* Driver information */}
                {activeTaxiRide.driverName && (
                  <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-xs text-[#334155] space-y-2 animate-fade-in">
                    <p className="font-extrabold text-[10px] text-[#3B82F6] uppercase tracking-widest">vetted local chauffeur</p>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-bold shrink-0">MK</div>
                      <div>
                        <h4 className="font-bold text-[#334155] text-xs">{activeTaxiRide.driverName}</h4>
                        <span className="text-[9.5px] text-[#94A3B8]">{activeTaxiRide.driverCar}</span>
                      </div>
                    </div>
                    <div className="border-t border-[#E2E8F0] pt-2 mt-2 space-y-1 text-[10.5px]">
                      <p className="flex justify-between"><span>Contact:</span><strong className="text-[#334155]">{activeTaxiRide.driverPhone}</strong></p>
                      <p className="flex justify-between"><span>Authority Badge:</span><strong className="text-blue-600 flex items-center space-x-1"><ShieldCheck size={12} /><span>Algeria Vetted</span></strong></p>
                      {activeTaxiRide.estimatedMinutes > 0 && (
                        <p className="text-center font-bold text-[#3B82F6] animate-pulse mt-2 pt-1 border-t border-[#E2E8F0]/50">Arriving in approx {activeTaxiRide.estimatedMinutes} mins</p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-[#F8FAFC] rounded-full flex items-center justify-center text-[#94A3B8] mx-auto mb-3">
                  <Car size={20} />
                </div>
                <p className="text-xs text-[#94A3B8] leading-normal max-w-[200px] mx-auto">No dispatched cab routes scheduled. Input coordinates and submit to launch real-time simulation tracking.</p>
              </div>
            )}

          </div>

          <div className="p-4 bg-amber-50/50 rounded-2xl border border-[#FDBA74]/30 text-[10.5px] text-amber-800 leading-relaxed mt-6">
            <strong>⚠️ Route Notice:</strong> Taxi tracking updates automatically in real-time intervals. You can also monitor your dynamic location marker on the interactive Algeria map component.
          </div>

        </div>

      </div>

      {/* Flight Booking Section placed below the Taxi & Routing System */}
      <FlightBooking />

      {/* Verified Algerian Transport Providers Hub */}
      <TransportProviders />

    </div>
  );
};
