import type { HTMLAttributes, ReactNode } from 'react';
import {
  directionIcons,
  type Direction,
  type Sentiment,
  type Status,
} from '../../lib/statusIcons';

import { Card } from '../Card/Card';
import { Badge } from '../Badge/Badge';
import { Skeleton } from '../Skeleton/Skeleton';

export interface DeltaProps {
  value: string;
  direction: Direction;
  sentiment: Sentiment;
  comparison?: string;
}

interface StatCardBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Short name of the metric. Stays visible while loading. */
  label: string;
  /** Optional change compared to an earlier period. */
  delta?: DeltaProps;
  /**
   * Optional visual below the value and delta, typically a `Sparkline`.
   * Not shown while loading.
   */
  chart?: ReactNode;
  /**
   * Content for a popup opened by an ellipsis button in the card's top-right
   * corner, such as buttons for this metric. Shown while loading too. See
   * `Card.Header` for how the popup behaves.
   */
  actions?: ReactNode;
  /**
   * Accessible name for the ellipsis button.
   * @default `${label} actions`
   */
  actionsLabel?: string;
}

interface StatCardLoadingProps extends StatCardBaseProps {
  /**
   * Shows skeleton placeholders instead of the value and delta.
   * `value` and `delta` are ignored while loading, so `value` is optional.
   */
  isLoading: true;
  value?: string;
}

interface StatCardLoadedProps extends StatCardBaseProps {
  isLoading?: false;
  /** The headline number, already formatted (for example `"$2,400"`). */
  value: string;
}

export type StatCardProps = StatCardLoadingProps | StatCardLoadedProps;

const sentimentVariant: Record<Sentiment, Status> = {
  positive: 'success',
  negative: 'danger',
  neutral: 'info',
};

const buildSRText = ({
  direction,
  value,
  comparison,
}: {
  direction: Direction;
  value: string;
  comparison?: string | undefined;
}) => {
  const directionText = direction === 'flat' ? 'Remained' : direction;
  return [directionText, value, comparison].filter(Boolean).join(' ');
};

function DeltaIndicator({ delta }: { delta: DeltaProps }) {
  const { value, direction, sentiment, comparison } = delta;
  const DirectionIcon = directionIcons[direction];

  return (
    <>
      <span className="sr-only">
        {buildSRText({ direction, value, comparison })}
      </span>
      <div className="flex items-center text-xs gap-2" aria-hidden={true}>
        <Badge variant={sentimentVariant[sentiment]}>
          <span className="flex items-center text-xs gap-1">
            <DirectionIcon aria-hidden={true} size={12} strokeWidth={4} />
            <p className="font-bold">{value}</p>
          </span>
        </Badge>
        <p className="text-tally-muted-fg">{comparison}</p>
      </div>
    </>
  );
}

/**
 * Card that shows a single headline number with an optional change
 * compared to an earlier period.
 *
 * `delta.direction` says whether the number went up or down, and
 * `delta.sentiment` says whether that is good or bad, so a rising
 * cost can be shown as an increase that is negative.
 *
 * @example
 * ```tsx
 * <StatCard
 *   label="Revenue"
 *   value="$2400"
 *   delta={{
 *     value: '2.4%',
 *     direction: 'up',
 *     sentiment: 'positive',
 *     comparison: 'vs last week',
 *   }}
 * />
 * ```
 */
export function StatCard({
  label,
  value,
  delta,
  chart,
  actions,
  actionsLabel = `${label} actions`,
  isLoading,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      {...props}
      className={className}
      aria-busy={isLoading ? true : undefined}
    >
      {isLoading && (
        <span role="status" className="sr-only">
          Loading {label}
        </span>
      )}
      <Card.Header
        className="text-sm font-semibold text-tally-muted-heading"
        actions={actions}
        actionsLabel={actionsLabel}
      >
        {label}
      </Card.Header>
      <Card.Content>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-4xl font-bold">{value}</p>
            {chart}
            {delta && <DeltaIndicator delta={delta} />}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
