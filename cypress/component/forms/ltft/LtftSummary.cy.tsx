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

describe("LtftSummary Component - CURRENT summary", () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/ltft"]}>
          <LtftSummary
            ltftSummaryType={"CURRENT"}
            ltftSummaryStatus={"succeeded"}
            ltftSummaryList={mockLtftDraftList}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  it("should render the table", () => {
    cy.get("[data-cy=ltft-summary-table]").should("exist");
  });

  it("should display correct table headers", () => {
    cy.get("thead tr").within(() => {
      cy.contains("Name").should("exist");
      cy.contains("Created").should("exist");
      cy.contains("Last modified").should("exist");
      cy.contains("Status").should("exist");
    });
  });

  it("should only show DRAFT and UNSUBMITTED status filters", () => {
    cy.get('[data-cy="filterDRAFTLtft"]').should("exist");
    cy.get('[data-cy="filterUNSUBMITTEDLtft"]').should("exist");
    cy.get('[data-cy="filterAPPROVEDLtft"]').should("not.exist");
    cy.get('[data-cy="filterSUBMITTEDLtft"]').should("not.exist");
    cy.get('[data-cy="filterWITHDRAWNLtft"]').should("not.exist");
  });

  ["DRAFT", "UNSUBMITTED"].forEach(status => {
    it(`should filter out ${status} ltft`, () => {
      cy.get(`[data-cy="filter${status}Ltft"]`).should("be.checked");
      cy.get(`[data-cy="filter${status}Ltft"]`).click();
      cy.get('[data-cy="ltft-summary-table"]')
        .contains(status)
        .should("not.exist");
    });
  });

  it("should navigate to correct URL when a row is clicked", () => {
    cy.get("[data-cy=ltft-summary-table] tbody tr").first().click();
    cy.url().should("include", "/ltft/create");
  });

  it("should show Delete button for DRAFT status", () => {
    cy.get('[data-cy="ltft-summary-table"]')
      .contains("DRAFT")
      .parent()
      .parent()
      .find('[data-cy="deleteLtftBtnLink"]')
      .should("exist");
  });

  it("should show Withdraw button for UNSUBMITTED status", () => {
    cy.get('[data-cy="ltft-summary-table"]')
      .contains("UNSUBMITTED")
      .parent()
      .parent()
      .find('[data-cy="withdrawLtftBtnLink"]')
      .should("exist");
  });
});

describe("LtftSummary Component - no CURRENT application", () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/ltft"]}>
          <LtftSummary
            ltftSummaryType={"CURRENT"}
            ltftSummaryStatus={"succeeded"}
            ltftSummaryList={[]}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  it("should not render the table", () => {
    cy.get("[data-cy=ltft-summary-table]").should("not.exist");
    cy.contains("You have no current applications.").should("exist");
  });
});

describe("LtftSummary Component - PREVIOUS summary", () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/ltft"]}>
          <LtftSummary
            ltftSummaryType={"PREVIOUS"}
            ltftSummaryStatus={"succeeded"}
            ltftSummaryList={mockLtftsList1}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  it("should render the table", () => {
    cy.get("[data-cy=ltft-summary-table]").should("exist");
  });

  it("should display correct table headers", () => {
    cy.get("thead tr").within(() => {
      cy.contains("Name").should("exist");
      cy.contains("Created").should("exist");
      cy.contains("Last modified").should("exist");
      cy.contains("Status").should("exist");
    });
  });

  it("should only show APPROVED, SUBMITTED, and WITHDRAWN status filters", () => {
    cy.get('[data-cy="filterAPPROVEDLtft"]').should("exist");
    cy.get('[data-cy="filterSUBMITTEDLtft"]').should("exist");
    cy.get('[data-cy="filterWITHDRAWNLtft"]').should("exist");
    cy.get('[data-cy="filterDRAFTLtft"]').should("not.exist");
    cy.get('[data-cy="filterUNSUBMITTEDLtft"]').should("not.exist");
  });

  ["APPROVED", "SUBMITTED", "WITHDRAWN"].forEach(status => {
    it(`should filter out ${status} ltft`, () => {
      cy.get(`[data-cy="filter${status}Ltft"]`).click();
      cy.get('[data-cy="ltft-summary-table"]')
        .contains(status)
        .should("not.exist");
    });
  });

  it("should navigate to correct URL when a row is clicked", () => {
    cy.get("[data-cy=ltft-summary-table] tbody tr").first().click();
    cy.url().should("include", "/ltft/123e4567-e89b-12d3-a456-426614174000");
  });

  it("should show Unsubmit and Withdraw buttons for SUBMITTED status", () => {
    cy.get('[data-cy="ltft-summary-table"]')
      .contains("SUBMITTED")
      .parent()
      .parent()
      .within(() => {
        cy.get('[data-cy="unsubmitLtftBtnLink"]').should("exist");
        cy.get('[data-cy="withdrawLtftBtnLink"]').should("exist");
      });
  });
});

describe("LtftSummary Component - no PREVIOUS application", () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/ltft"]}>
          <LtftSummary
            ltftSummaryType={"PREVIOUS"}
            ltftSummaryStatus={"succeeded"}
            ltftSummaryList={[]}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  it("should not render the table", () => {
    cy.get("[data-cy=ltft-summary-table]").should("not.exist");
    cy.contains("You have no previous applications.").should("exist");
  });
});
