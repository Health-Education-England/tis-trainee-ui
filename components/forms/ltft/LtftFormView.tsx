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
  Card,
  Col,
  Container,
  Row,
  SummaryList,
  WarningCallout
} from "nhsuk-react-components";
import Declarations from "../Declarations";
import { StartOverButton } from "../StartOverButton";
import {
  isDateWithin16Weeks,
  saveDraftForm
} from "../../../utilities/FormBuilderUtilities";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import TextInputField from "../TextInputField";
import { Form, Formik } from "formik";
import Loading from "../../common/Loading";
import ErrorPage from "../../common/ErrorPage";
import { ActionModal } from "../../common/ActionModal";
import { useActionState } from "../../../utilities/hooks/useActionState";
import ScrollToTop from "../../common/ScrollToTop";
import { downloadLtftPdf } from "../../../utilities/FileUtilities";
import InfoTooltip from "../../common/InfoTooltip";
import { LtftObjNew } from "../../../models/LtftTypes";
import FormBackLink from "../../common/FormBackLink";
import dayjs from "dayjs";
import FieldWarningMsg from "../FieldWarningMsg";
import { LtftStatusDetails } from "./LtftStatusDetails";
import store from "../../../redux/store/store";
import { ltft16WeeksWarningText } from "../../../utilities/Constants";

export const LtftFormView = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { currentAction, resetAction, setAction } = useActionState();

  const ltftStatus = useAppSelector(state => state.ltft.status);
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();
  const formData = useSelectFormData(ltftJson.name as FormName) as LtftObjNew;
  const canEditStatus = useAppSelector(state => state.ltft.canEdit);

  const formJson = ltftJson as FormType;
  const [canSubmit, setCanSubmit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(loadSavedLtft(id));
    }
  }, [id, dispatch]);

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
      },
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

  if (!formData.cctDate) {
    return (
      <LtftViewWrapper>
        <ErrorPage message="Please try again." />
      </LtftViewWrapper>
    );
  }

  if (ltftStatus === "succeeded" || canEditStatus)
    return (
      <LtftViewWrapper>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <Button
            data-cy="savePdfBtn"
            disabled={!formData.id}
            onClick={() => {
              // TODO: enable when BE PDF has been updated
              // downloadLtftPdf(formData.id ?? "");
              globalThis.print();
            }}
          >
            Save a copy as a PDF
          </Button>
          {!formData.id && (
            <InfoTooltip
              tooltipId={"pdfButtonInfo"}
              content="Please save before downloading the PDF."
            />
          )}
        </div>
        {formData.status?.current?.state !== "DRAFT" && (
          <LtftStatusDetails {...formData} />
        )}
        <h2 data-cy="reviewSubmitHeading">
          Review & submit your LTFT training application
        </h2>
        <FormViewBuilder
          jsonForm={formJson}
          formData={formData}
          canEdit={canEditStatus}
          formErrors={{}}
        />
        <Card style={{ border: "4px #005eb8 solid" }}>
          <Card.Content>
            <Card.Heading data-cy="completionDateChangeHeading">
              Change to your completion date for {formData.pmName}
            </Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key data-cy="completionDateChangePmKey">
                  Programme
                </SummaryList.Key>
                <SummaryList.Value data-cy="completionDateChangePmValue">
                  {formData.pmName}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key data-cy="completionDateChangeWtesKey">
                  Working hours percentage change
                </SummaryList.Key>
                <SummaryList.Value data-cy="completionDateChangeWtesValue">
                  {formData.wteBeforeChange}% → {formData.wte}%
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key data-cy="completionDateChangeStartDateKey">
                  Start date
                </SummaryList.Key>
                <SummaryList.Value data-cy="completionDateChangeStartDateValue">
                  {dayjs(formData.startDate).format("DD/MM/YYYY")}
                  {formData.startDate &&
                    isDateWithin16Weeks(formData.startDate) && (
                      <FieldWarningMsg warningMsgs={[ltft16WeeksWarningText]} />
                    )}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key data-cy="completionDateChangeCurrentCompletionDateKey">
                  Current completion date
                </SummaryList.Key>
                <SummaryList.Value data-cy="completionDateChangeCurrentCompletionDateValue">
                  {dayjs(formData.pmEndDate).format("DD/MM/YYYY")} (Programme
                  end date on TIS)
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key data-cy="completionDateChangeEstimatedCompletionDateKey">
                  <strong>Estimated completion date after these changes</strong>
                </SummaryList.Key>
                <SummaryList.Value data-cy="completionDateChangeEstimatedCompletionDateValue">
                  <strong style={{ color: "#007f3b" }}>
                    {dayjs(formData.cctDate).format("DD/MM/YYYY")}
                  </strong>
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
            <p style={{ marginTop: "1rem" }} data-cy="completionDateChangeNote">
              <strong>Please note:</strong> This new completion date is an
              estimate as it does not take into account your full circumstances
              (e.g. Out of Programme, Parental Leave). Your formal completion
              date will be agreed at ARCP.
            </p>
          </Card.Content>
        </Card>
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
                      id="Name"
                      label="Please give your Less Than Full Time application a name"
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
              {formData.status.current.state === "DRAFT" ? (
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
          additionalInfo={currentAction.additionalInfo}
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
      <FormBackLink text="Back to LTFT Home" />
      {children}
    </>
  );
}
