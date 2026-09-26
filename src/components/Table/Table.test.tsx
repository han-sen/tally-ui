import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Table } from './Table';

function renderTable() {
  return render(
    <Table>
      <Table.Caption>Open recalls</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Vehicle</Table.Head>
          <Table.Head numeric>Cost</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Accord</Table.Cell>
          <Table.Cell numeric>$1,200</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Civic</Table.Cell>
          <Table.Cell numeric>$800</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>,
  );
}

describe('Table', () => {
  it('exposes a table named by its caption', () => {
    renderTable();
    expect(
      screen.getByRole('table', { name: 'Open recalls' }),
    ).toBeInTheDocument();
  });

  it('renders the expected rows, column headers, and cells', () => {
    renderTable();

    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getAllByRole('cell')).toHaveLength(4);
    expect(screen.getByRole('cell', { name: 'Accord' })).toBeInTheDocument();
  });

  it('defaults heads to scope="col"', () => {
    renderTable();
    expect(
      screen.getByRole('columnheader', { name: 'Vehicle' }),
    ).toHaveAttribute('scope', 'col');
  });

  it('lets a head label a row with scope="row"', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Head scope="row">Accord</Table.Head>
            <Table.Cell>$1,200</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(screen.getByRole('rowheader', { name: 'Accord' })).toHaveAttribute(
      'scope',
      'row',
    );
  });

  it('right-aligns numeric heads and cells with tabular numerals', () => {
    renderTable();

    for (const element of [
      screen.getByRole('columnheader', { name: 'Cost' }),
      screen.getByRole('cell', { name: '$1,200' }),
    ]) {
      expect(element).toHaveClass('text-right');
      expect(element).toHaveClass('tabular-nums');
    }
  });

  it('does not right-align heads and cells that are not numeric', () => {
    renderTable();

    expect(
      screen.getByRole('columnheader', { name: 'Vehicle' }),
    ).not.toHaveClass('text-right');
    expect(screen.getByRole('cell', { name: 'Accord' })).not.toHaveClass(
      'tabular-nums',
    );
  });

  it('wraps the table in a horizontally scrolling container', () => {
    renderTable();
    expect(screen.getByRole('table').parentElement).toHaveClass(
      'overflow-x-auto',
    );
  });

  it('applies className and other props to the table, not the wrapper', () => {
    render(
      <Table className="custom-class" id="my-table">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Accord</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    const table = screen.getByRole('table');
    expect(table).toHaveClass('custom-class');
    expect(table).toHaveClass('w-full');
    expect(table).toHaveAttribute('id', 'my-table');
    expect(table.parentElement).not.toHaveClass('custom-class');
  });

  it('merges a consumer className and passes props through on every part', () => {
    const { container } = render(
      <Table>
        <Table.Caption className="caption-class">Caption</Table.Caption>
        <Table.Header className="header-class">
          <Table.Row className="row-class" id="row-id">
            <Table.Head className="head-class" id="head-id">
              Head
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body className="body-class">
          <Table.Row>
            <Table.Cell className="cell-class" id="cell-id">
              Cell
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(screen.getByText('Caption')).toHaveClass('caption-class');
    expect(container.querySelector('thead')).toHaveClass('header-class');
    expect(container.querySelector('tbody')).toHaveClass('body-class');

    const headRow = screen.getAllByRole('row')[0];
    expect(headRow).toHaveClass('row-class');
    expect(headRow).toHaveAttribute('id', 'row-id');

    const head = screen.getByRole('columnheader', { name: 'Head' });
    expect(head).toHaveClass('head-class');
    expect(head).toHaveAttribute('id', 'head-id');

    const cell = screen.getByRole('cell', { name: 'Cell' });
    expect(cell).toHaveClass('cell-class');
    expect(cell).toHaveAttribute('id', 'cell-id');
  });
});
