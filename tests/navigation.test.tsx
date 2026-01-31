import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from '../components/Navigation';
import { I18nProvider } from '../i18n';
import { describe, it, expect, vi } from 'vitest';

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nProvider>{component}</I18nProvider>);
};

describe('Navigation', () => {
  it('renders the logo', () => {
    renderWithI18n(<Navigation />);
    expect(screen.getByText('ARTEM.DEV')).toBeInTheDocument();
  });

  it('renders all nav links', () => {
    renderWithI18n(<Navigation />);
    expect(screen.getByText('HOME')).toBeInTheDocument();
    expect(screen.getByText('WORK')).toBeInTheDocument();
    expect(screen.getByText('LAB')).toBeInTheDocument();
    expect(screen.getByText('STACK')).toBeInTheDocument();
    expect(screen.getByText('ABOUT')).toBeInTheDocument();
    expect(screen.getByText('CONTACT')).toBeInTheDocument();
  });

  it('renders language switcher buttons', () => {
    renderWithI18n(<Navigation />);
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('RU')).toBeInTheDocument();
    expect(screen.getByText('CS')).toBeInTheDocument();
  });

  it('has correct href attributes for nav links', () => {
    renderWithI18n(<Navigation />);
    const homeLink = screen.getByText('HOME').closest('a');
    expect(homeLink).toHaveAttribute('href', '#home');
    
    const worksLink = screen.getByText('WORKS').closest('a');
    expect(worksLink).toHaveAttribute('href', '#works');
  });
});
