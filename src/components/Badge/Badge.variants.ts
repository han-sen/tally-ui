import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'text-sm font-bold px-2.5 py-1 rounded-panel',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        success: 'bg-success text-success-foreground',
        danger: 'bg-danger text-danger-foreground',
        warning: 'bg-warning text-warning-foreground',
        info: 'bg-info text-info-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);
