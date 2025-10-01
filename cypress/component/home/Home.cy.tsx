import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import Home from "../../../components/home/Home";
import {
  updatedPreferredMfa,
  updatedUserFeatures
} from "../../../redux/slices/userSlice";
import history from "../../../components/navigation/history";
import {
  mockUserFeaturesLtftPilot,
  mockUserFeaturesNonSpecialty,
  mockUserFeaturesSpecialty,
  mockUserFeaturesUnauthenticated
} from "../../../mock-data/trainee-profile";

const baseCards = ["Support", "MFA"];

const authenticatedCards = [
  ...baseCards,
  "Profile",
  "Placements",
  "Programmes"
];

const specialtyCards = [
  ...authenticatedCards,
  "Form R (Part A)",
  "Form R (Part B)",
  "Action Summary",
  "CCT (Certificate of Completion of Training)"
];

const ltftPilotCards = [...specialtyCards, "Changing hours (LTFT)"];

describe("Home with MFA set up", () => {
  describe("Unauthenticated user", () => {
    beforeEach(() => {
      store.dispatch(updatedPreferredMfa("SMS"));
      store.dispatch(updatedUserFeatures(mockUserFeaturesUnauthenticated));
      mount(
        <Provider store={store}>
          <Router history={history}>
            <Home />
          </Router>
        </Provider>
      );
    });

    baseCards.forEach(card => {
      it(`should display the ${card} card on the Home page`, () => {
        cy.get(`[data-cy="${card}"]`).should("exist");
      });
    });

    it("should not display any unexpected cards", () => {
      cy.get(`[data-cy="card-group-item"]`)
        .its("length")
        .should("eq", baseCards.length);
    });
  });

  describe("Non-specialty user", () => {
    beforeEach(() => {
      store.dispatch(updatedPreferredMfa("SMS"));
      store.dispatch(updatedUserFeatures(mockUserFeaturesNonSpecialty));
      mount(
        <Provider store={store}>
          <Router history={history}>
            <Home />
          </Router>
        </Provider>
      );
    });

    authenticatedCards.forEach(card => {
      it(`should display the ${card} card on the Home page`, () => {
        cy.get(`[data-cy="${card}"]`).should("exist");
      });
    });

    it("should not display any unexpected cards", () => {
      cy.get(`[data-cy="card-group-item"]`)
        .its("length")
        .should("eq", authenticatedCards.length);
    });

    it("should not display Profile GMC Update", () => {
      cy.get(`[data-cy="Profile"]`)
        .should("exist")
        .should("not.contain", "Update GMC number");
    });

    it("should not display Programmes COJ card item", () => {
      cy.get(`[data-cy="Programmes"]`)
        .should("exist")
        .should("not.contain", "Conditions of Joining (CoJ) Agreement(s)");
    });

    it("should not display Programmes CCT card item", () => {
      cy.get(`[data-cy="Programmes"]`)
        .should("exist")
        .should("not.contain", "CCT Calculator");
    });

    it("should not mention Form R on Support card", () => {
      cy.get(`[data-cy="Support"]`)
        .should("exist")
        .should(
          "contain",
          "Email your Local Office with Personal details queries"
        );
    });
  });

  describe("Specialty user", () => {
    beforeEach(() => {
      store.dispatch(updatedPreferredMfa("SMS"));
      store.dispatch(updatedUserFeatures(mockUserFeaturesSpecialty));
      mount(
        <Provider store={store}>
          <Router history={history}>
            <Home />
          </Router>
        </Provider>
      );
    });

    specialtyCards.forEach(card => {
      it(`should display the ${card} card on the Home page`, () => {
        cy.get(`[data-cy="${card}"]`).should("exist");
      });
    });

    it("should not display any unexpected cards", () => {
      cy.get(`[data-cy="card-group-item"]`)
        .its("length")
        .should("eq", specialtyCards.length);
    });

    it("should display Profile GMC Update", () => {
      cy.get(`[data-cy="Profile"]`)
        .should("exist")
        .should("contain", "Update GMC number");
    });

    it("should display Programmes COJ card item", () => {
      cy.get(`[data-cy="Programmes"]`)
        .should("exist")
        .should("contain", "Conditions of Joining (CoJ) Agreement(s)");
    });

    it("should display Programmes CCT card item", () => {
      cy.get(`[data-cy="Programmes"]`)
        .should("exist")
        .should("contain", "CCT Calculator");
    });

    it("should mention Form R on Support card", () => {
      cy.get(`[data-cy="Support"]`)
        .should("exist")
        .should(
          "contain",
          "Email your Local Office with Form R and Personal details queries"
        );
    });
  });

  describe("LTFT pilot user", () => {
    beforeEach(() => {
      store.dispatch(updatedPreferredMfa("SMS"));
      store.dispatch(updatedUserFeatures(mockUserFeaturesLtftPilot));
      mount(
        <Provider store={store}>
          <Router history={history}>
            <Home />
          </Router>
        </Provider>
      );
    });

    ltftPilotCards.forEach(card => {
      it(`should display the ${card} card on the Home page`, () => {
        cy.get(`[data-cy="${card}"]`).should("exist");
      });
    });

    it("should not display any unexpected cards", () => {
      cy.get(`[data-cy="card-group-item"]`)
        .its("length")
        .should("eq", ltftPilotCards.length);
    });
  });
});
