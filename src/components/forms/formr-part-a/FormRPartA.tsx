import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollTo from "../ScrollTo";
import PageTitle from "../../common/PageTitle";
import { Fieldset, Label } from "nhsuk-react-components";
import CreateList from "../CreateList";
import View from "../View";
import Create from "./Create";
import Confirm from "./Confirm";

const FormRPartA = () => {
  return (
    <>
      <PageTitle title="Form R Part-A" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend isPageHeading style={{ color: "#005EB8" }}>
          Form R (Part A)
        </Fieldset.Legend>
        <Label>Trainee registration for Postgraduate Speciality Training</Label>
      </Fieldset>
      <BrowserRouter>
        <Switch>
          <Route path="/formr-a/create" component={Create} />
          <Route path="/formr-a/confirm" component={Confirm} />
          {/* <Route path="/formr-a/howtoexport" component={HowToPrintToPDF} /> */}
          <Route path="/formr-a/:id" component={View} />
          <Route path="/" component={CreateList} />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default FormRPartA;
