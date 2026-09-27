import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  'flex items-start justify-start gap-2 p-4 text-sm font-medium rounded-panel',
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
