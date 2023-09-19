import clsx from 'clsx';
import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

interface TableRow {
  title: string;
  content: ReactNode;
}

interface TableProps {
  rows: TableRow[];
}

interface CellProps {
  background?: HTMLAttributes<HTMLDivElement>['className'];
}
const Row: React.FC<PropsWithChildren<{ row: TableRow }>> = ({ row }) => {
  return (
    <div className="flex border-b border-solid border-slate-100 last:border-0">
      <Cell className="w-1/3 bg-slate-700">{row.title}</Cell>
      <Cell className=" w-2/3 bg-slate-800 text-white">{row.content}</Cell>
    </div>
  );
};

const Cell: React.FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex grow justify-between break-words px-3 py-2 text-sm font-semibold',
        className
      )}
    >
      {children}
    </div>
  );
};

const Table: React.FC<PropsWithChildren<TableProps>> = ({ rows }) => {
  return (
    <div className="w-full overflow-hidden rounded border border-solid border-slate-100">
      {rows.map((row, index) => (
        <Row key={index} row={row} />
      ))}
    </div>
  );
};

export default Table;
