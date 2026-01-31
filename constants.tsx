
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Barber Shop',
    description: 'AI-диспетчер барбершопа: онлайн-запись, анти-овербукинг, CRM клиентов и платежная аналитика. Оптимизирован под многокресельные салоны.',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    liveLink: 'https://barber-am.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/barber.png'
  },
  {
    id: '2',
    title: 'Dental Clinic Vakalova',
    description: 'Лендинг и запись к врачу: каталог услуг, интерактивные планы лечения, отзывы пациентов. Уделено внимание доступности и скорости загрузки.',
    techStack: ['Next.js', 'Framer Motion', 'Tailwind', 'Supabase'],
    liveLink: 'https://dental-clinic-vakalova.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/dental.png'
  },
  {
    id: '3',
    title: 'Game Marketplace',
    description: 'Современный маркетплейс игр с каталогом, корзиной покупок, системой фильтрации и адаптивным интерфейсом. Реализованы анимации и плавные переходы.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    liveLink: 'https://game-marketplace-seven.vercel.app/',
    githubLink: 'https://github.com/akira777777',
    image: '/marketplace.png'
  },
  {
    id: '4',
    title: 'Detailing Service',
    description: 'Лендинг для детейлинг-сервиса с галереей работ, формой записи, калькулятором услуг и интерактивными элементами. Оптимизирован для мобильных устройств.',
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
