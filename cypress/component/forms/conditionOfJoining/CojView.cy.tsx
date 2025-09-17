/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react18";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import {
  updatedsigningCoj,
  updatedsigningCojPmId,
  updatedsigningCojProgName,
  updatedsigningCojSignedDate,
  updatedsigningCojVersion
} from "../../../../redux/slices/userSlice";
import { mockTraineeProfile } from "../../../../mock-data/trainee-profile";
import CojView from "../../../../components/forms/conditionOfJoining/CojView";

describe("Conditions of Joining (/programmes/:id/sign-coj)", () => {
  const pmId = mockTraineeProfile.programmeMemberships[0].tisId;

  beforeEach(() => {
    store.dispatch(updatedsigningCoj(true));
    store.dispatch(updatedsigningCojVersion("GG10"));
    store.dispatch(updatedsigningCojPmId(pmId!));
    store.dispatch(updatedsigningCojProgName("Test Programme"));
  });

  it("renders the editable FormView component when not signed", () => {
    store.dispatch(updatedsigningCojSignedDate(null));

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/programmes/${pmId}/sign-coj`]}>
          <CojView />
        </MemoryRouter>
      </Provider>
    );

    cy.get('[data-cy="cojHeading"]').contains(
      "Conditions of Joining Agreement"
    );
    cy.get("h3").contains("Test Programme Specialty Training Programme");
    cy.get('[data-cy="cojSignBtn"]').contains(
      "Click to sign Conditions of Joining agreement"
    );

    cy.get('[data-cy="isDeclareProvisional0"]').should("not.be.checked");
    cy.get('[data-cy="isDeclareSatisfy0"]').should("not.be.checked");
    cy.get('[data-cy="isDeclareProvide0"]').should("not.be.checked");
    cy.get('[data-cy="isDeclareInform0"]').should("not.be.checked");
    cy.get('[data-cy="isDeclareUpToDate0"]').should("not.be.checked");
    cy.get('[data-cy="isDeclareAttend0"]').should("not.be.checked");
    cy.get('[data-cy="isDeclareContacted0"]').should("not.be.checked");
    cy.get('[data-cy="isDeclareEngage0"]').should("not.be.checked");

    cy.get(`[data-cy="savePdfBtn"]`).should("not.exist");
    cy.get(`[data-cy="cojSignedOn"]`).should("not.exist");
  });

  it("renders the readonly FormView component when signed", () => {
    store.dispatch(updatedsigningCojSignedDate(new Date("2024-03-02T01:00Z")));

    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/programmes/${pmId}/sign-coj`]}>
          <CojView />
        </MemoryRouter>
      </Provider>
    );

    cy.get('[data-cy="cojHeading"]').contains(
      "Conditions of Joining Agreement"
    );
    cy.get("h3").contains("Test Programme Specialty Training Programme");
    cy.get('[data-cy="savePdfBtn"]').contains("Save a copy as a PDF");
    cy.get('[data-cy="cojSignedOn"]').contains(
      "Signed On: 02/03/2024 01:00 (GMT)"
    );

    cy.get('[data-cy="isDeclareProvisional0"]').should("be.checked");
    cy.get('[data-cy="isDeclareSatisfy0"]').should("be.checked");
    cy.get('[data-cy="isDeclareProvide0"]').should("be.checked");
    cy.get('[data-cy="isDeclareInform0"]').should("be.checked");
    cy.get('[data-cy="isDeclareUpToDate0"]').should("be.checked");
    cy.get('[data-cy="isDeclareAttend0"]').should("be.checked");
    cy.get('[data-cy="isDeclareContacted0"]').should("be.checked");
    cy.get('[data-cy="isDeclareEngage0"]').should("be.checked");

    cy.get(`[data-cy="cojSignBtn"]`).should("not.exist");
  });
});
