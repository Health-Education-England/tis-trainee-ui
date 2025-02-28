import { useAppSelector } from "../../../redux/hooks/hooks";
import { Redirect } from "react-router-dom";
import { LtftObj } from "../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { Form, FormName } from "../form-builder/FormBuilder";
import ltftJson from "./ltft.json";
import FormViewBuilder from "../form-builder/FormViewBuilder";
import { useState } from "react";
import { Col, Container, Row, WarningCallout } from "nhsuk-react-components";
import Declarations from "../form-builder/Declarations";
import { CctCalcSummaryDetails } from "../cct/CctCalcSummary";
import { StartOverButton } from "../StartOverButton";
import { CctCalculation } from "../../../redux/slices/cctSlice";

export const LtftFormView = () => {
  const formData = useSelectFormData(ltftJson.name as FormName) as LtftObj;
  const canEditStatus = useAppSelector(state => state.ltft.canEdit);
  const cctSnapshot: CctCalculation = {
    cctDate: formData?.change?.cctDate,
    programmeMembership: formData?.programmeMembership,
    changes: [formData?.change]
  };
  const formJson = ltftJson as Form;
  const redirectPath = "/ltft";
  const [canSubmit, setCanSubmit] = useState(false);
  return formData?.traineeTisId ? (
    <>
      <CctCalcSummaryDetails viewedCalc={cctSnapshot} />
      <FormViewBuilder
        jsonForm={formJson}
        formData={formData}
        canEdit={canEditStatus}
        formErrors={{}}
      />
      <WarningCallout>
        <WarningCallout.Label>Declarations</WarningCallout.Label>
        <form>
          <Declarations
            setCanSubmit={setCanSubmit}
            canEdit={canEditStatus}
            formJson={formJson}
          />
        </form>
      </WarningCallout>
      {/* Btns to go here: submit (to open modal), save & exit, start over */}
      <Container>
        <Row>
          <Col width="one-quarter">
            <StartOverButton formName={formJson.name} isFormButton={true} />
          </Col>
        </Row>
      </Container>
      {/* Modal to name the form etc. to go here */}
    </>
  ) : (
    <Redirect to={redirectPath} />
  );
};
