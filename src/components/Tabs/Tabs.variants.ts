import { cva } from 'class-variance-authority';

export const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-control px-4 py-1.5 text-sm font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
  {
    variants: {
      active: {
        true: 'bg-primary text-primary-foreground',
        false: 'text-secondary-foreground hover:bg-secondary-hover',
      },
    },
  },
);
