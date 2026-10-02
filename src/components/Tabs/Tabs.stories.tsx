import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const ExampleTabs: Story = {
  args: {
    defaultValue: 'account',
  },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="contact">Contact</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        <p>Account page</p>
      </Tabs.Content>
      <Tabs.Content value="contact">
        <p>Contact page</p>
      </Tabs.Content>
    </Tabs>
  ),
};

export const SwitchesTabOnClick: Story = {
  ...ExampleTabs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Account page')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('tab', { name: 'Contact' }));

    expect(canvas.getByText('Contact page')).toBeInTheDocument();
    expect(canvas.queryByText('Account page')).not.toBeInTheDocument();
  },
};
