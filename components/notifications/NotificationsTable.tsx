import React from "react";
import { useNotificationsTable } from "../../utilities/hooks/useNotificationsTable";
import { NotificationsTableView } from "./NotificationsTableView";

export const NotificationsTable: React.FC = () => {
  const { notificationsData, viewingType, notificationsStatus } =
    useNotificationsTable();

  return (
    <NotificationsTableView
      notificationsData={notificationsData}
      viewingType={viewingType}
      notificationsStatus={notificationsStatus}
    />
  );
};
