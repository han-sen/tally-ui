import { useId } from 'react';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import {
  progressIndicatorVariants,
  progressTrackVariants,
} from './ProgressBar.variants';

export interface ProgressBarProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof progressIndicatorVariants>,
    VariantProps<typeof progressTrackVariants> {
  /** Current progress, from 0 to `max`. Values outside that range are clamped. */
  value: number;
  /**
   * The value that means complete.
   * @default 100
   */
  max?: number;
  /**
   * What the bar measures, like "Upload" or "Share of views". Shown above the
   * bar with the percentage, and used as the accessible name.
   */
  label: string;
  /**
   * Hides the label and percentage visually but keeps the label for screen
   * readers. Use it where the context already says what the bar measures, like
   * a table column.
   * @default false
   */
  hideLabel?: boolean;
}

/**
 * Horizontal bar that shows how far along something is, as a share of `max`.
 *
 * The bar is a `progressbar` for screen readers, named by `label` and read as
 * a percentage. The label and percentage show above the bar unless `hideLabel`
 * is set.
 *
 * @example
 * ```tsx
 * <ProgressBar label="Share of views" value={62} variant="success" />
 * ```
 *
 * @example
 * A count instead of a percentage, read as "60%":
 * ```tsx
 * <ProgressBar label="Articles loaded" value={3} max={5} size="sm" hideLabel />
 * ```
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  hideLabel = false,
  variant,
  size,
  className,
  ...props
}: ProgressBarProps) {
  const labelId = useId();
  const resolvedVariant = variant ?? 'primary';

  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? (clamped / max) * 100 : 0;
  const percentText = `${Math.round(percent)}%`;

  return (
    <div
      {...props}
      data-variant={resolvedVariant}
      className={cn('flex flex-col gap-1.5', className)}
    >
      <div
        className={cn(
          'flex items-baseline justify-between gap-2 text-sm',
          hideLabel && 'sr-only',
        )}
      >
        <span id={labelId} className="font-medium text-tally-surface-fg">
          {label}
        </span>
        {/* The progressbar already announces the percentage. */}
        <span aria-hidden="true" className="text-tally-muted-fg tabular-nums">
          {percentText}
        </span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={percentText}
        className={progressTrackVariants({ size })}
      >
        <div
          className={progressIndicatorVariants({ variant: resolvedVariant })}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
