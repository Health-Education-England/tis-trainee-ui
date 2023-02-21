import React from "react";
import { Fieldset, Label } from "nhsuk-react-components";
import { Redirect, Route, Switch } from "react-router-dom";
import Create from "./Create";
import CreateList from "../CreateList";
import View from "./viewSections/View";
import ScrollTo from "../../../components/forms/ScrollTo";
import PageTitle from "../../common/PageTitle";
import { useAppSelector } from "../../../redux/hooks/hooks";
import PageNotFound from "../../common/PageNotFound";
import style from "../../Common.module.scss";

const FormRPartB = () => {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
  return (
    <div>
      <PageTitle title="Form R Part-B" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="formRBHeading"
        >
          Form R (Part B)
        </Fieldset.Legend>
        <Label>
          Self-declaration for the Revalidation of Doctors in Training
        </Label>
      </Fieldset>
      <Switch>
        <Route exact path="/formr-b/create" component={Create} />
        <Route exact path="/formr-b/:id" component={View} />
        <Route exact path="/formr-b" component={CreateList} />
        <Route path="/formr-b/*" component={PageNotFound} />
      </Switch>
    </div>
  );
};

export default FormRPartB;
