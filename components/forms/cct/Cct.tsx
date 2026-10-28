import { Fieldset, Legend, NotificationBanner } from "nhsuk-react-components";
import { Route, Switch, useLocation } from "react-router-dom";
import style from "../../Common.module.scss";
import PageNotFound from "../../common/PageNotFound";
import { CctForm } from "./CctForm";
import { CctHome } from "./CctHome";

type LocationState = {
  savedCalculationName?: string;
};

export function Cct() {
  const location = useLocation<LocationState>();
  const savedCalculationName = location.state?.savedCalculationName;

  return (
    <>
      {savedCalculationName && (
        <NotificationBanner success data-cy="cct-saved-banner">
          <NotificationBanner.Heading>
            {`Your calculation '${savedCalculationName}' has been saved`}
          </NotificationBanner.Heading>
        </NotificationBanner>
      )}
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
        <Route exact path="/cct/create" component={CctForm} />
        <Route path="/cct/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
