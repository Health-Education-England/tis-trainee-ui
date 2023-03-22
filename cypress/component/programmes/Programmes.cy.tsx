import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import Programmes from "../../../components/programmes/Programmes";
import {
  mockPersonalDetails,
  mockProgrammeMemberships,
  mockProgrammeMembershipNoCurricula,
  mockProgrammeMembershipNonTemplatedField
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

describe("Programmes with no MFA set up", () => {
  it("should not display Programmes page if NOMFA", () => {
    const MockedProgrammesFail = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: mockProgrammeMemberships,
          placements: []
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammesFail />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=programmesHeading]").should("not.exist");
  });
});

describe("Programmes with MFA set up", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("SMS"));
  });
  it("should display Programmes when MFA set up", () => {
    const MockedProgrammesSuccess = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: mockProgrammeMemberships,
          placements: []
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammesSuccess />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-details__summary-text").should("exist");
    cy.get("[data-cy=programmeName0Val]")
      .first()
      .should("exist")
      .should("contain.text", "Cardiology");
    cy.get("[data-cy=ST6]").should("exist");
    cy.get("[data-cy=currDates]")
      .last()
      .should("contain.text", "01/08/2022 - 01/08/2025");
  });

  it("should show alternative text when no Programme data available", () => {
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
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProfileSomeEmpty />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=notAssignedprogrammeMemberships]")
      .should("exist")
      .should("contain.text", "You are not assigned to any Programmes");
  });

  it("should show alternative text when no Curricula", () => {
    const MockedProgrammeNoCurricula = () => {
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
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammeNoCurricula />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=curricula0Val]")
      .should("exist")
      .should("contain.text", "N/A");
  });

  it("should show alternative text when no Programmes data available", () => {
    const MockedProgrammesEmpty = () => {
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
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammesEmpty />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=notAssignedprogrammeMemberships]")
      .should("exist")
      .should("contain.text", "You are not assigned to any Programmes");
  });

  it("should not show non-templated programme membership properties", () => {
    const MockedProfileNonTemplatedField = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [mockProgrammeMembershipNonTemplatedField],
          placements: []
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProfileNonTemplatedField />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=nonTemplatedField6Val]").should("not.exist");
  });
});

describe("Programmes - dsp membership", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("SMS"));
    store.dispatch(
      updatedTraineeProfileData({
        traineeTisId: "12345",
        personalDetails: mockPersonalDetails,
        programmeMemberships: mockProgrammeMemberships,
        placements: []
      })
    );
    store.dispatch(updatedTraineeProfileStatus("succeeded"));
  });
  it("should show the dsp issue btn is member of the dsp beta group", () => {
    const MockedProgrammesDspBetaGp = () => {
      store.dispatch(updatedCognitoGroups(["dsp-beta-consultants"]));
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammesDspBetaGp />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dspBtnprogrammeMemberships2"]').should("exist");
  });
  it("should not show the dsp issue btn if member of another test gp ", () => {
    const MockedProgrammesOtherGp = () => {
      store.dispatch(updatedCognitoGroups(["coj-omega-consultants"]));
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammesOtherGp />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dspBtnprogrammeMemberships2"]').should("not.exist");
  });
});
