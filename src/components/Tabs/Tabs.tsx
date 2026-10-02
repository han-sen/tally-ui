'use client';

import {
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

const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (arg0: string) => void;
} | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs must be used inside <Tabs>');
  return ctx;
}

/**
 * Compound component for rendering a list of tabs with selected tab state management.
 *
 * Expects a `defaultValue` prop that matches
 * corresponding `Tabs.Trigger` and `Tabs.Content` elements
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
}: {
  children: ReactNode;
  /**
   * Must match the `value` of the corresponding
   * `Tabs.Trigger` and `Tabs.Content`.
   * Not validated by TypeScript,
   * a typo here will silently result in no active tab.
   */
  defaultValue: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

/**
 * The container for a group of `Tabs.Trigger` elements,
 * must be used inside Tabs.
 */
export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <ul
      {...props}
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
    const { activeTab, setActiveTab } = useTabsContext();
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
  const { activeTab } = useTabsContext();
  const isActiveTab = value === activeTab;

  if (!isActiveTab) {
    return null;
  }

  return (
    <div className={className} {...props} role="tabpanel">
      {children}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
