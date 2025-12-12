import { useState } from "react";
import { Button, Row, Col } from "nhsuk-react-components";
import history from "../../navigation/history";
import { CctNameModal } from "./CctNameModal";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import { handleCctSubmit } from "../../../utilities/CctUtilities";
import ErrorPage from "../../common/ErrorPage";
import { updatedFormSaveStatus } from "../../../redux/slices/cctSlice";
import { CctCalcSummaryDetails } from "./CctCalcSummaryDetails";

export function CctCalcSummary() {
  const dispatch = useAppDispatch();
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();
  const [showCctNameModal, setShowCctNameModal] = useState(false);
  const handleProgModalClose = () => {
    setShowCctNameModal(false);
  };
  const cctFormSaveStatus = useAppSelector(state => state.cct.formSaveStatus);
  const newCalcMade = useAppSelector(state => state.cct.newCalcMade);
  const viewedCalc = useAppSelector(state => state.cct.cctCalc);

  const handleSave = () => {
    dispatch(updatedFormSaveStatus("idle"));
    if (viewedCalc?.id) {
      handleCctSubmit(startSubmitting, stopSubmitting, viewedCalc);
    } else {
      setShowCctNameModal(true);
    }
  };

  return (
    <>
      <CctCalcSummaryDetails viewedCalc={viewedCalc} />
      <Row>
        <Col width="full">
          {cctFormSaveStatus === "failed" && (
            <ErrorPage message="There was a problem saving your calculation. Please try again." />
          )}
        </Col>
      </Row>
      <Row>
        {newCalcMade && (
          <Col width="one-third">
            <Button
              type="button"
              onClick={handleSave}
              data-cy="cct-save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Col>
        )}
        <Col width="one-third">
          <Button
            secondary
            type="button"
            onClick={() => {
              dispatch(updatedFormSaveStatus("idle"));
              history.push("/cct/create");
            }}
            data-cy="cct-edit-btn"
          >
            Edit calculation
          </Button>
        </Col>
        <Col width="one-third">
          <Button
            reverse
            type="button"
            onClick={() => globalThis.print()}
            data-cy="cct-save-pdf-btn"
          >
            Save PDF
          </Button>
        </Col>
      </Row>
      <CctNameModal
        isOpen={showCctNameModal}
        onClose={handleProgModalClose}
        viewedCalc={viewedCalc}
      />
    </>
  );
}
