import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpotlightGallery } from '../components/SpotlightGallery';
import { I18nProvider } from '../i18n';
import { describe, it, expect, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const React = require('react');
  const motionProxy = new Proxy(
    {},
    {
      get: (_target, key) => {
        return ({ children, ...props }: any) => {
          return React.createElement(key as any, props, children);
        };
      },
    }
  );
  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nProvider>{component}</I18nProvider>);
};

describe('SpotlightGallery', () => {
  it('renders the works section with title', () => {
    renderWithI18n(<SpotlightGallery />);
    expect(screen.getByText('WORK')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    renderWithI18n(<SpotlightGallery />);
    expect(screen.getByLabelText('Previous project')).toBeInTheDocument();
    expect(screen.getByLabelText('Next project')).toBeInTheDocument();
  });

  it('displays project counter', () => {
    renderWithI18n(<SpotlightGallery />);
    expect(screen.getByText(/View details/i)).toBeInTheDocument();
    expect(screen.getByText(/Project #/i)).toBeInTheDocument();
  });

  it('has CTA button for viewing project', () => {
    renderWithI18n(<SpotlightGallery />);
    expect(screen.getByText('EXPLORE')).toBeInTheDocument();
  });
});
