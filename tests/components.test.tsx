import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactSectionEnhanced } from '../src/components/ContactSectionEnhanced';
import { sendContactForm } from '../src/lib/api-client';
import { describe, it, expect, vi } from 'vitest';

// Mock the api-client
vi.mock('../src/lib/api-client', () => ({
  sendContactForm: vi.fn(),
}));

describe('ContactSectionEnhanced', () => {
  const mockSendContactForm = vi.mocked(sendContactForm);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the contact form correctly', () => {
    render(<ContactSectionEnhanced />);

    expect(screen.getByText('Ready to build your next Webflow experience?')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('submits the form with correct data and shows success message', async () => {
    const user = userEvent.setup();
    mockSendContactForm.mockResolvedValue({ success: true });

    render(<ContactSectionEnhanced />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello, I want a website!');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(mockSendContactForm).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, I want a website!',
      });
    });

    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    expect(screen.getByText(/we've received your message/i)).toBeInTheDocument();
  });

  it('shows error message when submission fails', async () => {
    const user = userEvent.setup();
    mockSendContactForm.mockResolvedValue({ success: false });

    render(<ContactSectionEnhanced />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello!');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<ContactSectionEnhanced />);

    const submitButton = screen.getByRole('button', { name: /send message/i });

    // Attempt to submit empty form
    fireEvent.click(submitButton);

    // sendContactForm should not have been called because of HTML5 validation (required attribute)
    // In a jsdom environment, we can check if the form is valid or if it prevented submission.
    // However, fireEvent.click on a button in a form doesn't always trigger HTML5 validation in JSDOM the same way a browser does.
    // But we can check that it hasn't been called.
    expect(mockSendContactForm).not.toHaveBeenCalled();
  });
});
