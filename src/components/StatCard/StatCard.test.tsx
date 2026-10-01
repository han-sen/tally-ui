import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import { StatCard, type DeltaProps } from './StatCard';

const positiveDelta: DeltaProps = {
  value: '2.4%',
  direction: 'up',
  sentiment: 'positive',
  comparison: 'vs last week',
};

describe('StatCard', () => {
  it('renders the label and value', () => {
    render(<StatCard label="Revenue" value="$2400" />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$2400')).toBeInTheDocument();
  });

  it('renders no delta content when delta is omitted', () => {
    const { container } = render(<StatCard label="Revenue" value="$2400" />);

    expect(screen.queryByText(/vs last week/)).not.toBeInTheDocument();
    expect(container.querySelector('.sr-only')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('announces the delta once, as a single screen-reader sentence', () => {
    render(<StatCard label="Revenue" value="$2400" delta={positiveDelta} />);

    expect(screen.getByText('up 2.4% vs last week')).toHaveClass('sr-only');
  });

  it('hides the visible delta from assistive tech to avoid a double read', () => {
    render(<StatCard label="Revenue" value="$2400" delta={positiveDelta} />);

    const visibleDelta = screen.getByText('2.4%');
    expect(visibleDelta.closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('marks the direction icon as decorative', () => {
    const { container } = render(
      <StatCard label="Revenue" value="$2400" delta={positiveDelta} />,
    );

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('describes a flat delta as "Remained"', () => {
    render(
      <StatCard
        label="Revenue"
        value="$2400"
        delta={{
          value: '0%',
          direction: 'flat',
          sentiment: 'neutral',
          comparison: 'vs last month',
        }}
      />,
    );

    expect(screen.getByText('Remained 0% vs last month')).toBeInTheDocument();
  });

  it('works without a comparison label', () => {
    render(
      <StatCard
        label="Revenue"
        value="$2400"
        delta={{ value: '2.4%', direction: 'up', sentiment: 'positive' }}
      />,
    );

    expect(screen.getByText('up 2.4%')).toHaveClass('sr-only');
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });

  it.each([
    ['positive', 'success'],
    ['negative', 'danger'],
    ['neutral', 'info'],
  ] as const)('colors a %s delta with the %s variant', (sentiment, variant) => {
    render(
      <StatCard
        label="Revenue"
        value="$2400"
        delta={{ value: '2.4%', direction: 'up', sentiment }}
      />,
    );

    expect(screen.getByText('2.4%').closest('[data-variant]')).toHaveAttribute(
      'data-variant',
      variant,
    );
  });

  it('keeps direction and sentiment independent', () => {
    render(
      <StatCard
        label="Open recalls"
        value="12"
        delta={{
          value: '3',
          direction: 'up',
          sentiment: 'negative',
          comparison: 'vs last month',
        }}
      />,
    );

    expect(screen.getByText('up 3 vs last month')).toBeInTheDocument();
    expect(screen.getByText('3').closest('[data-variant]')).toHaveAttribute(
      'data-variant',
      'danger',
    );
  });

  it('merges a consumer className and passes other props through', () => {
    render(
      <StatCard
        label="Revenue"
        value="$2400"
        className="custom-class"
        data-testid="stat-card"
      />,
    );

    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('bg-tally-surface');
  });

  describe('when loading', () => {
    it('marks the card as busy and announces what is loading', () => {
      render(<StatCard label="Revenue" isLoading data-testid="stat-card" />);

      expect(screen.getByTestId('stat-card')).toHaveAttribute(
        'aria-busy',
        'true',
      );
      expect(screen.getByRole('status')).toHaveTextContent('Loading Revenue');
    });

    it('keeps the label visible and shows skeletons instead of content', () => {
      const { container } = render(
        <StatCard
          label="Revenue"
          value="$2400"
          delta={positiveDelta}
          isLoading
        />,
      );

      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.queryByText('$2400')).not.toBeInTheDocument();
      expect(screen.queryByText(/vs last week/)).not.toBeInTheDocument();
      expect(
        container.querySelectorAll('.motion-safe\\:animate-pulse'),
      ).toHaveLength(2);
    });

    it('is not marked busy and has no status message when loaded', () => {
      render(
        <StatCard label="Revenue" value="$2400" data-testid="stat-card" />,
      );

      expect(screen.getByTestId('stat-card')).not.toHaveAttribute('aria-busy');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('chart slot', () => {
    it('renders the chart when provided', () => {
      render(
        <StatCard
          label="Revenue"
          value="$2400"
          chart={<div data-testid="chart">chart</div>}
        />,
      );

      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });

    it('does not render the chart while loading', () => {
      render(
        <StatCard
          label="Revenue"
          isLoading
          chart={<div data-testid="chart">chart</div>}
        />,
      );

      expect(screen.queryByTestId('chart')).not.toBeInTheDocument();
    });
  });

  it('adds an actions button named after the label', async () => {
    const user = userEvent.setup();
    render(
      <StatCard
        label="Total views"
        value="48,210"
        actions={<button type="button">Export CSV</button>}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Total views actions' }),
    );

    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeVisible();
  });

  it('keeps the actions button while loading', () => {
    render(
      <StatCard
        label="Total views"
        isLoading
        actions={<button type="button">Export CSV</button>}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Total views actions' }),
    ).toBeInTheDocument();
  });

  it('shows no actions button without actions', () => {
    render(<StatCard label="Total views" value="48,210" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
