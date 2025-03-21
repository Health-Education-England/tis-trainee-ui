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
import Loading from "../../common/Loading";
import history from "../../navigation/history";
import { LtftFormStatus } from "../../../redux/slices/ltftSlice";

type LtftFormStatusSub = Extract<
  LtftFormStatus,
  "SUBMITTED" | "APPROVED" | "WITHDRAWN"
>;

type LtftSummaryProps = {
  ltftSummaryStatus: string;
  ltftSummaryList?: LtftSummaryObj[];
};

const LtftSummary = ({
  ltftSummaryStatus,
  ltftSummaryList
}: Readonly<LtftSummaryProps>) => {
  const ltftSummaries = ltftSummaryList || [];

  const [visibleStatuses, setVisibleStatuses] = useState<
    Record<LtftFormStatusSub, boolean>
  >({
    SUBMITTED: true,
    APPROVED: true,
    WITHDRAWN: true
  });

  const filteredLtftSummaries = ltftSummaries.filter(
    item => visibleStatuses[item.status as LtftFormStatusSub]
  );

  const toggleStatus = (status: LtftFormStatusSub) => {
    setVisibleStatuses(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  const columnHelper = createColumnHelper<LtftSummaryObj>();

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

  const renderValue = (props: { renderValue: () => ReactNode }) => (
    <span>{props.renderValue()}</span>
  );
  const renderDayValue = (props: { renderValue: () => ReactNode }) => (
    <span>{dayjs(props.renderValue() as Date | string).toString()}</span>
  );

  const renderOperationColumnValue = (props: {
    row: { original: LtftSummaryObj };
  }) => {
    const renderActionButton = (
      label: string,
      dataCy: string,
      additionalStyle = {}
    ) => (
      <Button
        data-cy={dataCy}
        fontWeight="normal"
        onClick={e => {
          e.stopPropagation();
          // onClickEvent();
        }}
        size="small"
        type="reset"
        style={additionalStyle}
      >
        {label}
      </Button>
    );

    return (
      <>
        {props.row.original.status === "SUBMITTED" ? (
          <>
            {renderActionButton("Unsubmit", "unsubmitLtftBtnLink", {
              marginBottom: "0.5em"
            })}
            {renderActionButton("Withdraw", "withdrawLtftBtnLink")}
          </>
        ) : null}
      </>
    );
  };

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

  const statusFilters: LtftFormStatusSub[] = [
    "APPROVED",
    "SUBMITTED",
    "WITHDRAWN"
  ];

  let content: JSX.Element = <></>;
  if (ltftSummaryStatus === "loading") content = <Loading />;
  if (ltftSummaryStatus === "succeeded")
    content = (
      <div>
        {statusFilters.map(status => (
          <CheckboxField
            key={status}
            data-cy={`filter${status}Ltft`}
            name={`yesToShow${status}`}
            value="yes"
            label={status}
            checked={visibleStatuses[status]}
            onChange={() => toggleStatus(status)}
          />
        ))}
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
                  onClick={() => history.push(`/ltft/${row.original.id}`)}
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
