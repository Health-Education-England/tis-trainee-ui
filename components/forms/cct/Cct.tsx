import { forwardRef, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  setCurrentWte,
  setNewEndDates,
  setPropEndDate
} from "../../../redux/slices/cctCalcSlice";
import ScrollToTop from "../../common/ScrollToTop";
import { useIsMobile } from "../../../utilities/hooks/useIsMobile";
import Draggable from "react-draggable";
import { ExpanderMsg } from "../../common/ExpanderMsg";
import { Fieldset } from "nhsuk-react-components";
import { CalcForm, CalcFormValues } from "./CalcForm";
import {
  NewEndDatesTypes,
  calculateNewEndDates,
  handleClose
} from "../../../utilities/CctUtilities";
import { PrintableCct } from "./PrintableCct";

export function Cct() {
  const componentRef = useRef();
  const printRef = useRef();
  const [shouldPrint, setShouldPrint] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => printRef.current as unknown as HTMLElement
  });

  useEffect(() => {
    if (shouldPrint) {
      handlePrint();
      setShouldPrint(false);
    }
  }, [shouldPrint, handlePrint]);

  return (
    <>
      <CctChild ref={componentRef} setShouldPrint={setShouldPrint} />
      {shouldPrint && <PrintableCct ref={printRef} />}
    </>
  );
}

type CctChildProps = {
  setShouldPrint: (shouldPrint: boolean) => void;
};

const CctChild = forwardRef(
  ({ setShouldPrint }: Readonly<CctChildProps>, ref) => {
    const dispatch = useAppDispatch();
    const defaultYPosition = useAppSelector(
      state => state.cctCalc.dialogYPosition
    );
    const modalState = useAppSelector(state => state.cctCalc.modalOpen);
    const currentProgEndDate = useAppSelector(
      state => state.cctCalc.currentProgEndDate
    );
    const proposeStartDate = useAppSelector(
      state => state.cctCalc.propStartDate
    );
    const progName = useAppSelector(state => state.cctCalc.progName);
    const newEndDates = useAppSelector(state => state.cctCalc.newEndDates);
    const isMobile = useIsMobile(1024);

    const handleCalculate = (values: CalcFormValues) => {
      const calculatedEndDates = calculateNewEndDates(
        values.currentFtePercent as number,
        values.ftePercents,
        values.propStartDate,
        values.propEndDate,
        currentProgEndDate
      );
      dispatch(setNewEndDates(calculatedEndDates));
      dispatch(setPropEndDate(values.propEndDate));
      dispatch(setCurrentWte(values.currentFtePercent as number));
    };

    const dialogContent = (
      <dialog
        open={modalState}
        onClose={handleClose}
        className={isMobile ? "cct-dialog" : "cct-dialog draggable"}
        ref={ref as React.RefObject<HTMLDialogElement>}
      >
        {isMobile && <ScrollToTop errors={[]} page={0} isPageDirty={false} />}
        <Fieldset>
          <CctHeader />
          <DisclaimerTxt />
          <ExpanderMsg expanderName="cctInfo" />
          <CurrentProgInfo
            progName={progName}
            currentProgEndDate={currentProgEndDate}
          />
          {newEndDates.length > 0 && (
            <NewWteAndDateTable newEndDates={newEndDates} />
          )}
        </Fieldset>
        <span className="not-draggable no-move">
          <CalcForm
            currentProgEndDate={currentProgEndDate}
            propStartDate={proposeStartDate}
            onCalculate={handleCalculate}
            newEndDates={newEndDates}
            setShouldPrint={setShouldPrint}
          />
        </span>
      </dialog>
    );

    let content;
    if (modalState) {
      if (isMobile) {
        content = dialogContent;
      } else {
        content = (
          <Draggable
            cancel=".not-draggable"
            bounds="parent"
            defaultPosition={{ x: 0, y: defaultYPosition }}
          >
            {dialogContent}
          </Draggable>
        );
      }
    } else {
      content = null;
    }

    return content;
  }
);
CctChild.displayName = "CctChild"; // need a display name for linting purposes (forwardRef creates a new comp with no display name)

export function DisclaimerTxt() {
  return (
    <p id="cct-disclaimer-text" data-cy="cct-disclaimer">
      <b>
        This calculator is intended to provide a quick rough estimate only.
        <br />
        It does not factor in Time out of Training, statutory leave or a period
        of OOP.
        <br />
        Your actual CCT date will be confirmed at your next ARCP.
      </b>
    </p>
  );
}

function CctHeader() {
  return (
    <Fieldset.Legend
      size="m"
      data-cy="cct-header"
    >{`CCT Calculator`}</Fieldset.Legend>
  );
}

export type CurrentProgInfoProps = {
  progName: string;
  currentProgEndDate: string;
  currentWte?: number;
};

export function CurrentProgInfo({
  progName,
  currentProgEndDate,
  currentWte
}: Readonly<CurrentProgInfoProps>) {
  return (
    <div>
      <p data-cy="cct-curr-prog">
        <b> {`Programme: `}</b> {progName}
      </p>
      <p data-cy="cct-curr-prog-end">
        <b>{`Current Programme end date: `}</b>
        {dayjs(currentProgEndDate).format("DD/MM/YYYY")}
      </p>
      {currentWte && (
        <p data-cy="cct-curr-wte">
          <b>{`Current WTE: `}</b>
          {`${currentWte}%`}
        </p>
      )}
    </div>
  );
}

export type NewEndDateTableProps = {
  newEndDates: NewEndDatesTypes[];
};

export function NewWteAndDateTable({
  newEndDates
}: Readonly<NewEndDateTableProps>) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th data-cy="cct-th-wte">New WTE</th>
            <th data-cy="cct-th-new-date">New End Date</th>
          </tr>
        </thead>
        <tbody>
          {newEndDates.map(
            (item: { ftePercent: string; newEndDate: string }) => (
              <tr key={item.ftePercent}>
                <td data-cy="cct-td-new-percent">{item.ftePercent}</td>
                <td data-cy="cct-td-new-date">{item.newEndDate}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
