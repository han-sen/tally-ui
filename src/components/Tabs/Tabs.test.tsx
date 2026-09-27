import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Tabs } from './Tabs';

function renderTabs(
  props: {
    onContactClick?: () => void;
    contactClassName?: string;
    glow?: boolean;
  } = {},
) {
  const ref = createRef<HTMLButtonElement>();
  render(
    <Tabs defaultValue="account" glow={props.glow}>
      <Tabs.List>
        <Tabs.Trigger value="account" ref={ref}>
          Account
        </Tabs.Trigger>
        <Tabs.Trigger
          value="contact"
          onClick={props.onContactClick}
          className={props.contactClassName}
        >
          Contact
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Account page</Tabs.Content>
      <Tabs.Content value="contact">Contact page</Tabs.Content>
    </Tabs>,
  );
  return { ref };
}

describe('Tabs', () => {
  it('shows only the content matching defaultValue', () => {
    renderTabs();

    expect(screen.getByText('Account page')).toBeInTheDocument();
    expect(screen.queryByText('Contact page')).not.toBeInTheDocument();
  });

  it('switches content when another trigger is clicked', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: 'Contact' }));

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Contact page');
    expect(screen.queryByText('Account page')).not.toBeInTheDocument();
  });

  it('marks only the active trigger as aria-selected', async () => {
    const user = userEvent.setup();
    renderTabs();

    const account = screen.getByRole('tab', { name: 'Account' });
    const contact = screen.getByRole('tab', { name: 'Contact' });
    expect(account).toHaveAttribute('aria-selected', 'true');
    expect(contact).toHaveAttribute('aria-selected', 'false');

    await user.click(contact);

    expect(account).toHaveAttribute('aria-selected', 'false');
    expect(contact).toHaveAttribute('aria-selected', 'true');
  });

  it('exposes a tablist containing the tabs', () => {
    renderTabs();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('calls a consumer onClick and still switches tabs', async () => {
    const onContactClick = vi.fn();
    const user = userEvent.setup();
    renderTabs({ onContactClick });

    await user.click(screen.getByRole('tab', { name: 'Contact' }));

    expect(onContactClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Contact page')).toBeInTheDocument();
  });

  it('merges a consumer className onto the trigger', () => {
    renderTabs({ contactClassName: 'custom-class' });
    expect(screen.getByRole('tab', { name: 'Contact' })).toHaveClass(
      'custom-class',
    );
  });

  it('forwards a ref to the trigger button', () => {
    const { ref } = renderTabs();
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('throws a clear error when a sub-component is used outside Tabs', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() =>
      render(<Tabs.Content value="account">Orphan</Tabs.Content>),
    ).toThrow('Tabs must be used inside <Tabs>');

    consoleError.mockRestore();
  });

  it('has no glow by default', () => {
    renderTabs();

    expect(screen.getByRole('tab', { name: 'Account' })).not.toHaveClass(
      'shadow-tally-glow',
    );
  });

  it('glows only the selected tab and moves the glow when it changes', async () => {
    const user = userEvent.setup();
    renderTabs({ glow: true });

    const account = screen.getByRole('tab', { name: 'Account' });
    const contact = screen.getByRole('tab', { name: 'Contact' });
    expect(account).toHaveClass('shadow-tally-glow', 'shadow-tally-primary/45');
    expect(contact).not.toHaveClass('shadow-tally-glow');

    await user.click(contact);

    expect(contact).toHaveClass('shadow-tally-glow', 'shadow-tally-primary/45');
    expect(account).not.toHaveClass('shadow-tally-glow');
  });
});
