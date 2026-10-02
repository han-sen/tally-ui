import type { Meta, StoryObj } from '@storybook/react-vite';

import { RadioGroup } from './RadioGroup';

const ranges = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

const meta: Meta<typeof RadioGroup<string>> = {
  title: 'Components/RadioGroup',
  component: RadioGroup<string>,
  tags: ['autodocs'],
  args: {
    label: 'Date range',
    options: ranges,
    defaultValue: '30',
  },
};
export default meta;

type Story = StoryObj<typeof RadioGroup<string>>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const WithDescriptions: Story = {
  args: {
    label: 'Sort articles by',
    defaultValue: 'total',
    options: [
      {
        value: 'total',
        label: 'Total views',
        description: 'All views in the date range',
      },
      {
        value: 'change',
        label: 'Change',
        description: 'Rise or fall since the previous range',
      },
      { value: 'name', label: 'Name', description: 'Alphabetical by title' },
    ],
  },
};

/** The label is still read by screen readers. */
export const HiddenLabel: Story = {
  args: {
    hideLabel: true,
    orientation: 'horizontal',
  },
};

export const DisabledOption: Story = {
  args: {
    options: [...ranges, { value: '365', label: '1 year', disabled: true }],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
