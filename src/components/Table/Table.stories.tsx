import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../Badge/Badge';
import { Sparkline } from '../Sparkline/Sparkline';
import { Table } from './Table';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Table>;

const statusVariant = {
  Delayed: 'danger',
  'In transit': 'info',
  Delivered: 'success',
} as const;

type ShipmentStatus = keyof typeof statusVariant;

const shipments: {
  id: string;
  destination: string;
  carrier: string;
  status: ShipmentStatus;
  weight: string;
}[] = [
  {
    id: 'SHP-10482',
    destination: 'Denver, CO',
    carrier: 'Northline',
    status: 'Delayed',
    weight: '1,240 kg',
  },
  {
    id: 'SHP-10483',
    destination: 'Austin, TX',
    carrier: 'Coastal Freight',
    status: 'In transit',
    weight: '860 kg',
  },
  {
    id: 'SHP-10484',
    destination: 'Portland, OR',
    carrier: 'Summit Express',
    status: 'Delivered',
    weight: '2,105 kg',
  },
  {
    id: 'SHP-10485',
    destination: 'Raleigh, NC',
    carrier: 'Northline',
    status: 'Delivered',
    weight: '415 kg',
  },
];
export const ExampleTable: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Caption>Recent shipments</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Shipment</Table.Head>
          <Table.Head>Destination</Table.Head>
          <Table.Head>Carrier</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head numeric>Weight</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {shipments.map((shipment) => (
          <Table.Row key={shipment.id}>
            <Table.Cell className="font-mono">{shipment.id}</Table.Cell>
            <Table.Cell>{shipment.destination}</Table.Cell>
            <Table.Cell>{shipment.carrier}</Table.Cell>
            <Table.Cell>
              <Badge variant={statusVariant[shipment.status]}>
                {shipment.status}
              </Badge>
            </Table.Cell>
            <Table.Cell numeric>{shipment.weight}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

const carrierShipments = [
  {
    carrier: 'Northline',
    shipments: [
      1364, 1365, 1369, 1402, 1450, 1433, 1510, 1548, 1602, 1590, 1655, 1701,
      1688, 1750,
    ],
  },
  {
    carrier: 'Coastal Freight',
    shipments: [
      1180, 1175, 1190, 1162, 1140, 1155, 1120, 1101, 1098, 1075, 1080, 1052,
      1040, 1031,
    ],
  },
  {
    carrier: 'Summit Express',
    shipments: [
      2210, 2250, 2190, 2305, 2280, 2340, 2298, 2360, 2331, 2402, 2385, 2420,
      2398, 2440,
    ],
  },
  {
    carrier: 'Harbor Logistics',
    shipments: [
      3120, 3050, 3210, 2980, 3300, 3105, 2890, 3400, 3250, 3010, 3360, 3120,
      3290, 3180,
    ],
  },
];

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);

export const WithSparklines: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Caption>Daily shipments over the last 14 days</Table.Caption>
      <Table.Header>
        <Table.Row>
          {/* w-full lets this column absorb the spare width, so the others
              fit their content and the sparkline column stays snug. */}
          <Table.Head className="w-full">Carrier</Table.Head>
          <Table.Head numeric>Shipments</Table.Head>
          <Table.Head>Trend</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {carrierShipments.map(({ carrier, shipments }) => {
          const rising = shipments[shipments.length - 1]! >= shipments[0]!;
          return (
            <Table.Row key={carrier}>
              <Table.Cell>{carrier}</Table.Cell>
              <Table.Cell numeric>
                {sum(shipments).toLocaleString('en-US')}
              </Table.Cell>
              <Table.Cell>
                <Sparkline
                  data={shipments}
                  label={`${carrier} daily shipments, last 14 days, ${rising ? 'rising' : 'falling'}`}
                  className={
                    rising
                      ? 'h-8 w-24 text-tally-success-fg'
                      : 'h-8 w-24 text-tally-danger-fg'
                  }
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  ),
};

export const RowHeaders: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Warehouse</Table.Head>
          <Table.Head numeric>Shipments</Table.Head>
          <Table.Head numeric>Capacity used</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Head scope="row">Reno, NV</Table.Head>
          <Table.Cell numeric>1,204</Table.Cell>
          <Table.Cell numeric>82%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Head scope="row">Columbus, OH</Table.Head>
          <Table.Cell numeric>988</Table.Cell>
          <Table.Cell numeric>67%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Head scope="row">Atlanta, GA</Table.Head>
          <Table.Cell numeric>412</Table.Cell>
          <Table.Cell numeric>45%</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const ScrollsWhenNarrow: Story = {
  render: (args) => (
    <div className="w-80">
      <Table {...args} className="min-w-160">
        <Table.Header>
          <Table.Row>
            <Table.Head>Shipment</Table.Head>
            <Table.Head>Destination</Table.Head>
            <Table.Head>Carrier</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head numeric>Weight</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {shipments.map((shipment) => (
            <Table.Row key={shipment.id}>
              <Table.Cell>{shipment.id}</Table.Cell>
              <Table.Cell>{shipment.destination}</Table.Cell>
              <Table.Cell>{shipment.carrier}</Table.Cell>
              <Table.Cell>{shipment.status}</Table.Cell>
              <Table.Cell numeric>{shipment.weight}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  ),
};
