/// <reference types="cypress" />
/// <reference path="../../../cypress/support/index.d.ts" />

import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../redux/store/store";
import { useAppDispatch } from "../../redux/hooks/hooks";
import Profile from "../profile/Profile";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../redux/slices/traineeProfileSlice";
import {
  mockPersonalDetails,
  mockProgrammeMemberships,
  mockPlacements
} from "../../mock-data/trainee-profile";
import history from "../navigation/history";

describe("Profile", () => {
  it("should display user details, placement and programme data in the profile section", () => {
    const MockedProfileSuccess = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: mockProgrammeMemberships,
          placements: mockPlacements
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Profile />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProfileSuccess />
        </Router>
      </Provider>
    );
    cy.testDataSourceLink();
    cy.get("[data-cy=profileHeading]")
      .should("exist")
      .should("contain.text", "Profile");

    //personal details section
    const expanderPD =
      "[data-cy=personalDetailsExpander] > .nhsuk-details__summary > .nhsuk-details__summary-text";
    cy.get(expanderPD).should("exist").click();
    cy.get("[data-cy=Gender]").should("exist").should("contain.text", "Male");
    cy.get("[data-cy=Email]")
      .should("exist")
      .should("contain.text", "email@email.com");
    cy.get(expanderPD).click();

    // placements section
    const expanderPl = "[data-cy=placementsExpander]";
    cy.get(expanderPl).should("exist").click();
    cy.get("[data-cy=siteKey]")
      .first()
      .should("exist")
      .should("contain.text", "Site");
    cy.get("[data-cy=wteValue]")
      .last()
      .should("exist")
      .should("contain.text", "0.75");
    cy.get(expanderPl).click();

    // programmes section
    const expanderPr = "[data-cy=programmesExpander]";
    cy.get(expanderPr).should("exist").click();
    cy.get("[data-cy=ST6]").should("exist");
    cy.get("[data-cy=currDates]")
      .last()
      .should("contain.text", "01/08/2022 - 01/08/2025");
  });
});
