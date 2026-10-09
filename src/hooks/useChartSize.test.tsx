import { render, renderHook, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { latestObserver, mockElementWidth } from '../test/resizeObserver';

import {
  CARTESIAN_MARGIN,
  useChartSize,
  type ChartMargin,
} from './useChartSize';

function Sized({ height, margin }: { height: number; margin?: ChartMargin }) {
  const { ref, width, innerWidth, innerHeight } = useChartSize(height, margin);
  return (
    <>
      <div ref={ref} />
      <output>{`${width} ${innerWidth}x${innerHeight}`}</output>
    </>
  );
}

// Shown as "width innerWidthxinnerHeight", like "600 544x252".
const shownSize = () => screen.getByRole('status').textContent;

describe('useChartSize', () => {
  mockElementWidth(600);

  it('is 0 wide before the container is measured', () => {
    const { result } = renderHook(() => useChartSize(300));

    expect(result.current.width).toBe(0);
    expect(result.current.innerWidth).toBe(0);
  });

  it('subtracts the default margin from the measured width and height', () => {
    render(<Sized height={300} />);

    // 600 - 40 - 16 = 544 wide, 300 - 16 - 32 = 252 high.
    expect(shownSize()).toBe('600 544x252');
  });

  it('returns the margin it used', () => {
    const { result } = renderHook(() => useChartSize(300));

    expect(result.current.margin).toBe(CARTESIAN_MARGIN);
  });

  it('uses a custom margin when one is given', () => {
    render(
      <Sized height={300} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} />,
    );

    expect(shownSize()).toBe('600 600x300');
  });

  it('never returns a negative inner size', () => {
    // A 40px height leaves less than the 48px of top and bottom margin.
    const { result } = renderHook(() => useChartSize(40));

    expect(result.current.innerWidth).toBe(0);
    expect(result.current.innerHeight).toBe(0);
  });

  it('updates when the container resizes', () => {
    render(<Sized height={300} />);

    latestObserver().report(400);

    expect(shownSize()).toBe('400 344x252');
  });
});
