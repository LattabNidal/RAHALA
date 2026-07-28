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
    <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} bg-white text-slate-700 border-r border-slate-200`}>
      <div className="flex items-center h-20 px-6 border-b border-slate-200">
        <Flag className="text-emerald-700 mr-2" />
        {isOpen && <span className="font-sans font-bold text-xl tracking-wider">RAHALA</span>}
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <a key={item.name} href="#" className="flex items-center px-6 py-4 hover:bg-emerald-50 transition-colors duration-300">
            <item.icon className="w-6 h-6 text-emerald-700" />
            {isOpen && <span className="ml-4 text-sm font-medium tracking-wide font-sans">{item.name}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
};
