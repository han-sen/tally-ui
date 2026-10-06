import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Legend, type LegendItem } from './Legend';

const items: LegendItem[] = [
  { label: 'Toyota Camry', colorClassName: 'text-tally-chart-1' },
  { label: 'Honda Accord', colorClassName: 'text-tally-chart-2' },
];

describe('Legend', () => {
  it('renders a list item per series, in order', () => {
    render(<Legend items={items} />);

    const entries = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(entries).toHaveLength(2);
    expect(entries[0]).toHaveTextContent('Toyota Camry');
    expect(entries[1]).toHaveTextContent('Honda Accord');
  });

  it('colors each swatch with its class and hides it from assistive tech', () => {
    render(<Legend items={items} />);

    const swatch = screen
      .getByText('Toyota Camry')
      .parentElement?.querySelector('[aria-hidden="true"]');
    expect(swatch).toHaveClass('text-tally-chart-1', 'bg-current');
  });

  it('shows a value after the label when given', () => {
    render(
      <Legend
        items={[
          {
            label: 'Toyota Camry',
            colorClassName: 'text-tally-chart-1',
            value: '48,210',
          },
          { label: 'Honda Accord', colorClassName: 'text-tally-chart-2' },
        ]}
      />,
    );

    const [camry, accord] = screen.getAllByRole('listitem');
    expect(camry).toHaveTextContent('Toyota Camry48,210');
    expect(accord).toHaveTextContent(/^Honda Accord$/);
  });

  it('shows a value of 0', () => {
    render(
      <Legend
        items={[
          {
            label: 'Toyota Camry',
            colorClassName: 'text-tally-chart-1',
            value: 0,
          },
        ]}
      />,
    );

    // A truthy check would drop the styled value and leave React rendering a
    // bare 0, so check the value has its own styled element.
    expect(screen.getByText('0')).toHaveClass('text-tally-muted-fg');
  });

  it('lays out horizontally by default and vertically on request', () => {
    const { rerender } = render(<Legend items={items} />);
    expect(screen.getByRole('list')).toHaveClass('flex-row');

    rerender(<Legend items={items} orientation="vertical" />);
    expect(screen.getByRole('list')).toHaveClass('flex-col');
  });

  it('passes other props to the list and merges className', () => {
    render(
      <Legend items={items} aria-label="Series" className="justify-end" />,
    );

    const list = screen.getByRole('list', { name: 'Series' });
    expect(list).toHaveClass('justify-end', 'flex');
  });
});
