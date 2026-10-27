import { describe, it, expect } from 'vitest';

import {
  getCartesianMargin,
  getCartesianTooltipPosition,
  getChartColor,
  getLabelStep,
  getValueScale,
  getYAxisWidth,
} from './chart';

describe('getLabelStep', () => {
  it('shows every label when they all fit', () => {
    expect(getLabelStep(['Mon', 'Tue', 'Wed'], 544)).toBe(1);
  });

  it('skips labels when they would overlap', () => {
    const days = Array.from({ length: 30 }, (_, i) => `Aug ${i + 1}`);

    // Each "Aug 10" needs about 6 × 6.5 + 12 = 51 units, so 10 fit in 544.
    expect(getLabelStep(days, 544)).toBe(3);
  });

  it('returns 1 for no labels', () => {
    expect(getLabelStep([], 544)).toBe(1);
  });
});

describe('getValueScale', () => {
  it('maps 0 to the bottom of the plot', () => {
    expect(getValueScale([40, 80], 200)(0)).toBe(200);
  });

  it('rounds the top of the domain up to a nice number', () => {
    // Aiming for 5 ticks over 0 to 1,402 gives a step of 500, so the top
    // rounds up to the next multiple of it.
    expect(getValueScale([1402, 1388], 200).domain()).toEqual([0, 2000]);
  });

  it('starts at 0 for an empty list', () => {
    expect(getValueScale([], 200).domain()).toEqual([0, 0]);
  });
});

describe('getYAxisWidth', () => {
  it('keeps the default margin for short labels', () => {
    // 3 × 7 + 8 = 29, under the 40 minimum.
    expect(getYAxisWidth(['0', '250', '500'])).toBe(40);
  });

  it('grows to fit wide labels', () => {
    // "12,000" is 6 characters: 6 × 7 + 8 = 50.
    expect(getYAxisWidth(['0', '6,000', '12,000'])).toBe(50);
  });

  it('sizes to the longest label, not the last one', () => {
    // "2,000" is 5 characters: 5 × 7 + 8 = 43.
    expect(getYAxisWidth(['2,000', '0'])).toBe(43);
  });

  it('returns the default margin for no labels', () => {
    expect(getYAxisWidth([])).toBe(40);
  });
});

describe('getCartesianMargin', () => {
  it('widens only the left side, using the formatted tick labels', () => {
    // The ticks run 0 to 12,000, so the widest label is "12,000".
    expect(
      getCartesianMargin([11500], (v) => v.toLocaleString('en-US')),
    ).toEqual({ top: 16, right: 16, bottom: 32, left: 50 });
  });

  it('measures the raw numbers when there is no formatValue', () => {
    // "12000" is 5 characters: 5 × 7 + 8 = 43.
    expect(getCartesianMargin([11500]).left).toBe(43);
  });

  it('keeps the default margin when there are no values', () => {
    expect(getCartesianMargin([]).left).toBe(40);
  });
});

describe('getChartColor', () => {
  it('uses the chart colors in order', () => {
    expect([0, 1, 2, 3].map((i) => getChartColor(i))).toEqual([
      'text-tally-chart-1',
      'text-tally-chart-2',
      'text-tally-chart-3',
      'text-tally-chart-4',
    ]);
  });

  it('repeats the colors after the fourth', () => {
    expect(getChartColor(4)).toBe('text-tally-chart-1');
  });

  it('prefers an override', () => {
    expect(getChartColor(0, 'text-tally-primary')).toBe('text-tally-primary');
  });
});

describe('getCartesianTooltipPosition', () => {
  const margin = { top: 16, right: 16, bottom: 32, left: 40 };

  it('places the tooltip at x, offset by the margin', () => {
    expect(getCartesianTooltipPosition(100, 544, margin)).toMatchObject({
      left: 140,
      top: 16,
    });
  });

  it('opens toward the middle of the plot', () => {
    expect(getCartesianTooltipPosition(100, 544, margin).side).toBe('right');
    expect(getCartesianTooltipPosition(400, 544, margin).side).toBe('left');
  });
});
