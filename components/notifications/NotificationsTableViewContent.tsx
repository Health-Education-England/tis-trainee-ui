import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { flexRender, Table } from "@tanstack/react-table";
import { Label } from "nhsuk-react-components";
import Loading from "../common/Loading";
import ErrorPage from "../common/ErrorPage";
import {
  NotificationType,
  NotificationMsgType
} from "../../redux/slices/notificationsSlice";
import { DebouncedInput } from "./DebouncedInput";
import { TablePagination } from "./TablePagination";
import { StringUtilities } from "../../utilities/StringUtilities";

type NotificationsTableViewContentProps = {
  table: Table<NotificationType>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  notificationsStatus: string;
  notificationsData: NotificationType[];
  viewingType: NotificationMsgType | null;
  handleRowClick: (notification: NotificationType) => void;
};

export const NotificationsTableViewContent: React.FC<
  NotificationsTableViewContentProps
> = ({
  table,
  globalFilter,
  setGlobalFilter,
  notificationsStatus,
  notificationsData,
  handleRowClick,
  viewingType
}) => {
  const filterType = useAppSelector(
    state => state.notifications.notificationsStatusFilter
  );

  if (notificationsStatus === "loading") {
    return <Loading />;
  }

  if (notificationsStatus === "failed") {
    return <ErrorPage message="Failed to load your notifications." />;
  }

  if (notificationsData.length === 0) {
    return (
      <Label data-cy="notificationsTableNoNotifs">
        {`You have no ${
          filterType ? StringUtilities.capitalize(filterType) : ""
        } ${
          viewingType === "IN_APP" ? "In-app" : "Email"
        } notifications to read.`}
      </Label>
    );
  }

  return (
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
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="nhsuk-u-padding-left-3"
                    data-cy={`notificationsTable-${header.id}`}
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
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
                  className={statusClass}
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
  );
};
