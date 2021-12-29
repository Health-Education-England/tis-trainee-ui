import { CognitoUser } from "amazon-cognito-identity-js";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import Profile from "../profile/Profile";
import FormRPartA from "../forms/formr-part-a/FormRPartA";
// import FormRPartB from "../forms/formr-part-b/FormRPartB";
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
import Loading from "../common/Loading";
import ErrorPage from "../common/ErrorPage";
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
      {/* <Route path="/formr-b" component={FormRPartB} /> */}
      <Route path="/support" component={Support} />
      <Route path="/howtoexport" component={HowToPrintToPDF} />
      <Redirect exact path="/" to="/profile" />
      <Route path="/*" component={PageNotFound} />
    </Switch>
  );
};
export const Main = ({ user, signOut, appVersion }: IMain) => {
  const dispatch = useAppDispatch();

  const traineeProfileDataStatus = useAppSelector(
    state => state.traineeProfile.status
  );

  const traineeProfileDataError = useAppSelector(
    state => state.traineeProfile.error
  );

  useEffect(() => {
    if (traineeProfileDataStatus === "idle") {
      dispatch(fetchTraineeProfileData());
    }
  }, [traineeProfileDataStatus, dispatch]);

  let content;

  if (traineeProfileDataStatus === "loading") return <Loading />;
  else if (traineeProfileDataStatus === "succeeded")
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
  else if (traineeProfileDataStatus === "failed")
    content = <ErrorPage error={traineeProfileDataError}></ErrorPage>;
  return <div>{content}</div>;
};
