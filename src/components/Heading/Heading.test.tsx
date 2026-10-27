import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Heading } from './Heading';

describe('Heading', () => {
  it('renders the element for its level', () => {
    render(<Heading level={3}>Carrier performance</Heading>);

    const heading = screen.getByRole('heading', {
      level: 3,
      name: 'Carrier performance',
    });
    expect(heading.tagName).toBe('H3');
  });

  it('sizes each level by default', () => {
    render(
      <>
        <Heading level={1}>One</Heading>
        <Heading level={2}>Two</Heading>
        <Heading level={6}>Six</Heading>
      </>,
    );

    expect(screen.getByText('One')).toHaveClass('text-2xl');
    expect(screen.getByText('Two')).toHaveClass('text-xl');
    expect(screen.getByText('Six')).toHaveClass('text-xs', 'uppercase');
  });

  it('lets size override the level default without changing the element', () => {
    render(
      <Heading level={2} size="sm">
        Carrier performance
      </Heading>,
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('text-sm');
    expect(heading).not.toHaveClass('text-xl');
  });

  it('uses the default color and reports its variant', () => {
    render(<Heading level={2}>Title</Heading>);

    const heading = screen.getByText('Title');
    expect(heading).toHaveClass('text-tally-surface-fg');
    expect(heading).toHaveAttribute('data-variant', 'default');
  });

  it('uses the card heading color when muted', () => {
    render(
      <Heading level={2} variant="muted">
        Title
      </Heading>,
    );

    expect(screen.getByText('Title')).toHaveClass('text-tally-muted-heading');
  });

  it('merges className and passes native props', () => {
    render(
      <Heading level={2} id="section-title" className="mb-2">
        Title
      </Heading>,
    );

    const heading = screen.getByText('Title');
    expect(heading).toHaveAttribute('id', 'section-title');
    expect(heading).toHaveClass('mb-2', 'font-semibold');
  });

  it('forwards ref to the heading element so it can take focus', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Heading level={2} ref={ref} tabIndex={-1}>
        Title
      </Heading>,
    );

    expect(ref.current).toBe(screen.getByRole('heading', { level: 2 }));

    ref.current?.focus();
    expect(ref.current).toHaveFocus();
  });
});
