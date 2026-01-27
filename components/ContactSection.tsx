
import React, { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8227241325:AAGdBygQG9plCgHBmT7nIE8QrJkjR6L2xjU';

const ContactSection: React.FC = () => {
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!TELEGRAM_CHAT_ID) {
      setError('Telegram configuration missing. Please contact support.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format message for Telegram
      const telegramMessage = `
📩 **New Contact Message**

👤 **Name:** ${formData.name}
📧 **Email:** ${formData.email}
${formData.subject ? `📌 **Subject:** ${formData.subject}` : ''}

💬 **Message:**
${formData.message}

---
_From portfolio contact form_
      `.trim();

      // Send to Telegram Bot API
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'Markdown'
          })
        }
      );

      if (!telegramResponse.ok) {
        const errorData = await telegramResponse.json();
        throw new Error(errorData.description || 'Failed to send message to Telegram');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
              href="mailto:contact@example.com"
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all"
              title="Send email"
            >
              📧 Email
            </a>
            <a
              href="https://t.me/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all"
              title="Message on Telegram"
            >
              💬 Telegram
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all"
              title="Connect on LinkedIn"
            >
              🔗 LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
