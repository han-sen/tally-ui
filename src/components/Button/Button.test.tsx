import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is disabled and shows aria-busy when isLoading', () => {
    render(<Button isLoading>Saving…</Button>);
    const button = screen.getByRole('button', { name: 'Saving…' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('forwards a ref to the underlying button element', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Save</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('exposes the resolved variant as a data attribute', () => {
    render(<Button variant="danger">Remove</Button>);
    expect(screen.getByRole('button', { name: 'Remove' })).toHaveAttribute(
      'data-variant',
      'danger',
    );
  });

  it('reports the default variant when none is passed', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveClass('bg-tally-primary');
  });
});
