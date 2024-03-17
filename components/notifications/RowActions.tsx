import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { NotificationType } from "../../redux/slices/notificationsSlice";
import { updateNotificationStatus } from "../../utilities/NotificationsUtilities";

type RowActionsProps = {
  row: NotificationType;
};

export function RowActions({ row }: Readonly<RowActionsProps>) {
  if (row.status === "READ") {
    return (
      <button
        className="unread-btn"
        onClick={e => updateNotificationStatus(row, "UNREAD", e)}
      >
        <FontAwesomeIcon icon={faEnvelope} size="sm" className="unread-icon" />
        <span>Mark as unread</span>
      </button>
    );
  } else return null;
}
