import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
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
  const [mfa, setMfa] = useState<string>("");
  useEffect(() => {
    const getUser = async () => {
      const user = await Auth.currentAuthenticatedUser();
      setMfa(user.preferredMFA);
    };
    getUser();
  }, [mfa]);

  return (
    <>
      <BrowserRouter>
        <PageTitle />
        <HEEHeader signOut={signOut} mfa={mfa} />
        <main className="nhsuk-width-container nhsuk-u-margin-top-5">
          {mfa === "NOMFA" ? (
            <SetupMFA user={user} mfa={mfa} />
          ) : (
            <MainRoutes />
          )}
        </main>
        <HEEFooter appVersion={appVersion} mfa={mfa} />
      </BrowserRouter>
    </>
  );
};
