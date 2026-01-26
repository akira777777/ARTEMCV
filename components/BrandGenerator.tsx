
import React, { useState, useCallback, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { BrandBible, ImageSize } from '../types';

const ASPECT_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];

const BrandGenerator: React.FC = () => {
  const [mission, setMission] = useState('');
  const [loadingBible, setLoadingBible] = useState(false);
  const [bible, setBible] = useState<BrandBible | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<string>("1:1");
  const [images, setImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [placeholder, setPlaceholder] = useState<string>('');
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateVariation = useCallback(async (key: string, prompt: string, style: string, ratio: string) => {
    setLoadingImages(prev => ({ ...prev, [key]: true }));
    try {
      const url = await GeminiService.generateBrandImage(prompt, '1K', style, ratio);
      setImages(prev => ({ ...prev, [key]: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingImages(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mission.trim()) return;
    setLoadingBible(true);
    setBible(null);
    setImages({});
    try {
      // Step 1: Deep Thinking for Brand Architecture (in parallel with placeholder)
      const [generatedBible, absPlaceholder] = await Promise.all([
        GeminiService.generateBrandBible(mission),
        GeminiService.generateAbstractPlaceholder('1K', selectedRatio)
      ]);
      setBible(generatedBible);
      setPlaceholder(absPlaceholder);

      // Step 3: Launch Parallel Synthesis
      const tasks = [
        { key: 'primary', prompt: generatedBible.primaryLogoPrompt, style: 'Signature mark' },
        { key: 'mono', prompt: generatedBible.monochromaticLogoPrompt, style: 'Silhouette' },
        { key: 'simplified', prompt: generatedBible.simplifiedIconPrompt, style: 'Minimal icon' },
        { key: 'grayscale', prompt: generatedBible.grayscaleLogoPrompt, style: 'Professional' },
        { key: 'sec1', prompt: generatedBible.secondaryMarkPrompt1, style: 'Decorative seal' },
        { key: 'sec2', prompt: generatedBible.secondaryMarkPrompt2, style: 'Pattern' }
      ];
      tasks.forEach(t => generateVariation(t.key, t.prompt, t.style, selectedRatio));
    } finally {
      setLoadingBible(false);
    }
  };

  const handleRegeneratePrimary = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!bible) return;
    generateVariation('primary', bible.primaryLogoPrompt, 'Signature mark', selectedRatio);
  };

  const handleVisionSync = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await GeminiService.analyzeVision(base64);
        setMission(result.mission);
      };
      reader.readAsDataURL(file);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleEdit = async (key: string) => {
    if (!editPrompt.trim() || !images[key]) return;
    setLoadingImages(prev => ({ ...prev, [key]: true }));
    try {
      const newImg = await GeminiService.editImage(images[key], editPrompt);
      setImages(prev => ({ ...prev, [key]: newImg }));
      setEditMode(null);
      setEditPrompt('');
    } finally {
      setLoadingImages(prev => ({ ...prev, [key]: false }));
    }
  };

  const renderLogoCard = (label: string, key: string) => {
    const isLoading = loadingImages[key];
    const imgUrl = images[key];

    return (
      <div className="space-y-4 group relative">
        <div className="relative aspect-square rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden transition-all group-hover:border-white/20 shadow-2xl">
          {isLoading ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-900 overflow-hidden">
              {placeholder ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* The Cinematic Skeleton with Rack Focus */}
                  <img 
                    src={placeholder} 
                    className="w-full h-full object-contain p-12 animate-[cinematic-skeleton_4s_ease-in-out_infinite]" 
                    alt="Synthesis skeleton"
                  />
                  {/* High-end God Ray Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full -translate-y-full animate-[god-ray_3s_infinite] pointer-events-none" />
                  
                  {/* Dynamic Status HUD */}
                  <div className="absolute bottom-8 inset-x-0 flex flex-col items-center space-y-3 px-8">
                    <div className="w-full h-[1px] bg-white/5 relative overflow-hidden">
                       <div className="absolute inset-0 bg-white/40 animate-[data-stream_2s_infinite]" />
                    </div>
                    <div className="flex justify-between w-full opacity-40">
                      <span className="text-[6px] font-black uppercase tracking-[0.4em] text-zinc-400">Geometry Sync</span>
                      <span className="text-[6px] font-black uppercase tracking-[0.4em] text-zinc-400">Processing...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-6 h-6 border-[1px] border-white/10 border-t-white rounded-full animate-spin" />
                  <span className="text-[7px] font-black uppercase tracking-[0.5em] text-zinc-600">Initializing Lab</span>
                </div>
              )}
            </div>
          ) : imgUrl ? (
            <div className="w-full h-full relative animate-in fade-in zoom-in-95 duration-700">
              <img src={imgUrl} className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-1000 ease-out" alt={label} />
              <button 
                onClick={() => setEditMode(key)}
                className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white border border-white/10 hover:bg-white hover:text-black shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-800 italic text-[10px] tracking-widest uppercase">Awaiting Parameters</div>
          )}
        </div>
        
        {editMode === key && (
          <div className="absolute inset-x-0 -bottom-16 z-20 animate-in slide-in-from-top-4 duration-300">
            <div className="flex gap-2 p-2 bg-zinc-800 rounded-full border border-white/10 shadow-2xl backdrop-blur-xl">
              <input 
                autoFocus
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Describe modification..."
                className="bg-transparent border-none outline-none text-[10px] flex-1 px-4 text-white placeholder:text-zinc-600"
                onKeyDown={(e) => e.key === 'Enter' && handleEdit(key)}
              />
              <button onClick={() => handleEdit(key)} className="px-3 py-1 bg-white text-black rounded-full text-[10px] font-bold active:scale-95 transition-transform">Apply</button>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 transition-colors group-hover:text-zinc-400">{label}</p>
          {key === 'primary' && !isLoading && imgUrl && (
            <button 
              onClick={handleRegeneratePrimary}
              className="p-1.5 rounded-full border border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 transition-all group-hover:border-white/20 active:scale-90"
              title="Regenerate Variation"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-32 px-6 lg:px-12 animate-in fade-in duration-1000">
      <div className="flex flex-col items-center text-center space-y-8 mb-24">
        <h1 className="text-5xl md:text-8xl font-serif">Identity <span className="italic">Lab</span>.</h1>
        <p className="text-zinc-500 max-w-xl text-lg leading-relaxed">The ultimate visual strategy engine. Synchronize your vision via image or text.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Vision Sync Dropzone */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative p-12 rounded-[3rem] border-2 border-dashed border-white/5 hover:border-white/20 bg-zinc-900/50 cursor-pointer transition-all text-center"
        >
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleVisionSync} />
          {analyzing ? (
            <div className="space-y-4">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Extracting Visual Essence</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-serif italic text-zinc-300 group-hover:text-white transition-colors">Vision Sync</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Drop mood board to pre-fill mission</p>
            </div>
          )}
        </div>

        <div className="p-12 rounded-[3rem] bg-[#111111] border border-white/5 shadow-2xl">
          <form onSubmit={handleGenerate} className="space-y-12">
            <div className="space-y-6">
              <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Mission Parameters</label>
              <textarea
                required
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="The narrative for your brand..."
                className="w-full h-40 p-10 rounded-[3rem] border border-white/5 bg-black/50 focus:ring-1 focus:ring-white/20 outline-none transition-all text-xl text-white resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-end">
              <div className="space-y-6">
                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Aspect Geometry</label>
                <div className="grid grid-cols-4 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setSelectedRatio(ratio)}
                      className={`py-2 rounded-xl border text-[10px] font-bold transition-all ${selectedRatio === ratio ? 'bg-white text-black' : 'text-zinc-500 hover:text-white border-white/5'}`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
              <button disabled={loadingBible} type="submit" className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full text-xs disabled:opacity-50 flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors">
                {loadingBible && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                {loadingBible ? 'Deep Thinking...' : 'Generate Identity'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {bible && (
        <div className="mt-40 space-y-40 animate-in fade-in duration-1000">
          <div className="text-center space-y-12">
            <h2 className="text-6xl md:text-9xl font-serif italic text-white">{bible.name}</h2>
            <p className="text-2xl text-zinc-600 italic max-w-3xl mx-auto">"{bible.mission}"</p>
          </div>

          <div className="space-y-12">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-500 mb-8 border-b border-white/5 pb-4">Brand System Marks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {renderLogoCard('Primary Signature', 'primary')}
              {renderLogoCard('Monochrome Mark', 'mono')}
              {renderLogoCard('Geometric Glyph', 'simplified')}
              {renderLogoCard('Tonal Grayscale', 'grayscale')}
              {renderLogoCard('Decorative Badge', 'sec1')}
              {renderLogoCard('Symbolic Pattern', 'sec2')}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-20">
            {/* Chromatic Spectrum */}
            <div className="space-y-12">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Chromatic Spectrum</h3>
              <div className="grid gap-6">
                {bible.palette.map((color, i) => (
                  <div key={i} className="relative">
                    <div className="flex items-center space-x-6 p-6 rounded-[2.5rem] bg-zinc-900 border border-white/5 transition-all hover:bg-zinc-800/50">
                      <div className="w-20 h-20 rounded-[1.5rem] border border-white/10 shadow-2xl" style={{ backgroundColor: color.hex }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="text-xl font-bold tracking-tighter text-white">{color.hex}</p>
                          <button 
                            onClick={() => setActiveTooltip(activeTooltip === i ? null : i)}
                            className={`p-1.5 rounded-full transition-all hover:scale-110 ${activeTooltip === i ? 'bg-white text-black' : 'text-zinc-600 hover:text-white hover:bg-white/5'}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </button>
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">{color.name}</p>
                      </div>
                    </div>

                    {activeTooltip === i && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 w-72 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 bg-zinc-800/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">System Usage</p>
                            <button onClick={() => setActiveTooltip(null)} className="text-zinc-500 hover:text-white">
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                          <p className="text-xs text-zinc-200 leading-relaxed italic">
                            {color.usage}
                          </p>
                        </div>
                        <div className="w-3 h-3 bg-zinc-800/90 border-r border-b border-white/10 rotate-45 mx-auto -mt-1.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Typography Logic */}
            <div className="space-y-12">
               <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Typography Logic</h3>
               <div className="p-12 rounded-[3.5rem] bg-zinc-900 border border-white/5 space-y-12">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Headline System</span>
                    <p className="text-5xl font-serif leading-none italic text-white">{bible.typography.header}</p>
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Body System</span>
                    <p className="text-2xl leading-relaxed text-zinc-400">{bible.typography.body}</p>
                  </div>
                  <div className="pt-8 border-t border-white/5">
                    <p className="text-xs text-zinc-600 italic leading-relaxed">"{bible.typography.rationale}"</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Global Synthesis Styles */}
      <style>{`
        @keyframes god-ray {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }
        @keyframes cinematic-skeleton {
          0%, 100% { 
            opacity: 0.15; 
            filter: blur(4px) grayscale(100%) brightness(0.8);
            transform: scale(0.98);
          }
          50% { 
            opacity: 0.45; 
            filter: blur(0px) grayscale(20%) brightness(1.2);
            transform: scale(1.05);
          }
        }
        @keyframes data-stream {
          0% { left: -100%; width: 30%; }
          50% { left: 40%; width: 60%; }
          100% { left: 100%; width: 30%; }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default BrandGenerator;
