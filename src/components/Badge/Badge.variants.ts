import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'text-sm font-bold px-2.5 py-1 rounded-tally-panel',
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
