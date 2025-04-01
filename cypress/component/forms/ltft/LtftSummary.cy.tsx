import React from "react";
import { mount } from "cypress/react18";
import LtftSummary from "../../../../components/forms/ltft/LtftSummary";
import {
  mockLtftDraftList,
  mockLtftsList1
} from "../../../../mock-data/mock-ltft-data";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import { MemoryRouter } from "react-router-dom";
import * as FormBuilderUtilities from "../../../../utilities/FormBuilderUtilities";
import history from "../../../../components/navigation/history";

describe("LtftSummary Component", () => {
  describe("CURRENT type filtering", () => {
    beforeEach(() => {
      mount(
        <Provider store={store}>
          <MemoryRouter>
            <LtftSummary
              ltftSummaryType="CURRENT"
              ltftSummaryStatus="succeeded"
              ltftSummaryList={mockLtftDraftList}
            />
          </MemoryRouter>
        </Provider>
      );
    });

    it("should sort by lastModified descending by default", () => {
      cy.get('[data-cy^="ltft-row-"]').eq(0).contains("GP hours reduction");
      cy.get('[data-cy^="ltft-row-"]')
        .eq(3)
        .contains("Programme hours reduction 5");
    });

    it("should change sort order when clicking column headers", () => {
      const nameSortToggler =
        '[data-cy="ltft-summary-table-name"] > div > .table-header-btn > .nhsuk-u-padding-left-2';
      cy.get(nameSortToggler).click();
      cy.get('[data-cy^="ltft-row-"]').first().contains("GP hours reduction");
      cy.get(nameSortToggler).click();
      cy.get('[data-cy^="ltft-row-"]').last().contains("GP hours reduction");
    });

    it("should display DRAFT and UNSUBMITTED filters", () => {
      cy.get('[data-cy="filterDRAFTLtft"]').should("exist");
      cy.get('[data-cy="filterUNSUBMITTEDLtft"]').should("exist");
      cy.get('[data-cy="filterAPPROVEDLtft"]').should("not.exist");
      cy.get('[data-cy="filterSUBMITTEDLtft"]').should("not.exist");
      cy.get('[data-cy="filterWITHDRAWNLtft"]').should("not.exist");
    });

    it("should filter table when toggling DRAFT status", () => {
      cy.get('[data-cy^="ltft-row-"]').should("have.length", 4);
      cy.get('[data-cy="filterDRAFTLtft"]').click();
      cy.get('[data-cy^="ltft-row-"]').should("have.length", 2);
      cy.contains("GP hours reduction").should("not.exist");
      cy.contains("Programme hours reduction 2").should("exist");
      cy.contains("Programme hours reduction 5").should("exist");
    });

    it("should filter table when toggling UNSUBMITTED status", () => {
      cy.get('[data-cy^="ltft-row-"]').should("have.length", 4);

      cy.get('[data-cy="filterUNSUBMITTEDLtft"]').click();

      cy.get('[data-cy^="ltft-row-"]').should("have.length", 2);
      cy.contains("GP hours reduction").should("exist");
      cy.contains("Programme hours reduction 2").should("not.exist");
      cy.contains("Programme hours reduction 5").should("not.exist");
    });

    it("should show no rows when all filters are toggled off", () => {
      cy.get('[data-cy="filterDRAFTLtft"]').click();
      cy.get('[data-cy="filterUNSUBMITTEDLtft"]').click();
      cy.get('[data-cy^="ltft-row-"]').should("not.exist");
    });
  });

  describe("PREVIOUS type filtering", () => {
    beforeEach(() => {
      mount(
        <Provider store={store}>
          <MemoryRouter>
            <LtftSummary
              ltftSummaryType="PREVIOUS"
              ltftSummaryStatus="succeeded"
              ltftSummaryList={mockLtftsList1}
            />
          </MemoryRouter>
        </Provider>
      );
    });

    it("should display APPROVED, SUBMITTED, and WITHDRAWN filters", () => {
      cy.get('[data-cy="filterAPPROVEDLtft"]').should("exist");
      cy.get('[data-cy="filterSUBMITTEDLtft"]').should("exist");
      cy.get('[data-cy="filterWITHDRAWNLtft"]').should("exist");
      cy.get('[data-cy="filterDRAFTLtft"]').should("not.exist");
      cy.get('[data-cy="filterUNSUBMITTEDLtft"]').should("not.exist");
    });

    it("should filter table when toggling APPROVED status", () => {
      cy.get('[data-cy="filterAPPROVEDLtft"]').click();
      cy.contains("Programme hours reduction 1").should("not.exist");
    });

    it("should filter table when toggling SUBMITTED status", () => {
      cy.get('[data-cy="filterSUBMITTEDLtft"]').click();
      cy.contains("Programme hours reduction 2").should("not.exist");
      cy.contains("Programme hours reduction 3").should("not.exist");
    });

    it("should filter table when toggling WITHDRAWN status", () => {
      cy.get('[data-cy="filterWITHDRAWNLtft"]').click();
      cy.contains("Programme hours reduction 4").should("not.exist");
    });

    it("should show only relevant rows when multiple filters are combined", () => {
      cy.get('[data-cy="filterSUBMITTEDLtft"]').click();
      cy.get('[data-cy="filterWITHDRAWNLtft"]').click();
      cy.get('[data-cy^="ltft-row-"]').should("have.length", 2);
      cy.contains("Programme hours reduction 1").should("exist");
    });
  });
});
//Note: row click tests in LtftSummary.test.tsx
