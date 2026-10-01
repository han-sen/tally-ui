import { type ReactNode } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { CardActions } from './CardActions';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardHeaderProps extends CardProps {
  /**
   * Content for a popup opened by an ellipsis button in the header's top-right
   * corner, such as buttons or links for this card. The button only appears
   * when `actions` is passed. Clicking a button or link inside closes the
   * popup.
   */
  actions?: ReactNode;
  /**
   * Accessible name for the ellipsis button. Name it after the card when a
   * page has several, like "Total views actions".
   * @default 'More actions'
   */
  actionsLabel?: string;
}
export type CardTitleProps = CardProps;
export type CardDescriptionProps = CardProps;
export type CardContentProps = CardProps;
export type CardFooterProps = CardProps;

/**
 * Bordered surface that groups related content.
 *
 * Compose it with `Card.Header`, `Card.Title`, `Card.Description`,
 * `Card.Content`, and `Card.Footer`. All parts are optional.
 *
 * @example
 * ```tsx
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Median price</Card.Title>
 *     <Card.Description>Last 30 days</Card.Description>
 *   </Card.Header>
 *   <Card.Content>$24,300</Card.Content>
 *   <Card.Footer>Updated today</Card.Footer>
 * </Card>
 * ```
 */
export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col gap-4 rounded-tally-card bg-tally-surface py-6 text-tally-surface-fg shadow-tally-card',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Top section of a `Card`, usually holding `Card.Title` and `Card.Description`.
 * Pass `actions` to add an ellipsis button that opens them in a popup.
 *
 * @example
 * ```tsx
 * <Card.Header
 *   actions={
 *     <>
 *       <Button variant="ghost" size="sm">Export CSV</Button>
 *       <Button variant="ghost" size="sm">Remove</Button>
 *     </>
 *   }
 * >
 *   <Card.Title>Total views</Card.Title>
 * </Card.Header>
 * ```
 */
export function CardHeader({
  children,
  className,
  actions,
  actionsLabel = 'More actions',
  ...props
}: CardHeaderProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col gap-1 px-6 text-tally-muted-heading',
        // Room on the right for the actions button, so text never runs under it.
        actions != null && 'relative pr-14',
        className,
      )}
    >
      {children}
      {actions != null && (
        // Out of the layout flow, so a header is the same height with or
        // without actions. Pulled up to center the 32px button on a 20px line.
        <div className="absolute -top-1.5 right-4">
          <CardActions label={actionsLabel}>{actions}</CardActions>
        </div>
      )}
    </div>
  );
}

/**
 * Heading text for a `Card`. Renders a `div`, so add `role="heading"` and
 * `aria-level` when the card title should appear in the page outline.
 */
export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <div {...props} className={cn('leading-none font-semibold', className)}>
      {children}
    </div>
  );
}

/**
 * Secondary, muted text that supports the `Card.Title`.
 */
export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <div {...props} className={cn('text-sm text-tally-muted-fg', className)}>
      {children}
    </div>
  );
}

/**
 * Main body of a `Card`.
 */
export function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  return (
    <div {...props} className={cn('px-6', className)}>
      {children}
    </div>
  );
}

/**
 * Bottom section of a `Card`, laid out as a row for actions or metadata.
 */
export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div {...props} className={cn('flex items-center gap-2 px-6', className)}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
