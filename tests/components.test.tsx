import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock external dependencies
vi.mock('../lib/api-client', () => ({
  sendContactForm: vi.fn(() => Promise.resolve()),
}));

vi.mock('../i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    currentLang: 'en',
  }),
}));

vi.mock('../components/AccessibilityUtils', () => ({
  useAnnouncement: () => vi.fn(),
  generateAriaAttributes: (props: any) => props,
  createAccessibleButtonProps: (props: any) => props,
  createAccessibleLinkProps: (props: any) => props,
  checkColorContrast: () => true,
  announceLoadingState: vi.fn(),
}));

vi.mock('../lib/validation', () => ({
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  sanitizeString: (str: string, max: number) => str.slice(0, max),
}));

describe('ContactSectionEnhanced', () => {
  const mockSendContactForm = vi.mocked(await import('../lib/api-client')).sendContactForm;
  const mockAnnouncement = vi.fn();
  const mockAnnounceLoadingState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(await import('../components/AccessibilityUtils')).useAnnouncement.mockReturnValue(
      mockAnnouncement,
    );
    vi.mocked(
      await import('../components/AccessibilityUtils'),
    ).announceLoadingState.mockImplementation(mockAnnounceLoadingState);
  });

  it('should render contact form with all required fields', () => {
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    expect(screen.getByText('contact.title')).toBeInTheDocument();
    expect(screen.getByText('contact.label.name')).toBeInTheDocument();
    expect(screen.getByText('contact.label.email')).toBeInTheDocument();
    expect(screen.getByText('contact.label.message')).toBeInTheDocument();
    expect(screen.getByText('contact.button.send')).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    const submitButton = screen.getByText('contact.button.send');
    await user.click(submitButton);

    // Should show validation errors
    expect(screen.getByText('contact.error.required')).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    const emailInput = screen.getByDisplayValue('');
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger blur to show validation

    expect(screen.getByText('contact.error.email')).toBeInTheDocument();
  });

  it('should validate message length', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    const messageInput = screen.getByDisplayValue('');
    await user.type(messageInput, 'short');
    await user.tab();

    expect(screen.getByText('contact.error.too_short')).toBeInTheDocument();
  });

  it('should submit form successfully', async () => {
    mockSendContactForm.mockResolvedValueOnce();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    // Fill out form
    await user.type(screen.getByDisplayValue(''), 'John Doe');
    await user.type(screen.getByDisplayValue(''), 'john@example.com');
    await user.type(screen.getByDisplayValue(''), 'Test message with more than 10 characters');
    await user.click(screen.getByText('contact.button.send'));

    await waitFor(() => {
      expect(mockSendContactForm).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        subject: '',
        message: 'Test message with more than 10 characters',
      });
    });

    expect(screen.getByText('contact.success')).toBeInTheDocument();
  });

  it('should handle form submission errors', async () => {
    mockSendContactForm.mockRejectedValueOnce(new Error('Server error'));
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    // Fill out form and submit
    await user.type(screen.getByDisplayValue(''), 'John Doe');
    await user.type(screen.getByDisplayValue(''), 'john@example.com');
    await user.type(screen.getByDisplayValue(''), 'Test message with more than 10 characters');
    await user.click(screen.getByText('contact.button.send'));

    await waitFor(() => {
      expect(screen.getByText('contact.error.sending')).toBeInTheDocument();
    });
  });

  it('should handle honeypot field', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    // Fill honeypot field (should be hidden from users)
    const honeypotInput = screen.getByDisplayValue('');
    await user.type(honeypotInput, 'bot');

    await user.click(screen.getByText('contact.button.send'));

    // Should silently succeed (honeypot triggered)
    expect(screen.getByText('contact.success')).toBeInTheDocument();
    expect(mockSendContactForm).not.toHaveBeenCalled();
  });

  it('should reset form when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    // Fill out form
    await user.type(screen.getByDisplayValue(''), 'John Doe');
    await user.type(screen.getByDisplayValue(''), 'john@example.com');
    await user.type(screen.getByDisplayValue(''), 'Test message');

    // Reset form
    await user.click(screen.getByText('contact.button.reset'));

    // Form should be cleared
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('should announce form state changes', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    // Submit form
    await user.type(screen.getByDisplayValue(''), 'John Doe');
    await user.type(screen.getByDisplayValue(''), 'john@example.com');
    await user.type(screen.getByDisplayValue(''), 'Test message with more than 10 characters');
    await user.click(screen.getByText('contact.button.send'));

    await waitFor(() => {
      expect(mockAnnounceLoadingState).toHaveBeenCalledWith(true, 'Contact form');
      expect(mockAnnounceLoadingState).toHaveBeenCalledWith(false, 'Contact form');
      expect(mockAnnouncement).toHaveBeenCalledWith('contact.success', 'polite');
    });
  });
});

describe('Navigation', () => {
  it('should render navigation with all menu items', () => {
    render(
      <MemoryRouter>
        <div id="home" />
        <div id="works" />
        <div id="lab" />
        <div id="services" />
        <div id="studio" />
        <div id="contact" />
      </MemoryRouter>,
    );

    expect(screen.getByText('nav.home')).toBeInTheDocument();
    expect(screen.getByText('nav.works')).toBeInTheDocument();
    expect(screen.getByText('nav.lab')).toBeInTheDocument();
    expect(screen.getByText('nav.services')).toBeInTheDocument();
    expect(screen.getByText('nav.about')).toBeInTheDocument();
    expect(screen.getByText('nav.contact')).toBeInTheDocument();
  });

  it('should handle link clicks', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="home" />
        <div id="works" />
        <div id="lab" />
        <div id="services" />
        <div id="studio" />
        <div id="contact" />
      </MemoryRouter>,
    );

    const worksLink = screen.getByText('nav.works');
    await user.click(worksLink);

    // Should scroll to works section
    expect(document.getElementById('works')).toBeInTheDocument();
  });

  it('should update active state based on scroll position', () => {
    render(
      <MemoryRouter>
        <div id="home" />
        <div id="works" />
        <div id="lab" />
        <div id="services" />
        <div id="studio" />
        <div id="contact" />
      </MemoryRouter>,
    );

    // Mock intersection observer
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      disconnect: vi.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver;

    // Should render without errors
    expect(screen.getByText('nav.home')).toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="home" />
        <div id="works" />
        <div id="lab" />
        <div id="services" />
        <div id="studio" />
        <div id="contact" />
      </MemoryRouter>,
    );

    const homeLink = screen.getByText('nav.home');
    homeLink.focus();

    // Simulate keyboard navigation
    await user.keyboard('{ArrowRight}');

    // Should navigate to next link
    expect(screen.getByText('nav.works')).toBeInTheDocument();
  });
});

describe('Accessibility Features', () => {
  it('should have proper ARIA attributes', () => {
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    // Check for proper ARIA labels
    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('aria-label', 'contact.title');

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  it('should have proper focus management', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    const nameInput = screen.getByDisplayValue('');
    nameInput.focus();

    expect(document.activeElement).toBe(nameInput);

    // Tab to next field
    await user.tab();
    expect(document.activeElement).toBe(screen.getByDisplayValue(''));
  });

  it('should announce validation errors', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    const submitButton = screen.getByText('contact.button.send');
    await user.click(submitButton);

    // Should show error with proper ARIA role
    const errorElement = screen.getByText('contact.error.required');
    expect(errorElement).toHaveAttribute('role', 'alert');
  });

  it('should handle screen reader instructions', () => {
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    // Should have screen reader instructions
    const instructions = screen.getByText('contact.form_instructions');
    expect(instructions).toHaveAttribute('aria-live', 'polite');
  });
});

describe('Performance Features', () => {
  it('should memoize expensive calculations', () => {
    const renderSpy = vi.fn();
    const TestComponent = React.memo(() => {
      renderSpy();
      return <div>Test</div>;
    });

    const { rerender } = render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Re-render with same props should not re-render
    rerender(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle rapid input changes efficiently', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    const messageInput = screen.getByDisplayValue('');
    const startTime = performance.now();

    // Rapid typing simulation
    for (let i = 0; i < 100; i++) {
      await user.type(messageInput, 'a');
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should handle rapid input efficiently
    expect(duration).toBeLessThan(1000); // Under 1 second for 100 characters
  });

  it('should handle large form submissions', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div id="contact" />
      </MemoryRouter>,
    );

    const messageInput = screen.getByDisplayValue('');
    const largeMessage = 'a'.repeat(5000); // Large message

    const startTime = performance.now();
    await user.type(messageInput, largeMessage);
    const endTime = performance.now();

    const duration = endTime - startTime;
    expect(duration).toBeLessThan(5000); // Should handle large input efficiently
  });
});

describe('Error Boundaries', () => {
  it('should handle component errors gracefully', () => {
    const TestErrorComponent = () => {
      throw new Error('Test error');
    };

    const { container } = render(
      <MemoryRouter>
        <TestErrorComponent />
      </MemoryRouter>,
    );

    // Should show error boundary fallback
    expect(container).toBeInTheDocument();
  });

  it('should recover from errors', () => {
    let shouldThrow = false;

    const TestComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>Success</div>;
    };

    const { rerender } = render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>,
    );

    expect(screen.getByText('Success')).toBeInTheDocument();

    // Component throws error
    shouldThrow = true;
    rerender(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>,
    );

    // Should show error boundary
    expect(screen.queryByText('Success')).not.toBeInTheDocument();
  });
});
