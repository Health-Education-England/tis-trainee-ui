import { Button } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import history from "../navigation/history";
type NotificationsBtnType = {
  unreadNotificationCount: number;
};
export const NotificationsBtn = ({
  unreadNotificationCount
}: NotificationsBtnType) => {
  const handleBtnClick = () => {
    history.push("/notifications");
  };
  return (
    <Button
      type="button"
      className="notification-btn"
      data-cy="signOutBtn"
      data-tooltip-id="NotificationsCount"
      onClick={handleBtnClick}
    >
      <span>
        <FontAwesomeIcon icon={faBell} size="xs" color="white" />
        <Tooltip id="NotificationsCount" content="Read your notifications" />
        {unreadNotificationCount > 0 && (
          <span className="notification-badge">{unreadNotificationCount}</span>
        )}
      </span>
    </Button>
  );
};
