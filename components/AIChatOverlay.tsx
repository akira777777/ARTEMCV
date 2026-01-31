import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageCircle, X, Send, Sparkles, Loader2, Brain, 
  Image as ImageIcon, Video, Search, Upload, 
  Download, Globe, Maximize2, Minimize2 
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  images?: string[];
  grounding?: { url: string; title: string }[];
}

type Tab = 'chat' | 'generate' | 'animate';

const createId = () => globalThis.crypto?.randomUUID?.() ?? `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error instanceof Error ? error : new Error('File read failed'));
  });
};

export const AIChatOverlay: React.FC = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // --- Chat State ---
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => ([
    { id: createId(), role: 'model', text: 'I am the Studio Intelligence. I can assist with design strategy, generate high-fidelity assets, or animate your concepts.' }
  ]));
  const [chatLoading, setChatLoading] = useState(false);
  const [chatFile, setChatFile] = useState<File | null>(null);
  const [useSearch, setUseSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Generate Image State ---
  const [imgPrompt, setImgPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [genLoading, setGenLoading] = useState(false);

  // --- Animate Video State ---
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState('16:9');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [veoStatus, setVeoStatus] = useState('');

  // Scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, activeTab]);

  // --- Handlers ---

  const handleChatSend = async () => {
    if ((!query.trim() && !chatFile) || chatLoading) return;
    if (!apiKey) {
      setMessages(prev => [...prev, { id: createId(), role: 'model', text: 'Missing API key. Set VITE_API_KEY to enable chat.' }]);
      return;
    }

    const userText = query;
    const currentFile = chatFile;
    
    // UI Update
    setMessages(prev => [...prev, { 
      id: createId(),
      role: 'user', 
      text: userText, 
      images: currentFile ? [URL.createObjectURL(currentFile)] : undefined 
    }]);
    
    setQuery('');
    setChatFile(null);
    setChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      let model = 'gemini-3-pro-preview';
      let config: any = {
        systemInstruction: "You are Infinite Studio's advanced creative assistant.",
      };
      let contents: any[] = [];

      // Construct history
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Construct current turn
      const currentParts: any[] = [{ text: userText }];

      // 1. Image Analysis (Vision)
      if (currentFile) {
        const base64 = await fileToBase64(currentFile);
        currentParts.unshift({
          inlineData: {
            mimeType: currentFile.type,
            data: base64
          }
        });
        // Model remains gemini-3-pro-preview
      } 
      // 2. Search Grounding
      else if (useSearch) {
        model = 'gemini-3-flash-preview';
        config = {
          tools: [{ googleSearch: {} }]
        };
      } 
      // 3. Thinking Mode (Complex Logic)
      else {
         // Default to Thinking for text-only without search
         config.thinkingConfig = { thinkingBudget: 32768 };
      }

      contents = [...history, { role: 'user', parts: currentParts }];

      if (useSearch) {
        // Search doesn't support streaming well with grounding metadata in the same way, using standard generateContent for simplicity with grounding
        const result = await ai.models.generateContent({ model, contents, config });
        
        let groundingLinks: { url: string; title: string }[] = [];
        const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          chunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
              groundingLinks.push({ url: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
            }
          });
        }

        setMessages(prev => [...prev, { id: createId(), role: 'model', text: result.text || "I couldn't find an answer.", grounding: groundingLinks }]);

      } else {
        // Streaming for standard/thinking/vision
        const streamResult = await ai.models.generateContentStream({ model, contents, config });
        const modelMessageId = createId();
        setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);
        
        let fullText = '';
        for await (const chunk of streamResult) {
          if (chunk.text) {
            fullText += chunk.text;
            setMessages(prev => {
              const newArr = [...prev];
              const last = newArr.at(-1);
              if (last?.id === modelMessageId) {
                last.text = fullText;
              }
              return newArr;
            });
          }
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: createId(), role: 'model', text: "Error connecting to Studio Intelligence." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imgPrompt.trim() || genLoading) return;
    if (!apiKey) {
      alert('Missing VITE_API_KEY. Please configure your API key to generate images.');
      return;
    }
    setGenLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: imgPrompt }] },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: imageSize
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
             const base64String = part.inlineData.data;
             const imageUrl = `data:${part.inlineData.mimeType};base64,${base64String}`;
             setGeneratedImages(prev => [imageUrl, ...prev]);
          }
        }
      }
    } catch (e) {
      console.error(e);
      alert("Image generation failed. Please try again.");
    } finally {
      setGenLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if ((!videoPrompt && !videoFile) || videoLoading) return;
    if (!apiKey) {
      alert('Missing VITE_API_KEY. Please configure your API key to generate video.');
      return;
    }
    
    // API Key Check for Veo
    const aiStudio = (globalThis as any).aistudio as { hasSelectedApiKey: () => Promise<boolean>; openSelectKey: () => Promise<boolean> } | undefined;
    if (aiStudio) {
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey) {
        try {
          const success = await aiStudio.openSelectKey();
          if (!success) {
            alert("Please select a paid API key to use Veo.");
            return;
          }
        } catch (e) {
          console.error(e);
          alert("Please select a paid API key to use Veo.");
          return;
        }
      }
    }

    setVideoLoading(true);
    setVeoStatus('Initializing Veo...');
    setGeneratedVideo(null);

    try {
      // Create new instance to ensure key is picked up
      const ai = new GoogleGenAI({ apiKey });
      
      let requestPayload: any = {
         model: 'veo-3.1-fast-generate-preview',
         config: {
            numberOfVideos: 1,
            resolution: '1080p', // Defaulting to high quality
            aspectRatio: videoAspectRatio
         }
      };

      if (videoPrompt) requestPayload.prompt = videoPrompt;
      
      if (videoFile) {
        const base64 = await fileToBase64(videoFile);
        requestPayload.image = {
            imageBytes: base64,
            mimeType: videoFile.type
        };
      }

      setVeoStatus('Generating video... this may take a moment.');
      let operation = await ai.models.generateVideos(requestPayload);

      // Polling
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (videoUri) {
        // Must append key
        setGeneratedVideo(`${videoUri}&key=${apiKey}`);
      } else {
        alert("No video returned.");
      }

    } catch (e) {
        console.error(e);
        alert("Video generation failed. Ensure you have a paid API key selected.");
        // Reset key logic if needed, simplifed here
    } finally {
        setVideoLoading(false);
        setVeoStatus('');
    }
  };

  const chatStatusText = useMemo(() => {
    if (useSearch) return 'SEARCHING...';
    if (chatFile) return 'ANALYZING...';
    return 'THINKING...';
  }, [useSearch, chatFile]);

  const chatPlaceholder = useMemo(() => {
    if (useSearch) return 'Ask for latest news...';
    if (chatFile) return 'Ask about this image...';
    return 'Ask complex questions...';
  }, [useSearch, chatFile]);

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close AI overlay' : 'Open AI overlay'}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500
            ${isOpen ? 'bg-white text-black rotate-90' : 'bg-neutral-900 text-white hover:scale-110 border border-white/20'}
          `}
        >
          {isOpen ? <X size={24} /> : <Brain size={24} />}
        </button>
      </div>

      {/* Main Panel */}
      <div 
        className={`
          fixed bottom-28 right-8 z-40 
          bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl
          flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
          ${isExpanded ? 'w-[90vw] h-[80vh]' : 'w-[min(90vw,400px)] h-[min(70vh,600px)]'}
          max-w-[1200px]
        `}
      >
        {/* Header & Tabs */}
        <div className="flex flex-col border-b border-white/10 bg-black/40">
           <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="font-display font-bold tracking-widest text-sm text-white">STUDIO INTELLIGENCE</span>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-neutral-400 hover:text-white"
                aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
                title={isExpanded ? 'Collapse panel' : 'Expand panel'}
              >
                 {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
           </div>
           
           <div className="flex px-2 pb-2 gap-1">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat' ? 'bg-white text-black' : 'hover:bg-white/5 text-neutral-400'}`}
              >
                 <MessageCircle size={14} /> CHAT
              </button>
              <button 
                onClick={() => setActiveTab('generate')}
                className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === 'generate' ? 'bg-white text-black' : 'hover:bg-white/5 text-neutral-400'}`}
              >
                 <ImageIcon size={14} /> GENERATE
              </button>
              <button 
                onClick={() => setActiveTab('animate')}
                className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === 'animate' ? 'bg-white text-black' : 'hover:bg-white/5 text-neutral-400'}`}
              >
                 <Video size={14} /> ANIMATE
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-neutral-950/50">
            
            {/* --- CHAT TAB --- */}
            {activeTab === 'chat' && (
                <div className="h-full flex flex-col">
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {messages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] space-y-2`}>
                              {msg.images?.map((img) => (
                                <img key={img} src={img} alt="User upload" className="max-w-full h-auto rounded-lg border border-white/10" />
                              ))}
                                    <div className={`
                                        p-4 rounded-2xl text-sm leading-relaxed
                                        ${msg.role === 'user' 
                                            ? 'bg-white text-black rounded-tr-none' 
                                            : 'bg-white/10 text-neutral-200 rounded-tl-none border border-white/5'}
                                    `}>
                                        <p className="whitespace-pre-line">{msg.text}</p>
                                        
                                {msg.grounding?.length ? (
                                            <div className="mt-3 pt-3 border-t border-black/10 flex flex-wrap gap-2">
                                    {msg.grounding.map((link) => (
                                      <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] bg-black/5 px-2 py-1 rounded-full hover:bg-black/10 transition-colors">
                                                        <Globe size={10} /> {link.title}
                                                    </a>
                                                ))}
                                            </div>
                                ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                                    <span className="text-xs text-neutral-400 font-mono animate-pulse">
                                      {chatStatusText}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-white/10 bg-black/20">
                        {chatFile && (
                            <div className="mb-2 flex items-center gap-2 bg-white/5 p-2 rounded-lg w-fit">
                                <ImageIcon size={14} className="text-purple-400" />
                                <span className="text-xs text-neutral-300 truncate max-w-[150px]">{chatFile.name}</span>
                                <button onClick={() => setChatFile(null)} className="text-neutral-500 hover:text-white" aria-label="Remove uploaded image" title="Remove uploaded image"><X size={14} /></button>
                            </div>
                        )}
                        <div className="flex gap-2 mb-2">
                             <button 
                                onClick={() => setUseSearch(!useSearch)}
                                className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors flex items-center gap-1 ${useSearch ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'border-white/10 text-neutral-500 hover:text-white'}`}
                             >
                                <Search size={10} /> WEB SEARCH
                             </button>
                             <label className="text-[10px] font-bold px-2 py-1 rounded border border-white/10 text-neutral-500 hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                                <Upload size={10} /> UPLOAD IMG
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setChatFile(file);
                                  }}
                                />
                             </label>
                        </div>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChatSend()}
                                placeholder={chatPlaceholder}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
                            />
                            <button
                                onClick={handleChatSend}
                                disabled={chatLoading || (!query.trim() && !chatFile)}
                                aria-label="Send message"
                                className="absolute right-2 p-2 bg-white text-black rounded-full hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- GENERATE IMAGE TAB --- */}
            {activeTab === 'generate' && (
                <div className="h-full flex flex-col p-6">
                    <div className="space-y-4 mb-6">
                        <textarea 
                           className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors resize-none h-24"
                           placeholder="Describe the image you want to generate (e.g., A futuristic dashboard with neon accents)..."
                           value={imgPrompt}
                           onChange={(e) => setImgPrompt(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label htmlFor="image-aspect" className="text-[10px] font-bold text-neutral-500 tracking-widest">ASPECT RATIO</label>
                              <select 
                                 id="image-aspect"
                                 value={aspectRatio} 
                                 onChange={(e) => setAspectRatio(e.target.value)}
                                 aria-label="Image aspect ratio"
                                 className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              >
                                 <option value="1:1">1:1 (Square)</option>
                                 <option value="2:3">2:3 (Portrait)</option>
                                 <option value="3:2">3:2 (Landscape)</option>
                                 <option value="3:4">3:4 (Tall)</option>
                                 <option value="4:3">4:3 (Wide)</option>
                                 <option value="9:16">9:16 (Story)</option>
                                 <option value="16:9">16:9 (Cinematic)</option>
                                 <option value="21:9">21:9 (Ultra)</option>
                              </select>
                           </div>
                           <div className="space-y-1">
                              <label htmlFor="image-size" className="text-[10px] font-bold text-neutral-500 tracking-widest">SIZE</label>
                              <select 
                                 id="image-size"
                                 value={imageSize} 
                                 onChange={(e) => setImageSize(e.target.value)}
                                 aria-label="Image size"
                                 className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              >
                                 <option value="1K">1K</option>
                                 <option value="2K">2K</option>
                                 <option value="4K">4K</option>
                              </select>
                           </div>
                        </div>
                        <button 
                           onClick={handleGenerateImage}
                           disabled={genLoading || !imgPrompt.trim()}
                           className="w-full py-3 bg-white text-black font-bold text-xs tracking-widest rounded-lg hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                           {genLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                           GENERATE ASSET
                        </button>
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 pb-4">
                        {generatedImages.map((src, i) => (
                          <div key={src} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-square">
                             <img src={src} alt="Generated" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <a href={src} download={`generated-${i + 1}.png`} aria-label="Download generated image" title="Download generated image" className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform"><Download size={16}/></a>
                             </div>
                          </div>
                       ))}
                       {generatedImages.length === 0 && !genLoading && (
                          <div className="col-span-2 flex flex-col items-center justify-center text-neutral-600 h-32 border border-dashed border-white/10 rounded-xl">
                             <ImageIcon size={24} className="mb-2 opacity-50"/>
                             <span className="text-xs">No assets generated yet</span>
                          </div>
                       )}
                    </div>
                </div>
            )}

            {/* --- ANIMATE VIDEO TAB --- */}
            {activeTab === 'animate' && (
                <div className="h-full flex flex-col p-6">
                    <div className="space-y-4 mb-6">
                        {/* File Input */}
                        <div className="relative border border-dashed border-white/20 rounded-xl bg-white/5 p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                           {videoFile ? (
                              <div className="relative w-full aspect-video rounded overflow-hidden">
                                <img src={URL.createObjectURL(videoFile)} alt="Video source preview" className="w-full h-full object-cover opacity-50" />
                                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-xs font-bold">{videoFile.name}</span>
                                  <button onClick={(e) => { e.stopPropagation(); setVideoFile(null); }} className="mt-2 text-xs text-red-400 hover:underline">Remove</button>
                                 </div>
                              </div>
                           ) : (
                              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                 <Upload size={24} className="text-neutral-400 mb-2" />
                                 <span className="text-xs font-bold text-white">UPLOAD IMAGE</span>
                                 <span className="text-[10px] text-neutral-500 mt-1">PNG/JPG for Video Generation</span>
                                 <input
                                   type="file"
                                   accept="image/*"
                                   className="hidden"
                                   onChange={(e) => {
                                     const file = e.target.files?.[0];
                                     if (file) setVideoFile(file);
                                   }}
                                 />
                              </label>
                           )}
                        </div>

                        <textarea 
                           className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors resize-none h-20"
                           placeholder="Describe the movement (e.g., Pan right, zoom in, neon lights flickering)... (Optional)"
                           value={videoPrompt}
                           onChange={(e) => setVideoPrompt(e.target.value)}
                        />

                        <div className="space-y-1">
                           <label htmlFor="video-aspect" className="text-[10px] font-bold text-neutral-500 tracking-widest">ASPECT RATIO</label>
                          <select 
                              id="video-aspect"
                              value={videoAspectRatio} 
                              onChange={(e) => setVideoAspectRatio(e.target.value)}
                              aria-label="Video aspect ratio"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                           >
                              <option value="16:9">16:9 (Landscape)</option>
                              <option value="9:16">9:16 (Portrait)</option>
                           </select>
                        </div>

                        <button 
                           onClick={handleGenerateVideo}
                           disabled={videoLoading || !videoFile}
                           className="w-full py-3 bg-white text-black font-bold text-xs tracking-widest rounded-lg hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                           {videoLoading ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
                           GENERATE VIDEO (VEO)
                        </button>
                        {videoLoading && (
                            <p className="text-center text-[10px] text-neutral-400 animate-pulse">{veoStatus}</p>
                        )}
                    </div>
                    
                    {/* Video Result */}
                    <div className="flex-1 bg-black/40 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                        {generatedVideo ? (
                            <div className="w-full h-full relative group">
                                <video src={generatedVideo} controls className="w-full h-full object-contain">
                                  <track kind="captions" src="data:text/vtt,WEBVTT" label="Captions" default />
                                </video>
                                  <a href={generatedVideo} download aria-label="Download generated video" title="Download generated video" className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-colors z-10">
                                   <Download size={16} />
                                </a>
                            </div>
                        ) : (
                            <div className="text-neutral-600 flex flex-col items-center">
                                <Video size={32} className="opacity-20 mb-2" />
                                <span className="text-xs">No video generated</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
      </div>
    </>
  );
};
