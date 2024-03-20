import {
  NotificationStatus,
  NotificationType,
  markNotificationAsRead,
  markNotificationAsUnread,
  resetNotificationsStatus,
  updatedNotificationsList
} from "../redux/slices/notificationsSlice";
import store from "../redux/store/store";
import history from "../components/navigation/history";

export async function updateNotificationStatus(
  row: NotificationType,
  newStatus: NotificationStatus
) {
  // FE updates
  const activeNotification: NotificationType = {
    ...row,
    status: newStatus
  };
  store.dispatch(updatedNotificationsList(activeNotification));

  // BE updates
  const action =
    newStatus === "READ" ? markNotificationAsRead : markNotificationAsUnread;
  await store.dispatch(action(row.id));

  if (store.getState().notifications.notificationUpdateStatus === "succeeded") {
    store.dispatch(resetNotificationsStatus());
    if (newStatus === "READ") {
      history.push(`/notifications/${row.id}`);
    }
  } else if (
    store.getState().notifications.notificationUpdateStatus === "failed"
  ) {
    const reversedNotification: NotificationType = {
      ...row,
      status: newStatus === "READ" ? "UNREAD" : "READ"
    };
    store.dispatch(updatedNotificationsList(reversedNotification));
  }
}
