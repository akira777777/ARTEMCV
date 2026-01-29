'use client';

import { useI18n, Lang } from '@/lib/i18n';
import { clsx } from 'clsx';

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  const langs: { id: Lang; label: string }[] = [
    { id: 'en', label: 'EN' },
    { id: 'ru', label: 'RU' },
    { id: 'cs', label: 'CZ' },
  ];

  return (
    <div className="fixed top-6 right-6 z-50 flex gap-2 backdrop-blur-md bg-white/5 p-2 rounded-full border border-white/10">
      {langs.map((l) => (
        <button
          key={l.id}
          onClick={() => setLang(l.id)}
          className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium transition-all',
            lang === l.id
              ? 'bg-white text-black'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
