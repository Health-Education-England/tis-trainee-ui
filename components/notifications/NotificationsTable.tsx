import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  ColumnFiltersState,
  Column,
  Header,
  PaginationState,
  Table
} from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faEnvelope,
  faEnvelopeOpen,
  faSort,
  faSortDown,
  faSortUp
} from "@fortawesome/free-solid-svg-icons";
import { DateUtilities } from "../../utilities/DateUtilities";
import { Tooltip } from "react-tooltip";
import {
  NotificationType,
  NotificationStatus,
  updatedActiveNotification
} from "../../redux/slices/notificationsSlice";
import history from "../navigation/history";
import store from "../../redux/store/store";
import { useAppSelector } from "../../redux/hooks/hooks";
import { StringUtilities } from "../../utilities/StringUtilities";
import { Col, Container, Row } from "nhsuk-react-components";

type NotificationsTableProps = {
  data: NotificationType[];
};

const columnHelper = createColumnHelper<NotificationType>();

const columns = [
  columnHelper.accessor("status", {
    id: "status",
    header: "",
    cell: props => {
      const statusClass =
        props.row.original.status === "read" ? "status-read" : "status-unread";
      return (
        <span className={`table-status ${statusClass} nhsuk-margin-left-1`}>
          {props.row.original.status === "read" ? (
            <FontAwesomeIcon icon={faEnvelopeOpen} size="xl" />
          ) : (
            <FontAwesomeIcon icon={faEnvelope} size="xl" />
          )}
        </span>
      );
    }
  }),
  columnHelper.accessor("title", {
    id: "title",
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
    cell: props => (
      <span>
        {StringUtilities.truncateString(props.renderValue() as string, 40)}
      </span>
    ),
    enableColumnFilter: false
  }),

  columnHelper.accessor("category", {
    id: "category",
    header: ({ column }) => <TableColumnHeader column={column} title="Type" />,
    cell: props => <span>{props.renderValue()}</span>,
    enableColumnFilter: false
  }),

  columnHelper.accessor("sendDate", {
    id: "sendDate",
    header: ({ column }) => <TableColumnHeader column={column} title="Date" />,
    cell: info => DateUtilities.ToLocalDate(info.renderValue()),
    sortingFn: "datetime",
    sortDescFirst: false,
    enableColumnFilter: false
  }),
  columnHelper.display({
    id: "moreActions",
    cell: props => <MoreActions status={props.row.original.status} />
  })
];

export const NotificationsTable: React.FC<NotificationsTableProps> = () => {
  const notificationsData = useAppSelector(state => state.notifications.data);
  const memoData = useMemo(() => notificationsData, []); // TODO - add notifDataStatus to dependency array to update data when e.g. mark as unread

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "sendDate", desc: true }
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const table = useReactTable({
    data: memoData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      sorting,
      globalFilter,
      pagination
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination
  });
  return (
    <>
      <DebouncedInput
        value={globalFilter}
        onChange={value => setGlobalFilter(String(value))}
        placeholder="Search notifications..."
        className="nhsuk-input nhsuk-input--width-20 table-search-input"
      />
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.columnDef.id === "status" && (
                        <AllUnreadCheckbox header={header} />
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            const statusClass =
              row.original.status === "read"
                ? "table-row row-read"
                : "table-row row-unread";
            return (
              <tr
                onClick={() => handleRowClick(row.original)}
                key={row.id}
                className={`${statusClass}`}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="table-data">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <TablePagination table={table} />
      <hr />
    </>
  );
};

function handleRowClick(row: NotificationType) {
  const activeNotification: NotificationType =
    row.status === "unread" ? { ...row, status: "read" } : row;
  // Optimistic update
  store.dispatch(updatedActiveNotification(activeNotification));
  // TODO - If current status is unread then need to trigger a thunk to update DB with new status for this notification.
  history.push(`/notifications/${row.id}`);
}

type TableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
};

function TableColumnHeader<TData, TValue>({
  column,
  title
}: Readonly<TableColumnHeaderProps<TData, TValue>>) {
  const renderSortIcon = () => {
    const sort = column.getIsSorted();
    if (!sort) return <FontAwesomeIcon icon={faSort} size="sm" />;
    return sort === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} size="sm" />
    ) : (
      <FontAwesomeIcon icon={faSortDown} size="sm" />
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
        <span className="table-header-btn-icon">{renderSortIcon()}</span>
      </button>
    </div>
  );
}

type MoreActionsProps = {
  status: NotificationStatus;
};

function MoreActions({ status }: Readonly<MoreActionsProps>) {
  if (status === "read") {
    return (
      <>
        <FontAwesomeIcon
          data-tooltip-id="mark-unread-desktop"
          className="table-actions-icon"
          icon={faEnvelope}
          size="sm"
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            console.log("mark as unread (desktop) clicked");
          }}
        />
        <Tooltip
          className="tooltip tooltip-row"
          id="mark-unread-desktop"
          place="top"
          content="Mark as unread"
        />
      </>
    );
  } else return null;
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  );
}

type AllUnreadCheckboxProps = {
  header: Header<NotificationType, unknown>;
};

function AllUnreadCheckbox({ header }: Readonly<AllUnreadCheckboxProps>) {
  return (
    <div>
      <label htmlFor="unreadCheck" style={{ fontSize: "0.75rem" }}>
        Unread only
      </label>
      <input
        type="checkbox"
        id="unreadCheck"
        value={(header.column.getFilterValue() as string) || "read"}
        defaultChecked={false}
        onChange={e =>
          header.column.setFilterValue(
            e.target.value === "read" ? "unread" : "read"
          )
        }
      ></input>
    </div>
  );
}

type TablePaginationType = {
  table: Table<NotificationType>;
};

function TablePagination({ table }: Readonly<TablePaginationType>) {
  return (
    <Container>
      <Row>
        <Col width="two-thirds">
          <button
            type="button"
            className="nhsuk-u-margin-right-2 pagination-btn"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          <button
            type="button"
            className="nhsuk-u-margin-right-1 pagination-btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button
            type="button"
            className="nhsuk-u-margin-right-2 pagination-btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button
            type="button"
            className="nhsuk-u-margin-right-2 pagination-btn"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
          <select
            className="nhsuk-select nhsuk-u-margin-left-1"
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {`Show ${pageSize} rows`}
              </option>
            ))}
          </select>
        </Col>
        <Col width="one-third">
          {table.getPageCount() >= 2 && (
            <span className="nhsuk-u-font-size-19">
              {`Go to page: `}
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const target = e.target as HTMLInputElement;
                  const page = target.value ? Number(target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                onInput={e => {
                  const target = e.target as HTMLInputElement;
                  const enteredPage = Number(target.value);
                  if (enteredPage > table.getPageCount()) {
                    target.value = table.getPageCount().toString();
                  }
                }}
                onFocus={e => {
                  e.target.value = "";
                }}
                className="nhsuk-input nhsuk-input--width-2"
              />
              {` of ${table.getPageCount()}`}
            </span>
          )}
        </Col>
      </Row>
    </Container>
  );
}
