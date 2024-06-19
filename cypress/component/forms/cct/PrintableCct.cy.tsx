/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />
import { mount } from "cypress/react18";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import { PrintableCct } from "../../../../components/forms/cct/PrintableCct";
import {
  setCurrentWte,
  setNewEndDates
} from "../../../../redux/slices/cctCalcSlice";

describe("PrintableCct", () => {
  it("renders the PrintableCct component but hidden", () => {
    store.dispatch(setCurrentWte("100%"));
    store.dispatch(
      setNewEndDates([{ ftePercent: "50%", newEndDate: "01/01/2032" }])
    );
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/programme"]}>
          <PrintableCct />
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="cct-printable"]').should("exist");
    cy.get('[data-cy="cct-printable"]').should("have.css", "display", "none");
    cy.get('[data-cy="cct-print-header"]').contains(
      "TIS Self-Service CCT Calculator"
    );
    cy.get('[data-cy="cct-current-header"]').contains("Current situation");
    cy.get('[data-cy="cct-curr-prog"]').contains("Programme:");
    cy.get('[data-cy="cct-curr-prog-end"]').contains(
      "Current Programme end date:"
    );
    cy.get('[data-cy="cct-curr-wte"]').contains("Current WTE:");

    cy.get('[data-cy="cct-changes-header"]').contains("Proposed changes");
    cy.get('[data-cy="cct-new-start"]').contains("Start Date of new WTE:");
    cy.get('[data-cy="cct-new-end"]').contains("End Date of new WTE:");
    cy.get('[data-cy="cct-th-wte"]').contains("New WTE");
    cy.get('[data-cy="cct-th-new-date"]').contains("New End Date");
    cy.get('[data-cy="cct-td-new-percent"]').contains("50%");
    cy.get('[data-cy="cct-td-new-date"]').contains("01/01/2032");
  });
});
