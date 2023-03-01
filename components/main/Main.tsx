import { Switch, Route, Redirect, Router } from "react-router-dom";
import Profile from "../profile/Profile";
import FormRPartA from "../forms/formr-part-a/FormRPartA";
import FormRPartB from "../forms/formr-part-b/FormRPartB";
import Support from "../support/Support";
import PageNotFound from "../common/PageNotFound";
import PageTitle from "../common/PageTitle";
import HEEHeader from "../navigation/HEEHeader";
import HEEFooter from "../navigation/HEEFooter";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { fetchTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import { fetchReference } from "../../redux/slices/referenceSlice";
import Loading from "../common/Loading";
import MFA from "../authentication/setMfa/MFA";
import history from "../navigation/history";
import { ConfirmProvider } from "material-ui-confirm";
import { getPreferredMfa } from "../../redux/slices/userSlice";
import Home from "../home/Home";
import Placements from "../placements/Placements";
import Programmes from "../programmes/Programmes";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";

interface IMain {
  signOut: any;
  appVersion: string;
}

export const Main = ({ signOut, appVersion }: IMain) => {
  const dispatch = useAppDispatch();
  const traineeProfileDataStatus = useAppSelector(
    state => state.traineeProfile.status
  );
  let content;

  useEffect(() => {
    dispatch(getPreferredMfa());
  }, [dispatch]);

  useEffect(() => {
    if (traineeProfileDataStatus === "idle") {
      dispatch(fetchTraineeProfileData());
    }
  }, [traineeProfileDataStatus, dispatch]);

  // combined Reference data
  const referenceStatus = useAppSelector(state => state.reference.status);

  useEffect(() => {
    if (referenceStatus === "idle") {
      dispatch(fetchReference());
    }
  }, [referenceStatus, dispatch]);

  if (traineeProfileDataStatus === "loading" || referenceStatus === "loading")
    return (
      <div className="centreSpinner">
        <Loading />
      </div>
    );
  else if (
    traineeProfileDataStatus === "succeeded" &&
    referenceStatus === "succeeded"
  )
    content = (
      <>
        <Router history={history}>
          <PageTitle />
          <HEEHeader signOut={signOut} />
          <Breadcrumbs />
          <main className="nhsuk-width-container nhsuk-u-margin-top-5">
            <Switch>
              <Route exact path="/home" component={Home}></Route>
              <Route path="/placements" component={Placements}></Route>
              <Route path="/programmes" component={Programmes}></Route>
              <Route exact path="/profile" component={Profile} />
              <Route path="/formr-a" component={FormRPartA} />
              <Route path="/formr-b" component={FormRPartB} />
              <Route exact path="/support" component={Support} />
              <Route path="/mfa" component={MFA} />
              <Redirect exact path="/" to="/home" />
              <Route path="/*" component={PageNotFound} />
            </Switch>
          </main>
          <HEEFooter appVersion={appVersion} />
        </Router>
      </>
    );
  return <ConfirmProvider>{content}</ConfirmProvider>;
};
