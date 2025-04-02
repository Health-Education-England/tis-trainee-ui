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
import {
  LtftSummaryObj,
  updatedLtftFormsRefreshNeeded
} from "../../../redux/slices/ltftSummaryListSlice";
import store from "../../../redux/store/store";
import { ReactNode, useMemo, useState } from "react";
import { Button, CheckboxField } from "@aws-amplify/ui-react";
import { TableColumnHeader } from "../../notifications/TableColumnHeader";
import dayjs from "dayjs";
import Loading from "react-loading";
import history from "../../navigation/history";
import { LtftFormStatus } from "../../../redux/slices/ltftSlice";
import {
  checkPush,
  loadTheSavedForm
} from "../../../utilities/FormBuilderUtilities";
import {
  ActionModal,
  ActionType,
  ReasonMsgObj
} from "../../common/ActionModal";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import { useActionState } from "../../../utilities/hooks/useActionState";
import { handleLtftSummaryModalSub } from "../../../utilities/ltftUtilities";

type LtftFormStatusSub = Extract<
  LtftFormStatus,
  "SUBMITTED" | "APPROVED" | "WITHDRAWN" | "DRAFT" | "UNSUBMITTED"
>;

type LtftSummaryType = "CURRENT" | "PREVIOUS";
type LtftSummaryProps = {
  ltftSummaryType: LtftSummaryType;
  ltftSummaryStatus: string;
  ltftSummaryList?: LtftSummaryObj[];
};

const LtftSummary = ({
  ltftSummaryType,
  ltftSummaryStatus,
  ltftSummaryList
}: Readonly<LtftSummaryProps>) => {
  const [showModal, setShowModal] = useState(false);
  const { startSubmitting, stopSubmitting } = useSubmitting();
  const { currentAction, setAction, resetAction } = useActionState();
  const ltftSummaries = ltftSummaryList || [];

  const [visibleStatuses, setVisibleStatuses] = useState<
    Record<LtftFormStatusSub, boolean>
  >({
    SUBMITTED: true,
    APPROVED: true,
    WITHDRAWN: true,
    DRAFT: true,
    UNSUBMITTED: true
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

  const handleClick = (id: string) => {
    if (ltftSummaryType === "CURRENT") {
      loadTheSavedForm("/ltft", id ?? "", history);
    } else if (ltftSummaryType === "PREVIOUS") {
      history.push(`/ltft/${id}`);
    }
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
    const handleBtnClick =
      (label: ActionType) => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setAction(label, props.row.original.id, "ltft");
        setShowModal(true);
      };
    const renderActionButton = (
      label: Extract<ActionType, "Unsubmit" | "Withdraw" | "Delete">,
      additionalStyle = {}
    ) => (
      <Button
        data-cy={`${label.toLowerCase()}LtftBtnLink`}
        fontWeight="normal"
        onClick={handleBtnClick(label)}
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
            {renderActionButton("Unsubmit", {
              marginBottom: "0.5em"
            })}
            {renderActionButton("Withdraw")}
          </>
        ) : null}
        {props.row.original.status === "DRAFT" ? (
          <>{renderActionButton("Delete")}</>
        ) : null}
        {props.row.original.status === "UNSUBMITTED" ? (
          <>{renderActionButton("Withdraw")}</>
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

  let statusFilters: LtftFormStatusSub[] = [];
  if (ltftSummaryType === "CURRENT") {
    statusFilters = ["DRAFT", "UNSUBMITTED"];
  } else if (ltftSummaryType === "PREVIOUS") {
    statusFilters = ["APPROVED", "SUBMITTED", "WITHDRAWN"];
  }

  let content: JSX.Element = <></>;
  if (ltftSummaryStatus === "loading") content = <Loading />;
  if (ltftSummaryStatus === "succeeded")
    content = (
      <>
        {ltftSummaries.length > 0 ? (
          <>
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
            <div className="table-wrapper">
              <table data-cy={`ltft-summary-table-${ltftSummaryType}`}>
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
                        onClick={() => handleClick(row.original.id)}
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
            <ActionModal
              onSubmit={async (reasonObj: ReasonMsgObj) => {
                setShowModal(false);
                store.dispatch(updatedLtftFormsRefreshNeeded(false));
                startSubmitting();
                const shouldStartOver = await handleLtftSummaryModalSub(
                  currentAction,
                  reasonObj
                );
                stopSubmitting();
                if (shouldStartOver) {
                  checkPush("ltft", "formsList");
                }
              }}
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
                resetAction();
              }}
              cancelBtnText="Cancel"
              warningLabel={currentAction.type ?? ""}
              warningText={currentAction.warningText}
              submittingBtnText={currentAction.submittingText}
              actionType={currentAction.type as ActionType}
            />
          </>
        ) : (
          <p data-cy="no-saved-drafts">
            You have no{" "}
            {ltftSummaryType === "CURRENT"
              ? "in progress"
              : ltftSummaryType.toLowerCase()}{" "}
            applications.
          </p>
        )}
      </>
    );
  return content;
};

export default LtftSummary;
