import { Fieldset, Legend } from "nhsuk-react-components";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "../../common/PageNotFound";
import { LtftHome } from "./LtftHome";
import { LtftForm } from "./LtftForm";
import { LtftFormView } from "./LtftFormView";

export function Ltft() {
  return (
    <>
      <Fieldset>
        <Legend
          isPageHeading
          data-cy="ltftHeading"
          style={{ color: "#005eb8" }}
          size="xl"
        >
          Changing hours (LTFT)
        </Legend>
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
