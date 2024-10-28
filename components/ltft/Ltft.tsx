import { Fieldset } from "nhsuk-react-components";
import { Route, Switch } from "react-router-dom";
import { LtftHome } from "./LtftHome";
import PageNotFound from "../common/PageNotFound";
import { LtftCct } from "./LtftCct";
import { LtftCctSummary } from "./LtftCctSummary";

export type LtftStatus =
  | "Not started"
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "UNSUBMITTED"
  | "WITHDRAWN"
  | "ACTIONED";

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
        <Route exact path="/ltft/cct-calculation" render={() => <LtftCct />} />
        <Route exact path="/ltft/cct-summary" component={LtftCctSummary} />
        <Route
          exact
          path="/ltft"
          render={() => <LtftHome currentLtftStatus="Not started" />} // TODO: replace with actual status
        />
        <Route path="/ltft/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
