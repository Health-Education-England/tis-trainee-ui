import { CognitoUser } from "amazon-cognito-identity-js";
import { Switch, Route, Redirect } from "react-router-dom";
import Profile from "../profile/Profile";
import FormRPartA from "../forms/formr-part-a/FormRPartA";
import FormRPartB from "../forms/formr-part-b/FormRPartB";
import Support from "../support/Support";
import PageNotFound from "../common/PageNotFound";
import PageTitle from "../common/PageTitle";
import HEEHeader from "../navigation/HEEHeader";
import HEEFooter from "../navigation/HEEFooter";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { fetchTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import { fetchReference } from "../../redux/slices/referenceSlice";
import Loading from "../common/Loading";
import MFA from "../authentication/setMfa/MFA";
import { ConfirmProvider } from "material-ui-confirm";
import store from "../../redux/store/store";
import { hasSignedCOJ } from "../../utilities/CojUtilities";
import { updatedHasSignedCoj } from "../../redux/slices/userSlice";
interface IMain {
  user: CognitoUser | any;
  signOut: any;
  appVersion: string;
}

export const Main = ({ user, signOut, appVersion }: IMain) => {
  const mfa = user.preferredMFA;
  const traineeProfileDataStatus = useAppSelector(
    state => state.traineeProfile.status
  );
  const referenceStatus = useAppSelector(state => state.reference.status);
  let content;
  const prgMems =
    store.getState().traineeProfile.traineeProfileData.programmeMemberships;

  useEffect(() => {
    if (traineeProfileDataStatus === "idle") {
      store.dispatch(fetchTraineeProfileData());
    }
  }, [traineeProfileDataStatus]);

  // TODO - placeholder action for now to check if hasSignedCOJ
  useMemo(
    () => store.dispatch(updatedHasSignedCoj(hasSignedCOJ(prgMems))),
    [prgMems]
  );

  useEffect(() => {
    if (referenceStatus === "idle") {
      store.dispatch(fetchReference());
    }
  }, [referenceStatus]);

  if (traineeProfileDataStatus === "loading" || referenceStatus === "loading")
    return (
      <div className="centreSpinner">
        <Loading />
      </div>
    );
  else if (
    traineeProfileDataStatus === "succeeded" &&
    referenceStatus === "succeeded"
  ) {
    content = (
      <>
        <PageTitle />
        <HEEHeader signOut={signOut} mfa={mfa} />
        <main className="nhsuk-width-container nhsuk-u-margin-top-5">
          <Switch>
            <Route path="/profile" render={() => <Profile mfa={mfa} />} />
            <Route path="/formr-a" render={() => <FormRPartA mfa={mfa} />} />
            <Route path="/formr-b" render={() => <FormRPartB mfa={mfa} />} />
            <Route path="/support" component={Support} />
            <Route path="/mfa" render={() => <MFA user={user} mfa={mfa} />} />
            <Redirect exact path="/" to="/profile" />
            <Route path="/*" component={PageNotFound} />
          </Switch>
        </main>
        <HEEFooter appVersion={appVersion} />
      </>
    );
  }

  return <ConfirmProvider>{content}</ConfirmProvider>;
};
