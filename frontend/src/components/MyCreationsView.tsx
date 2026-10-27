import React from 'react';
import { Download, Trash2, Share2, Sparkles, Plus } from 'lucide-react';

export interface GeneratedCreation {
  id: string;
  presetTitle: string;
  presetId: string;
  imageUrl: string;
  mediaType?: 'image_to_image' | 'image_to_video';
  createdAt: string;
}

interface MyCreationsViewProps {
  creations: GeneratedCreation[];
  onDeleteCreation: (id: string) => void;
  onExplorePresets: () => void;
}

export const MyCreationsView: React.FC<MyCreationsViewProps> = ({
  creations,
  onDeleteCreation,
  onExplorePresets,
}) => {
  const handleDownload = (imageUrl: string, title: string, mediaType?: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `genai-${title.toLowerCase().replace(/\s+/g, '-')}.${mediaType === 'image_to_video' ? 'mp4' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleShare = (imageUrl: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my GenAI creation!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (creations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center border border-white/5 rounded-2xl bg-[#13141a]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/30 via-pink-600/30 to-fuchsia-600/30 border border-white/10 flex items-center justify-center text-pink-400 mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No creations yet</h3>
        <p className="text-sm text-zinc-400 max-w-md mb-6">
          Upload a photo on the left, pick any funny filter effect, and hit Generate to see your personalized AI creations here!
        </p>
        <button
          type="button"
          onClick={onExplorePresets}
          className="btn-primary-gradient px-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 border border-white/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Explore Funny Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#ff2a9d]">
          YOUR SAVED CREATIONS ({creations.length})
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {creations.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-[#13141a] border border-white/10 hover:border-pink-500/50 transition-all duration-200 aspect-[3/4] flex flex-col justify-end"
          >
            {item.mediaType === 'image_to_video' ? (
              <video
                src={item.imageUrl}
                controls
                preload="metadata"
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            ) : (
              <img
                src={item.imageUrl}
                alt={item.presetTitle}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}

            {/* Quick Actions */}
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleDownload(item.imageUrl, item.presetTitle, item.mediaType)}
                className="w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors"
                title="Download full HD"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleShare(item.imageUrl)}
                className="w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors"
                title="Share creation"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteCreation(item.id)}
                className="w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                title="Delete creation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Scrim */}
            <div className="relative z-10 p-3 pt-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
              <p className="text-white font-bold text-xs sm:text-sm drop-shadow truncate">
                {item.presetTitle}
              </p>
              <span className="text-[10px] text-zinc-400">
                {item.createdAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
