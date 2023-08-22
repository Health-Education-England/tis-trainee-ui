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
import {
  updatedCognitoGroups,
  updatedPreferredMfa
} from "../../../redux/slices/userSlice";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";

describe("Placements with no MFA set up", () => {
  it("should not display Placements page if NOMFA", () => {
    const MockedPlacementsNoMfa = () => {
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
          <MockedPlacementsNoMfa />
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
    cy.get("[data-cy=siteKnownAs0Val]")
      .first()
      .should("exist")
      .should("contain.text", "Addenbrookes Hospital (siteNo)");
    cy.get('[data-cy="wholeTimeEquivalent0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "0.75");
    cy.get('[data-cy="employingBody0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "None provided");

    cy.get('[data-cy="futureExpand"]').click();
    cy.get('[data-cy="futureWarningText"]').should(
      "have.text",
      "The information we have for future placements with a start date more than 12 weeks from today is not yet finalised and may be subject to change."
    );
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
    cy.get('[data-cy="upcomingExpand"]').click();
    cy.get(
      '[data-cy="upcomingExpand"] > .nhsuk-details__text > .nhsuk-grid-row > .nhsuk-card > [data-cy="notAssignedplacements"]'
    )
      .should("exist")
      .should("contain.text", "You are not assigned to any placements");
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
    cy.get("[data-cy=nonTemplatedField0Val]").should("not.exist");
  });
});

describe("Placements - dsp membership", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("SMS"));
    store.dispatch(
      updatedTraineeProfileData({
        traineeTisId: "12345",
        personalDetails: mockPersonalDetails,
        programmeMemberships: [],
        placements: mockPlacements
      })
    );
    store.dispatch(updatedTraineeProfileStatus("succeeded"));
  });
  it("should not show the dsp issue btn if member of no group ", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Placements />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dspBtnplacements316"]').should("not.exist");
  });
  it("should show the dsp issue btn is member of the dsp beta group", () => {
    const MockedPlacementsDspBetaGp = () => {
      store.dispatch(updatedCognitoGroups(["dsp-beta-consultants"]));
      return <Placements />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedPlacementsDspBetaGp />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dspBtnplacements316"]').should("exist");
  });
  it("should not show the dsp issue btn if member of another test gp ", () => {
    const MockedPlacementsOtherGp = () => {
      store.dispatch(updatedCognitoGroups(["coj-omega-consultants"]));
      return <Placements />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedPlacementsOtherGp />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dspBtnplacements316"]').should("not.exist");
  });
});
