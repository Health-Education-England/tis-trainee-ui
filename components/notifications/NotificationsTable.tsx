import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { getNotifications } from "../../redux/slices/notificationsSlice";
import { NotificationsTableView } from "./NotificationsTableView";

export const NotificationsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const notificationsStatus = useAppSelector(
    state => state.notifications.status
  );
  const viewingType = useAppSelector(state => state.notifications.viewingType);
  const notificationsStatusFilter = useAppSelector(
    state => state.notifications.notificationsStatusFilter
  );
  const notificationsData = useAppSelector(
    state => state.notifications.notificationsList
  );

  useEffect(() => {
    if (notificationsStatus === "idle") {
      dispatch(
        getNotifications({
          page: "0",
          size: "0",
          type: viewingType,
          status: notificationsStatusFilter
        })
      );
    }
  }, [notificationsStatus, dispatch, viewingType, notificationsStatusFilter]);

  return (
    <NotificationsTableView
      notificationsData={notificationsData}
      viewingType={viewingType}
      notificationsStatusFilter={notificationsStatusFilter}
    />
  );
};
