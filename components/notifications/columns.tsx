import { createColumnHelper } from "@tanstack/react-table";
import { NotificationType } from "../../redux/slices/notificationsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEnvelope,
  faEnvelopeOpen,
  faInfoCircle,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import { TableColumnHeader } from "./TableColumnHeader";
import { StringUtilities } from "../../utilities/StringUtilities";
import { DateUtilities } from "../../utilities/DateUtilities";
import { RowActions } from "./RowActions";
import { Modal } from "../common/Modal";
import { useState } from "react";
import { failedEmailInfoText } from "../../utilities/Constants";

const columnHelper = createColumnHelper<NotificationType>();

const commonColumns = [
  columnHelper.accessor("subjectText", {
    id: "subjectText",
    size: 400,
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
    cell: props => (
      <span>
        {StringUtilities.truncateString(props.renderValue() as string, 40)}
      </span>
    ),
    enableColumnFilter: false
  }),

  columnHelper.accessor("subject", {
    id: "subject",
    header: ({ column }) => <TableColumnHeader column={column} title="Type" />,
    cell: props => <span>{props.renderValue()?.replace("_", " ")}</span>,
    enableColumnFilter: false
  }),

  columnHelper.accessor("sentAt", {
    id: "sentAt",
    header: ({ column }) => <TableColumnHeader column={column} title="Date" />,
    cell: info => DateUtilities.ToLocalDate(info.renderValue()),
    sortingFn: "datetime",
    sortDescFirst: false,
    enableColumnFilter: false
  })
];

const EmailStatusCell = ({ row }: { row: any }) => {
  const [showModal, setShowModal] = useState(false);
  const { status, statusDetail, id } = row.original;

  const statusClass = status === "FAILED" ? "status-failed" : "status-sent";

  return (
    <span className={`${statusClass} nhsuk-margin-left-1`}>
      {status === "FAILED" ? (
        <>
          <FontAwesomeIcon icon={faTriangleExclamation} size="lg" /> FAILED
          {statusDetail && (
            <>
              &nbsp;
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                data-cy={`${id}-icon`}
                aria-label="Show information"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer"
                }}
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  color="#005eb8"
                  size="sm"
                />
              </button>
              {showModal && (
                <div
                  data-cy={`${id}-modal`}
                  onClick={e => e.stopPropagation()}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    cancelBtnText="Close"
                  >
                    <div
                      className="modal-content"
                      style={{ textAlign: "left" }}
                    >
                      <h2>{statusDetail}</h2>
                      {failedEmailInfoText[statusDetail]}
                    </div>
                  </Modal>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faCheck} size="lg" /> SENT
        </>
      )}
    </span>
  );
};

export const inAppColumns = [
  columnHelper.accessor("status", {
    id: "status",
    header: "Status",
    cell: props => {
      const statusClass =
        props.row.original.status === "READ" ? "status-read" : "status-unread";
      return (
        <span className={`${statusClass} nhsuk-margin-left-1`}>
          {props.row.original.status === "READ" ? (
            <>
              <FontAwesomeIcon icon={faEnvelopeOpen} size="lg" /> READ
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faEnvelope} size="lg" /> UNREAD
            </>
          )}
        </span>
      );
    }
  }),

  ...commonColumns,

  columnHelper.display({
    id: "moreActions",
    cell: props => <RowActions row={props.row.original} />
  })
];

export const emailColumns = [
  columnHelper.accessor("status", {
    id: "status",
    header: "Status",
    size: 200,
    cell: props => <EmailStatusCell row={props.row} />
  }),

  ...commonColumns,

  columnHelper.accessor("contact", {
    id: "contact",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Sent to" />
    ),
    cell: props => (
      <span style={{ whiteSpace: "pre-wrap" }}>
        {props.renderValue()?.replace("@", "\n@")}
      </span>
    ),
    enableColumnFilter: false
  })
];
