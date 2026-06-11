import { Fieldset } from "nhsuk-react-components";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "../../common/PageNotFound";
import { DeferralHome } from "./DeferralHome";
import { DeferralForm } from "./DeferralForm";
import { DeferralFormView } from "./DeferralFormView";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectPmsNotPast } from "../../../redux/slices/traineeProfileSlice";
import { makeDeferralProgrammeOptions } from "../../../utilities/deferralUtilities";

export function Deferral() {
  const pmsNotPast = useAppSelector(selectPmsNotPast);
  const pmOptions = makeDeferralProgrammeOptions(pmsNotPast);

  return (
    <>
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          data-cy="deferralHeading"
          style={{ color: "#005eb8" }}
        >
          Deferral
        </Fieldset.Legend>
      </Fieldset>
      <Switch>
        <Route
          exact
          path="/deferral"
          render={() => <DeferralHome pmOptions={pmOptions} />}
        />
        <Route
          exact
          path="/deferral/create"
          render={() => <DeferralForm pmOptions={pmOptions} />}
        />
        <Route
          exact
          path="/deferral/confirm"
          render={() => <DeferralFormView />}
        />
        <Route exact path="/deferral/:id" render={() => <DeferralFormView />} />
        <Route path="/deferral/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
