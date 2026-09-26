import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from '../Card/Card';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const TextLine: Story = {
  args: {
    className: 'h-4 w-48',
  },
};

export const Avatar: Story = {
  args: {
    className: 'size-10 rounded-full',
  },
};

export const LoadingStatCard: Story = {
  render: () => (
    <Card className="w-72" aria-busy="true">
      <span role="status" className="sr-only">
        Loading revenue
      </span>
      <Card.Header>
        <Skeleton className="h-4 w-24" />
      </Card.Header>
      <Card.Content className="flex flex-col gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-20" />
      </Card.Content>
    </Card>
  ),
};
