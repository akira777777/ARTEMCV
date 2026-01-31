
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'project.1.title',
    description: 'project.1.desc',
    techStack: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    liveLink: 'https://barber-am.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/barber.png'
  },
  {
    id: '2',
    title: 'project.2.title',
    description: 'project.2.desc',
    techStack: ['Next.js', 'Framer Motion', 'Tailwind', 'Supabase'],
    liveLink: 'https://dental-clinic-vakalova.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/dental.png'
  },
  {
    id: '3',
    title: 'project.3.title',
    description: 'project.3.desc',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    liveLink: 'https://game-marketplace-seven.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/marketplace.png'
  },
  {
    id: '4',
    title: 'project.4.title',
    description: 'project.4.desc',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    liveLink: 'https://detailing-mu.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/detailing.png'
  }
];

export const SKILLS = [
  { name: 'skill.frontend', items: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Canvas API', 'Three.js'] },
  { name: 'skill.backend', items: ['Node.js (Fastify/Express)', 'Python (FastAPI)', 'Java (Spring Boot)', 'PostgreSQL / Prisma'] },
  { name: 'skill.architecture', items: ['Microservices', 'Event-driven', 'Serverless', 'WebSockets', 'Query optimization'] },
  { name: 'skill.tools', items: ['Docker', 'Git', 'Vite', 'AWS/Vercel', 'Google Gemini AI', 'Claude API'] }
];

export const SERVICES = [
  { name: 'service.web.title', desc: 'service.web.desc' },
  { name: 'service.uiux.title', desc: 'service.uiux.desc' },
  { name: 'service.api.title', desc: 'service.api.desc' },
  { name: 'service.db.title', desc: 'service.db.desc' },
  { name: 'service.perf.title', desc: 'service.perf.desc' },
  { name: 'service.cloud.title', desc: 'service.cloud.desc' },
];
