import { Fieldset, Legend } from "nhsuk-react-components";
import { Route, Switch, useLocation } from "react-router-dom";
import style from "../../Common.module.scss";
import PageNotFound from "../../common/PageNotFound";
import { CctForm } from "./CctForm";
import { CctHome } from "./CctHome";

export function Cct() {
  const location = useLocation();

  return (
    <>
      <Fieldset>
        <Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="cct-header"
          size="xl"
        >
          Certificate of Completion of Training (CCT)
        </Legend>
      </Fieldset>
      <Switch>
        <Route exact path="/cct" component={CctHome} />
        <Route
          exact
          path="/cct/create"
          render={() => <CctForm key={location.key} />}
        />
        <Route path="/cct/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
