import { mount } from "cypress/react18";
import { beforeEach, describe } from "mocha";
import { Router } from "react-router-dom";
import HEEHeader from "../../../src/components/navigation/HEEHeader";
import history from "../../../src/components/navigation/history";
import { Provider } from "react-redux";
import store from "../../../src/redux/store/store";
import React from "react";

const navLinks = [
  { name: "Profile", href: "/profile" },
  { name: "Form R (Part A)", href: "/formr-a" },
  { name: "Form R (Part B)", href: "/formr-b" },
  { name: "Support", href: "/support" },
  { name: "MFA set-up", href: "/mfa" }
];

describe("Header with MFA set up", () => {
  beforeEach(() => {
    const props = {
      signOut: cy.stub(),
      mfa: "SMS"
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <HEEHeader {...props} />
        </Router>
      </Provider>
    );
  });

  it("should contain header logo", () => {
    cy.get("[data-cy=headerLogo] > a")
      .should("exist")
      .should("have.attr", "href", "/");
    cy.get("[data-cy=headerLogo] > p").should(
      "contain.text",
      "TIS Self-Service"
    );
  });

  navLinks.forEach(link => {
    it(`should show the ${link.name} link in the nav menu`, () => {
      cy.get(`[data-cy="${link.name}"]`)
        .should("exist")
        .should("contain.text", `${link.name}`)
        .should("have.attr", "href", `${link.href}`);
    });
  });
  it("should contain menu and logout buttons", () => {
    cy.get(`[data-cy=BtnMenu]`).should("exist").should("contain.text", "Menu");
    cy.get("[data-cy=logoutBtn]")
      .should("exist")
      .should("contain.text", "Logout");
  });
});

describe("Header with NOMFA", () => {
  beforeEach(() => {
    const props = {
      signOut: cy.stub(),
      mfa: "NOMFA"
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <HEEHeader {...props} />
        </Router>
      </Provider>
    );
  });
  const noMfaNavLinks = [
    { name: "Support", href: "/support" },
    { name: "MFA set-up", href: "/mfa" }
  ];

  const mfaOnlyLinks = navLinks.slice(0, 2);

  noMfaNavLinks.forEach(link => {
    it(`should show the ${link.name} link in the nav menu`, () => {
      cy.get(`[data-cy="${link.name}"]`)
        .should("exist")
        .should("contain.text", `${link.name}`)
        .should("have.attr", "href", `${link.href}`);
    });
  });

  mfaOnlyLinks.forEach(link => {
    it(`should show the ${link.name} link in the nav menu`, () => {
      cy.get(`[data-cy="${link.name}"]`).should("not.exist");
    });
  });
});
