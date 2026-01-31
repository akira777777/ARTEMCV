import React from 'react';
import { useI18n, Lang } from '../i18n';

const langs: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'cs', label: 'CS' }
];

const LanguageSwitcher: React.FC = () => {
  const { lang, setLang } = useI18n();
  
  return (
    <div className="flex items-center gap-2">
      {langs.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
            lang === l.code ? 'bg-white text-black border-white' : 'text-zinc-500 hover:text-white border-white/10'
          }`}
          aria-pressed={lang === l.code ? 'true' : 'false'}
          aria-label={`Switch to ${l.label}`}
          title={`Switch to ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default React.memo(LanguageSwitcher);
