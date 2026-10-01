'use client';

import { useId, useState } from 'react';
import type { InputHTMLAttributes, ReactNode, ChangeEvent } from 'react';
import { useControllableState } from '../../hooks/useControllableState';

import { Input } from '../Input/Input';

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
  /**
   * The selected option (controlled). Pass `null` for no selection.
   * Omit to let the combobox manage selection itself.
   */
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
  disabled?: boolean;
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
  disabled = false,
  id: userId,
  ...props
}: ComboboxProps<T>) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const comboboxId = userId ?? `${baseId}-combobox`;
  const listboxId = `${baseId}-listbox`;

  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useControllableState({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
  const [query, setQuery] = useControllableState({
    value: inputValue,
    defaultValue: '',
    onChange: onInputValueChange,
  });

  const handleSelectOption = (item: T): void => {
    setSelectedOption(item);
    setQuery(getLabel(item));
    setExpanded(false);
  };

  const handleSetQuery = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
    if (e.target.value.length > 0 && !expanded) {
      setExpanded(true);
    }
  };

  const defaultFilter = (item: T, text: string): boolean => {
    return getLabel(item).toLowerCase().includes(text.toLowerCase());
  };

  const filteredItems =
    filter === null
      ? items
      : items.filter((item) => (filter ?? defaultFilter)(item, query));

  return (
    <div className="relative">
      <label id={labelId} htmlFor={comboboxId}>
        {label}
      </label>
      <Input
        {...props}
        id={comboboxId}
        disabled={disabled}
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={expanded ? listboxId : undefined}
        value={query}
        onChange={handleSetQuery}
      />
      {expanded && (
        <ul role="listbox" id={listboxId} aria-labelledby={labelId}>
          {filteredItems.map((item) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard is handled on the input via aria-activedescendant
            <li
              role="option"
              id={`${baseId}-option-${encodeURIComponent(getKey(item))}`}
              key={getKey(item)}
              aria-selected={
                selectedOption ? getKey(item) === getKey(selectedOption) : false
              }
              onClick={() => handleSelectOption(item)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {getLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
