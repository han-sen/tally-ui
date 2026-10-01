import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Combobox, type ComboboxProps } from './Combobox';

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Peach'];

function renderCombobox(props: Partial<ComboboxProps<string>> = {}) {
  render(
    <Combobox
      label="Fruit"
      items={fruits}
      getLabel={(fruit) => fruit}
      getKey={(fruit) => fruit}
      {...props}
    />,
  );
  return { input: screen.getByRole('combobox', { name: 'Fruit' }) };
}

function optionNames() {
  return screen.getAllByRole('option').map((option) => option.textContent);
}

/** The option the input's aria-activedescendant points at, if any. */
function activeOption(input: HTMLElement) {
  const id = input.getAttribute('aria-activedescendant');
  return id ? document.getElementById(id) : null;
}

describe('Combobox', () => {
  describe('markup', () => {
    it('renders a combobox named by its label', () => {
      const { input } = renderCombobox();

      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps a hidden label as the accessible name', () => {
      const { input } = renderCombobox({ hideLabel: true });

      expect(screen.getByText('Fruit')).toHaveClass('sr-only');
      expect(input).toHaveAccessibleName('Fruit');
    });

    it('links the label to a consumer-provided id', () => {
      const { input } = renderCombobox({ id: 'favorite-fruit' });

      expect(input).toHaveAttribute('id', 'favorite-fruit');
    });

    it('passes native input props through', () => {
      const { input } = renderCombobox({
        placeholder: 'Search fruit',
        name: 'fruit',
      });

      expect(input).toHaveAttribute('placeholder', 'Search fruit');
      expect(input).toHaveAttribute('name', 'fruit');
    });

    it('points aria-controls at the listbox only while open', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();
      expect(input).not.toHaveAttribute('aria-controls');

      await user.type(input, 'a');

      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute(
        'aria-controls',
        screen.getByRole('listbox').id,
      );
    });

    it('gives options valid ids when keys contain spaces', async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          label="Article"
          items={['Toyota Camry', 'C++ (programming language)']}
          getLabel={(title) => title}
          getKey={(title) => title}
        />,
      );

      await user.type(screen.getByRole('combobox'), 'a');

      for (const option of screen.getAllByRole('option')) {
        expect(option.id).not.toMatch(/\s/);
      }
    });
  });

  describe('filtering', () => {
    it('is closed until the user types', () => {
      renderCombobox();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('filters labels case-insensitively by default', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.type(input, 'AN');

      expect(optionNames()).toEqual(['Banana', 'Mango']);
    });

    it('uses a custom filter when given', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox({
        filter: (fruit, query) => fruit.toLowerCase().startsWith(query),
      });

      await user.type(input, 'm');

      expect(optionNames()).toEqual(['Mango']);
    });

    it('shows emptyMessage instead of a listbox when nothing matches', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox({ emptyMessage: 'No fruit found' });

      await user.type(input, 'zzz');

      expect(screen.getByText('No fruit found')).toBeInTheDocument();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).not.toHaveAttribute('aria-controls');
    });

    it('shows nothing when nothing matches and there is no emptyMessage', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.type(input, 'zzz');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows items unchanged when filter is null', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox({ filter: null });

      await user.type(input, 'zzz');

      expect(optionNames()).toEqual(fruits);
    });
  });

  describe('selecting with the mouse', () => {
    it('fills the input, closes the list, and calls onValueChange', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { input } = renderCombobox({ onValueChange });

      await user.type(input, 'an');
      await user.click(screen.getByRole('option', { name: 'Banana' }));

      expect(input).toHaveValue('Banana');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onValueChange).toHaveBeenCalledWith('Banana');
    });

    it('keeps focus on the input when an option is clicked', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.type(input, 'an');
      await user.click(screen.getByRole('option', { name: 'Banana' }));

      expect(input).toHaveFocus();
    });

    it('marks the selected option with aria-selected', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox({ defaultValue: 'Mango' });

      await user.type(input, 'an');

      expect(screen.getByRole('option', { name: 'Mango' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });
  });

  describe('controlled', () => {
    it('keeps the selection the parent passes in', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { input } = renderCombobox({ value: null, onValueChange });

      await user.type(input, 'an');
      await user.click(screen.getByRole('option', { name: 'Banana' }));
      await user.clear(input);
      await user.type(input, 'an');

      expect(onValueChange).toHaveBeenCalledWith('Banana');
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('lets onValueChange clear the text, for an "add" picker', async () => {
      function AddPicker() {
        const [query, setQuery] = useState('');
        return (
          <Combobox
            label="Fruit"
            items={fruits}
            getLabel={(fruit) => fruit}
            getKey={(fruit) => fruit}
            value={null}
            onValueChange={() => setQuery('')}
            inputValue={query}
            onInputValueChange={setQuery}
          />
        );
      }
      const user = userEvent.setup();
      render(<AddPicker />);
      const input = screen.getByRole('combobox');

      await user.type(input, 'an');
      await user.click(screen.getByRole('option', { name: 'Banana' }));

      expect(input).toHaveValue('');
    });

    it('reports typing through onInputValueChange', async () => {
      const onInputValueChange = vi.fn();
      const user = userEvent.setup();
      const { input } = renderCombobox({ onInputValueChange });

      await user.type(input, 'b');

      expect(onInputValueChange).toHaveBeenCalledWith('b');
    });
  });

  describe('keyboard', () => {
    it('opens on ArrowDown and highlights the first option', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.click(input);
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(activeOption(input)).toHaveTextContent('Apple');
    });

    it('opens on ArrowUp and highlights the last option', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.click(input);
      await user.keyboard('{ArrowUp}');

      expect(activeOption(input)).toHaveTextContent('Peach');
    });

    it('moves the highlight with the arrow keys', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.click(input);
      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(activeOption(input)).toHaveTextContent('Banana');

      await user.keyboard('{ArrowUp}');
      expect(activeOption(input)).toHaveTextContent('Apple');
    });

    it('wraps from the last option to the first and back', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.click(input);
      await user.keyboard('{ArrowDown}{ArrowUp}');
      expect(activeOption(input)).toHaveTextContent('Peach');

      await user.keyboard('{ArrowDown}');
      expect(activeOption(input)).toHaveTextContent('Apple');
    });

    it('selects the highlighted option on Enter', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { input } = renderCombobox({ onValueChange });

      await user.type(input, 'an');
      await user.keyboard('{ArrowDown}{Enter}');

      expect(input).toHaveValue('Banana');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onValueChange).toHaveBeenCalledWith('Banana');
    });

    it('does not select anything on Enter with no highlight', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { input } = renderCombobox({ onValueChange });

      await user.type(input, 'an');
      await user.keyboard('{Enter}');

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('clears the highlight when the user keeps typing', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.type(input, 'a');
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveAttribute('aria-activedescendant');

      await user.type(input, 'n');

      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('closes on Escape, then clears the input on a second Escape', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.type(input, 'an');
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(input).toHaveValue('an');

      await user.keyboard('{Escape}');
      expect(input).toHaveValue('');
    });

    it('closes when focus leaves the input', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.type(input, 'an');
      await user.tab();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('status announcements', () => {
    it('stays silent until the list opens', () => {
      renderCombobox();

      expect(screen.getByRole('status')).toHaveTextContent('');
    });

    it('announces how many options match', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.type(input, 'an');
      expect(screen.getByRole('status')).toHaveTextContent(
        '2 results available',
      );

      await user.type(input, 'g');
      expect(screen.getByRole('status')).toHaveTextContent(
        '1 result available',
      );
    });

    it('announces when nothing matches', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.type(input, 'zzz');

      expect(screen.getByRole('status')).toHaveTextContent('No results');
    });

    it('announces loading instead of a count', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox({ isLoading: true });

      await user.type(input, 'an');

      expect(screen.getByRole('status')).toHaveTextContent('Loading…');
    });

    it('goes silent again when the list closes', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox();

      await user.type(input, 'an');
      await user.keyboard('{Escape}');

      expect(screen.getByRole('status')).toHaveTextContent('');
    });
  });

  describe('renderItem', () => {
    it('renders custom rows and passes active and selected state', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox({
        defaultValue: 'Mango',
        renderItem: (fruit, { active, selected }) =>
          `${fruit}${active ? ' (active)' : ''}${selected ? ' (selected)' : ''}`,
      });

      await user.type(input, 'an');
      await user.keyboard('{ArrowDown}');

      expect(optionNames()).toEqual(['Banana (active)', 'Mango (selected)']);
    });

    it('names custom rows by their label', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox({
        renderItem: (fruit) => `${fruit} · 12 in stock`,
      });

      await user.type(input, 'an');

      expect(
        screen.getByRole('option', { name: 'Banana' }),
      ).toBeInTheDocument();
    });
  });

  describe('loading', () => {
    it('shows loading rows instead of the listbox', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox({ isLoading: true });

      await user.type(input, 'an');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not select a hidden option on Enter while loading', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      const { input } = renderCombobox({ isLoading: true, onValueChange });

      await user.type(input, 'an');
      await user.keyboard('{ArrowDown}{Enter}');

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('does not show emptyMessage while loading', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox({
        isLoading: true,
        emptyMessage: 'No fruit found',
      });

      await user.type(input, 'zzz');

      expect(screen.queryByText('No fruit found')).not.toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('cannot be typed into or opened', async () => {
      const user = userEvent.setup();
      const { input } = renderCombobox({ disabled: true });

      await user.type(input, 'an');
      await user.keyboard('{ArrowDown}');

      expect(input).toBeDisabled();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });
});
