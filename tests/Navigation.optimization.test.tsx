import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navigation } from '../components/Navigation';

// Mock необходимые зависимости
vi.mock('../lib/hooks', () => ({
  useReducedMotion: vi.fn(() => false)
}));

vi.mock('../components/LanguageSwitcher', () => ({
  default: () => <div>LanguageSwitcher</div>
}));

vi.mock('../components/MobileMenu', () => ({
  MobileMenu: () => <div>MobileMenu</div>
}));

const mockT = (key: string) => key;

vi.mock('../i18n', () => ({
  useI18n: vi.fn(() => ({
    t: mockT,
    lang: 'en'
  }))
}));

describe('Navigation Component Tests', () => {
  it('renders without crashing', () => {
    render(<Navigation />);

    // Проверяем, что компонент рендерится
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByLabelText('Main website header')).toBeInTheDocument();
  });

  it('displays navigation items correctly', () => {
    render(<Navigation />);

    // Проверяем наличие элементов навигации
    const navItems = [
      'nav.home',
      'nav.works',
      'nav.lab',
      'nav.services',
      'nav.about',
      'nav.contact'
    ];

    navItems.forEach(item => {
      const link = screen.getByText(item);
      expect(link).toBeInTheDocument();
    });
  });

  it('handles scroll events properly', async () => {
    render(<Navigation />);

    // Симулируем событие прокрутки
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 200
    });

    fireEvent.scroll(window, { target: { scrollY: 200 } });

    // Проверяем, что компонент не вызывает ошибок при прокрутке
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('toggles visibility on scroll', async () => {
    render(<Navigation />);

    // Проверяем начальное состояние
    const header = screen.getByRole('banner');

    // Симулируем прокрутку вниз (должен скрыться)
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true });
    fireEvent.scroll(window);

    // Симулируем прокрутку вверх (должен появиться)
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(header).toHaveClass('translate-y-0');
    });
  });
});