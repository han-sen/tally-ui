import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ChartTooltip } from './ChartTooltip';

describe('ChartTooltip', () => {
  it('renders its children', () => {
    render(
      <ChartTooltip left={0} top={0}>
        <p>Aug 12</p>
      </ChartTooltip>,
    );

    expect(screen.getByText('Aug 12')).toBeInTheDocument();
  });

  it('is hidden from assistive tech', () => {
    const { container } = render(<ChartTooltip left={0} top={0} />);

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('is placed at left and top, keeping the caller style', () => {
    const { container } = render(
      <ChartTooltip left={120} top={16} style={{ zIndex: 2 }} />,
    );

    expect(container.firstChild).toHaveStyle({
      left: '120px',
      top: '16px',
      zIndex: '2',
    });
  });

  it('opens to the right by default and to the left when asked', () => {
    const { container, rerender } = render(<ChartTooltip left={0} top={0} />);
    expect(container.firstChild).toHaveAttribute('data-side', 'right');

    rerender(<ChartTooltip left={0} top={0} side="left" />);
    expect(container.firstChild).toHaveAttribute('data-side', 'left');
  });

  it('merges a className and passes other props through', () => {
    const { container } = render(
      <ChartTooltip left={0} top={0} className="min-w-36" data-testid="tip" />,
    );

    expect(container.firstChild).toHaveClass('min-w-36', 'absolute');
    expect(screen.getByTestId('tip')).toBeInTheDocument();
  });
});
