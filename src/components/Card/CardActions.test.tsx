import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Card } from './Card';

function renderCard(props: { onExport?: () => void } = {}) {
  render(
    <>
      <Card>
        <Card.Header
          actions={
            <>
              <button type="button" onClick={props.onExport}>
                Export
              </button>
              <button type="button">Remove</button>
            </>
          }
        >
          <Card.Title>Total views</Card.Title>
        </Card.Header>
      </Card>
      <button type="button">Outside</button>
    </>,
  );
  return { trigger: screen.getByRole('button', { name: 'More actions' }) };
}

describe('Card.Header actions', () => {
  it('shows no actions button without actions', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Total views</Card.Title>
        </Card.Header>
      </Card>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('uses actionsLabel as the button name', () => {
    render(
      <Card>
        <Card.Header actionsLabel="Total views actions" actions="Export">
          <Card.Title>Total views</Card.Title>
        </Card.Header>
      </Card>,
    );

    expect(
      screen.getByRole('button', { name: 'Total views actions' }),
    ).toBeInTheDocument();
  });

  it('starts closed and opens on click', async () => {
    const user = userEvent.setup();
    const { trigger } = renderCard();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Export')).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Export' })).toBeVisible();
    expect(trigger).toHaveAttribute(
      'aria-controls',
      screen.getByRole('button', { name: 'Export' }).parentElement?.id,
    );
  });

  it('toggles closed on a second click', async () => {
    const user = userEvent.setup();
    const { trigger } = renderCard();

    await user.click(trigger);
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on Escape and returns focus to the button', async () => {
    const user = userEvent.setup();
    const { trigger } = renderCard();

    await user.click(trigger);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Export' })).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('closes on a click outside', async () => {
    const user = userEvent.setup();
    const { trigger } = renderCard();

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes when focus tabs out of the popup', async () => {
    const user = userEvent.setup();
    const { trigger } = renderCard();

    await user.click(trigger);
    await user.tab(); // Export
    await user.tab(); // Remove
    await user.tab(); // Outside

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('runs an action and then closes', async () => {
    const onExport = vi.fn();
    const user = userEvent.setup();
    const { trigger } = renderCard({ onExport });

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Export' }));

    expect(onExport).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
