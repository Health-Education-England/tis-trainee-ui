/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import { FormRForm } from "../../../../components/forms/form-builder/form-r/FormRForm";
import {
  mockPersonalDetails,
  mockProgrammesForLinkerTest
} from "../../../../mock-data/trainee-profile";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import { updatedReference } from "../../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";
import {
  resetToInitFormB,
  updatedFormB
} from "../../../../redux/slices/formBSlice";
import { draftFormRPartBWithNullCareerBreak } from "../../../../mock-data/draft-formr-partb";
import { transformReferenceData } from "../../../../utilities/FormBuilderUtilities";

const defaultProfileTestData = {
  traineeTisId: "testid",
  personalDetails: mockPersonalDetails,
  programmeMemberships: mockProgrammesForLinkerTest,
  placements: [],
  qualifications: []
};

describe("FormRForm (Part B) - new form /new/create", () => {
  beforeEach(() => {
    store.dispatch(resetToInitFormB());
    store.dispatch(
      updatedReference(transformReferenceData(mockedCombinedReference))
    );
    store.dispatch(updatedTraineeProfileData(defaultProfileTestData));
  });

  it("first renders the FormLinkerModal before the main form", () => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b/new/create"]}>
          <FormRForm formType="B" />
        </MemoryRouter>
      </Provider>
    );

    // Note: more detailed modal tests in FormLinkerModal.cy.tsx
    cy.get("dialog").should("be.visible");
    cy.get('[data-cy="isArcp0"]').should("exist").click();
    cy.get('button[data-cy="form-linker-submit-btn"]').should("be.disabled");
    cy.clickSelect('[data-cy="programmeMembershipId"]');

    cy.get('button[data-cy="form-linker-submit-btn"]')
      .should("not.be.disabled")
      .click();

    cy.get('[data-cy="progress-header"] > h3').should(
      "contain.text",
      "Part 1 of 10 - Personal Details"
    );

    cy.checkAndFillSection1();
    cy.navNext();

    cy.checkAndFillSection2();
    cy.navNext();

    cy.checkAndFillSection3();
    cy.navNext();

    cy.checkAndFillSection4();
    cy.navNext();

    cy.checkAndFillSection5();
    cy.navNext();

    cy.checkAndFillSection6();
    cy.navNext();

    cy.checkAndFillSection7();
    cy.navNext();

    cy.checkAndFillSection8();
    cy.navNext();

    cy.checkAndFillSection9();
    cy.get('[data-cy="navNext"]').contains("Compliments").click();

    cy.checkAndFillSection10();
    cy.get('[data-cy="navNext"]').contains("Review & submit").click();
  });

  it("Allows direct navigation to draft form", () => {
    store.dispatch(updatedFormB(draftFormRPartBWithNullCareerBreak));

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b/6e644647434834getee/create"]}>
          <FormRForm formType="B" />
        </MemoryRouter>
      </Provider>
    );

    cy.get('[data-cy="progress-header"] > h3').should(
      "contain.text",
      "Part 1 of 10 - Personal Details"
    );
    cy.get('[data-cy="forename-input"]').should("contain.value", "Billy");
    cy.get('[data-cy="surname-input"]').should("contain.value", "Ocean");
  });
});
