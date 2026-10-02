import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ProgressBar } from './ProgressBar';

function fill() {
  return screen.getByRole('progressbar').firstElementChild as HTMLElement;
}

describe('ProgressBar', () => {
  it('is a progressbar named by its label', () => {
    render(<ProgressBar label="Upload" value={40} />);

    expect(
      screen.getByRole('progressbar', { name: 'Upload' }),
    ).toBeInTheDocument();
  });

  it('exposes its value, range, and percentage', () => {
    render(<ProgressBar label="Upload" value={40} />);

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuetext', '40%');
    expect(fill()).toHaveStyle({ width: '40%' });
  });

  it('scales the fill to a custom max', () => {
    render(<ProgressBar label="Articles loaded" value={3} max={5} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      '60%',
    );
    expect(fill()).toHaveStyle({ width: '60%' });
  });

  it('clamps values outside 0 to max', () => {
    const { rerender } = render(<ProgressBar label="Upload" value={140} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
    expect(fill()).toHaveStyle({ width: '100%' });

    rerender(<ProgressBar label="Upload" value={-20} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
    expect(fill()).toHaveStyle({ width: '0%' });
  });

  it('shows an empty bar when max is 0', () => {
    render(<ProgressBar label="Upload" value={0} max={0} />);

    expect(fill()).toHaveStyle({ width: '0%' });
  });

  it('shows the label and percentage by default', () => {
    render(<ProgressBar label="Upload" value={40} />);

    expect(screen.getByText('Upload').parentElement).not.toHaveClass('sr-only');
    expect(screen.getByText('40%')).toBeVisible();
  });

  it('hides the label visually with hideLabel, keeping the accessible name', () => {
    render(<ProgressBar label="Upload" value={40} hideLabel />);

    expect(screen.getByText('Upload').parentElement).toHaveClass('sr-only');
    expect(
      screen.getByRole('progressbar', { name: 'Upload' }),
    ).toBeInTheDocument();
  });

  it('uses the chart color for its variant', () => {
    render(<ProgressBar label="Upload" value={40} variant="danger" />);

    expect(fill()).toHaveClass('bg-tally-danger-chart');
  });

  it('reports the default variant when none is passed', () => {
    const { container } = render(<ProgressBar label="Upload" value={40} />);

    expect(container.firstElementChild).toHaveAttribute(
      'data-variant',
      'primary',
    );
    expect(fill()).toHaveClass('bg-tally-primary-chart');
  });

  it('sets the track height from size', () => {
    render(<ProgressBar label="Upload" value={40} size="sm" />);

    expect(screen.getByRole('progressbar')).toHaveClass('h-1');
  });

  it('merges className onto the root and passes native props', () => {
    const { container } = render(
      <ProgressBar
        label="Upload"
        value={40}
        className="w-48"
        data-testid="bar"
      />,
    );

    expect(container.firstElementChild).toHaveClass('w-48', 'flex');
    expect(screen.getByTestId('bar')).toBe(container.firstElementChild);
  });
});
