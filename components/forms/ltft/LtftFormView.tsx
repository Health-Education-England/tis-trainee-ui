import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { useParams } from "react-router-dom";
import {
  loadSavedLtft,
  updatedLtft,
  updatedLtftSaveStatus
} from "../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { Form as FormType, FormName } from "../form-builder/FormBuilder";
import ltftJson from "./ltft.json";
import FormViewBuilder from "../form-builder/FormViewBuilder";
import { ReactNode, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  InsetText,
  Row,
  SummaryList,
  WarningCallout
} from "nhsuk-react-components";
import Declarations from "../Declarations";
import { StartOverButton } from "../StartOverButton";
import {
  computedValueGenerators,
  isDateWithin16WeeksOfFirstDate,
  saveDraftForm,
  setEditPageNumber,
  validateFields
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
import { ltft16WeeksWarningTextSubmitted } from "../../../utilities/Constants";
import {
  clearStartDateSection,
  findLatestSubmissionDate,
  hasLegacyStartDateData,
  stampLtftStartDateOnSubmit
} from "../../../utilities/ltftUtilities";
import history from "../../navigation/history";
import { ltftValidationSchema } from "./ltftValidationSchema";

const START_DATE_PAGE_NAME = "Start date";

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
  const [showLegacyStartDateModal, setShowLegacyStartDateModal] =
    useState(false);

  const hasLegacyStartDate = hasLegacyStartDateData(formData);
  const startDatePageIndex = formJson.pages.findIndex(
    page => page.pageName === START_DATE_PAGE_NAME
  );

  useEffect(() => {
    if (id) {
      dispatch(loadSavedLtft(id));
    }
  }, [id, dispatch]);

  const isStartDateSectionValid = useStartDateSectionValidity(
    formJson,
    startDatePageIndex,
    formData
  );

  // Note: a legacy application can be re-submitted with its original start date details (e.g. startDate <16wks; altStartDate) untouched, so it is exempt from the 'new page' validation.
  const isStartDateSectionSubmittable =
    hasLegacyStartDate || isStartDateSectionValid;

  const goToStartDatePage = () => {
    setEditPageNumber(formJson.name, startDatePageIndex);
    history.push({
      pathname: "/ltft/create",
      state: { fieldName: "canGiveCompliantStartDate" }
    });
  };

  const handleLegacyStartDateEditConfirm = () => {
    dispatch(updatedLtft(clearStartDateSection(formData)));
    setShowLegacyStartDateModal(false);
    goToStartDatePage();
  };

  let startDatePageNotice: ReactNode;
  if (hasLegacyStartDate) {
    startDatePageNotice = (
      <LegacyStartDateNotice
        canEdit={canEditStatus}
        onEditClick={() => setShowLegacyStartDateModal(true)}
      />
    );
  } else if (canEditStatus && !isStartDateSectionValid) {
    startDatePageNotice = (
      <IncompleteStartDateNotice onCompleteClick={goToStartDatePage} />
    );
  }

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
    await saveDraftForm(
      formJson,
      stampLtftStartDateOnSubmit(formData),
      false,
      true
    );
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
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <Button
            data-cy="savePdfBtn"
            disabled={!formData.id}
            onClick={() => {
              downloadLtftPdf(formData.id ?? "");
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
          pageNotices={
            startDatePageNotice
              ? { [START_DATE_PAGE_NAME]: startDatePageNotice }
              : undefined
          }
        />
        <LtftChangeSummaryCard
          formData={formData}
          hasLegacyStartDate={hasLegacyStartDate}
        />
        <WarningCallout>
          <WarningCallout.Heading>Declarations</WarningCallout.Heading>

          <Declarations
            setCanSubmit={setCanSubmit}
            canEdit={canEditStatus}
            formDeclarations={formJson.declarations}
          />
          {canEditStatus && (
            <LtftPreSubForm
              initialName={formData.name ?? ""}
              currentState={formData.status?.current?.state}
              isSubmitting={isSubmitting}
              canSubmit={canSubmit}
              isStartDateSectionSubmittable={isStartDateSectionSubmittable}
              onSubmit={handleSubClick}
            />
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
        <ActionModal
          onSubmit={handleLegacyStartDateEditConfirm}
          isOpen={showLegacyStartDateModal}
          onClose={() => setShowLegacyStartDateModal(false)}
          cancelBtnText="Cancel"
          warningLabel="Start date process updated"
          warningText="Editing the start date section will clear the start date details you gave under the previous process. You'll need to complete this section again in the updated format."
          submittingBtnText=""
          isSubmitting={false}
        />
      </LtftViewWrapper>
    );
  return null;
};

// Note: This check is to make sure a legacy start date page reset can't be left incomplete
function useStartDateSectionValidity(
  formJson: FormType,
  startDatePageIndex: number,
  formData: LtftObjNew
) {
  const [isStartDateSectionValid, setIsStartDateSectionValid] = useState(true);

  useEffect(() => {
    const startDateFields = formJson.pages[startDatePageIndex].sections.flatMap(
      section => section.fields
    );
    validateFields(startDateFields, formData, ltftValidationSchema)
      .then(() => setIsStartDateSectionValid(true))
      .catch(() => setIsStartDateSectionValid(false));
  }, [formData, formJson, startDatePageIndex]);

  return isStartDateSectionValid;
}

function LegacyStartDateNotice({
  canEdit,
  onEditClick
}: Readonly<{ canEdit: boolean; onEditClick: () => void }>) {
  return (
    <InsetText data-cy="legacyStartDateNote">
      {canEdit ? (
        <>
          <p>
            This application was started under the previous start date process
            and is now handled differently. To change any start date details,
            you&apos;ll need to complete the start date section again in the
            updated format. Your originally submitted dates are shown in the
            summary below.
          </p>
          <Button
            type="button"
            data-cy="updateLegacyStartDate"
            onClick={onEditClick}
          >
            Update start date section
          </Button>
        </>
      ) : (
        <p>
          This application was submitted under the previous start date process.
          The start dates are shown in the summary below.
        </p>
      )}
    </InsetText>
  );
}

function IncompleteStartDateNotice({
  onCompleteClick
}: Readonly<{ onCompleteClick: () => void }>) {
  return (
    <InsetText data-cy="incompleteStartDateNote">
      <p>
        The start date section is incomplete. You need to complete it before you
        can submit this application.
      </p>
      <Button
        type="button"
        data-cy="completeStartDateSection"
        onClick={onCompleteClick}
      >
        Complete start date section
      </Button>
    </InsetText>
  );
}

function LtftChangeSummaryCard({
  formData,
  hasLegacyStartDate
}: Readonly<{ formData: LtftObjNew; hasLegacyStartDate: boolean }>) {
  return (
    <Card style={{ border: "4px #005eb8 solid" }}>
      <Card.Heading data-cy="completionDateChangeHeading">
        Summary of changes to your {formData.pmName} Programme
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
          <SummaryList.Key data-cy="completionDateChangeCurrentCompletionDateKey">
            Current completion date
          </SummaryList.Key>
          <SummaryList.Value data-cy="completionDateChangeCurrentCompletionDateValue">
            {dayjs(formData.pmEndDate).format("DD/MM/YYYY")} (Programme end date
            on TIS)
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
            LTFT Start date
          </SummaryList.Key>
          <SummaryList.Value data-cy="completionDateChangeStartDateValue">
            <StartDateSummaryValue
              formData={formData}
              hasLegacyStartDate={hasLegacyStartDate}
            />
          </SummaryList.Value>
        </SummaryList.Row>
        {formData.altStartDate && (
          <SummaryList.Row>
            <SummaryList.Key data-cy="altStartDateKey">
              Alternative start date
            </SummaryList.Key>
            <SummaryList.Value data-cy="altStartDateValue">
              {dayjs(formData.altStartDate).format("DD/MM/YYYY")}
            </SummaryList.Value>
          </SummaryList.Row>
        )}
      </SummaryList>
      <CompletionDateChangeText
        wteBeforeChange={formData.wteBeforeChange}
        wte={formData.wte}
      />
    </Card>
  );
}

function StartDateSummaryValue({
  formData,
  hasLegacyStartDate
}: Readonly<{ formData: LtftObjNew; hasLegacyStartDate: boolean }>) {
  // Note: 16 weeks notice date that will be stamped on submission (if no compliant start date is set)
  const derivedStartDate =
    formData.canGiveCompliantStartDate === false && !formData.startDate
      ? computedValueGenerators.ltft16WeeksNoticeDate()
      : null;

  if (derivedStartDate) {
    return (
      <>
        {dayjs(derivedStartDate).format("DD/MM/YYYY")}
        {
          " (16 weeks from today - this date will be set when you submit your application)"
        }
      </>
    );
  }

  const latestSubmittedLtft = findLatestSubmissionDate(formData);
  const showWithin16WeeksWarning =
    hasLegacyStartDate &&
    !!formData.startDate &&
    !!latestSubmittedLtft &&
    isDateWithin16WeeksOfFirstDate(formData.startDate, latestSubmittedLtft);

  return (
    <>
      {formData.startDate && dayjs(formData.startDate).format("DD/MM/YYYY")}
      {showWithin16WeeksWarning && (
        <FieldWarningMsg warningMsgs={[ltft16WeeksWarningTextSubmitted]} />
      )}
    </>
  );
}

function LtftPreSubForm({
  initialName,
  currentState,
  isSubmitting,
  canSubmit,
  isStartDateSectionSubmittable,
  onSubmit
}: Readonly<{
  initialName: string;
  currentState: string | undefined;
  isSubmitting: boolean;
  canSubmit: boolean;
  isStartDateSectionSubmittable: boolean;
  onSubmit: (values: { name: string }) => Promise<void>;
}>) {
  return (
    <Formik initialValues={{ name: initialName }} onSubmit={onSubmit}>
      {({ values }) => (
        <Form>
          <TextInputField
            name="name"
            id="Name"
            label="Please give your LTFT application a name"
            placeholder="Type name here..."
            width="300px"
          />

          <Button
            type="submit"
            disabled={
              !values.name.trim() ||
              !canSubmit ||
              isSubmitting ||
              !isStartDateSectionSubmittable
            }
            data-cy="BtnSubmit"
          >
            {getSubmitBtnText(isSubmitting, currentState)}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

function getSubmitBtnText(isSubmitting: boolean, currentState?: string) {
  if (isSubmitting) return "Saving...";
  if (currentState === "UNSUBMITTED") return "Re-submit";
  return "Submit";
}

function CompletionDateChangeText({
  wteBeforeChange,
  wte
}: Readonly<{ wteBeforeChange: number | null; wte: number | null }>) {
  const isReducingHours = Number(wteBeforeChange) > Number(wte);
  const changeDirection = isReducingHours ? "Reducing" : "Increasing";
  const completionDateEffect = isReducingHours ? "extend" : "shorten";
  return (
    <>
      <p>
        {`${changeDirection} your working hours from ${wteBeforeChange}% to ${wte}% will`}{" "}
        <strong>{completionDateEffect}</strong> your programme completion date.
      </p>
      <p>Your formal completion date will be agreed at ARCP.</p>
    </>
  );
}

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
