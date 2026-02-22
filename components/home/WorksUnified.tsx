import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Heading, Text, Label } from '../ui/Typography';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  year: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Modern e-commerce solution with real-time inventory, AI-powered recommendations, and seamless checkout experience.',
    image: '/projects/project1.jpg',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
    link: '#',
    github: '#',
    year: '2024',
  },
  {
    id: '2',
    title: 'SaaS Dashboard',
    description: 'Analytics dashboard with real-time data visualization, custom reports, and team collaboration features.',
    image: '/projects/project2.jpg',
    tags: ['TypeScript', 'Next.js', 'Prisma', 'Tailwind'],
    link: '#',
    github: '#',
    year: '2024',
  },
  {
    id: '3',
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication and instant payments.',
    image: '/projects/project3.jpg',
    tags: ['React Native', 'Node.js', 'MongoDB', 'AWS'],
    link: '#',
    year: '2023',
  },
  {
    id: '4',
    title: 'AI Content Platform',
    description: 'AI-powered content generation platform with multilingual support and SEO optimization.',
    image: '/projects/project4.jpg',
    tags: ['Python', 'FastAPI', 'OpenAI', 'React'],
    link: '#',
    github: '#',
    year: '2023',
  },
];

const ProjectCard: React.FC<{ project: Project; index: number }> = ({
  project,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card variant="interactive" padding="none" className="overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <span className="text-6xl font-bold text-zinc-700">
              {project.title.charAt(0)}
            </span>
          </div>

          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            {project.link && (
              <a
                href={project.link}
                className="p-3 rounded-full bg-white text-black hover:bg-emerald-400 transition-colors"
                aria-label={`View ${project.title}`}
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label={`Source ${project.title}`}
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </motion.div>

          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 text-xs text-zinc-300">
            {project.year}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <Heading as="h3" size="xs">{project.title}</Heading>
            <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400" />
          </div>
          <Text size="sm" color="tertiary" className="mb-4 line-clamp-2">
            {project.description}
          </Text>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs rounded bg-white/5 text-zinc-400 border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const WorksUnified: React.FC = () => {
  return (
    <section id="works" className="py-24 lg:py-32" aria-label="Selected works">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Label size="sm" weight="semibold" uppercase tracking="wider" className="text-emerald-400 mb-4">
            Portfolio
          </Label>
          <Heading as="h2" size="lg" className="mb-4">Selected Works</Heading>
          <Text size="lg" color="secondary" className="max-w-2xl mx-auto">
            A collection of projects that showcase my expertise in building modern, scalable web applications.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorksUnified;
