'use client';

import { useId, useState } from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
} from 'react';
import { useControllableState } from '../../hooks/useControllableState';

import { cn } from '../../lib/utils';
import { getNextIndex } from '../../lib/navigation';
import { Input } from '../Input/Input';
import { Skeleton } from '../Skeleton/Skeleton';

// Shared by the listbox and the empty message so both float under the input.
const panelClasses =
  'absolute top-full z-10 mt-1 w-full rounded-tally-card bg-tally-surface text-tally-surface-fg shadow-tally-card';

export interface ComboboxProps<T> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange'
> {
  /**
   * Every option the combobox can show. Filtered against the typed text
   * unless `filter` is `null`. Items can be any type; `getLabel` and `getKey`
   * tell the combobox how to read them.
   */
  items: T[];
  /**
   * Returns the text for an item. Used as the default row content, by the
   * default filter, as the input's text after selection, and as the option's
   * accessible name when `renderItem` is set.
   */
  getLabel: (item: T) => string;
  /**
   * Returns a stable, unique key for each item. Used for React keys and
   * option ids, so duplicates break keyboard navigation.
   */
  getKey: (item: T) => string;
  /**
   * The selected option, controlled. Pass `null` for "nothing selected".
   * Omit (leave `undefined`) to let the combobox manage selection itself.
   * When controlled, selecting an option only calls `onValueChange`; the
   * selection changes when you pass a new `value`.
   */
  value?: T | null;
  /**
   * The starting selection when uncontrolled. Read once on mount; later
   * changes are ignored, like a native input's `defaultValue`.
   * @default null
   */
  defaultValue?: T | null;
  /**
   * Called with the item when the user selects an option, by click or by
   * Enter. Called in both controlled and uncontrolled mode, but not when the
   * already selected option is selected again. Runs after the text is set to
   * the item's label, so it can change the text (for example, clear it).
   */
  onValueChange?: (item: T | null) => void;
  /**
   * The typed text, controlled. Omit to let the combobox manage it. Control it
   * when you need the text yourself, for example to fetch results for async
   * search. Selecting an option sets the text to `getLabel(item)`.
   */
  inputValue?: string;
  /**
   * Called with the new text on every keystroke, when an option is selected,
   * and when Escape clears the input.
   */
  onInputValueChange?: (inputValue: string) => void;
  /**
   * Decides which items match the typed text.
   * - Omit it for the default: a case-insensitive "contains" match on
   *   `getLabel`.
   * - Pass a function for custom matching (it gets each item and the text).
   * - Pass `null` when `items` are already filtered, such as server search
   *   results, to show them unchanged.
   */
  filter?: ((item: T, query: string) => boolean) | null;
  /**
   * Label for the input, also used as its accessible name.
   * Required so the combobox is never announced without a name; use
   * `hideLabel` to keep it for screen readers without showing it.
   */
  label: string;
  /**
   * Hides the label visually but keeps it for screen readers. Use it where
   * the context already says what the field is for, like a compact toolbar
   * with a descriptive placeholder.
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Replaces the options with skeleton rows and announces "Loading…" to
   * screen readers. While loading, the keyboard can't highlight or select
   * options, since `items` may still be results for the previous text.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Content shown in the panel when the list is open and nothing matches, for
   * example `"No articles found"`.
   */
  emptyMessage?: ReactNode;
  /**
   * Custom content for each option row. The combobox still renders the row
   * itself (role, id, selection, click handling), so return only what goes
   * inside it. `active` is the keyboard or mouse highlight; `selected` is the
   * current value. Screen readers announce the row by `getLabel`, not by this
   * content.
   * @default getLabel(item)
   */
  renderItem?: (
    item: T,
    state: { active: boolean; selected: boolean },
  ) => ReactNode;
  /**
   * Applied to the `<input>`, merged with its own classes, not to the wrapper.
   * Size the combobox by sizing its parent.
   */
  className?: string;
  /**
   * Prevents typing and opening the list.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Text input with a filterable list of options (the WAI-ARIA combobox
 * pattern). Single-select: picking an option fills the input with its label.
 *
 * Focus stays on the input. ArrowDown and ArrowUp open the list and move the
 * highlight (wrapping at the ends), Enter selects the highlighted option,
 * Escape closes the list and a second Escape clears the text (the selection
 * is kept). The list closes when the input loses focus.
 *
 * Other props go to the `<input>`, so `name`, `placeholder`, `autoFocus`, and
 * `aria-describedby` work as usual. Your `onKeyDown` runs first; call
 * `event.preventDefault()` in it to skip the built-in handling for that key.
 *
 * `value` and `inputValue` each work controlled or uncontrolled. Leave a prop
 * out (rather than passing `undefined` later) to stay uncontrolled.
 *
 * @example
 * A static list, filtered as the user types:
 * ```tsx
 * <Combobox
 *   label="Fruit"
 *   items={['Apple', 'Banana', 'Cherry']}
 *   getLabel={(fruit) => fruit}
 *   getKey={(fruit) => fruit}
 *   onValueChange={(fruit) => console.log(fruit)}
 * />
 * ```
 *
 * @example
 * Async search: you own the text, fetch results, and skip local filtering:
 * ```tsx
 * const [query, setQuery] = useState('');
 * const { results, isFetching } = useArticleSearch(query);
 *
 * <Combobox
 *   label="Article"
 *   items={results}
 *   getLabel={(article) => article.title}
 *   getKey={(article) => article.id}
 *   inputValue={query}
 *   onInputValueChange={setQuery}
 *   filter={null}
 *   isLoading={isFetching}
 *   emptyMessage="No articles found"
 * />
 * ```
 *
 * @example
 * An "add" picker that clears after each pick (controlled `value`):
 * ```tsx
 * const [query, setQuery] = useState('');
 *
 * <Combobox
 *   label="Add article"
 *   items={articles}
 *   getLabel={(article) => article.title}
 *   getKey={(article) => article.id}
 *   value={null}
 *   onValueChange={(article) => {
 *     if (article) addToComparison(article);
 *     setQuery('');
 *   }}
 *   inputValue={query}
 *   onInputValueChange={setQuery}
 * />
 * ```
 */
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
  hideLabel = false,
  isLoading = false,
  emptyMessage,
  renderItem,
  disabled = false,
  id: userId,
  onKeyDown,
  onBlur,
  ...props
}: ComboboxProps<T>) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const comboboxId = userId ?? `${baseId}-combobox`;
  const listboxId = `${baseId}-listbox`;

  const [activeIndex, setActiveIndex] = useState(-1);
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

  const getOptionId = (item: T): string =>
    `${baseId}-option-${encodeURIComponent(getKey(item))}`;

  const close = (): void => {
    setExpanded(false);
    setActiveIndex(-1);
  };

  const handleSelectOption = (item: T): void => {
    // Text first, so a parent's onValueChange runs last and can override it
    // (for example, clearing the input after each pick).
    setQuery(getLabel(item));
    setSelectedOption(item);
    close();
  };

  const handleSetQuery = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
    // The list behind the highlight just changed, so start over.
    setActiveIndex(-1);
    if (e.target.value.length > 0 && !expanded) {
      setExpanded(true);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    onBlur?.(e);
    close();
  };

  const defaultFilter = (item: T, text: string): boolean => {
    return getLabel(item).toLowerCase().includes(text.toLowerCase());
  };

  const filteredItems =
    filter === null
      ? items
      : items.filter((item) => (filter ?? defaultFilter)(item, query));

  // undefined when the list is closed, loading, or nothing is highlighted.
  // Loading hides the options, so Enter mustn't select one of them.
  const activeItem =
    expanded && !isLoading ? filteredItems[activeIndex] : undefined;

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    const lastIndex = filteredItems.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        // Stop the caret jumping to the end of the text.
        e.preventDefault();
        if (lastIndex < 0) break;
        if (!expanded) {
          setExpanded(true);
          setActiveIndex(0);
          break;
        }
        // From -1 (nothing highlighted) this lands on 0.
        setActiveIndex((prev) =>
          getNextIndex(prev, 'next', filteredItems.length, { wrap: true }),
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (lastIndex < 0) break;
        if (!expanded) {
          setExpanded(true);
          setActiveIndex(lastIndex);
          break;
        }
        setActiveIndex((prev) =>
          getNextIndex(prev, 'previous', filteredItems.length, { wrap: true }),
        );
        break;
      case 'Enter':
        if (activeItem === undefined) break;
        e.preventDefault();
        handleSelectOption(activeItem);
        break;
      case 'Escape':
        if (expanded) {
          close();
        } else {
          setQuery('');
        }
        break;
    }
  };

  const hasOptions = filteredItems.length > 0;
  // An empty listbox is invalid ARIA, so with no matches the listbox isn't
  // rendered and the combobox reports itself as collapsed.
  // While loading, items may be stale results from the previous query, so the
  // loading rows replace both the listbox and the empty message.
  const showLoading = expanded && isLoading;
  const showListbox = expanded && !isLoading && hasOptions;
  const showEmptyMessage =
    expanded && !isLoading && !hasOptions && emptyMessage != null;

  // Read out by the live region below. Empty while closed so screen readers
  // only hear about results while the user is searching.
  const resultCount = filteredItems.length;
  const statusMessage = !expanded
    ? ''
    : isLoading
      ? 'Loading…'
      : resultCount === 0
        ? 'No results'
        : `${resultCount} ${resultCount === 1 ? 'result' : 'results'} available`;

  return (
    <div className="relative flex flex-col gap-2">
      <label
        id={labelId}
        htmlFor={comboboxId}
        className={cn(
          'text-sm font-medium text-tally-surface-fg',
          hideLabel && 'sr-only',
        )}
      >
        {label}
      </label>
      <Input
        {...props}
        id={comboboxId}
        disabled={disabled}
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={showListbox}
        aria-controls={showListbox ? listboxId : undefined}
        value={query}
        onChange={handleSetQuery}
        onKeyDown={handleOnKeyDown}
        onBlur={handleBlur}
        aria-activedescendant={
          activeItem !== undefined ? getOptionId(activeItem) : undefined
        }
      />
      {showListbox && (
        <ul
          role="listbox"
          id={listboxId}
          aria-labelledby={labelId}
          className={cn(panelClasses, 'max-h-60 overflow-auto p-1')}
        >
          {filteredItems.map((item, idx) => {
            const active = idx === activeIndex;
            const selected =
              selectedOption !== null &&
              getKey(item) === getKey(selectedOption);

            return (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard is handled on the input via aria-activedescendant
              <li
                role="option"
                id={getOptionId(item)}
                key={getKey(item)}
                aria-selected={selected}
                // Custom rows can hold extra text (counts, badges), so name the
                // option by its label to keep what screen readers announce short.
                aria-label={renderItem ? getLabel(item) : undefined}
                onClick={() => handleSelectOption(item)}
                onMouseDown={(e) => e.preventDefault()}
                // Keep the mouse and keyboard highlight on the same option.
                onMouseMove={() => setActiveIndex(idx)}
                // `|| undefined` drops the attribute instead of rendering
                // data-active="false", which the data-active: variant would match.
                data-active={active || undefined}
                className="cursor-pointer rounded-tally-control px-3 py-2 text-sm select-none data-active:bg-tally-secondary-hover aria-selected:font-semibold aria-selected:text-tally-primary"
              >
                {renderItem
                  ? renderItem(item, { active, selected })
                  : getLabel(item)}
              </li>
            );
          })}
        </ul>
      )}
      {showLoading && (
        <div className={cn(panelClasses, 'flex flex-col p-1')}>
          {['w-3/4', 'w-1/2', 'w-2/3'].map((width) => (
            <div key={width} className="px-3 py-2.5">
              <Skeleton className={cn('h-4', width)} />
            </div>
          ))}
        </div>
      )}
      {showEmptyMessage && (
        <div
          className={cn(panelClasses, 'px-4 py-3 text-sm text-tally-muted-fg')}
        >
          {emptyMessage}
        </div>
      )}
      {/* Always rendered: screen readers only announce changes to a live
          region that already exists, not one that appears with its text. */}
      <span role="status" className="sr-only">
        {statusMessage}
      </span>
    </div>
  );
}
