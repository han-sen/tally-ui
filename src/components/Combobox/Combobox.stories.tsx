import type { Meta, StoryObj } from '@storybook/react-vite';

import { Combobox } from './Combobox';

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Peach'];

interface Article {
  id: string;
  title: string;
}

// Titles with spaces and symbols, to check that option ids stay valid.
const articles: Article[] = [
  { id: 'Toyota Camry', title: 'Toyota Camry' },
  { id: 'Honda Accord', title: 'Honda Accord' },
  { id: 'Ford F-150', title: 'Ford F-150' },
  { id: 'C++ (programming language)', title: 'C++ (programming language)' },
];

// `typeof Combobox<string>` picks T = string, so `items` and `getLabel` are
// typed in args. Stories with other item types use `render` instead.
const meta: Meta<typeof Combobox<string>> = {
  title: 'Components/Combobox',
  component: Combobox<string>,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Fruit',
    items: fruits,
    getLabel: (fruit) => fruit,
    getKey: (fruit) => fruit,
  },
};
export default meta;

type Story = StoryObj<typeof Combobox<string>>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Search fruit…',
  },
};

export const CustomId: Story = {
  args: {
    id: 'favorite-fruit',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ObjectItems: Story = {
  render: () => (
    <Combobox
      label="Article"
      placeholder="Toyota Camry"
      items={articles}
      getLabel={(article) => article.title}
      getKey={(article) => article.id}
    />
  ),
};
