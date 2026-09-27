import { type ReactNode } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export type EmptyStateIconProps = EmptyStateProps;
export type EmptyStateTitleProps = EmptyStateProps;
export type EmptyStateDescriptionProps = EmptyStateProps;
export type EmptyStateActionsProps = EmptyStateProps;

/**
 * Message shown where data would be but there is none, such as a search with
 * no results. It says what is missing and, optionally, what to do about it.
 *
 * Compose it with `EmptyState.Icon`, `EmptyState.Title`,
 * `EmptyState.Description`, and `EmptyState.Actions`. All parts are optional.
 *
 * It is not a live region by default. If it appears because of something the
 * user just did (for example a filter that matches nothing), pass
 * `role="status"` so the change is announced.
 *
 * @example
 * ```tsx
 * <EmptyState>
 *   <EmptyState.Icon><SearchX /></EmptyState.Icon>
 *   <EmptyState.Title>No articles match your search</EmptyState.Title>
 *   <EmptyState.Description>
 *     Try a different article or a wider date range.
 *   </EmptyState.Description>
 *   <EmptyState.Actions>
 *     <Button variant="secondary">Clear search</Button>
 *   </EmptyState.Actions>
 * </EmptyState>
 * ```
 */
export function EmptyState({
  children,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-8 text-center',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Slot for an icon, shown in a muted circle. The icon is decorative, so the
 * wrapper is hidden from assistive tech and the title carries the meaning.
 */
export function EmptyStateIcon({
  children,
  className,
  ...props
}: EmptyStateIconProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn(
        'flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Short headline saying what is missing. Renders a `div`, so add
 * `role="heading"` and `aria-level` when it belongs in the page outline.
 */
export function EmptyStateTitle({
  children,
  className,
  ...props
}: EmptyStateTitleProps) {
  return (
    <div {...props} className={cn('font-medium', className)}>
      {children}
    </div>
  );
}

/**
 * One or two muted sentences that support the title.
 */
export function EmptyStateDescription({
  children,
  className,
  ...props
}: EmptyStateDescriptionProps) {
  return (
    <div
      {...props}
      className={cn('max-w-sm text-sm text-muted-foreground', className)}
    >
      {children}
    </div>
  );
}

/**
 * Row for the action a user can take, usually a `Button`.
 */
export function EmptyStateActions({
  children,
  className,
  ...props
}: EmptyStateActionsProps) {
  return (
    <div
      {...props}
      className={cn('flex items-center justify-center gap-2 pt-2', className)}
    >
      {children}
    </div>
  );
}

EmptyState.Icon = EmptyStateIcon;
EmptyState.Title = EmptyStateTitle;
EmptyState.Description = EmptyStateDescription;
EmptyState.Actions = EmptyStateActions;
