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

describe("FormRForm (Part A) - GMC/GDC conditional checkboxes for Public Health Non-Medic", () => {
  beforeEach(() => {
    store.dispatch(resetToInitFormA());
    store.dispatch(updatedReference(mockedCombinedReference));
    store.dispatch(updatedFormALifecycleState(LifeCycleState.Draft));
    store.dispatch(
      updatedTraineeProfileData({
        ...defaultProfileTestData,
        personalDetails: {
          ...mockPersonalDetails,
          publicHealthNumber: "ph001",
          gmcNumber: "",
          gdcNumber: ""
        }
      })
    );
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-a/new/create"]}>
          <FormRForm formType="A" />
        </MemoryRouter>
      </Provider>
    );

    cy.get('[data-cy="progress-header"]').should("exist");
  });
  it("shows check GMC/GDC conditional checkboxes for Public Health Non-Medic", () => {
    cy.checkAndFillPhGmcGdc();
  });
});
