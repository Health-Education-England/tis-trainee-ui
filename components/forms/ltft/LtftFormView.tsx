import { useAppSelector } from "../../../redux/hooks/hooks";
import { Redirect } from "react-router-dom";
import {
  LtftObj,
  updatedLtftSaveStatus
} from "../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { Form as FormType, FormName } from "../form-builder/FormBuilder";
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
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import store from "../../../redux/store/store";
import TextInputField from "../TextInputField";
import { Form, Formik } from "formik";

export const LtftFormView = () => {
  const { startSubmitting, stopSubmitting, isSubmitting } = useSubmitting();
  const formData = useSelectFormData(ltftJson.name as FormName) as LtftObj;
  const canEditStatus = useAppSelector(state => state.ltft.canEdit);
  const cctSnapshot: CctCalculation = {
    cctDate: formData?.change?.cctDate,
    programmeMembership: formData?.programmeMembership,
    changes: [formData?.change]
  };
  const formJson = ltftJson as FormType;
  const redirectPath = "/ltft";
  const [canSubmit, setCanSubmit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubClick = async (values: { name: string }) => {
    const updatedDeclarations = {
      ...formData.declarations,
      informationIsCorrect: true,
      notGuaranteed: true
    };
    store.dispatch(updatedLtftSaveStatus("idle"));
    startSubmitting();
    await saveDraftForm(
      formJson,
      {
        ...formData,
        name: values.name,
        declarations: updatedDeclarations
      } as LtftObj,
      false,
      false,
      true,
      false
    );
    stopSubmitting();
    const newSaveStatus = store.getState().ltft.saveStatus;
    if (newSaveStatus === "succeeded") {
      setShowModal(true);
    }
  };

  const handleModalFormClose = () => {
    setShowModal(false);
    stopSubmitting();
  };

  const handleModalFormSubmit = async () => {
    setShowModal(false);
    startSubmitting();
    await saveDraftForm(formJson, formData as LtftObj, false, true);
    stopSubmitting();
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

        <Declarations
          setCanSubmit={setCanSubmit}
          canEdit={canEditStatus}
          formJson={formJson}
        />
        <Formik initialValues={{ name: "" }} onSubmit={handleSubClick}>
          {({ values }) => {
            return (
              <>
                <Form>
                  <TextInputField
                    name="name"
                    id="ltftName"
                    label="Please give your Changing hours (LTFT) application a name"
                    placeholder="Type name here..."
                    width="300px"
                  />
                  {canEditStatus && (
                    <Button
                      type="submit"
                      disabled={
                        !values.name.trim() || !canSubmit || isSubmitting
                      }
                      data-cy="BtnSubmit"
                    >
                      {isSubmitting ? "Saving..." : "Submit"}
                    </Button>
                  )}
                </Form>
              </>
            );
          }}
        </Formik>
      </WarningCallout>
      <Container>
        <Row>
          <Col width="one-quarter">
            <Button
              secondary
              onClick={async () => {
                startSubmitting();
                await saveDraftForm(formJson, formData as LtftObj);
                stopSubmitting();
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
      <LtftNameModal
        onSubmit={handleModalFormSubmit}
        isOpen={showModal}
        onClose={handleModalFormClose}
      />
    </>
  ) : (
    <Redirect to={redirectPath} />
  );
};
