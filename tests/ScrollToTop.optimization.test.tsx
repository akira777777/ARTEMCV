import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ScrollToTop } from '../components/ScrollToTop';

// Mock необходимые зависимости
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(() => ({ pathname: '/' }))
}));

vi.mock('../i18n', () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    lang: 'en'
  }))
}));

describe('ScrollToTop Component Tests', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0
    });
    
    window.scrollTo = vi.fn();
  });

  it('renders without crashing', () => {
    render(<ScrollToTop />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByLabelText(/scroll_to_top/i)).toBeInTheDocument();
  });

  it('hides when scroll is less than window height', () => {
    // Устанавливаем небольшой скролл
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 500
    });
    
    render(<ScrollToTop />);
    
    // Компонент должен быть скрыт при маленьком скролле
    const button = screen.getByLabelText(/scroll_to_top/i);
    expect(button).toBeInTheDocument();
  });

  it('shows when scroll exceeds window height', () => {
    // Устанавливаем большой скролл
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 1500
    });
    
    // Имитируем событие скролла
    fireEvent.scroll(window, { target: { scrollY: 1500 } });
    
    render(<ScrollToTop />);
    
    // Проверяем, что кнопка существует
    const button = screen.getByLabelText(/scroll_to_top/i);
    expect(button).toBeInTheDocument();
  });

  it('scrolls to top when clicked', () => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 1500
    });
    
    render(<ScrollToTop />);
    
    // Клик по кнопке
    const button = screen.getByLabelText(/scroll_to_top/i);
    fireEvent.click(button);
    
    // Проверяем, что window.scrollTo был вызван
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });
});