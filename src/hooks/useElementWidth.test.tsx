import { render, renderHook, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import {
  FakeResizeObserver,
  latestObserver,
  mockElementWidth,
} from '../test/resizeObserver';

import { useElementWidth } from './useElementWidth';

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
  mockElementWidth(976);

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
