import { CognitoUser } from "amazon-cognito-identity-js";
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
import Preferences from "../preferences/Preferences";

interface IMain {
  user: CognitoUser | any;
  signOut: any;
  appVersion: string;
}

export const Main = ({ user, signOut, appVersion }: IMain) => {
  const mfa = user.preferredMFA;
  const dispatch = useAppDispatch();
  const traineeProfileDataStatus = useAppSelector(
    state => state.traineeProfile.status
  );
  let content;

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
          <HEEHeader signOut={signOut} mfa={mfa} />
          <main className="nhsuk-width-container nhsuk-u-margin-top-5">
            <Switch>
              <Route path="/profile" render={() => <Profile mfa={mfa} />} />
              <Route path="/formr-a" render={() => <FormRPartA mfa={mfa} />} />
              <Route path="/formr-b" render={() => <FormRPartB mfa={mfa} />} />
              <Route path="/support" component={Support} />
              <Route path="/mfa" render={() => <MFA user={user} mfa={mfa} />} />
              <Route path="/preferences" render={() => <Preferences />} />

              <Redirect exact path="/" to="/profile" />
              <Route path="/*" component={PageNotFound} />
            </Switch>
          </main>
          <HEEFooter appVersion={appVersion} />
        </Router>
      </>
    );
  return <ConfirmProvider>{content}</ConfirmProvider>;
};
