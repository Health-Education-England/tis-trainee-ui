import { createColumnHelper } from "@tanstack/react-table";
import { NotificationType } from "../../redux/slices/notificationsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { TableColumnHeader } from "./TableColumnHeader";
import { StringUtilities } from "../../utilities/StringUtilities";
import { DateUtilities } from "../../utilities/DateUtilities";
import { RowActions } from "./RowActions";

const columnHelper = createColumnHelper<NotificationType>();

export const columns = [
  columnHelper.accessor("status", {
    id: "status",
    header: "",
    cell: props => {
      const statusClass =
        props.row.original.status === "READ" ? "status-read" : "status-unread";
      return (
        <span className={`${statusClass} nhsuk-margin-left-1`}>
          {props.row.original.status === "READ" ? (
            <FontAwesomeIcon icon={faEnvelopeOpen} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          )}
        </span>
      );
    }
  }),
  columnHelper.accessor("subject", {
    id: "subject",
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
    cell: props => (
      <span>
        {StringUtilities.truncateString(props.renderValue() as string, 40)}
      </span>
    ),
    enableColumnFilter: false
  }),

  columnHelper.accessor("type", {
    id: "type",
    header: ({ column }) => <TableColumnHeader column={column} title="Type" />,
    cell: props => <span>{props.renderValue()}</span>,
    enableColumnFilter: false
  }),

  columnHelper.accessor("sentAt", {
    id: "sentAt",
    header: ({ column }) => <TableColumnHeader column={column} title="Date" />,
    cell: info => DateUtilities.ToLocalDate(info.renderValue()),
    sortingFn: "datetime",
    sortDescFirst: false,
    enableColumnFilter: false
  }),
  columnHelper.display({
    id: "moreActions",
    cell: props => <RowActions row={props.row.original} />
  })
];
