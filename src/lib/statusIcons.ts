import {
  Info,
  CircleCheck,
  TriangleAlert,
  OctagonAlert,
  MoveUpRight,
  MoveDownLeft,
  FoldVertical,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Status = 'primary' | 'info' | 'success' | 'warning' | 'danger';

export const statusIcons: Record<Status, LucideIcon> = {
  primary: Info,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: OctagonAlert,
};

export type Direction = 'up' | 'down' | 'flat';
export type Sentiment = 'positive' | 'negative' | 'neutral';

export const directionIcons: Record<Direction, LucideIcon> = {
  up: MoveUpRight,
  down: MoveDownLeft,
  flat: FoldVertical,
};
