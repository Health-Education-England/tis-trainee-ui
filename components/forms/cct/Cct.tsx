import { Fieldset, Legend, NotificationBanner } from "nhsuk-react-components";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import style from "../../Common.module.scss";
import PageNotFound from "../../common/PageNotFound";
import { CctCalculation } from "../../../models/CctTypes";
import { CctForm } from "./CctForm";
import { CctHome } from "./CctHome";
import { CctSavedCalculation } from "./CctSavedCalculation";

type LocationState = {
  savedCalculation?: Pick<CctCalculation, "id" | "name">;
};

export function Cct() {
  const location = useLocation<LocationState>();
  const savedCalculation = location.state?.savedCalculation;

  return (
    <>
      {savedCalculation && (
        <NotificationBanner success data-cy="cct-saved-banner">
          <NotificationBanner.Heading>
            {`Your calculation '${savedCalculation.name}' has been saved`}
          </NotificationBanner.Heading>
          <p className="nhsuk-body">
            <NotificationBanner.Link
              asElement={Link}
              to={`/cct/${savedCalculation.id}`}
              data-cy="cct-saved-banner-link"
            >
              View or change your calculation
            </NotificationBanner.Link>
          </p>
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
        <Route exact path="/cct/:id" component={CctSavedCalculation} />
        <Route path="/cct/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
