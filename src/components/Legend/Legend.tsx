import type { HTMLAttributes, ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { legendVariants } from './Legend.variants';

export interface LegendItem {
  /** The series name, like "Toyota Camry". Must be unique within a legend. */
  label: string;
  /**
   * A text color class for the swatch, like `text-tally-chart-1`. The swatch
   * is drawn in the current text color, the same way this library's charts
   * are, so give the chart and its legend item the same class and their
   * colors will match:
   *
   * ```tsx
   * <Legend items={[{ label: 'Camry', colorClassName: 'text-tally-chart-1' }]} />
   * <LineChart series={[{ name: 'Camry', colorClassName: 'text-tally-chart-1', … }]} … />
   * ```
   */
  colorClassName: string;
  /** Optional value shown after the label, like a total for the series. */
  value?: ReactNode;
}

export interface LegendProps
  extends
    Omit<HTMLAttributes<HTMLUListElement>, 'children'>,
    VariantProps<typeof legendVariants> {
  /** One entry per series, in the order the chart draws them. */
  items: LegendItem[];
}

/**
 * Color swatches and labels that key a chart's series.
 * @example
 * ```tsx
 * <Legend
 *   items={[
 *     { label: 'Toyota Camry', colorClassName: 'text-tally-chart-1' },
 *     { label: 'Honda Accord', colorClassName: 'text-tally-chart-2' },
 *   ]}
 * />
 * ```
 *
 * @example
 * A vertical legend with a total per series:
 * ```tsx
 * <Legend
 *   orientation="vertical"
 *   items={[
 *     { label: 'Toyota Camry', colorClassName: 'text-tally-chart-1', value: '48,210' },
 *     { label: 'Honda Accord', colorClassName: 'text-tally-chart-2', value: '41,980' },
 *   ]}
 * />
 * ```
 */
export function Legend({
  items,
  orientation,
  className,
  ...props
}: LegendProps) {
  // The explicit role="list" isn't redundant: Safari drops list semantics from
  // a list styled with `list-style: none` (Tailwind's reset does that) unless
  // the role is set.
  return (
    // eslint-disable-next-line jsx-a11y/no-redundant-roles
    <ul
      {...props}
      role="list"
      className={cn(legendVariants({ orientation }), className)}
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              'size-2.5 shrink-0 rounded-full bg-current',
              item.colorClassName,
            )}
          />
          <span className="text-tally-surface-fg">{item.label}</span>
          {item.value !== undefined && (
            <span className="text-tally-muted-fg tabular-nums">
              {item.value}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
