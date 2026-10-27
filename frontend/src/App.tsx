import { useState, useEffect, useRef } from 'react';
import { MainCatalogPage } from './components/MainCatalogPage';
import { InnerWorkspacePage } from './components/InnerWorkspacePage';
import { DetailModal } from './components/DetailModal';
import { PRESETS, Preset, SAMPLE_FACES } from './data/presets';
import { generateWithBackend } from './utils/generator';
import type { GenerationPhase } from './utils/generator';
import { GeneratedCreation } from './components/MyCreationsView';

type ViewMode = 'main' | 'inner' | 'detail';

function viewFromPath(): { view: ViewMode; preset: Preset } {
  const path = decodeURIComponent(window.location.pathname);
  if (path === '/studio') return { view: 'inner', preset: PRESETS[0] };
  if (path.startsWith('/filters/')) {
    const preset = PRESETS.find((item) => item.id === path.slice('/filters/'.length));
    if (preset) return { view: 'detail', preset };
  }
  return { view: 'main', preset: PRESETS[0] };
}

export default function App() {
  // Browser-addressable catalog (/), studio (/studio), and filter detail (/filters/:id).
  const [currentView, setCurrentView] = useState<ViewMode>(() => viewFromPath().view);
  const [activePreset, setActivePreset] = useState<Preset>(() => viewFromPath().preset);
  const returnViewRef = useRef<'main' | 'inner'>('inner');
  const [userPhoto, setUserPhoto] = useState<string | null>(SAMPLE_FACES[0].url);
  const [modalPreset, setModalPreset] = useState<Preset | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['doll-replica-walk', 'object-overload']));
  const [myCreations, setMyCreations] = useState<GeneratedCreation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationPhase, setGenerationPhase] = useState<GenerationPhase | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [extraPrompt, setExtraPrompt] = useState('');

  // Browser Back/Forward should restore the correct page and selected filter.
  useEffect(() => {
    const restoreRoute = () => {
      const route = viewFromPath();
      setCurrentView(route.view);
      setActivePreset(route.preset);
      setModalPreset(null);
    };
    window.addEventListener('popstate', restoreRoute);
    return () => window.removeEventListener('popstate', restoreRoute);
  }, []);

  const navigate = (view: ViewMode, preset?: Preset) => {
    if (view === 'detail' && currentView !== 'detail') {
      returnViewRef.current = currentView;
    }
    if (preset) {
      if (preset.id !== activePreset.id) setExtraPrompt('');
      setActivePreset(preset);
    }
    setGenerationError(null);
    setModalPreset(null);
    setCurrentView(view);
    const url = view === 'main' ? '/' : view === 'inner' ? '/studio' : `/filters/${encodeURIComponent((preset || activePreset).id)}`;
    if (window.location.pathname !== url) window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Load creations from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('genai_studio_creations');
      if (saved) {
        setMyCreations(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save creations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('genai_studio_creations', JSON.stringify(myCreations));
    } catch {
      // ignore
    }
  }, [myCreations]);

  const handleToggleFavorite = (presetId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(presetId)) {
        next.delete(presetId);
      } else {
        next.add(presetId);
      }
      return next;
    });
  };

  const handleModalPrevious = () => {
    if (!modalPreset) return;
    const currentIndex = PRESETS.findIndex((p) => p.id === modalPreset.id);
    const prevIndex = (currentIndex - 1 + PRESETS.length) % PRESETS.length;
    setModalPreset(PRESETS[prevIndex]);
  };

  const handleModalNext = () => {
    if (!modalPreset) return;
    const currentIndex = PRESETS.findIndex((p) => p.id === modalPreset.id);
    const nextIndex = (currentIndex + 1) % PRESETS.length;
    setModalPreset(PRESETS[nextIndex]);
  };

  const handleOpenInnerWorkspace = (preset?: Preset) => {
    navigate(preset ? 'detail' : 'inner', preset);
  };

  const handleResetWorkspace = () => {
    setUserPhoto(null);
    setExtraPrompt('');
    setGenerationError(null);
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    if (!userPhoto) {
      setGenerationError('Please upload or select a face photo first.');
      return;
    }
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress(5);
    try {
      const result = await generateWithBackend(
        userPhoto,
        activePreset.id,
        extraPrompt,
        (phase) => {
          setGenerationPhase(phase);
          const progressByPhase: Record<GenerationPhase, number> = {
            checking: 10,
            uploading: 25,
            queued: 45,
            processing: 65,
            completed: 100,
          };
          setGenerationProgress(progressByPhase[phase]);
        },
      );
      const newCreation: GeneratedCreation = {
        id: result.jobId,
        presetTitle: activePreset.title,
        presetId: activePreset.id,
        imageUrl: result.outputUrl,
        mediaType: result.mediaType,
        createdAt: new Date().toLocaleDateString(undefined, {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        }),
      };
      setMyCreations((prev) => [newCreation, ...prev]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Generation failed.';
      setGenerationError(message);
    } finally {
      setIsGenerating(false);
      setGenerationPhase(null);
    }
  };

  const handleDeleteCreation = (id: string) => {
    setMyCreations((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-white">
      {/* View routing: Main Catalog Page (Image 3) vs Inner Workspace Page (Image 1) */}
      {currentView === 'main' ? (
        <MainCatalogPage
          presets={PRESETS}
          onOpenInnerWorkspace={handleOpenInnerWorkspace}
          onOpenDetailModal={(preset) => setModalPreset(preset)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onSelectPresetForWorkspace={(preset) => navigate('detail', preset)}
        />
      ) : (
        <InnerWorkspacePage
          activePreset={activePreset}
          onSelectPreset={(preset) => navigate('detail', preset)}
          viewMode={currentView === 'detail' ? 'detail' : 'gallery'}
          onBackToFilters={() => navigate(returnViewRef.current)}
          presets={PRESETS}
          onBackToMain={() => navigate('main')}
          onOpenDetailModal={(preset) => setModalPreset(preset)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          userPhoto={userPhoto}
          onUserPhotoChange={setUserPhoto}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          generationPhase={generationPhase}
          generationError={generationError}
          extraPrompt={extraPrompt}
          onExtraPromptChange={setExtraPrompt}
          myCreations={myCreations}
          onDeleteCreation={handleDeleteCreation}
          onResetWorkspace={handleResetWorkspace}
        />
      )}

      {/* Lightbox Detail Modal (Image 2) */}
      {modalPreset && (
        <DetailModal
          preset={modalPreset}
          onClose={() => setModalPreset(null)}
          onSelectEffect={(preset) => navigate('detail', preset)}
          onPrevious={handleModalPrevious}
          onNext={handleModalNext}
          isFavorite={favorites.has(modalPreset.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}
