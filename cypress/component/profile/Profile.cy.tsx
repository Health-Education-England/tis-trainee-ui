/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../src/redux/store/store";
import { useAppDispatch } from "../../../src/redux/hooks/hooks";
import Profile from "../../../src/components/profile/Profile";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../src/redux/slices/traineeProfileSlice";
import {
  mockPersonalDetails,
  mockProgrammeMemberships,
  mockPlacements,
  mockProgrammeMembershipNoCurricula
} from "../../../src/mock-data/trainee-profile";
import history from "../../../src/components/navigation/history";
import React from "react";

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
    cy.testDataSourceLink;
    cy.get("[data-cy=profileHeading]")
      .should("exist")
      .should("contain.text", "Profile");

    //personal details section
    const expanderPD =
      "[data-cy=personalDetailsExpander] > .nhsuk-details__summary > .nhsuk-details__summary-text";
    cy.get(expanderPD).should("exist").click();
    cy.get("[data-cy=fullNameKey]")
      .should("exist")
      .should("contain.text", "Full name");
    cy.get("[data-cy=fullNameValue]")
      .should("exist")
      .should("contain.text", "Mr Anthony Mara Gilliam");
    cy.get("[data-cy=Gender]").should("exist").should("contain.text", "Male");
    cy.get("[data-cy=Email]")
      .should("exist")
      .should("contain.text", "email@email.com");
    cy.get("[data-cy=postCode")
      .should("exist")
      .should("contain.text", "WC1B 5DN");
    cy.get(expanderPD).click();

    // placements section
    const expanderPl = "[data-cy=placementsExpander]";
    cy.get(expanderPl).should("exist").click();
    cy.get("[data-cy=site0Key]")
      .first()
      .should("exist")
      .should("contain.text", "Site");
    cy.get("[data-cy=wholeTimeEquivalent4Val]")
      .last()
      .should("exist")
      .should("contain.text", "0.75");
    cy.get("[data-cy=employingBody8Val]")
      .last()
      .should("exist")
      .should("contain.text", "None provided");
    cy.get(expanderPl).click();

    // programmes section
    const expanderPr = "[data-cy=programmeMembershipsExpander]";
    cy.get(expanderPr).should("exist").click();
    cy.get("[data-cy=programmeName0Val]")
      .first()
      .should("exist")
      .should("contain.text", "Cardiology");
    cy.get("[data-cy=ST6]").should("exist");
    cy.get("[data-cy=currDates]")
      .last()
      .should("contain.text", "01/08/2022 - 01/08/2025");
  });
  it("should show alternative text when no panel data available", () => {
    const MockedProfileSomeEmpty = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [],
          placements: []
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Profile />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProfileSomeEmpty />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=placementsExpander]").should("exist").click();
    cy.get("[data-cy=notAssignedplacements]")
      .should("exist")
      .should("contain.text", "You are not assigned to any Placements");
    cy.get("[data-cy=notAssignedprogrammeMemberships]")
      .should("exist")
      .should("contain.text", "You are not assigned to any Programmes");
  });
  it("should show alternative text when no Curricula", () => {
    const MockedProfileNoCurricula = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [mockProgrammeMembershipNoCurricula],
          placements: []
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Profile />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProfileNoCurricula />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=programmeMembershipsExpander]").should("exist").click();
    cy.get("[data-cy=curricula5Val]")
      .should("exist")
      .should("contain.text", "N/A");
  });
});
