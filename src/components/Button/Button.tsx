import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { buttonVariants } from './Button.variants';

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Renders a spinner and disables the button. Use for in-flight async
   * actions (e.g. form submission) rather than manually toggling `disabled`.
   */
  isLoading?: boolean;
  /**
   * Visual weight, chosen by importance: `primary` for the main action in a
   * view (usually one), `secondary` for other actions, `ghost` for low-emphasis
   * actions like menu items, and `danger` for destructive actions like delete.
   * @default 'primary'
   */
  variant?: VariantProps<typeof buttonVariants>['variant'];
  /**
   * Height and padding. Use `sm` in dense places like card headers and table
   * rows.
   * @default 'md'
   */
  size?: VariantProps<typeof buttonVariants>['size'];
}

/**
 * Button that triggers an action, like saving, exporting, or opening a menu.
 * It is a native `<button>`, so `type`, `disabled`, and `onClick` work as
 * usual.
 *
 * @useWhen
 * - You trigger an action on the current page, like submitting a form or
 *   exporting a table.
 *
 * @avoidWhen
 * - You go to another page. Use a link (`<a>`) so it opens in a new tab and
 *   reads as navigation.
 * - You show a status. Use Badge, which isn't clickable.
 *
 * @example
 * ```tsx
 * <Button onClick={handleExport}>Export CSV</Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button variant="secondary" isLoading={isSaving} onClick={handleSave}>
 *   Save
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedVariant = variant ?? 'primary';

    return (
      <button
        ref={ref}
        type="button"
        data-variant={resolvedVariant}
        className={cn(
          buttonVariants({ variant: resolvedVariant, size }),
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
