import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  NotificationType,
  updatedNotificationUpdateInProgress
} from "../../redux/slices/notificationsSlice";
import { updateNotificationStatus } from "../../utilities/NotificationsUtilities";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";

type RowActionsProps = {
  row: NotificationType;
};

export function RowActions({ row }: Readonly<RowActionsProps>) {
  const dispatch = useAppDispatch();
  const inProgressUpdate = useAppSelector(
    state => state.notifications.notificationUpdateInProgress
  );

  if (row.status === "READ") {
    return (
      <button
        type="button"
        className="unread-btn"
        onClick={async e => {
          dispatch(updatedNotificationUpdateInProgress(true));
          e.stopPropagation();
          await updateNotificationStatus(row, "UNREAD");
          dispatch(updatedNotificationUpdateInProgress(false));
        }}
        disabled={inProgressUpdate}
      >
        <FontAwesomeIcon icon={faEnvelope} size="sm" className="unread-icon" />
        <span>Mark as unread</span>
      </button>
    );
  } else return null;
}
