import React from "react";
import { Fieldset, Label } from "nhsuk-react-components";
import { Route, Switch } from "react-router-dom";
import Create from "./Create";
import CreateList from "../CreateList";
import View from "./View";
import ScrollTo from "../ScrollTo";
import PageTitle from "../../common/PageTitle";

const FormRPartB: React.FC = () => {
  return (
    <div>
      <PageTitle title="Form R Part-B" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend isPageHeading style={{ color: "#005EB8" }}>
          Form R (Part B)
        </Fieldset.Legend>
        <Label>
          Self-declaration for the Revalidation of Doctors in Training
        </Label>
      </Fieldset>
      <Switch>
        <Route path="/formr-b/create" component={Create} />
        <Route path="/formr-b/:id" component={View} />
        <Route path="/" component={CreateList} />
      </Switch>
    </div>
  );
};

export default FormRPartB;
