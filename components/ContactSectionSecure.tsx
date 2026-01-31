import React, { useRef, useState, useCallback } from 'react';
import { useI18n } from '../i18n';
import { useFetchWithTimeout } from '../lib/hooks';
import devLog from '../lib/logger';
import { MailIcon, MessageCircleIcon, GithubIcon } from 'lucide-react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const { t } = useI18n();
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
      return t('contact.error.required');
    }
    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      return t('contact.error.email');
    }
    if (formData.message.trim().length < 10) {
      return t('contact.error.too_short');
    }
    if (formData.hp && formData.hp.trim().length > 0) {
      return null;
    }
    const now = Date.now();
    if (lastSubmitRef.current && now - lastSubmitRef.current < 10_000) {
      return t('contact.error.rate_limit');
    }
    return null;
  }, [formData, t]);

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
          devLog.warn('API endpoint not available in dev mode. Form would send on Vercel.');
        } else {
          const err = await res.text().catch(() => '');
          throw new Error(err || `Failed to send message (status ${res.status})`);
        }
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', hp: '' });
      lastSubmitRef.current = Date.now();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      devLog.error('Error sending message:', err);
      if ((err as Error)?.name === 'AbortError') {
        setError(t('contact.error.timeout'));
      } else {
        setError((err as Error)?.message || t('contact.error.sending'));
      }
    } finally {
      setLoading(false);
    }
  }, [formData, validate, TELEGRAM_CHAT_ID, fetchWithTimeout]);

  return (
    <section 
      id={id} 
      className="py-32 px-6 lg:px-12 relative overflow-hidden"
      role="region"
      aria-labelledby="contact-heading"
      tabIndex={-1}
    >
      {/* Background Elements */}
      <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-20 left-0 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" aria-hidden="true" />
      
      {/* Decorative Border Elements */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-emerald-500 via-cyan-500 to-orange-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" aria-hidden="true" />
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-orange-500 via-cyan-500 to-emerald-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]" aria-hidden="true" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <h2 
            id="contact-heading"
            className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter gradient-text"
          >
            {t('contact.title')}
          </h2>
          <p className="text-lg text-neutral-400">{t('contact.subtitle')}</p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 glass-card-modern p-8 md:p-10 rounded-3xl border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] relative overflow-hidden" 
          noValidate
          aria-describedby="form-description"
        >
          {/* Inner decorative borders */}
          <div className="absolute inset-0 border border-emerald-500/20 rounded-3xl pointer-events-none" 
               style={{
                 boxShadow: 'inset 0 0 30px rgba(16, 185, 129, 0.1), inset 0 0 60px rgba(6, 182, 212, 0.05)'
               }} />
          
          <input 
            type="text" 
            name="hp" 
            value={formData.hp || ''} 
            onChange={handleChange} 
            className="hidden" 
            aria-hidden="true" 
            tabIndex={-1} 
            autoComplete="off" 
            aria-label="Anti-spam honeypot field"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-bold text-emerald-300 mb-2"
              >
                {t('contact.label.name')} <span className="text-red-400" aria-label="required">*</span>
              </label>
              <input 
                id="name" 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder={t('contact.placeholder.name')} 
                required 
                aria-required="true"
                aria-invalid={error && !formData.name.trim() ? 'true' : 'false'}
                className="w-full px-6 py-3 bg-black/20 border border-emerald-500/30 rounded-xl text-white placeholder:text-emerald-500/50 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all" 
              />
            </div>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-bold text-emerald-300 mb-2"
              >
                {t('contact.label.email')} <span className="text-red-400" aria-label="required">*</span>
              </label>
              <input 
                id="email" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder={t('contact.placeholder.email')} 
                required 
                aria-required="true"
                aria-invalid={error && (!formData.email.trim() || !EMAIL_PATTERN.test(formData.email.trim())) ? 'true' : 'false'}
                className="w-full px-6 py-3 bg-black/20 border border-emerald-500/30 rounded-xl text-white placeholder:text-emerald-500/50 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all" 
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="subject" 
              className="block text-sm font-bold text-emerald-300 mb-2"
            >
              {t('contact.label.subject')}
            </label>
            <input 
              id="subject" 
              type="text" 
              name="subject" 
              value={formData.subject} 
              onChange={handleChange} 
              placeholder={t('contact.placeholder.subject')} 
              aria-describedby="subject-help"
              className="w-full px-6 py-3 bg-black/20 border border-emerald-500/30 rounded-xl text-white placeholder:text-emerald-500/50 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all" 
            />
            <p id="subject-help" className="text-xs text-emerald-400/70 mt-1">{t('contact.help.optional')}</p>
          </div>

          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-bold text-emerald-300 mb-2"
            >
              {t('contact.label.message')} <span className="text-red-400" aria-label="required">*</span>
            </label>
            <textarea 
              id="message" 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              placeholder={t('contact.placeholder.message')} 
              rows={6} 
              required 
              aria-required="true"
              aria-invalid={error && (!formData.message.trim() || formData.message.trim().length < 10) ? 'true' : 'false'}
              aria-describedby="message-help"
              className="w-full px-6 py-3 bg-black/20 border border-emerald-500/30 rounded-xl text-white placeholder:text-emerald-500/50 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none" 
            />
            <p id="message-help" className="text-xs text-emerald-400/70 mt-1">{t('contact.help.message_min')}</p>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            aria-label={t('contact.button.send')} 
            className="neon-button w-full py-4 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                {t('contact.button.sending')}
              </span>
            ) : t('contact.button.send')}
          </button>

          {submitted && (
            <output 
              aria-live="polite" 
              aria-atomic="true"
              className="p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 rounded-xl text-emerald-400 text-center font-bold animate-in fade-in block"
              tabIndex={-1}
              role="status"
            >
              {t('contact.success')}
            </output>
          )}
          {error && (
            <div 
              role="alert" 
              aria-live="assertive" 
              aria-atomic="true"
              className="p-5 bg-gradient-to-r from-orange-500/20 to-red-600/10 border border-orange-500/50 rounded-2xl text-orange-300 text-center font-bold animate-in fade-in shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              tabIndex={-1}
              id="form-error-message"
            >
              <span className="sr-only">Error:</span> {error}
            </div>
          )}
        </form>

        <div className="mt-16 pt-16 border-t border-primary/20">
          <p className="text-center text-gray-400 mb-8">{t('contact.reach_out')}</p>
          <div className="flex justify-center gap-6 flex-wrap" role="list">
            <a 
              href="mailto:fear75412@gmail.com" 
              className="px-6 py-3 border border-primary/30 text-primary-300 rounded-xl hover:bg-primary/10 hover:border-secondary/50 hover:text-secondary-300 transition-all flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Send email to fear75412@gmail.com"
              role="listitem"
            >
              <MailIcon className="w-5 h-5" aria-hidden="true" />
              <span>Email</span>
            </a>
            <a 
              href="https://t.me/younghustle45" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-3 border border-primary/30 text-primary-300 rounded-xl hover:bg-primary/10 hover:border-secondary/50 hover:text-secondary-300 transition-all flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Message on Telegram (opens in new tab)"
              role="listitem"
            >
              <MessageCircleIcon className="w-5 h-5" aria-hidden="true" />
              <span>Telegram</span>
            </a>
            <a 
              href="https://github.com/akira777777" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-3 border border-primary/30 text-primary-300 rounded-xl hover:bg-primary/10 hover:border-secondary/50 hover:text-secondary-300 transition-all flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="View GitHub profile (opens in new tab)"
              role="listitem"
            >
              <GithubIcon className="w-5 h-5" aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ContactSectionSecure);
