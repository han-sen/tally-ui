import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Share of views',
    value: 62,
  },
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    showLabel: true,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['primary', 'success', 'warning', 'danger', 'info'] as const).map(
        (variant, i) => (
          <ProgressBar
            key={variant}
            {...args}
            label={variant}
            value={80 - i * 15}
            variant={variant}
            showLabel
          />
        ),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <ProgressBar {...args} label="Small" size="sm" showLabel />
      <ProgressBar {...args} label="Medium" size="md" showLabel />
    </div>
  ),
};

/** A count out of a total, read and shown as a percentage. */
export const CustomMax: Story = {
  args: {
    label: 'Articles loaded',
    value: 3,
    max: 5,
    showLabel: true,
  },
};
