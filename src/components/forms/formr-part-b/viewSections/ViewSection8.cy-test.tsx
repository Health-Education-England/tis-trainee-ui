import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection8 from "./ViewSection8";
import history from "../../../navigation/history";
import CheckDataIsDisplayed, {
  ISectionSomeDataField
} from "./ViewSectionTestHelper";

const makeSectionEditButton = (section: number) => {
  return false;
};

const formDataToDisplay: ISectionSomeDataField[] = [];

describe("View", () => {
  const formData = submittedFormRPartBs[0];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection8 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader8]")
      .should("exist")
      .should("include.text", "Declarations");
  });

  it("should render correct form data", () => {
    CheckDataIsDisplayed(formDataToDisplay, formData);
  });
});
