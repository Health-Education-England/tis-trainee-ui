import { Row, Col, Button } from "nhsuk-react-components";
import { useAppSelector } from "../../../redux/hooks/hooks";
import ErrorPage from "../../common/ErrorPage";
import { CctCalcSummaryDetails } from "./CctCalcSummaryDetails";

export function CctCalcSummary() {
  const cctFormSaveStatus = useAppSelector(state => state.cct.formSaveStatus);
  const viewedCalc = useAppSelector(state => state.cct.cctCalc);

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
    </>
  );
}
