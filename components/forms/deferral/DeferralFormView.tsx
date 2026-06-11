import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  SummaryList,
  WarningCallout
} from "nhsuk-react-components";
import { Form, Formik } from "formik";
import dayjs from "dayjs";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { Form as FormType, FormName } from "../form-builder/FormBuilder";
import FormViewBuilder from "../form-builder/FormViewBuilder";
import Declarations from "../Declarations";
import TextInputField from "../TextInputField";
import { StartOverButton } from "../StartOverButton";
import { saveDraftForm } from "../../../utilities/FormBuilderUtilities";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import ScrollToTop from "../../common/ScrollToTop";
import ErrorPage from "../../common/ErrorPage";
import FormBackLink from "../../common/FormBackLink";
import store from "../../../redux/store/store";
import { updatedDeferralSaveStatus } from "../../../redux/slices/deferralSlice";
import { DeferralObj } from "../../../models/DeferralTypes";
import {
  deferralOver12MonthsWarning,
  isDeferralOver12Months
} from "../../../utilities/deferralUtilities";
import FieldWarningMsg from "../FieldWarningMsg";
import deferralJson from "./deferral.json";

const formatDate = (value: Date | string | null) =>
  value ? dayjs(value).format("DD/MM/YYYY") : "Not provided";

export const DeferralFormView = () => {
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();
  const formData = useSelectFormData(
    deferralJson.name as FormName
  ) as DeferralObj;
  const canEdit = useAppSelector(state => state.deferral.canEdit);
  const formJson = deferralJson as FormType;

  const [canSubmit, setCanSubmit] = useState(false);

  if (!formData?.traineeTisId) {
    return (
      <DeferralViewWrapper>
        <ErrorPage message="There was a problem loading your deferral application." />
      </DeferralViewWrapper>
    );
  }

  const handleSubmit = async (values: { name: string }) => {
    store.dispatch(updatedDeferralSaveStatus("idle"));
    startSubmitting();
    await saveDraftForm(
      formJson,
      {
        ...formData,
        name: values.name,
        declarations: {
          ...formData.declarations,
          informationIsCorrect: true,
          notGuaranteed: true
        }
      },
      false,
      true
    );
    stopSubmitting();
  };

  const reasonSummary =
    formData.reasonSelected === "other reason" && formData.reasonOtherDetail
      ? `Other: ${formData.reasonOtherDetail}`
      : formData.reasonSelected || "Not provided";
  const isOver12Months = isDeferralOver12Months(
    formData.pmStartDate,
    formData.newStartDate
  );

  return (
    <DeferralViewWrapper>
      <h2 data-cy="reviewSubmitHeading">
        Review &amp; submit your deferral application
      </h2>
      <FormViewBuilder
        jsonForm={formJson}
        formData={formData}
        canEdit={canEdit}
        formErrors={{}}
      />
      <Card style={{ border: "4px #005eb8 solid" }}>
        <Card.Content>
          <Card.Heading data-cy="deferralSummaryHeading">
            Summary of your deferral for {formData.pmName}
          </Card.Heading>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Programme</SummaryList.Key>
              <SummaryList.Value data-cy="deferralSummaryPm">
                {formData.pmName}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Start date before deferral</SummaryList.Key>
              <SummaryList.Value data-cy="deferralSummaryPmStartDate">
                {formData.pmStartDate
                  ? String(formData.pmStartDate)
                  : "Not provided"}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Start date after deferral</SummaryList.Key>
              <SummaryList.Value data-cy="deferralSummaryStartDateAfter">
                {formatDate(formData.newStartDate)}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Reason for deferral</SummaryList.Key>
              <SummaryList.Value data-cy="deferralSummaryReason">
                {reasonSummary}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {isOver12Months && (
            <FieldWarningMsg warningMsgs={[deferralOver12MonthsWarning]} />
          )}
        </Card.Content>
      </Card>
      <WarningCallout>
        <WarningCallout.Label>Declarations</WarningCallout.Label>
        <Declarations
          setCanSubmit={setCanSubmit}
          canEdit={canEdit}
          formDeclarations={formJson.declarations}
        />
        {canEdit && (
          <Formik
            initialValues={{ name: formData.name ?? "" }}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form>
                <TextInputField
                  name="name"
                  id="Name"
                  label="Please give your deferral application a name"
                  placeholder="Type name here..."
                  width="300px"
                  readOnly={!canEdit}
                />
                <Button
                  type="submit"
                  disabled={!values.name.trim() || !canSubmit || isSubmitting}
                  data-cy="BtnSubmit"
                >
                  {isSubmitting ? "Saving..." : "Submit"}
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </WarningCallout>
      {canEdit && (
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
    </DeferralViewWrapper>
  );
};

function DeferralViewWrapper({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ScrollToTop />
      <FormBackLink text="Back to Deferral Home" />
      {children}
    </>
  );
}
