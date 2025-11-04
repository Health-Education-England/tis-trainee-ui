import {
  NotificationMsgType,
  NotificationStatusFilterType,
  NotificationType,
  markNotificationAsUnread,
  resetNotificationsStatus,
  switchNotificationType,
  updateNotificationStatusFilter,
  updatedNotificationsList
} from "../redux/slices/notificationsSlice";
import store from "../redux/store/store";
import { NotificationSubjectType } from "../models/Notifications";
import { TrackerActionType } from "../models/Tracker";

export function markAsUnreadFE(row: NotificationType) {
  const activeNotification: NotificationType = {
    ...row,
    status: "UNREAD"
  };
  store.dispatch(updatedNotificationsList(activeNotification));
}

export async function markAsUnreadBE(row: NotificationType) {
  await store.dispatch(markNotificationAsUnread(row.id));

  const updateStatus = store.getState().notifications.notificationUpdateStatus;
  if (updateStatus === "succeeded") {
    store.dispatch(resetNotificationsStatus());
  } else if (updateStatus === "failed") {
    const revertedNotification: NotificationType = {
      ...row,
      status: "READ"
    };
    store.dispatch(updatedNotificationsList(revertedNotification));
  }
}

export async function switchNotification(msgType: NotificationMsgType) {
  store.dispatch(resetNotificationsStatus());
  store.dispatch(updateNotificationStatusFilter(""));
  store.dispatch(switchNotificationType(msgType));
}

export async function applyNotificationStatusFilter(
  filter: NotificationStatusFilterType
) {
  store.dispatch(resetNotificationsStatus());
  store.dispatch(updateNotificationStatusFilter(filter));
}

// Note: we will need to refactor this later to make more generic when we need to account for placement/:placementId linkages etc.
export function createPmRelatedNotificationMap(
  notifications: NotificationType[],
  pmId: string
): Map<NotificationSubjectType, string> {
  return notifications.reduce((map, notification) => {
    if (notification.tisReference?.id === pmId) {
      map.set(notification.subject, notification.id);
    }
    return map;
  }, new Map<NotificationSubjectType, string>());
}

export function resolveInternalTrackerLink(
  linkText: string,
  pmId: string,
  tag: TrackerActionType,
  notificationMap: Map<NotificationSubjectType, string>
): string {
  const notificationId = notificationMap.get(tag as NotificationSubjectType); // fudged Type cast here for now
  if (linkText.includes(":notificationId")) {
    return linkText.replace(":notificationId", notificationId ?? "");
  }

  if (linkText.includes(":id")) {
    return linkText.replace(":id", pmId);
  }

  return linkText;
}
