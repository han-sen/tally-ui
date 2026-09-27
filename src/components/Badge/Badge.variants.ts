import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'text-sm font-bold px-2.5 py-1 rounded-tally-panel',
  {
    variants: {
      // Each variant also sets the glow's color, which only shows when `glow`
      // adds the shadow. Status badges have pale fills that would barely show
      // as a shadow, so they use their darker text color instead. Primary has
      // white text, so it uses its fill.
      variant: {
        primary:
          'bg-tally-primary text-tally-primary-fg shadow-tally-primary/45',
        success:
          'bg-tally-success text-tally-success-fg shadow-current/35',
        danger:
          'bg-tally-danger text-tally-danger-fg shadow-current/35',
        warning:
          'bg-tally-warning text-tally-warning-fg shadow-current/35',
        info: 'bg-tally-info text-tally-info-fg shadow-current/35',
      },
      glow: {
        true: 'shadow-tally-glow',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      glow: false,
    },
  },
);
