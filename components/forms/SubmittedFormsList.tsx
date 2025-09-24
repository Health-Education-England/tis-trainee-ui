import { Card, Hint, WarningCallout } from "nhsuk-react-components";
import { IFormR } from "../../models/IFormR";
import {
  DateUtilities,
  DateType,
  isWithinRange
} from "../../utilities/DateUtilities";
import {
  FormRUtilities,
  getLinkedProgrammeDetails
} from "../../utilities/FormRUtilities";
import history from "../navigation/history";
import { ReactNode, useMemo, useState } from "react";
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  HeaderContext,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { TableColumnHeader } from "../notifications/TableColumnHeader";
import dayjs from "dayjs";
import { useAppSelector } from "../../redux/hooks/hooks";

interface ISubmittedFormsList {
  formRList: IFormR[];
  path: string;
  latestSubDate: DateType;
}

const SubmittedFormsList = ({
  formRList,
  path,
  latestSubDate
}: ISubmittedFormsList) => {
  const columnHelper = createColumnHelper<IFormR>();

  const renderIdHeader = ({ column }: HeaderContext<IFormR, unknown>) => (
    <TableColumnHeader
      column={column}
      title="Form ID"
      data-cy={`table-column_${column.id}`}
    />
  );
  const renderPmHeader = ({ column }: HeaderContext<IFormR, unknown>) => (
    <TableColumnHeader
      column={column}
      title="Linked Programme"
      data-cy={`table-column_${column.id}`}
    />
  );
  const renderSubmitDateHeader = ({
    column
  }: HeaderContext<IFormR, unknown>) => (
    <TableColumnHeader
      column={column}
      title="Submitted Date"
      data-cy={`table-column_${column.id}`}
    />
  );
  const renderStatusHeader = ({ column }: HeaderContext<IFormR, unknown>) => (
    <TableColumnHeader
      column={column}
      title="Status"
      data-cy={`table-column_${column.id}`}
    />
  );

  const renderValue = (props: { renderValue: () => ReactNode }) => (
    <span>{props.renderValue()}</span>
  );
  const renderDayValue = (
    props: CellContext<IFormR, Date | string | null | undefined>
  ) => (
    <time
      dateTime={`props.renderValue()`}
      data-tooltip={dayjs(props.renderValue() as Date | string).toString()}
    >
      {dayjs(props.renderValue() as Date | string).format("DD/MM/YYYY")}
    </time>
  );
  const progMems = useAppSelector(
    state => state.traineeProfile.traineeProfileData.programmeMemberships
  );
  const renderPmValue = (props: { renderValue: () => ReactNode }) => (
    <>
      {getLinkedProgrammeDetails(progMems, props.renderValue() as string)
        ?.programmeName ?? "Linked programme not set."}
    </>
  );

  const columnsDefault = [
    columnHelper.accessor("id", {
      id: "id",
      header: renderIdHeader,
      cell: renderValue
    }),
    columnHelper.accessor("programmeMembershipId", {
      id: "programmeMembershipId",
      header: renderPmHeader,
      cell: renderPmValue
    }),
    columnHelper.accessor("submissionDate", {
      id: "submissionDate",
      header: renderSubmitDateHeader,
      cell: renderDayValue,
      sortingFn: "datetime",
      sortDescFirst: true
    }),
    columnHelper.accessor("lifecycleState", {
      id: "status",
      header: renderStatusHeader,
      cell: renderValue
    })
  ];

  const [sorting, setSorting] = useState<SortingState>([
    { id: "submissionDate", desc: true }
  ]);

  const columns = useMemo(() => columnsDefault, []);

  const table = useReactTable({
    data: formRList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting
    },
    onSortingChange: setSorting,
    autoResetPageIndex: false
  });

  let content: JSX.Element | JSX.Element[];

  const renderTableHeader = () => (
    <thead>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th
              key={header.id}
              data-cy={`formr-summary-table-${header.id}`}
              style={{
                width: header.getSize()
              }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );

  if (formRList.length) {
    content = (
      <div className="table-wrapper">
        <table data-cy={`formr-summary-table`}>
          {renderTableHeader()}
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr
                  className="table-row"
                  onClick={() =>
                    FormRUtilities.handleRowClick(
                      row.original.id!,
                      path,
                      history
                    )
                  }
                  key={row.id}
                  data-cy={`formr-row-${row.id}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} data-cy={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } else
    content = <p data-cy="noSubmittedFormsMsg">You have no submitted forms.</p>;
  return (
    <>
      {formRList.length ? (
        <>
          <Hint data-cy="formsTrueHint">
            To save a PDF copy of your submitted form, please click on a form
            below and then click the <b>Save a copy as a PDF</b> button at the
            top of that page.
          </Hint>
          <WarningCallout data-cy="formsListWarning">
            <WarningCallout.Label visuallyHiddenText={false}>
              Important
            </WarningCallout.Label>
            {isWithinRange(latestSubDate, 31, "d") && (
              <p>
                {`Your previous form was submitted recently on ${DateUtilities.ConvertToLondonTime(
                  latestSubDate
                )}`}
              </p>
            )}
            <h4>Need to amend a recently-submitted form?</h4>
            <p>
              Please click the <b>Support</b> link (menu or footer link) to
              contact your Local Office. They will put the specified form back
              into an &#39;unsubmitted&#39; state for you to make the necessary
              amendments and re-submit - rather than you having to complete
              another form.
            </p>
          </WarningCallout>
        </>
      ) : (
        <Hint data-cy="formsFalseHint">
          After you submit your completed form, instructions on how to{" "}
          <b>save a copy as a PDF</b> will appear here.
        </Hint>
      )}
      <Card>
        <Card.Content>
          <Card.Heading data-cy="formr-previous-header">
            Submitted forms
          </Card.Heading>
          {content}
        </Card.Content>
      </Card>
    </>
  );
};

export default SubmittedFormsList;
