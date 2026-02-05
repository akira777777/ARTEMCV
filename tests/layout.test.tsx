import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BaseLayout from '../components/BaseLayout';
import { I18nProvider } from '../i18n';
import { MemoryRouter } from 'react-router-dom';

describe('BaseLayout', () => {
  const renderWithI18n = (component: React.ReactElement) => {
    return render(
      <I18nProvider>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </I18nProvider>
    );
  };

  it('renders children correctly', () => {
    renderWithI18n(
      <BaseLayout>
        <div data-testid="child-element">Test Child</div>
      </BaseLayout>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByTestId('child-element')).toHaveTextContent('Test Child');
  });

  it('applies correct default classes', () => {
    renderWithI18n(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    expect(document.querySelector('.bg-\\[\\#0a0a0a\\]')).toBeInTheDocument(); // escaped class selector
  });

  it('accepts and applies custom className', () => {
    renderWithI18n(
      <BaseLayout className="custom-class">
        <div>Test Content</div>
      </BaseLayout>
    );

    // Check if the custom class is applied somewhere in the layout
    expect(document.querySelector('.custom-class')).toBeInTheDocument();
  });
});