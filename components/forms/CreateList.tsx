import { useEffect } from "react";
import Loading from "../common/Loading";
import ScrollTo from "../../components/forms/ScrollTo";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import {
  fetchForms,
  selectAllSubmittedforms,
  updatedFormsRefreshNeeded
} from "../../redux/slices/formsSlice";
import FormsListBtn from "../../components/forms/FormsListBtn";
import { useLocation } from "react-router-dom";
import SubmittedFormsList from "../../components/forms/SubmittedFormsList";
import { Col, Container, Row } from "nhsuk-react-components";
import { StartOverButton } from "./StartOverButton";
import { FormName } from "./form-builder/FormBuilder";
import ErrorPage from "../common/ErrorPage";

const CreateList = () => {
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
              <FormsListBtn pathName={pathname} latestSubDate={latestSubDate} />
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
        <SubmittedFormsList
          formRList={submittedListDesc}
          path={pathname}
          latestSubDate={latestSubDate}
        />
      </>
    );
  return null;
};

export default CreateList;
