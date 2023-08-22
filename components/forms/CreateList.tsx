import { useEffect } from "react";
import Loading from "../common/Loading";
import ScrollTo from "../../components/forms/ScrollTo";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import {
  fetchForms,
  selectAllSubmittedforms,
  updatedFormsRefreshNeeded
} from "../../redux/slices/formsSlice";
import { fetchFeatureFlags } from "../../redux/slices/featureFlagsSlice";
import FormsListBtn from "../../components/forms/FormsListBtn";
import { useLocation } from "react-router-dom";
import SubmittedFormsList from "../../components/forms/SubmittedFormsList";
import { resetToInitFormA } from "../../redux/slices/formASlice";
import { resetToInitFormB } from "../../redux/slices/formBSlice";
import { Col, Container, Row } from "nhsuk-react-components";
import { StartOverButton } from "./StartOverButton";

const CreateList = () => {
  const dispatch = useAppDispatch();
  const pathname = useLocation().pathname;
  const formName = pathname === "/formr-a" ? "formA" : "formB";
  const submittedListDesc = useAppSelector(selectAllSubmittedforms);
  const latestSubDate = submittedListDesc?.length
    ? submittedListDesc[0].submissionDate
    : null;
  const formRListStatus = useAppSelector(state => state.forms?.status);
  const featFlagStatus = useAppSelector(state => state.featureFlags.status);
  const needFormsRefresh = useAppSelector(
    state => state.forms?.formsRefreshNeeded
  );

  useEffect(() => {
    dispatch(fetchForms(pathname));
    dispatch(updatedFormsRefreshNeeded(false));
  }, [dispatch, pathname, needFormsRefresh]);

  useEffect(() => {
    dispatch(fetchFeatureFlags());
  }, [dispatch]);

  useEffect(() => {
    dispatch(formName === "formA" ? resetToInitFormA() : resetToInitFormB());
  }, [dispatch, formName]);

  let content: JSX.Element = <></>;

  if (formRListStatus === "loading" || featFlagStatus === "loading")
    content = <Loading />;
  if (formRListStatus === "succeeded" && featFlagStatus === "succeeded")
    content = (
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
              <StartOverButton />
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
  return content;
};

export default CreateList;
