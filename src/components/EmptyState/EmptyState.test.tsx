import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { EmptyState } from './EmptyState';

const parts = [
  ['EmptyState.Icon', EmptyState.Icon],
  ['EmptyState.Title', EmptyState.Title],
  ['EmptyState.Description', EmptyState.Description],
  ['EmptyState.Actions', EmptyState.Actions],
] as const;

describe('EmptyState', () => {
  it('renders all of its parts', () => {
    render(
      <EmptyState>
        <EmptyState.Icon>
          <svg data-testid="icon" />
        </EmptyState.Icon>
        <EmptyState.Title>No results</EmptyState.Title>
        <EmptyState.Description>Try again</EmptyState.Description>
        <EmptyState.Actions>
          <button>Clear</button>
        </EmptyState.Actions>
      </EmptyState>,
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('works with only a title', () => {
    render(
      <EmptyState>
        <EmptyState.Title>No data</EmptyState.Title>
      </EmptyState>,
    );

    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('hides the decorative icon from assistive tech', () => {
    render(
      <EmptyState>
        <EmptyState.Icon>
          <svg data-testid="icon" />
        </EmptyState.Icon>
      </EmptyState>,
    );

    expect(screen.getByTestId('icon').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('does not let a consumer un-hide the icon wrapper', () => {
    render(
      <EmptyState>
        <EmptyState.Icon aria-hidden={false}>
          <svg data-testid="icon" />
        </EmptyState.Icon>
      </EmptyState>,
    );

    expect(screen.getByTestId('icon').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('is not a live region unless a role is passed', () => {
    const { rerender } = render(
      <EmptyState>
        <EmptyState.Title>No results</EmptyState.Title>
      </EmptyState>,
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    rerender(
      <EmptyState role="status">
        <EmptyState.Title>No results</EmptyState.Title>
      </EmptyState>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });

  it('merges a consumer className onto the root and passes props through', () => {
    render(
      <EmptyState className="custom-class" data-testid="empty-state">
        <EmptyState.Title>No results</EmptyState.Title>
      </EmptyState>,
    );

    const root = screen.getByTestId('empty-state');
    expect(root).toHaveClass('custom-class');
    expect(root).toHaveClass('text-center');
  });

  it.each(parts)(
    '%s merges a consumer className and passes props through',
    (_name, Part) => {
      render(
        <EmptyState>
          <Part className="custom-class" id="part-id">
            Text
          </Part>
        </EmptyState>,
      );

      const part = screen.getByText('Text');
      expect(part).toHaveClass('custom-class');
      expect(part).toHaveAttribute('id', 'part-id');
    },
  );
});
