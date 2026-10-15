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
  /** The change, already formatted (for example `"2.4%"`). */
  value: string;
  /** A direction to control arrow orientation. */
  direction: Direction;
  /**
   * Whether the change is good or bad, which sets the badge color.
   * Independent of direction: a rising cost is `'up'` and `'negative'`.
   */
  sentiment: Sentiment;
  /** The period being compared against, e.g. `"vs last week"`. */
  comparison?: string;
}

export interface StatCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Short name of the metric. Stays visible while loading. */
  label: string;
  /**
   * The headline number, already formatted (for example `"$2,400"`).
   * When it's missing or empty and the card isn't loading, the card shows
   * "N/A" (announced as "No data").
   */
  value?: string;
  /** Optional change compared to an earlier period. */
  delta?: DeltaProps;
  /**
   * Optional visual between the value and the delta, typically a `Sparkline`.
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
  /**
   * Shows skeleton placeholders instead of the value, chart, and delta.
   * @default false
   */
  isLoading?: boolean;
}

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
 * Optionally render a chart in the card body, for example a Sparkline to display
 * time-series data that matches the `delta.comparison` time interval.
 *
 * @useWhen
 * You want to show a single aggregate value, with optional chart
 * for over-time view, such as Total Shipments.
 *
 * @avoidWhen
 * You have data that needs to render in table form or side by side comparison.
 *
 * @avoidWhen
 * This component would be wrapped within another Card instance.
 *
 * @related
 * {@link Card}
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
 *
 * @example
 * ```tsx
 * <StatCard label="Shipments" isLoading={isLoading} value={data?.total} />
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
            {!value ? (
              <p className="text-4xl font-bold text-tally-muted-fg">
                <span aria-hidden={true}>N/A</span>
                <span className="sr-only">No data</span>
              </p>
            ) : (
              <p className="text-4xl font-bold">{value}</p>
            )}
            {chart}
            {delta && <DeltaIndicator delta={delta} />}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
