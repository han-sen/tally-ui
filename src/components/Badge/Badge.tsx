import { type ReactNode } from 'react';
import type { HTMLAttributes } from 'react';
import { badgeVariants } from './Badge.variants';
import { cn } from '../../lib/utils';
import type { VariantProps } from 'class-variance-authority';

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /**
   * The color, chosen by meaning: success for good, warning for needs
   * attention, danger for bad, info for neutral notes, primary for anything else.
   * @default 'primary'
   */
  variant?: VariantProps<typeof badgeVariants>['variant'];
  /** Text content for the badge */
  children: ReactNode;
}

/**
 * Badge component used for denoting an element's
 * category or status, for example a shipment status
 * like 'pending', 'shipped', or 'delivered'.
 *
 * @useWhen
 * - Showing a status next to a value, such as on-time rate in a table cell.
 * - Tagging a row or card with a category or status.
 *
 * @avoidWhen
 * - Rendering clickable elements, badge is a span.
 *  Use a Button for interactive elements.
 * - You need long text. Keep it to a word or two or a number.
 *
 * @example
 * ```tsx
 * <Badge variant="primary">Pending</Badge>
 * ```
 * @example
 * ```tsx
 * <Badge variant="success">Delivered</Badge>
 * ```
 */

export const Badge = ({
  variant,
  children,
  className,
  ...props
}: BadgeProps) => {
  const resolvedVariant = variant ?? 'primary';

  return (
    <span
      data-variant={resolvedVariant}
      {...props}
      className={cn(badgeVariants({ variant: resolvedVariant }), className)}
    >
      {children}
    </span>
  );
};
