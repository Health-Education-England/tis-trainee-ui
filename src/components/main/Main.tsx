import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
import { MFAStatus } from "../../models/MFAStatus";
import { Switch, Route, Redirect } from "react-router-dom";
import Profile from "../profile/Profile";
import FormRPartA from "../forms/formr-part-a/FormRPartA";
import FormRPartB from "../forms/formr-part-b/FormRPartB";
import Support from "../support/Support";
import HowToPrintToPDF from "../forms/HowToPrintToPDF";
import PageNotFound from "../common/PageNotFound";
import SetupMFA from "../authentication/mfa/SetupMFA";

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
export const Main = () => {
  const [user, setUser] = useState<CognitoUser>();
  const [mfaStatus, setMFAStatus] = useState<string>("");
  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser: CognitoUser = await Auth.currentAuthenticatedUser();
        const currentMFA: string = await Auth.getPreferredMFA(currentUser);
        setUser(currentUser);
        setMFAStatus(currentMFA);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getUser();
  }, []);
  return (
    <>
      {user && (
        <main className="nhsuk-width-container nhsuk-u-margin-top-5">
          {mfaStatus === MFAStatus.SMS || mfaStatus === MFAStatus.TOTP ? (
            <MainRoutes />
          ) : (
            <SetupMFA mfaStatus={mfaStatus} user={user} />
          )}
        </main>
      )}
    </>
  );
};
