import { CognitoUser } from "amazon-cognito-identity-js";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import Profile from "../profile/Profile";
import FormRPartA from "../forms/formr-part-a/FormRPartA";
import FormRPartB from "../forms/formr-part-b/FormRPartB";
import Support from "../support/Support";
import HowToPrintToPDF from "../forms/HowToPrintToPDF";
import PageNotFound from "../common/PageNotFound";
import SetupMFA from "../authentication/mfa/SetupMFA";
import PageTitle from "../common/PageTitle";
import HEEHeader from "../navigation/HEEHeader";
import HEEFooter from "../navigation/HEEFooter";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { fetchTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import { fetchReference } from "../../redux/slices/referenceSlice";
import Loading from "../common/Loading";
interface IMain {
  user: CognitoUser | any;
  signOut: any;
  appVersion: string;
}

const MainRoutes = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/profile" component={Profile} />
      <Route path="/formr-a" component={FormRPartA} />
      <Route path="/formr-b" component={FormRPartB} />
      <Route path="/support" component={Support} />
      <Route path="/howtoexport" component={HowToPrintToPDF} />
      <Redirect exact path="/" to="/profile" />
      <Route path="/*" component={PageNotFound} />
    </Switch>
  );
};
export const Main = ({ user, signOut, appVersion }: IMain) => {
  let content;
  const dispatch = useAppDispatch();
  const traineeProfileDataStatus = useAppSelector(
    state => state.traineeProfile.status
  );

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
        <BrowserRouter>
          <PageTitle />
          <HEEHeader signOut={signOut} mfa={user.preferredMFA} />
          <main className="nhsuk-width-container nhsuk-u-margin-top-5">
            {user.preferredMFA === "NOMFA" ? (
              <SetupMFA user={user} mfa={user.preferredMFA} />
            ) : (
              <MainRoutes />
            )}
          </main>
          <HEEFooter appVersion={appVersion} mfa={user.preferredMFA} />
        </BrowserRouter>
      </>
    );
  return <div>{content}</div>;
};
