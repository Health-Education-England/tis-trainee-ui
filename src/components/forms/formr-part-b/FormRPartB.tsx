import React from "react";
import { Fieldset, Label } from "nhsuk-react-components";
import { Route, Switch, BrowserRouter } from "react-router-dom";
// import Create from "./Create";
import CreateList from "../CreateList";
import View from "./View";
// import Confirm from "./Confirm";
import ScrollTo from "../ScrollTo";
import PageTitle from "../../common/PageTitle";
// import HowToPrintToPDF from "../HowToPrintToPDF";
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
      <BrowserRouter>
        <Switch>
          {/* <Route path="/formr-b/create" component={Create} />
          <Route path="/formr-b/confirm" component={Confirm} />
          <Route path="/formr-b/howtoexport" component={HowToPrintToPDF} /> */}
          <Route path="/formr-b/:id" component={View} />
          <Route path="/" component={CreateList} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default FormRPartB;
