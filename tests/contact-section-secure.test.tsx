import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactSectionSecure from '../components/ContactSectionSecure';
import { vi } from 'vitest';

describe('ContactSectionSecure', () => {
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

    await userEvent.type(screen.getByLabelText(/name/i), 'Artem');
    await userEvent.type(screen.getByLabelText(/email/i), 'artem@example.com');
    await userEvent.type(screen.getByLabelText(/^message$/i), 'Hello, I need a website.');

    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/message sent/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
