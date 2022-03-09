import { useEffect } from "react";
import { IFormR } from "../../models/IFormR";
import Loading from "../common/Loading";
import ScrollTo from "./ScrollTo";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { selectAllforms, fetchForms } from "../../redux/slices/formsSlice";
import { fetchFeatureFlags } from "../../redux/slices/featureFlagsSlice";
import FormsListBtn from "./FormsListBtn";
import { Redirect, useLocation } from "react-router-dom";
import SubmittedFormsList from "./SubmittedFormsList";

const CreateList = ({ history }: { history: string[] }) => {
  let pathname: string = useLocation().pathname;
  const dispatch = useAppDispatch();
  const formRList: IFormR[] = useAppSelector(selectAllforms);
  const formRListStatus: string = useAppSelector(state => state.forms.status);
  const featFlagStatus: string = useAppSelector(
    state => state.featureFlags.status
  );

  useEffect(() => {
    dispatch(fetchForms(pathname));
  }, [dispatch, pathname]);

  useEffect(() => {
    dispatch(fetchFeatureFlags());
  }, [dispatch]);

  let content: JSX.Element = <></>;

  if (formRListStatus === "loading" || featFlagStatus === "loading")
    content = <Loading />;
  if (formRListStatus === "failed" || featFlagStatus === "failed")
    content = <Redirect to="/support" />;
  if (formRListStatus === "succeeded" && featFlagStatus === "succeeded")
    content = (
      <>
        <ScrollTo />
        <br />
        <FormsListBtn pathName={pathname} formRList={formRList} />
        <SubmittedFormsList
          formRList={formRList}
          path={pathname}
          history={history}
        />
      </>
    );
  return content;
};

export default CreateList;
