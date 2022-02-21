import { mount } from "@cypress/react";
import { beforeEach } from "mocha";
import { BrowserRouter } from "react-router-dom";
import HEEHeader from "../HEEHeader";

describe("Header", () => {
  beforeEach(() => {
    const props = {
      signOut: cy.stub(),
      mfa: "SMS"
    };
    mount(
      <BrowserRouter>
        <HEEHeader {...props} />
      </BrowserRouter>
    );
  });
  const navLinks = [
    { name: "Profile", href: "/profile" },
    { name: "Form R (Part A)", href: "/formr-a" },
    { name: "Form R (Part B)", href: "/formr-b" },
    { name: "Support", href: "/support" }
  ];

  it("should contain header logo", () => {
    cy.get("[data-cy=headerLogo] > a")
      .should("exist")
      .should("have.attr", "href", "/");
    cy.get("[data-cy=headerLogo] > p").should(
      "contain.text",
      "TIS Self-Service"
    );
  });

  navLinks.forEach((link, index) => {
    it(`should show the ${link.name} link in the nav menu`, () => {
      cy.get(`:nth-child(${index + 1}) > .nhsuk-header__navigation-link`)
        .should("contain.text", `${link.name}`)
        .should("have.attr", "href", `${link.href}`);
    });
  });
  it("should contain menu and logout buttons", () => {
    cy.get("[data-cy=BtnMenu]").should("exist").should("contain.text", "Menu");
    cy.get("[data-cy=logoutBtn]")
      .should("exist")
      .should("contain.text", "Logout");
  });

  navLinks.forEach((link, index) => {
    it(`should hide the ${link.name} link when NOMFA`, () => {
      const props = {
        signOut: cy.stub(),
        mfa: "NOMFA"
      };
      mount(
        <BrowserRouter>
          <HEEHeader {...props} />
        </BrowserRouter>
      );
      cy.get(
        `:nth-child(${index + 1}) > .nhsuk-header__navigation-link`
      ).should("not.exist");
    });
  });
});
