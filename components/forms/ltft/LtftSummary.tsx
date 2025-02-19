import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  createColumnHelper,
  HeaderContext
} from "@tanstack/react-table";
import { LtftSummaryObj } from "../../../redux/slices/ltftSummaryListSlice";
import { ReactNode, useMemo, useState } from "react";
import { Button, CheckboxField } from "@aws-amplify/ui-react";
import { TableColumnHeader } from "../../notifications/TableColumnHeader";
import dayjs from "dayjs";
import Loading from "react-loading";

type LtftSummaryProps = {
  ltftSummaryStatus: string;
  ltftSummaryList?: LtftSummaryObj[];
};

const LtftSummary = ({
  ltftSummaryStatus,
  ltftSummaryList
}: Readonly<LtftSummaryProps>) => {
  const ltftSummaries = ltftSummaryList || [];

  const [showSubmitted, setShowSubmitted] = useState(true);
  const [showApproved, setShowApproved] = useState(true);
  const [showWithdrawn, setShowWithdrawn] = useState(true);

  const filteredLtftSummaries = ltftSummaries.filter(
    item =>
      (showSubmitted || item.status !== "SUBMITTED") &&
      (showApproved || item.status !== "APPROVED") &&
      (showWithdrawn || item.status !== "WITHDRAWN")
  );

  const latestSubmitted = filteredLtftSummaries.find(
    i => i.status === "SUBMITTED"
  );

  // React table setup
  const columnHelper = createColumnHelper<LtftSummaryObj>();

  // Header
  const renderNameHeader = ({
    column
  }: HeaderContext<LtftSummaryObj, string>) => (
    <TableColumnHeader
      column={column}
      title="Name"
      data-cy={`table-column_${column.id}`}
    />
  );
  const renderCreatedHeader = ({
    column
  }: HeaderContext<LtftSummaryObj, string>) => (
    <TableColumnHeader
      column={column}
      title="Created"
      data-cy={`table-column_${column.id}`}
    />
  );
  const renderLastModifiedHeader = ({
    column
  }: HeaderContext<LtftSummaryObj, string>) => (
    <TableColumnHeader
      column={column}
      title="Last modified"
      data-cy={`table-column_${column.id}`}
    />
  );
  const renderStatusHeader = ({
    column
  }: HeaderContext<LtftSummaryObj, string>) => (
    <TableColumnHeader
      column={column}
      title="Status"
      data-cy={`table-column_${column.id}`}
    />
  );

  //Header value
  const renderValue = (props: { renderValue: () => ReactNode }) => (
    <span>{props.renderValue()}</span>
  );
  const renderDayValue = (props: { renderValue: () => ReactNode }) => (
    <span>{dayjs(props.renderValue() as Date | string).toString()}</span>
  );

  // Operation Column
  const renderOperationColumnValue = (props: {
    row: { original: LtftSummaryObj };
  }) => (
    <>
      {props.row.original.status === "SUBMITTED" &&
      props.row.original === latestSubmitted ? (
        <>
          <Button
            data-cy="unsubmitLtftBtnLink"
            fontWeight="normal"
            // onClick={onClickEvent}
            size="small"
            type="reset"
            style={{ marginBottom: "0.5em" }}
          >
            Unsubmit
          </Button>
          <Button
            data-cy="withdrawLtftBtnLink"
            fontWeight="normal"
            // onClick={onClickEvent}
            size="small"
            type="reset"
          >
            Withdraw
          </Button>
        </>
      ) : null}
    </>
  );

  const columnsDefault = [
    columnHelper.accessor("name", {
      id: "name",
      header: renderNameHeader,
      cell: renderValue
    }),
    columnHelper.accessor("created", {
      id: "created",
      header: renderCreatedHeader,
      cell: renderDayValue,
      sortingFn: "datetime"
    }),
    columnHelper.accessor("lastModified", {
      id: "lastModified",
      header: renderLastModifiedHeader,
      cell: renderDayValue,
      sortingFn: "datetime",
      sortDescFirst: true
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: renderStatusHeader,
      cell: renderValue
    }),
    columnHelper.display({
      id: "operations",
      cell: renderOperationColumnValue
    })
  ];

  const memoData = useMemo(() => {
    return filteredLtftSummaries;
  }, [filteredLtftSummaries]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "lastModified", desc: true }
  ]);

  const columns = useMemo(() => columnsDefault, []);

  const table = useReactTable({
    data: memoData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting
    },
    onSortingChange: setSorting,
    autoResetPageIndex: false
  });

  let content: JSX.Element = <></>;
  if (ltftSummaryStatus === "loading") content = <Loading />;
  if (ltftSummaryStatus === "succeeded")
    content = (
      <div>
        <CheckboxField
          data-cy="filterApprovedLtft"
          name="yesToShowApproved"
          value="yes"
          label="APPROVED"
          checked={showApproved}
          onChange={() =>
            setShowApproved(prevShowApproved => !prevShowApproved)
          }
        />
        <CheckboxField
          data-cy="filterSubmittedLtft"
          name="yesToShowSubmitted"
          value="yes"
          label="SUBMITTED"
          checked={showSubmitted}
          onChange={() =>
            setShowSubmitted(prevShowSubmitted => !prevShowSubmitted)
          }
        />
        <CheckboxField
          data-cy="filterWithdrawnLtft"
          name="yesToShowWithdrawn"
          value="yes"
          label="WITHDRAWN"
          checked={showWithdrawn}
          onChange={() =>
            setShowWithdrawn(prevShowWithdrawn => !prevShowWithdrawn)
          }
        />
        <table data-cy="ltft-summary-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    data-cy={`ltft-summary-table-${header.id}`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr
                  className="table-row"
                  onClick={e => {
                    e.stopPropagation();
                    // history.push(`/ltft/view/${row.original.id}`);
                  }}
                  key={row.id}
                  data-cy={`ltft-row-${row.id}`}
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
  return content;
};

export default LtftSummary;
