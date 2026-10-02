import { cva } from 'class-variance-authority';

export const radioGroupVariants = cva('flex w-fit', {
  variants: {
    orientation: {
      vertical: 'flex-col gap-3',
      horizontal: 'flex-row flex-wrap gap-x-6 gap-y-3',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

// Each option is a <label> wrapping its radio, which names the radio and makes
// the whole row clickable. `has-disabled:` styles the row from the radio's
// native state.
export const radioOptionVariants = cva(
  'flex cursor-pointer items-start gap-2 text-sm text-tally-surface-fg select-none ' +
    'has-disabled:cursor-not-allowed has-disabled:opacity-50',
);

// The radio itself, drawn with `appearance-none` so it uses the tokens in
// every browser. The border stays 1px in every state, so nothing changes size
// when it is checked: checked fills it with primary, and a surface-colored
// inset shadow leaves a dot in the middle.
export const radioVariants = cva(
  'mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-tally-input bg-tally-surface ' +
    'checked:border-tally-primary checked:bg-tally-primary checked:inset-shadow-[0_0_0_3px_var(--tally-surface)] ' +
    'focus-visible:ring-2 focus-visible:ring-tally-ring focus-visible:ring-offset-2 focus-visible:outline-none ' +
    'disabled:cursor-not-allowed',
);
