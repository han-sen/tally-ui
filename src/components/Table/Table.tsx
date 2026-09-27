import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import { cn } from '../../lib/utils';

export type TableProps = TableHTMLAttributes<HTMLTableElement>;
export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Right-aligns the column and uses tabular numerals so digits line up.
   * Set it on both the `Table.Head` and the `Table.Cell`s of a numeric column.
   */
  numeric?: boolean;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Right-aligns the cell and uses tabular numerals so digits line up.
   * Set it on both the `Table.Head` and the `Table.Cell`s of a numeric column.
   */
  numeric?: boolean;
}

/**
 * Semantic table built from styled parts. Compose it with `Table.Caption`,
 * `Table.Header`, `Table.Body`, `Table.Row`, `Table.Head`, and `Table.Cell`.
 *
 * The table scrolls horizontally inside its own container when it is wider
 * than the space available. Props and `className` apply to the `<table>`.
 *
 * @example
 * ```tsx
 * <Table>
 *   <Table.Caption>Open recalls</Table.Caption>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head>Vehicle</Table.Head>
 *       <Table.Head numeric>Cost</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>2022 Honda Accord</Table.Cell>
 *       <Table.Cell numeric>$1,200</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 * ```
 */
export function Table({ className, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        {...props}
        className={cn('w-full caption-bottom text-sm', className)}
      />
    </div>
  );
}

/**
 * Title or summary for the table, announced by assistive tech when the
 * table is reached. Shown below the table.
 */
export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      {...props}
      className={cn('py-2 text-sm text-tally-muted-foreground', className)}
    />
  );
}

/**
 * Header section (`<thead>`) that holds the column headings.
 */
export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead {...props} className={cn('[&_tr]:border-b', className)} />
  );
}

/**
 * Body section (`<tbody>`) that holds the data rows.
 */
export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody {...props} className={cn('[&_tr:last-child]:border-0', className)} />
  );
}

/**
 * A row of heads or cells.
 */
export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      {...props}
      className={cn(
        'border-b border-tally-border transition-colors hover:bg-tally-muted',
        className,
      )}
    />
  );
}

/**
 * Column or row heading (`<th>`). Defaults to `scope="col"`, pass
 * `scope="row"` for a heading that labels a row.
 */
export function TableHead({ numeric, className, ...props }: TableHeadProps) {
  return (
    <th
      scope="col"
      {...props}
      className={cn(
        'h-10 px-2 text-left align-middle font-medium text-tally-muted-foreground',
        numeric && 'text-right tabular-nums',
        className,
      )}
    />
  );
}

/**
 * Data cell (`<td>`).
 */
export function TableCell({ numeric, className, ...props }: TableCellProps) {
  return (
    <td
      {...props}
      className={cn(
        'p-2 align-middle',
        numeric && 'text-right tabular-nums',
        className,
      )}
    />
  );
}

Table.Caption = TableCaption;
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
