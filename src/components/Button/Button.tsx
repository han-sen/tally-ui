import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { buttonVariants } from './Button.variants';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Renders a spinner and disables the button. Use for in-flight async
   * actions (e.g. form submission) rather than manually toggling `disabled`.
   */
  isLoading?: boolean;
}

/**
 * Primary interactive control for triggering an action.
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleSave}>Save</Button>
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
