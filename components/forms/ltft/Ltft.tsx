import { Fieldset } from "nhsuk-react-components";
import { Route, Switch, useLocation } from "react-router-dom";
import PageNotFound from "../../common/PageNotFound";
import { LtftHome } from "./LtftHome";
import { LtftForm } from "./LtftForm";
import { LtftFormView } from "./LtftFormView";
import FormBackLink from "../../common/FormBackLink";
import history from "../../navigation/history";

export function Ltft() {
  const location = useLocation();
  return (
    <>
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          data-cy="ltftHeading"
          style={{ color: "#005eb8" }}
        >
          Changing hours (LTFT)
        </Fieldset.Legend>
        {location.pathname !== "/ltft" && (
          <FormBackLink
            history={history}
            path="/ltft"
            dataCy="back-to-ltft-home"
            text="Back to LTFT home"
          />
        )}
      </Fieldset>
      <Switch>
        <Route exact path="/ltft" component={LtftHome} />
        <Route exact path="/ltft/new/create" component={LtftForm} />
        <Route exact path="/ltft/:id/create" component={LtftForm} />
        <Route exact path="/ltft/new/view" component={LtftFormView} />
        <Route exact path="/ltft/:id/view" component={LtftFormView} />
        <Route path="/ltft/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
