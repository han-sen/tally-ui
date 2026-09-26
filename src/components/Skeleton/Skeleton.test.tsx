import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a span that is hidden from assistive tech', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);

    const skeleton = container.firstElementChild;
    expect(skeleton?.tagName).toBe('SPAN');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the base styles and animates only when motion is allowed', () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.firstElementChild;
    expect(skeleton).toHaveClass('block');
    expect(skeleton).toHaveClass('rounded-md');
    expect(skeleton).toHaveClass('motion-safe:animate-pulse');
  });

  it('merges a consumer className and passes other props through', () => {
    render(<Skeleton className="h-4 w-32" data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('h-4');
    expect(skeleton).toHaveClass('w-32');
    expect(skeleton).toHaveClass('rounded-md');
  });

  it('lets a consumer override the default display', () => {
    render(<Skeleton className="inline-block" data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('inline-block');
    expect(skeleton).not.toHaveClass('block');
  });

  it('does not let a consumer un-hide it from assistive tech', () => {
    const { container } = render(<Skeleton aria-hidden={false} />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('can be nested inside a paragraph without invalid DOM nesting', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <p>
        Median price: <Skeleton className="inline-block h-4 w-16" />
      </p>,
    );

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
