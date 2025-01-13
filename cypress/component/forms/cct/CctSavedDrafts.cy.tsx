import store from "../../../../redux/store/store";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import {
  updatedCctList,
  updatedCctListStatus
} from "../../../../redux/slices/cctSummaryListSlice";
import { cctSummaryList } from "../../../../mock-data/mock-cct-data";
import { CctSavedDrafts } from "../../../../components/forms/cct/CctSavedDrafts";

describe("CctSavedDrafts", () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/cct"]}>
          <CctSavedDrafts />
        </MemoryRouter>
      </Provider>
    );
  });
  it("renders the loading spinner when loading", () => {
    store.dispatch(updatedCctListStatus("loading"));
    cy.get('[data-cy="loading"]').should("exist");
  });

  it("displays error msg on error", () => {
    store.dispatch(updatedCctListStatus("failed"));
    cy.get('[data-cy="error-header-text"]')
      .should("exist")
      .contains("Oops! Something went wrong");
    cy.get('[data-cy="error-message-text"]')
      .should("exist")
      .contains(
        "There was a problem loading your saved calculations. Please try reloading them by refreshing the page."
      );
  });

  it("displays the 'no saved drafts' message when success and no drafts", () => {
    store.dispatch(updatedCctList([]));
    store.dispatch(updatedCctListStatus("succeeded"));
    cy.get('[data-cy="no-saved-drafts"]').should("exist");
    cy.get("p").should("exist").contains("You have no saved calculations.");
  });

  it("renders the CctSavedDrafts on success", () => {
    store.dispatch(updatedCctList(cctSummaryList));
    store.dispatch(updatedCctListStatus("succeeded"));
    cy.get('[data-cy="cct-saved-drafts-table"]').should("exist");
    // check ordering (defaults desc last modified)
    cy.get('[data-cy="saved-calculation-row-2"] > td')
      .first()
      .contains("UserChosenName3");
    // clicking row uses correct id in /view
    cy.get('[data-cy="saved-calculation-row-0"] > td')
      .first()
      .contains("UserChosenName1")
      .click();
    cy.get('[data-cy="0_makeLtft"] > [data-cy="make-ltft-btn"]').should(
      "exist"
    );
    cy.url().should(
      "include",
      "/cct/view/123e4567-e89b-12d3-a456-426614174000"
    );
  });
});
