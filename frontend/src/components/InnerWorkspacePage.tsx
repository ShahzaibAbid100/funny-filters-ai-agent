import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Search,
  X,
  Upload,
  Check,
  Loader2,
  LayoutGrid,
  Images,
  Heart,
  Download,
  Share2,
  Maximize2,
  PlusCircle,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { Preset, PRESET_CATEGORIES, SAMPLE_FACES } from '../data/presets';
import { GeneratedCreation, MyCreationsView } from './MyCreationsView';

interface InnerWorkspacePageProps {
  viewMode: 'gallery' | 'detail';
  onBackToFilters: () => void;
  activePreset: Preset;
  onSelectPreset: (preset: Preset) => void;
  presets: Preset[];
  onBackToMain: () => void;
  onOpenDetailModal: (preset: Preset) => void;
  favorites: Set<string>;
  onToggleFavorite: (presetId: string) => void;
  userPhoto: string | null;
  onUserPhotoChange: (photoUrl: string | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationProgress: number;
  generationPhase: string | null;
  generationError: string | null;
  extraPrompt: string;
  onExtraPromptChange: (text: string) => void;
  myCreations: GeneratedCreation[];
  onDeleteCreation: (id: string) => void;
  onResetWorkspace: () => void;
}

export const InnerWorkspacePage: React.FC<InnerWorkspacePageProps> = ({
  viewMode,
  onBackToFilters,
  activePreset,
  onSelectPreset,
  presets,
  onBackToMain,
  onOpenDetailModal,
  favorites,
  onToggleFavorite,
  userPhoto,
  onUserPhotoChange,
  onGenerate,
  isGenerating,
  generationProgress,
  generationPhase,
  generationError,
  extraPrompt,
  onExtraPromptChange,
  myCreations,
  onDeleteCreation,
  onResetWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'creations'>('presets');
  const latestCreation = myCreations.find((creation) => creation.presetId === activePreset.id);
  const [selectedCategory, setSelectedCategory] = useState('funny-filters');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPresets = presets.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      (selectedCategory === 'funny-filters' && p.tags.includes('funny-filters')) ||
      (selectedCategory === 'image-to-video' && p.mediaType === 'image_to_video') ||
      (selectedCategory === 'dance-generator' && p.mediaType === 'image_to_video');

    return matchesSearch && matchesCat;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUserPhotoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onUserPhotoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col font-sans">
      {/* Top Bar matching Image 1 */}
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

          {/* Right Action Area with Search, Create New, and Close (X) button from Image 1 */}
          <div className="flex items-center gap-3">
            {/* Create New Button */}
            <button
              type="button"
              onClick={onResetWorkspace}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
              title="Start a new creation"
            >
              <PlusCircle className="w-3.5 h-3.5 text-pink-400" />
              <span>Create New</span>
            </button>

            {/* Search Input matching Image 1 */}
            <div className="relative w-44 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-[#15161c] border border-white/10 hover:border-white/20 focus:border-pink-500 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder-zinc-400 outline-none transition-all"
              />
            </div>

            {/* Prominent Close (X) button from Image 1 right top */}
            <button
              type="button"
              onClick={onBackToMain}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              title="Close and return to gallery"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Gallery and dedicated filter page use the same original controls and styling. */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 md:p-6">
        {viewMode === 'detail' && (
          <div className="max-w-[680px] mx-auto mb-5">
            <button
              type="button"
              onClick={onBackToFilters}
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to filters
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{activePreset.title}</h1>
            <p className="text-sm text-zinc-400 mt-1">Upload your photo, customize the effect and generate.</p>
          </div>
        )}
        <div className={viewMode === 'detail' ? 'flex flex-col items-center gap-6' : 'w-full'}>
          {/* All original generator controls now appear only on the dedicated filter page. */}
          {viewMode === 'detail' && (
          <section className="w-full max-w-[680px]">
            <div className="bg-[#14151b] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
              {/* Header with Preset name and Reset/New option */}
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Selected Filter
                </span>
                <button
                  type="button"
                  onClick={onResetWorkspace}
                  className="flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-300 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset / New</span>
                </button>
              </div>

              {/* Top Preview Card with ambient blur background like Image 1 */}
              <div className="relative w-full h-[230px] rounded-xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center">
                {/* Ambient blurred backdrop */}
                <img
                  src={activePreset.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-40"
                />

                {/* Crisp centered preview image */}
                <img
                  src={activePreset.image}
                  alt={activePreset.title}
                  className="relative z-10 h-full w-auto max-w-full object-contain mx-auto shadow-2xl"
                />

                {/* Dark bottom scrim and title overlay */}
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8">
                  <h3 className="text-white font-bold text-sm sm:text-base drop-shadow-md">
                    {activePreset.title}
                  </h3>
                </div>
              </div>

              {/* Preset Description */}
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activePreset.description}
              </p>

              {/* File Attached Upload Dropzone */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                {userPhoto ? (
                  <div className="relative rounded-xl border border-pink-500/40 bg-[#1a1b24] p-3 flex items-center gap-3">
                    <img
                      src={userPhoto}
                      alt="Attached file"
                      className="w-14 h-14 rounded-lg object-cover border border-white/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>File Attached</span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        Target: {activePreset.title}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] text-pink-400 hover:text-pink-300 underline mt-1"
                      >
                        Change photo
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUserPhotoChange(null)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                      title="Remove attached file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-xl border border-dashed transition-all p-5 flex flex-col items-center justify-center text-center cursor-pointer ${
                      isDragging
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-white/15 bg-[#181921] hover:bg-[#1d1e28] hover:border-white/25'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 mb-2.5">
                      <Upload className="w-5 h-5 text-zinc-300" />
                    </div>
                    <p className="text-sm font-semibold text-white">Upload your photo</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Upload from device, Drive, or Canvas
                    </p>
                  </div>
                )}

                {/* Quick sample portraits selector */}
                <div className="mt-2.5">
                  <span className="text-[11px] text-zinc-400 block mb-1.5">
                    Or try a sample face:
                  </span>
                  <div className="flex items-center gap-2">
                    {SAMPLE_FACES.map((face) => (
                      <button
                        key={face.id}
                        type="button"
                        onClick={() => onUserPhotoChange(face.url)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#1f202b] hover:bg-[#272937] border border-white/5 text-xs text-zinc-300 transition-colors"
                        title={`Use sample face ${face.label}`}
                      >
                        <img
                          src={face.url}
                          alt={face.label}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{face.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional instructions passed to FastAPI + LangGraph */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="custom-generation-prompt" className="text-xs font-semibold text-zinc-200">
                  Custom prompt <span className="text-zinc-500 font-normal">(optional)</span>
                </label>
                <textarea
                  id="custom-generation-prompt"
                  value={extraPrompt}
                  onChange={(event) => onExtraPromptChange(event.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Describe the funny details you want to add..."
                  className="w-full bg-[#181921] border border-white/15 focus:border-pink-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none resize-y"
                />
                <p className="text-right text-[10px] text-zinc-500">{extraPrompt.length}/500</p>
              </div>

              {/* Primary CTA Button matching Image 4 specifically */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="w-full btn-primary-gradient py-3.5 px-6 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 border border-white/20 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{generationPhase === 'checking' ? 'Checking filter...' : generationPhase === 'uploading' ? 'Uploading image...' : generationPhase === 'queued' ? 'Waiting in queue...' : 'Generating...'}</span>
                    </>
                  ) : (
                    <>
                      <span>Generate</span>
                      <span className="flex items-center gap-1 text-white/95">
                        <Sparkles className="w-4 h-4 fill-white" />
                        <span>{activePreset.credits}</span>
                      </span>
                    </>
                  )}
                </button>

                {isGenerating && (
                  <div className="w-full bg-black/40 rounded-full h-1.5 mt-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {generationError && (
                <div role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 whitespace-pre-wrap">
                  {generationError}
                </div>
              )}

              {/* Footer Disclaimer */}
              <p className="text-[11px] text-zinc-400 text-center leading-normal">
                By generating, you agree to our{' '}
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('GenAI Studio Terms of Service');
                  }}
                  className="text-[#ff2a9d] hover:underline"
                >
                  Terms
                </a>{' '}
                and{' '}
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('GenAI Studio Privacy Policy');
                  }}
                  className="text-[#ff2a9d] hover:underline"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </section>
          )}

          {/* Show the generated result right on the filter detail page. */}
          {viewMode === 'detail' && latestCreation && (
            <section className="w-full max-w-[680px] bg-[#14151b] border border-white/10 rounded-2xl p-4 shadow-xl">
              <div className="flex justify-between items-center mb-3 gap-3">
                <h2 className="text-sm font-bold text-white">Latest creation</h2>
                <a href={latestCreation.imageUrl} download={`funny-${activePreset.id}.${latestCreation.mediaType === 'image_to_video' ? 'mp4' : 'png'}`}
                  className="text-xs text-pink-400 underline hover:text-pink-300">Download result</a>
              </div>
              {latestCreation.mediaType === 'image_to_video' ? (
                <video src={latestCreation.imageUrl} controls className="w-full max-h-[520px] object-contain rounded-xl bg-black" />
              ) : (
                <img src={latestCreation.imageUrl} alt={`Generated ${activePreset.title}`} className="w-full max-h-[520px] object-contain rounded-xl bg-black" />
              )}
            </section>
          )}

          {/* The filter grid stays on the gallery; it no longer shares a page with generation controls. */}
          {viewMode === 'gallery' && (
          <div className="flex-1 min-w-0 flex flex-col gap-5 w-full">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-6 border-b border-white/10 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
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
                onClick={() => setActiveTab('creations')}
                className={`flex items-center gap-2 pb-1 text-sm font-semibold transition-colors cursor-pointer relative ${
                  activeTab === 'creations'
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Images className="w-4 h-4 text-zinc-400" />
                <span>My Creations</span>
                {myCreations.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#ff2a9d]/20 text-[#ff2a9d] text-xs font-bold">
                    {myCreations.length}
                  </span>
                )}
                {activeTab === 'creations' && (
                  <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#ff2a9d]" />
                )}
              </button>
            </div>

            {activeTab === 'presets' ? (
              <>
                {/* Horizontal Category Filter Pills matching Image 1 */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {PRESET_CATEGORIES.map((category) => {
                    const isActive = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
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

                {/* Section Heading in bright pink font */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#ff2a9d]">
                    FUNNY FILTERS
                  </h2>
                  <span className="text-xs text-zinc-400">
                    {filteredPresets.length} effects
                  </span>
                </div>

                {/* Grid of Preset Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {filteredPresets.map((preset) => {
                    const isSelected = activePreset.id === preset.id;
                    const isFav = favorites.has(preset.id);

                    return (
                      <div
                        key={preset.id}
                        onClick={() => onSelectPreset(preset)}
                        className={`group relative rounded-2xl overflow-hidden bg-[#13141a] border transition-all duration-200 cursor-pointer aspect-[3/4] flex flex-col justify-end ${
                          isSelected
                            ? 'border-pink-500 ring-2 ring-pink-500/40 shadow-lg shadow-pink-500/15'
                            : 'border-white/10 hover:border-white/25 hover:shadow-xl'
                        }`}
                      >
                        <img
                          src={preset.image}
                          alt={preset.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Top action buttons */}
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
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDownload(e, preset)}
                            className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-colors"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleShare}
                            className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-colors"
                            title="Share"
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
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Gradient Scrim & Bottom Title */}
                        <div className="relative z-10 p-3 pt-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
                          <p className="text-white font-bold text-xs sm:text-sm drop-shadow-md truncate">
                            {preset.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <MyCreationsView
                creations={myCreations}
                onDeleteCreation={onDeleteCreation}
                onExplorePresets={() => setActiveTab('presets')}
              />
            )}
          </div>
          )}
        </div>
      </main>
    </div>
  );
};
