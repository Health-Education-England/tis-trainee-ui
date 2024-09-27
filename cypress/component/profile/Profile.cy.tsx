/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import Profile from "../../../components/profile/Profile";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";
import { mockPersonalDetails } from "../../../mock-data/trainee-profile";
import history from "../../../components/navigation/history";
import React from "react";
import { updatedPreferredMfa } from "../../../redux/slices/userSlice";

describe("Profile with no MFA set up", () => {
  it("should not display Profile page if NOMFA", () => {
    const MockedProfileFail = () => {
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
          <MockedProfileFail />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=profileHeading]").should("not.exist");
  });
});

describe("Profile with MFA set up", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("SMS"));
  });
  it("should display Profile (user details) when MFA set up.", () => {
    const MockedProfileSuccess = () => {
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
          <MockedProfileSuccess />
        </Router>
      </Provider>
    );
    cy.testDataSourceLink();
    cy.get("[data-cy=profileHeading]")
      .should("exist")
      .should("contain.text", "Profile");

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
    cy.get("[data-cy=updateGmcLink]")
      .should("exist")
      .should("contain.text", "change");
    cy.get("dialog")
      .should("exist")
      .should("have.attr", "data-cy", "dialogModal")
      .should("not.be.visible");
  });
});
