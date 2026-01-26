
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Barber Auto Copilot',
    description: 'An AI-driven scheduling and management assistant for barbershops. Features automated appointment booking, customer CRM, and financial analytics dashboard. Solved the challenge of real-time conflict resolution in multi-chair environments.',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    liveLink: 'https://barber-auto-copilot-prepare-deploy.vercel.app/',
    githubLink: '#',
    image: 'https://picsum.photos/seed/barber/800/600'
  },
  {
    id: '2',
    title: 'Dental Clinic Vakalova',
    description: 'Professional medical landing page and booking system. Implemented a custom service catalog, interactive treatment plans, and patient feedback system. Focused on high-accessibility standards and smooth UX for all age groups.',
    techStack: ['Next.js', 'Framer Motion', 'Tailwind', 'Supabase'],
    liveLink: 'https://dental-clinic-vakalova-git-agent-failed-450ff8-akirtas-projects.vercel.app/',
    githubLink: '#',
    image: 'https://picsum.photos/seed/dental/800/600'
  },
  {
    id: '3',
    title: 'Game Store',
    description: 'E-commerce platform for gamers. Includes real-time inventory tracking, user reviews, and a high-performance filtering system for thousands of titles. Integrated with payment gateways and digital delivery APIs.',
    techStack: ['React', 'Redux Toolkit', 'FastAPI', 'MongoDB', 'Python'],
    liveLink: 'https://game-store-krvdjge3x-akirtas-projects.vercel.app/',
    githubLink: '#',
    image: 'https://picsum.photos/seed/gamestore/800/600'
  }
];

export const SKILLS = [
  { name: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Framer Motion'] },
  { name: 'Backend', items: ['Java (Spring Boot)', 'Python (FastAPI, Django)', 'Node.js', 'Go'] },
  { name: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase'] },
  { name: 'Tools', items: ['Docker', 'AWS', 'Vercel', 'Git', 'Gemini API'] }
];
