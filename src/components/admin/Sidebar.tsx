import React from 'react';
import { LayoutDashboard, Plane, Sparkles, Users, BarChart3, FileText, Settings, Flag } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Tours', icon: Plane },
  { name: 'AI Insights', icon: Sparkles },
  { name: 'Users', icon: Users },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Content', icon: FileText },
  { name: 'Settings', icon: Settings },
];

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} bg-[#0F172A] text-[#F8F1E3] border-r border-[#D4A017]/30`}>
      <div className="flex items-center h-20 px-6 border-b border-[#D4A017]/30">
        <Flag className="text-[#D4A017] mr-2" />
        {isOpen && <span className="font-serif font-bold text-xl tracking-wider">RAHALA</span>}
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <a key={item.name} href="#" className="flex items-center px-6 py-4 hover:bg-[#D4A017]/10 transition-colors duration-300">
            <item.icon className="w-6 h-6 text-[#D4A017]" />
            {isOpen && <span className="ml-4 text-sm font-medium tracking-wide">{item.name}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
};
