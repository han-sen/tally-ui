'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';

export interface ComboboxProps<T> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange'
> {
  items: T[];
  getLabel: (item: T) => string;
  /**
   * Returns a stable, unique key for each item. Used for React keys and
   * option ids, so duplicates break keyboard navigation.
   */
  getKey: (item: T) => string;
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (item: T | null) => void;
  inputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  filter?: ((item: T, query: string) => boolean) | null;
  /**
   * Visible label for the input, also used as its accessible name.
   * Required so the combobox is never announced without a name.
   */
  label: string;
  /**
   * Property used to determine whether to show a visual loading
   * indicator.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Child component to render when there are no
   * available options for dropdown
   */
  emptyMessage?: ReactNode;
  renderItem?: (
    item: T,
    state: { active: boolean; selected: boolean },
  ) => ReactNode;
  /**
   * Custom classname is supplied to the <input> element, not the wrapper
   */
  className?: string;
  /**
   * Prevents typing and opening the list.
   * @default false
   */
  disabled: false;
}

export function Combobox<T>({
  items,
  getLabel,
  getKey,
  value,
  defaultValue,
  onValueChange,
  inputValue,
  onInputValueChange,
  filter,
  label,
  isLoading = false,
  emptyMessage,
  renderItem,
  placeholder,
  className,
  disabled = false,
  ...props
}: ComboboxProps<T>) {
  return <div></div>;
}
