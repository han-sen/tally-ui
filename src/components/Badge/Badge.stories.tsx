import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const ExampleBadge: Story = {
  args: {
    variant: 'primary',
    children: 'Test',
  },
};

export const SuccessBadge: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const DangerBadge: Story = {
  args: {
    variant: 'danger',
    children: 'Danger',
  },
};

export const WarningBadge: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const InfoBadge: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};
