import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlowCard } from '../components/EnhancedElements';
import { vi, test, expect } from 'vitest';
import React from 'react';

test('GlowCard render count on mouse move', async () => {
  const onRender = vi.fn();
  const user = userEvent.setup();

  // Mock getBoundingClientRect
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 200,
    height: 200,
    top: 0,
    left: 0,
    bottom: 200,
    right: 200,
    x: 0,
    y: 0,
    toJSON: () => {}
  }));

  try {
    render(
      <React.Profiler id="GlowCard" onRender={onRender}>
        <GlowCard>Test Content</GlowCard>
      </React.Profiler>
    );

    const content = screen.getByText('Test Content');
    const card = content.closest('.relative.rounded-2xl');

    if (!card) throw new Error('Card not found');

    // Moves
    await user.pointer([
      { target: card, coords: { x: 10, y: 10 } },
      { target: card, coords: { x: 20, y: 20 } },
      { target: card, coords: { x: 30, y: 30 } },
    ]);

    console.log('Render Count:', onRender.mock.calls.length);

    // If userEvent works, we should see renders.
    expect(onRender.mock.calls.length).toBeLessThanOrEqual(3);

  } finally {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  }
});
