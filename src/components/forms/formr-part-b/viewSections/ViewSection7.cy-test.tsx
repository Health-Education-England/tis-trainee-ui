import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import {
  submittedFormRPartBs,
  submittedFormRPartBwithCovid
} from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import ViewSection7 from "./ViewSection7";
import history from "../../../navigation/history";
import CheckDataIsDisplayed, {
  ISectionSomeDataField
} from "./ViewSectionTestHelper";

const makeSectionEditButton = (section: number) => {
  return false;
};

const formDataToDisplay: ISectionSomeDataField[] = [
  { fieldName: "haveCovidDeclarations", format: "YesNo" }
];

const formDataCovidDeclarationToDisplay: ISectionSomeDataField[] = [
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
  const formData = submittedFormRPartBwithCovid[0];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection7 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });
  it("should render View section heading", () => {
    cy.get("[data-cy=sectionHeader7]")
      .should("exist")
      .should("include.text", "Covid declarations");
  });

  it("should render correct form data", () => {
    CheckDataIsDisplayed(formDataToDisplay, formData);
    CheckDataIsDisplayed(
      formDataCovidDeclarationToDisplay,
      formData.covidDeclarationDto
    );
  });

  it("should show Covid training progress details", () => {
    cy.get("[data-cy=covidTrainingProgress]").should("exist");
    cy.get("[data-cy=covidTrainingSection2]").should("exist");
    cy.get("[data-cy=covidTrainingSection3]").should("exist");
    cy.get("[data-cy=covidTrainingSection4]").should("exist");
  });
});

describe("View with no reason of self rate and other circumstance", () => {
  const formData = submittedFormRPartBwithCovid[1];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection7 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });

  it("should not show Covid training progress reason", () => {
    cy.get("[data-cy=covidTrainingProgress]").should("exist");
    cy.get("[data-cy=covidTrainingReason]").should("not.exist");
  });

  it("should not show other circumstance", () => {
    cy.get("[data-cy=covidTrainingSection2]").should("exist");
    cy.get("[data-cy=covidTrainingSection3]").should("exist");
    cy.get("[data-cy=covidTrainingSection4]").should("exist");
    cy.get("[data-cy=otherCircumstance]").should("not.exist");
  });
});

describe("View with no circumstance of change", () => {
  const formData = submittedFormRPartBwithCovid[2];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection7 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });

  it("should not show circumstance of change", () => {
    cy.get("[data-cy=covidTrainingSection2]").should("exist");
    cy.get("[data-cy=covidTrainingSection3]").should("exist");
    cy.get("[data-cy=covidTrainingSection4]").should("exist");
    cy.get("[data-cy=circumstanceOfChange]").should("not.exist");
    cy.get("[data-cy=otherCircumstance]").should("not.exist");
  });
});

describe("View with Covid declaration null", () => {
  const formData = submittedFormRPartBs[0];
  const viewSectionProps = { makeSectionEditButton, formData };
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ViewSection7 {...viewSectionProps} />
        </Router>
      </Provider>
    );
  });

  it("should not show Covid training progress details", () => {
    cy.get("[data-cy=covidTrainingProgress]").should("not.exist");
    cy.get("[data-cy=covidTrainingSection2]").should("not.exist");
    cy.get("[data-cy=covidTrainingSection3]").should("not.exist");
    cy.get("[data-cy=covidTrainingSection4]").should("not.exist");
  });
});
