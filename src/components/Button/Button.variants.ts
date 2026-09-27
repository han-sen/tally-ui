import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-tally-control font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-tally-ring ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      /**
       * Visual style. Use `danger` for actions or states that need attention.
       *
       * Each variant also sets the glow's color, which only shows when `glow`
       * adds the shadow. Pale fills would barely show as a shadow, so those
       * variants use their darker text color instead. Primary has white text,
       * so it uses its fill.
       */
      variant: {
        primary:
          'bg-tally-primary text-tally-primary-fg hover:bg-tally-primary-hover shadow-tally-primary/45',
        secondary:
          'bg-tally-secondary text-tally-secondary-fg hover:bg-tally-secondary-hover shadow-current/25',
        ghost: 'bg-transparent text-tally-ghost-fg hover:bg-tally-ghost-hover',
        danger:
          'bg-tally-danger text-tally-danger-fg hover:bg-tally-danger-hover shadow-current/35',
      },
      /** Button height and padding. */
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
      /** Soft shadow under the button in its own color. */
      glow: {
        true: '',
        false: '',
      },
    },
    // Ghost has no fill, so a shadow would float under nothing. It ignores glow.
    compoundVariants: [
      {
        variant: ['primary', 'secondary', 'danger'],
        glow: true,
        class: 'shadow-tally-glow',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      glow: false,
    },
  },
);
