import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchX } from 'lucide-react';

import { Alert } from '../components/Alert/Alert';
import { Badge } from '../components/Badge/Badge';
import { BarChart } from '../components/BarChart/BarChart';
import { Button } from '../components/Button/Button';
import { Card } from '../components/Card/Card';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { Input } from '../components/Input/Input';
import { Sparkline } from '../components/Sparkline/Sparkline';
import { StatCard } from '../components/StatCard/StatCard';
import { Table } from '../components/Table/Table';
import { Tabs } from '../components/Tabs/Tabs';

const meta: Meta = {
  title: 'Foundations/Dashboard preview',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

// Deterministic fixtures shaped like Wikimedia daily pageviews.
const daily = Array.from({ length: 30 }, (_, i) => ({
  label: `Aug ${i + 1}`,
  value: Math.round(1400 + 300 * Math.sin(i / 4) + i * 12),
}));

const articles = [
  {
    name: 'Toyota Camry',
    views: [
      1364, 1365, 1369, 1402, 1450, 1433, 1510, 1548, 1602, 1590, 1655, 1701,
    ],
  },
  {
    name: 'Honda Accord',
    views: [
      1180, 1175, 1190, 1162, 1140, 1155, 1120, 1101, 1098, 1075, 1080, 1052,
    ],
  },
  {
    name: 'Ford F-150',
    views: [
      2210, 2250, 2190, 2305, 2280, 2340, 2298, 2360, 2331, 2402, 2385, 2420,
    ],
  },
];

const total = (values: number[]) => values.reduce((sum, v) => sum + v, 0);

// Small trend fixtures for the stat cards, shaped to match each delta.
const totalViewsTrend = [
  38200, 39100, 40400, 41800, 42600, 44100, 45300, 46200, 47100, 47800, 48210,
];
const dailyAverageTrend = [
  1720, 1705, 1690, 1668, 1650, 1642, 1630, 1621, 1615, 1610, 1607,
];
const peakDayTrend = [
  1940, 1948, 1935, 1952, 1944, 1950, 1946, 1952, 1949, 1951, 1952,
];

export const AttentionTracker: Story = {
  render: () => (
    <div className="min-h-screen bg-tally-background p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Attention tracker</h1>
            <p className="text-sm text-tally-muted-fg">
              Wikipedia page views for car models
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              aria-label="Add an article"
              placeholder="Add an article"
              className="w-56"
            />
            <Button>Add</Button>
            <Button variant="secondary">Export</Button>
            <Button variant="ghost">Reset</Button>
            <Button variant="danger" glow>
              Clear all
            </Button>
          </div>
        </header>

        <Alert variant="warning">
          <Alert.Title>Data is delayed</Alert.Title>
          <Alert.Description>
            Wikimedia publishes daily totals about a day late.
          </Alert.Description>
        </Alert>

        <Tabs defaultValue="30" glow>
          <Tabs.List className="flex-shrink border border-tally-info">
            <Tabs.Trigger value="7">7 days</Tabs.Trigger>
            <Tabs.Trigger value="30">30 days</Tabs.Trigger>
            <Tabs.Trigger value="90">90 days</Tabs.Trigger>
          </Tabs.List>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-4">
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
                className="h-20 w-full text-tally-success-chart"
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
                className="h-20 w-full text-tally-danger-chart"
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
                className="h-20 w-full text-tally-info-chart"
                glow
              />
            }
          />
          <StatCard label="Articles tracked" isLoading />
        </div>

        <Card>
          <Card.Header>
            <Card.Title>Daily views</Card.Title>
            <Card.Description>Toyota Camry, last 30 days</Card.Description>
          </Card.Header>
          <Card.Content>
            <BarChart
              data={daily}
              label="Daily views for Toyota Camry over the last 30 days"
              formatValue={(v) => v.toLocaleString('en-US')}
              className="w-full"
            />
          </Card.Content>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <Card.Header>
              <Card.Title>Compared articles</Card.Title>
              <Card.Description>Views over the last 12 days</Card.Description>
            </Card.Header>
            <Card.Content>
              <Table>
                <Table.Header>
                  <Table.Row>
                    {/* w-full lets this column absorb the spare width, so the
                        others fit their content instead of stretching. */}
                    <Table.Head className="w-full">Article</Table.Head>
                    <Table.Head>Trend</Table.Head>
                    <Table.Head numeric>Total views</Table.Head>
                    <Table.Head>Status</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {articles.map(({ name, views }) => {
                    const rising = views[views.length - 1]! >= views[0]!;
                    return (
                      <Table.Row key={name}>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell>
                          <Sparkline
                            data={views}
                            label={`${name} trend, ${rising ? 'rising' : 'falling'}`}
                            className={
                              rising
                                ? 'h-8 w-24 text-tally-success-chart'
                                : 'h-8 w-24 text-tally-danger-chart'
                            }
                          />
                        </Table.Cell>
                        <Table.Cell numeric>
                          {total(views).toLocaleString('en-US')}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant={rising ? 'success' : 'danger'}>
                            {rising ? 'Rising' : 'Falling'}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <EmptyState>
                <EmptyState.Icon>
                  <SearchX />
                </EmptyState.Icon>
                <EmptyState.Title>No articles match</EmptyState.Title>
                <EmptyState.Description>
                  Try a different name or a wider date range.
                </EmptyState.Description>
                <EmptyState.Actions>
                  <Button variant="secondary" size="sm">
                    Clear search
                  </Button>
                </EmptyState.Actions>
              </EmptyState>
            </Card.Content>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" glow>
            Primary
          </Badge>
          <Badge variant="info" glow>
            Info
          </Badge>
          <Badge variant="success" glow>
            Success
          </Badge>
          <Badge variant="warning" glow>
            Warning
          </Badge>
          <Badge variant="danger" glow>
            Danger
          </Badge>
        </div>
      </div>
    </div>
  ),
};
