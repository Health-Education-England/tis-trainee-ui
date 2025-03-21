import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { useParams } from "react-router-dom";
import { loadSavedLtft, LtftObj } from "../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { Form, FormName } from "../form-builder/FormBuilder";
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
import { LtftNameModal } from "./LtftNameModal";
import { saveDraftForm } from "../../../utilities/FormBuilderUtilities";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import Loading from "../../common/Loading";
import history from "../../navigation/history";
import ErrorPage from "../../common/ErrorPage";
import dayjs from "dayjs";

export const LtftFormView = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

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
  const formJson = ltftJson as Form;
  const [canSubmit, setCanSubmit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubClick = () => {
    setShowModal(true);
  };

  const handleModalFormClose = () => {
    setShowModal(false);
    stopSubmitting();
  };

  const handleModalFormSubmit = async (values: { name: string }) => {
    setShowModal(false);
    startSubmitting();
    await saveDraftForm(
      formJson,
      { ...formData, name: values.name } as LtftObj,
      false,
      true
    );
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
                  startSubmitting();
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
        {canEditStatus && (
          <Container>
            <Row>
              <Col width="one-quarter">
                <Button
                  secondary
                  onClick={async (e: { preventDefault: () => void }) => {
                    startSubmitting();
                    await saveDraftForm(
                      formJson,
                      formData as LtftObj,
                      false,
                      false
                    );
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
        <LtftNameModal
          onSubmit={handleModalFormSubmit}
          isOpen={showModal}
          onClose={handleModalFormClose}
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
