import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { textVariants } from './Text.variants';

export interface TextProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  /**
   * The element to render. Use `p` for a paragraph, `span` for text inside a
   * line, and `div` when it wraps other blocks.
   * @default 'p'
   */
  as?: 'p' | 'span' | 'div';
  /**
   * Monospace with fixed-width digits, so numbers in a column line up.
   * @default false
   */
  mono?: boolean;
}

/**
 * Body text that uses the library's type scale and colors, so text stays on
 * the tokens instead of one-off classes.
 *
 * @example
 * ```tsx
 * <Text variant="muted" size="sm">Wikipedia page views for car models</Text>
 * <Text as="span" mono>48,210</Text>
 * ```
 */
export function Text({
  as: Tag = 'p',
  size,
  variant,
  weight,
  mono = false,
  className,
  children,
  ...props
}: TextProps) {
  const resolvedVariant = variant ?? 'default';

  return (
    <Tag
      {...props}
      data-variant={resolvedVariant}
      className={cn(
        textVariants({ size, variant: resolvedVariant, weight, mono }),
        className,
      )}
    >
      {children}
    </Tag>
  );
}
