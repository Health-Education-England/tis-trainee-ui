import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { useParams } from "react-router-dom";
import {
  loadSavedLtft,
  updatedLtftSaveStatus
} from "../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { Form as FormType, FormName } from "../form-builder/FormBuilder";
import ltftJson from "./ltft.json";
import FormViewBuilder from "../form-builder/FormViewBuilder";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  WarningCallout
} from "nhsuk-react-components";
import Declarations from "../Declarations";
import { CctCalcSummaryDetails } from "../cct/CctCalcSummaryDetails";
import { StartOverButton } from "../StartOverButton";
import { CctCalculation } from "../../../redux/slices/cctSlice";
import { saveDraftForm } from "../../../utilities/FormBuilderUtilities";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import store from "../../../redux/store/store";
import TextInputField from "../TextInputField";
import { Form, Formik } from "formik";
import history from "../../navigation/history";
import Loading from "../../common/Loading";
import ErrorPage from "../../common/ErrorPage";
import { ActionModal } from "../../common/ActionModal";
import { useActionState } from "../../../utilities/hooks/useActionState";
import ScrollToTop from "../../common/ScrollToTop";
import { LtftStatusDetails } from "./LtftStatusDetails";
import { downloadLtftPdf } from "../../../utilities/FileUtilities";
import InfoTooltip from "../../common/InfoTooltip";
import { LtftObj } from "../../../models/LtftTypes";
import FormBackLink from "../../common/FormBackLink";

export const LtftFormView = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { currentAction, setAction, resetAction } = useActionState();

  useEffect(() => {
    if (id) {
      dispatch(loadSavedLtft(id));
    }
  }, [id, dispatch]);

  const ltftStatus = useAppSelector(state => state.ltft.status);
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();
  const formData = useSelectFormData(ltftJson.name as FormName) as LtftObj;
  const canEditStatus = useAppSelector(state => state.ltft.canEdit);
  const cctSnapshot: CctCalculation = {
    cctDate: formData?.change?.cctDate,
    programmeMembership: formData?.programmeMembership,
    changes: [formData?.change]
  };
  const formJson = ltftJson as FormType;
  const [canSubmit, setCanSubmit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const ltftFormStatus = formData?.status?.current?.state;

  const handleSubClick = async (values: { name: string }) => {
    setAction("Submit", "", formJson.name);
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
    resetAction();
    stopSubmitting();
  };

  const handleModalFormSubmit = async () => {
    startSubmitting();
    await saveDraftForm(formJson, formData, false, true);
    stopSubmitting();
    setShowModal(false);
    resetAction();
  };

  if (ltftStatus === "loading") return <Loading />;

  if (ltftStatus === "failed") {
    return (
      <LtftViewWrapper>
        <ErrorPage message="There was a problem loading your application." />
      </LtftViewWrapper>
    );
  }

  if (ltftStatus === "succeeded" || canEditStatus)
    return (
      <LtftViewWrapper>
        <Button
          data-cy="savePdfBtn"
          disabled={!formData.id}
          onClick={() => {
            downloadLtftPdf(formData.id ?? "");
          }}
        >
          Save a copy as a PDF
        </Button>
        {!formData.id ? (
          <>
            &nbsp;
            <InfoTooltip
              tooltipId={"pdfButtonInfo"}
              content="Please save before downloading the PDF."
            />
          </>
        ) : null}
        <LtftStatusDetails {...formData}></LtftStatusDetails>
        <CctCalcSummaryDetails
          viewedCalc={cctSnapshot}
          ltftFormStatus={ltftFormStatus}
        />
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
            formDeclarations={formJson.declarations}
          />
          {canEditStatus && (
            <Formik
              initialValues={{ name: formData.name ?? "" }}
              onSubmit={handleSubClick}
            >
              {({ values }) => {
                return (
                  <Form>
                    <TextInputField
                      name="name"
                      id="ltftName"
                      label="Please give your Changing hours (LTFT) application a name"
                      placeholder="Type name here..."
                      width="300px"
                      readOnly={!canEditStatus}
                    />

                    <Button
                      type="submit"
                      disabled={
                        !values.name.trim() || !canSubmit || isSubmitting
                      }
                      data-cy="BtnSubmit"
                    >
                      {(() => {
                        if (isSubmitting) return "Saving...";
                        if (formData.status?.current?.state === "UNSUBMITTED")
                          return "Re-submit";
                        return "Submit";
                      })()}
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          )}
        </WarningCallout>
        {canEditStatus && (
          <Container>
            <Row>
              <Col width="one-quarter">
                <Button
                  secondary
                  onClick={async () => {
                    startSubmitting();
                    await saveDraftForm(formJson, formData);
                    stopSubmitting();
                  }}
                  disabled={isSubmitting}
                  data-cy="BtnSaveDraft"
                >
                  {"Save & exit"}
                </Button>
              </Col>
              {formData.status.current.state != "UNSUBMITTED" ? (
                <Col width="one-quarter">
                  <StartOverButton
                    formName={formJson.name}
                    btnLocation="formView"
                  />
                </Col>
              ) : null}
            </Row>
          </Container>
        )}
        <ActionModal
          onSubmit={handleModalFormSubmit}
          isOpen={showModal}
          onClose={handleModalFormClose}
          cancelBtnText="Cancel"
          warningLabel={currentAction.type ?? ""}
          warningText={currentAction.warningText}
          submittingBtnText={currentAction.submittingText}
          isSubmitting={isSubmitting}
        />
      </LtftViewWrapper>
    );
  return null;
};

function LtftViewWrapper({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ScrollToTop />
      <FormBackLink
        history={history}
        path="/ltft"
        dataCy="backLink-to-ltft-home"
        text="Back to Changing hours (LTFT) Home"
      />
      {children}
    </>
  );
}
