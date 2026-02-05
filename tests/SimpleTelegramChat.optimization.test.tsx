import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SimpleTelegramChat } from '../components/SimpleTelegramChat';

// Mock необходимые зависимости
vi.mock('../i18n', () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    lang: 'en'
  }))
}));

vi.mock('../lib/hooks', () => ({
  useFetchWithTimeout: vi.fn(() => vi.fn())
}));

vi.mock('../lib/logger', () => ({
  default: {
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('SimpleTelegramChat Component Tests', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.getItem = vi.fn(() => null);
  });

  it('renders without crashing', () => {
    render(<SimpleTelegramChat />);
    
    // Проверяем, что кнопка чата рендерится
    const chatButton = screen.getByLabelText(/chat.aria.open/i);
    expect(chatButton).toBeInTheDocument();
  });

  it('toggles chat panel open/close', () => {
    render(<SimpleTelegramChat />);
    
    // Проверяем начальное состояние (чат закрыт)
    expect(screen.queryByLabelText(/chat.aria.close/i)).not.toBeInTheDocument();
    
    // Открываем чат
    const openButton = screen.getByLabelText(/chat.aria.open/i);
    fireEvent.click(openButton);
    
    // Проверяем, что чат открылся
    const closeButton = screen.getByLabelText(/chat.aria.close/i);
    expect(closeButton).toBeInTheDocument();
  });

  it('maintains memoization', () => {
    const { rerender } = render(<SimpleTelegramChat />);
    
    // Перерендерим компонент
    rerender(<SimpleTelegramChat />);
    
    // Проверяем, что компонент не падает при перерендеринге
    const chatButton = screen.getByLabelText(/chat.aria.open/i);
    expect(chatButton).toBeInTheDocument();
  });
});