import {
  NotificationStatus,
  NotificationType,
  markNotificationAsRead,
  markNotificationAsUnread,
  resetNotificationsStatus,
  updatedNotificationUpdateInProgress,
  updatedNotificationsList
} from "../redux/slices/notificationsSlice";
import store from "../redux/store/store";
import history from "../components/navigation/history";

export function updateNotificationStatusFE(
  row: NotificationType,
  newStatus: NotificationStatus
) {
  const activeNotification: NotificationType = {
    ...row,
    status: newStatus
  };
  store.dispatch(updatedNotificationsList(activeNotification));
}

export async function updateNotificationStatusBE(
  row: NotificationType,
  newStatus: NotificationStatus
) {
  const action =
    newStatus === "READ" ? markNotificationAsRead : markNotificationAsUnread;
  await store.dispatch(action(row.id));

  // success, navigate to notification msg
  if (store.getState().notifications.notificationUpdateStatus === "succeeded") {
    // trigger fetch to update notifications list/ icon badge
    store.dispatch(resetNotificationsStatus());
    // navigate to notification msg if row click (i.e. new status is READ)
    if (newStatus === "READ") {
      history.push(`/notifications/${row.id}`);
    }
    // failed to update, revert previous FE change
  } else if (
    store.getState().notifications.notificationUpdateStatus === "failed"
  ) {
    const newStatus = row.status === "READ" ? "UNREAD" : "READ";
    updateNotificationStatusFE(row, newStatus);
  }
}

export async function updateNotificationStatus(
  row: NotificationType,
  newStatus: NotificationStatus
) {
  const inProgressUpdate =
    store.getState().notifications.notificationUpdateInProgress;
  if (inProgressUpdate) return;
  store.dispatch(updatedNotificationUpdateInProgress(true));
  // update FE first to see immediate change
  updateNotificationStatusFE(row, newStatus);
  // then make BE call
  await updateNotificationStatusBE(row, newStatus);
  store.dispatch(updatedNotificationUpdateInProgress(false));
}
