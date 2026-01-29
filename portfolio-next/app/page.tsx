import { Hero } from '@/components/Hero';
import { BentoGrid } from '@/components/BentoGrid';
import { Skills } from '@/components/Skills';
import { Contact } from '@/components/Contact';
import { CustomCursor } from '@/components/CustomCursor';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <CustomCursor />
      <LanguageSwitcher />

      <Hero />
      <Skills />
      <BentoGrid />
      <Contact />
    </main>
  );
}
