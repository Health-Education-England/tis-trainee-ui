import { Fieldset, Legend } from "nhsuk-react-components";
import style from "../../Common.module.scss";
import { Route, Switch } from "react-router-dom";
import PageNotFound from "../../common/PageNotFound";
import { CctHome } from "./CctHome";
import { CctCalcView } from "./CctCalcView";
import { CctCalcCreate } from "./CctCalcCreate";

export function Cct() {
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
        <Route exact path="/cct/create" component={CctCalcCreate} />
        <Route exact path="/cct/create/:id" component={CctCalcCreate} />
        <Route exact path="/cct/view" component={CctCalcView} />
        <Route exact path="/cct/view/:id" component={CctCalcView} />
        <Route exact path="/cct" component={CctHome} />
        <Route path="/cct/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
