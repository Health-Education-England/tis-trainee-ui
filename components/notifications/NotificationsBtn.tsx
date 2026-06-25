import { Button } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import history from "../navigation/history";
import { switchNotification } from "../../utilities/NotificationsUtilities";
type NotificationsBtnType = {
  unreadNotificationCount: number;
};
export const NotificationsBtn = ({
  unreadNotificationCount
}: NotificationsBtnType) => {
  const handleBtnClick = () => {
    switchNotification("IN_APP");
    history.push("/notifications");
  };
  return (
    <button
      data-cy="notificationBtn"
      data-tooltip-id="NotificationsCount"
      onClick={handleBtnClick}
      className="notification-btn"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer"
      }}
    >
      <span>
        <FontAwesomeIcon icon={faBell} size="xl" color="white" style={{}} />
        <Tooltip
          id="NotificationsCount"
          content="In-app notifications"
          positionStrategy="fixed"
        />
        {unreadNotificationCount > 0 && (
          <span
            style={{
              position: "relative",
              top: "-6px",
              right: "6px",
              backgroundColor: "#FF5733",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
              fontWeight: "bold",
              minWidth: "20px",
              textAlign: "center"
            }}
          >
            {unreadNotificationCount}
          </span>
        )}
      </span>
    </button>
  );
};
