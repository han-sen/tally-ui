import { type ReactNode } from 'react';
import type { HTMLAttributes } from 'react';
import { badgeVariants } from './Badge.variants';
import { cn } from '../../lib/utils';
import type { VariantProps } from 'class-variance-authority';

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /**
   * Text content for the badge
   */
  children: ReactNode;
  /**
   * Adds a soft shadow under the badge in its own color, so it looks lifted
   * off the surface. Off by default.
   */
  glow?: boolean;
}

/**
 * Badge component
 *
 * @example
 * <Badge variant="primary">Test</Badge>
 */

export const Badge = ({
  variant,
  glow = false,
  children,
  className,
  ...props
}: BadgeProps) => {
  const resolvedVariant = variant ?? 'primary';

  return (
    <span
      data-variant={resolvedVariant}
      {...props}
      className={cn(
        badgeVariants({ variant: resolvedVariant, glow }),
        className,
      )}
    >
      {children}
    </span>
  );
};
