import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { getNextIndex, type NavigationMove } from '../lib/navigation';

export interface UseChartNavigationOptions {
  /** How many items there are to move between: points, bars, or slices. */
  count: number;
  /**
   * Describes the item at `index` for screen readers, like
   * `"Aug 12: Toyota Camry 1,602"`. Only called for keyboard moves.
   */
  describe: (index: number) => string;
  /**
   * Moves from the last item back to the first, and the other way round.
   * Leave it off for a time series, which has a start and an end.
   * @default false
   */
  wrap?: boolean;
}

export interface UseChartNavigationResult {
  /**
   * The active item's index, or `null` when nothing is active. Always less
   * than `count`, even right after the data shrinks.
   */
  activeIndex: number | null;
  /**
   * Text for the chart's `role="status"` live region. Empty unless the active
   * item was reached with the keyboard, since announcing every pointer move
   * would be too noisy.
   */
  announcement: string;
  /** Activates `index` from a pointer. Out-of-range indexes are clamped. */
  activateFromPointer: (index: number) => void;
  /** Clears the active item. Use on pointer leave and on blur. */
  clear: () => void;
  /**
   * Handles ArrowLeft/ArrowRight, Home/End, and Escape. Attach it to the
   * focusable chart element.
   */
  handleKeyDown: (event: KeyboardEvent<Element>) => void;
}

// Unknown keys aren't in the map, so they fall through untouched.
const KEY_MOVES: Partial<Record<string, NavigationMove>> = {
  ArrowRight: 'next',
  ArrowLeft: 'previous',
  Home: 'first',
  End: 'last',
};

/**
 * The active-item state shared by the interactive charts: which point, bar, or
 * slice is active, keyboard movement between them, and what to announce.
 *
 * It doesn't know about pointer positions, since each chart turns a pointer
 * into an index differently (a scale inversion, band math, or a slice's own
 * pointer events). The chart works out the index and calls
 * `activateFromPointer`.
 *
 * @example
 * ```tsx
 * const { activeIndex, announcement, activateFromPointer, clear, handleKeyDown } =
 *   useChartNavigation({
 *     count: data.length,
 *     describe: (i) => `${data[i].label}: ${data[i].value}`,
 *   });
 *
 * <svg
 *   tabIndex={0}
 *   onKeyDown={handleKeyDown}
 *   onPointerMove={(e) => activateFromPointer(indexFromPointer(e))}
 *   onPointerLeave={clear}
 *   onBlur={clear}
 * />
 * <span role="status" className="sr-only">{announcement}</span>
 * ```
 */
export function useChartNavigation({
  count,
  describe,
  wrap = false,
}: UseChartNavigationOptions): UseChartNavigationResult {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Only keyboard moves are announced. Mousing across the chart
  // would be too noisy for screen readers.
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  // Clamp the index to a valid one, as data can chart while chart is active
  const active =
    activeIndex !== null && activeIndex < count && activeIndex >= 0
      ? activeIndex
      : null;

  const clear = () => {
    setActiveIndex(null);
    setIsKeyboardActive(false);
  };

  const handleKeyDown = (event: KeyboardEvent<Element>) => {
    if (event.key === 'Escape') {
      clear();
      return;
    }

    const move = KEY_MOVES[event.key];
    if (!move) return;

    event.preventDefault();
    setActiveIndex(getNextIndex(active ?? -1, move, count, { wrap }));
    setIsKeyboardActive(true);
  };

  const activateFromPointer = (index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), count - 1));
    setIsKeyboardActive(false);
  };

  const announcement =
    active === null || !isKeyboardActive ? '' : describe(active);

  return {
    activeIndex: active,
    announcement,
    activateFromPointer,
    clear,
    handleKeyDown,
  };
}
