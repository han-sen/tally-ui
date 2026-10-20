import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Single-line text field. It is a styled native `<input>` with no state of its
 * own, so `value`, `defaultValue`, `onChange`, `type`, `placeholder`, and
 * `disabled` all work as they do on a plain input.
 *
 * States come from attributes, not props: `disabled` and `readOnly` are native,
 * and `aria-invalid="true"` marks an invalid value and styles it as one.
 *
 * Always give it an accessible name, either a `<label htmlFor>` pointing at its
 * `id` or an `aria-label`.
 *
 * @useWhen
 * - You need arbitrary text, like a tracking number or a search query.
 *
 * @avoidWhen
 * - People pick from a known list, like a carrier or warehouse. Use Combobox.
 * - People pick one of a few options. Use RadioGroup.
 *
 * @example
 * ```tsx
 * <label htmlFor="tracking-number">Tracking number</label>
 * <Input id="tracking-number" placeholder="SHP-10482" />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        {...props}
        className={cn(
          'h-10 w-full rounded-tally-control border border-tally-input bg-tally-surface px-4 text-sm text-tally-surface-fg',
          'placeholder:text-tally-muted-fg',
          'focus-visible:ring-2 focus-visible:ring-tally-ring focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'read-only:bg-tally-muted',
          'aria-invalid:border-tally-danger-fg',
          className,
        )}
      />
    );
  },
);

Input.displayName = 'Input';
