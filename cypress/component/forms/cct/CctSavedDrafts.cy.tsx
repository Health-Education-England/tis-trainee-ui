import store from "../../../../redux/store/store";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import {
  updatedCctList,
  updatedCctListStatus
} from "../../../../redux/slices/cctListSlice";
import { mockCctList } from "../../../../mock-data/mock-cct-data";
import { CctSavedDrafts } from "../../../../components/forms/cct/CctSavedDrafts";
import {
  updatedLtftSummaryList,
  updatedLtftSummaryListStatus
} from "../../../../redux/slices/ltftSummaryListSlice";
import { updatedUserFeatures } from "../../../../redux/slices/userSlice";
import { mockLtftsList1 } from "../../../../mock-data/mock-ltft-data";
import {
  mockUserFeatures1,
  mockUserFeatures3
} from "../../../../mock-data/trainee-profile";

describe("CctSavedDrafts", () => {
  beforeEach(() => {
    store.dispatch(updatedUserFeatures(mockUserFeatures1));
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/cct"]}>
          <CctSavedDrafts />
        </MemoryRouter>
      </Provider>
    );
  });
  it("renders the loading spinner when loading CCT list", () => {
    store.dispatch(updatedCctListStatus("loading"));
    cy.get('[data-cy="loading"]').should("exist");
  });

  it("renders the loading spinner when loading LTFT summary list", () => {
    store.dispatch(updatedCctListStatus("succeeded"));
    store.dispatch(updatedLtftSummaryListStatus("loading"));
    cy.get('[data-cy="loading"]').should("exist");
  });

  it("displays error msg on either CCT list or LTFT summary list fail", () => {
    store.dispatch(updatedCctListStatus("failed"));
    store.dispatch(updatedLtftSummaryListStatus("succeeded"));
    cy.get('[data-cy="error-header-text"]')
      .should("exist")
      .contains("Oops! Something went wrong");
    cy.get('[data-cy="error-message-text"]')
      .should("exist")
      .contains(
        "There was a problem loading your saved data. Please try reloading them by refreshing the page."
      );
  });

  it("displays the 'no saved drafts' message when success and no draft CCT's", () => {
    store.dispatch(updatedCctList([]));
    store.dispatch(updatedCctListStatus("succeeded"));
    store.dispatch(updatedLtftSummaryListStatus("succeeded"));
    cy.get('[data-cy="no-saved-drafts"]').should("exist");
    cy.get("p").should("exist").contains("You have no saved calculations.");
  });

  it("renders the CctSavedDrafts on success with saved draft CCT's", () => {
    store.dispatch(updatedCctList(mockCctList));
    cy.get('[data-cy="cct-saved-drafts-table"]').should("exist");
    cy.get('[data-cy="saved-calculation-row-1"] > td').first().contains("bob2");
    cy.get('[data-cy="saved-calculation-row-0"] > td')
      .first()
      .contains("bob1")
      .click();
    cy.url().should(
      "include",
      "/cct/view/6756c2b2-3c1f-4b8d-9e0a-5f6c7d8e9f0a"
    );
  });

  it("renders the LTFT button in addition to the Delete button when user is in the ltft pilot and has a valid programme", () => {
    cy.get(
      '[data-cy="make-ltft-btn-6756c2b2-3c1f-4b8d-9e0a-5f6c7d8e9f0a"]'
    ).should("not.exist");
    cy.get('[data-cy="make-ltft-btn-c96468cc-075c-4ac8-a5a2-1b53220a807e"]')
      .should("exist")
      .click();
    // Check modal
    cy.get('[data-cy="dialogModal"]').should("be.visible");
    cy.get('[data-cy="ltft-declarations-modal-heading"]').contains(
      "Before proceeding to the main Changing hours (LTFT) application..."
    );
    cy.get('[data-cy="confirm-ltft-btn"]')
      .should("exist")
      .should("be.disabled");
    cy.get('[data-cy="modal-cancel-btn"]')
      .should("exist")
      .should("not.be.disabled");
    cy.get('[data-cy="discussedWithTpd"]').check();
    cy.get('[data-cy="confirm-ltft-btn"]').should("be.disabled");
    cy.get('[data-cy="understandStartover"]').check();
    cy.get('[data-cy="confirm-ltft-btn"]').should("not.be.disabled").click();
    cy.url().should("include", "/ltft/create");
  });
});

describe("CctSavedDrafts - not in the ltft pilot", () => {
  before(() => {
    store.dispatch(updatedUserFeatures(mockUserFeatures3));
    store.dispatch(updatedCctList(mockCctList));
    store.dispatch(updatedCctListStatus("succeeded"));
    store.dispatch(updatedLtftSummaryListStatus("succeeded"));
    store.dispatch(updatedLtftSummaryList(mockLtftsList1.slice(1)));
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/cct"]}>
          <CctSavedDrafts />
        </MemoryRouter>
      </Provider>
    );
  });

  it("doesn't render the 'ltft button' when user is not in the ltft pilot", () => {
    cy.get(
      '[data-cy="make-ltft-btn-c96468cc-075c-4ac8-a5a2-1b53220a807e"]'
    ).should("not.exist");
    cy.get('[data-cy="delete-cct-btn-c96468cc-075c-4ac8-a5a2-1b53220a807e"]')
      .should("exist")
      .click();
    cy.get('[data-cy="dialogModal"]').should("be.visible");
    cy.get('[data-cy="warningLabel-Deleting"]').should("exist");
    cy.get('[data-cy="warningText-Deleting"]')
      .should("exist")
      .contains("Are you sure? This action cannot be undone.");
    cy.get('[data-cy="modal-cancel-btn"]').should("exist");
    cy.get('[data-cy="submitBtn-Deleting"]').should("exist").click();
    cy.get('[data-cy="dialogModal"]').should("not.be.visible");
  });
});
