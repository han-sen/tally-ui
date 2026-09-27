import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
export function isDrawable(d: number): boolean {
  return Number.isFinite(d);
}
