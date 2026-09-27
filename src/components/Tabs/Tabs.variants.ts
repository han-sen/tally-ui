import { cva } from 'class-variance-authority';

// `transition` rather than `transition-colors` so the glow's box-shadow fades
// between tabs along with the fill, instead of jumping. The default 150ms reads
// as an instant switch, so it is slowed down enough to see.
export const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-tally-control px-4 py-1.5 text-sm font-medium transition duration-300 ease-out ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-tally-ring',
  {
    variants: {
      active: {
        true: 'bg-tally-primary text-tally-primary-fg',
        false: 'text-tally-secondary-fg hover:bg-tally-secondary-hover',
      },
      glow: {
        true: '',
        false: '',
      },
    },
    // Only the selected tab glows, in its primary fill color (its text is
    // white, so it can't use currentColor like the status badges do).
    compoundVariants: [
      {
        active: true,
        glow: true,
        class: 'shadow-tally-glow shadow-tally-primary/45',
      },
    ],
    defaultVariants: {
      glow: false,
    },
  },
);
