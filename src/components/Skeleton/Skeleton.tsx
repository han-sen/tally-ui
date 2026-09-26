import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

export type SkeletonProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

/**
 * Placeholder shape that stands in for content while it loads.
 *
 * Size and shape come from `className` (for example `h-4 w-32` for a line of
 * text, or `size-10 rounded-full` for an avatar). It renders a `span`, so it
 * is valid inside a `p`, a heading, or a button label, and it is hidden from
 * assistive tech. Announce the loading state on the surrounding component
 * instead, for example with `aria-busy` and visually hidden status text.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-32" />
 * ```
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn(
        'block rounded-md bg-secondary motion-safe:animate-pulse',
        className,
      )}
    />
  );
}
