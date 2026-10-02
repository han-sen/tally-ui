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
}

/**
 * Badge component
 *
 * @example
 * <Badge variant="primary">Test</Badge>
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
