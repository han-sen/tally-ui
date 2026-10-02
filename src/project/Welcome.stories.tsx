import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { Badge } from '../components/Badge/Badge';
import { BarChart } from '../components/BarChart/BarChart';
import { Card } from '../components/Card/Card';
import { Heading } from '../components/Heading/Heading';
import { Sparkline } from '../components/Sparkline/Sparkline';
import { StatCard } from '../components/StatCard/StatCard';
import { Text } from '../components/Text/Text';

const meta: Meta = {
  title: 'Welcome',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

// Story pages render inside Storybook's iframe, so links to other pages go to
// the manager page next to it and open in the top window. Story ids live under
// /story/, autodocs pages (ids ending in --docs) under /docs/.
function storyHref(id: string) {
  const kind = id.endsWith('--docs') ? 'docs' : 'story';
  return `./?path=/${kind}/${id}`;
}

const linkClass =
  'font-medium text-tally-primary underline-offset-4 hover:underline ' +
  'focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-tally-ring focus-visible:outline-none';

function StoryLink({ id, children }: { id: string; children: ReactNode }) {
  return (
    <a href={storyHref(id)} target="_top" className={linkClass}>
      {children}
    </a>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
      {children}
    </a>
  );
}

// Sample data in the shape of the Dashboard preview's, so the cards here
// match what visitors find there.
const totalViewsTrend = [
  38200, 39100, 40400, 41800, 42600, 44100, 45300, 46200, 47100, 47800, 48210,
];
const dailyAverageTrend = [
  1720, 1705, 1690, 1668, 1650, 1642, 1630, 1621, 1615, 1610, 1607,
];
const peakDayTrend = [
  1940, 1948, 1935, 1952, 1944, 1950, 1946, 1952, 1949, 1951, 1952,
];
const weekly = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
  (label, i) => ({
    label,
    value: Math.round(1500 + 250 * Math.sin(i / 1.5) + i * 20),
  }),
);

const principles = [
  {
    title: 'Built for AI agents',
    body: 'Predictable prop names, JSDoc on every prop, and the resolved variant exposed as data-variant, so an agent can read the API instead of guessing it.',
    note: 'Next: a machine-readable manifest for agents.',
  },
  {
    title: 'Accessible by default',
    body: 'Components follow the ARIA patterns, every story runs axe checks, and the color tokens pass a live WCAG contrast audit.',
  },
  {
    title: 'Driven by tokens',
    body: 'Components use prefixed semantic tokens, never raw colors. Style choices such as the glow shadow live in tokens, not in props on every component.',
  },
];

const stack = [
  'React 19',
  'TypeScript',
  'Tailwind v4',
  'CVA',
  'D3',
  'Vitest',
  'Storybook',
];

export const Welcome: Story = {
  render: () => (
    <div className="min-h-screen bg-tally-background px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Heading level={1} size="2xl">
              Tally UI
            </Heading>
            <Badge variant="info">In development</Badge>
          </div>
          <Text size="lg" variant="muted" className="max-w-2xl">
            A React component library for analytics dashboards, designed so AI
            agents can build with it without guessing.
          </Text>
          <nav aria-label="Project links">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <ExternalLink href="https://github.com/han-sen/tally-ui">
                  GitHub
                </ExternalLink>
              </li>
              <li>
                <StoryLink id="foundations-dashboard-preview--attention-tracker">
                  Dashboard preview
                </StoryLink>
              </li>
              <li>
                <StoryLink id="project-roadmap--roadmap">Roadmap</StoryLink>
              </li>
            </ul>
          </nav>
        </header>

        <section
          aria-labelledby="sample-heading"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <Heading level={2} size="lg" id="sample-heading">
              A sample, live
            </Heading>
            <StoryLink id="foundations-dashboard-preview--attention-tracker">
              See the full dashboard
            </StoryLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Total views"
              value="48,210"
              delta={{
                value: '4.2%',
                direction: 'up',
                sentiment: 'positive',
                comparison: 'last 30 days',
              }}
              chart={
                <Sparkline
                  data={totalViewsTrend}
                  className="h-16 w-full text-tally-success-chart"
                  glow
                />
              }
            />
            <StatCard
              label="Daily average"
              value="1,607"
              delta={{
                value: '1.1%',
                direction: 'down',
                sentiment: 'negative',
                comparison: 'last 30 days',
              }}
              chart={
                <Sparkline
                  data={dailyAverageTrend}
                  className="h-16 w-full text-tally-danger-chart"
                  glow
                />
              }
            />
            <StatCard
              label="Peak day"
              value="1,952"
              delta={{
                value: '0%',
                direction: 'flat',
                sentiment: 'neutral',
                comparison: 'last 30 days',
              }}
              chart={
                <Sparkline
                  data={peakDayTrend}
                  className="h-16 w-full text-tally-info-chart"
                  glow
                />
              }
            />
          </div>
          <Card>
            <Card.Header>
              <Card.Title>Views this week</Card.Title>
              <Card.Description>Toyota Camry</Card.Description>
            </Card.Header>
            <Card.Content>
              <BarChart
                data={weekly}
                label="Daily views for Toyota Camry this week"
                formatValue={(v) => v.toLocaleString('en-US')}
                className="w-full"
              />
            </Card.Content>
          </Card>
        </section>

        <section
          aria-labelledby="principles-heading"
          className="flex flex-col gap-4"
        >
          <Heading level={2} size="lg" id="principles-heading">
            What makes it different
          </Heading>
          <ul className="grid gap-4 md:grid-cols-3">
            {principles.map(({ title, body, note }) => (
              <li key={title} className="flex">
                <Card className="w-full">
                  <Card.Header>
                    <Card.Title>
                      <h3>{title}</h3>
                    </Card.Title>
                  </Card.Header>
                  <Card.Content className="flex flex-col gap-3">
                    <Text size="sm">{body}</Text>
                    {note && (
                      <Text size="sm" variant="muted">
                        {note}
                      </Text>
                    )}
                  </Card.Content>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="stack-heading"
          className="flex flex-col gap-3"
        >
          <Heading level={2} size="lg" id="stack-heading">
            Built with
          </Heading>
          <ul className="flex flex-wrap gap-2">
            {stack.map((name) => (
              <li key={name}>
                <Badge variant="primary">{name}</Badge>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="next-heading" className="flex flex-col gap-3">
          <Heading level={2} size="lg" id="next-heading">
            Where to go next
          </Heading>
          <ul className="flex flex-col gap-2">
            <li>
              <StoryLink id="foundations-colors--overview">Colors</StoryLink>
              <Text as="span" variant="muted">
                {' '}
                – the tokens and their live contrast audit.
              </Text>
            </li>
            <li>
              <StoryLink id="components-alert--docs">Components</StoryLink>
              <Text as="span" variant="muted">
                {' '}
                – every component, with docs, props, and examples. Browse the
                sidebar for the rest.
              </Text>
            </li>
            <li>
              <StoryLink id="project-roadmap--roadmap">Roadmap</StoryLink>
              <Text as="span" variant="muted">
                {' '}
                – what's shipped, what's being built, and what's next.
              </Text>
            </li>
          </ul>
        </section>

        <footer className="border-t border-tally-border pt-6">
          <Text size="sm" variant="muted">
            Built by Michael Hansen.{' '}
            <ExternalLink href="https://www.mikehansen.io/">
              mikehansen.io
            </ExternalLink>
          </Text>
        </footer>
      </div>
    </div>
  ),
};
