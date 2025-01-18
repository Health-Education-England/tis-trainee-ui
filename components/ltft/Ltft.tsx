import { Fieldset } from "nhsuk-react-components";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "../common/PageNotFound";
import { LtftHome } from "./LtftHome";
import { LtftForm } from "../forms/form-builder/form-ltft/LtftForm";

export function Ltft() {
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
      </Fieldset>
      <Switch>
        <Route exact path="/ltft" render={() => <LtftHome />} />
        <Route exact path="/ltft/create" render={() => <LtftForm/>} />
        <Route path="/ltft/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
