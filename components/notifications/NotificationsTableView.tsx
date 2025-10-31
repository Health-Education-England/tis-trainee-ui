import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
  PaginationState
} from "@tanstack/react-table";
import { switchNotification } from "../../utilities/NotificationsUtilities";
import { DebouncedInput } from "./DebouncedInput";
import { TablePagination } from "./TablePagination";
import { AllUnreadCheckbox } from "./AllUnreadCheckbox";
import { emailColumns, inAppColumns } from "./columns";
import { Button, Label } from "nhsuk-react-components";
import {
  markNotificationAsRead,
  NotificationMsgType,
  NotificationType
} from "../../redux/slices/notificationsSlice";
import { AllFailedCheckbox } from "./AllFailedCheckbox";
import history from "../navigation/history";
import store from "../../redux/store/store";

type NotificationsTableViewProps = {
  notificationsData: NotificationType[];
  viewingType: NotificationMsgType | null;
  notificationsStatusFilter: string | null;
};

export const NotificationsTableView: React.FC<NotificationsTableViewProps> = ({
  notificationsData,
  viewingType,
  notificationsStatusFilter
}) => {
  const columns = viewingType === "IN_APP" ? inAppColumns : emailColumns;
  const memoData = useMemo(() => notificationsData, [notificationsData]);

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "sentAt", desc: true }
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
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
    onPaginationChange: setPagination,
    autoResetPageIndex: false
  });

  const handleRowClick = (notification: NotificationType) => {
    if (notification.status === "UNREAD") {
      store.dispatch(markNotificationAsRead(notification.id));
    }
    history.push(`/notifications/${notification.id}`);
  };

  return notificationsData.length > 0 || notificationsStatusFilter ? (
    <>
      <Button
        type="button"
        className={`notification-type-btn ${
          viewingType === "EMAIL" ? "active-type-btn" : ""
        }`}
        data-cy="emailBtn"
        onClick={() => switchNotification("EMAIL")}
      >
        Email
      </Button>
      <Button
        type="button"
        className={`notification-type-btn ${
          viewingType === "IN_APP" ? "active-type-btn" : ""
        }`}
        data-cy="inAppBtn"
        onClick={() => switchNotification("IN_APP")}
      >
        In App
      </Button>
      <br />
      <DebouncedInput
        value={globalFilter}
        onChange={value => setGlobalFilter(String(value))}
        placeholder="Search notifications..."
        className="nhsuk-input nhsuk-input--width-20 table-search-input"
        data-cy="NotificationsSearchInput"
      />
      <div className="table-wrapper">
        <table data-cy="notificationsTable">
          <thead>
            {table.getHeaderGroups().map(headerGroup => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <th
                        key={header.id}
                        className="nhsuk-u-padding-left-3"
                        data-cy={`notificationsTable-${header.id}`}
                        style={{
                          width: header.getSize()
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.columnDef.id === "status" &&
                          (viewingType === "IN_APP" ? (
                            <AllUnreadCheckbox />
                          ) : (
                            <AllFailedCheckbox />
                          ))}
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
                row.original.status === "READ"
                  ? "table-row row-read"
                  : "table-row row-unread";
              return (
                <tr
                  onClick={() => handleRowClick(row.original)}
                  key={row.id}
                  className={`${statusClass}`}
                  data-cy={`notificationsTableRow-${row.id}`}
                  data-testid={`notificationsTableRow-${row.original.id}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="nhsuk-u-padding-left-3 table-data"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <TablePagination table={table} />
      <hr />
    </>
  ) : (
    <Label data-cy="notificationsTableNoNotifs">{`You currently don't have any notifications to read.`}</Label>
  );
};
