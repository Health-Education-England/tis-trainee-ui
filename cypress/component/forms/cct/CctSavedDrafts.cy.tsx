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
import { updatedLtftSummaryListStatus } from "../../../../redux/slices/ltftSummaryListSlice";

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

  it("displays the 'no saved drafts' message when success and no drafts", () => {
    store.dispatch(updatedCctList([]));
    store.dispatch(updatedCctListStatus("succeeded"));
    store.dispatch(updatedLtftSummaryListStatus("succeeded"));
    cy.get('[data-cy="no-saved-drafts"]').should("exist");
    cy.get("p").should("exist").contains("You have no saved calculations.");
  });

  it("renders the CctSavedDrafts on success", () => {
    store.dispatch(updatedCctList(mockCctList));
    store.dispatch(updatedCctListStatus("succeeded"));
    store.dispatch(updatedLtftSummaryListStatus("succeeded"));
    cy.get('[data-cy="cct-saved-drafts-table"]').should("exist");
    // check ordering (defaults desc last modified)
    cy.get('[data-cy="saved-calculation-row-1"] > td').first().contains("bob2");
    // clicking row uses correct id in /view
    cy.get('[data-cy="saved-calculation-row-0"] > td')
      .first()
      .contains("bob1")
      .click();
    cy.url().should("include", "/cct/view/6756c2b57ee98643d6f3dd8b");
  });
});
