'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FocusEvent, MouseEvent, ReactNode } from 'react';
import { Ellipsis } from 'lucide-react';

import { Button } from '../Button/Button';

export interface CardActionsProps {
  /** Content of the popup: buttons, links, or anything else. */
  children: ReactNode;
  /** Accessible name for the ellipsis button. */
  label: string;
}

/**
 * Ellipsis button that opens a popup holding a card's actions. Rendered by
 * `Card.Header` when it gets `actions`; it lives in its own file so the rest
 * of `Card` can stay a Server Component.
 *
 * It is a disclosure, not an ARIA menu: the popup can hold any content, and
 * Tab moves through it normally. Escape, a click outside, or focus leaving it
 * closes the popup. Clicking a button or link inside also closes it.
 */
export function CardActions({ children, label }: CardActionsProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Tabbing out of the button and popup closes it. relatedTarget is where
  // focus is going; null means it left the page.
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, a')) {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative shrink-0" onBlur={handleBlur}>
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="sm"
        className="size-8 px-0"
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Ellipsis
          aria-hidden="true"
          className="size-6 text-tally-muted-heading"
        />
      </Button>
      {open && (
        // The click handler only closes the popup after a button or link
        // inside it has done its own work; keyboard users reach those directly.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          id={panelId}
          onClick={handlePanelClick}
          className="absolute top-full right-0 z-20 mt-1 flex w-max max-w-64 min-w-40 flex-col gap-0.5 rounded-tally-card bg-tally-surface p-1 text-sm text-tally-surface-fg shadow-tally-card"
        >
          {children}
        </div>
      )}
    </div>
  );
}
