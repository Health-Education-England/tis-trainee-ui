/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react";
import { MemoryRouter, Route } from "react-router-dom";
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
  resetToInitFormA,
  updatedFormA,
  updatedFormALifecycleState
} from "../../../../redux/slices/formASlice";
import { formASavedDraft } from "../../../../mock-data/draft-formr-parta";
import { LifeCycleState } from "../../../../models/LifeCycleState";

const defaultProfileTestData = {
  traineeTisId: "testid",
  personalDetails: mockPersonalDetails,
  programmeMemberships: mockProgrammesForLinkerTest,
  placements: [],
  qualifications: []
};

describe("FormRForm (Part A) - new form /new/create", () => {
  beforeEach(() => {
    store.dispatch(resetToInitFormA());
    store.dispatch(updatedReference(mockedCombinedReference));
    store.dispatch(updatedTraineeProfileData(defaultProfileTestData));
  });

  it("first renders the FormLinkerModal before the main form", () => {
    store.dispatch(updatedFormALifecycleState(LifeCycleState.Draft));
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-a/new/create"]}>
          <FormRForm formType="A" />
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
    cy.get('[data-cy="progress-header"] > :nth-child(1)').should(
      "have.text",
      "Part 1 of 3 - Personal Details"
    );
    cy.checkAndFillFormASection1();
    cy.navNext();
    cy.checkAndFillFormASection2();
    cy.navNext();
    cy.checkAndFillFormASection3();
    cy.get('[data-cy="autosaveStatusMsg"]').contains(
      "Autosave status: Fail - Last autosave success: none this session"
    );
    cy.navNext();
  });

  it("Allows direct navigation to draft form", () => {
    store.dispatch(updatedFormA(formASavedDraft));
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={["/formr-a/5e972ec9b9b5781b94eb1270/create"]}
        >
          <Route path="/formr-a/:id/create">
            <FormRForm formType="A" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.get('[data-cy="progress-header"] > :nth-child(1)').should(
      "have.text",
      "Part 1 of 3 - Personal Details"
    );
  });
});
