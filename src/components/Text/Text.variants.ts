import { cva } from 'class-variance-authority';

export const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    /**
     * Text color. Every option passes WCAG AA as body text on a surface; see
     * Foundations/Colors.
     */
    variant: {
      default: 'text-tally-surface-fg',
      muted: 'text-tally-muted-fg',
      success: 'text-tally-success-fg',
      danger: 'text-tally-danger-fg',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    /** Monospace with fixed-width digits, for IDs, codes, and numbers. */
    mono: {
      true: 'font-mono tabular-nums',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
    weight: 'normal',
    mono: false,
  },
});
