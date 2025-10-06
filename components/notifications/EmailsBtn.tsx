import { Button } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import history from "../navigation/history";
export const EmailsBtn = () => {
  const handleBtnClick = () => {
    history.push("/notifications/email");
  };
  return (
    <Button
      type="button"
      className="notification-btn"
      data-cy="emailBtn"
      data-tooltip-id="EmailCount"
      onClick={handleBtnClick}
    >
      <span>
        <FontAwesomeIcon icon={faEnvelope} size="xs" color="white" />
        <Tooltip id="EmailCount" content="Email notifications" />
      </span>
    </Button>
  );
};
