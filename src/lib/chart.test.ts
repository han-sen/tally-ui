import { describe, it, expect } from 'vitest';

import { getLabelStep, getValueScale } from './chart';

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
