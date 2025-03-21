import React from "react";
import { mount } from "cypress/react18";
import LtftSummary from "../../../../components/forms/ltft/LtftSummary";
import { mockLtftsList1 } from "../../../../mock-data/mock-ltft-data";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import { MemoryRouter } from "react-router-dom";

describe("LtftSummary Component", () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/ltft"]}>
          <LtftSummary
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
});
