import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Text } from './Text';

describe('Text', () => {
  it('renders a paragraph by default', () => {
    render(<Text>Body copy</Text>);

    expect(screen.getByText('Body copy').tagName).toBe('P');
  });

  it('renders the element given by as', () => {
    render(
      <>
        <Text as="span">Inline</Text>
        <Text as="div">Block</Text>
      </>,
    );

    expect(screen.getByText('Inline').tagName).toBe('SPAN');
    expect(screen.getByText('Block').tagName).toBe('DIV');
  });

  it('uses the default size, color, and weight', () => {
    render(<Text>Body copy</Text>);

    const text = screen.getByText('Body copy');
    expect(text).toHaveClass(
      'text-base',
      'text-tally-surface-fg',
      'font-normal',
    );
    expect(text).toHaveAttribute('data-variant', 'default');
  });

  it('applies size, variant, and weight', () => {
    render(
      <Text size="sm" variant="muted" weight="medium">
        Caption
      </Text>,
    );

    const text = screen.getByText('Caption');
    expect(text).toHaveClass('text-sm', 'text-tally-muted-fg', 'font-medium');
    expect(text).toHaveAttribute('data-variant', 'muted');
  });

  it('uses status colors for success and danger', () => {
    render(
      <>
        <Text variant="success">Up</Text>
        <Text variant="danger">Down</Text>
      </>,
    );

    expect(screen.getByText('Up')).toHaveClass('text-tally-success-fg');
    expect(screen.getByText('Down')).toHaveClass('text-tally-danger-fg');
  });

  it('uses mono with fixed-width digits when mono is set', () => {
    render(<Text mono>48,210</Text>);

    expect(screen.getByText('48,210')).toHaveClass('font-mono', 'tabular-nums');
  });

  it('lets className override its own classes', () => {
    render(<Text className="text-lg">Body copy</Text>);

    const text = screen.getByText('Body copy');
    expect(text).toHaveClass('text-lg');
    expect(text).not.toHaveClass('text-base');
  });
});
