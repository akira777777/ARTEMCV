import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Maximize2, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const createId = () => globalThis.crypto?.randomUUID?.() ?? `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const SimpleTelegramChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: createId(), 
      role: 'bot', 
      text: 'Привет! 👋 Отправьте мне сообщение, и я пересошлю его вам в Telegram.',
      timestamp: new Date() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSubmitRef = useRef<number>(0);

  // Загрузить имя из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chat_user_name');
      if (saved) setUserName(saved);
    } catch {}
  }, []);

  // Скролл к низу чата
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Обработчик отправки сообщения
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    if (loading) return;

    // Проверка rate limit (5 секунд между сообщениями)
    const now = Date.now();
    if (lastSubmitRef.current && now - lastSubmitRef.current < 5_000) {
      setError('Пожалуйста, подождите перед следующим сообщением');
      return;
    }

    // Запросить имя если не заполнено
    let name = userName.trim();
    if (!name) {
      const promptName = window.prompt('Укажите ваше имя:');
      if (!promptName) return;
      name = promptName.trim();
      if (!name) {
        setError('Имя обязательно');
        return;
      }
      setUserName(name);
      try {
        localStorage.setItem('chat_user_name', name);
      } catch {}
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);

    // Добавить сообщение пользователя в UI
    const userMsgId = createId();
    setMessages(prev => [...prev, {
      id: userMsgId,
      role: 'user',
      text: userMessage,
      timestamp: new Date()
    }]);

    setLoading(true);

    try {
      // Отправить в Telegram через /api/send-telegram
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12_000);

      const res = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: 'chat@telegram.local', // Dummy email для совместимости с API
          subject: 'Chat Message',
          message: userMessage,
          chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID // optional
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeout);

      if (!res.ok) {
        // Локальный dev режим может вернуть 404
        if (res.status === 404 && window.location.hostname === 'localhost') {
          console.warn('API endpoint not available in dev mode.');
        } else {
          const err = await res.text().catch(() => '');
          throw new Error(err || `Failed to send (status ${res.status})`);
        }
      }

      // Добавить ответ бота
      const botMsgId = createId();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'bot',
        text: '✓ Сообщение отправлено! Я ответу вам в Telegram как можно скорее.',
        timestamp: new Date()
      }]);

      lastSubmitRef.current = now;
    } catch (err: any) {
      console.error('Error sending message:', err);
      
      let errorText = 'Ошибка при отправке сообщения';
      if (err?.name === 'AbortError') {
        errorText = 'Timeout при отправке. Попробуйте позже.';
      } else if (err?.message) {
        errorText = err.message;
      }
      
      setError(errorText);
      
      // Добавить сообщение об ошибке в чат
      const errorMsgId = createId();
      setMessages(prev => [...prev, {
        id: errorMsgId,
        role: 'bot',
        text: `❌ ${errorText}`,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  }, [inputValue, userName, loading]);

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат'}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500
            ${isOpen ? 'bg-white text-black rotate-90' : 'bg-neutral-900 text-white hover:scale-110 border border-white/20'}
          `}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Main Chat Panel */}
      <div 
        className={`
          fixed bottom-28 right-8 z-40 
          bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl
          flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
          ${isExpanded ? 'w-[90vw] h-[80vh]' : 'w-[min(90vw,450px)] h-[min(70vh,600px)]'}
          max-w-[1200px]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span className="font-display font-bold tracking-widest text-sm text-white">TELEGRAM CHAT</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label={isExpanded ? 'Свернуть панель' : 'Развернуть панель'}
            title={isExpanded ? 'Свернуть панель' : 'Развернуть панель'}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-neutral-950/50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-white text-black rounded-tr-none' 
                    : 'bg-white/10 text-neutral-200 rounded-tl-none border border-white/5'}
                `}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-black/60' : 'text-neutral-500'}`}>
                  {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                <span className="text-xs text-neutral-400 font-mono animate-pulse">
                  Отправка...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
          {userName && (
            <div className="text-xs text-neutral-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {userName}
            </div>
          )}

          {error && (
            <div 
              role="alert" 
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs animate-in fade-in"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e as any)}
              placeholder="Введите сообщение..."
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-full py-3 px-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              aria-label="Отправить сообщение"
              className="p-3 bg-white text-black rounded-full hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
