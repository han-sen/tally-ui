import { useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../lib/utils';
import {
  radioGroupVariants,
  radioOptionVariants,
  radioVariants,
} from './RadioGroup.variants';

export interface RadioGroupOption<V extends string> {
  /** The value reported when this option is chosen. Must be unique. */
  value: V;
  /** What the option shows next to its radio. */
  label: ReactNode;
  /** Optional supporting text under the label, read as the radio's description. */
  description?: ReactNode;
  /** Prevents choosing this option. */
  disabled?: boolean;
}

export interface RadioGroupProps<V extends string> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  /** The choices, in order. */
  options: RadioGroupOption<V>[];
  /**
   * What the group chooses, like "Date range". Shown above the options and
   * used as the group's accessible name.
   */
  label: string;
  /**
   * Hides the label visually but keeps it for screen readers. Use it where
   * the context already says what the options are for.
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Stacks the options or lines them up in a row. Arrow keys move the choice
   * either way.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /** The chosen value, controlled. Omit to let the group manage it. */
  value?: V;
  /**
   * The starting value when uncontrolled. Read once on mount.
   * @default the first option's value
   */
  defaultValue?: V;
  /** Called with the new value when the user chooses a different option. */
  onValueChange?: (value: V) => void;
  /**
   * Form field name, so the chosen value is submitted with a surrounding
   * form. Generated when omitted.
   */
  name?: string;
  /**
   * Prevents choosing any option.
   * @default false
   */
  disabled?: boolean;
}

/**
 * A set of options where exactly one is chosen, like a date range or a sort
 * order.
 *
 * Built on native radio inputs, so screen readers announce a radio group,
 * arrow keys move the choice, and the value submits with forms. Option values
 * are inferred from `options`, so `onValueChange` gets the exact union.
 *
 * For switching between panels of content, use `Tabs` instead.
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   label="Date range"
 *   orientation="horizontal"
 *   options={[
 *     { value: '7', label: '7 days' },
 *     { value: '30', label: '30 days' },
 *     { value: '90', label: '90 days' },
 *   ]}
 *   defaultValue="30"
 *   onValueChange={(days) => setRange(days)}
 * />
 * ```
 *
 * @example
 * With descriptions:
 * ```tsx
 * <RadioGroup
 *   label="Sort articles by"
 *   options={[
 *     { value: 'total', label: 'Total views', description: 'All views in the range' },
 *     { value: 'change', label: 'Change', description: 'Rise or fall since the last range' },
 *   ]}
 * />
 * ```
 */
export function RadioGroup<V extends string>({
  options,
  label,
  hideLabel = false,
  orientation = 'vertical',
  value,
  defaultValue,
  onValueChange,
  name,
  disabled = false,
  className,
  ...props
}: RadioGroupProps<V>) {
  const id = useId();
  const labelId = `${id}-label`;
  const groupName = name ?? `${id}-name`;

  const [selected, setSelected] = useControllableState<V | undefined>({
    value,
    defaultValue: defaultValue ?? options[0]?.value,
    onChange: (next) => {
      if (next !== undefined) onValueChange?.(next);
    },
  });

  return (
    <div className="flex w-fit flex-col gap-2">
      <span
        id={labelId}
        className={cn(
          'text-sm font-medium text-tally-surface-fg',
          hideLabel && 'sr-only',
        )}
      >
        {label}
      </span>
      <div
        {...props}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        className={cn(radioGroupVariants({ orientation }), className)}
      >
        {options.map((option, index) => {
          const optionLabelId = `${id}-option-${index}`;
          const descriptionId = option.description
            ? `${id}-description-${index}`
            : undefined;

          return (
            <label key={option.value} className={radioOptionVariants()}>
              <input
                type="radio"
                className={radioVariants()}
                name={groupName}
                value={option.value}
                checked={selected === option.value}
                disabled={disabled || option.disabled}
                // The wrapping <label> would also include the description in
                // the name; point at the label text alone, and describe it
                // with the description instead.
                aria-labelledby={optionLabelId}
                aria-describedby={descriptionId}
                onChange={() => setSelected(option.value)}
              />
              <span className="flex flex-col gap-0.5">
                <span id={optionLabelId} className="font-medium">
                  {option.label}
                </span>
                {option.description && (
                  <span id={descriptionId} className="text-tally-muted-fg">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
