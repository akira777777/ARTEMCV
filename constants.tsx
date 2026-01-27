
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Barber Shop',
    description: 'AI-диспетчер барбершопа: онлайн-запись, анти-овербукинг, CRM клиентов и платежная аналитика. Оптимизирован под многокресельные салоны.',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    liveLink: 'https://barber-auto-copilot-prepare-deploy.vercel.app/',
    githubLink: '#',
    image: '/barber.png'
  },
  {
    id: '2',
    title: 'Dental Clinic Vakalova',
    description: 'Лендинг и запись к врачу: каталог услуг, интерактивные планы лечения, отзывы пациентов. Уделено внимание доступности и скорости загрузки.',
    techStack: ['Next.js', 'Framer Motion', 'Tailwind', 'Supabase'],
    liveLink: 'https://dental-clinic-vakalova.vercel.app/',
    githubLink: '#',
    image: '/dental.png'
  },
  {
    id: '3',
    title: 'Game Store',
    description: 'Интернет-магазин игр: фильтры по жанрам/платформам, отзывы, управление складом и мгновенная выдача ключей. Сделан с акцентом на быстроту поиска.',
    techStack: ['React', 'Redux Toolkit', 'FastAPI', 'MongoDB', 'Python'],
    liveLink: 'https://game-store-snowy-rho.vercel.app/',
    githubLink: '#',
    image: '/game.png'
  }
];

export const SKILLS = [
  { name: 'Frontend', items: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Redux Toolkit'] },
  { name: 'Backend', items: ['Node.js', 'Python (FastAPI, Django)', 'Java (Spring Boot)', 'PostgreSQL queries'] },
  { name: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Query optimization'] },
  { name: 'Tools', items: ['Docker', 'Git', 'Vite', 'AWS/Vercel', 'Google Gemini API'] }
];
