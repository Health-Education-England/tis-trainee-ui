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
import dayjs from "dayjs";
import { TableColumnHeader } from "../../notifications/TableColumnHeader";
import history from "../../navigation/history";
import store from "../../../redux/store/store";
import {
  CctCalculation,
  deleteCctCalc,
  updatedNewCalcMade
} from "../../../redux/slices/cctSlice";
import {
  setLtftCctSnapshot,
  updatedLtft
} from "../../../redux/slices/ltftSlice";
import { useIsLtftPilot } from "../../../utilities/hooks/useIsLtftPilot";
import { LtftDeclarationsModal } from "../ltft/LtftDeclarationsModal";
import { populateLtftDraft } from "../../../utilities/ltftUtilities";
import { Button } from "@aws-amplify/ui-react";
import { loadCctList } from "../../../redux/slices/cctListSlice";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";

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
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
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
  return [...columnsDefault, ltftColumn];
};

export function CctSavedDraftsTable() {
  const dispatch = useAppDispatch();
  const cctList = useAppSelector(state => state.cctList.cctList);
  const tpData = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );
  const cctSnapshot = useAppSelector(state => state.ltft.LtftCctSnapshot);
  const memoData = useMemo(() => {
    return cctList;
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
      <table data-cy="cct-saved-drafts-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} style={{ width: header.getSize() }}>
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
          const draftLtft = populateLtftDraft(
            cctSnapshot,
            tpData.personalDetails,
            tpData.traineeTisId
          );
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
  row: CctCalculation;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function RowLtftActions({
  row,
  setIsModalOpen
}: Readonly<RowLtftActionsProps>) {
  const isLtftPilot = useIsLtftPilot();
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();

  const makeLtftBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    store.dispatch(setLtftCctSnapshot(row));
    setIsModalOpen(true);
  };

  const deleteCctCalcAndReloadList = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    startSubmitting();
    await store.dispatch(deleteCctCalc(row.id as string));
    const deleteStatus = store.getState().cct.formDeleteStatus;
    if (deleteStatus === "succeeded") {
      store.dispatch(loadCctList());
    }
    stopSubmitting();
  };

  return (
    <div style={{ display: "flex", gap: "1em" }}>
      {isLtftPilot && (
        <Button
          onClick={makeLtftBtnClick}
          data-cy={`make-ltft-btn-${row.id}`}
          size="small"
          type="button"
          style={{
            minWidth: "18em",
            maxWidth: "18em",
            backgroundColor: "#005eb8",
            color: "white",
            cursor: "pointer"
          }}
        >
          Apply for Changing hours (LTFT)
        </Button>
      )}
      <Button
        onClick={deleteCctCalcAndReloadList}
        data-cy={`delete-cct-btn-${row.id}`}
        size="small"
        type="button"
        style={{
          backgroundColor: "#d5281b",
          color: "white",
          cursor: "pointer"
        }}
        disabled={isSubmitting}
      >
        Delete
      </Button>
    </div>
  );
}
