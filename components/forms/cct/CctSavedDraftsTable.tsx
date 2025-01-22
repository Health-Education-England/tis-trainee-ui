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
import { useAppSelector } from "../../../redux/hooks/hooks";
import dayjs from "dayjs";
import { TableColumnHeader } from "../../notifications/TableColumnHeader";
import history from "../../navigation/history";
import store from "../../../redux/store/store";
import {
  CctCalculation,
  updatedNewCalcMade
} from "../../../redux/slices/cctSlice";
import { setLtftCctSnapshot } from "../../../redux/slices/ltftSlice";
import useIsBetaTester from "../../../utilities/hooks/useIsBetaTester";
import { LtftDeclarationsModal } from "../ltft/LtftDeclarationsModal";

const columnHelper = createColumnHelper<CctCalculation>();

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
  })
];

const createColumns = (
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  hasDraftOrUnsubmitted: boolean
) => {
  const ltftColumn = columnHelper.display({
    id: "makeLtft",
    cell: props => (
      <RowLtftActions
        row={props.row.original}
        setIsModalOpen={setIsModalOpen}
      />
    )
  });
  if (hasDraftOrUnsubmitted) {
    return columnsDefault;
  }
  return [...columnsDefault, ltftColumn];
};

export function CctSavedDraftsTable() {
  const cctList = useAppSelector(state => state.cctSummaryList.cctList);
  const ltftList = useAppSelector(state => state.ltftSummaryList.ltftList);
  const hasDraftOrUnsubmitted = ltftList.some(
    ltft => ltft.status === "DRAFT" || ltft.status === "UNSUBMITTED"
  );

  const memoData = useMemo(() => {
    return cctList;
  }, [cctList]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "lastModified", desc: true }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = useMemo(
    () => createColumns(setIsModalOpen, hasDraftOrUnsubmitted),
    [setIsModalOpen, hasDraftOrUnsubmitted]
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
                  <td key={cell.id} data-cy={cell.id}>
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
          // TODO: populate the new LTFT form with cct snapshot and PD details
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
  row: CctCalculation;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function RowLtftActions({
  row,
  setIsModalOpen
}: Readonly<RowLtftActionsProps>) {
  const isBetaTester = useIsBetaTester();
  const makeLtftBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.dispatch(setLtftCctSnapshot(row));
    setIsModalOpen(true);
  };
  return isBetaTester ? (
    <button
      className="make-ltft-btn"
      onClick={makeLtftBtnClick}
      data-cy={`make-ltft-btn-${row.id}`}
    >
      Apply for Changing hours (LTFT)
    </button>
  ) : null;
}
