import { describe, it, expect } from 'vitest';

import { getNextIndex } from './navigation';

describe('getNextIndex', () => {
  it('moves one step forward and back', () => {
    expect(getNextIndex(1, 'next', 5)).toBe(2);
    expect(getNextIndex(1, 'previous', 5)).toBe(0);
  });

  it('jumps to the first and last item', () => {
    expect(getNextIndex(2, 'first', 5)).toBe(0);
    expect(getNextIndex(2, 'last', 5)).toBe(4);
  });

  it('stops at the ends by default', () => {
    expect(getNextIndex(4, 'next', 5)).toBe(4);
    expect(getNextIndex(0, 'previous', 5)).toBe(0);
  });

  it('goes around the ends with wrap', () => {
    expect(getNextIndex(4, 'next', 5, { wrap: true })).toBe(0);
    expect(getNextIndex(0, 'previous', 5, { wrap: true })).toBe(4);
  });

  it('starts from the matching end when nothing is active', () => {
    expect(getNextIndex(-1, 'next', 5)).toBe(0);
    expect(getNextIndex(-1, 'previous', 5)).toBe(4);
  });

  it('pulls an index past the end back into the list', () => {
    expect(getNextIndex(9, 'next', 5)).toBe(4);
    expect(getNextIndex(9, 'previous', 5)).toBe(4);
  });

  it('returns -1 for an empty list', () => {
    expect(getNextIndex(0, 'next', 0)).toBe(-1);
  });
});
