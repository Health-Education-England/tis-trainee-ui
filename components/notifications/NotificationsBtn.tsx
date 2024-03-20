import { Button } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";

type NotificationsBtnType = {
  unreadNotificationCount: number;
};

export const NotificationsBtn = ({
  unreadNotificationCount
}: NotificationsBtnType) => {
  return (
    <Button
      type="button"
      className="notification-btn"
      data-cy="signOutBtn"
      data-tooltip-id="Notifications"
    >
      <span>
        <FontAwesomeIcon icon={faBell} size="xs" color="white" />
        <Tooltip
          className="tooltip tooltip-row"
          id="Notifications"
          place="top"
          content="Notifications"
        />
        {<span className="notification-badge">{unreadNotificationCount}</span>}
      </span>
    </Button>
  );
};
