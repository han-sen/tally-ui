import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  'flex items-start justify-start gap-2 p-4 text-sm font-medium rounded-tally-panel',
  {
    variants: {
      variant: {
        primary: 'bg-tally-primary text-tally-primary-foreground',
        success: 'bg-tally-success text-tally-success-foreground',
        danger: 'bg-tally-danger text-tally-danger-foreground',
        warning: 'bg-tally-warning text-tally-warning-foreground',
        info: 'bg-tally-info text-tally-info-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);
