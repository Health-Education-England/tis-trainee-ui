import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../src/redux/hooks/hooks";
import store from "../../../src/redux/store/store";
import {
  mockTraineeProfile,
  mockTraineeProfileNoGMC,
  mockTraineeProfileNoMatch
} from "../../../src/mock-data/trainee-profile";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../src/redux/slices/traineeProfileSlice";
import Support from "../../../src/components/support/Support";
import history from "../../../src/components/navigation/history";
import React from "react";

describe("Support", () => {
  it("should render the Support page on successful main app load", () => {
    const MockedSupportSucceeded = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("succeeded"));
      dispatch(updatedTraineeProfileData(mockTraineeProfile));
      return <Support />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSupportSucceeded />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=pageTitle]")
      .should("exist")
      .should("include.text", "Support");
    cy.get(".nhsuk-details__summary-text").click();
    cy.get(
      "[data-cy=techSupportLabel] > .nhsuk-card__content > .nhsuk-card__heading"
    )
      .should("exist")
      .should("include.text", "Technical");
    cy.get("[data-cy=techSupportLink]").should(
      "have.attr",
      "href",
      "mailto:tis.support@hee.nhs.uk?subject=TSS tech support query (GMC no. 11111111, TIS ID 123)"
    );
    cy.get("[data-cy=techSupportLink] > .nhsuk-action-link__text").should(
      "include.text",
      "email TIS Support"
    );
    cy.get(
      "[data-cy=loSupportLabel] > .nhsuk-card__content > .nhsuk-card__heading"
    )
      .should("exist")
      .should("include.text", "Form R (including unsubmitting a form");
    cy.get("[data-cy=loLink]").should(
      "have.attr",
      "href",
      "mailto:Formr.tv@hee.nhs.uk?subject=Form R support query (GMC no. 11111111, TIS ID 123)"
    );
    cy.get(".nhsuk-details__text > :nth-child(1)").should("be.visible");
    cy.get("[data-cy=successMsg] > :nth-child(1)").should(
      "include.text",
      "Thames Valley"
    );
    cy.get(".nhsuk-action-link__text").should(
      "include.text",
      "Formr.tv@hee.nhs.uk"
    );
    cy.get("[data-cy=contactList]").select("HEE North West London");
    cy.get(".nhsuk-action-link__text").should(
      "include.text",
      "PGMDE Support Portal"
    );
    cy.get("[data-cy=pgdmeLink]").should(
      "have.attr",
      "href",
      "https://lasepgmdesupport.hee.nhs.uk/support/tickets/new?form_7=true"
    );
  });
  it("should show failure support msg if no LO match with personOwner", () => {
    const MockedSupportNoMatch = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileData(mockTraineeProfileNoMatch));
      return <Support />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSupportNoMatch />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-error-message").should(
      "include.text",
      "TIS on Mars cannot be matched"
    );
    cy.get("[data-cy=contactList]")
      .should("exist")
      .select("HEE Yorkshire and the Humber");
    cy.get(".nhsuk-action-link__text").should(
      "include.text",
      "TIS.yh@hee.nhs.uk"
    );
  });
  it("should only show tisId if no GMC number", () => {
    const MockedSupportNoGmc = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileData(mockTraineeProfileNoGMC));
      return <Support />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSupportNoGmc />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=loLink]").should(
      "have.attr",
      "href",
      "mailto:Formr.tv@hee.nhs.uk?subject=Form R support query (TIS ID 789)"
    );
    cy.get("[data-cy=techSupportLink]").should(
      "have.attr",
      "href",
      "mailto:tis.support@hee.nhs.uk?subject=TSS tech support query (TIS ID 789)"
    );
  });
});
