
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { I18nProvider, useI18n } from '../i18n';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('I18n', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(localStorage.getItem).mockClear();
  });

  it('should detect language from localStorage', () => {
    localStorage.setItem('lang', 'ru');
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>
    });
    expect(result.current.lang).toBe('ru');
  });

  it('should fallback to English if nothing is set', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>
    });
    expect(result.current.lang).toBe('en');
  });

  it('should change language and update localStorage', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>
    });

    act(() => {
      result.current.setLang('cs');
    });

    expect(result.current.lang).toBe('cs');
    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'cs');
  });

  it('should return translation key if not found', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>
    });
    expect(result.current.t('non.existent.key')).toBe('non.existent.key');
  });
});
