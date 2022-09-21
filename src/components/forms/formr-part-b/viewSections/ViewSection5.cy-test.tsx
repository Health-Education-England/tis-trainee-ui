import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection5 from "./ViewSection5";
import history from "../../../navigation/history";
import CheckDataIsDisplayed, {
  ISectionSomeDataField
} from "./ViewSectionTestHelper";

const makeSectionEditButton = (section: number) => {
  return false;
};

const formDataToDisplay: ISectionSomeDataField[] = [
  { fieldName: "haveCurrentDeclarations", format: "YesNo" },
  { fieldName: "haveCurrentUnresolvedDeclarations", format: "YesNo" },
  { fieldName: "currentDeclarationSummary", format: "" }
];

const formDataDeclarationToDisplay: ISectionSomeDataField[] = [
  { fieldName: "declarationType", format: "" },
  { fieldName: "dateOfEntry", format: "LocalDate" },
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
          <ViewSection5 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader5]")
      .should("exist")
      .should("include.text", "Section 5:");
  });

  it("should render correct form data", () => {
    CheckDataIsDisplayed(formDataToDisplay, formData);
    formData.currentDeclarations.map((e, i) => {
      CheckDataIsDisplayed(formDataDeclarationToDisplay, e);
    });
  });

  it("should show current declaration summary", () => {
    cy.get("[data-cy=currentDeclarationSummary]").should("exist");
  });
});

describe("View with null dates value", () => {
  const formData = submittedFormRPartBs[1];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection5 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });

  it("should render correct form data", () => {
    CheckDataIsDisplayed(formDataToDisplay, formData);
  });
});

describe("View without current unresolved declarations", () => {
  const formData = submittedFormRPartBs[1];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection5 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });

  it("should not show current declaration summary", () => {
    cy.get("[data-cy=currentDeclarationSummary]").should("not.exist");
  });
});
