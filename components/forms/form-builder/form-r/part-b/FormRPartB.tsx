import { Redirect, Route, Switch } from "react-router-dom";
import ScrollTo from "../../../ScrollTo";
import PageTitle from "../../../../common/PageTitle";
import { Fieldset, Label } from "nhsuk-react-components";
import CreateList from "../../../CreateList";
import { useAppSelector } from "../../../../../redux/hooks/hooks";
import PageNotFound from "../../../../common/PageNotFound";
import FormB from "./FormB";
// need a FormBView to import

export default function FormRPartB() {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
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
        <Label data-cy="formrbLabel" size="s">
          Trainee registration for Postgraduate Speciality Training
        </Label>
      </Fieldset>
      <Switch>
        <Route exact path="/formr-b/create" component={FormB} />
        {/* <Route exact path="/formr-b/confirm" component={FormBView} /> */}
        {/* <Route exact path="/formr-b/:id" component={FormBView} /> */}
        <Route exact path="/formr-b" component={CreateList} />
        <Route path="/formr-b/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
