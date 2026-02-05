import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BaseLayout from '../components/BaseLayout';

// Mock document.documentElement.lang
Object.defineProperty(document, 'documentElement', {
  writable: true,
  value: { lang: 'en' },
});

// Mock the i18n hook
vi.mock('../i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    lang: 'en',
  }),
}));

// Mock child components
vi.mock('../components/Navigation', () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}));

vi.mock('../components/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('../components/SkipLink', () => ({
  default: () => <a href="#main-content" data-testid="skip-link">Skip to content</a>,
}));

vi.mock('../components/ScrollToTop', () => ({
  ScrollToTop: () => <button data-testid="scroll-to-top">Scroll to top</button>,
}));

vi.mock('../components/ScrollProgress', () => ({
  default: () => <div data-testid="scroll-progress">Scroll Progress</div>,
}));

describe('BaseLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <BaseLayout>
        <div data-testid="child-element">Test Child</div>
      </BaseLayout>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByTestId('child-element')).toHaveTextContent('Test Child');
  });

  it('applies correct default classes', () => {
    render(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    // Check that main content is rendered
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('accepts and applies custom className', () => {
    render(
      <BaseLayout className="custom-class">
        <div>Test Content</div>
      </BaseLayout>
    );

    // Check if the custom class is applied somewhere in the layout
    expect(document.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders navigation by default', () => {
    render(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('renders footer by default', () => {
    render(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders skip link by default', () => {
    render(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    expect(screen.getByTestId('skip-link')).toBeInTheDocument();
  });

  it('can hide optional components', () => {
    render(
      <BaseLayout 
        showNavigation={false} 
        showFooter={false} 
        showSkipLink={false}
        showScrollToTop={false}
      >
        <div data-testid="child">Test Content</div>
      </BaseLayout>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('navigation')).not.toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('skip-link')).not.toBeInTheDocument();
  });
});
