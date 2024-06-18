import { forwardRef, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { setNewEndDates } from "../../../redux/slices/cctCalcSlice";
import ScrollToTop from "../../common/ScrollToTop";
import { useIsMobile } from "../../../utilities/hooks/useIsMobile";
import Draggable, {
  DraggableData,
  DraggableEventHandler
} from "react-draggable";
import { ExpanderMsg } from "../../common/ExpanderMsg";
import { Fieldset } from "nhsuk-react-components";
import { CalcForm, CalcFormValues } from "./CalcForm";
import {
  calculateNewEndDates,
  handleClose
} from "../../../utilities/CctUtilities";

export function Cct() {
  const componentRef = useRef();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [shouldPrint, setShouldPrint] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current as unknown as HTMLElement
  });

  useEffect(() => {
    if (shouldPrint) {
      handlePrint();
      setShouldPrint(false);
    }
  }, [shouldPrint, handlePrint]);

  const handlePrintAndResetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setShouldPrint(true);
  };
  const handleDrag = (_e: React.MouseEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <CctChild
      ref={componentRef}
      handlePrint={handlePrintAndResetPosition}
      position={position}
      handleDrag={handleDrag}
    />
  );
}

type CctChildProps = {
  handlePrint: () => void;
  position: { x: number; y: number };
  handleDrag: (e: React.MouseEvent, data: DraggableData) => void;
};

const CctChild = forwardRef(
  ({ handlePrint, position, handleDrag }: Readonly<CctChildProps>, ref) => {
    const dispatch = useAppDispatch();
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
        Number(values.currentFtePercent.split("%")[0]),
        values.ftePercents,
        values.propStartDate,
        values.propEndDate,
        currentProgEndDate
      );
      dispatch(setNewEndDates(calculatedEndDates));
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
          <Fieldset.Legend
            size="m"
            data-cy="cct-header"
          >{`CCT Calculator`}</Fieldset.Legend>
          <p id="cct-disclaimer-text" data-cy="cct-disclaimer">
            <b>
              This calculator is intended to provide a quick rough estimate
              only.
              <br />
              It does not factor in Time out of Training, statutory leave or a
              period of OOP.
              <br />
              Your actual CCT date will be confirmed at your next ARCP.
            </b>
          </p>
          <ExpanderMsg expanderName="cctInfo" />

          <p data-cy="cct-curr-prog">
            <b> {`Programme: `}</b> {progName}
          </p>
          <p data-cy="cct-curr-prog-end">
            <b>{`Current Programme end date: `}</b>
            {dayjs(currentProgEndDate).format("DD/MM/YYYY")}
          </p>
          {newEndDates.length > 0 && (
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
          )}
        </Fieldset>
        <span className="not-draggable no-move">
          <CalcForm
            currentProgEndDate={currentProgEndDate}
            propStartDate={proposeStartDate}
            onCalculate={handleCalculate}
            newEndDates={newEndDates}
            handlePrint={handlePrint}
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
            position={position}
            onStop={handleDrag as DraggableEventHandler}
            cancel=".not-draggable"
            bounds="parent"
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
