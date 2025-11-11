import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { NotificationType } from "../../redux/slices/notificationsSlice";
import {
  markAsUnreadBE,
  markAsUnreadFE
} from "../../utilities/NotificationsUtilities";
import { Button } from "@aws-amplify/ui-react";

type RowActionsProps = {
  row: NotificationType;
};

export function RowActions({ row }: Readonly<RowActionsProps>) {
  const [inProgressUpdate, setInProgressUpdate] = useState(false);
  if (row.status === "READ" && row.type === "IN_APP") {
    return (
      <Button
        size="small"
        type="reset"
        onClick={async e => {
          e.stopPropagation();
          setInProgressUpdate(true);
          markAsUnreadFE(row);
          await markAsUnreadBE(row);
          setInProgressUpdate(false);
        }}
        disabled={inProgressUpdate}
        style={{ cursor: "pointer", marginRight: "1rem" }}
      >
        <FontAwesomeIcon icon={faEnvelope} size="sm" className="unread-icon" />
        <span>Mark as unread</span>
      </Button>
    );
  } else return null;
}
