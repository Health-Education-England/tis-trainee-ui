import { Switch, Route, Redirect } from "react-router-dom";
import Profile from "../profile/Profile";
import FormRPartA from "../forms/formr-part-a/FormRPartA";
import FormRPartB from "../forms/formr-part-b/FormRPartB";
import Support from "../support/Support";
import HowToPrintToPDF from "../forms/HowToPrintToPDF";
import PageNotFound from "../common/PageNotFound";
import { ContactLO } from "../common/ContactLO";

interface MainProps {
  user: any;
}

export const Main = ({ user }: MainProps) => {
  if (user && user.attributes["custom:tisId"]) {
    return (
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
    );
  } else return <ContactLO />;
};
