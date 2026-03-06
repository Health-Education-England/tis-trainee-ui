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
import { FormRView } from "../FormRView";
import { FormRForm } from "../FormRForm";

export default function FormA() {
  const location = useLocation();
  return (
    <>
      <PageTitle title="Form R Part-A" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className="fieldset-legend__header"
          data-cy="formRAHeading"
        >
          Form R (Part A)
        </Fieldset.Legend>
        {location.pathname === "/formr-a" && (
          <>
            <p className="nhsuk-heading-s" data-cy="formraSubheading">
              {FORMR_HEADING_TEXT}
            </p>
            <p className="nhsuk-body-m" data-cy="formraInfo">
              {FORMR_SUBHEADING_TEXT}
            </p>
          </>
        )}
        {location.pathname !== "/formr-a" && (
          <FormBackLink text="Back to Form R Part A home" />
        )}
      </Fieldset>
      <Switch>
        <Route exact path="/formr-a" component={FormRHome} />
        <Route
          exact
          path={["/formr-a/new/create", "/formr-a/:id/create"]}
          render={() => <FormRForm formType="A" />}
        />
        <Route
          exact
          path={["/formr-a/new/view", "/formr-a/:id/view"]}
          render={() => <FormRView formType="A" />}
        />
        <Route path="/formr-a/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
