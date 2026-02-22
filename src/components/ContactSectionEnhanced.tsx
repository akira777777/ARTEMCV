import React, { useState } from 'react';
import { sendContactForm, type ContactFormData } from '../lib/api-client';

export const ContactSectionEnhanced: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const result = await sendContactForm(formData);
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending form:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section cta reveal" data-reveal>
      <div className="container">
        <div className="cta-card reveal" data-reveal>
          <div>
            <p className="eyebrow">Next Step</p>
            <h2>Ready to build your next Webflow experience?</h2>
            {status === 'success' ? (
              <div role="status" className="success-message">
                <h3>Thank you!</h3>
                <p>We've received your message and will get back to you soon.</p>
                <button onClick={() => setStatus('idle')} className="btn ghost">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your project"
                  ></textarea>
                </div>
                <div className="cta-actions">
                  <button type="submit" className="btn primary" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                  {status === 'error' && <p className="error-text">Something went wrong. Please try again.</p>}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
