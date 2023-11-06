import { mount } from "cypress/react18";
import { Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import { updatedPreferredMfa } from "../../../redux/slices/userSlice";
import { Authenticator } from "@aws-amplify/ui-react";
import TSSHeader from "../../../components/navigation/TSSHeader";

const navLinks = [
  { name: "Profile", href: "/profile" },
  { name: "Placements", href: "/placements" },
  { name: "Programmes", href: "/programmes" },
  { name: "Form R (A)", href: "/formr-a" },
  { name: "Form R (B)", href: "/formr-b" },
  { name: "Support", href: "/support" },
  { name: "MFA set-up", href: "/mfa" }
];

const comp = (
  <Authenticator.Provider>
    <Provider store={store}>
      <Router history={history}>
        <TSSHeader />
      </Router>
    </Provider>
  </Authenticator.Provider>
);

describe("Header with MFA set up", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("SMS"));
    mount(comp);
  });

  it("should contain header logo", () => {
    cy.get("[data-cy=headerLogo] > a")
      .should("exist")
      .should("have.attr", "href", "/");
    cy.get("[data-cy=tssName]").should("contain.text", "TIS Self-Service");
  });

  navLinks.forEach(link => {
    it(`should show the ${link.name} link in the nav menu`, () => {
      cy.get(`[data-cy="${link.name}"]`)
        .should("exist")
        .should("contain.text", `${link.name}`)
        .should("have.attr", "href", `${link.href}`);
    });
  });
  it("should contain menu and sign out buttons", () => {
    cy.get(`[data-cy=menuToggleBtn]`)
      .should("exist")
      .should("contain.text", "Menu");
    cy.get("[data-cy=signOutBtn]")
      .should("exist")
      .should("contain.text", "Sign out");
  });
});

describe("Header with NOMFA", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("NOMFA"));
    mount(comp);
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
    it(`should not show the ${link.name} link in the nav menu`, () => {
      cy.get(`[data-cy="${link.name}"]`).should("not.be.visible");
    });
  });
  it("should contain menu and sign out buttons", () => {
    cy.get(`[data-cy=menuToggleBtn]`).should("exist");
    cy.get("[data-cy=signOutBtn]").should("exist");
  });

  it("should contain the menu title and alternative menu close icon", () => {
    cy.get(".nhsuk-header__navigation-title").should("not.be.visible");
    cy.get(".nhsuk-header__navigation-close").should("not.be.visible");
    cy.get(`[data-cy=menuToggleBtn]`).click();
    cy.get(".nhsuk-header__navigation-title")
      .should("be.visible")
      .should("contain.text", "Menu");
    cy.get(".nhsuk-header__navigation-close").should("be.visible").click();
    cy.get(".nhsuk-header__navigation-title").should("not.be.visible");
    cy.get(".nhsuk-header__navigation-close").should("not.be.visible");
  });
});

describe("Desktop Header with MFA set up", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("SMS"));
    mount(comp);
    cy.viewport(1024, 768);
  });

  it("should contain header logo", () => {
    cy.get("[data-cy=headerLogo] > a")
      .should("be.visible")
      .should("have.attr", "href", "/");
    cy.get("[data-cy=tssName]").should("contain.text", "TIS Self-Service");
  });

  navLinks.slice(0, -2).forEach(link => {
    it(`should show the ${link.name} link in the nav menu`, () => {
      cy.get(`[data-cy="${link.name}"]`)
        .should("be.visible")
        .should("contain.text", `${link.name}`)
        .should("have.attr", "href", `${link.href}`);
    });
  });

  it("should contain top nav container", () => {
    cy.get(".top-nav-container").should("be.visible");
    cy.get('.top-nav-container > [data-cy="signOutBtn"]').should("be.visible");
    cy.get('.top-nav-container > [data-cy="topNavSupport"]')
      .should("be.visible")
      .should("contain.text", "Support")
      .should("have.attr", "href", "/support");
    cy.get('.top-nav-container > [data-cy="topNavMfaSetup"]')
      .should("be.visible")
      .should("contain.text", "MFA set-up")
      .should("have.attr", "href", "/mfa");
  });
});
