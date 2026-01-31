
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'project.1.title',
    description: 'project.1.desc',
    techStack: ['React Three Fiber', 'Next.js 16', 'GSAP', 'WebGL', 'Tailwind CSS'],
    liveLink: '/project/detailing', // Internal link for the deep dive
    githubLink: 'https://github.com/akira777777',
    image: '/detailing.webp'
  },
  {
    id: '2',
    title: 'project.2.title',
    description: 'project.2.desc',
    techStack: ['AI Orchestration', 'WebSockets', 'Real-time Sync', 'SVG Morphing'],
    liveLink: 'https://dental-clinic-vakalova.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/dental.webp'
  },
  {
    id: '3',
    title: 'project.3.title',
    description: 'project.3.desc',
    techStack: ['Edge Runtime', 'Scroll-driven Animation', 'React 19', 'LCP Optimization'],
    liveLink: 'https://barber-am.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/barber.webp'
  }
];

export const SKILLS = [
  { name: 'skill.frontend', items: ['Next.js 16', 'Three.js / R3F', 'Framer Motion', 'GSAP', 'Tailwind CSS', 'WebGPU'] },
  { name: 'skill.backend', items: ['Go (Golang)', 'PostgreSQL', 'Edge Runtime', 'Real-time Data Sync'] },
  { name: 'skill.architecture', items: ['AWS Lambda', 'OpenAI API (Multi-agent)', 'CI/CD', 'Vercel'] },
  { name: 'skill.tools', items: ['TypeScript 6.0', 'Copilot Pro+', 'Figma', 'Docker'] }
];

export const SERVICES = [
  { name: 'service.1.name', desc: 'service.1.desc' },
  { name: 'service.2.name', desc: 'service.2.desc' },
  { name: 'service.3.name', desc: 'service.3.desc' },
  { name: 'service.4.name', desc: 'service.4.desc' },
  { name: 'service.5.name', desc: 'service.5.desc' },
  { name: 'service.6.name', desc: 'service.6.desc' },
];

/**
 * Common Tailwind CSS class names for form elements
 * Use these constants to maintain consistency across components
 */
export const FORM_INPUT_CLASS = "w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-all";
export const FORM_TEXTAREA_CLASS = "w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-all resize-none";
export const FORM_BUTTON_PRIMARY_CLASS = "px-8 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
export const FORM_BUTTON_SECONDARY_CLASS = "px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all";
