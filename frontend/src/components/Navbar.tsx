import React from 'react';
import { Sparkles, Search, X } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <header className="w-full bg-[#0d0e12] border-b border-white/10 px-4 md:px-6 py-3 sticky top-0 z-40">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div className="flex items-center">
            <span className="font-bold text-white text-base tracking-tight whitespace-nowrap">
              GenAI Studio
            </span>
            <span className="text-white/30 font-light mx-2 select-none">|</span>
            <span className="text-[#ff2a9d] font-semibold text-sm whitespace-nowrap">
              AI-Powered Creation
            </span>
          </div>
        </div>

        {/* Search Bar matching Image 1 */}
        <div className="relative w-full max-w-xs sm:max-w-sm">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full bg-[#15161c] border border-white/10 hover:border-white/20 focus:border-pink-500 rounded-full pl-9 pr-9 py-1.5 text-sm text-white placeholder-zinc-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-zinc-400 hover:text-white transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
