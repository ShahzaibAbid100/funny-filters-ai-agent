import React, { useRef, useState } from 'react';
import { Upload, Sparkles, X, Check, Loader2 } from 'lucide-react';
import { Preset, SAMPLE_FACES } from '../data/presets';

interface LeftGeneratorPanelProps {
  activePreset: Preset;
  userPhoto: string | null;
  onUserPhotoChange: (photoUrl: string | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationProgress: number;
}

export const LeftGeneratorPanel: React.FC<LeftGeneratorPanelProps> = ({
  activePreset,
  userPhoto,
  onUserPhotoChange,
  onGenerate,
  isGenerating,
  generationProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <aside className="w-full lg:w-[350px] xl:w-[380px] shrink-0">
      <div className="bg-[#14151b] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
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

          {/* Dark bottom scrim and title */}
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

        {/* Upload Dropzone */}
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
                alt="Uploaded face"
                className="w-14 h-14 rounded-lg object-cover border border-white/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Photo ready</span>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  Face detected for {activePreset.title}
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
                title="Remove photo"
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

          {/* Quick sample portraits selector for effortless testing */}
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

        {/* Primary CTA Button - specifically styled with the vibrant gradient from Image 4 */}
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
                <span>Generating {generationProgress}%...</span>
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

        {/* Footer Disclaimer */}
        <p className="text-[11px] text-zinc-400 text-center leading-normal">
          By generating, you agree to our{' '}
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              alert('GenAI Studio Terms of Service: Non-commercial funny filter generation.');
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
              alert('GenAI Studio Privacy Policy: Images processed client-side.');
            }}
            className="text-[#ff2a9d] hover:underline"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </aside>
  );
};
