import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection4 from "./ViewSection4";
import history from "../../../navigation/history";
import CheckDataIsDisplayed, {
  ISectionSomeDataField
} from "./ViewSectionTestHelper";

const makeSectionEditButton = (section: number) => {
  return false;
};

const formDataToDisplay: ISectionSomeDataField[] = [
  { fieldName: "havePreviousDeclarations", format: "YesNo" },
  { fieldName: "havePreviousUnresolvedDeclarations", format: "YesNo" },
  { fieldName: "previousDeclarationSummary", format: "" }
];

const formDataDeclarationToDisplay: ISectionSomeDataField[] = [
  { fieldName: "declarationType", format: "" },
  { fieldName: "title", format: "" },
  { fieldName: "locationOfEntry", format: "" }
];

describe("View", () => {
  const formData = submittedFormRPartBs[0];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection4 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader4]")
      .should("exist")
      .should("include.text", "Section 4:");
  });

  it("should render correct form data", () => {
    CheckDataIsDisplayed(formDataToDisplay, formData);
    formData.previousDeclarations.map((e, i) => {
      CheckDataIsDisplayed(formDataDeclarationToDisplay, e);
    });
  });

  it("should show previous declaration summary", () => {
    cy.get("[data-cy=previousDeclarationSummary]").should("exist");
  });
});

describe("View with null dates value", () => {
  const formData = submittedFormRPartBs[1];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection4 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });

  it("should render correct form data", () => {
    CheckDataIsDisplayed(formDataToDisplay, formData);
  });
});

describe("View without previous unresolved declaration", () => {
  const formData = submittedFormRPartBs[1];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection4 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });

  it("should not show previous declaration summary", () => {
    cy.get("[data-cy=previousDeclarationSummary]").should("not.exist");
  });
});
