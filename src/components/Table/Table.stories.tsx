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

const recalls = [
  { vehicle: '2022 Honda Accord', component: 'Fuel pump', status: 'Open', cost: '$1,200.00' },
  { vehicle: '2021 Toyota Camry', component: 'Airbag inflator', status: 'Open', cost: '$850.00' },
  { vehicle: '2020 Ford F-150', component: 'Brake line', status: 'Resolved', cost: '$0.00' },
  { vehicle: '2019 Subaru Outback', component: 'Rear camera', status: 'Resolved', cost: '$0.00' },
];

export const ExampleTable: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Caption>Recalls by vehicle</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Vehicle</Table.Head>
          <Table.Head>Component</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head numeric>Repair cost</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {recalls.map((recall) => (
          <Table.Row key={recall.vehicle}>
            <Table.Cell>{recall.vehicle}</Table.Cell>
            <Table.Cell>{recall.component}</Table.Cell>
            <Table.Cell>
              <Badge variant={recall.status === 'Open' ? 'danger' : 'success'}>
                {recall.status}
              </Badge>
            </Table.Cell>
            <Table.Cell numeric>{recall.cost}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

const articleViews = [
  {
    article: 'Toyota Camry',
    views: [1364, 1365, 1369, 1402, 1450, 1433, 1510, 1548, 1602, 1590, 1655, 1701, 1688, 1750],
  },
  {
    article: 'Honda Accord',
    views: [1180, 1175, 1190, 1162, 1140, 1155, 1120, 1101, 1098, 1075, 1080, 1052, 1040, 1031],
  },
  {
    article: 'Ford F-150',
    views: [2210, 2250, 2190, 2305, 2280, 2340, 2298, 2360, 2331, 2402, 2385, 2420, 2398, 2440],
  },
  {
    article: 'Tesla Model 3',
    views: [3120, 3050, 3210, 2980, 3300, 3105, 2890, 3400, 3250, 3010, 3360, 3120, 3290, 3180],
  },
];

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);

export const WithSparklines: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Caption>Daily views over the last 14 days</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Article</Table.Head>
          <Table.Head numeric>Total views</Table.Head>
          <Table.Head>Trend</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {articleViews.map(({ article, views }) => {
          const rising = views[views.length - 1]! >= views[0]!;
          return (
            <Table.Row key={article}>
              <Table.Cell>{article}</Table.Cell>
              <Table.Cell numeric>
                {sum(views).toLocaleString('en-US')}
              </Table.Cell>
              <Table.Cell>
                <Sparkline
                  data={views}
                  label={`${article} daily views, last 14 days, ${rising ? 'rising' : 'falling'}`}
                  className={
                    rising
                      ? 'h-8 w-24 text-success-foreground'
                      : 'h-8 w-24 text-danger-foreground'
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
          <Table.Head>Vehicle</Table.Head>
          <Table.Head numeric>Listings</Table.Head>
          <Table.Head numeric>Median price</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Head scope="row">Honda Accord</Table.Head>
          <Table.Cell numeric>1,204</Table.Cell>
          <Table.Cell numeric>$24,300</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Head scope="row">Toyota Camry</Table.Head>
          <Table.Cell numeric>988</Table.Cell>
          <Table.Cell numeric>$23,850</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Head scope="row">Subaru Outback</Table.Head>
          <Table.Cell numeric>412</Table.Cell>
          <Table.Cell numeric>$28,900</Table.Cell>
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
            <Table.Head>Vehicle</Table.Head>
            <Table.Head>Component</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head numeric>Repair cost</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {recalls.map((recall) => (
            <Table.Row key={recall.vehicle}>
              <Table.Cell>{recall.vehicle}</Table.Cell>
              <Table.Cell>{recall.component}</Table.Cell>
              <Table.Cell>{recall.status}</Table.Cell>
              <Table.Cell numeric>{recall.cost}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  ),
};
