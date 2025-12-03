import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

type TableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
};

export function TableColumnHeader<TData, TValue>({
  column,
  title
}: Readonly<TableColumnHeaderProps<TData, TValue>>) {
  const renderSortIcon = () => {
    const sort = column.getIsSorted();
    if (!sort) return <ArrowUpDown size={16} />;
    return sort === "asc" ? (
      <ArrowUp size={16} className="table-sort-icon" />
    ) : (
      <ArrowDown size={16} className="table-sort-icon" />
    );
  };
  if (!column.getCanSort()) return <div className="no-wrap">{title}</div>;
  return (
    <div className="table-column-header">
      <span className="no-wrap">{title}</span>
      <button
        type="button"
        onClick={column.getToggleSortingHandler()}
        aria-label={
          column.getIsSorted() === "desc"
            ? `Sorted descending. Click to sort ascending.`
            : column.getIsSorted() === "asc"
            ? `Sorted ascending. Click to cancel sorting.`
            : `Not sorted. Click to sort ascending.`
        }
        className="table-sort-button"
      >
        <span>{renderSortIcon()}</span>
      </button>
    </div>
  );
}
