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
import { updatedLtftFormsRefreshNeeded } from "../../../redux/slices/ltftSummaryListSlice";
import store from "../../../redux/store/store";
import { ReactNode, useMemo, useState } from "react";
import { Button, CheckboxField } from "@aws-amplify/ui-react";
import { TableColumnHeader } from "../../notifications/TableColumnHeader";
import dayjs from "dayjs";
import Loading from "react-loading";
import history from "../../navigation/history";
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
import {
  getStatusReasonLabel,
  handleLtftSummaryModalSub
} from "../../../utilities/ltftUtilities";
import { Label } from "nhsuk-react-components";
import InfoTooltip from "../../common/InfoTooltip";
import { LtftFormStatus, LtftSummaryObj } from "../../../models/LtftTypes";

type LtftFormStatusSub = Extract<
  LtftFormStatus,
  "SUBMITTED" | "APPROVED" | "WITHDRAWN" | "DRAFT" | "UNSUBMITTED" | "REJECTED"
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
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();
  const { currentAction, setAction, resetAction } = useActionState();
  const ltftSummaries = ltftSummaryList || [];

  const [visibleStatuses, setVisibleStatuses] = useState<
    Record<LtftFormStatusSub, boolean>
  >({
    SUBMITTED: true,
    APPROVED: true,
    WITHDRAWN: true,
    DRAFT: true,
    UNSUBMITTED: true,
    REJECTED: true
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

  const handleRowClick = (rowOb: LtftSummaryObj) => {
    if (ltftSummaryType === "CURRENT") {
      history.push(
        `/ltft/${rowOb.id}/${
          rowOb.status === "UNSUBMITTED" ? "view" : "create"
        }`
      );
    } else if (ltftSummaryType === "PREVIOUS") {
      history.push(`/ltft/${rowOb.id}/view`);
    }
  };

  const columnHelper = createColumnHelper<LtftSummaryObj>();

  const renderNameHeader = ({
    column
  }: HeaderContext<LtftSummaryObj, unknown>) => (
    <TableColumnHeader
      column={column}
      title="Name"
      data-cy={`table-column_${column.id}`}
    />
  );
  const renderLastModifiedHeader = ({
    column
  }: HeaderContext<LtftSummaryObj, unknown>) => (
    <TableColumnHeader
      column={column}
      title="Last Updated"
      data-cy={`table-column_${column.id}`}
    />
  );
  const renderFormRefHeader = ({
    column
  }: HeaderContext<LtftSummaryObj, unknown>) => (
    <TableColumnHeader
      column={column}
      title="Reference"
      data-cy={`table-column_${column.id}`}
    />
  );
  const renderStatusHeader = ({
    column
  }: HeaderContext<LtftSummaryObj, unknown>) => (
    <TableColumnHeader
      column={column}
      title="Status"
      data-cy={`table-column_${column.id}`}
    />
  );
  const renderReasonHeader = ({
    column
  }: HeaderContext<LtftSummaryObj, unknown>) => (
    <TableColumnHeader
      column={column}
      title="Reason"
      data-cy={`table-column_${column.id}`}
    />
  );

  const renderValue = (props: { renderValue: () => ReactNode }) => (
    <span>{props.renderValue()}</span>
  );
  const renderDayValue = (props: { renderValue: () => ReactNode }) => (
    <time
      dateTime={`props.renderValue()`}
      data-tooltip={dayjs(props.renderValue() as Date | string).toString()}
    >
      {dayjs(props.renderValue() as Date | string).format("D MMM YYYY")}
    </time>
  );

  const renderStatusColumnValue = (props: {
    row: { original: LtftSummaryObj };
  }) => {
    return (
      <>
        {props.row.original.status}
        {props.row.original.status === "UNSUBMITTED" &&
        props.row.original.modifiedByRole ? (
          <>
            {" "}
            by
            {props.row.original.modifiedByRole === "TRAINEE" ? (
              <> me</>
            ) : (
              " Local Office"
            )}
          </>
        ) : null}
      </>
    );
  };

  const renderReasonColumnValue = (props: {
    row: { original: LtftSummaryObj };
  }) => {
    const handleTooltipClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };
    return (
      <>
        {getStatusReasonLabel(
          props.row.original.status,
          props.row.original.statusReason
        )}
        {(props.row.original.status === "UNSUBMITTED" ||
          props.row.original.status === "WITHDRAWN" ||
          props.row.original.status === "REJECTED") &&
        props.row.original.statusMessage ? (
          <Label size="s" onClick={handleTooltipClick}>
            <InfoTooltip
              tooltipId={`${props.row.original.id}-statusMessage`}
              content={props.row.original.statusMessage}
            />
          </Label>
        ) : null}
      </>
    );
  };

  const memoData = useMemo(() => {
    return filteredLtftSummaries;
  }, [filteredLtftSummaries]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "lastModified", desc: true }
  ]);

  const columns = useMemo(() => {
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
          type="button"
          variation={
            label === "Delete" || label === "Withdraw"
              ? "destructive"
              : "warning"
          }
          size="small"
          onClick={handleBtnClick(label)}
          data-cy={`${label.toLowerCase()}LtftBtnLink`}
          style={{ minWidth: "6em", ...additionalStyle }}
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

    return [
      columnHelper.accessor("name", {
        id: "name",
        header: renderNameHeader,
        cell: renderValue
      }),
      columnHelper.accessor("lastModified", {
        id: "lastModified",
        header: renderLastModifiedHeader,
        cell: renderDayValue,
        sortingFn: "datetime",
        sortDescFirst: true
      }),
      columnHelper.accessor("formRef", {
        id: "formRef",
        header: renderFormRefHeader,
        cell: renderValue
      }),
      columnHelper.display({
        id: "status",
        header: renderStatusHeader,
        cell: renderStatusColumnValue
      }),
      columnHelper.display({
        id: "reason",
        header: renderReasonHeader,
        cell: renderReasonColumnValue
      }),
      columnHelper.display({
        id: "operations",
        cell: renderOperationColumnValue
      })
    ];
  }, [columnHelper, setAction]);

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
    statusFilters = ["APPROVED", "REJECTED", "SUBMITTED", "WITHDRAWN"];
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
                          style={{
                            width: header.getSize()
                          }}
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
                        onClick={() => handleRowClick(row.original)}
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
              onSubmit={async (reasonObj?: ReasonMsgObj) => {
                store.dispatch(updatedLtftFormsRefreshNeeded(false));
                startSubmitting();
                const shouldStartOver = await handleLtftSummaryModalSub(
                  currentAction,
                  reasonObj
                );
                stopSubmitting();
                setShowModal(false);
                if (shouldStartOver) {
                  checkPush("ltft", "formsList");
                }
                resetAction();
              }}
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
                resetAction();
              }}
              cancelBtnText="Cancel"
              warningLabel={currentAction.type as ActionType}
              warningText={currentAction.warningText}
              submittingBtnText={currentAction.submittingText}
              actionType={currentAction.type as ActionType}
              isSubmitting={isSubmitting}
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
