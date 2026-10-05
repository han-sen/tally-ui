import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Tabs } from './Tabs';

function renderTabs(
  props: {
    onContactClick?: () => void;
    contactClassName?: string;
  } = {},
) {
  const ref = createRef<HTMLButtonElement>();
  render(
    <Tabs defaultValue="account">
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

  it('links the active tab and its panel', () => {
    renderTabs();

    const trigger = screen.getByRole('tab', { name: 'Account' });
    const panel = screen.getByRole('tabpanel');

    expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
  });

  it('names the panel after its tab', () => {
    renderTabs();

    // The panel's name comes from its tab ("Account"), not its content ("Account page")
    expect(
      screen.getByRole('tabpanel', { name: 'Account' }),
    ).toBeInTheDocument();
  });

  it('sets aria-controls only on the active tab', async () => {
    const user = userEvent.setup();
    renderTabs();

    const account = screen.getByRole('tab', { name: 'Account' });
    const contact = screen.getByRole('tab', { name: 'Contact' });
    // Inactive panels ('contact') aren't rendered, so there is nothing to point at
    expect(account).toHaveAttribute('aria-controls');
    expect(contact).not.toHaveAttribute('aria-controls');

    await user.click(contact);

    expect(contact).toHaveAttribute('aria-controls');
    expect(account).not.toHaveAttribute('aria-controls');
  });

  it('links tabs whose value contains a space', () => {
    render(
      <Tabs defaultValue="page views">
        <Tabs.List>
          <Tabs.Trigger value="page views">Page views</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="page views">Chart</Tabs.Content>
      </Tabs>,
    );

    const trigger = screen.getByRole('tab', { name: 'Page views' });
    const panel = screen.getByRole('tabpanel', { name: 'Page views' });

    // A space would split the id reference in two
    expect(trigger.id).not.toContain(' ');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
  });

  it('makes the panel focusable by default', () => {
    renderTabs();

    expect(screen.getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
  });

  it('lets a consumer override the panel tabIndex', () => {
    render(
      <Tabs defaultValue="account">
        <Tabs.List>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="account" tabIndex={-1}>
          <button type="button">Edit</button>
        </Tabs.Content>
      </Tabs>,
    );

    expect(screen.getByRole('tabpanel')).toHaveAttribute('tabindex', '-1');
  });
});
