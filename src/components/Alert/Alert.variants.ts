import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  'flex items-start justify-start gap-2 p-4 text-sm font-medium rounded-tally-panel',
  {
    variants: {
      variant: {
        primary: 'bg-tally-primary text-tally-primary-fg',
        success: 'bg-tally-success text-tally-success-fg',
        danger: 'bg-tally-danger text-tally-danger-fg',
        warning: 'bg-tally-warning text-tally-warning-fg',
        info: 'bg-tally-info text-tally-info-fg',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);
