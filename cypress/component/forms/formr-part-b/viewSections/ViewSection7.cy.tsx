/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import React from "react";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartBwithCovid } from "../../../../../src/mock-data/submitted-formr-partb";
import store from "../../../../../src/redux/store/store";
import ViewSection7 from "../../../../../src/components/forms/formr-part-b/viewSections/ViewSection7";
import history from "../../../../../src/components/navigation/history";
import {
  CovidDeclaration,
  FormRPartB
} from "../../../../../src/models/FormRPartB";
import { makeSectionEditButton } from "../../../../../src/components/forms/formr-part-b/viewSections/ViewSectionTestHelper";

let formData = submittedFormRPartBwithCovid[0];

type formRBSub7 = Pick<FormRPartB, "haveCovidDeclarations">;

describe("View", () => {
  const covidDeclaration = formData.covidDeclarationDto;
  const formDataToDisplay: formRBSub7 = {
    haveCovidDeclarations: formData.haveCovidDeclarations
  };
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
    cy.testData(formDataToDisplay);
  });

  it("should render correct covid declaration data", () => {
    cy.testData(covidDeclaration);
  });

  it("should show Covid training progress details", () => {
    cy.get("[data-cy=covidTrainingProgress]").should("exist");
    cy.get("[data-cy=covidTrainingSection2]").should("exist");
    cy.get("[data-cy=covidTrainingSection3]").should("exist");
    cy.get("[data-cy=covidTrainingSection4]").should("exist");
  });
});

describe("View with no reason of self rate", () => {
  let formDataCovidDeclarationDto: CovidDeclaration =
    formData.covidDeclarationDto!;
  formDataCovidDeclarationDto = {
    ...formDataCovidDeclarationDto,
    reasonOfSelfRate: ""
  };
  formData = { ...formData, covidDeclarationDto: formDataCovidDeclarationDto };

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
    cy.get("[data-cy=reasonOfSelfRate]").should("not.exist");
  });
});

describe("View with no other circumstance", () => {
  let formDataCovidDeclarationDto: CovidDeclaration =
    formData.covidDeclarationDto!;
  formDataCovidDeclarationDto = {
    ...formDataCovidDeclarationDto,
    changeCircumstances: "Any Period of self-isolation",
    changeCircumstanceOther: ""
  };
  formData = { ...formData, covidDeclarationDto: formDataCovidDeclarationDto };

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

  it("should not show other circumstance", () => {
    cy.get("[data-cy=covidTrainingSection2]").should("exist");
    cy.get("[data-cy=covidTrainingSection3]").should("exist");
    cy.get("[data-cy=covidTrainingSection4]").should("exist");
    cy.get("[data-cy=changeCircumstances]").should("exist");
    cy.get("[data-cy=changeCircumstanceOther]").should("not.exist");
  });
});

describe("View with no circumstance of change", () => {
  let formDataCovidDeclarationDto: CovidDeclaration =
    formData.covidDeclarationDto!;
  formDataCovidDeclarationDto = {
    ...formDataCovidDeclarationDto,
    haveChangesToPlacement: false
  };
  formData = { ...formData, covidDeclarationDto: formDataCovidDeclarationDto };

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
    cy.get("[data-cy=changeCircumstances]").should("not.exist");
    cy.get("[data-cy=changeCircumstanceOther]").should("not.exist");
  });
});

describe("View with Covid declaration null", () => {
  formData = {
    ...formData,
    haveCovidDeclarations: null,
    covidDeclarationDto: null
  };
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
