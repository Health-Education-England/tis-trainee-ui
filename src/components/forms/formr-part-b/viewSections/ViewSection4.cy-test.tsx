import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection4 from "./ViewSection4";
import history from "../../../navigation/history";
import ViewSectionShouldIncludeThisData, {
  ISectionDataField,
  ISectionDeclarationDataField,
  ViewSectionDeclarationShouldIncludeThisData
} from "./ViewSectionTestHelper";

const makeSectionEditButton = (section: number) => {
  return false;
};

const formDataToDisplay: ISectionDataField[] = [
  { fieldName: "havePreviousDeclarations", format: "YesNo" },
  { fieldName: "havePreviousUnresolvedDeclarations", format: "YesNo" },
  { fieldName: "previousDeclarationSummary", format: "" }
];

const formDataDeclarationToDisplay: ISectionDeclarationDataField[] = [
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
    ViewSectionShouldIncludeThisData(formDataToDisplay, formData);
    formData.previousDeclarations.map((e, i) => {
      ViewSectionDeclarationShouldIncludeThisData(
        formDataDeclarationToDisplay,
        e
      );
    });
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
    ViewSectionShouldIncludeThisData(formDataToDisplay, formData);
  });
});
