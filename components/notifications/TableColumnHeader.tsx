import { Column } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp
} from "@fortawesome/free-solid-svg-icons";

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
    if (!sort) return <FontAwesomeIcon icon={faSort} size="sm" />;
    return sort === "asc" ? (
      <FontAwesomeIcon
        icon={faSortUp}
        size="sm"
        data-cy={`${title}-fa-sort-up`}
      />
    ) : (
      <FontAwesomeIcon
        icon={faSortDown}
        size="sm"
        data-cy={`${title}-fa-sort-down`}
      />
    );
  };
  if (!column.getCanSort()) return <div>{title}</div>;
  return (
    <div>
      <button
        type="button"
        onClick={column.getToggleSortingHandler()}
        className="table-header-btn"
      >
        <span>{title}</span>
        <span className="nhsuk-u-padding-left-2 table-header-btn-icon">
          {renderSortIcon()}
        </span>
      </button>
    </div>
  );
}
