import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BaseLayout from '../components/BaseLayout';
import { I18nProvider } from '../i18n';
import { MemoryRouter } from 'react-router-dom';

describe('BaseLayout', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <MemoryRouter>
        <I18nProvider>
          {ui}
        </I18nProvider>
      </MemoryRouter>
    );
  };

  it('renders children correctly', () => {
    renderWithProviders(
      <BaseLayout>
        <div data-testid="child-element">Test Child</div>
      </BaseLayout>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByTestId('child-element')).toHaveTextContent('Test Child');
  });

  it('applies correct default classes', () => {
    renderWithProviders(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    expect(document.querySelector('.bg-\\[\\#050505\\]') || document.querySelector('.bg-\\[\\#0a0a0a\\]')).toBeInTheDocument();
  });

  it('accepts and applies custom className', () => {
    renderWithProviders(
      <BaseLayout className="custom-class">
        <div>Test Content</div>
      </BaseLayout>
    );

    expect(document.querySelector('.custom-class')).toBeInTheDocument();
  });
});
