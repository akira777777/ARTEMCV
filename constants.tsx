
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'project.1.title',
    description: 'project.1.desc',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    liveLink: 'https://barber-am.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/barber.webp'
  },
  {
    id: '2',
    title: 'project.2.title',
    description: 'project.2.desc',
    techStack: ['Next.js', 'Framer Motion', 'Tailwind', 'Supabase'],
    liveLink: 'https://dental-clinic-vakalova.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/dental.webp'
  },
  {
    id: '3',
    title: 'project.3.title',
    description: 'project.3.desc',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    liveLink: 'https://game-marketplace-seven.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/marketplace.webp'
  },
  {
    id: '4',
    title: 'project.4.title',
    description: 'project.4.desc',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    liveLink: 'https://detailing-mu.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/detailing.webp'
  }
];

export const SKILLS = [
  { name: 'skill.frontend', items: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Canvas API', 'Three.js'] },
  { name: 'skill.backend', items: ['Node.js (Fastify/Express)', 'Python (FastAPI)', 'Java (Spring Boot)', 'PostgreSQL / Prisma'] },
  { name: 'skill.architecture', items: ['Microservices', 'Event-driven', 'Serverless', 'WebSockets', 'Query optimization'] },
  { name: 'skill.tools', items: ['Docker', 'Git', 'Vite', 'AWS/Vercel', 'Google Gemini AI', 'Claude API'] }
];

export const SERVICES = [
  { name: 'service.1.name', desc: 'service.1.desc' },
  { name: 'service.2.name', desc: 'service.2.desc' },
  { name: 'service.3.name', desc: 'service.3.desc' },
  { name: 'service.4.name', desc: 'service.4.desc' },
  { name: 'service.5.name', desc: 'service.5.desc' },
  { name: 'service.6.name', desc: 'service.6.desc' },
];
