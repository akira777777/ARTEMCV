import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

// Mock FloatingParticleCanvas
vi.mock('../components/FloatingParticleCanvas', () => ({
  FloatingParticleCanvas: () => <div data-testid="particle-canvas" />,
}));

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nProvider>{component}</I18nProvider>);
};

describe('SpotlightGallery', () => {
  it('renders the works section with title', async () => {
    renderWithI18n(<SpotlightGallery />);
    
    // Wait for hydration to complete
    await waitFor(() => {
      // The title uses translation key 'works.title' which is 'WORK' in English
      expect(screen.getByText('WORK')).toBeInTheDocument();
    });
  });

  it('renders navigation buttons', async () => {
    renderWithI18n(<SpotlightGallery />);
    
    await waitFor(() => {
      // Navigation buttons use aria-label with translation keys
      expect(screen.getByLabelText('Previous project')).toBeInTheDocument();
      expect(screen.getByLabelText('Next project')).toBeInTheDocument();
    });
  });

  it('displays project counter', async () => {
    renderWithI18n(<SpotlightGallery />);
    
    await waitFor(() => {
      // Check for specific project counter text
      expect(screen.getByText(/Project #\d+ of \d+/)).toBeInTheDocument();
    });
  });

  it('has CTA button for viewing project', async () => {
    renderWithI18n(<SpotlightGallery />);
    
    await waitFor(() => {
      // The CTA uses translation key 'works.cta.view' which is 'EXPLORE' in English
      expect(screen.getByText('EXPLORE')).toBeInTheDocument();
    });
  });

  it('allows navigation between projects', async () => {
    renderWithI18n(<SpotlightGallery />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Next project')).toBeInTheDocument();
    });
    
    const nextButton = screen.getByLabelText('Next project');
    fireEvent.click(nextButton);
    
    // After clicking, should still show the section
    await waitFor(() => {
      expect(screen.getByText('WORK')).toBeInTheDocument();
    });
  });
});
