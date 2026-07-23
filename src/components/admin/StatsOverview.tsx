import React from 'react';
import { Users, Plane, Sparkles, DollarSign, MapPin } from 'lucide-react';

const stats = [
  { title: 'Total Visitors', value: '12,345', icon: Users, trend: '↑12%' },
  { title: 'Tours Booked', value: '1,234', icon: Plane, trend: '↑5%' },
  { title: 'AI Queries', value: '8,901', icon: Sparkles, trend: '↑20%' },
  { title: 'Revenue (DA)', value: '5,678,901', icon: DollarSign, trend: '↑8%' },
  { title: 'Popular Destination', value: 'Sahara', icon: MapPin, trend: '' },
];

export const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.title} className="relative overflow-hidden bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-3xl border border-[#D4A017]/20 hover:border-[#D4A017]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4A017]/10 group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-[#D4A017]/10 text-[#D4A017] rounded-xl backdrop-blur-sm">
              <stat.icon size={20} />
            </div>
            {stat.trend && <span className="text-[#C19A6B] font-bold text-[10px] tracking-[0.2em] uppercase">{stat.trend}</span>}
          </div>
          <h3 className="text-[#F8F1E3]/50 text-[10px] uppercase tracking-[0.2em] font-medium relative z-10">{stat.title}</h3>
          <p className="text-3xl font-serif font-medium text-[#F8F1E3] mt-2 relative z-10">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
