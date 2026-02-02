import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BaseLayout from '../components/BaseLayout';

describe('BaseLayout', () => {
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

    const container = screen.getByRole('main', { hidden: true }); // might not have explicit role
    expect(document.querySelector('.bg-\\[\\#0a0a0a\\]')).toBeInTheDocument(); // escaped class selector
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
});