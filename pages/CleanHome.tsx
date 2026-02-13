import React from 'react';
import DefaultLayout from '../components/DefaultLayout';
import CleanHero from '../components/home/CleanHero';
import { WorkGallery } from '../components/WorkGallery';
import ContactSectionSecure from '../components/ContactSectionSecure';
import { About } from '../components/About';

/**
 * CleanHome - Minimalist home page
 * Based on professional portfolio best practices:
 * - No excessive animations
 * - Clean sections
 * - Focus on content
 * - Single accent color throughout
 */
const CleanHome: React.FC = () => {
  return (
    <DefaultLayout>
      {/* Hero Section */}
      <CleanHero />
      
      {/* Works / Projects */}
      <section id="works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Selected Work
          </h2>
          <p className="text-[#a1a1aa] mb-12 max-w-xl">
            A collection of projects showcasing my expertise in web development, 
            from e-commerce platforms to interactive experiences.
          </p>
        </div>
      </section>
      <WorkGallery />
      
      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <About />
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Let's Work Together
          </h2>
          <p className="text-[#a1a1aa] mb-8">
            Have a project in mind? I'd love to hear about it.
          </p>
        </div>
      </section>
      <ContactSectionSecure />
      
      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#71717a]">
            © {new Date().getFullYear()} Artem. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-[#71717a] hover:text-[#10b981] transition-colors">
              GitHub
            </a>
            <a href="#" className="text-sm text-[#71717a] hover:text-[#10b981] transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-sm text-[#71717a] hover:text-[#10b981] transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </DefaultLayout>
  );
};

export default CleanHome;
