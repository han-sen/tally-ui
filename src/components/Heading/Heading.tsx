import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { headingVariants } from './Heading.variants';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = NonNullable<VariantProps<typeof headingVariants>['size']>;

export interface HeadingProps
  extends
    HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  /**
   * Which heading element to render, `h1` to `h6`.
   * Only determines markup, for sizing use the `size` prop.
   */
  level: HeadingLevel;
}

// Each level looks like this unless `size` says otherwise.
const defaultSizes: Record<HeadingLevel, HeadingSize> = {
  1: '2xl',
  2: 'xl',
  3: 'lg',
  4: 'md',
  5: 'sm',
  6: 'xs',
};

/**
 * A page or section heading that uses the library's type scale and colors.
 *
 * `level` sets the element (`h1`–`h6`) for the page outline; `size` sets how
 * big it looks. They are separate so a small heading can still be the right
 * level, for example an `h2` styled as `sm` inside a dense card.
 *
 * @example
 * ```tsx
 * <Heading level={1}>Attention tracker</Heading>
 * <Heading level={2} size="sm" variant="muted">Compared articles</Heading>
 * ```
 */
export function Heading({
  level,
  size,
  variant,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;
  const resolvedVariant = variant ?? 'default';

  return (
    <Tag
      {...props}
      data-variant={resolvedVariant}
      className={cn(
        headingVariants({
          size: size ?? defaultSizes[level],
          variant: resolvedVariant,
        }),
        className,
      )}
    >
      {children}
    </Tag>
  );
}
