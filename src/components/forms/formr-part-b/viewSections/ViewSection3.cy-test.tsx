import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection3 from "./ViewSection3";
import history from "../../../navigation/history";
import { DateUtilities } from "../../../../utilities/DateUtilities";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";
import ViewSectionShouldIncludeThisData, {
  ISectionDataField
} from "./ViewSectionTestHelper";

const makeSectionEditButton = (section: number) => {
  return false;
};

const formDataToDisplay: ISectionDataField[] = [
  { fieldName: "isHonest", format: "YesNo" },
  { fieldName: "isHealthy", format: "YesNo" },
  { fieldName: "isWarned", format: "YesNo" },
  { fieldName: "isComplying", format: "YesNo" },
  { fieldName: "healthStatement", format: "" }
];

describe("View", () => {
  it("should render View section heading", () => {
    const formData = submittedFormRPartBs[0];
    const viewSectionProps = { makeSectionEditButton, formData };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection3 {...viewSectionProps} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=sectionHeader3]")
      .should("exist")
      .should("include.text", "Section 3:");
  });

  it("should render correct form data", () => {
    const formData = submittedFormRPartBs[0];
    const viewSectionProps = { makeSectionEditButton, formData };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection3 {...viewSectionProps} />
        </Router>
      </Provider>
    );
    ViewSectionShouldIncludeThisData(formDataToDisplay, formData);
  });
});
