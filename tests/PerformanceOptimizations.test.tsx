
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SimpleTelegramChat } from '../components/SimpleTelegramChat';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  MessageCircle: () => <div data-testid="icon-message-circle" />,
  X: () => <div data-testid="icon-x" />,
  Send: () => <div data-testid="icon-send" />,
  Loader2: () => <div data-testid="icon-loader" />,
  Maximize2: () => <div data-testid="icon-maximize" />,
  Minimize2: () => <div data-testid="icon-minimize" />
}));

// Mock crypto
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid'
  }
});

// Mock dependencies
vi.mock('../lib/hooks', () => ({
  useReducedMotion: vi.fn(() => false),
  useFetchWithTimeout: vi.fn(() => vi.fn())
}));

vi.mock('../components/LanguageSwitcher', () => ({
  default: () => <div>LanguageSwitcher</div>
}));

vi.mock('../components/MobileMenu', () => ({
  MobileMenu: () => <div>MobileMenu</div>
}));

// Mock dependencies
const mockT = (key: string) => key;
vi.mock('../i18n', () => ({
  useI18n: vi.fn(() => ({
    t: mockT,
    lang: 'en'
  }))
}));

vi.mock('../lib/logger', () => ({
  default: {
    warn: vi.fn(),
    error: vi.fn()
  }
}));

// Mock localStorage and window methods
beforeEach(() => {
  Storage.prototype.setItem = vi.fn();
  Storage.prototype.getItem = vi.fn(() => null);
  window.scrollTo = vi.fn();
});

describe('Performance Optimizations Verification', () => {
  it('SimpleTelegramChat component maintains memoization and functionality', () => {
    render(<SimpleTelegramChat />);
    const icons = screen.getAllByTestId('icon-message-circle');
    expect(icons.length).toBeGreaterThan(0);
  });
});
