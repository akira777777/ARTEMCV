import React, { useRef, useState, useCallback } from 'react';
import { EMAIL_PATTERN } from '../lib/utils';
import { useFetchWithTimeout } from '../lib/hooks';
import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS, FORM_BUTTON_PRIMARY_CLASS } from '../constants';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  hp?: string;
}

interface ContactSectionSecureProps {
  id?: string;
}

const ContactSectionSecure: React.FC<ContactSectionSecureProps> = ({ id = 'contact' }) => {
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  const lastSubmitRef = useRef<number>(0);
  const fetchWithTimeout = useFetchWithTimeout(12_000);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    hp: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const validate = useCallback((): string | null => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return 'Please fill in all required fields';
    }
    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      return 'Please enter a valid email address';
    }
    if (formData.message.trim().length < 10) {
      return 'Message is too short. Please provide more details.';
    }
    if (formData.hp && formData.hp.trim().length > 0) {
      return null;
    }
    const now = Date.now();
    if (lastSubmitRef.current && now - lastSubmitRef.current < 10_000) {
      return 'Please wait a moment before sending again';
    }
    return null;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject?.trim() || '',
        message: formData.message.trim(),
        chatId: TELEGRAM_CHAT_ID
      };

      const res = await fetchWithTimeout('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        if (res.status === 404 && globalThis.location.hostname === 'localhost') {
          console.warn('API endpoint not available in dev mode. Form would send on Vercel.');
        } else {
          const err = await res.text().catch(() => '');
          throw new Error(err || `Failed to send message (status ${res.status})`);
        }
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', hp: '' });
      lastSubmitRef.current = Date.now();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Error sending message:', err);
      if (err?.name === 'AbortError') {
        setError('Network timeout. Please try again later.');
      } else {
        setError(err?.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [formData, validate, TELEGRAM_CHAT_ID, fetchWithTimeout]);

  return (
    <section id={id} className="py-32 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-20 left-0 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" aria-hidden />
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent mb-6 tracking-tighter">Get In Touch</h2>
          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">Have a project in mind? Let's work together to create something amazing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-sm bg-gradient-to-br from-white/5 to-transparent p-8 md:p-10 rounded-3xl border border-indigo-400/20 shadow-[0_0_40px_rgba(99,102,241,0.1)]" noValidate>
          <input type="text" name="hp" value={formData.hp || ''} onChange={handleChange} className="hidden" aria-hidden="true" tabIndex={-1} autoComplete="off" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-white mb-2">Name</label>
              <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required className={FORM_INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-2">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required className={FORM_INPUT_CLASS} />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-bold text-white mb-2">Subject (Optional)</label>
            <input id="subject" type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Project subject" className={FORM_INPUT_CLASS} />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-white mb-2">Message</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." rows={6} required className={FORM_TEXTAREA_CLASS} />
          </div>

          <button type="submit" disabled={loading} aria-label="Send message" className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg rounded-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300">
            {loading ? (<span className="flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />Sending...</span>) : 'Send Message'}
          </button>

          {submitted && (
            <output aria-live="polite" className="p-5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/50 rounded-2xl text-emerald-300 text-center font-bold animate-in fade-in block shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              ✓ Message sent! I'll get back to you soon.
            </output>
          )}
          {error && (
            <div role="alert" aria-live="assertive" className="p-5 bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/50 rounded-2xl text-red-300 text-center font-bold animate-in fade-in shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              ❌ {error}
            </div>
          )}
        </form>

        <div className="mt-16 pt-12 border-t border-indigo-500/20">
          <p className="text-center text-neutral-400 mb-8 text-lg">Or reach out through:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="mailto:fear75412@gmail.com" className="px-8 py-4 border-2 border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 to-transparent text-white rounded-2xl hover:bg-indigo-500/20 hover:border-indigo-400/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 flex items-center gap-2 font-semibold" title="Send email">
              <span className="text-xl">📧</span> Email
            </a>
            <a href="https://t.me/younghustle45" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border-2 border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-transparent text-white rounded-2xl hover:bg-purple-500/20 hover:border-purple-400/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 flex items-center gap-2 font-semibold" title="Message on Telegram">
              <span className="text-xl">💬</span> Telegram
            </a>
            <a href="https://github.com/akira777777" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border-2 border-pink-400/30 bg-gradient-to-br from-pink-500/10 to-transparent text-white rounded-2xl hover:bg-pink-500/20 hover:border-pink-400/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300 flex items-center gap-2 font-semibold" title="View GitHub profile">
              <span className="text-xl">💻</span> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ContactSectionSecure);
