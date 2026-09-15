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
  resetToInitFormB,
  updatedFormB,
  updatedFormBLifecycleState
} from "../../../../redux/slices/formBSlice";
import { draftFormRPartBWithNullCareerBreak } from "../../../../mock-data/draft-formr-partb";
import { transformReferenceData } from "../../../../utilities/FormBuilderUtilities";
import { LifeCycleState } from "../../../../models/LifeCycleState";

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

  it("Allows direct navigation to draft form", () => {
    store.dispatch(updatedFormB(draftFormRPartBWithNullCareerBreak));

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b/6e644647434834getee/create"]}>
          <Route path="/formr-b/:id/create">
            <FormRForm formType="B" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.get('[data-cy="progress-header"] > h3').should(
      "contain.text",
      "Part 1 of 11 - Programme Linkage"
    );
  });

  it("allows a null prevRevalDate but errors when the date is before the UNIX epoch", () => {
    store.dispatch(updatedFormB(draftFormRPartBWithNullCareerBreak));

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b/6e644647434834getee/create"]}>
          <Route path="/formr-b/:id/create">
            <FormRForm formType="B" />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    cy.get('[data-cy="isArcp-radios"] input').first().as("firstArcpOption");
    cy.get("@firstArcpOption").click();
    cy.clickSelect('[data-cy="programmeMembershipId"]');
    cy.navNext();

    cy.get('[data-cy="prevRevalDate-input"]').should(
      "contain.value",
      "2020-04-22"
    );
    cy.get("#prevRevalDate-error").should("not.exist");

    cy.clearAndType('[data-cy="prevRevalDate-input"]', "1969-12-31");
    cy.get("#prevRevalDate-error").should(
      "have.text",
      "Error: The date cannot be before 01/01/1970"
    );

    cy.get('[data-cy="prevRevalDate-input"]').clear();
    cy.get("#prevRevalDate-error").should("not.exist");
  });
});

describe("FormRForm (Part A) - GMC/GDC conditional checkboxes for Public Health Non-Medic", () => {
  beforeEach(() => {
    store.dispatch(resetToInitFormB());
    store.dispatch(updatedReference(mockedCombinedReference));
    store.dispatch(updatedFormBLifecycleState(LifeCycleState.Draft));
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
          <FormRForm formType="B" />
        </MemoryRouter>
      </Provider>
    );

    cy.get('[data-cy="isArcp-radios"] input').first().as("firstArcpOption");
    cy.get("@firstArcpOption").click();
    cy.clickSelect('[data-cy="programmeMembershipId"]');
    cy.navNext();

    cy.get('[data-cy="progress-header"] > h3').should(
      "contain.text",
      "Part 2 of 11 - Personal Details"
    );
  });

  it("shows check GMC/GDC conditional checkboxes for Public Health Non-Medic", () => {
    cy.checkAndFillPhGmcGdc();
  });
});
