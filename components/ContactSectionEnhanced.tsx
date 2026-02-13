import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';
import { 
  useAnnouncement,
  generateAriaAttributes,
  createAccessibleButtonProps,
  createAccessibleLinkProps,
  checkColorContrast,
  announceLoadingState
} from './AccessibilityUtils';
import { EMAIL_REGEX, sanitizeString } from '../lib/validation';
import { sendContactForm } from '../lib/api-client';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  hp: string; // Honeypot field
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

const ContactSectionEnhanced: React.FC = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    hp: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const announcement = useAnnouncement();
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Announce form state changes
  useEffect(() => {
    if (isSubmitting) {
      announceLoadingState(true, 'Contact form');
    } else if (isSubmitted) {
      announceLoadingState(false, 'Contact form');
      announcement(t('contact.success'), 'polite');
    } else if (isError) {
      announceLoadingState(false, 'Contact form');
      announcement(t('contact.error.sending'), 'assertive');
    }
  }, [isSubmitting, isSubmitted, isError, announcement, t]);

  const validateField = (name: keyof FormData, value: string): string | null => {
    switch (name) {
      case 'name':
        if (!value.trim()) return t('contact.error.required');
        if (value.trim().length < 2) return t('contact.error.name_too_short');
        return null;
      case 'email':
        if (!value.trim()) return t('contact.error.required');
        if (!EMAIL_REGEX.test(value.trim())) return t('contact.error.email');
        return null;
      case 'message':
        if (!value.trim()) return t('contact.error.required');
        if (value.trim().length < 10) return t('contact.error.too_short');
        return null;
      case 'hp':
        return value.trim() ? 'Bot detected' : null;
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key as keyof FormData, formData[key as keyof FormData]);
      if (error && key !== 'hp') {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.hp) {
      // Honeypot triggered - silently succeed
      setIsSubmitted(true);
      return;
    }

    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField === 'name' && nameRef.current) {
        nameRef.current.focus();
      } else if (firstErrorField === 'email' && emailRef.current) {
        emailRef.current.focus();
      } else if (firstErrorField === 'message' && messageRef.current) {
        messageRef.current.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setIsError(false);

    try {
      const sanitizedData = {
        name: sanitizeString(formData.name, 100),
        email: sanitizeString(formData.email, 254),
        subject: sanitizeString(formData.subject, 200),
        message: sanitizeString(formData.message, 5000)
      };

      await sendContactForm(sanitizedData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', hp: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      setIsError(true);
      setErrors(prev => ({ ...prev, general: t('contact.error.sending') }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '', hp: '' });
    setErrors({});
    setIsSubmitted(false);
    setIsError(false);
    if (nameRef.current) nameRef.current.focus();
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-32 bg-gradient-to-b from-black via-neutral-950/50 to-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">{t('contact.success')}</h2>
              <p className="text-white/60 mb-6">{t('contact.success_message')}</p>
              <button
                {...createAccessibleButtonProps({
                  onClick: resetForm,
                  label: t('contact.button.send_another'),
                  type: 'button'
                })}
                className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors"
              >
                {t('contact.button.send_another')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-32 bg-gradient-to-b from-black via-neutral-950/50 to-black">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="text-neutral-500 text-xs font-bold tracking-widest mb-2 block">{t('contact.badge')}</span>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-white">{t('contact.title')}</h2>
              <p className="text-neutral-300 mt-4 max-w-md">{t('contact.subtitle')}</p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{t('contact.reach_out')}</h3>
              <div className="space-y-3">
                <a
                  {...createAccessibleLinkProps({
                    href: `mailto:${process.env.CONTACT_EMAIL || 'fear75412@gmail.com'}`,
                    label: t('contact.contacts.email'),
                    external: false
                  })}
                  className="flex items-center gap-3 text-white hover:text-purple-400 transition-colors"
                >
                  <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">mail</span>
                  </span>
                  <span>{t('contact.contacts.email')}</span>
                </a>
                <a
                  {...createAccessibleLinkProps({
                    href: `https://t.me/younghustle45`,
                    label: t('contact.contacts.telegram'),
                    external: true
                  })}
                  className="flex items-center gap-3 text-white hover:text-purple-400 transition-colors"
                >
                  <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">chat</span>
                  </span>
                  <span>{t('contact.contacts.telegram')}</span>
                </a>
                <div className="flex items-center gap-3 text-white/60">
                  <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                  </span>
                  <span>{t('contact.contacts.location')}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{t('contact.social')}</h3>
              <div className="flex gap-4">
                <a
                  {...createAccessibleLinkProps({
                    href: "https://github.com/akira777777",
                    label: "GitHub",
                    external: true
                  })}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="Visit my GitHub profile"
                >
                  <span className="material-symbols-outlined text-sm">code</span>
                </a>
                <a
                  {...createAccessibleLinkProps({
                    href: "https://linkedin.com/in/akira-mikhailov",
                    label: "LinkedIn",
                    external: true
                  })}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="Visit my LinkedIn profile"
                >
                  <span className="material-symbols-outlined text-sm">business_center</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
              aria-label={t('contact.title')}
            >
              {/* Honeypot Field */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="hp">{t('contact.label.name')}</label>
                <input
                  id="hp"
                  name="hp"
                  type="text"
                  value={formData.hp}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-neutral-400 mb-2"
                  {...generateAriaAttributes({
                    describedBy: errors.name ? 'name-error' : undefined
                  })}
                >
                  {t('contact.label.name')} *
                </label>
                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.name ? 'border-red-500/50' : 'border-white/10'
                  } rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none focus:ring-2 ${
                    errors.name ? 'focus:ring-red-500/30' : 'focus:ring-indigo-500/30'
                  } transition-all`}
                  placeholder={t('contact.placeholder.name')}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-red-400 text-sm" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-neutral-400 mb-2"
                  {...generateAriaAttributes({
                    describedBy: errors.email ? 'email-error' : undefined
                  })}
                >
                  {t('contact.label.email')} *
                </label>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.email ? 'border-red-500/50' : 'border-white/10'
                  } rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none focus:ring-2 ${
                    errors.email ? 'focus:ring-red-500/30' : 'focus:ring-indigo-500/30'
                  } transition-all`}
                  placeholder={t('contact.placeholder.email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-red-400 text-sm" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-bold text-neutral-400 mb-2"
                >
                  {t('contact.label.subject')} {t('contact.help.optional')}
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  placeholder={t('contact.placeholder.subject')}
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-bold text-neutral-400 mb-2 flex items-center justify-between"
                  {...generateAriaAttributes({
                    describedBy: errors.message ? 'message-error' : undefined
                  })}
                >
                  <span>{t('contact.label.message')} *</span>
                  <span className="text-xs text-neutral-500">{t('contact.help.message_min')}</span>
                </label>
                <textarea
                  ref={messageRef}
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.message ? 'border-red-500/50' : 'border-white/10'
                  } rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none focus:ring-2 ${
                    errors.message ? 'focus:ring-red-500/30' : 'focus:ring-indigo-500/30'
                  } transition-all resize-none`}
                  placeholder={t('contact.placeholder.message')}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-2 text-red-400 text-sm" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  {...createAccessibleButtonProps({
                    onClick: handleSubmit,
                    label: isSubmitting ? t('contact.button.sending') : t('contact.button.send'),
                    disabled: isSubmitting,
                    type: 'submit'
                  })}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('contact.button.sending')}
                    </span>
                  ) : (
                    t('contact.button.send')
                  )}
                </button>
                <button
                  {...createAccessibleButtonProps({
                    onClick: resetForm,
                    label: t('contact.button.reset'),
                    type: 'button'
                  })}
                  className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
                  type="button"
                >
                  {t('contact.button.reset')}
                </button>
              </div>

              {/* General Error Message */}
              {errors.general && (
                <p className="text-red-400 text-sm text-center" role="alert">
                  {errors.general}
                </p>
              )}

              {/* Form Instructions for Screen Readers */}
              <div className="sr-only" aria-live="polite">
                {t('contact.form_instructions')}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSectionEnhanced;