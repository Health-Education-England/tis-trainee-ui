import { Route, Switch, useLocation } from "react-router-dom";
import ScrollTo from "../../../ScrollTo";
import PageTitle from "../../../../common/PageTitle";
import { Fieldset } from "nhsuk-react-components";
import PageNotFound from "../../../../common/PageNotFound";
import {
  FORMR_HEADING_TEXT,
  FORMR_SUBHEADING_TEXT
} from "../../../../../utilities/Constants";
import { FormBackLink } from "../../../../common/FormBackLink";
import { FormRHome } from "../FormRHome";
import { FormRPartBForm } from "./FormRPartBForm";
import { FormRPartBView } from "./FormRPartBView";

export default function FormB() {
  const location = useLocation();

  return (
    <>
      <PageTitle title="Form R Part-B" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className="fieldset-legend__header"
          data-cy="formRBHeading"
        >
          Form R (Part B)
        </Fieldset.Legend>
        {location.pathname === "/formr-b" && (
          <>
            <p className="nhsuk-heading-s" data-cy="formrbSubheading">
              {FORMR_HEADING_TEXT}
            </p>
            <p className="nhsuk-body-m" data-cy="formrbInfo">
              {FORMR_SUBHEADING_TEXT}
            </p>
          </>
        )}
        {location.pathname !== "/formr-b" && (
          <FormBackLink text="Back to Form R Part B home" />
        )}
      </Fieldset>
      <Switch>
        <Route exact path="/formr-b" component={FormRHome} />
        <Route
          exact
          path={["/formr-b/new/create", "/formr-b/:id/create"]}
          component={FormRPartBForm}
        />
        <Route
          exact
          path={["/formr-b/new/view", "/formr-b/:id/view"]}
          component={FormRPartBView}
        />
        <Route path="/formr-b/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
