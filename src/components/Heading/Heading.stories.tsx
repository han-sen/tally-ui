import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: {
    level: 2,
    children: 'Compared articles',
  },
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {};

/** Each level at its default size. */
export const Levels: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
      <Heading level={5}>Heading level 5</Heading>
      <Heading level={6}>Heading level 6</Heading>
    </div>
  ),
};

/** `size` changes the look; `level` keeps the outline correct. */
export const SizeIndependentOfLevel: Story = {
  args: {
    level: 2,
    size: 'sm',
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    size: 'sm',
  },
};
