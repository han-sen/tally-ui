import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button/Button';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const ExampleCard: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <Card.Header>
        <Card.Title>Median price</Card.Title>
        <Card.Description>Last 30 days</Card.Description>
      </Card.Header>
      <Card.Content>$24,300</Card.Content>
      <Card.Footer>
        <Button size="sm" variant="secondary">
          View details
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <Card.Content>Just some content inside a card.</Card.Content>
    </Card>
  ),
};
