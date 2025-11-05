import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  PaginationState
} from "@tanstack/react-table";
import {
  applyNotificationStatusFilter,
  switchNotification
} from "../../utilities/NotificationsUtilities";
import { emailColumns, inAppColumns } from "./columns";
import { Button, Col, Container, Row } from "nhsuk-react-components";
import {
  markNotificationAsRead,
  NotificationMsgType,
  NotificationType,
  NotificationStatusFilterType,
  resetNotificationsStatus
} from "../../redux/slices/notificationsSlice";
import history from "../navigation/history";
import store from "../../redux/store/store";
import { useAppSelector } from "../../redux/hooks/hooks";
import { NotificationsTableViewContent } from "./NotificationsTableViewContent";

type NotificationsTableViewProps = Readonly<{
  notificationsData: NotificationType[];
  viewingType: NotificationMsgType | null;
  notificationsStatus: string;
}>;

export const NotificationsTableView: React.FC<NotificationsTableViewProps> = ({
  notificationsData,
  viewingType,
  notificationsStatus
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
      store.dispatch(resetNotificationsStatus());
    }
    history.push(`/notifications/${notification.id}`);
  };

  return (
    <Container>
      <Row>
        <Col width="one-quarter">
          <NotificationTypeButton
            type="EMAIL"
            label="Email"
            currentViewingType={viewingType}
            dataCy="emailBtn"
          />
          <NotificationTypeButton
            type="IN_APP"
            label="In App"
            currentViewingType={viewingType}
            dataCy="inAppBtn"
          />
        </Col>
      </Row>
      <Row>
        <Col width="one-half">
          {viewingType === "IN_APP" ? (
            <NotificationFilterCheckbox
              id="unreadCheck"
              label="Show UNREAD status only"
              filterValue="UNREAD"
            />
          ) : (
            <NotificationFilterCheckbox
              id="failedCheck"
              label="Show FAILED status only"
              filterValue="FAILED"
            />
          )}
        </Col>
      </Row>
      <br />
      <NotificationsTableViewContent
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        notificationsStatus={notificationsStatus}
        notificationsData={notificationsData}
        viewingType={viewingType}
        handleRowClick={handleRowClick}
      />
    </Container>
  );
};

type NotificationTypeButtonProps = Readonly<{
  type: NotificationMsgType;
  label: string;
  currentViewingType: NotificationMsgType;
  dataCy: string;
}>;

function NotificationTypeButton({
  type,
  label,
  currentViewingType,
  dataCy
}: NotificationTypeButtonProps) {
  const isActive = currentViewingType !== type;

  return (
    <Button
      type="button"
      className={`notification-type-btn ${isActive ? "active-type-btn" : ""}`}
      data-cy={dataCy}
      onClick={() => switchNotification(type)}
      disabled={currentViewingType === type}
    >
      {label}
    </Button>
  );
}

type NotificationFilterCheckboxProps = Readonly<{
  id: string;
  label: string;
  filterValue: NotificationStatusFilterType;
}>;

function NotificationFilterCheckbox({
  id,
  label,
  filterValue
}: NotificationFilterCheckboxProps) {
  const notificationsStatusFilter = useAppSelector(
    state => state.notifications.notificationsStatusFilter
  );

  return (
    <div className="nhsuk-checkboxes nhsuk-checkboxes--small">
      <div className="nhsuk-checkboxes__item">
        <input
          className="nhsuk-checkboxes__input"
          type="checkbox"
          id={id}
          value={notificationsStatusFilter || ""}
          defaultChecked={false}
          checked={notificationsStatusFilter === filterValue}
          onChange={() =>
            applyNotificationStatusFilter(
              notificationsStatusFilter === "" ? filterValue : ""
            )
          }
        />
        <label
          htmlFor={id}
          className="nhsuk-label nhsuk-checkboxes__label"
          data-cy={`checkboxLabel-${label}`}
        >
          {label}
        </label>
      </div>
    </div>
  );
}
