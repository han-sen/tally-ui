import { describe, it, expect } from 'vitest';

import { getLabelStep } from './chart';

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
