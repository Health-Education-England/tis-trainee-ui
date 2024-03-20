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
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { updateNotificationStatus } from "../../utilities/NotificationsUtilities";
import { DebouncedInput } from "./DebouncedInput";
import { TablePagination } from "./TablePagination";
import { AllUnreadCheckbox } from "./AllUnreadCheckbox";
import { columns } from "./columns";
import { updatedNotificationUpdateInProgress } from "../../redux/slices/notificationsSlice";
import { Label } from "nhsuk-react-components";

export const NotificationsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const inProgressUpdate = useAppSelector(
    state => state.notifications.notificationUpdateInProgress
  );
  const notificationsData = useAppSelector(
    state => state.notifications.notificationsList
  );
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

  return notificationsData.length > 0 ? (
    <>
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
                      >
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
                row.original.status === "READ"
                  ? "table-row row-read"
                  : "table-row row-unread";
              return (
                <tr
                  onClick={async e => {
                    if (inProgressUpdate) return;
                    dispatch(updatedNotificationUpdateInProgress(true));
                    e.stopPropagation();
                    await updateNotificationStatus(row.original, "READ");
                    dispatch(updatedNotificationUpdateInProgress(false));
                  }}
                  key={row.id}
                  className={`${statusClass}`}
                  data-cy={`notificationsTableRow-${row.id}`}
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
    <Label>{`You currently don't have any notifications to read.`}</Label>
  );
};
