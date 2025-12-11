import { Fieldset } from "nhsuk-react-components";
import { Route, Switch, useLocation } from "react-router-dom";
import PageNotFound from "../../common/PageNotFound";
import { LtftHome } from "./LtftHome";
import { LtftForm } from "./LtftForm";
import { LtftFormView } from "./LtftFormView";
import FormBackLink from "../../common/FormBackLink";

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
          <FormBackLink text="Back to LTFT home" />
        )}
      </Fieldset>
      <Switch>
        <Route exact path="/ltft" render={() => <LtftHome />} />
        <Route exact path="/ltft/create" render={() => <LtftForm />} />
        <Route exact path="/ltft/confirm" render={() => <LtftFormView />} />
        <Route exact path="/ltft/:id" render={() => <LtftFormView />} />
        <Route path="/ltft/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
