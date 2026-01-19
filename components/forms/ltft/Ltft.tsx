import { Fieldset } from "nhsuk-react-components";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "../../common/PageNotFound";
import { LtftHome } from "./LtftHome";
import { LtftForm } from "./LtftForm";
import { LtftFormView } from "./LtftFormView";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { makeValidProgrammeOptions } from "../../../utilities/ltftUtilities";
import { selectPmsNotPast } from "../../../redux/slices/traineeProfileSlice";

export function Ltft() {
  const pmsNotPast = useAppSelector(selectPmsNotPast);
  const pmIdsFromFeatFlags =
    useAppSelector(
      state => state.user.features.forms.ltft.qualifyingProgrammes
    ) ?? [];
  const pmOptionsForLtft = makeValidProgrammeOptions(
    pmsNotPast,
    pmIdsFromFeatFlags
  );

  return (
    <>
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          data-cy="ltftHeading"
          style={{ color: "#005eb8" }}
        >
          Less Than Full Time (LTFT)
        </Fieldset.Legend>
      </Fieldset>
      <Switch>
        <Route
          exact
          path="/ltft"
          render={() => <LtftHome pmOptions={pmOptionsForLtft} />}
        />
        <Route
          exact
          path="/ltft/create"
          render={() => <LtftForm pmOptions={pmOptionsForLtft} />}
        />
        <Route exact path="/ltft/confirm" render={() => <LtftFormView />} />
        <Route exact path="/ltft/:id" render={() => <LtftFormView />} />
        <Route path="/ltft/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
