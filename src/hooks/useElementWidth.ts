import { useState, useLayoutEffect } from 'react';

export interface UseElementWidthResult<T extends HTMLElement> {
  /** Attach to the element to measure. */
  ref: (element: T | null) => void;
  /**
   * The element’s content-box width in whole pixels.
   * 0 until the element mounts and is measured,
   * including on the server.
   */
  width: number;
}

/**
 * Measures an element's width and keeps it up to date as it resizes.
 * Works for elements that mount later, such as after a loading state.
 *
 * @example
 * ```tsx
 * const { ref, width } = useElementWidth();
 * return <div ref={ref}>{width > 0 && <Chart width={width} />}</div>;
 * ```
 */
export function useElementWidth<
  T extends HTMLElement = HTMLDivElement,
>(): UseElementWidthResult<T> {
  const [element, setElement] = useState<T | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!element) return;

    // Read the width synchronously so the first paint has it,
    // before resize observer kicks in.
    // Lint only recognizes this setState exception when it
    // comes from a ref, so manually disabling here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWidth(element.clientWidth);

    const resizeObserver = new ResizeObserver((entries) => {
      setWidth(
        Math.round(
          entries[0]?.contentBoxSize[0]?.inlineSize ?? element.clientWidth,
        ),
      );
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [element]);

  return { ref: setElement, width };
}
