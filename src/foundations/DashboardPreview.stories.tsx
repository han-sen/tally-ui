import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchX } from 'lucide-react';

import { Alert } from '../components/Alert/Alert';
import { Badge } from '../components/Badge/Badge';
import { BarChart } from '../components/BarChart/BarChart';
import { Button } from '../components/Button/Button';
import { Card } from '../components/Card/Card';
import { Combobox } from '../components/Combobox/Combobox';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { Legend } from '../components/Legend/Legend';
import { LineChart } from '../components/LineChart/LineChart';
import { ProgressBar } from '../components/ProgressBar/ProgressBar';
import { RadioGroup } from '../components/RadioGroup/RadioGroup';
import { Sparkline } from '../components/Sparkline/Sparkline';
import { StatCard } from '../components/StatCard/StatCard';
import { Table } from '../components/Table/Table';
import { Heading } from '../components/Heading/Heading';
import { Text } from '../components/Text/Text';

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

// The last 12 days of August, matching the compared articles' views.
const comparedDays = Array.from({ length: 12 }, (_, i) => `Aug ${i + 19}`);
const articleColors = [
  'text-tally-chart-1',
  'text-tally-chart-2',
  'text-tally-chart-3',
];

// Articles the user can add, as a search for "car models" might return them.
const suggestedArticles = [
  'Chevrolet Silverado',
  'Honda CR-V',
  'Hyundai Elantra',
  'Nissan Altima',
  'Ram Pickup',
  'Subaru Outback',
  'Tesla Model 3',
  'Tesla Model Y',
  'Toyota Corolla',
  'Toyota RAV4',
];

const total = (values: number[]) => values.reduce((sum, v) => sum + v, 0);

// Combined views of every compared article, for each one's share.
const comparedTotal = articles.reduce(
  (sum, { views }) => sum + total(views),
  0,
);

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
            <Heading level={1}>Attention tracker</Heading>
            <Text variant="muted" size="sm">
              Wikipedia page views for car models
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-56">
              <Combobox
                label="Add an article"
                hideLabel
                placeholder="Add an article"
                items={suggestedArticles}
                getLabel={(title) => title}
                getKey={(title) => title}
                emptyMessage="No matching articles"
              />
            </div>
            <Button>Add</Button>
            <Button variant="secondary">Export</Button>
            <Button variant="ghost">Reset</Button>
            <Button variant="danger">Clear all</Button>
          </div>
        </header>

        <Alert variant="warning">
          <Alert.Title>Data is delayed</Alert.Title>
          <Alert.Description>
            Wikimedia publishes daily totals about a day late.
          </Alert.Description>
        </Alert>

        {/* A RadioGroup, not Tabs: the range changes the data below rather
            than switching between panels. */}
        <RadioGroup
          label="Date range"
          hideLabel
          orientation="horizontal"
          options={[
            { value: '7', label: '7 days' },
            { value: '30', label: '30 days' },
            { value: '90', label: '90 days' },
          ]}
          defaultValue="30"
        />

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Total views"
            actions={
              <>
                <Button variant="ghost" size="sm" className="justify-start">
                  Show breakdown
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Copy value
                </Button>
              </>
            }
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
              />
            }
          />
          <StatCard
            label="Daily average"
            actions={
              <>
                <Button variant="ghost" size="sm" className="justify-start">
                  Show breakdown
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Copy value
                </Button>
              </>
            }
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
              />
            }
          />
          <StatCard
            label="Peak day"
            actions={
              <>
                <Button variant="ghost" size="sm" className="justify-start">
                  Show breakdown
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Copy value
                </Button>
              </>
            }
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
              />
            }
          />
          <StatCard label="Articles tracked" isLoading />
        </div>

        <Card>
          <Card.Header
            actionsLabel="Daily views actions"
            actions={
              <>
                <Button variant="ghost" size="sm" className="justify-start">
                  Download PNG
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Export CSV
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Change article
                </Button>
              </>
            }
          >
            <Card.Title>Daily views</Card.Title>
            <Card.Description>Toyota Camry, last 30 days</Card.Description>
          </Card.Header>
          <Card.Content>
            <BarChart
              data={daily}
              label="Daily views for Toyota Camry over the last 30 days"
              formatValue={(v) => v.toLocaleString('en-US')}
            />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Views compared</Card.Title>
            <Card.Description>
              Three articles, last 12 days. Hover or focus the chart and use the
              arrow keys for daily values.
            </Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-4">
            <Legend
              items={articles.map((article, i) => ({
                label: article.name,
                colorClassName: articleColors[i] ?? '',
              }))}
            />
            <LineChart
              label="Daily views for three vehicle articles over the last 12 days"
              xLabels={comparedDays}
              series={articles.map((article, i) => ({
                name: article.name,
                values: article.views,
                colorClassName: articleColors[i],
              }))}
              formatValue={(v) => v.toLocaleString('en-US')}
            />
          </Card.Content>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <Card.Header
              actionsLabel="Compared articles actions"
              actions={
                <>
                  <Button variant="ghost" size="sm" className="justify-start">
                    Export CSV
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    Sort by total views
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-tally-danger-fg"
                  >
                    Remove all
                  </Button>
                </>
              }
            >
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
                    <Table.Head numeric className="whitespace-nowrap">
                      Total views
                    </Table.Head>
                    <Table.Head>Share</Table.Head>
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
                          <div className="flex items-center gap-2">
                            <ProgressBar
                              label={`${name} share of views`}
                              value={total(views)}
                              max={comparedTotal}
                              size="sm"
                              hideLabel
                              className="w-20"
                            />
                            {/* The progressbar already announces the share. */}
                            <span
                              aria-hidden="true"
                              className="text-xs text-tally-muted-fg tabular-nums"
                            >
                              {Math.round((total(views) / comparedTotal) * 100)}
                              %
                            </span>
                          </div>
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
          <Badge variant="primary">Primary</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </div>
    </div>
  ),
};
