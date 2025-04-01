import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react18";
import store from "../../../../redux/store/store";
import { LtftHome } from "../../../../components/forms/ltft/LtftHome";
import {
  updatedLtftSummaryList,
  updatedLtftSummaryListStatus
} from "../../../../redux/slices/ltftSummaryListSlice";
import { mockLtftsList1 } from "../../../../mock-data/mock-ltft-data";

const mountLtftHome = () => {
  mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/ltft"]}>
        <LtftHome />
      </MemoryRouter>
    </Provider>
  );
};

const verifyTablesDoNotExist = () => {
  cy.get('[data-cy="ltft-summary-table-CURRENT"]').should("not.exist");
  cy.get('[data-cy="ltft-summary-table-PREVIOUS"]').should("not.exist");
  cy.get('[data-cy="no-saved-drafts"]').should("not.exist");
};

describe("LtftHome", () => {
  describe("Loading state", () => {
    it("shows just the loading indicator when loading summary list", () => {
      store.dispatch(updatedLtftSummaryListStatus("loading"));
      mountLtftHome();

      cy.get('[data-cy="ltft-in-progress-header"]').should("not.exist");
      verifyTablesDoNotExist();
      cy.get('[data-cy="loading"]').should("exist");
    });
  });

  describe("Error state", () => {
    it("shows just the error message when failed ltft summary list load", () => {
      store.dispatch(updatedLtftSummaryListStatus("failed"));
      mountLtftHome();

      cy.get('[data-cy="ltft-in-progress-header"]').should("not.exist");
      verifyTablesDoNotExist();
      cy.get('[data-cy="error-header-text"]').should("exist");
    });
  });

  describe("Success state", () => {
    describe("'In progress' table", () => {
      it("should handle empty state correctly", () => {
        store.dispatch(updatedLtftSummaryList([]));
        store.dispatch(updatedLtftSummaryListStatus("succeeded"));
        mountLtftHome();

        cy.get('[data-cy="ltft-summary-table-CURRENT"]').should("not.exist");
        cy.get('[data-cy="ltft-in-progress-header"]')
          .should("exist")
          .contains("In progress applications");
        cy.get('[data-cy="no-saved-drafts"]').contains(
          "You have no in progress applications."
        );
        cy.get('[data-cy="cct-link"]')
          .should("exist")
          .should("have.attr", "href", "/cct");
        cy.get('[data-cy="ltft-previous-header"]')
          .should("exist")
          .contains("Previous applications");
      });

      it("should show table with draft applications", () => {
        store.dispatch(updatedLtftSummaryListStatus("succeeded"));
        store.dispatch(updatedLtftSummaryList(mockLtftsList1));
        mountLtftHome();

        cy.get('[data-cy="ltft-summary-table-CURRENT"]').should("exist");
        cy.get('[data-cy="filterDRAFTLtft"]').should("be.checked");
        cy.get('[data-cy="filterUNSUBMITTEDLtft"]').should("be.checked");

        // Check first row content
        cy.get(
          '[data-cy="ltft-summary-table-CURRENT"] > tbody > [data-cy="ltft-row-0"] > [data-cy="0_name"]'
        ).contains("GP hours reduction");
        cy.get(
          '[data-cy="ltft-summary-table-CURRENT"] > tbody > [data-cy="ltft-row-0"] > [data-cy="0_status"] > span'
        ).contains("DRAFT");

        // Test deletion modal
        cy.get('[data-cy="deleteLtftBtnLink"]').click();
        cy.get('[data-cy="actionModalWarning"]').should("exist");
        cy.get('[data-cy="warningLabel-Delete"]').contains("Delete");
        cy.get('[data-cy="warningText-Delete"]').should(
          "include.text",
          "Deleting this application will permanently remove it."
        );
        cy.get('[data-cy="youSureTxt"]').should("exist");
        cy.get('[data-cy="submitBtn-Delete"]').click();
      });
    });

    describe("'Previous applications' table", () => {
      it("should show submitted applications correctly", () => {
        store.dispatch(updatedLtftSummaryListStatus("succeeded"));
        store.dispatch(updatedLtftSummaryList(mockLtftsList1));
        mountLtftHome();

        // Check previous applications table content
        cy.get(
          '[data-cy="ltft-summary-table-PREVIOUS"] > tbody > [data-cy="ltft-row-1"] > [data-cy="1_name"]'
        ).contains("Programme hours reduction 2");
        cy.get(
          '[data-cy="ltft-summary-table-PREVIOUS"] > tbody > [data-cy="ltft-row-1"] > [data-cy="1_status"]'
        ).contains("SUBMITTED");

        // Test unsubmit modal
        cy.get(
          '[data-cy="1_operations"] > [data-cy="unsubmitLtftBtnLink"]'
        ).click();
        cy.get('[data-cy="actionModalWarning"]').should("exist");
        cy.get('[data-cy="warningLabel-Unsubmit"]').contains("Unsubmit");
        cy.get('[data-cy="modal-cancel-btn"]')
          .last()
          .contains("Cancel")
          .click();
      });
    });
  });
});
