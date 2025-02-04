import React from "react";
import { mount } from "cypress/react18";
import LtftSummary from "../../../../components/forms/ltft/LtftSummary";
import { mockLtftsList1 } from "../../../../mock-data/mock-ltft-data";

describe("LtftSummary Component", () => {
  beforeEach(() => {
    mount(<LtftSummary ltftSummaryList={mockLtftsList1} />);
  });

  it("should render the table", () => {
    cy.get("[data-cy=ltftSummary]").should("exist");
  });

  it("should display only non-draft entries", () => {
    cy.get("tbody tr").should("have.length", 2);
    cy.contains("Draft User").should("not.exist");
  });

  it("should display correct table headers", () => {
    cy.get("thead tr").within(() => {
      cy.contains("Name").should("exist");
      cy.contains("Created date").should("exist");
      cy.contains("Last Modified date").should("exist");
      cy.contains("Status").should("exist");
    });
  });

  it("should sort by last modified date desc", () => {
    cy.get('[data-cy="lastModified-0"]').contains("15/12/2024");
    cy.get('[data-cy="lastModified-1"]').contains("15/10/2024");
  });
});
