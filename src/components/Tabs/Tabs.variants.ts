import { cva } from 'class-variance-authority';

export const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-tally-control px-4 py-1.5 text-sm font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-tally-ring',
  {
    variants: {
      active: {
        true: 'bg-tally-primary text-tally-primary-foreground',
        false: 'text-tally-secondary-foreground hover:bg-tally-secondary-hover',
      },
    },
  },
);
