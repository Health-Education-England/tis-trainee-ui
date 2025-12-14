import { useEffect } from "react";
import Loading from "../../../common/Loading";
import ScrollTo from "../../ScrollTo";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks/hooks";
import {
  fetchForms,
  selectAllSubmittedforms,
  updatedFormsRefreshNeeded
} from "../../../../redux/slices/formsSlice";
import FormRListBtn from "./FormRListBtn";
import { useLocation } from "react-router-dom";
import SubmittedFormRList from "./SubmittedFormRList";
import { Col, Container, Row } from "nhsuk-react-components";
import { StartOverButton } from "../../StartOverButton";
import { FormName } from "../FormBuilder";
import ErrorPage from "../../../common/ErrorPage";
import { resetForm } from "../../../../utilities/FormBuilderUtilities";

export function FormRHome() {
  const dispatch = useAppDispatch();
  const pathname = useLocation().pathname;
  const formName: FormName = pathname === "/formr-a" ? "formA" : "formB";
  const submittedListDesc = useAppSelector(selectAllSubmittedforms);
  const latestSubDate = submittedListDesc?.length
    ? submittedListDesc[0].submissionDate
    : null;
  const formRListStatus = useAppSelector(state => state.forms?.status);

  const needFormsRefresh = useAppSelector(
    state => state.forms?.formsRefreshNeeded
  );
  const formIdFromDraftFormProps = useAppSelector(
    state => state.forms?.draftFormProps?.id
  );

  useEffect(() => {
    resetForm(formName);
    dispatch(fetchForms(pathname));
    dispatch(updatedFormsRefreshNeeded(false));
  }, [dispatch, pathname, needFormsRefresh]);

  if (formRListStatus === "loading") return <Loading />;
  if (formRListStatus === "failed")
    return (
      <ErrorPage message="There was a problem loading your saved forms. Please try reloading them by refreshing the page." />
    );
  if (formRListStatus === "succeeded")
    return (
      <>
        <ScrollTo />
        <br />
        <Container>
          <Row>
            <Col width="one-third">
              <FormRListBtn pathName={pathname} />
            </Col>
          </Row>
          <Row>
            <Col width="one-third">
              <StartOverButton
                formName={formName}
                btnLocation="formsList"
                formsListDraftId={formIdFromDraftFormProps}
              />
            </Col>
          </Row>
        </Container>
        <SubmittedFormRList
          formRList={submittedListDesc}
          path={pathname}
          latestSubDate={latestSubDate}
        />
      </>
    );
  return null;
}
