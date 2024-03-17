import React, { MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  NotificationType,
  markNotificationAsUnread,
  resetNotificationsStatus,
  updatedNotificationsList
} from "../../redux/slices/notificationsSlice";
import store from "../../redux/store/store";

type RowActionsProps = {
  row: NotificationType;
};

export function RowActions({ row }: Readonly<RowActionsProps>) {
  if (row.status === "READ") {
    return (
      <button className="unread-btn" onClick={e => markAsUnread(e, row)}>
        <FontAwesomeIcon icon={faEnvelope} size="sm" className="unread-icon" />
        <span>Mark as unread</span>
      </button>
    );
  } else return null;
}

async function markAsUnread(event: MouseEvent, row: NotificationType) {
  event.stopPropagation();
  // FE updates
  const activeNotification: NotificationType = {
    ...row,
    status: "UNREAD"
  };
  store.dispatch(updatedNotificationsList(activeNotification));
  // BE - mark as unread, then fetch notifications
  await store.dispatch(markNotificationAsUnread(row.id));
  if (store.getState().notifications.notificationUpdateStatus === "succeeded") {
    store.dispatch(resetNotificationsStatus());
  }
  // TODO handle fail to reverse the FE updates
}
