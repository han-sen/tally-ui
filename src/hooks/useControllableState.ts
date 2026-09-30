import { useState } from 'react';

export interface UseControllableStateOptions<V> {
  /** The controlled value. `undefined` means uncontrolled. */
  value: V | undefined;
  /** Starting value when uncontrolled. */
  defaultValue: V;
  /** Called on every change, in both modes. */
  onChange?: (next: V) => void;
}

export function useControllableState<V>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<V>): [V, (next: V) => void] {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(() => defaultValue);

  const currentValue = isControlled ? value : internalValue;

  const setValue = (nextValue: V) => {
    if (nextValue === currentValue) return;

    onChange?.(nextValue);
    if (!isControlled) {
      setInternalValue(() => nextValue);
    }
  };

  return [currentValue, setValue];
}
