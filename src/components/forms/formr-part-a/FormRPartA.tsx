import React from "react";
import { Fieldset, Label } from "nhsuk-react-components";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Create from "./Create";
import Confirm from "./Confirm";
import View from "./View";
import List from "./List";
import HowToPrintToPDF from "../HowToPrintToPDF";
import ScrollTo from "../ScrollTo";
import PageTitle from "../../common/PageTitle";
class FormRPartA extends React.PureComponent {
  render() {
    return (
      <div>
        <PageTitle title="Form R Part-A" />
        <ScrollTo />
        <Fieldset>
          <Fieldset.Legend isPageHeading style={{ color: "#005EB8" }}>
            Form R (Part A)
          </Fieldset.Legend>
          <Label>
            Trainee registration for Postgraduate Speciality Training
          </Label>
        </Fieldset>
        <BrowserRouter>
          <Switch>
            <Route path="/formr-a/create" component={Create} />
            <Route path="/formr-a/confirm" component={Confirm} />
            <Route path="/formr-a/howtoexport" component={HowToPrintToPDF} />
            <Route path="/formr-a/:id" component={View} />
            <Route path="/" component={List} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default FormRPartA;
