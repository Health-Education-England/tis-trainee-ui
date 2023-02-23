import { Redirect, Route, Switch } from "react-router-dom";
import ScrollTo from "../ScrollTo";
import PageTitle from "../../../components/common/PageTitle";
import { Fieldset, Label } from "nhsuk-react-components";
import CreateList from "../CreateList";
import View from "./View";
import Create from "./Create";
import Confirm from "./Confirm";
import { useAppSelector } from "../../../redux/hooks/hooks";
import PageNotFound from "../../common/PageNotFound";
import style from "../../Common.module.scss";

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
          className={style.fieldLegHeader}
          data-cy="formRAHeading"
        >
          Form R (Part A)
        </Fieldset.Legend>
        <Label data-cy="formraLabel">
          Trainee registration for Postgraduate Speciality Training
        </Label>
      </Fieldset>
      <Switch>
        <Route exact path="/formr-a/create" component={Create} />
        <Route exact path="/formr-a/confirm" component={Confirm} />
        <Route exact path="/formr-a/:id" component={View} />
        <Route exact path="/formr-a" component={CreateList} />
        <Route path="/formr-a/*" component={PageNotFound} />
      </Switch>
    </>
  );
};

export default FormRPartA;
