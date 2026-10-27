import { forwardRef } from 'react';
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
 * Forwards `ref` to the heading element, so you can move focus to it, for
 * example after a view changes. Add `tabIndex={-1}` so it can take focus.
 *
 * @useWhen
 * - You title a page or a section of one. Pick `level` from the page outline,
 *   then `size` for how big it should look.
 *
 * @avoidWhen
 * - You title a card. Use Card.Title, which sits in the card's header.
 * - You only want bold or larger text that isn't a section title. Use Text
 *   with `weight` or `size`.
 *
 * @example
 * ```tsx
 * <Heading level={1}>Logistics overview</Heading>
 * <Heading level={2} size="sm" variant="muted">Carrier performance</Heading>
 * ```
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, size, variant, className, children, ...props }, ref) => {
    const Tag = `h${level}` as const;
    const resolvedVariant = variant ?? 'default';

    return (
      <Tag
        {...props}
        ref={ref}
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
  },
);

Heading.displayName = 'Heading';
