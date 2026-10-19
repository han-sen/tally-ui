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
   * Font size on the type scale. Use `sm` or `xs` for captions and secondary
   * details next to body text.
   * @default 'md'
   */
  size?: VariantProps<typeof textVariants>['size'];
  /**
   * Text color, chosen by meaning: `muted` for secondary details, `success`
   * and `danger` when the text itself carries a good or bad status. Every
   * option passes WCAG AA as body text on a surface.
   * @default 'default'
   */
  variant?: VariantProps<typeof textVariants>['variant'];
  /**
   * Font weight. Use `medium` or `semibold` for emphasis inside body text, not
   * for headings.
   * @default 'normal'
   */
  weight?: VariantProps<typeof textVariants>['weight'];
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
 * @useWhen
 * - You need body copy, a caption, or a supporting detail under a value.
 * - You show numbers or IDs that should line up in a column. Set `mono`.
 *
 * @avoidWhen
 * - You need a heading or section title. Use Heading, which keeps the heading
 *   level separate from its size.
 * - You need a short status label on an item. Use Badge.
 *
 * @example
 * ```tsx
 * <Text variant="muted" size="sm">Shipments across all carriers and warehouses</Text>
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
