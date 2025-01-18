import React, { useMemo, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { CctSummaryType } from "../../../redux/slices/cctListSlice";
import dayjs from "dayjs";
import { TableColumnHeader } from "../../notifications/TableColumnHeader";
import history from "../../navigation/history";
import store from "../../../redux/store/store";
import { updatedNewCalcMade } from "../../../redux/slices/cctSlice";
import { LtftDeclarationsModal } from "../../ltft/LtftDeclarationsModal";
import { Hint } from "nhsuk-react-components";
import { mockCctFullCalcsList1 } from "../../../mock-data/mock-cct-data";
import {
  setLtftCctSnapshot,
  updatedLtft
} from "../../../redux/slices/ltftSlice";
import { populateLtftDraft } from "../../../utilities/ltftUtilities";

const columnHelper = createColumnHelper<CctSummaryType>();

const createColumns = (
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => [
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
        title="Created"
        data-cy={`table-column_${column.id}`}
      />
    ),
    cell: props => <span>{dayjs(props.renderValue()).toString()}</span>,
    sortingFn: "datetime"
  }),
  columnHelper.accessor("lastModified", {
    id: "lastModified",
    header: ({ column }) => (
      <TableColumnHeader
        column={column}
        title="Last modified"
        data-cy={`table-column_${column.id}`}
      />
    ),
    cell: props => <span>{dayjs(props.renderValue()).toString()}</span>,
    sortingFn: "datetime",
    sortDescFirst: true
  }),
  columnHelper.display({
    id: "makeLtft",
    cell: props => (
      <RowLtftActions
        row={props.row.original}
        setIsModalOpen={setIsModalOpen}
      />
    )
  })
];

export function CctSavedDraftsTable() {
  const dispatch = useAppDispatch();
  const cctList = useAppSelector(state => state.cctList.cctList);

  const memoData = useMemo(() => {
    // TODO: remove CctSummaryType when BE is ready
    return cctList as CctSummaryType[];
  }, [cctList]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "lastModified", desc: true }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = useMemo(
    () => createColumns(setIsModalOpen),
    [setIsModalOpen]
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

  return cctList.length > 0 ? (
    <div className="table-wrapper">
      <Hint data-cy="cct-saved-drafts-ltft-hint">
        {`Please click the 'Make Changing hours (LTFT) application' button to
        begin an application with your chosen saved CCT Calculation details
        included.`}
      </Hint>
      <table data-cy="cct-saved-drafts-table">
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
                  store.dispatch(updatedNewCalcMade(false));
                  history.push(`/cct/view/${row.original.id}`);
                }}
                key={row.id}
                data-cy={`saved-calculation-row-${row.id}`}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    data-cy={cell.id}
                    style={{
                      padding: "12px 12px 8px 2px",
                      minWidth: "150px"
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <LtftDeclarationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          const draftLtft = populateLtftDraft();
          dispatch(updatedLtft(draftLtft));
          setIsModalOpen(false);
          history.push("/ltft/create");
        }}
      />
    </div>
  ) : (
    <p data-cy="no-saved-drafts">You have no saved calculations.</p>
  );
}

type RowLtftActionsProps = {
  row: CctSummaryType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function RowLtftActions({
  row,
  setIsModalOpen
}: Readonly<RowLtftActionsProps>) {
  // TODO this mock data var when BE is updated
  const mockCctRowData = mockCctFullCalcsList1[0];

  const handleMakeLtftBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // TODO swap mock data for row (which has full CctCalculation) when BE is updated
    store.dispatch(setLtftCctSnapshot(mockCctRowData));
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <button
      type="button"
      className="make-ltft-btn"
      onClick={handleMakeLtftBtnClick}
      data-cy="make-ltft-btn"
    >
      Make Changing hours (LTFT) application
    </button>
  );
}
