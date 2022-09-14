import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBwithCovid } from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection7 from "./ViewSection7";
import history from "../../../navigation/history";
import ViewSectionShouldIncludeThisData, {
  ISectionCovidDeclarationDataField,
  ISectionDataField,
  ViewSectionCovidDeclarationShouldIncludeThisData
} from "./ViewSectionTestHelper";

const makeSectionEditButton = (section: number) => {
  return false;
};

const formDataToDisplay: ISectionDataField[] = [
  { fieldName: "haveCovidDeclarations", format: "YesNo" }
];

const formDataCovidDeclarationToDisplay: ISectionCovidDeclarationDataField[] = [
  { fieldName: "selfRateForCovid", format: "" },
  { fieldName: "reasonOfSelfRate", format: "" },
  { fieldName: "otherInformationForPanel", format: "" },
  { fieldName: "discussWithSupervisorChecked", format: "YesNo" },
  { fieldName: "discussWithSomeoneChecked", format: "YesNo" },
  { fieldName: "haveChangesToPlacement", format: "YesNo" },
  { fieldName: "changeCircumstances", format: "" },
  { fieldName: "changeCircumstanceOther", format: "" },
  { fieldName: "howPlacementAdjusted", format: "" },
  { fieldName: "educationSupervisorName", format: "" },
  { fieldName: "educationSupervisorEmail", format: "" }
];

describe("View", () => {
  it("should render View section heading", () => {
    const formData = submittedFormRPartBwithCovid[0];
    const viewSectionProps = { makeSectionEditButton, formData };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection7 {...viewSectionProps} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=sectionHeader7]")
      .should("exist")
      .should("include.text", "Covid declarations");
  });

  it("should render correct form data", () => {
    const formData = submittedFormRPartBwithCovid[0];
    const viewSectionProps = { makeSectionEditButton, formData };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection7 {...viewSectionProps} />
        </Router>
      </Provider>
    );
    ViewSectionShouldIncludeThisData(formDataToDisplay, formData);
    ViewSectionCovidDeclarationShouldIncludeThisData(
      formDataCovidDeclarationToDisplay,
      formData.covidDeclarationDto
    );
  });
});