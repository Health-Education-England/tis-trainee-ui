/// <reference types="cypress" />

import { mount } from "@cypress/react";
import { Router } from "react-router-dom";
import { mockPlacements } from "../../../mock-data/trainee-profile";
import history from "../../navigation/history";
import { PlacementPanel } from "./PlacementPanel";

describe("Placement Panel", () => {
  it("should show placement details", () => {
    mount(
      <Router history={history}>
        <PlacementPanel placement={mockPlacements[0]} panelKey={1} />
      </Router>
    );
    cy.get("[data-cy=siteValue]")
      .should("exist")
      .should("include.text", "Addenbrookes Hospital");
    cy.get("[data-cy=wteValue]").should("exist").should("include.text", "0.5");
    cy.get("[data-cy=specialtyValue]")
      .should("exist")
      .should("include.text", "Dermatology");
    cy.get("[data-cy=gradeValue]")
      .should("exist")
      .should("include.text", "ST1");
    cy.get("[data-cy=placementTypeValue]")
      .should("exist")
      .should("include.text", "In Post");
    cy.get("[data-cy=empBodyValue]")
      .should("exist")
      .should("include.text", "Employing body");
    cy.get("[data-cy=traBodyValue]")
      .should("exist")
      .should("include.text", "Training body");
    cy.get("[data-cy=dspIssueDateKey]").should("exist");
    cy.get("[data-cy=dspBtnplacement1]").should("exist");
  });
});
