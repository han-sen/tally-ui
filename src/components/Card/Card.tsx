import { type ReactNode } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export type CardHeaderProps = CardProps;
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
        'flex flex-col gap-4 rounded-card bg-surface py-6 text-surface-foreground shadow-card',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Top section of a `Card`, usually holding `Card.Title` and `Card.Description`.
 */
export function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div {...props} className={cn('flex flex-col gap-1 px-6', className)}>
      {children}
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
    <div
      {...props}
      className={cn('text-sm text-muted-foreground', className)}
    >
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
export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
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
