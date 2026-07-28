import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { StatsOverview } from './StatsOverview';
import { BookingsTable } from './BookingsTable';
import { AiInsightsPanel } from './AiInsightsPanel';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-8 font-sans">
          <div className="bg-white p-10 rounded-[2rem] mb-10 border border-slate-200 shadow-sm">
            <h1 className="text-5xl font-bold text-slate-800 tracking-tight">Bienvenue sur Rahala Admin</h1>
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
