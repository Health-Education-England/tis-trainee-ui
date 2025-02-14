import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  createColumnHelper
} from "@tanstack/react-table";
import {
  fetchLtftSummaryList,
  LtftSummaryObj
} from "../../../redux/slices/ltftSummaryListSlice";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { useEffect, useMemo, useState } from "react";
import { Button, CheckboxField } from "@aws-amplify/ui-react";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import useIsBetaTester from "../../../utilities/hooks/useIsBetaTester";
import Loading from "../../common/Loading";
import { mockLtftsList1 } from "../../../mock-data/mock-ltft-data";
import { TableColumnHeader } from "../../notifications/TableColumnHeader";
import dayjs from "dayjs";

type LtftSummaryProps = {
  ltftSummaryList?: LtftSummaryObj[];
};

const LtftSummary = ({ ltftSummaryList }: Readonly<LtftSummaryProps>) => {
  const dispatch = useAppDispatch();
  const isBetaTester = useIsBetaTester();
  useEffect(() => {
    if (isBetaTester) dispatch(fetchLtftSummaryList());
  }, [dispatch, isBetaTester]);

  // TODO: remove the mock data mockLtftsList1 and resume the data from useAppSelector when ready
  // const ltftSummaryList = useAppSelector(
  //   state => state.ltftSummaryList?.ltftList || []
  // );
  // const ltftListStatus = useAppSelector(state => state.ltftSummaryList?.status);
  const ltftSummaries = mockLtftsList1 || [];

  const [showSubmitted, setShowSubmitted] = useState(true);
  const [showApproved, setShowApproved] = useState(true);
  const [showWithdrawn, setShowWithdrawn] = useState(true);

  const hasPreviousLtft = ltftSummaries.some(
    ltft => ltft.status !== "DRAFT" && ltft.status !== "UNSUBMITTED"
  );
  const filteredLtftSummaries = ltftSummaries.filter(
    item =>
      item.status !== "DRAFT" &&
      item.status !== "UNSUBMITTED" &&
      (showSubmitted || item.status !== "SUBMITTED") &&
      (showApproved || item.status !== "APPROVED") &&
      (showWithdrawn || item.status !== "WITHDRAWN")
  );

  const sortedLtftSummaries = DateUtilities.genericSort(
    filteredLtftSummaries.slice(),
    "lastModified",
    true
  );

  const latestSubmitted = sortedLtftSummaries.find(
    i => i.status === "SUBMITTED"
  );

  // React table setup
  const columnHelper = createColumnHelper<LtftSummaryObj>();

  const columnsDefault = [
    columnHelper.accessor("name", {
      id: "name",
      header: ({ column }) => (
        <TableColumnHeader
          column={column}
          title="Name"
          data-cy={`table-column_${column.id}`}
        />
      ),
      cell: props => <span>{props.renderValue()}</span>
    }),
    columnHelper.accessor("created", {
      id: "created",
      header: ({ column }) => (
        <TableColumnHeader
          column={column}
          title="Created date"
          data-cy={`table-column_${column.id}`}
        />
      ),
      cell: props => <span>{dayjs(props.renderValue()).toString()}</span>,
      sortingFn: "datetime"
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: ({ column }) => (
        <TableColumnHeader
          column={column}
          title="Status"
          data-cy={`table-column_${column.id}`}
        />
      ),
      cell: props => <span>{props.renderValue()}</span>
    }),
    columnHelper.accessor("lastModified", {
      id: "lastModified",
      header: ({ column }) => (
        <TableColumnHeader
          column={column}
          title="Status date"
          data-cy={`table-column_${column.id}`}
        />
      ),
      cell: props => <span>{dayjs(props.renderValue()).toString()}</span>,
      sortingFn: "datetime",
      sortDescFirst: true
    })
  ];

  const createColumns = (
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    hasPreviousLtft: boolean
  ) => {
    const ltftColumn = columnHelper.display({
      id: "operations",
      cell: props => (
        <span>
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
        </span>
      )
    });
    return [...columnsDefault, ltftColumn];
  };

  const memoData = useMemo(() => {
    return filteredLtftSummaries;
  }, [filteredLtftSummaries]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "lastModified", desc: true }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = useMemo(
    () => createColumns(setIsModalOpen, hasPreviousLtft),
    [setIsModalOpen, hasPreviousLtft]
  );

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
  // if (ltftListStatus === "loading") content = <Loading />;
  // if (ltftListStatus === "succeeded")
  content = (
    <div>
      <CheckboxField
        data-cy="filterApprovedLtft"
        name="yesToShowApproved"
        value="yes"
        label="APPROVED"
        checked={showApproved}
        onChange={() => setShowApproved(prevShowApproved => !prevShowApproved)}
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
          {table.getHeaderGroups().map(headerGroup => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
