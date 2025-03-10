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

  it("should filter out APPROVED ltft", () => {
    cy.get("[data-cy=filterApprovedLtft]").click();
    cy.get('[data-cy="ltft-summary-table"]')
      .contains("APPROVED")
      .should("not.exist");
  });

  it("should filter out SUBMITTED ltft", () => {
    cy.get("[data-cy=filterSubmittedLtft]").click();
    cy.get('[data-cy="ltft-summary-table"]')
      .contains("SUBMITTED")
      .should("not.exist");
  });

  it("should filter out WITHDRAWN ltft", () => {
    cy.get("[data-cy=filterWithdrawnLtft]").click();
    cy.get('[data-cy="ltft-summary-table"]')
      .contains("WITHDRAWN")
      .should("not.exist");
  });
});
