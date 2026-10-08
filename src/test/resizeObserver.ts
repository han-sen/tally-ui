import { act } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// jsdom has no ResizeObserver and no layout. This fake records every observer
// a component creates, so a test can report a new size through it.
export class FakeResizeObserver {
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

/** The most recently created observer. Throws if there isn't one. */
export function latestObserver() {
  const observer = FakeResizeObserver.instances.at(-1);
  if (!observer) throw new Error('No ResizeObserver was created');
  return observer;
}

/**
 * Installs the fake ResizeObserver and gives every element a `clientWidth`
 * of `width` for each test in the calling `describe` block.
 */
export function mockElementWidth(width: number) {
  beforeEach(() => {
    FakeResizeObserver.instances = [];
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(
      width,
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
}
