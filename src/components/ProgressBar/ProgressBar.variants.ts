import { cva } from 'class-variance-authority';

// The filled part of the bar. Colors use the `-chart` tokens, the brighter
// line colors Sparkline uses, which read better as a thin fill.
export const progressIndicatorVariants = cva(
  'h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none',
  {
    variants: {
      variant: {
        primary: 'bg-tally-primary-chart',
        success: 'bg-tally-success-chart',
        warning: 'bg-tally-warning-chart',
        danger: 'bg-tally-danger-chart',
        info: 'bg-tally-info-chart',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

// The empty track behind the fill.
export const progressTrackVariants = cva('w-full rounded-full bg-tally-muted', {
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-2',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
