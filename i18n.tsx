import React, { createContext, useContext, useMemo, useState } from 'react';

export type Lang = 'en' | 'ru' | 'cs';

type Dict = Record<string, string>;

const translations: Record<Lang, Dict> = {
  en: {
    'header.services': 'Services',
    'header.work': 'Work',
    'header.contact': 'Contact',
    'header.contact.telegram': 'Contact — Telegram',
    'skip.content': 'Skip to content',

    'hero.badge': 'Motion-led design & engineering',
    'hero.title.line1': 'Full Stack Developer',
    'hero.title.line2': 'Web, Motion, AI',
    'hero.desc': 'Engineering high-performance web applications where motion meets scalability. Focused on React 19, TypeScript, and architecting resilient digital ecosystems with AI-driven capabilities.',
    'hero.cta.portfolio': 'Portfolio',
    'hero.cta.contact': 'Contact',
    'hero.stat.works': 'Portfolio Projects',
    'hero.stat.clients': 'Global Clients',
    'hero.stat.experience': 'Years of Mastery',
    'hero.stat.performance': 'Performance NPS',
    'hero.scroll': 'Scroll to explore',
    'hero.drag': 'Drag',

    'about.badge': 'Engineering & Strategy',
    'about.title': 'High-end stack for high-end results.',
    'about.desc': 'I deliver the complete architectural cycle: from motion-rich frontend engineering to robust backend systems and cloud infrastructure. I believe motion is a functional tool for clarity, not just an aesthetic choice.',

    'projects.badge': 'Case Studies',
    'projects.title': 'My projects.',

    'footer.ready.title.main': 'Ready for',
    'footer.ready.title.sub': 'collaboration.',
    'footer.contacts': 'Contacts',
    'footer.copyright': 'Full Stack Developer',
    'footer.build': "LET'S BUILD",
    'footer.ready.desc': "Ready to bring your project to life? Let's create something exceptional together.",

    'contacts.telegram': 'Telegram: @younghustle45',
    'contacts.email': 'Email: fear75412@gmail.com',
    'contacts.phone': 'Phone: +420 737 500 587',
    'contacts.location': 'Location: Prague, Czechia',
    'contacts.github': 'GitHub: akira777777',

    'brand.vision': 'Vision Sync',
    'brand.mission': 'Mission Parameters',
    'brand.aspect': 'Aspect Geometry',
    'brand.generate': 'Generate Identity',

    'chat.initial': 'Quietly observing. How can I assist with your strategy today?',

    'service.web.title': 'Web Development',
    'service.web.desc': 'Full-stack applications with React 19, Next.js, Node.js',
    'service.uiux.title': 'UI/UX Design',
    'service.uiux.desc': 'Modern, accessible interfaces with Figma & Framer Motion',
    'service.api.title': 'API Architecture',
    'service.api.desc': 'High-performance REST & GraphQL microservices',
    'service.db.title': 'Database Design',
    'service.db.desc': 'PostgreSQL, MongoDB, Redis & query optimization',
    'service.perf.title': 'Web Performance',
    'service.perf.desc': 'Core Web Vitals, Edge computing, and SEO',
    'service.cloud.title': 'Cloud & DevOps',
    'service.cloud.desc': 'CI/CD, Docker, AWS, and automated deployments',

    'project.1.title': 'LuxeCut CRM & AI Scheduler',
    'project.1.desc': 'Intelligent management system for barbershops: AI-agent for booking, dynamic pricing, and deep CRM analytics. Designed for multi-branch scaling.',
    'project.2.title': 'Vakalova Health Ecosystem',
    'project.2.desc': 'Digital platform for dental clinics: interactive treatment maps, automated scheduling, and patient portal. Integrated real-time notification system.',
    'project.3.title': 'Nexus Game Marketplace',
    'project.3.desc': 'High-performance digital goods marketplace with instant filtering and seamless animations. Architecture focused on maximum FPS and UX.',
    'project.4.title': 'GlossDetai Detailing CRM',
    'project.4.desc': 'CRM system for detailing centers with visual resource planner and complex service calculator. Optimized for high conversion and retention.',

    'skill.frontend': 'Frontend',
    'skill.backend': 'Backend',
    'skill.architecture': 'Architecture',
    'skill.tools': 'Tools'
  },
  ru: {
    'header.services': 'Услуги',
    'header.work': 'Работы',
    'header.contact': 'Контакт',
    'header.contact.telegram': 'Связаться — Telegram',
    'skip.content': 'Перейти к контенту',

    'hero.badge': 'Дизайн и разработка с упором на motion',
    'hero.title.line1': 'Full Stack разработчик',
    'hero.title.line2': 'Web, Motion, AI',
    'hero.desc': 'Разрабатываю высокопроизводительные веб-приложения, где анимация встречается с масштабируемостью. Специализируюсь на React 19, TypeScript и архитектуре устойчивых цифровых экосистем с AI-возможностями.',
    'hero.cta.portfolio': 'Портфолио',
    'hero.cta.contact': 'Связаться',
    'hero.stat.works': 'Проектов в портфолио',
    'hero.stat.clients': 'Глобальных клиентов',
    'hero.stat.experience': 'Лет мастерства',
    'hero.stat.performance': 'NPS производительности',
    'hero.scroll': 'Листайте ниже',
    'hero.drag': 'Тяните',

    'about.badge': 'Инженерия и Стратегия',
    'about.title': 'Премиальный стек для высоких результатов.',
    'about.desc': 'Обеспечиваю полный цикл разработки: от проектирования интерфейсов с богатым motion-дизайном до отказоустойчивых серверных систем и облачной инфраструктуры. Для меня анимация — это функциональный инструмент ясности.',

    'projects.badge': 'Кейсы',
    'projects.title': 'Мои проекты.',

    'footer.ready.title.main': 'Готов к',
    'footer.ready.title.sub': 'сотрудничеству.',
    'footer.contacts': 'Контакты',
    'footer.copyright': 'Full Stack разработчик',
    'footer.build': 'ПОСТРОИМ ВМЕСТЕ',
    'footer.ready.desc': 'Готовы воплотить проект в жизнь? Давайте создадим что-то исключительное вместе.',

    'contacts.telegram': 'Telegram: @younghustle45',
    'contacts.email': 'Email: fear75412@gmail.com',
    'contacts.phone': 'Телефон: +420 737 500 587',
    'contacts.location': 'Локация: Прага, Чехия',
    'contacts.github': 'GitHub: akira777777',

    'brand.vision': 'Синхронизация видения',
    'brand.mission': 'Параметры миссии',
    'brand.aspect': 'Геометрия аспектов',
    'brand.generate': 'Сгенерировать идентичность',

    'chat.initial': 'Тихо наблюдаю. Чем помочь со стратегией сегодня?',

    'service.web.title': 'Веб-разработка',
    'service.web.desc': 'Full-stack приложения на React 19, Next.js, Node.js',
    'service.uiux.title': 'UI/UX Дизайн',
    'service.uiux.desc': 'Современные и доступные интерфейсы в Figma и Framer Motion',
    'service.api.title': 'Архитектура API',
    'service.api.desc': 'Высокопроизводительные REST и GraphQL микросервисы',
    'service.db.title': 'Проектирование БД',
    'service.db.desc': 'PostgreSQL, MongoDB, Redis и оптимизация запросов',
    'service.perf.title': 'Веб-производительность',
    'service.perf.desc': 'Core Web Vitals, Edge computing и SEO',
    'service.cloud.title': 'Cloud и DevOps',
    'service.cloud.desc': 'CI/CD, Docker, AWS и автоматизация развертывания',

    'project.1.title': 'LuxeCut CRM и AI-Расписание',
    'project.1.desc': 'Интеллектуальная система управления для барбершопов: AI-диспетчер для записи, динамическое ценообразование и глубокая аналитика CRM. Спроектировано для масштабирования сетевых салонов.',
    'project.2.title': 'Vakalova Health Ecosystem',
    'project.2.desc': 'Цифровая платформа для стоматологических клиник: интерактивные карты лечения, автоматизированная запись и кабинет пациента. Внедрена система Real-time уведомлений.',
    'project.3.title': 'Nexus Game Marketplace',
    'project.3.desc': 'Высокопроизводительный маркетплейс цифровых товаров с мгновенной фильтрацией и бесшовными анимациями. Архитектура ориентирована на максимальный FPS и UX.',
    'project.4.title': 'GlossDetai Detailing CRM',
    'project.4.desc': 'CRM-система для детейлинг-центров с визуальным планировщиком ресурсов и калькулятором сложных услуг. Оптимизирована для высокой конверсии и удержания клиентов.',

    'skill.frontend': 'Фронтенд',
    'skill.backend': 'Бэкенд',
    'skill.architecture': 'Архитектура',
    'skill.tools': 'Инструменты'
  },
  cs: {
    'header.services': 'Služby',
    'header.work': 'Práce',
    'header.contact': 'Kontakt',
    'header.contact.telegram': 'Kontakt — Telegram',
    'skip.content': 'Přejít na obsah',

    'hero.badge': 'Design a inženýrství vedené motionem',
    'hero.title.line1': 'Full Stack vývojář',
    'hero.title.line2': 'Web, Motion, AI',
    'hero.desc': 'Vývoj vysoce výkonných webových aplikací, kde se pohyb setkává s škálovatelností. Specializace na React 19, TypeScript a architekturu odolných digitálních ekosystémů s AI funkcemi.',
    'hero.cta.portfolio': 'Portfolio',
    'hero.cta.contact': 'Kontakt',
    'hero.stat.works': 'Projektů v portfoliu',
    'hero.stat.clients': 'Globálních klientů',
    'hero.stat.experience': 'Let mistrovství',
    'hero.stat.performance': 'NPS výkonu',
    'hero.scroll': 'Prozkoumejte více',
    'hero.drag': 'Táhněte',

    'about.badge': 'Inženýrství a Strategie',
    'about.title': 'Prémiový stack pro špičkové výsledky.',
    'about.desc': 'Zajišťuji kompletní vývojový cyklus: od motion-rich frontend inženýrství po robustní backend systémy a cloudovou infrastrukturu. Věřím, že pohyb je funkční nástroj pro srozumitelnost, nikoliv jen estetika.',

    'projects.badge': 'Případové studie',
    'projects.title': 'Moje projekty.',

    'footer.ready.title.main': 'Připraven na',
    'footer.ready.title.sub': 'spolupráci.',
    'footer.contacts': 'Kontakty',
    'footer.copyright': 'Full Stack vývojář',
    'footer.build': 'POSTAVME TO',
    'footer.ready.desc': 'Jste připraveni oživit svůj projekt? Pojďme společně vytvořit něco výjimečného.',

    'contacts.telegram': 'Telegram: @younghustle45',
    'contacts.email': 'Email: fear75412@gmail.com',
    'contacts.phone': 'Telefon: +420 737 500 587',
    'contacts.location': 'Lokalita: Praha, Česko',
    'contacts.github': 'GitHub: akira777777',

    'brand.vision': 'Synchronizace vize',
    'brand.mission': 'Parametry mise',
    'brand.aspect': 'Geometrie poměru',
    'brand.generate': 'Vytvořit identitu',

    'chat.initial': 'Tiše pozoruji. Jak mohu dnes pomoci se strategií?',

    'service.web.title': 'Webový vývoj',
    'service.web.desc': 'Full-stack aplikace s React 19, Next.js, Node.js',
    'service.uiux.title': 'UI/UX Design',
    'service.uiux.desc': 'Moderní a přístupná rozhraní s Figma a Framer Motion',
    'service.api.title': 'Architektura API',
    'service.api.desc': 'Vysoce výkonné REST a GraphQL mikroslužby',
    'service.db.title': 'Návrh databází',
    'service.db.desc': 'PostgreSQL, MongoDB, Redis a optimalizace dotazů',
    'service.perf.title': 'Webový výkon',
    'service.perf.desc': 'Core Web Vitals, Edge computing a SEO',
    'service.cloud.title': 'Cloud a DevOps',
    'service.cloud.desc': 'CI/CD, Docker, AWS a automatizované nasazení',

    'project.1.title': 'LuxeCut CRM a AI Plánovač',
    'project.1.desc': 'Inteligentní systém pro barbershopy: AI agent pro rezervace, dynamická tvorba cen a hloubková CRM analytika. Navrženo pro škálování sítí salonů.',
    'project.2.title': 'Vakalova Health Ecosystem',
    'project.2.desc': 'Digitální platforma pro zubní kliniky: interaktivní karty léčby, automatizované plánování a pacientský portál. Integrovaný systém real-time notifikací.',
    'project.3.title': 'Nexus Game Marketplace',
    'project.3.desc': 'Vysoce výkonné tržiště digitálního zboží s okamžitým filtrováním a plynulými animacemi. Architektura zaměřená na maximální FPS a UX.',
    'project.4.title': 'GlossDetai Detailing CRM',
    'project.4.desc': 'CRM systém pro detailingová centra s vizuálním plánovačem zdrojů a kalkulačkou komplexních služeb. Optimalizováno pro vysokou konverzi.',

    'skill.frontend': 'Frontend',
    'skill.backend': 'Backend',
    'skill.architecture': 'Architektura',
    'skill.tools': 'Nástroje'
  }
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nCtx | null>(null);

const detect = (): Lang => {
  const fromStorage = localStorage.getItem('lang') as Lang | null;
  if (fromStorage && ['en', 'ru', 'cs'].includes(fromStorage)) return fromStorage;
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith('cs')) return 'cs';
  if (nav.startsWith('ru')) return 'ru';
  return 'en';
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => detect());

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('lang', l); } catch {}
  };

  const t = useMemo(() => (key: string) => {
    const dict = translations[lang] || translations.en;
    return dict[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
