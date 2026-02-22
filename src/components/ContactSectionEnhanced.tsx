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
    <section id="contact" className="section cta reveal" data-reveal aria-labelledby="contact-heading">
      <div className="container">
        <div className="cta-card reveal" data-reveal>
          <div>
            <p className="eyebrow">Next Step</p>
            <h2 id="contact-heading">Ready to build your next Webflow experience?</h2>
            <p style={{ marginTop: '1rem' }}>
              Tell us about your project and we will get back to you within one business day.
            </p>
            <div style={{ marginTop: '2rem', display: 'grid', gap: '0.65rem' }}>
              {['No commitment required', 'Response within 24 hours', 'Free initial consultation'].map((item) => (
                <p key={item} className="cta-meta">{item}</p>
              ))}
            </div>
          </div>
          <div>
            {status === 'success' ? (
              <div role="status" className="success-message">
                <h3>Message received!</h3>
                <p>We have received your message and will get back to you within 24 hours.</p>
                <button onClick={() => setStatus('idle')} className="btn ghost" type="button">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-group">
                  <label htmlFor="name">Full name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Tell us about your project</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Describe what you are building, your timeline, and any specific goals..."
                  />
                </div>
                <div className="cta-actions">
                  <button type="submit" className="btn primary" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                  {status === 'error' && (
                    <p className="error-text" role="alert">
                      Something went wrong. Please try again or email us directly.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};