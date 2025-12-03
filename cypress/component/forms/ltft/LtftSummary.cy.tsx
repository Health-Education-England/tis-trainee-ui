import React from "react";
import { mount } from "cypress/react";
import LtftSummary from "../../../../components/forms/ltft/LtftSummary";
import {
  mockLtftDraftList,
  mockLtftsList1
} from "../../../../mock-data/mock-ltft-data";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import { MemoryRouter } from "react-router-dom";
import { LtftSummaryObj } from "../../../../models/LtftTypes";

describe("LtftSummary Component", () => {
  describe("CURRENT type filtering", () => {
    beforeEach(() => {
      mount(
        <Provider store={store}>
          <MemoryRouter>
            <LtftSummary
              ltftSummaryType="CURRENT"
              ltftSummaryStatus="succeeded"
              ltftSummaryList={mockLtftDraftList as LtftSummaryObj[]}
            />
          </MemoryRouter>
        </Provider>
      );
    });

    it("should sort by lastModified descending by default", () => {
      cy.get('[data-cy="Last Updated-table-sort-desc"]').should("exist");
      cy.get("time").eq(0).should("include.text", "15 Jan 2025");
      cy.get("time").eq(3).should("include.text", "15 Aug 2024");
    });

    it("should change sort order when clicking column headers", () => {
      cy.get('[data-cy="Last Updated-table-sort-desc"]').click();
      cy.get("time").eq(0).should("include.text", "15 Aug 2024");
      cy.get("time").eq(3).should("include.text", "15 Jan 2025");
      cy.get('[data-cy="Last Updated-table-sort-asc"]').should("exist");
      cy.get('[data-cy="Last Updated-table-sort-asc"]').click();
      cy.get('[data-cy="Last Updated-table-sort-none"]').should("exist");
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
      cy.contains("Wed, 15 Jan 2025 15:50:36 GMT").should("not.exist");
      cy.contains("Programme hours reduction 2").should("exist");
      cy.contains("Programme hours reduction 5").should("exist");
    });

    it("should filter table when toggling UNSUBMITTED status", () => {
      cy.get('[data-cy^="ltft-row-"]').should("have.length", 4);
      cy.get('[data-cy="filterUNSUBMITTEDLtft"]').click();
      cy.get('[data-cy^="ltft-row-"]').should("have.length", 2);
      cy.contains("15 Jan 2025").should("exist");
      cy.contains("Programme hours reduction 2").should("not.exist");
      cy.contains("Programme hours reduction 5").should("not.exist");
    });

    it("should show no rows when all filters are toggled off", () => {
      cy.get('[data-cy="filterDRAFTLtft"]').click();
      cy.get('[data-cy="filterUNSUBMITTEDLtft"]').click();
      cy.get('[data-cy^="ltft-row-"]').should("not.exist");
    });

    it("should show modified by role on UNSUBMITTED application", () => {
      cy.get('[data-cy="2_status"]').should(
        "have.text",
        "UNSUBMITTED by Local Office"
      );
      cy.get('[data-cy="3_status"]').should("have.text", "UNSUBMITTED by me");
    });

    it("should show reason and message on UNSUBMITTED application", () => {
      cy.get('[data-cy="2_reason"]').should(
        "contain.text",
        "Change WTE percentage"
      );
      cy.get('[data-cy="2_reason"]')
        .find('[data-cy$="-statusMessage-icon"]')
        .should("not.exist");
      cy.get('[data-cy="3_reason"]')
        .should("contain.text", "other reason")
        .find('[data-cy$="-statusMessage-icon"]')
        .click();
      cy.get(".tooltipContent")
        .should("be.visible")
        .and(
          "contain.text",
          "Mock status message with long long long paragraph"
        );
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

    it("should display APPROVED, REJECTED, SUBMITTED, and WITHDRAWN filters", () => {
      cy.get('[data-cy="filterAPPROVEDLtft"]').should("exist");
      cy.get('[data-cy="filterREJECTEDLtft"]').should("exist");
      cy.get('[data-cy="filterSUBMITTEDLtft"]').should("exist");
      cy.get('[data-cy="filterWITHDRAWNLtft"]').should("exist");
      cy.get('[data-cy="filterDRAFTLtft"]').should("not.exist");
      cy.get('[data-cy="filterUNSUBMITTEDLtft"]').should("not.exist");
    });

    it("should filter table when toggling APPROVED status", () => {
      cy.get('[data-cy="filterAPPROVEDLtft"]').click();
      cy.contains("Programme hours reduction 1").should("not.exist");
    });

    it("should filter table when toggling REJECTED status", () => {
      cy.get('[data-cy="filterREJECTEDLtft"]').click();
      cy.contains("Programme hours reduction 5").should("not.exist");
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
      cy.get('[data-cy="filterREJECTEDLtft"]').click();
      cy.get('[data-cy="filterSUBMITTEDLtft"]').click();
      cy.get('[data-cy="filterWITHDRAWNLtft"]').click();
      cy.get('[data-cy^="ltft-row-"]').should("have.length", 2);
      cy.get('[data-cy^="ltft-row-"]')
        .last()
        .should("include.text", "ltft_-1_002");
      cy.contains("Programme hours reduction 1").should("exist");
    });

    it("should show reason and message on REJECTED application", () => {
      cy.get('[data-cy="5_reason"]')
        .should("contain.text", "Rejected Reason")
        .find('[data-cy$="-statusMessage-icon"]')
        .click();
      cy.get(".tooltipContent")
        .should("be.visible")
        .and("contain.text", "Rejected Message");
    });
  });
});
//Note: row click tests in LtftSummary.test.tsx
