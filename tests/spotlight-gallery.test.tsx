import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpotlightGallery } from '../components/SpotlightGallery';
import { I18nProvider } from '../i18n';
import { describe, it, expect, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nProvider>{component}</I18nProvider>);
};

describe('SpotlightGallery', () => {
  it('renders the works section with title', () => {
    renderWithI18n(<SpotlightGallery />);
    expect(screen.getByText('WORKS')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    renderWithI18n(<SpotlightGallery />);
    expect(screen.getByLabelText('Previous project')).toBeInTheDocument();
    expect(screen.getByLabelText('Next project')).toBeInTheDocument();
  });

  it('displays project counter', () => {
    renderWithI18n(<SpotlightGallery />);
    expect(screen.getByText(/Viewing/)).toBeInTheDocument();
    expect(screen.getByText(/of/)).toBeInTheDocument();
  });

  it('has CTA button for viewing project', () => {
    renderWithI18n(<SpotlightGallery />);
    expect(screen.getByText('EXPLORE')).toBeInTheDocument();
  });
});
