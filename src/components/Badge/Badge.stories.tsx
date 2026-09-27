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

export const Glow: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 bg-tally-surface p-6">
      <Badge variant="primary" glow>
        Primary
      </Badge>
      <Badge variant="success" glow>
        Success
      </Badge>
      <Badge variant="danger" glow>
        Danger
      </Badge>
      <Badge variant="warning" glow>
        Warning
      </Badge>
      <Badge variant="info" glow>
        Info
      </Badge>
    </div>
  ),
};
