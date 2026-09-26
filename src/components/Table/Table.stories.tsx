import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../Badge/Badge';
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
