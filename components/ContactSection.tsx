import React, { useRef, useState } from 'react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  hp?: string;
}

type ValidationResult = { type: 'honeypot' } | { type: 'error'; message: string } | null;

// HTML escaping for safe Telegram HTML parse mode
const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const ContactSection: React.FC = () => {
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID; // optional; backend may override
  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN; // prefer server-side in production
  const lastSubmitRef = useRef<number>(0);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    hp: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): ValidationResult => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return { type: 'error', message: 'Please fill in all required fields' };
    }
    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      return { type: 'error', message: 'Please enter a valid email address' };
    }
    if (formData.message.trim().length < 10) {
      return { type: 'error', message: 'Message is too short. Please provide more details.' };
    }
    // Honeypot should be empty
    if (formData.hp && formData.hp.trim().length > 0) {
      return { type: 'honeypot' }; // silently succeed
    }
    // Prevent rapid re-submissions within 10s
    const now = Date.now();
    if (lastSubmitRef.current && now - lastSubmitRef.current < 10_000) {
      return { type: 'error', message: 'Please wait a moment before sending again' };
    }
    return null;
  };

  const buildTelegramMessage = () =>
    [
      '<b>New Contact Form Submission</b>',
      `<b>Name:</b> ${escapeHtml(formData.name.trim())}`,
      `<b>Email:</b> ${escapeHtml(formData.email.trim())}`,
      formData.subject?.trim() ? `<b>Subject:</b> ${escapeHtml(formData.subject.trim())}` : '',
      `<b>Message:</b> ${escapeHtml(formData.message.trim())}`,
    ]
      .filter(Boolean)
      .join('\n');

  const sendDirect = async () => {
    if (!TELEGRAM_CHAT_ID) {
      throw new Error('Missing Telegram chat ID');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: buildTelegramMessage(),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      throw new Error(err || `Failed to send message (status ${res.status})`);
    }
  };

  const sendViaApi = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const res = await fetch('/api/send-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject?.trim() || '',
        message: formData.message.trim(),
        chatId: TELEGRAM_CHAT_ID,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      throw new Error(err || `Failed to send message (status ${res.status})`);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validate();
    if (validation?.type === 'honeypot') {
      // Pretend success to confuse bots
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      return;
    }
    if (validation?.type === 'error') {
      setError(validation.message);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (TELEGRAM_BOT_TOKEN) {
        await sendDirect();
      } else {
        await sendViaApi();
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
  };

  return (
    <section className="py-32 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Get In Touch
          </h2>
          <p className="text-lg text-zinc-400">
            Have a project in mind? Let's work together to create something amazing.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Honeypot field (hidden) */}
          <input
            type="text"
            name="hp"
            value={formData.hp || ''}
            onChange={handleChange}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-white mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-bold text-white mb-2">
              Subject (Optional)
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Project subject"
              className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-white mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              rows={6}
              required
              className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>

          {submitted && (
            <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-center font-bold animate-in fade-in">
              ✓ Message sent! I'll get back to you soon.
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center font-bold animate-in fade-in">
              ❌ {error}
            </div>
          )}
        </form>

        {/* Social Links / Alternative Contact Methods */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <p className="text-center text-zinc-400 mb-8">Or reach out through:</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="mailto:fear75412@gmail.com"
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all"
              title="Send email"
            >
              📧 Email
            </a>
            <a
              href="https://t.me/younghustle45"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all"
              title="Message on Telegram"
            >
              💬 Telegram
            </a>
            {/* LinkedIn intentionally omitted */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
