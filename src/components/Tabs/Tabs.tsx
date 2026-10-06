'use client';

import {
  useId,
  forwardRef,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEventHandler,
  KeyboardEventHandler,
} from 'react';
import { tabsTriggerVariants } from './Tabs.variants';
import { cn } from '../../lib/utils';

export interface TabsListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /**
   * String that corresponds to a matching
   * `value` for `Tabs.Trigger` and `Tabs.Content`
   */
  value: string;
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * String that corresponds to a matching
   * `value` for `Tabs.Trigger` and `Tabs.Content`
   */
  value: string;
}

/**
 * How keyboard focus and selection relate:
 * - `'automatic'`: arrow keys move focus and select the tab.
 * - `'manual'`: arrow keys move focus only; Enter or Space selects.
 * Use 'manual' for cases where the panel content deserves an extra opt-in step,
 * for example if it triggers a large content fetch.
 */
export type TabsActivationMode = 'automatic' | 'manual';

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (arg0: string) => void;
  baseId: string;
  activationMode: TabsActivationMode;
} | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs must be used inside <Tabs>');
  return ctx;
}

function getTabsId(
  baseId: string,
  stub: 'trigger' | 'panel',
  value: string,
): string {
  return `${baseId}-${stub}-${encodeURIComponent(value)}`;
}

export interface TabsProps {
  children: ReactNode;
  /**
   * Must match the `value` of the corresponding
   * `Tabs.Trigger` and `Tabs.Content`.
   * Not validated by TypeScript,
   * a typo here will silently result in no active tab.
   */
  defaultValue: string;
  /**
   * Whether arrow keys select tabs or only move focus.
   * See {@link TabsActivationMode}.
   * @default 'automatic'
   */
  activationMode?: TabsActivationMode;
}

/**
 * Compound component for rendering a list of tabs with selected tab state management.
 *
 * Expects a `defaultValue` prop that matches
 * corresponding `Tabs.Trigger` and `Tabs.Content` elements
 *
 * Keyboard: Tab moves to the active tab and then into its panel. ArrowLeft
 * and ArrowRight move between tabs (wrapping at the ends), Home and End jump
 * to the first and last tab, and disabled tabs are skipped. Whether moving
 * also selects the tab is set by `activationMode`.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="account">
 *   <Tabs.List>
 *     <Tabs.Trigger value="account">Account</Tabs.Trigger>
 *     <Tabs.Trigger value="contact">Contact</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="account">
 *     <p>Account page</p>
 *   </Tabs.Content>
 *   <Tabs.Content value="contact">
 *     <p>Contact page</p>
 *   </Tabs.Content>
 * </Tabs>
 * ```
 */

export function Tabs({
  children,
  defaultValue,
  activationMode = 'automatic',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const baseId = useId();

  return (
    <TabsContext.Provider
      value={{ activeTab, setActiveTab, baseId, activationMode }}
    >
      {children}
    </TabsContext.Provider>
  );
}

/**
 * The container for a group of `Tabs.Trigger` elements,
 * must be used inside Tabs.
 */
export function TabsList({
  children,
  className,
  onKeyDown,
  ...props
}: TabsListProps) {
  const { setActiveTab, activationMode } = useTabsContext();

  const handleKeyDown: KeyboardEventHandler<HTMLUListElement> = (event) => {
    // The consumer's handler runs first; calling preventDefault() in it skips
    // the arrow-key navigation, the same as Combobox.
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)',
      ),
    );

    const focusIndex = tabs.indexOf(event.target as HTMLButtonElement);
    if (focusIndex < 0) return;

    let nextIndex: number;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (focusIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        // Adding tabs.length keeps the left side positive, so 0 wraps to the
        // last tab instead of -1.
        nextIndex = (focusIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = tabs[nextIndex];
    if (!nextTab) return;
    event.preventDefault();
    nextTab.focus();

    const nextValue = nextTab.dataset.value;

    // TODO: in automatic mode, also select the newly focused tab (step 6)
    if (activationMode === 'automatic' && nextValue) {
      setActiveTab(nextValue);
    }
  };
  return (
    <ul
      {...props}
      onKeyDown={handleKeyDown}
      role="tablist"
      className={cn(
        'inline-flex w-fit flex-wrap items-center gap-1 rounded-tally-control bg-tally-muted p-1 text-center',
        className,
      )}
    >
      {children}
    </ul>
  );
}

/**
 * Renders a button wrapping child elements,
 * expects a `value` prop that matches a
 * corresponding `Tabs.Content` item
 */
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ children, value, className, ...props }, ref) => {
    const { activeTab, setActiveTab, baseId } = useTabsContext();
    const isActiveTab = value === activeTab;

    const { onClick = () => {} } = props;
    const handleOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      setActiveTab(value);
      onClick(event);
    };
    return (
      <li role="presentation">
        <button
          {...props}
          data-value={value}
          tabIndex={isActiveTab ? 0 : -1}
          id={getTabsId(baseId, 'trigger', value)}
          aria-controls={
            isActiveTab ? getTabsId(baseId, 'panel', value) : undefined
          }
          role="tab"
          aria-selected={isActiveTab}
          ref={ref}
          onClick={handleOnClick}
          className={cn(
            tabsTriggerVariants({ active: isActiveTab }),
            className,
          )}
        >
          {children}
        </button>
      </li>
    );
  },
);

/**
 * Container for a tab's content,
 * expects a `value` prop that matches a
 * corresponding `Tabs.Trigger` item
 */
export function TabsContent({
  children,
  value,
  className,
  ...props
}: TabsContentProps) {
  const { activeTab, baseId } = useTabsContext();
  const isActiveTab = value === activeTab;

  if (!isActiveTab) {
    return null;
  }

  return (
    <div
      // insert tabindex before prop spread so consumer
      // can override this if panel has interactive content
      tabIndex={0}
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-tally-ring',
        className,
      )}
      {...props}
      role="tabpanel"
      id={getTabsId(baseId, 'panel', value)}
      aria-labelledby={getTabsId(baseId, 'trigger', value)}
    >
      {children}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
