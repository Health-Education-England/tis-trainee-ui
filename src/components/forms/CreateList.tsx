import { useEffect } from "react";
import Loading from "../common/Loading";
import ScrollTo from "./ScrollTo";
import { useAppSelector } from "../../redux/hooks/hooks";
import {
  selectAllforms,
  fetchForms,
  selectAllSubmittedforms
} from "../../redux/slices/formsSlice";
import { fetchFeatureFlags } from "../../redux/slices/featureFlagsSlice";
import FormsListBtn from "./FormsListBtn";
import { Redirect, useLocation } from "react-router-dom";
import SubmittedFormsList from "./SubmittedFormsList";
import { dispatchCojNotif } from "../../utilities/CojUtilities";
import store from "../../redux/store/store";
import { resetNotifications } from "../../redux/slices/notificationsSlice";

const CreateList = ({ history }: { history: string[] }) => {
  let pathname = useLocation().pathname;
  const formRListDesc = useAppSelector(selectAllforms);
  const submittedListDesc = useAppSelector(selectAllSubmittedforms);
  const latestSubDate = submittedListDesc.length
    ? submittedListDesc[0].submissionDate
    : null;
  const formRListStatus: string = useAppSelector(state => state.forms.status);
  const featFlagStatus: string = useAppSelector(
    state => state.featureFlags.status
  );

  useEffect(() => {
    dispatchCojNotif();
    store.dispatch(fetchForms(pathname));
    store.dispatch(fetchFeatureFlags());
    return () => {
      store.dispatch(resetNotifications());
    };
  }, [pathname]);

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
        <FormsListBtn
          pathName={pathname}
          formRList={formRListDesc}
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
