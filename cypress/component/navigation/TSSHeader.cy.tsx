import { mount } from "cypress/react18";
import { Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import {
  updatedPreferredMfa,
  updatedUserFeatures
} from "../../../redux/slices/userSlice";
import { Authenticator } from "@aws-amplify/ui-react";
import TSSHeader from "../../../components/navigation/TSSHeader";
import {
  mockUserFeatures1,
  mockUserFeatures2
} from "../../../mock-data/trainee-profile";

const navLinks = [
  { name: "Changing hours (LTFT)", href: "/ltft" },
  { name: "Profile", href: "/profile" },
  { name: "Placements", href: "/placements" },
  { name: "Programmes", href: "/programmes" },
  { name: "Form R (A)", href: "/formr-a" },
  { name: "Form R (B)", href: "/formr-b" },
  { name: "Action Summary", href: "/action-summary" },
  { name: "CCT", href: "/cct" },
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
    store.dispatch(updatedPreferredMfa("TOTP"));
    store.dispatch(updatedUserFeatures(mockUserFeatures1));
    mount(comp);
  });

  it("should contain header logo", () => {
    cy.get("[data-cy=headerLogo] > a")
      .should("exist")
      .should("have.attr", "href", "/");
    cy.get("[data-cy=tssName]").should(
      "contain.text",
      "TIS Self-Service (Private Beta)"
    );
    cy.get("[data-cy=tssName] > a").should(
      "have.attr",
      "href",
      "https://architecture.digital.nhs.uk/information/glossary"
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
  it("should contain menu and sign out buttons", () => {
    cy.get(`[data-cy=menuToggleBtn]`)
      .should("exist")
      .should("contain.text", "Menu");
    cy.get("[data-cy=signOutBtn]")
      .should("exist")
      .should("contain.text", "Sign out");
  });
});

describe("Desktop Header with MFA set up", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("TOTP"));
    store.dispatch(updatedUserFeatures(mockUserFeatures2));
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
