import { cva } from 'class-variance-authority';

// The default 150ms reads as an instant switch, so the fill's transition is
// slowed down enough to see.
export const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-tally-control px-4 py-1.5 text-sm font-medium transition-colors duration-300 ease-out ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-tally-ring',
  {
    variants: {
      active: {
        true: 'bg-tally-primary text-tally-primary-fg',
        false: 'text-tally-secondary-fg hover:bg-tally-surface-fg/5',
      },
    },
  },
);
