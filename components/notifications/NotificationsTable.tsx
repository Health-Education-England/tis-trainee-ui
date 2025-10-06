import React, { useEffect, useMemo, useState } from "react";
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
import { switchNotification, updateNotificationStatus } from "../../utilities/NotificationsUtilities";
import { DebouncedInput } from "./DebouncedInput";
import { TablePagination } from "./TablePagination";
import { AllUnreadCheckbox } from "./AllUnreadCheckbox";
import { emailColumns, inAppColumns } from "./columns";
import { Button, Label } from "nhsuk-react-components";
import { getNotifications, NotificationType } from "../../redux/slices/notificationsSlice";
import { AllFailedCheckbox } from "./AllFailedCheckbox";
// import history from "../navigation/history";

export const NotificationsTable: React.FC<{type: 'EMAIL' | 'IN_APP'}> = ({ type }) => {
    const dispatch = useAppDispatch();
    const notificationsStatus = useAppSelector(
      state => state.notifications.status
    );      
    const viewingType = useAppSelector(
      state => state.notifications.viewingType
    );      
    switchNotification(type)
    
    useEffect(() => {
      console.log("reload: "+ notificationsStatus);
      if (notificationsStatus === "idle") {        
      console.log("in idle");
        dispatch(getNotifications({
          "page": "0",
          "size": "5",
          "type": type
        }));
      }
    }, [notificationsStatus, dispatch]);
    
  let notificationsData: NotificationType[];
  let columns = [];
  notificationsData = useAppSelector(
    state => state.notifications.notificationsList
  );
  if (viewingType === "IN_APP") {
    columns = inAppColumns;
  }
  else {    
    columns = emailColumns;
  }
  
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
      <Button
        type="button"
        className={`notification-type-btn ${(viewingType==="EMAIL")? "active-type-btn":""}`}
        data-cy="emailBtn"
        // onClick={history.push("/notifications/email")}
      >Email
      </Button>
      <Button
        type="button"
        className={`notification-type-btn ${(viewingType==="IN_APP")? "active-type-btn":""}`}
        data-cy="inAppBtn"
        // onClick={history.push("/notifications/in-app")}
      >In App
      </Button>
      <br/>
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
                        ((type==="IN_APP") ? <AllUnreadCheckbox header={header} /> : <AllFailedCheckbox header={header} />)                        
                        }
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
                    e.stopPropagation();
                    updateNotificationStatus(row.original, "READ");
                  }}
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
