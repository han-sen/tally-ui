import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { RadioGroup, type RadioGroupProps } from './RadioGroup';

type Range = '7' | '30' | '90';

const options: RadioGroupProps<Range>['options'] = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

function renderGroup(props: Partial<RadioGroupProps<Range>> = {}) {
  return render(<RadioGroup label="Date range" options={options} {...props} />);
}

describe('RadioGroup', () => {
  it('is a radio group named by its label, with named radios', () => {
    renderGroup();

    expect(
      screen.getByRole('radiogroup', { name: 'Date range' }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('radio').map((radio) => radio.getAttribute('value')),
    ).toEqual(['7', '30', '90']);
    expect(screen.getByRole('radio', { name: '30 days' })).toBeInTheDocument();
  });

  it('shows the label unless hideLabel is set', () => {
    const { rerender } = renderGroup();
    expect(screen.getByText('Date range')).not.toHaveClass('sr-only');

    rerender(<RadioGroup label="Date range" options={options} hideLabel />);
    expect(screen.getByText('Date range')).toHaveClass('sr-only');
    expect(
      screen.getByRole('radiogroup', { name: 'Date range' }),
    ).toBeInTheDocument();
  });

  it('is vertical by default and horizontal on request', () => {
    const { rerender } = renderGroup();
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-orientation', 'vertical');
    expect(group).toHaveClass('flex-col');

    rerender(
      <RadioGroup
        label="Date range"
        options={options}
        orientation="horizontal"
      />,
    );
    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(group).toHaveClass('flex-row');
  });

  it('chooses the first option by default', () => {
    renderGroup();

    expect(screen.getByRole('radio', { name: '7 days' })).toBeChecked();
  });

  it('starts at defaultValue', () => {
    renderGroup({ defaultValue: '30' });

    expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
  });

  it('chooses an option when its label text is clicked', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderGroup({ onValueChange });

    await user.click(screen.getByText('90 days'));

    expect(screen.getByRole('radio', { name: '90 days' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('90');
  });

  it('moves the choice with arrow keys', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    renderGroup({ onValueChange });

    await user.click(screen.getByRole('radio', { name: '7 days' }));
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith('30');
  });

  it('names a radio by its label and describes it with its description', () => {
    render(
      <RadioGroup
        label="Sort articles by"
        options={[
          {
            value: 'total',
            label: 'Total views',
            description: 'All views in the range',
          },
          { value: 'change', label: 'Change' },
        ]}
      />,
    );

    const total = screen.getByRole('radio', { name: 'Total views' });
    expect(total).toHaveAccessibleDescription('All views in the range');
    expect(screen.getByRole('radio', { name: 'Change' })).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  it('follows a controlled value', async () => {
    function Controlled() {
      const [range, setRange] = useState<Range>('30');
      return (
        <>
          <RadioGroup
            label="Date range"
            options={options}
            value={range}
            onValueChange={setRange}
          />
          <output>{range}</output>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Controlled />);

    await user.click(screen.getByText('7 days'));

    expect(screen.getByRole('radio', { name: '7 days' })).toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('7');
  });

  it('ignores clicks when the parent keeps the value', async () => {
    const user = userEvent.setup();
    renderGroup({ value: '30' });

    await user.click(screen.getByText('7 days'));

    expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
  });

  it('can disable one option or the whole group', () => {
    const { rerender } = render(
      <RadioGroup
        label="Date range"
        options={[...options.slice(0, 2), { ...options[2]!, disabled: true }]}
      />,
    );
    expect(screen.getByRole('radio', { name: '90 days' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: '7 days' })).toBeEnabled();

    rerender(<RadioGroup label="Date range" options={options} disabled />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled();
    }
  });

  it('submits under the given name', () => {
    render(
      <form aria-label="Filters">
        <RadioGroup
          label="Date range"
          options={options}
          name="range"
          defaultValue="90"
        />
      </form>,
    );

    const form = screen.getByRole('form', { name: 'Filters' });
    expect(new FormData(form as HTMLFormElement).get('range')).toBe('90');
  });

  it('merges className onto the group', () => {
    renderGroup({ className: 'border' });

    expect(screen.getByRole('radiogroup')).toHaveClass('border', 'flex');
  });
});
