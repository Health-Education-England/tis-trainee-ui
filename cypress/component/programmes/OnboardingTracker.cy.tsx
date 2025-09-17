/// <reference types="cypress" />
/// <reference path="../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { OnboardingTracker } from "../../../components/programmes/trackers/OnboardingTracker";
import store from "../../../redux/store/store";
import history from "../../../components/navigation/history";
describe("OnboardingTracker", () => {
  it("renders", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <OnboardingTracker />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=backLink]")
      .should("be.visible")
      .should("have.text", "Back to Programmes list");
    cy.get("[data-cy=onboardingTrackerHeading]").should("be.visible");
    cy.get(":nth-child(1) > .tracker-section-header > .tracker-section_node")
      .should("be.visible")
      .should("have.text", "1");
    cy.get(
      ":nth-child(1) > .tracker-section-header > .tracker-section-header_name"
    ).contains("Welcome (16 weeks)");
    cy.get(":nth-child(1) > :nth-child(4) > .action-card > p > a")
      .contains("Register with Royal Society/ Faculty")
      .should(
        "have.attr",
        "href",
        "https://tis-support.hee.nhs.uk/trainees/royal-college-faculties-contact-information/"
      );
    cy.get(
      ":nth-child(1) > :nth-child(2) > .action-card > .action-card-contents > .svg-inline--fa > path"
    ).click({ force: true });
    cy.get("dialog").should("be.visible");
    cy.get(
      '[open=""] > .dialog-contents-wrapper > .modal-content > h2'
    ).contains("Receive 'Welcome' email");
    cy.get('[open=""] > .dialog-contents-wrapper > .modal-content > p').should(
      "have.text",
      "The Welcome email is sent to the email address you use to sign in to TIS Self-Service."
    );
    cy.get(
      '[open=""] > .dialog-contents-wrapper > [data-cy="modal-cancel-btn"]'
    )
      .should("have.text", "Close")
      .click();

    cy.get(":nth-child(2) > .tracker-section-header > .tracker-section_node")
      .should("be.visible")
      .should("have.text", "2");
    cy.get(
      ":nth-child(2) > .tracker-section-header > .tracker-section-header_name"
    ).contains("Placement (12 weeks)");
    cy.get(
      ":nth-child(2) > :nth-child(4) > .action-card > .action-card-contents > .svg-inline--fa > path"
    ).click({ force: true });
    cy.get('[open=""] > .dialog-contents-wrapper > .modal-content > h2').should(
      "have.text",
      "Review your Placement details"
    );
    cy.get('[open=""] > .dialog-contents-wrapper > .modal-content > p > a')
      .first()
      .should("have.text", "Upcoming Placements")
      .should("have.attr", "href", "/placements")
      .click();
    cy.url().should("include", "/placements");
    cy.get("body").click(0, 0);
    cy.get("dialog").should("not.be.visible");

    cy.get(":nth-child(3) > .tracker-section-header > .tracker-section_node")
      .should("be.visible")
      .should("have.text", "3");
    cy.get(
      ":nth-child(3) > .tracker-section-header > .tracker-section-header_name"
    ).contains("In post (Day One)");
  });
});
