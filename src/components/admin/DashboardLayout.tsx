import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { StatsOverview } from './StatsOverview';
import { BookingsTable } from './BookingsTable';
import { AiInsightsPanel } from './AiInsightsPanel';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-8">
          <div className="bg-gradient-to-r from-[#D4A017]/20 to-[#C19A6B]/10 p-10 rounded-[2rem] mb-10 border border-[#D4A017]/30 shadow-2xl">
            <h1 className="text-5xl font-serif font-bold text-[#F8F1E3] tracking-tight">Bienvenue sur Rahala Admin</h1>
          </div>
          <StatsOverview />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BookingsTable />
            <AiInsightsPanel />
          </div>
        </main>
      </div>
    </div>
  );
};
