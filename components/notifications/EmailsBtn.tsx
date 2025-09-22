import { Button } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import history from "../navigation/history";
type EmailsBtnType = {
  failedEmailCount: number;
};
export const EmailsBtn = ({
  failedEmailCount
}: EmailsBtnType) => {
  const handleBtnClick = () => {
    history.push("/notifications/email");
  };
  return (
    <Button
      type="button"
      className="notification-btn"
      data-cy="emailBtn"
      data-tooltip-id="FailedEmailCount"
      onClick={handleBtnClick}
    >
      <span>
        <FontAwesomeIcon icon={faEnvelope} size="xs" color="white" />
        <Tooltip id="FailedEmailCount" content="Important information" />
        {failedEmailCount > 0 && (
          <span className="notification-badge">!</span>
        )}
      </span>
    </Button>
  );
};
