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
    placeholder: 'Toyota Camry',
  },
};

export const WithLabel: Story = {
  args: {
    'aria-label': undefined,
    id: 'article',
    placeholder: 'Toyota Camry',
  },
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <label htmlFor="article" className="text-sm font-medium">
        Article
      </label>
      <Input {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Honda Accord',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Honda Accord',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'Honda Accord',
  },
};

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'Not an article',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search articles',
  },
};
