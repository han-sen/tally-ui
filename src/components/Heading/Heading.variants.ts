import { cva } from 'class-variance-authority';

export const headingVariants = cva('font-semibold text-balance', {
  variants: {
    /** Visual size, independent of the heading level. */
    size: {
      xs: 'text-xs tracking-wide uppercase',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl tracking-tight',
    },
    /** Text color. `muted` matches card headings. */
    variant: {
      default: 'text-tally-surface-fg',
      muted: 'text-tally-muted-heading',
    },
  },
  defaultVariants: {
    size: 'xl',
    variant: 'default',
  },
});
