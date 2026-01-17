import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { HomeHeaderSection } from "../../../components/home/HomeHeaderSection";
import history from "../../../components/navigation/history";
import { updatedUserFeatures } from "../../../redux/slices/userSlice";
import {
  mockUserFeaturesNonSpecialty,
  mockUserFeaturesSpecialty
} from "../../../mock-data/trainee-profile";

describe("HomeHeaderSection", () => {
  it("should display the homeWelcomeHeaderText, homeWelcomeSubHeaderText, homeWelcomeBodyText, and tssUpdatesContainer on desktop", () => {
    cy.viewport(1920, 1080);
    store.dispatch(updatedUserFeatures(mockUserFeaturesSpecialty));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <HomeHeaderSection />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=homeWelcomeHeaderText]").should(
      "include.text",
      "Welcome toTIS Self-Service" // with line break
    );
    cy.get("[data-cy=homeWelcomeSubHeaderText]").should(
      "contain",
      "Your post-graduate training programme resource"
    );
    cy.get("[data-cy=homeWelcomeBodyText]").should(
      "include.text",
      "Our goal is to improve your training experience by making TIS Self-Service a one-stop-shop "
    );
    cy.get('[data-cy="tssUpdatesContainer"]').should("exist");
  });
  it("should not display tssUpdatesContainer on desktop for non-specialty user", () => {
    cy.viewport(1920, 1080);
    store.dispatch(updatedUserFeatures(mockUserFeaturesNonSpecialty));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <HomeHeaderSection />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="tssUpdatesContainer"]').should("not.exist");
  });
  it("should not display homeWelcomeBodyText, tssUpdatesContainer but What's News section on mobile for specialty user", () => {
    cy.viewport(375, 812);
    store.dispatch(updatedUserFeatures(mockUserFeaturesSpecialty));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <HomeHeaderSection />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=homeWelcomeHeaderText]").should(
      "include.text",
      "Welcome toTIS Self-Service" // with line break
    );
    cy.get("[data-cy=homeWelcomeSubHeaderText]").should(
      "contain",
      "Your post-graduate training programme resource"
    );
    cy.get("[data-cy=homeWelcomeBodyText]").should("not.exist");
    cy.get('[data-cy="tssUpdatesContainer"]').should("not.exist");
    cy.get('[data-cy="anchorEl_What\'s New"]').should("exist");
  });
  it("should not display homeWelcomeBodyText, tssUpdatesContainer and What's News section on mobile for non-specialty user", () => {
    cy.viewport(375, 812);
    store.dispatch(updatedUserFeatures(mockUserFeaturesNonSpecialty));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <HomeHeaderSection />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=homeWelcomeHeaderText]").should(
      "include.text",
      "Welcome toTIS Self-Service" // with line break
    );
    cy.get("[data-cy=homeWelcomeSubHeaderText]").should(
      "contain",
      "Your post-graduate training programme resource"
    );
    cy.get("[data-cy=homeWelcomeBodyText]").should("not.exist");
    cy.get('[data-cy="tssUpdatesContainer"]').should("not.exist");
    cy.get('[data-cy="anchorEl_What\'s New"]').should("not.exist");
  });
});
