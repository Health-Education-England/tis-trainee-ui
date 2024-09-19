import { forwardRef, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  setCurrentGmcNumber,
  resetGmcEdit
} from "../../../redux/slices/gmcEditSlice";
import ScrollToTop from "../../common/ScrollToTop";
import { useIsMobile } from "../../../utilities/hooks/useIsMobile";
import Draggable from "react-draggable";
import { ExpanderMsg } from "../../common/ExpanderMsg";
import { Fieldset } from "nhsuk-react-components";
import { GmcForm, GmcFormValues } from "./GmcForm";
import store from "../../../redux/store/store";
import { TraineeProfileService } from "../../../services/TraineeProfileService";

function handleClose() {
  store.dispatch(resetGmcEdit());
}

export function Gmc() {
  const componentRef = useRef();
  const [shouldPrint, setShouldPrint] = useState(false);

  return (
    <>
      <GmcChild ref={componentRef} setShouldPrint={setShouldPrint} />
    </>
  );
}

type GmcChildProps = {
  setShouldPrint: (shouldPrint: boolean) => void;
};

const GmcChild = forwardRef(
  ({ setShouldPrint }: Readonly<GmcChildProps>, ref) => {
    const dispatch = useAppDispatch();
    const defaultYPosition = useAppSelector(
      state => state.gmcEdit.dialogYPosition
    );
    const modalState = useAppSelector(state => state.gmcEdit.modalOpen);
    const currentGmcNumber = useAppSelector(
      state => state.gmcEdit.currentGmcNumber
    );
    const isMobile = useIsMobile(1024);

    const handleCalculate = (values: GmcFormValues) => {
        //TODO: is this the right place? and need to pass response back from api to refresh state
        const tps = new TraineeProfileService;
      tps.updateGmc(values.gmcNumber);
      dispatch(setCurrentGmcNumber(values.gmcNumber));
    };

    const dialogContent = (
      <dialog
        open={modalState}
        onClose={handleClose}
        className={isMobile ? "gmc-dialog" : "gmc-dialog draggable"}
        ref={ref as React.RefObject<HTMLDialogElement>}
      >
        {isMobile && <ScrollToTop errors={[]} page={0} isPageDirty={false} />}
        <Fieldset>
          <GmcHeader />
        </Fieldset>
        <span className="not-draggable no-move">
          <GmcForm
            currentGmcNumber={currentGmcNumber}
            onCalculate={handleCalculate}
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
GmcChild.displayName = "GmcChild"; // need a display name for linting purposes (forwardRef creates a new comp with no display name)

function GmcHeader() {
  return (
    <Fieldset.Legend
      size="m"
      data-cy="gmc-header"
    >{`GMC Number`}</Fieldset.Legend>
  );
}
