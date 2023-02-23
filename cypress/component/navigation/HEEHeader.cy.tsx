import { mount } from "cypress/react18";
import { Router } from "react-router-dom";
import HEEHeader from "../../../components/navigation/HEEHeader";
import history from "../../../components/navigation/history";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import { updatedPreferredMfa } from "../../../redux/slices/userSlice";

const navLinks = [
  { name: "Profile", href: "/profile" },
  { name: "Placements", href: "/placements" },
  { name: "Programmes", href: "/programmes" },
  { name: "Form R (Part A)", href: "/formr-a" },
  { name: "Form R (Part B)", href: "/formr-b" },
  { name: "Support", href: "/support" },
  { name: "MFA", href: "/mfa" }
];

describe("Header with MFA set up", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("SMS"));
    const props = {
      signOut: cy.stub()
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
    store.dispatch(updatedPreferredMfa("NOMFA"));
    const props = {
      signOut: cy.stub()
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
    { name: "MFA", href: "/mfa" }
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
      cy.get(`[data-cy="${link.name}"]`).should("not.exist");
    });
  });
});
