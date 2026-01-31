import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactSectionSecure from '../components/ContactSectionSecure';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ContactSectionSecure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<ContactSectionSecure />);

    const submit = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submit);

    expect(
      await screen.findByText(/please fill in all required fields/i)
    ).toBeInTheDocument();
  });

  it('submits valid form and shows success message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);

    render(<ContactSectionSecure />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Jules');
    await userEvent.type(screen.getByLabelText(/email/i), 'jules@example.com');
    await userEvent.type(screen.getByLabelText(/^message$/i), 'Hello, I need a website built for me.');

    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('displays error when email format is invalid', async () => {
    render(<ContactSectionSecure />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Jules');
    await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    await userEvent.type(screen.getByLabelText(/^message$/i), 'Hello, I need a website built.');

    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(
      await screen.findByText(/please enter a valid email/i)
    ).toBeInTheDocument();
  });
});
