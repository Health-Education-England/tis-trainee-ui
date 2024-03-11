import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  ColumnFiltersState,
  Column,
  Header
} from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEnvelope,
  faEnvelopeOpen,
  faSort,
  faSortDown,
  faSortUp
} from "@fortawesome/free-solid-svg-icons";
import { DateUtilities } from "../../utilities/DateUtilities";
import { useIsMobile } from "../../utilities/hooks/useIsMobile";
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

type NotificationsTableProps = {
  data: NotificationType[];
};

export const NotificationsTable: React.FC<NotificationsTableProps> = () => {
  const notificationsData = useAppSelector(state => state.notifications.data);
  const memoData = useMemo(() => notificationsData, []); // TODO - add notifDataStatus to dependency array to update data when e.g. mark as unread
  const isMobile = useIsMobile();
  const columnHelper = createColumnHelper<NotificationType>();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "sendDate", desc: true }
  ]);

  const columns = [
    columnHelper.accessor("status", {
      id: "status",
      header: "",
      cell: props => {
        const statusClass =
          props.row.original.status === "read"
            ? "status-read"
            : "status-unread";
        const deviceClass = isMobile ? "" : "table-status-desktop";
        return (
          <span className={`table-status ${statusClass} ${deviceClass}`}>
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
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Title" />
      ),
      cell: props => (
        <span>
          {StringUtilities.truncateString(props.renderValue() as string, 40)}
        </span>
      ),
      enableColumnFilter: false
    }),

    columnHelper.accessor("category", {
      id: "category",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Type" />
      ),
      cell: props => <span>{props.renderValue()}</span>,
      enableColumnFilter: false
    }),

    columnHelper.accessor("sendDate", {
      id: "sendDate",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Date" />
      ),
      cell: info => DateUtilities.ToLocalDate(info.renderValue()),
      sortingFn: "datetime",
      sortDescFirst: false,
      enableColumnFilter: false
    }),
    columnHelper.display({
      id: "moreActions",
      cell: props => (
        <MoreActions status={props.row.original.status} isMobile={isMobile} />
      )
    })
  ];

  const table = useReactTable({
    data: memoData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
      globalFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter
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
  isMobile: boolean;
};

function MoreActions({ status, isMobile }: Readonly<MoreActionsProps>) {
  return (
    <span>
      {status === "read" && isMobile && (
        <FontAwesomeIcon
          data-tooltip-id="mark-unread-mobile"
          className="table-actions-icon"
          icon={faEllipsisV}
          size="lg"
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            console.log("mark as unread (mobile) clicked");
          }}
        />
      )}
      {status === "read" && !isMobile && (
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
      )}
    </span>
  );
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
