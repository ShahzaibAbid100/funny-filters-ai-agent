import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Download, Share2, Sparkles } from 'lucide-react';
import { Preset } from '../data/presets';

interface DetailModalProps {
  preset: Preset | null;
  onClose: () => void;
  onSelectEffect: (preset: Preset) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFavorite: boolean;
  onToggleFavorite: (presetId: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  preset,
  onClose,
  onSelectEffect,
  onPrevious,
  onNext,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!preset) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = preset.image;
    link.download = `${preset.id}-preview.jpg`;
    link.click();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-preset-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="relative w-full max-w-5xl bg-[#0e0f14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button at top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close modal"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Large vertical media preview with prev/next arrows */}
        <div className="relative flex-1 bg-black/80 flex items-center justify-center overflow-hidden min-h-[360px] md:min-h-[560px]">
          {/* Navigation Arrows */}
          <button
            onClick={onPrevious}
            className="absolute left-3 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Previous effect"
            aria-label="Previous effect"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={onNext}
            className="absolute right-3 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Next effect"
            aria-label="Next effect"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Top-Right Quick Actions floating on preview */}
          <div className="absolute top-4 right-4 md:right-auto md:left-4 z-20 flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(preset.id)}
              className={`w-9 h-9 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-pink-600 text-white'
                  : 'bg-black/60 hover:bg-black/90 text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={handleDownload}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Download preview"
              aria-label="Download preview"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer relative"
              title="Share effect"
              aria-label="Share effect"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black px-2 py-0.5 rounded text-[10px] text-pink-400 whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>

          {/* Main Preview Image */}
          <img
            src={preset.image}
            alt={preset.title}
            className="max-h-[540px] w-auto max-w-full object-contain p-4 shadow-2xl"
          />
        </div>

        {/* Right Side: Info Panel matching Image 2 */}
        <div className="w-full md:w-[360px] lg:w-[400px] p-6 flex flex-col justify-between bg-[#111218] border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
          <div>
            <h2 id="modal-preset-title" className="text-2xl font-bold text-white tracking-tight">
              {preset.title}
            </h2>

            <div className="mt-3 text-sm text-zinc-300 leading-relaxed">
              <p className={isExpanded ? '' : 'line-clamp-3'}>
                {preset.description}
              </p>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 font-semibold text-white hover:text-pink-400 text-xs transition-colors"
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </button>
            </div>

            {/* Primary CTA Button matching Image 2 & Image 4 */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  onSelectEffect(preset);
                  onClose();
                }}
                className="w-full btn-primary-gradient py-3.5 px-6 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 border border-white/20 shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Try this effect</span>
              </button>
            </div>
          </div>

          {/* Tags & Metadata */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-4 text-xs">
            <div>
              <span className="text-zinc-400 block mb-2 font-medium">Tags</span>
              <div className="flex flex-wrap gap-2">
                {preset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#1c1d25] border border-white/10 text-zinc-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-zinc-300 pt-2">
              <span className="text-zinc-400 font-medium">Type</span>
              <span className="font-semibold text-white">{preset.type}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-zinc-400 font-medium">Cost</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                {preset.credits} credits
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
