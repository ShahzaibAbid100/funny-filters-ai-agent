import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  FolderOpen,
  Flame,
  TrendingUp,
  Heart,
  Download,
  Share2,
  Maximize2,
} from 'lucide-react';
import { Preset } from '../data/presets';

interface MainCatalogPageProps {
  presets: Preset[];
  onOpenInnerWorkspace: (preset?: Preset) => void;
  onOpenDetailModal: (preset: Preset) => void;
  favorites: Set<string>;
  onToggleFavorite: (presetId: string) => void;
  onSelectPresetForWorkspace: (preset: Preset) => void;
}

const CATEGORY_TABS = [
  'Effects',
  'Cinematic character scenes',
  'Cartoonify',
  'Anime scenes',
  'Funny filters',
  'Mood edits',
  'Back to school',
  'AI makeover generator',
  'Game style',
];

export const MainCatalogPage: React.FC<MainCatalogPageProps> = ({
  presets,
  onOpenInnerWorkspace,
  onOpenDetailModal,
  favorites,
  onToggleFavorite,
  onSelectPresetForWorkspace,
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState('Funny filters');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<'all' | 'new' | 'popular' | 'trending'>('all');
  const [orientationFilter, setOrientationFilter] = useState<'all' | 'portrait' | 'landscape'>('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');

  const filteredPresets = presets.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategoryTab === 'Funny filters' ||
      activeCategoryTab === 'Effects' ||
      p.tags.some((t) => t.toLowerCase().includes(activeCategoryTab.toLowerCase()));

    const matchesMedia = mediaTypeFilter === 'all' ||
      (mediaTypeFilter === 'image' && p.mediaType === 'image_to_image') ||
      (mediaTypeFilter === 'video' && p.mediaType === 'image_to_video');

    return matchesSearch && matchesCategory && matchesMedia;
  });

  const handleDownload = (e: React.MouseEvent, preset: Preset) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = preset.image;
    link.download = `${preset.id}-full.jpg`;
    link.click();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-white flex flex-col font-sans">
      {/* Upper menu header removed as requested! */}

      {/* Hero Section in Middle (Centered) matching user request */}
      <div className="pt-10 pb-6 px-4 max-w-4xl mx-auto w-full text-center flex flex-col items-center">
        {/* Title centered */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Explore Picsart Gen AI effects
        </h1>

        {/* Subtitle centered */}
        <p className="text-sm sm:text-base text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          Find AI image and video effects for quick edits, creator trends, style changes, and motion-ready looks.
        </p>

        {/* Search Bar centered in middle */}
        <div className="mt-8 w-full max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search funny filters effects"
              className="w-full bg-[#13141a] border border-white/10 hover:border-white/20 focus:border-pink-500 rounded-full pl-11 pr-12 py-3 text-sm text-white placeholder-zinc-400 outline-none transition-all shadow-lg"
            />
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-center gap-3 text-xs text-zinc-400">
            <span>{filteredPresets.length} results found</span>
            <span>·</span>
            <button
              type="button"
              onClick={() => onOpenInnerWorkspace()}
              className="text-[#ff2a9d] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Studio Generator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Sub-Navigation Bar centered */}
      <div className="border-y border-white/10 bg-[#0e0f15]/80 backdrop-blur-md px-4 lg:px-8 py-3 sticky top-0 z-30 overflow-x-auto scrollbar-none">
        <div className="max-w-[1720px] mx-auto flex items-center justify-center gap-6 text-xs sm:text-sm font-medium whitespace-nowrap">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategoryTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCategoryTab(tab)}
                className={`py-1 cursor-pointer transition-colors relative ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#ff2a9d]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body: Left Sidebar Filters + Full Images Grid */}
      <div className="px-4 lg:px-8 py-8 max-w-[1720px] mx-auto w-full flex-1 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-56 shrink-0 space-y-6">
          {/* Collections */}
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2.5">
              COLLECTIONS
            </span>
            <div className="space-y-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setSelectedCollection('all')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  selectedCollection === 'all'
                    ? 'text-white bg-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                <span>My content</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCollection('new')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  selectedCollection === 'new'
                    ? 'text-white bg-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>New Effects</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCollection('popular')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  selectedCollection === 'popular'
                    ? 'text-white bg-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Popular Effects</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCollection('trending')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  selectedCollection === 'trending'
                    ? 'text-white bg-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Trending Effects</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2.5">
              FILTERS
            </span>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Orientation</label>
                <select
                  value={orientationFilter}
                  onChange={(e) => setOrientationFilter(e.target.value as any)}
                  className="w-full bg-[#14151b] border border-white/10 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-pink-500 cursor-pointer"
                >
                  <option value="all">All orientations</option>
                  <option value="portrait">Portrait (3:4)</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Media type</label>
                <select
                  value={mediaTypeFilter}
                  onChange={(e) => setMediaTypeFilter(e.target.value as any)}
                  className="w-full bg-[#14151b] border border-white/10 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-pink-500 cursor-pointer"
                >
                  <option value="all">All media types</option>
                  <option value="image">Image effect</option>
                  <option value="video">Video effect</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content Area: ONLY FULL IMAGES GRID matching Image 3! */}
        <main className="flex-1 w-full min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredPresets.map((preset) => {
              const isFav = favorites.has(preset.id);
              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectPresetForWorkspace(preset)}
                  className="group relative rounded-2xl overflow-hidden bg-[#121319] border border-white/10 hover:border-pink-500/60 transition-all duration-200 cursor-pointer aspect-[3/4] flex flex-col justify-end shadow-md hover:shadow-2xl"
                >
                  {/* FULL IMAGE */}
                  <img
                    src={preset.image}
                    alt={preset.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover Quick Actions */}
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(preset.id);
                      }}
                      className={`w-7 h-7 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors cursor-pointer ${
                        isFav
                          ? 'bg-pink-600 text-white'
                          : 'bg-black/60 hover:bg-black/80 text-white'
                      }`}
                      title="Favorite"
                      aria-label="Favorite"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDownload(e, preset)}
                      className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Download"
                      aria-label="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Share"
                      aria-label="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetailModal(preset);
                      }}
                      className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="View details"
                      aria-label="View details"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Hover "Use this effect" Overlay Button */}
                  <div className="absolute inset-x-3 bottom-12 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPresetForWorkspace(preset);
                      }}
                      className="w-full btn-primary-gradient py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-lg border border-white/20 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-white" />
                      <span>Use this effect</span>
                    </button>
                  </div>

                  {/* Dark gradient bottom scrim with title */}
                  <div className="relative z-10 p-3 pt-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
                    <p className="text-white font-bold text-xs sm:text-sm drop-shadow truncate">
                      {preset.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Footer removed as requested! */}
    </div>
  );
};
