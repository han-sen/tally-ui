export type NavigationMove = 'next' | 'previous' | 'first' | 'last';

/**
 * The index to move to in a list of `count` items, for keyboard navigation
 * like arrow keys and Home/End. Each component maps its own keys to a move.
 *
 * A `current` below 0 means nothing is active yet: `next` lands on the first
 * item and `previous` on the last. With `wrap`, moving past either end goes
 * around to the other one; without it, the index stops at the ends.
 *
 * Returns -1 when the list is empty.
 */
export function getNextIndex(
  current: number,
  move: NavigationMove,
  count: number,
  { wrap = false }: { wrap?: boolean } = {},
): number {
  if (count <= 0) return -1;

  const last = count - 1;

  switch (move) {
    case 'first':
      return 0;
    case 'last':
      return last;
    case 'next':
      if (current < 0) return 0;
      if (current >= last) return wrap ? 0 : last;
      return current + 1;
    case 'previous':
      if (current < 0) return last;
      if (current === 0) return wrap ? last : 0;
      return Math.min(current, count) - 1;
  }
}
