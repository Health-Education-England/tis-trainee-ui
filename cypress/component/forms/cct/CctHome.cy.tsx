import { MemoryRouter } from "react-router-dom";
import { CctHome } from "../../../../components/forms/cct/CctHome";
import { mount } from "cypress/react";

describe("CctHome", () => {
  it("says a new calculator is on its way and links to external calculators", () => {
    mount(
      <MemoryRouter initialEntries={["/cct"]}>
        <CctHome />
      </MemoryRouter>
    );
    cy.get('[data-cy="cct-home-warning-text"]').should(
      "contain.text",
      "A new CCT calculator is on its way"
    );
    cy.get('[data-cy="cct-home-warning"] a')
      .should("have.length", 2)
      .first()
      .should("have.attr", "href", "https://rcem.ac.uk/cct-recalculations/");
    cy.get('[data-cy="cct-home-warning"] a')
      .last()
      .should("have.attr", "href", "https://rcoa.ac.uk/cct-date-calculator");
  });
});
