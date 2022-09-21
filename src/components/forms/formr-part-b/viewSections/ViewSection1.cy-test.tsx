import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection1 from "./ViewSection1";
import history from "../../../navigation/history";
import CheckDataIsDisplayed, {
  ISectionSomeDataField
} from "./ViewSectionTestHelper";

const makeSectionEditButton = (section: number) => {
  return false;
};

const formDataToDisplay: ISectionSomeDataField[] = [
  { fieldName: "forename", format: "" },
  { fieldName: "surname", format: "" },
  { fieldName: "gmcNumber", format: "" },
  { fieldName: "email", format: "" },
  { fieldName: "localOfficeName", format: "" },
  { fieldName: "currRevalDate", format: "LocalDate" },
  { fieldName: "prevRevalDate", format: "LocalDate" },
  { fieldName: "programmeSpecialty", format: "" },
  { fieldName: "dualSpecialty", format: "" }
];

describe("View", () => {
  const formData = submittedFormRPartBs[0];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection1 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader1]")
      .should("exist")
      .should("include.text", "Section 1:");
  });

  it("should render correct form data", () => {
    CheckDataIsDisplayed(formDataToDisplay, formData);
  });
});

describe("View with null dates value", () => {
  const formData = submittedFormRPartBs[1];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection1 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });

  it("should render correct form data", () => {
    CheckDataIsDisplayed(formDataToDisplay, formData);
  });

  it("should show other previous revalidation body", () => {
    cy.get("[data-cy=prevRevalBodyOther]").should("exist");
  });
});

describe("View with no other previous revalidation body", () => {
  const formData = submittedFormRPartBs[0];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection1 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });

  it("should not show other previous revalidation body", () => {
    cy.get("[data-cy=prevRevalBodyOther]").should("not.exist");
  });
});
