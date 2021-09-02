import { Switch, Route, Redirect } from "react-router-dom";
import Profile from "../profile/Profile";
import FormRPartA from "../forms/formr-part-a/FormRPartA";
import FormRPartB from "../forms/formr-part-b/FormRPartB";
import Support from "../support/Support";
import HowToPrintToPDF from "../forms/HowToPrintToPDF";
import PageNotFound from "../common/PageNotFound";
import { ContactLO } from "../common/ContactLO";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

export const Main = () => {
  const [thisUser, setThisUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await Auth.currentAuthenticatedUser();
      if (fetchedUser) {
        setThisUser(fetchedUser.attributes["custom:tisId"]);
      }
    };
    fetchUser();
  }, [thisUser]);

  return thisUser ? (
    <main className="nhsuk-width-container nhsuk-u-margin-top-5">
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/formr-a" component={FormRPartA} />
        <Route path="/formr-b" component={FormRPartB} />
        <Route path="/support" component={Support} />
        <Route path="/howtoexport" component={HowToPrintToPDF} />
        <Redirect exact path="/" to="/profile" />

        <Route path="/*" component={PageNotFound} />
      </Switch>
    </main>
  ) : (
    <ContactLO />
  );
};
