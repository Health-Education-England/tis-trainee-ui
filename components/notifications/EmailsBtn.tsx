import { Button } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import history from "../navigation/history";
import { switchNotification } from "../../utilities/NotificationsUtilities";
export const EmailsBtn = () => {
  const handleBtnClick = () => {
    switchNotification("EMAIL");
    history.push("/notifications");
  };
  return (
    <button
      data-cy="emailBtn"
      data-tooltip-id="EmailCount"
      onClick={handleBtnClick}
      style={{
        background: "none",
        border: "none",
        marginRight: "0.5rem",
        cursor: "pointer"
      }}
    >
      <span>
        <FontAwesomeIcon icon={faEnvelope} size="xl" color="white" />
        <Tooltip
          id="EmailCount"
          content="Email notifications"
          positionStrategy="fixed"
        />
      </span>
    </button>
  );
};
