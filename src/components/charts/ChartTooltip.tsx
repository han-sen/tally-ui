import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface ChartTooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** The x position of the point the tooltip describes, in pixels from the chart's left edge. */
  left: number;
  /** The tooltip's top edge, in pixels from the chart's top edge. */
  top: number;
  /**
   * Which side of `left` the tooltip opens on. Charts open it toward the
   * middle, so it stays inside the chart near either edge.
   * @default 'right'
   */
  side?: 'left' | 'right';
}

/**
 * The floating box that shows the active point's values, for the interactive
 * charts. Internal: not exported from the package.
 *
 * The chart decides where it goes and what it says; this supplies the box,
 * its position, and the gap from the point. Lines don't wrap, so a tooltip
 * near the chart's edge keeps its width instead of being squeezed. Render it inside the chart's
 * `relative` wrapper, after the `<svg>`. It's hidden from assistive tech,
 * since the chart's live region reads the same values.
 *
 * @example
 * ```tsx
 * {activeIndex !== null && (
 *   <ChartTooltip
 *     left={margin.left + activeX}
 *     top={margin.top}
 *     side={activeX > innerWidth / 2 ? 'left' : 'right'}
 *   >
 *     <p className="mb-1 font-medium">{labels[activeIndex]}</p>
 *     <p className="font-mono tabular-nums">{values[activeIndex]}</p>
 *   </ChartTooltip>
 * )}
 * ```
 */
export function ChartTooltip({
  left,
  top,
  side = 'right',
  className,
  style,
  children,
  ...props
}: ChartTooltipProps) {
  return (
    <div
      {...props}
      className={cn(
        'pointer-events-none absolute whitespace-nowrap rounded-tally-panel bg-tally-surface px-3 py-2 text-xs text-tally-surface-fg shadow-tally-card',
        side === 'left' ? '-ml-3 -translate-x-full' : 'ml-3',
        className,
      )}
      style={{ ...style, left, top }}
      data-side={side}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
