'use client';

import { I18nProvider } from '@/lib/i18n';
import { ReactLenis } from 'lenis/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ReactLenis root>
        {children}
      </ReactLenis>
    </I18nProvider>
  );
}
