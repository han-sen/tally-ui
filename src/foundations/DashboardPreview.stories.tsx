import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchX } from 'lucide-react';

import { Alert } from '../components/Alert/Alert';
import { Badge } from '../components/Badge/Badge';
import { BarChart } from '../components/BarChart/BarChart';
import { Button } from '../components/Button/Button';
import { Card } from '../components/Card/Card';
import { Combobox } from '../components/Combobox/Combobox';
import { DonutChart } from '../components/DonutChart/DonutChart';
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

// Deterministic fixtures shaped like daily order and shipment counts.
const dailyOrders = Array.from({ length: 30 }, (_, i) => ({
  label: `Aug ${i + 1}`,
  value: Math.round(1400 + 300 * Math.sin(i / 4) + i * 12),
}));

// Colors are written out in full, since Tailwind only generates classes it can
// find in the source. Each carrier keeps its color across every chart.
const carriers = [
  {
    name: 'Northline',
    colorClassName: 'text-tally-chart-1',
    onTime: 97.1,
    shipments: [
      1364, 1365, 1369, 1402, 1450, 1433, 1510, 1548, 1602, 1590, 1655, 1701,
    ],
  },
  {
    name: 'Coastal Freight',
    colorClassName: 'text-tally-chart-2',
    onTime: 95.8,
    shipments: [
      1180, 1175, 1190, 1162, 1140, 1155, 1120, 1101, 1098, 1075, 1080, 1052,
    ],
  },
  {
    name: 'Summit Express',
    colorClassName: 'text-tally-chart-3',
    onTime: 91.4,
    shipments: [
      2210, 2250, 2190, 2305, 2280, 2340, 2298, 2360, 2331, 2402, 2385, 2420,
    ],
  },
];

// The last 12 days of August, matching the carriers' shipments.
const recentDays = Array.from({ length: 12 }, (_, i) => `Aug ${i + 19}`);

// Warehouses the user can add, as a search might return them.
const warehouses = [
  'Atlanta, GA',
  'Columbus, OH',
  'Dallas, TX',
  'Denver, CO',
  'Newark, NJ',
  'Ontario, CA',
  'Phoenix, AZ',
  'Reno, NV',
  'Savannah, GA',
  'Seattle, WA',
];

const total = (values: number[]) => values.reduce((sum, v) => sum + v, 0);

// Shipments across every carrier, for each one's share.
const allShipments = carriers.reduce(
  (sum, { shipments }) => sum + total(shipments),
  0,
);

// Below this on-time rate, a carrier is flagged as having delays.
const ON_TIME_TARGET = 95;

// Small trend fixtures for the stat cards, shaped to match each delta.
const shipmentsTrend = [
  9800, 10100, 10400, 10900, 11200, 11500, 11800, 12100, 12400, 12600, 12840,
];
const onTimeTrend = [
  96.3, 96.2, 96.1, 95.9, 95.8, 95.7, 95.6, 95.5, 95.4, 95.3, 95.2,
];
const delayedTrend = [61, 58, 57, 53, 51, 48, 46, 44, 41, 40, 38];

const formatCount = (v: number) => v.toLocaleString('en-US');

export const LogisticsOverview: Story = {
  render: () => (
    <div className="min-h-screen bg-tally-background p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Heading level={1}>Logistics overview</Heading>
            <Text variant="muted" size="sm">
              Shipments across all carriers and warehouses
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-56">
              <Combobox
                label="Add a warehouse"
                hideLabel
                placeholder="Add a warehouse"
                items={warehouses}
                getLabel={(name) => name}
                getKey={(name) => name}
                emptyMessage="No matching warehouses"
              />
            </div>
            <Button>Add</Button>
            <Button variant="secondary">Export</Button>
            <Button variant="ghost">Reset</Button>
            <Button variant="danger">Clear all</Button>
          </div>
        </header>

        <Alert variant="warning">
          <Alert.Title>Weather delays in the Northeast</Alert.Title>
          <Alert.Description>
            Summit Express shipments may arrive a day late.
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
            label="Shipments"
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
            value="12,840"
            delta={{
              value: '4.2%',
              direction: 'up',
              sentiment: 'positive',
              comparison: 'last 30 days',
            }}
            chart={
              <Sparkline
                data={shipmentsTrend}
                className="h-20 w-full text-tally-success-chart"
              />
            }
          />
          <StatCard
            label="On-time rate"
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
            value="95.2%"
            delta={{
              value: '1.1 pts',
              direction: 'down',
              sentiment: 'negative',
              comparison: 'last 30 days',
            }}
            chart={
              <Sparkline
                data={onTimeTrend}
                className="h-20 w-full text-tally-danger-chart"
              />
            }
          />
          {/* Fewer delays is good news, so a falling number is positive. */}
          <StatCard
            label="Delayed shipments"
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
            value="38"
            delta={{
              value: '23',
              direction: 'down',
              sentiment: 'positive',
              comparison: 'last 30 days',
            }}
            chart={
              <Sparkline
                data={delayedTrend}
                className="h-20 w-full text-tally-success-chart"
              />
            }
          />
          <StatCard label="Avg. delivery time" isLoading />
        </div>

        <Card>
          <Card.Header
            actionsLabel="Orders per day actions"
            actions={
              <>
                <Button variant="ghost" size="sm" className="justify-start">
                  Download PNG
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Export CSV
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Change warehouse
                </Button>
              </>
            }
          >
            <Card.Title>Orders per day</Card.Title>
            <Card.Description>All warehouses, last 30 days</Card.Description>
          </Card.Header>
          <Card.Content>
            <BarChart
              data={dailyOrders}
              label="Orders per day across all warehouses over the last 30 days"
              formatValue={formatCount}
            />
          </Card.Content>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <Card.Header>
              <Card.Title>Shipments by carrier</Card.Title>
              <Card.Description>
                Last 12 days. Hover or focus the chart and use the arrow keys
                for daily values.
              </Card.Description>
            </Card.Header>
            <Card.Content className="flex flex-col gap-4">
              <Legend
                items={carriers.map((carrier) => ({
                  label: carrier.name,
                  colorClassName: carrier.colorClassName,
                }))}
              />
              <LineChart
                label="Daily shipments by carrier over the last 12 days"
                xLabels={recentDays}
                series={carriers.map((carrier) => ({
                  name: carrier.name,
                  values: carrier.shipments,
                  colorClassName: carrier.colorClassName,
                }))}
                formatValue={formatCount}
              />
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Share of shipments</Card.Title>
              <Card.Description>By carrier, last 12 days</Card.Description>
            </Card.Header>
            <Card.Content className="flex flex-col gap-4">
              <DonutChart
                label="Share of shipments by carrier over the last 12 days"
                data={carriers.map((carrier) => ({
                  label: carrier.name,
                  value: total(carrier.shipments),
                  colorClassName: carrier.colorClassName,
                }))}
                formatValue={formatCount}
                height={200}
              />
              <Legend
                orientation="vertical"
                items={carriers.map((carrier) => ({
                  label: carrier.name,
                  colorClassName: carrier.colorClassName,
                  value: formatCount(total(carrier.shipments)),
                }))}
              />
            </Card.Content>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <Card.Header
              actionsLabel="Carrier performance actions"
              actions={
                <>
                  <Button variant="ghost" size="sm" className="justify-start">
                    Export CSV
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    Sort by volume
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
              <Card.Title>Carrier performance</Card.Title>
              <Card.Description>Last 12 days</Card.Description>
            </Card.Header>
            <Card.Content>
              <Table>
                <Table.Header>
                  <Table.Row>
                    {/* w-full lets this column absorb the spare width, so the
                        others fit their content instead of stretching. */}
                    <Table.Head className="w-full">Carrier</Table.Head>
                    <Table.Head>Trend</Table.Head>
                    <Table.Head numeric>Shipments</Table.Head>
                    <Table.Head>Share</Table.Head>
                    <Table.Head>On time</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {carriers.map(({ name, shipments, onTime }) => {
                    const rising =
                      shipments[shipments.length - 1]! >= shipments[0]!;
                    return (
                      <Table.Row key={name}>
                        <Table.Cell className="whitespace-nowrap">
                          {name}
                        </Table.Cell>
                        <Table.Cell>
                          <Sparkline
                            data={shipments}
                            label={`${name} shipments, ${rising ? 'rising' : 'falling'}`}
                            className={
                              rising
                                ? 'h-8 w-24 text-tally-success-chart'
                                : 'h-8 w-24 text-tally-danger-chart'
                            }
                          />
                        </Table.Cell>
                        <Table.Cell numeric>
                          {formatCount(total(shipments))}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-2">
                            <ProgressBar
                              label={`${name} share of shipments`}
                              value={total(shipments)}
                              max={allShipments}
                              size="sm"
                              hideLabel
                              className="w-20"
                            />
                            {/* The progressbar already announces the share. */}
                            <span
                              aria-hidden="true"
                              className="text-xs text-tally-muted-fg tabular-nums"
                            >
                              {Math.round(
                                (total(shipments) / allShipments) * 100,
                              )}
                              %
                            </span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            variant={
                              onTime >= ON_TIME_TARGET ? 'success' : 'warning'
                            }
                          >
                            {onTime}%
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
                <EmptyState.Title>No warehouses match</EmptyState.Title>
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
