/// <reference types="cypress" />

import { mount } from "@cypress/react";
import { Router } from "react-router-dom";
import { mockProgrammeMemberships } from "../../../mock-data/trainee-profile";
import history from "../../navigation/history";
import Programmes from "./Programmes";

describe("Programmes", () => {
  it("should show programme expander", () => {
    mount(
      <Router history={history}>
        <Programmes programmeMemberships={mockProgrammeMemberships} />
      </Router>
    );
    cy.get("[data-cy=programmesExpander]").should("exist");
    cy.get("[data-cy=progNameValue]")
      .first()
      .should("exist")
      .should("include.text", "Cardiology");
    cy.get("[data-cy=progNameValue]")
      .last()
      .should("exist")
      .should("include.text", "General Practice");
  });

  it("should not show programme expander if no programme", () => {
    mount(
      <Router history={history}>
        <Programmes programmeMemberships={null} />
      </Router>
    );
    cy.get("[data-cy=programmesExpander]").should("not.exist");
    cy.get("[data-cy=progNameValue]").should("not.exist");
  });
});
