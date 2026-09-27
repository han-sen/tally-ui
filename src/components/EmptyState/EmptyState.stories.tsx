import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inbox, SearchX } from 'lucide-react';

import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Table } from '../Table/Table';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const WithAction: Story = {
  render: (args) => (
    <EmptyState {...args}>
      <EmptyState.Icon>
        <SearchX />
      </EmptyState.Icon>
      <EmptyState.Title>No articles match your search</EmptyState.Title>
      <EmptyState.Description>
        Try a different article or a wider date range.
      </EmptyState.Description>
      <EmptyState.Actions>
        <Button variant="secondary">Clear search</Button>
      </EmptyState.Actions>
    </EmptyState>
  ),
};

export const WithoutAction: Story = {
  render: (args) => (
    <EmptyState {...args}>
      <EmptyState.Icon>
        <Inbox />
      </EmptyState.Icon>
      <EmptyState.Title>No views recorded</EmptyState.Title>
      <EmptyState.Description>
        There were no page views for this period.
      </EmptyState.Description>
    </EmptyState>
  ),
};

export const TitleOnly: Story = {
  render: (args) => (
    <EmptyState {...args}>
      <EmptyState.Title>No data</EmptyState.Title>
    </EmptyState>
  ),
};

export const InsideCard: Story = {
  render: () => (
    <Card className="w-96">
      <Card.Header>
        <Card.Title>Daily views</Card.Title>
        <Card.Description>Last 30 days</Card.Description>
      </Card.Header>
      <Card.Content>
        <EmptyState>
          <EmptyState.Icon>
            <Inbox />
          </EmptyState.Icon>
          <EmptyState.Title>No views recorded</EmptyState.Title>
          <EmptyState.Description>
            There were no page views for this period.
          </EmptyState.Description>
        </EmptyState>
      </Card.Content>
    </Card>
  ),
};

export const InsideTable: Story = {
  render: () => (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Rank</Table.Head>
          <Table.Head>Article</Table.Head>
          <Table.Head numeric>Views</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={3}>
            <EmptyState role="status">
              <EmptyState.Title>No articles match your search</EmptyState.Title>
              <EmptyState.Description>
                Try a different article name.
              </EmptyState.Description>
            </EmptyState>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};
