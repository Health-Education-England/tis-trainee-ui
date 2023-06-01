import { useEffect, useState } from "react";
import Loading from "../common/Loading";
import ScrollTo from "../../components/forms/ScrollTo";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import {
  selectAllforms,
  fetchForms,
  selectAllSubmittedforms
} from "../../redux/slices/formsSlice";
import { fetchFeatureFlags } from "../../redux/slices/featureFlagsSlice";
import FormsListBtn from "../../components/forms/FormsListBtn";
import { useLocation } from "react-router-dom";
import SubmittedFormsList from "../../components/forms/SubmittedFormsList";
import {
  DraftFormProps,
  getDraftFormProps
} from "../../utilities/FormBuilderUtilities";

const CreateList = ({ history }: { history: string[] }) => {
  const dispatch = useAppDispatch();
  let pathname = useLocation().pathname;
  const formRListDesc = useAppSelector(selectAllforms);
  const submittedListDesc = useAppSelector(selectAllSubmittedforms);
  const latestSubDate = submittedListDesc.length
    ? submittedListDesc[0].submissionDate
    : null;
  const formRListStatus = useAppSelector(state => state.forms.status);
  const featFlagStatus = useAppSelector(state => state.featureFlags.status);
  const [draftFormProps, setDraftFormProps] = useState<DraftFormProps | null>(
    null
  );

  useEffect(() => {
    setDraftFormProps(getDraftFormProps(formRListDesc));
  }, [formRListDesc]);

  useEffect(() => {
    dispatch(fetchForms(pathname));
  }, [dispatch, pathname]);

  useEffect(() => {
    dispatch(fetchFeatureFlags());
  }, [dispatch]);

  let content: JSX.Element = <></>;

  if (formRListStatus === "loading" || featFlagStatus === "loading")
    content = <Loading />;
  if (formRListStatus === "succeeded" && featFlagStatus === "succeeded")
    content = (
      <>
        <ScrollTo />
        <br />
        <FormsListBtn
          pathName={pathname}
          draftFormProps={draftFormProps}
          latestSubDate={latestSubDate}
        />
        <SubmittedFormsList
          formRList={submittedListDesc}
          path={pathname}
          history={history}
          latestSubDate={latestSubDate}
        />
      </>
    );
  return content;
};

export default CreateList;
