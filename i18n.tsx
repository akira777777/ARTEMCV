import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

export type Lang = 'en' | 'ru' | 'cs';

type Dict = Record<string, string>;

const translations: Record<Lang, Dict> = {
  en: {
    'header.services': 'Services',
    'header.work': 'Work',
    'header.contact': 'Contact',
    'header.contact.telegram': 'Contact — Telegram',

    'hero.badge': 'Motion-led design & engineering',
    'hero.title.line1': 'Full Stack Developer',
    'hero.title.line2': 'Web, Motion, AI',
    'hero.desc': 'I build dynamic interfaces with thoughtful motion, scalable backends, and AI integrations. Production-grade code: performance, resilience, clear architecture.',
    'hero.cta.portfolio': 'Portfolio',
    'hero.cta.contact': 'Contact',
    'hero.stat.uiux': 'UI/UX + Motion',
    'hero.stat.backend': 'Backend & Data',
    'hero.stat.ai': 'AI/Automation',
    'hero.stat.nps': 'Delivery NPS',

    'about.badge': 'Services & Stack',
    'about.title': 'My stack and services.',
    'about.desc': 'I cover the full cycle: product design and motion to API, data, and production infra. Motion is navigation and clarity, not decoration.',

    'projects.badge': 'Selected Work',
    'projects.title': 'My projects.',

    'footer.ready.title.main': 'Ready for',
    'footer.ready.title.sub': 'collaboration.',
    'footer.contacts': 'Contacts',
    'footer.copyright': 'Full Stack Developer',

    'contacts.telegram': 'Telegram: @younghustle45',
    'contacts.email': 'Email: fear75412@gmail.com',
    'contacts.phone': 'Phone: +420 737 500 587',
    'contacts.location': 'Location: Prague, Czechia',
    'contacts.github': 'GitHub: akira777777',

    'brand.vision': 'Vision Sync',
    'brand.mission': 'Mission Parameters',
    'brand.aspect': 'Aspect Geometry',
    'brand.generate': 'Generate Identity',

    'chat.initial': 'Quietly observing. How can I assist with your strategy today?'
  },
  ru: {
    'header.services': 'Услуги',
    'header.work': 'Работы',
    'header.contact': 'Контакт',
    'header.contact.telegram': 'Связаться — Telegram',

    'hero.badge': 'Motion-led design & engineering',
    'hero.title.line1': 'Full Stack разработчик',
    'hero.title.line2': 'Web, Motion, AI',
    'hero.desc': 'Создаю динамичные интерфейсы с продуманной анимацией, масштабируемые backend-ядра и AI-интеграции. Кодирую под продакшн: перформанс, отказоустойчивость, понятная архитектура.',
    'hero.cta.portfolio': 'Портфолио',
    'hero.cta.contact': 'Связаться',
    'hero.stat.uiux': 'UI/UX + Motion',
    'hero.stat.backend': 'Backend & Data',
    'hero.stat.ai': 'AI/Automation',
    'hero.stat.nps': 'Delivery NPS',

    'about.badge': 'Services & Stack',
    'about.title': 'Мой стек и услуги.',
    'about.desc': 'Беру на себя полный цикл: от продуктового дизайна и motion до API, данных и продакшн-инфры. Анимации — не декор, а навигация и ясность.',

    'projects.badge': 'Выборочные работы',
    'projects.title': 'Мои проекты.',

    'footer.ready.title.main': 'Готов к',
    'footer.ready.title.sub': 'сотрудничеству.',
    'footer.contacts': 'Контакты',
    'footer.copyright': 'Full Stack разработчик',

    'contacts.telegram': 'Telegram: @younghustle45',
    'contacts.email': 'Email: fear75412@gmail.com',
    'contacts.phone': 'Телефон: +420 737 500 587',
    'contacts.location': 'Локация: Прага, Чехия',
    'contacts.github': 'GitHub: akira777777',

    'brand.vision': 'Vision Sync',
    'brand.mission': 'Параметры миссии',
    'brand.aspect': 'Геометрия аспектов',
    'brand.generate': 'Сгенерировать идентичность',

    'chat.initial': 'Тихо наблюдаю. Чем помочь со стратегией сегодня?'
  },
  cs: {
    'header.services': 'Služby',
    'header.work': 'Práce',
    'header.contact': 'Kontakt',
    'header.contact.telegram': 'Kontakt — Telegram',

    'hero.badge': 'Design a inženýrství vedené motionem',
    'hero.title.line1': 'Full Stack vývojář',
    'hero.title.line2': 'Web, Motion, AI',
    'hero.desc': 'Stavím dynamická rozhraní s promyšleným pohybem, škálovatelné backendy a AI integrace. Produkční kód: výkon, odolnost, jasná architektura.',
    'hero.cta.portfolio': 'Portfolio',
    'hero.cta.contact': 'Kontakt',
    'hero.stat.uiux': 'UI/UX + Motion',
    'hero.stat.backend': 'Backend & Data',
    'hero.stat.ai': 'AI/Automatizace',
    'hero.stat.nps': 'Delivery NPS',

    'about.badge': 'Služby & Stack',
    'about.title': 'Můj stack a služby.',
    'about.desc': 'Pokrývám celý cyklus: od produktového designu a motionu po API, data a produkční infrastrukturu. Motion = navigace a srozumitelnost.',

    'projects.badge': 'Vybrané práce',
    'projects.title': 'Moje projekty.',

    'footer.ready.title.main': 'Připraven na',
    'footer.ready.title.sub': 'spolupráci.',
    'footer.contacts': 'Kontakty',
    'footer.copyright': 'Full Stack vývojář',

    'contacts.telegram': 'Telegram: @younghustle45',
    'contacts.email': 'Email: fear75412@gmail.com',
    'contacts.phone': 'Telefon: +420 737 500 587',
    'contacts.location': 'Lokalita: Praha, Česko',
    'contacts.github': 'GitHub: akira777777',

    'brand.vision': 'Vision Sync',
    'brand.mission': 'Parametry mise',
    'brand.aspect': 'Geometrie poměru',
    'brand.generate': 'Vytvořit identitu',

    'chat.initial': 'Tiše pozoruji. Jak mohu dnes pomoci se strategií?'
  }
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nCtx | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const detect = (): Lang => {
    const fromStorage = localStorage.getItem('lang') as Lang | null;
    if (fromStorage && ['en','ru','cs'].includes(fromStorage)) return fromStorage;
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith('cs')) return 'cs';
    if (nav.startsWith('ru')) return 'ru';
    return 'en';
  };
  const [lang, setLangState] = useState<Lang>(detect());

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('lang', l); } catch {}
  };

  useEffect(() => {
    // ensure initial storage
    try { localStorage.setItem('lang', lang); } catch {}
  }, [lang]);

  const t = useMemo(() => (key: string) => {
    const dict = translations[lang] || translations.en;
    return dict[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
