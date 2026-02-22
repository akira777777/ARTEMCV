import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Heading, Text, Label } from '../ui/Typography';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@artemmikhailov.dev', href: 'mailto:hello@artemmikhailov.dev' },
  { icon: MapPin, label: 'Location', value: 'Prague, Czech Republic', href: null },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
];

export const ContactUnified: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 lg:py-32" aria-label="Contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Label size="sm" weight="semibold" uppercase tracking="wider" className="text-emerald-400 mb-4">
              Get In Touch
            </Label>
            <Heading as="h2" size="lg" className="mb-6">Let's Work Together</Heading>
            <Text size="lg" color="secondary" className="mb-8">
              Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.
            </Text>

            <div className="space-y-4 mb-8">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <Text size="sm" color="tertiary">{item.label}</Text>
                    {item.href ? (
                      <a href={item.href} className="text-white hover:text-emerald-400">{item.value}</a>
                    ) : (
                      <Text color="primary">{item.value}</Text>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card variant="elevated" padding="lg">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-emerald-400" />
                  </div>
                  <Heading as="h3" size="sm" className="mb-2">Message Sent!</Heading>
                  <Text color="secondary">Thank you for reaching out. I'll get back to you soon.</Text>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>
                  <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting} rightIcon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUnified;
