import { Redirect, Route, Switch } from "react-router-dom";
import ScrollTo from "../../../ScrollTo";
import PageTitle from "../../../../common/PageTitle";
import { Fieldset, Label } from "nhsuk-react-components";
import CreateList from "../../../CreateList";
import { useAppSelector } from "../../../../../redux/hooks/hooks";
import PageNotFound from "../../../../common/PageNotFound";
import FormA from "./FormA";
import FormAView from "./FormAView";

const FormRPartA = () => {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
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
        <Label data-cy="formraLabel" size="s">
          Trainee registration for Postgraduate Speciality Training
        </Label>
      </Fieldset>
      <Switch>
        <Route exact path="/formr-a/create" component={FormA} />
        <Route exact path="/formr-a/confirm" component={FormAView} />
        <Route exact path="/formr-a/:id" component={FormAView} />
        <Route exact path="/formr-a" component={CreateList} />
        <Route path="/formr-a/*" component={PageNotFound} />
      </Switch>
    </>
  );
};

export default FormRPartA;
