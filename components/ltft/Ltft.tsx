import { Fieldset } from "nhsuk-react-components";
import { mockLtfts } from "../../mock-data/mockLtft";
import { Route, Switch } from "react-router-dom";
import { LtftHome } from "./LtftHome";
import PageNotFound from "../common/PageNotFound";

export type LtftStatus =
  | "Not started"
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "UNSUBMITTED"
  | "WITHDRAWN"
  | "ACTIONED";

export function Ltft() {
  const ltftData = mockLtfts;
  const currentLtftStatus: LtftStatus = calcLtftStatus(ltftData);
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
        <Route
          exact
          path="/ltft/cct-calculation"
          render={() => <div>Make new CCT calculation</div>}
        />
        <Route
          exact
          path="/ltft"
          render={() => <LtftHome currentLtftStatus={currentLtftStatus} />}
        />
        <Route path="/ltft/*" component={PageNotFound} />
      </Switch>
    </>
  );
}

function calcLtftStatus(ltftData: any): LtftStatus {
  console.log(ltftData);
  return "Not started";
}
