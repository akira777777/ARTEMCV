import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Zap, Globe, Database, Layers } from 'lucide-react';
import { Card } from '../ui/Card';
import { Heading, Text, Label } from '../ui/Typography';

const skillCategories = [
  {
    title: 'Frontend',
    icon: Code2,
    skills: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Backend',
    icon: Database,
    skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs'],
  },
  {
    title: 'Design',
    icon: Palette,
    skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping', 'Animation'],
  },
  {
    title: 'DevOps',
    icon: Layers,
    skills: ['Docker', 'AWS', 'CI/CD', 'Vercel', 'Linux', 'Git'],
  },
];

const services = [
  {
    icon: Code2,
    title: 'Web Development',
    description: 'Building fast, scalable web applications with modern technologies.',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Creating intuitive, beautiful interfaces that users love.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimizing applications for speed, SEO, and Core Web Vitals.',
  },
  {
    icon: Globe,
    title: 'Consulting',
    description: 'Technical guidance and architecture decisions for your projects.',
  },
];

export const AboutUnified: React.FC = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-white/[0.01]" aria-label="About me">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Label
            size="sm"
            weight="semibold"
            uppercase
            tracking="wider"
            className="text-emerald-400 mb-4"
          >
            About Me
          </Label>
          <Heading as="h2" size="lg" className="mb-4">
            Skills & Expertise
          </Heading>
          <Text size="lg" color="secondary" className="max-w-2xl mx-auto">
            With over 8 years of experience, I specialize in building modern web applications.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card variant="glass" padding="lg" className="h-full">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <Heading as="h3" size="xs" className="mb-2">
                  {service.title}
                </Heading>
                <Text size="sm" color="tertiary">
                  {service.description}
                </Text>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card variant="default" padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <Heading as="h3" size="xs">
                    {category.title}
                  </Heading>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-full bg-white/5 text-zinc-400 border border-white/[0.06]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUnified;
