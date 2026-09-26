import { type ReactNode } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { alertVariants } from './Alert.variants';
import { statusIcons, type Status } from '../../lib/statusIcons';

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  children: ReactNode;
}

export interface AlertTitleProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const getRole = (status: Status) => {
  return status === 'warning' || status === 'danger' ? 'alert' : 'status';
};

/**
 * Callout that draws attention to a message, with an icon matching its `variant`.
 * `warning` and `danger` alerts use `role="alert"` so they are announced
 * immediately, the others use `role="status"`.
 *
 * Compose the content with `Alert.Title` and `Alert.Description`,
 * or pass plain text for a single-line alert.
 *
 * @example
 * ```tsx
 * <Alert variant="danger">
 *   <Alert.Title>Open recall</Alert.Title>
 *   <Alert.Description>
 *     Contact your dealer to schedule a free repair.
 *   </Alert.Description>
 * </Alert>
 * ```
 */
export const Alert = ({
  variant,
  children,
  className,
  ...props
}: AlertProps) => {
  const status = variant ?? 'primary';
  const Icon = statusIcons[status];

  return (
    <div
      data-variant={status}
      className={cn(alertVariants({ variant: status }), className)}
      {...props}
      role={getRole(status)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
};

/**
 * Short heading for the alert, used inside `Alert`.
 */
export function AlertTitle({
  children,
  className,
  ...props
}: AlertTitleProps) {
  return (
    <div {...props} className={cn('font-semibold', className)}>
      {children}
    </div>
  );
}

/**
 * Supporting detail for the alert, used inside `Alert` below `Alert.Title`.
 */
export function AlertDescription({
  children,
  className,
  ...props
}: AlertDescriptionProps) {
  return (
    <div {...props} className={cn('font-normal opacity-90', className)}>
      {children}
    </div>
  );
}

Alert.Title = AlertTitle;
Alert.Description = AlertDescription;
