import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      /** Visual style. Use `danger` for actions or states that need attention. */
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        ghost: 'bg-transparent text-ghost-foreground hover:bg-ghost-hover',
        danger: 'bg-danger text-danger-foreground hover:bg-danger-hover',
      },
      /** Button height and padding. */
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);
