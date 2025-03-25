import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { useParams } from "react-router-dom";
import {
  loadSavedLtft,
  LtftObj,
  updatedLtftSaveStatus
} from "../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { Form as FormType, FormName } from "../form-builder/FormBuilder";
import ltftJson from "./ltft.json";
import FormViewBuilder from "../form-builder/FormViewBuilder";
import { useEffect, useState } from "react";
import {
  BackLink,
  Button,
  Col,
  Container,
  Row,
  SummaryList,
  WarningCallout
} from "nhsuk-react-components";
import Declarations from "../form-builder/Declarations";
import { CctCalcSummaryDetails } from "../cct/CctCalcSummary";
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
import dayjs from "dayjs";
import { ActionModal } from "../../common/ActionModal";
import { useActionState } from "../../../utilities/hooks/useActionState";

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
  const { startSubmitting, stopSubmitting, isSubmitting } = useSubmitting();
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

  const handleSubClick = async (values: { name: string }) => {
    setAction("Submit");
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
    setShowModal(false);
    startSubmitting();
    await saveDraftForm(formJson, formData, false, true);
    stopSubmitting();
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
        {!canEditStatus && (
          <>
            <h2>Submitted application</h2>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>Name</SummaryList.Key>
                <SummaryList.Value data-cy="ltftName">
                  {formData.name}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Created</SummaryList.Key>
                <SummaryList.Value data-cy="ltftCreated">
                  {dayjs(formData.created).toString()}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Submitted</SummaryList.Key>
                <SummaryList.Value data-cy="ltftSubmitted">
                  {dayjs(formData.lastModified).toString()}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          </>
        )}
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
                      {isSubmitting ? "Saving..." : "Submit"}
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
              <Col width="one-quarter">
                <StartOverButton
                  formName={formJson.name}
                  btnLocation="formView"
                />
              </Col>
            </Row>
          </Container>
        )}
        <ActionModal
          onSubmit={handleModalFormSubmit}
          isOpen={showModal}
          onClose={handleModalFormClose}
          cancelBtnText="Cancel"
          warningLabel="Important"
          warningText={currentAction.warningText}
          submittingBtnText={currentAction.submittingText}
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
      <BackLink
        className="back-link"
        data-cy="backLink-to-ltft-home"
        onClick={() => history.push("/ltft")}
      >
        Back to Changing hours (LTFT) Home
      </BackLink>
      {children}
    </>
  );
}
