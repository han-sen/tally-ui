import { cva } from 'class-variance-authority';

export const legendVariants = cva('flex text-sm', {
  variants: {
    orientation: {
      horizontal: 'flex-row flex-wrap gap-x-5 gap-y-2',
      vertical: 'flex-col gap-2',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});
