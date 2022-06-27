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
  it("should mount the Profile component on successful main app load", () => {
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
    cy.contains("Personal details").should("exist").click();
    cy.get(
      ".nhsuk-details__text > .nhsuk-summary-list > :nth-child(1) > .nhsuk-summary-list__value"
    ).should("include.text", "Gilliam");
    cy.contains("Placements").should("exist").click();
    cy.get(
      ":nth-child(2) > .nhsuk-details__text > .nhsuk-grid-row > :nth-child(2) > .nhsuk-summary-list > :nth-child(6) > .nhsuk-summary-list__value"
    );
    cy.contains("Programmes").should("exist").click();
    cy.get(
      ":nth-child(1) > .nhsuk-summary-list > :nth-child(6) > .nhsuk-summary-list__value > :nth-child(2) > :nth-child(2)"
    ).should("include.text", "01/06/2020 - 01/06/2024");
  });
});
