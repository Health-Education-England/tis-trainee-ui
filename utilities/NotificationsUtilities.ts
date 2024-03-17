import {
  NotificationType,
  markNotificationAsRead,
  resetNotificationsStatus,
  updatedNotificationsList
} from "../redux/slices/notificationsSlice";
import store from "../redux/store/store";
import history from "../components/navigation/history";

export async function handleTableRowClick(row: NotificationType) {
  // mark as read
  // FE updates
  if (row.status === "UNREAD") {
    const activeNotification: NotificationType = {
      ...row,
      status: "READ"
    };
    store.dispatch(updatedNotificationsList(activeNotification));
  }

  // BE updates
  await store.dispatch(markNotificationAsRead(row.id));
  if (store.getState().notifications.notificationUpdateStatus === "succeeded") {
    // trigger a re-fetch of notifications
    store.dispatch(resetNotificationsStatus());
    history.push(`/notifications/${row.id}`);
  }
  // TODO handle fail to reverse the FE updates
}
