import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders a badge variant', () => {
    render(<Badge variant="danger">Test</Badge>);

    expect(screen.getByText('Test')).toHaveClass('bg-danger');
  });

  it('exposes the resolved variant as a data attribute', () => {
    render(<Badge variant="success">Test</Badge>);

    expect(screen.getByText('Test')).toHaveAttribute(
      'data-variant',
      'success',
    );
  });

  it('reports the default variant when none is passed', () => {
    render(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveAttribute('data-variant', 'primary');
    expect(badge).toHaveClass('bg-primary');
  });

  it('merges a consumer className and passes other props through', () => {
    render(
      <Badge className="custom-class" id="my-badge">
        Test
      </Badge>,
    );

    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveAttribute('id', 'my-badge');
  });
});
