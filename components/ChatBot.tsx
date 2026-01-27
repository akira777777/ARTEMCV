
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useI18n } from '../i18n';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: t('chat.initial') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const response = await GeminiService.chat(userMessage, history);
      
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(c => c.web).filter(Boolean);
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || '', 
        sources: sources as any 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Context interrupted. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[60]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[600px] bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Astra Intelligence</span>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={chatRef} className="flex-1 p-8 overflow-y-auto space-y-8 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-white text-black font-bold' : 'text-zinc-400 font-serif'}`}>
                  {m.text}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.sources.map((s, idx) => s.web && (
                      <a 
                        key={idx} 
                        href={s.web.uri} 
                        target="_blank" 
                        className="px-3 py-1 bg-zinc-800 border border-white/5 rounded-full text-[8px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white"
                      >
                        {idx + 1}. {s.web.title.slice(0, 15)}...
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-700 animate-pulse">Synchronizing with Web...</div>}
          </div>

          <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-zinc-900/30 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the strategist..."
              className="flex-1 text-[11px] font-bold bg-transparent p-4 rounded-full border border-white/5 outline-none focus:border-white/20 transition-all text-white placeholder:text-zinc-700"
            />
            <button type="submit" disabled={loading} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl hover:scale-110 transition-transform group"
        >
          <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
