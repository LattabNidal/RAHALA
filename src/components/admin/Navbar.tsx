import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

export const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:bg-gray-100 rounded">
        <Menu />
      </button>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C19A6B]" />
        </div>
        <Bell className="text-gray-600 cursor-pointer" />
        <div className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer" />
      </div>
    </header>
  );
};
