import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import Placements from "../../../components/placements/Placements";
import {
  mockPlacements,
  mockPlacementNonTemplatedField,
  mockPersonalDetails
} from "../../../mock-data/trainee-profile";
import history from "../../../components/navigation/history";
import React from "react";
import { updatedPreferredMfa } from "../../../redux/slices/userSlice";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";

describe("Placements with no MFA set up", () => {
  it("should not display Placements page if NOMFA", () => {
    const MockedProgrammesFail = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [],
          placements: mockPlacements
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Placements />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammesFail />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=placementsHeading]").should("not.exist");
  });
});

describe("Placements with MFA set up", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("SMS"));
  });
  it("should display Placements when MFA set up", () => {
    const MockedPlacementsSuccess = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [],
          placements: mockPlacements
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Placements />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedPlacementsSuccess />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-details__summary-text").should("exist");
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
  });

  it("should show alternative text when no panel data available", () => {
    const MockedPlacementsEmpty = () => {
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
      return <Placements />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedPlacementsEmpty />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=notAssignedplacements]")
      .should("exist")
      .should("contain.text", "You are not assigned to any Placements");
  });

  it("should not show non-templated placement properties", () => {
    const MockedProfileNonTemplatedField = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [],
          placements: [mockPlacementNonTemplatedField]
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Placements />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProfileNonTemplatedField />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=nonTemplatedField10Val]").should("not.exist");
  });
});
