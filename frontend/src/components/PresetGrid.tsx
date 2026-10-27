import React from 'react';
import { LayoutGrid, Images, Heart, Download, Share2, Maximize2 } from 'lucide-react';
import { Preset, PRESET_CATEGORIES } from '../data/presets';

interface PresetGridProps {
  activeTab: 'presets' | 'creations';
  onTabChange: (tab: 'presets' | 'creations') => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  presets: Preset[];
  selectedPresetId: string;
  onSelectPreset: (preset: Preset) => void;
  onOpenDetailModal: (preset: Preset) => void;
  favorites: Set<string>;
  onToggleFavorite: (presetId: string) => void;
  creationsCount: number;
}

export const PresetGrid: React.FC<PresetGridProps> = ({
  activeTab,
  onTabChange,
  selectedCategory,
  onCategoryChange,
  presets,
  selectedPresetId,
  onSelectPreset,
  onOpenDetailModal,
  favorites,
  onToggleFavorite,
  creationsCount,
}) => {
  const activeCategoryObj =
    PRESET_CATEGORIES.find((c) => c.id === selectedCategory) || PRESET_CATEGORIES[0];

  const handleDownload = (e: React.MouseEvent, preset: Preset) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = preset.image;
    link.download = `${preset.id}-preview.jpg`;
    link.click();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-5">
      {/* Top Mode Tabs matching Image 1: Presets and My Creations */}
      <div className="flex items-center gap-6 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => onTabChange('presets')}
          className={`flex items-center gap-2 pb-1 text-sm font-semibold transition-colors cursor-pointer relative ${
            activeTab === 'presets'
              ? 'text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4 text-[#ff2a9d]" />
          <span>Presets</span>
          {activeTab === 'presets' && (
            <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#ff2a9d]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('creations')}
          className={`flex items-center gap-2 pb-1 text-sm font-semibold transition-colors cursor-pointer relative ${
            activeTab === 'creations'
              ? 'text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Images className="w-4 h-4 text-zinc-400" />
          <span>My Creations</span>
          {creationsCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#ff2a9d]/20 text-[#ff2a9d] text-xs font-bold">
              {creationsCount}
            </span>
          )}
          {activeTab === 'creations' && (
            <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#ff2a9d]" />
          )}
        </button>
      </div>

      {activeTab === 'presets' && (
        <>
          {/* Horizontal Category Filter Pills matching Image 1 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#252630] text-white shadow-sm border border-white/15'
                      : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Section Heading in bright pink/magenta font */}
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#ff2a9d]">
              {activeCategoryObj.name.toUpperCase()}
            </h2>
            <span className="text-xs text-zinc-400">
              {presets.length} results
            </span>
          </div>

          {/* Grid of Preset Cards matching Image 1 & Image 3 */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {presets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              const isFav = favorites.has(preset.id);

              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`group relative rounded-2xl overflow-hidden bg-[#13141a] border transition-all duration-200 cursor-pointer aspect-[3/4] flex flex-col justify-end ${
                    isSelected
                      ? 'border-pink-500 ring-2 ring-pink-500/30 shadow-lg shadow-pink-500/10'
                      : 'border-white/10 hover:border-white/25 hover:shadow-xl'
                  }`}
                >
                  {/* Preset Background Image */}
                  <img
                    src={preset.image}
                    alt={preset.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Top Floating Action Icons visible on hover */}
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(preset.id);
                      }}
                      className={`w-7 h-7 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors ${
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
                      className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-colors"
                      title="Download"
                      aria-label="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-colors"
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
                      className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-colors"
                      title="View details"
                      aria-label="View details"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Gradient Scrim & Bottom Title */}
                  <div className="relative z-10 p-3 pt-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-bold text-xs sm:text-sm drop-shadow-md truncate">
                        {preset.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
