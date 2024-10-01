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
  updatedTraineeProfileStatus,
  updateGmc
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
  it("should not update GMC when API call fails.", () => {
    const MockedProfileGmcUpdated = () => {
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
      dispatch(updateGmc("1234567")); //should fail since API call is not mocked
      return <Profile />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProfileGmcUpdated />
        </Router>
      </Provider>
    );
    cy.testDataSourceLink();
    cy.get('[data-cy="General Medical Council (GMC)"]')
      .should("exist")
      .should("contain.text", "1111111");
  });
  it("should update GMC when API call succeeds.", () => {
    //todo
    //assert(0 !== 0);
  });
  it("should open GMC modal form when change button clicked.", () => {
    const MockedProfile = () => {
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
          <MockedProfile />
        </Router>
      </Provider>
    );
    cy.testDataSourceLink();
    cy.get("[data-cy=updateGmcLink]").click();

    cy.get("dialog")
      .should("exist")
      .should("have.attr", "data-cy", "dialogModal")
      .should("be.visible");

    cy.get("#gmcNumber").should("exist").should("have.value", "");
    cy.get("[data-cy=gmc-edit-btn]").should("exist").should("be.disabled");
    cy.get("#gmcNumber").clear().type("1234567");
    cy.get("[data-cy=gmc-edit-btn]").should("exist").should("not.be.disabled");
  });
});
