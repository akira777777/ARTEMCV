import React from 'react';
import { useI18n, Lang } from '../i18n';

const langs: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'cs', label: 'CS' }
];

const LanguageSwitcher: React.FC = () => {
  const { lang, setLang, t } = useI18n();
  
  return (
    <div className="flex items-center gap-2">
      {langs.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:scale-110 active:scale-95 ${
            lang === l.code ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-zinc-500 hover:text-white border-white/10'
          }`}
          aria-pressed={lang === l.code ? 'true' : 'false'}
          aria-label={`${t('switch.to')} ${l.label}`}
          title={`${t('switch.to')} ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default React.memo(LanguageSwitcher);
