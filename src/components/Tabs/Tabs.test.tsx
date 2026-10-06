import { createRef, type KeyboardEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Tabs, type TabsActivationMode } from './Tabs';

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

  it('puts only the active tab in the Tab order', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.tab();
    expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();

    // Tab skips the inactive Contact tab and moves on to the panel
    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('keeps the trigger tabIndex even if a consumer passes one', () => {
    render(
      <Tabs defaultValue="account">
        <Tabs.List>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="contact" tabIndex={0}>
            Contact
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="account">Account page</Tabs.Content>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Contact' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  describe('keyboard navigation', () => {
    function renderThreeTabs(
      props: {
        activationMode?: TabsActivationMode;
        billingDisabled?: boolean;
        onListKeyDown?: (event: KeyboardEvent) => void;
      } = {},
    ) {
      render(
        <Tabs defaultValue="account" activationMode={props.activationMode}>
          <Tabs.List onKeyDown={props.onListKeyDown}>
            <Tabs.Trigger value="account">Account</Tabs.Trigger>
            <Tabs.Trigger value="billing" disabled={props.billingDisabled}>
              Billing
            </Tabs.Trigger>
            <Tabs.Trigger value="contact">Contact</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="account">Account page</Tabs.Content>
          <Tabs.Content value="billing">Billing page</Tabs.Content>
          <Tabs.Content value="contact">Contact page</Tabs.Content>
        </Tabs>,
      );
      return {
        account: screen.getByRole('tab', { name: 'Account' }),
        billing: screen.getByRole('tab', { name: 'Billing' }),
        contact: screen.getByRole('tab', { name: 'Contact' }),
      };
    }

    it('moves focus with ArrowRight and wraps from the last tab', async () => {
      const user = userEvent.setup();
      const { account, billing, contact } = renderThreeTabs();

      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(billing).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(contact).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(account).toHaveFocus();
    });

    it('moves focus with ArrowLeft and wraps from the first tab', async () => {
      const user = userEvent.setup();
      const { account, billing, contact } = renderThreeTabs();

      await user.tab();
      await user.keyboard('{ArrowLeft}');
      expect(contact).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(billing).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(account).toHaveFocus();
    });

    it('jumps to the last tab with End and the first with Home', async () => {
      const user = userEvent.setup();
      const { account, contact } = renderThreeTabs();

      await user.tab();
      await user.keyboard('{End}');
      expect(contact).toHaveFocus();
      await user.keyboard('{Home}');
      expect(account).toHaveFocus();
    });

    it('skips disabled tabs', async () => {
      const user = userEvent.setup();
      const { account, contact } = renderThreeTabs({ billingDisabled: true });

      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(contact).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(account).toHaveFocus();
    });

    it('lets a consumer onKeyDown cancel the navigation', async () => {
      const user = userEvent.setup();
      const onListKeyDown = vi.fn((event: KeyboardEvent) =>
        event.preventDefault(),
      );
      const { account } = renderThreeTabs({ onListKeyDown });

      await user.tab();
      await user.keyboard('{ArrowRight}');

      expect(onListKeyDown).toHaveBeenCalled();
      expect(account).toHaveFocus();
    });

    it('selects the focused tab in automatic mode (the default)', async () => {
      const user = userEvent.setup();
      const { billing } = renderThreeTabs();

      await user.tab();
      await user.keyboard('{ArrowRight}');

      expect(billing).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Billing page');
    });

    it('only moves focus in manual mode until Enter selects', async () => {
      const user = userEvent.setup();
      const { account, billing } = renderThreeTabs({
        activationMode: 'manual',
      });

      await user.tab();
      await user.keyboard('{ArrowRight}');

      expect(billing).toHaveFocus();
      expect(account).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Account page');

      await user.keyboard('{Enter}');

      expect(billing).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Billing page');
    });

    it('selects with Space in manual mode', async () => {
      const user = userEvent.setup();
      const { contact } = renderThreeTabs({ activationMode: 'manual' });

      await user.tab();
      await user.keyboard('{End}');
      await user.keyboard(' ');

      expect(contact).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Contact page');
    });
  });
});
