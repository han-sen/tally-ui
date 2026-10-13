import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, it, expect, vi } from 'vitest';

import {
  useChartNavigation,
  type UseChartNavigationOptions,
} from './useChartNavigation';

const describeItem = (index: number) => `Item ${index + 1}`;

const renderNavigation = (options: Partial<UseChartNavigationOptions> = {}) =>
  renderHook(
    (props: Partial<UseChartNavigationOptions>) =>
      useChartNavigation({ count: 5, describe: describeItem, ...props }),
    { initialProps: options },
  );

type Navigation = ReturnType<typeof renderNavigation>['result'];

// The hook only reads `key` and calls `preventDefault`, so a small stand-in
// is enough. Returns the event so tests can check `preventDefault`.
function press(result: Navigation, key: string) {
  const event = { key, preventDefault: vi.fn() };
  act(() => {
    result.current.handleKeyDown(event as unknown as KeyboardEvent<Element>);
  });
  return event;
}

function point(result: Navigation, index: number) {
  act(() => {
    result.current.activateFromPointer(index);
  });
}

describe('useChartNavigation', () => {
  it('starts with nothing active', () => {
    const { result } = renderNavigation();

    expect(result.current.activeIndex).toBeNull();
    expect(result.current.announcement).toBe('');
  });

  it('moves with ArrowRight and ArrowLeft, starting from the ends', () => {
    const { result } = renderNavigation();

    press(result, 'ArrowRight');
    expect(result.current.activeIndex).toBe(0);
    press(result, 'ArrowRight');
    expect(result.current.activeIndex).toBe(1);
    press(result, 'ArrowLeft');
    expect(result.current.activeIndex).toBe(0);

    // With nothing active, ArrowLeft starts from the last item.
    const { result: fresh } = renderNavigation();
    press(fresh, 'ArrowLeft');
    expect(fresh.current.activeIndex).toBe(4);
  });

  it('jumps to the first and last items with Home and End', () => {
    const { result } = renderNavigation();

    press(result, 'End');
    expect(result.current.activeIndex).toBe(4);
    press(result, 'Home');
    expect(result.current.activeIndex).toBe(0);
  });

  it('stops at the ends by default', () => {
    const { result } = renderNavigation();

    press(result, 'End');
    press(result, 'ArrowRight');
    expect(result.current.activeIndex).toBe(4);

    press(result, 'Home');
    press(result, 'ArrowLeft');
    expect(result.current.activeIndex).toBe(0);
  });

  it('wraps around the ends with wrap', () => {
    const { result } = renderNavigation({ wrap: true });

    press(result, 'End');
    press(result, 'ArrowRight');
    expect(result.current.activeIndex).toBe(0);

    press(result, 'ArrowLeft');
    expect(result.current.activeIndex).toBe(4);
  });

  it('clears the active item with Escape', () => {
    const { result } = renderNavigation();
    press(result, 'ArrowRight');

    press(result, 'Escape');

    expect(result.current.activeIndex).toBeNull();
    expect(result.current.announcement).toBe('');
  });

  it('ignores other keys', () => {
    const { result } = renderNavigation();
    press(result, 'ArrowRight');

    const event = press(result, 'a');

    expect(result.current.activeIndex).toBe(0);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('prevents the default action of the keys it handles', () => {
    const { result } = renderNavigation();

    // Without this, the arrow keys and Home/End would also scroll the page.
    expect(press(result, 'ArrowRight').preventDefault).toHaveBeenCalled();
    expect(press(result, 'End').preventDefault).toHaveBeenCalled();
  });

  it('announces keyboard moves using describe', () => {
    const { result } = renderNavigation();

    press(result, 'ArrowRight');
    press(result, 'ArrowRight');

    expect(result.current.announcement).toBe('Item 2');
  });

  it('does not announce pointer moves', () => {
    const { result } = renderNavigation();
    press(result, 'ArrowRight');

    point(result, 3);

    expect(result.current.activeIndex).toBe(3);
    expect(result.current.announcement).toBe('');
  });

  it('clamps pointer indexes to the item range', () => {
    const { result } = renderNavigation();

    point(result, -2);
    expect(result.current.activeIndex).toBe(0);

    point(result, 99);
    expect(result.current.activeIndex).toBe(4);
  });

  it('keeps the active index in range when count shrinks', () => {
    const { result, rerender } = renderNavigation();
    press(result, 'End');

    rerender({ count: 3 });

    expect(result.current.activeIndex).toBeNull();
  });

  it('stays inactive when there are no items', () => {
    const { result } = renderNavigation({ count: 0 });

    point(result, 2);
    expect(result.current.activeIndex).toBeNull();

    press(result, 'ArrowRight');
    expect(result.current.activeIndex).toBeNull();
  });

  it('clears the active item with clear', () => {
    const { result } = renderNavigation();
    press(result, 'ArrowRight');

    act(() => {
      result.current.clear();
    });

    expect(result.current.activeIndex).toBeNull();
    expect(result.current.announcement).toBe('');
  });
});
