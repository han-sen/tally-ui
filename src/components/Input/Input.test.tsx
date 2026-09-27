import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('renders a text field named by its label', () => {
    render(
      <>
        <label htmlFor="article">Article</label>
        <Input id="article" />
      </>,
    );

    const input = screen.getByRole('textbox', { name: 'Article' });
    expect(input).toHaveAttribute('type', 'text');
  });

  it('lets a consumer change the type', () => {
    render(<Input type="search" aria-label="Search" />);
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('calls onChange as the user types', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input aria-label="Article" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'abc');

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByRole('textbox')).toHaveValue('abc');
  });

  it('works uncontrolled with a default value', () => {
    render(<Input aria-label="Article" defaultValue="Honda Accord" />);
    expect(screen.getByRole('textbox')).toHaveValue('Honda Accord');
  });

  it('passes the placeholder through', () => {
    render(<Input aria-label="Article" placeholder="Toyota Camry" />);
    expect(screen.getByPlaceholderText('Toyota Camry')).toBeInTheDocument();
  });

  it('is disabled and ignores typing when disabled', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Article" disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();

    await user.type(input, 'abc');
    expect(input).toHaveValue('');
  });

  it('is marked invalid through aria-invalid', () => {
    render(<Input aria-label="Article" aria-invalid="true" />);
    expect(screen.getByRole('textbox')).toBeInvalid();
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Article" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('merges a consumer className so it can override defaults', () => {
    render(<Input aria-label="Article" className="w-64 custom-class" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
    expect(input).toHaveClass('w-64');
    expect(input).not.toHaveClass('w-full');
  });
});
