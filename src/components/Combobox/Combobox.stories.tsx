import type { Meta, StoryObj } from '@storybook/react-vite';

import { Combobox } from './Combobox';

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Peach'];

interface Article {
  id: string;
  title: string;
  views: number;
}

// Titles with spaces and symbols, to check that option ids stay valid.
const articles: Article[] = [
  { id: 'Toyota Camry', title: 'Toyota Camry', views: 48210 },
  { id: 'Honda Accord', title: 'Honda Accord', views: 39874 },
  { id: 'Ford F-150', title: 'Ford F-150', views: 61532 },
  {
    id: 'C++ (programming language)',
    title: 'C++ (programming language)',
    views: 27103,
  },
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

/** The label is still read by screen readers; the placeholder says what the field is for. */
export const HiddenLabel: Story = {
  args: {
    hideLabel: true,
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

/** Type anything to open the panel and see the loading rows. */
export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

/** Type something that matches no fruit, like "zzz". */
export const WithEmptyMessage: Story = {
  args: {
    emptyMessage: 'No fruit found',
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

/** Custom rows via `renderItem`; the option is still announced by its title. */
export const CustomRows: Story = {
  render: () => (
    <Combobox
      label="Article"
      placeholder="Type a letter, like o"
      items={articles}
      getLabel={(article) => article.title}
      getKey={(article) => article.id}
      renderItem={(article, { selected }) => (
        <span className="flex items-center justify-between gap-3">
          <span className="truncate">
            {selected ? '✓ ' : ''}
            {article.title}
          </span>
          <span className="shrink-0 font-mono text-xs font-normal text-tally-muted-fg">
            {article.views.toLocaleString()}
          </span>
        </span>
      )}
    />
  ),
};
