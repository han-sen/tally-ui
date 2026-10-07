import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge only knows Tailwind's default shadow sizes. Without these, a
// custom size such as `shadow-tally-glow` is read as a shadow color and drops
// the real color class (for example `shadow-current/35`) as a conflict.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      shadow: ['tally-card', 'tally-glow'],
    },
  },
});

/**
 * Merges class names, resolving conflicting Tailwind utility classes
 * (e.g. `cn('px-2', 'px-4')` → `'px-4'`) instead of concatenating both.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Filter a flat array of data for null, undefined, or NaN values
 * so they can rendered by chart components
 */
export function isDrawable(d: number | undefined): boolean {
  return Number.isFinite(d);
}
