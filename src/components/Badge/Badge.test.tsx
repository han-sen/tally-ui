import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders a badge variant', () => {
    render(<Badge variant="danger">Test</Badge>);

    expect(screen.getByText('Test')).toHaveClass('bg-tally-danger');
  });

  it('exposes the resolved variant as a data attribute', () => {
    render(<Badge variant="success">Test</Badge>);

    expect(screen.getByText('Test')).toHaveAttribute('data-variant', 'success');
  });

  it('reports the default variant when none is passed', () => {
    render(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveAttribute('data-variant', 'primary');
    expect(badge).toHaveClass('bg-tally-primary');
  });

  it('has no glow by default', () => {
    render(<Badge variant="success">Test</Badge>);

    expect(screen.getByText('Test')).not.toHaveClass('shadow-tally-glow');
  });

  it('adds a shadow tinted with the badge color when glow is on', () => {
    render(
      <>
        <Badge variant="success" glow>
          Success
        </Badge>
        <Badge variant="primary" glow>
          Primary
        </Badge>
      </>,
    );

    const success = screen.getByText('Success');
    expect(success).toHaveClass('shadow-tally-glow', 'shadow-current/35');

    // Primary text is white, so its glow takes the fill color instead.
    const primary = screen.getByText('Primary');
    expect(primary).toHaveClass('shadow-tally-glow', 'shadow-tally-primary/45');
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
