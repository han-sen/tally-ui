import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge, type BadgeProps } from '../components/Badge/Badge';
import { Card } from '../components/Card/Card';

const meta: Meta = {
  title: 'Project/Roadmap',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

type Status = 'shipped' | 'in-progress' | 'planned';

interface RoadmapItem {
  name: string;
  description: string;
}

interface RoadmapSection {
  status: Status;
  title: string;
  description: string;
  items: RoadmapItem[];
}

const statusBadge: Record<
  Status,
  { label: string; variant: BadgeProps['variant'] }
> = {
  shipped: { label: 'Shipped', variant: 'success' },
  'in-progress': { label: 'In progress', variant: 'info' },
  planned: { label: 'Planned', variant: 'primary' },
};

// Keep this list current: move items between sections as work lands, and add
// new ideas to "Planned".
const sections: RoadmapSection[] = [
  {
    status: 'in-progress',
    title: 'Building now',
    description: 'Being built now, on its own branch.',
    items: [
      {
        name: 'LineChart',
        description:
          'Several series over time, with a hover crosshair and tooltip that are also reachable by keyboard.',
      },
    ],
  },
  {
    status: 'planned',
    title: 'Next components',
    description: 'Next up, roughly in order.',
    items: [
      {
        name: 'Legend',
        description: "Color swatches and labels that key a chart's series.",
      },
      {
        name: 'DataTable',
        description: 'Typed columns and sorting, built on Table.',
      },
      {
        name: 'DescriptionList',
        description: 'Label and value pairs for detail panels.',
      },
    ],
  },
  {
    status: 'planned',
    title: 'Improvements',
    description: 'Changes to what already exists.',
    items: [
      {
        name: 'Dark mode',
        description:
          'A dark set of the same tokens; components need no changes.',
      },
      {
        name: 'Tabs keyboard navigation',
        description:
          'Arrow keys move between tabs, as the ARIA pattern expects.',
      },
      {
        name: 'Accessible chart data',
        description:
          'Charts expose their numbers as a table for screen readers, not only a summary label.',
      },
      {
        name: 'Ref forwarding on Combobox',
        description: 'Pass a ref to reach the input, like the other controls.',
      },
    ],
  },
  {
    status: 'planned',
    title: 'Built for AI agents',
    description:
      'The goal behind the library: an agent should be able to build a real app from it without guessing.',
    items: [
      {
        name: 'Agent-facing docs',
        description:
          'A machine-readable manifest of components, props, and examples, so agents read the API instead of inventing it.',
      },
      {
        name: 'The experiment',
        description:
          'A fresh agent builds the Attention Tracker app from the installed package alone. Invented props, type errors, and accessibility results are measured against a baseline, and the write-up is published here.',
      },
    ],
  },
  {
    status: 'shipped',
    title: 'Available today',
    description:
      'Each has stories, tests, and JSDoc. See them under Components.',
    items: [
      {
        name: 'Combobox',
        description:
          'Searchable select with async results, loading and empty states, and full keyboard support.',
      },
      {
        name: 'RadioGroup',
        description:
          'Pick one option, like a date range, in a column or a row. Built on native radios.',
      },
      {
        name: 'Text and Heading',
        description:
          'Type scale and text colors as components, with heading level kept separate from size.',
      },
      {
        name: 'ProgressBar',
        description:
          'A labelled bar for shares and goals, in the bright chart colors.',
      },
      {
        name: 'BarChart and Sparkline',
        description: 'D3 scales rendered as React SVG.',
      },
      {
        name: 'StatCard',
        description:
          'A headline number with a trend, a loading state, and an actions menu.',
      },
      {
        name: 'Table',
        description: 'Styled, accessible table parts.',
      },
      {
        name: 'Tabs',
        description: 'Compound tabs that also work from Server Components.',
      },
      {
        name: 'Button, Input, Badge, Alert, Card',
        description:
          'The core controls and containers. Card headers can hold an actions menu.',
      },
      {
        name: 'Skeleton and EmptyState',
        description: 'Loading placeholders and "nothing here" states.',
      },
      {
        name: 'Tokens',
        description:
          'Prefixed color, radius, and shadow tokens, with a live WCAG contrast audit under Foundations/Colors.',
      },
    ],
  },
];

export const Roadmap: Story = {
  render: () => (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 text-tally-surface-fg">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Roadmap</h1>
        <p className="text-tally-muted-fg">
          Tally UI is in active development. This page lists what is shipped,
          what is being built, and what comes next.
        </p>
      </header>

      {sections.map((section) => {
        const badge = statusBadge[section.status];
        return (
          <Card key={section.title}>
            <Card.Header>
              <div className="flex items-center gap-3">
                <Card.Title>
                  <h2>{section.title}</h2>
                </Card.Title>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
              <Card.Description>{section.description}</Card.Description>
            </Card.Header>
            <Card.Content>
              <ul className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <li key={item.name} className="flex flex-col gap-0.5">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-tally-muted-fg">
                      {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        );
      })}
    </div>
  ),
};
