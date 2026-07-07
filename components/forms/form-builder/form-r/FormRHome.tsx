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
import { Col, Container, Row, WarningCallout } from "nhsuk-react-components";
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
  }, [dispatch, pathname, needFormsRefresh, formName]);

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
        <WarningCallout data-cy="formr-migration-warning">
          <WarningCallout.Heading visuallyHiddenText="">
            Form-R Migration in Progress
          </WarningCallout.Heading>
          <p>
            We are currently migrating Form-Rs to a new system. The migration
            process may take up to 24 hours to complete.
          </p>
          <p data-cy="formr-migration-warning-text2">
            During this time, some existing form submissions may not be visible.
            This is expected and does not mean your form has been lost - it will
            become available again once it has been successfully migrated.
          </p>
          <p>We appreciate your patience while we complete this work.</p>
        </WarningCallout>
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
