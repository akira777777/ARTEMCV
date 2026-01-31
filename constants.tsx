
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'project.1.title',
    description: 'project.1.desc',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
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
  { name: 'Frontend', items: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Redux Toolkit'] },
  { name: 'Backend', items: ['Node.js', 'Python (FastAPI, Django)', 'Java (Spring Boot)', 'PostgreSQL queries'] },
  { name: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Query optimization'] },
  { name: 'Tools', items: ['Docker', 'Git', 'Vite', 'AWS/Vercel', 'Google Gemini API'] }
];
