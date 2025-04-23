import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { NotificationType } from "../../redux/slices/notificationsSlice";
import { updateNotificationStatus } from "../../utilities/NotificationsUtilities";
import { useAppSelector } from "../../redux/hooks/hooks";
import { Button } from "@aws-amplify/ui-react";

type RowActionsProps = {
  row: NotificationType;
};

export function RowActions({ row }: Readonly<RowActionsProps>) {
  const inProgressUpdate = useAppSelector(
    state => state.notifications.notificationUpdateInProgress
  );

  if (row.status === "READ") {
    return (
      <Button
        size="small"
        type="reset"
        onClick={async e => {
          e.stopPropagation();
          updateNotificationStatus(row, "UNREAD");
        }}
        disabled={inProgressUpdate}
        style={{ cursor: "pointer" }}
      >
        <FontAwesomeIcon icon={faEnvelope} size="sm" className="unread-icon" />
        <span>Mark as unread</span>
      </Button>
    );
  } else return null;
}
