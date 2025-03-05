import { useAppSelector } from "../../../redux/hooks/hooks";
import { Redirect } from "react-router-dom";
import { LtftObj } from "../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { Form, FormName } from "../form-builder/FormBuilder";
import ltftJson from "./ltft.json";
import FormViewBuilder from "../form-builder/FormViewBuilder";
import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  WarningCallout
} from "nhsuk-react-components";
import Declarations from "../form-builder/Declarations";
import { CctCalcSummaryDetails } from "../cct/CctCalcSummary";
import { StartOverButton } from "../StartOverButton";
import { CctCalculation } from "../../../redux/slices/cctSlice";
import { LtftNameModal } from "./LtftNameModal";
import { saveDraftForm } from "../../../utilities/FormBuilderUtilities";

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
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubClick = () => {
    setShowModal(true);
  };

  const handleModalFormClose = () => {
    setShowModal(false);
    setIsSubmitting(false);
  };

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
          {canEditStatus && (
            <Button
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                setIsSubmitting(true);
                handleSubClick();
              }}
              disabled={!canSubmit || isSubmitting}
              data-cy="BtnSubmit"
            >
              Submit Form
            </Button>
          )}
        </form>
      </WarningCallout>
      <Container>
        <Row>
          <Col width="one-quarter">
            <Button
              secondary
              onClick={async (e: { preventDefault: () => void }) => {
                setIsSubmitting(true);
                await saveDraftForm(
                  formJson,
                  formData as LtftObj,
                  false,
                  false
                );
                setIsSubmitting(false);
              }}
              disabled={isSubmitting}
              data-cy="BtnSaveDraft"
            >
              {"Save & exit"}
            </Button>
          </Col>
          <Col width="one-quarter">
            <StartOverButton formName={formJson.name} btnLocation="formView" />
          </Col>
        </Row>
      </Container>
      <LtftNameModal isOpen={showModal} onClose={handleModalFormClose} />
    </>
  ) : (
    <Redirect to={redirectPath} />
  );
};
