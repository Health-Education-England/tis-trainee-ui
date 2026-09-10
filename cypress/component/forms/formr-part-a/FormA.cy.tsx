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
      "Part 1 of 4 - Programme Linkage"
    );
  });
});

describe("FormR Part A - UNSUBMITTED form with stale prog linkage", () => {
  const unsubmittedStaleForm = {
    ...formASavedDraft,
    lifecycleState: LifeCycleState.Unsubmitted,
    isArcp: true,
    programmeMembershipId: "4",
    programmeName: "Acute medicine",
    localOfficeName: "East of England",
    programmeSpecialty: "Acute medicine"
  };

  beforeEach(() => {
    store.dispatch(resetToInitFormA());
    store.dispatch(updatedReference(mockedCombinedReference));
    store.dispatch(updatedTraineeProfileData(defaultProfileTestData));
    store.dispatch(updatedFormA(unsubmittedStaleForm));
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[`/formr-a/${unsubmittedStaleForm.id}/create`]}
        >
          <Route path="/formr-a/:id/create">
            <FormRForm formType="A" />
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  it("should show warning before allowign Programme Linkage page edit", () => {
    cy.get('[data-cy="pageGateWarning"]').should("exist");
    cy.get('[data-cy="pageGateText"]').should(
      "contain.text",
      "the linked programme you chose is no longer available"
    );
  });

  it("prevents access to gated page until warning is actioned", () => {
    cy.get('[data-cy="progress-header"] > :nth-child(1)').should(
      "not.have.text",
      "Part 1 of 4 - Programme Linkage"
    );
    cy.get('[data-cy="programmeMembershipId"]').should("not.exist");
  });

  it("prevents access to gated page when the warning is cancelled", () => {
    cy.get('[data-cy="modal-cancel-btn"]').click();
    cy.get('[data-cy="pageGateWarning"]').should("not.exist");
    cy.get('[data-cy="progress-header"] > :nth-child(1)').should(
      "have.text",
      "Part 2 of 4 - Personal Details"
    );
    cy.get('[data-cy="localOfficeName-input"]').should("not.exist");
  });

  it("keeps the linkage as is and steps over the gated page when 'skip' is chosen", () => {
    cy.get('[data-cy="gateSkipBtn"]').click();
    cy.get('[data-cy="pageGateWarning"]').should("not.exist");
    cy.get('[data-cy="progress-header"] > :nth-child(1)').should(
      "have.text",
      "Part 2 of 4 - Personal Details"
    );
    cy.get('[data-cy="navPrevious"]').click();
    cy.get('[data-cy="pageGateWarning"]').should("exist");
  });

  it("clears the programme linkage when 'proceed' is chosen", () => {
    cy.get('[data-cy="gateProceedBtn"]').click();
    cy.get('[data-cy="pageGateWarning"]').should("not.exist");
    cy.get('[data-cy="progress-header"] > :nth-child(1)').should(
      "have.text",
      "Part 1 of 4 - Programme Linkage"
    );
    cy.get('[data-cy="localOfficeName-input"]').should("not.exist");
  });
});

describe("FormRForm (Part A) - linked programme fields", () => {
  beforeEach(() => {
    store.dispatch(resetToInitFormA());
    store.dispatch(updatedReference(mockedCombinedReference));
    store.dispatch(updatedFormALifecycleState(LifeCycleState.Draft));
    store.dispatch(updatedTraineeProfileData(defaultProfileTestData));
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-a/new/create"]}>
          <FormRForm formType="A" />
        </MemoryRouter>
      </Provider>
    );
  });

  it("shows the local office only once a programme is linked", () => {
    cy.get('[data-cy="localOfficeName-input"]').should("not.exist");
    cy.get('[data-cy="isArcp-radios"] input').first().click();
    cy.clickSelect('[data-cy="programmeMembershipId"]');
    cy.get('[data-cy="localOfficeName-input"]')
      .should("have.value", "East of England")
      .and("have.attr", "readonly");
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
    cy.get('[data-cy="isArcp-radios"] input').first().as("firstArcpOption");
    cy.get("@firstArcpOption").click();
    cy.clickSelect('[data-cy="programmeMembershipId"]');
    cy.navNext();
    cy.checkAndFillPhGmcGdc();
  });
});
