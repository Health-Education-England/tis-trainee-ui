import { mount } from "cypress/react";
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
  mockUserFeaturesLtftPilot,
  mockUserFeaturesNonSpecialty,
  mockUserFeaturesSpecialty,
  mockUserFeaturesNone
} from "../../../mock-data/trainee-profile";

const navLinksBase = [
  { name: "Support", href: "/support" },
  { name: "MFA set-up", href: "/mfa" }
];

const navLinksNonSpecialty = [
  ...navLinksBase,
  { name: "Profile", href: "/profile" },
  { name: "Placements", href: "/placements" },
  { name: "Programmes", href: "/programmes" }
];

const navLinksSpecialty = [
  ...navLinksNonSpecialty,
  { name: "Form R (A)", href: "/formr-a" },
  { name: "Form R (B)", href: "/formr-b" },
  { name: "Action Summary", href: "/action-summary" },
  { name: "CCT", href: "/cct" }
];

const navLinksLtftPilot = [
  ...navLinksSpecialty,
  { name: "Less than full-time (LTFT)", href: "/ltft" }
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

  it("should contain menu and sign out buttons", () => {
    cy.get(`[data-cy=menuToggleBtn]`)
      .should("exist")
      .should("contain.text", "Menu");
    cy.get("[data-cy=signOutBtn]")
      .should("exist")
      .should("contain.text", "Sign out");
  });

  describe("When all features disabled", () => {
    beforeEach(() => {
      store.dispatch(updatedUserFeatures(mockUserFeaturesNone));
      mount(comp);
    });

    it("should not contain notification buttons", () => {
      cy.get(`[data-cy=emailBtn]`).should("not.exist");
      cy.get("[data-cy=notificationBtn]").should("not.exist");
    });

    navLinksBase.forEach(link => {
      it(`should show the ${link.name} link in the nav menu`, () => {
        cy.get(`[data-cy="${link.name}"]`)
          .should("exist")
          .should("contain.text", `${link.name}`)
          .should("have.attr", "href", `${link.href}`);
      });
    });

    it("should not display any unexpected links", () => {
      cy.get('[data-cy="nav-link-wrapper"]:not([hidden])')
        .its("length")
        .should("eq", navLinksBase.length);
    });
  });

  describe("Non-specialty user", () => {
    beforeEach(() => {
      store.dispatch(updatedUserFeatures(mockUserFeaturesNonSpecialty));
      mount(comp);
    });

    it("should not contain notification buttons", () => {
      cy.get(`[data-cy=emailBtn]`).should("not.exist");
      cy.get("[data-cy=notificationBtn]").should("not.exist");
    });

    navLinksNonSpecialty.forEach(link => {
      it(`should show the ${link.name} link in the nav menu`, () => {
        cy.get(`[data-cy="${link.name}"]`)
          .should("exist")
          .should("contain.text", `${link.name}`)
          .should("have.attr", "href", `${link.href}`);
      });
    });

    it("should not display any unexpected links", () => {
      cy.get('[data-cy="nav-link-wrapper"]:not([hidden])')
        .its("length")
        .should("eq", navLinksNonSpecialty.length);
    });
  });

  describe("Specialty user", () => {
    beforeEach(() => {
      store.dispatch(updatedUserFeatures(mockUserFeaturesSpecialty));
      mount(comp);
    });

    it("should contain notification buttons", () => {
      cy.get(`[data-cy=emailBtn]`)
        .should("exist")
        .find("svg.fa-envelope")
        .should("exist");
      cy.get("[data-cy=notificationBtn]")
        .should("exist")
        .find("svg.fa-bell")
        .should("exist");
    });

    navLinksSpecialty.forEach(link => {
      it(`should show the ${link.name} link in the nav menu`, () => {
        cy.get(`[data-cy="${link.name}"]`)
          .should("exist")
          .should("contain.text", `${link.name}`)
          .should("have.attr", "href", `${link.href}`);
      });
    });

    it("should not display any unexpected links", () => {
      cy.get('[data-cy="nav-link-wrapper"]:not([hidden])')
        .its("length")
        .should("eq", navLinksSpecialty.length);
    });
  });

  describe("LTFT pilot user", () => {
    beforeEach(() => {
      store.dispatch(updatedUserFeatures(mockUserFeaturesLtftPilot));
      mount(comp);
    });

    it("should contain notification buttons", () => {
      cy.get(`[data-cy=emailBtn]`)
        .should("exist")
        .find("svg.fa-envelope")
        .should("exist");
      cy.get("[data-cy=notificationBtn]")
        .should("exist")
        .find("svg.fa-bell")
        .should("exist");
    });

    navLinksLtftPilot.forEach(link => {
      it(`should show the ${link.name} link in the nav menu`, () => {
        cy.get(`[data-cy="${link.name}"]`)
          .should("exist")
          .should("contain.text", `${link.name}`)
          .should("have.attr", "href", `${link.href}`);
      });
    });

    it("should not display any unexpected links", () => {
      cy.get('[data-cy="nav-link-wrapper"]:not([hidden])')
        .its("length")
        .should("eq", navLinksLtftPilot.length);
    });
  });
});

describe("Desktop Header with MFA set up", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("TOTP"));
    mount(comp);
    cy.viewport(1024, 768);
  });

  it("should contain header logo", () => {
    cy.get("[data-cy=headerLogo] > a")
      .should("be.visible")
      .should("have.attr", "href", "/");
    cy.get("[data-cy=tssName]").should("contain.text", "TIS Self-Service");
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

  describe("When all features disabled", () => {
    beforeEach(() => {
      store.dispatch(updatedUserFeatures(mockUserFeaturesNone));
      mount(comp);
    });

    it("should not contain notification buttons", () => {
      cy.get(`[data-cy=emailBtn]`).should("not.exist");
      cy.get("[data-cy=notificationBtn]").should("not.exist");
    });

    it("should not display any unexpected links", () => {
      cy.get('[data-cy="nav-link-wrapper"]:visible').should("not.exist");
    });
  });

  describe("Non-specialty user", () => {
    beforeEach(() => {
      store.dispatch(updatedUserFeatures(mockUserFeaturesNonSpecialty));
      mount(comp);
    });

    it("should not contain notification buttons", () => {
      cy.get(`[data-cy=emailBtn]`).should("not.exist");
      cy.get("[data-cy=notificationBtn]").should("not.exist");
    });

    navLinksNonSpecialty.slice(2).forEach(link => {
      it(`should show the ${link.name} link in the nav menu`, () => {
        cy.get(`[data-cy="${link.name}"]`)
          .should("exist")
          .should("contain.text", `${link.name}`)
          .should("have.attr", "href", `${link.href}`);
      });
    });

    it("should not display any unexpected links", () => {
      cy.get('[data-cy="nav-link-wrapper"]:visible')
        .its("length")
        .should("eq", navLinksNonSpecialty.length - 2);
    });
  });

  describe("Specialty user", () => {
    beforeEach(() => {
      store.dispatch(updatedUserFeatures(mockUserFeaturesSpecialty));
      mount(comp);
    });

    it("should contain notification buttons", () => {
      cy.get(`[data-cy=emailBtn]`)
        .should("exist")
        .find("svg.fa-envelope")
        .should("exist");
      cy.get("[data-cy=notificationBtn]")
        .should("exist")
        .find("svg.fa-bell")
        .should("exist");
    });

    navLinksSpecialty.slice(2).forEach(link => {
      it(`should show the ${link.name} link in the nav menu`, () => {
        cy.get(`[data-cy="${link.name}"]`)
          .should("exist")
          .should("contain.text", `${link.name}`)
          .should("have.attr", "href", `${link.href}`);
      });
    });

    it("should not display any unexpected links", () => {
      cy.get('[data-cy="nav-link-wrapper"]:visible')
        .its("length")
        .should("eq", navLinksSpecialty.length - 2);
    });
  });

  describe("LTFT pilot user", () => {
    beforeEach(() => {
      store.dispatch(updatedUserFeatures(mockUserFeaturesLtftPilot));
      mount(comp);
    });

    it("should contain notification buttons", () => {
      cy.get(`[data-cy=emailBtn]`)
        .should("exist")
        .find("svg.fa-envelope")
        .should("exist");
      cy.get("[data-cy=notificationBtn]")
        .should("exist")
        .find("svg.fa-bell")
        .should("exist");
    });

    navLinksLtftPilot.slice(2).forEach(link => {
      it(`should show the ${link.name} link in the nav menu`, () => {
        cy.get(`[data-cy="${link.name}"]`)
          .should("exist")
          .should("contain.text", `${link.name}`)
          .should("have.attr", "href", `${link.href}`);
      });
    });

    it("should not display any unexpected links", () => {
      cy.get('[data-cy="nav-link-wrapper"]:visible')
        .its("length")
        .should("eq", navLinksLtftPilot.length - 2);
    });
  });
});
