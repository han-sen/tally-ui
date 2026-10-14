import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children:
      'Carrier data updates hourly, so the latest hour may be incomplete.',
  },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} size="lg" />
      <Text {...args} size="md" />
      <Text {...args} size="sm" />
      <Text {...args} size="xs" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text>Default text on a surface</Text>
      <Text variant="muted">Muted text for supporting details</Text>
      <Text variant="success">Shipments rose 4.2% this week</Text>
      <Text variant="danger">Shipments fell 1.1% this week</Text>
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} weight="normal" />
      <Text {...args} weight="medium" />
      <Text {...args} weight="semibold" />
    </div>
  ),
};

/** Mono with tabular digits, so numbers in a column line up. */
export const Mono: Story = {
  render: () => (
    <div className="flex flex-col items-end">
      {['48,210', '1,607', '27,771', '13,528'].map((n) => (
        <Text key={n} mono>
          {n}
        </Text>
      ))}
    </div>
  ),
};
