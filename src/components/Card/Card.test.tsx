import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Card } from './Card';

const parts = [
  ['Card.Header', Card.Header],
  ['Card.Title', Card.Title],
  ['Card.Description', Card.Description],
  ['Card.Content', Card.Content],
  ['Card.Footer', Card.Footer],
] as const;

describe('Card', () => {
  it('renders all of its parts', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Title</Card.Title>
          <Card.Description>Description</Card.Description>
        </Card.Header>
        <Card.Content>Content</Card.Content>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('merges a consumer className onto the root and passes props through', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('bg-tally-surface');
  });

  it.each(parts)(
    '%s merges a consumer className and passes props through',
    (_name, Part) => {
      render(
        <Card>
          <Part className="custom-class" id="part-id">
            Text
          </Part>
        </Card>,
      );

      const part = screen.getByText('Text');
      expect(part).toHaveClass('custom-class');
      expect(part).toHaveAttribute('id', 'part-id');
    },
  );
});
