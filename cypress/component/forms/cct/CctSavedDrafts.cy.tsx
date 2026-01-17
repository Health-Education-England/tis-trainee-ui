import store from "../../../../redux/store/store";
import { mount } from "cypress/react";
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
  mockUserFeaturesLtftPilot,
  mockUserFeaturesSpecialty
} from "../../../../mock-data/trainee-profile";

describe("CctSavedDrafts", () => {
  beforeEach(() => {
    store.dispatch(updatedUserFeatures(mockUserFeaturesLtftPilot));
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
});
