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
import { updatedCognitoGroups } from "../../../../redux/slices/userSlice";
import {
  mockLtftDraft,
  mockLtftsPrevious
} from "../../../../mock-data/mock-ltft-data";

describe("CctSavedDrafts", () => {
  beforeEach(() => {
    store.dispatch(updatedCognitoGroups(["beta-consultants"]));
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
    cy.url().should("include", "/cct/view/6756c2b57ee98643d6f3dd8b");
  });
});

describe("CctSavedDrafts - beta tester", () => {
  beforeEach(() => {
    store.dispatch(updatedCognitoGroups(["beta-consultants"]));
    store.dispatch(updatedCctList(mockCctList));
    store.dispatch(updatedCctListStatus("succeeded"));
    store.dispatch(updatedLtftSummaryListStatus("succeeded"));
    store.dispatch(
      updatedLtftSummaryList([...mockLtftsPrevious, mockLtftDraft])
    );
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/cct"]}>
          <CctSavedDrafts />
        </MemoryRouter>
      </Provider>
    );
  });

  it("renders the 'ltft button' when user is a beta tester and they have an in progress ltft", () => {
    cy.get('[data-cy="make-ltft-btn-6756c2b57ee98643d6f3dd8b"]').should(
      "exist"
    );
  });
  it("doesn't render the 'ltft button' when user is a beta tester and they have no in progress ltfts", () => {
    store.dispatch(updatedLtftSummaryList(mockLtftsPrevious));
    cy.get('[data-cy="make-ltft-btn-6756c2b57ee98643d6f3dd8b]').should(
      "not.exist"
    );
  });
});

describe("CctSavedDrafts - not a beta tester", () => {
  before(() => {
    store.dispatch(updatedCognitoGroups(["other-consultants"]));
    store.dispatch(updatedCctList(mockCctList));
    store.dispatch(updatedCctListStatus("succeeded"));
    store.dispatch(updatedLtftSummaryListStatus("succeeded"));
    store.dispatch(
      updatedLtftSummaryList([...mockLtftsPrevious, mockLtftDraft])
    );
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/cct"]}>
          <CctSavedDrafts />
        </MemoryRouter>
      </Provider>
    );
  });

  it("doesn't render the 'ltft button' when user is not a beta tester", () => {
    cy.get('[data-cy="make-ltft-btn-6756c2b57ee98643d6f3dd8b]').should(
      "not.exist"
    );
  });
});
