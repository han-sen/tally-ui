import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { useElementWidth } from './useElementWidth';

// jsdom has no ResizeObserver and no layout, so both are faked. Each observer
// the hook creates is recorded so a test can report a new size through it.
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];

  callback: ResizeObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    FakeResizeObserver.instances.push(this);
  }

  /** Reports a new content-box width, the way the browser would. */
  report(inlineSize?: number) {
    const contentBoxSize =
      inlineSize === undefined ? [] : [{ inlineSize, blockSize: 0 }];
    act(() => {
      this.callback(
        [{ contentBoxSize } as unknown as ResizeObserverEntry],
        this as unknown as ResizeObserver,
      );
    });
  }
}

function latestObserver() {
  const observer = FakeResizeObserver.instances.at(-1);
  if (!observer) throw new Error('No ResizeObserver was created');
  return observer;
}

function Measured({ show = true }: { show?: boolean }) {
  const { ref, width } = useElementWidth();
  return (
    <>
      {show && <div ref={ref} />}
      <output>{width}</output>
    </>
  );
}

const shownWidth = () => screen.getByRole('status').textContent;

describe('useElementWidth', () => {
  beforeEach(() => {
    FakeResizeObserver.instances = [];
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(976);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('is 0 while nothing is attached', () => {
    const { result } = renderHook(() => useElementWidth());

    expect(result.current.width).toBe(0);
    expect(FakeResizeObserver.instances).toHaveLength(0);
  });

  it('reads the first width from the element on mount', () => {
    render(<Measured />);

    expect(shownWidth()).toBe('976');
  });

  it('updates the width when the observer reports a new size', () => {
    render(<Measured />);

    latestObserver().report(812);

    expect(shownWidth()).toBe('812');
  });

  it('rounds reported sizes to whole pixels', () => {
    render(<Measured />);

    latestObserver().report(811.6);

    expect(shownWidth()).toBe('812');
  });

  it('falls back to clientWidth when a report has no size', () => {
    render(<Measured />);
    latestObserver().report(812);

    latestObserver().report(undefined);

    expect(shownWidth()).toBe('976');
  });

  it('measures an element that mounts after the first render', () => {
    const { rerender } = render(<Measured show={false} />);
    expect(shownWidth()).toBe('0');

    rerender(<Measured show />);

    expect(shownWidth()).toBe('976');
    expect(latestObserver().observe).toHaveBeenCalledTimes(1);
  });

  it('stops observing when the element is removed', () => {
    const { rerender } = render(<Measured />);
    const observer = latestObserver();

    rerender(<Measured show={false} />);

    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it('stops observing on unmount', () => {
    const { unmount } = render(<Measured />);
    const observer = latestObserver();

    unmount();

    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
