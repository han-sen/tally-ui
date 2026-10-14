import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Example input',
    className: 'w-64',
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'SHP-10482',
  },
};

export const WithLabel: Story = {
  args: {
    'aria-label': undefined,
    id: 'tracking-number',
    placeholder: 'SHP-10482',
  },
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <label htmlFor="tracking-number" className="text-sm font-medium">
        Tracking number
      </label>
      <Input {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    defaultValue: 'SHP-20931',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'SHP-20931',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'SHP-20931',
  },
};

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'SHP-20',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search shipments',
  },
};
