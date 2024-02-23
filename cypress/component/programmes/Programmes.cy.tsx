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
  mockProgrammeMembershipNonTemplatedField,
  mockProgrammeMembershipCojNotSigned,
  mockProgrammeMembershipCojSigned,
  mockOutstandingActions
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
import { mockDspPlacementCredentials } from "../../../mock-data/dsp-credentials";
import { updatedCredentials } from "../../../redux/slices/dspSlice";
import { updatedActionsData } from "../../../redux/slices/traineeActionsSlice";

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
      .should("contain.text", "You are not assigned to any programmes");
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
      .should("contain.text", "You are not assigned to any programmes");
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
  it("should not show the dsp section if member of no group ", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Programmes />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dsp-btn-programmes-2"]').should("not.exist");
  });
  it("should show the dsp section if member of the dsp beta group", () => {
    const MockedProgrammesDspBetaGp = () => {
      store.dispatch(updatedCognitoGroups(["dsp-beta-consultants"]));
      store.dispatch(updatedCredentials(mockDspPlacementCredentials));
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammesDspBetaGp />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dsp-btn-programmes-2"]').should("exist");
  });
  it("should not show the dsp section if member of another test gp ", () => {
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
    cy.get('[data-cy="dsp-btn-programmes-2"]').should("not.exist");
  });
});

describe("Programme summary panel", () => {
  it("should show COJ status", () => {
    const MockedProgrammes = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [
            mockProgrammeMembershipCojNotSigned[0],
            mockProgrammeMembershipCojSigned
          ],
          placements: []
        })
      );
      return <Programmes />;
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammes />
        </Router>
      </Provider>
    );

    cy.get('[data-cy="conditionsOfJoining0Key"]')
      .should("exist")
      .and("have.text", "Conditions of Joining");
    cy.get('[data-cy="conditionsOfJoining0Val"]')
      .children('[data-cy="cojStatusText"]')
      .should("exist")
      .and("have.text", "Follow Local Office process");
    cy.get('[data-cy="conditionsOfJoining1Key"]')
      .should("exist")
      .and("have.text", "Conditions of Joining");
    cy.get('[data-cy="conditionsOfJoining1Val"]')
      .children('[data-cy="cojSignedDate"]')
      .should("exist")
      .and("have.text", "Signed: 14/10/2010 01:00 (BST)");
  });

  it("should display the view COJ button for placements with signed COJ forms", () => {
    const MockedProgrammes = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [
            mockProgrammeMembershipCojNotSigned[0],
            mockProgrammeMembershipCojSigned
          ],
          placements: []
        })
      );
      return <Programmes />;
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammes />
        </Router>
      </Provider>
    );

    cy.get("[data-cy='cojSignedDate']").should("exist");

    cy.get("[data-cy='cojViewBtn-1']").should("exist").and("have.text", "View");
  });
});

describe("Programme review action", () => {
  it("should not display the programme review button for unavailable programme", () => {
    const MockedProgrammes = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [
            mockProgrammeMembershipCojNotSigned[0],
            mockProgrammeMembershipCojSigned
          ],
          placements: []
        })
      );
      dispatch(updatedActionsData([mockOutstandingActions[0]]));
      return <Programmes />;
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammes />
        </Router>
      </Provider>
    );

    cy.get("[data-cy='reviewActionBtn-programmeMemberships-1']").should(
      "not.exist"
    );
    cy.get("[data-cy='actionDueDate-programmeMemberships-1']").should(
      "not.exist"
    );
  });

  it("should display the programme review button for unreviewed programme", () => {
    const MockedProgrammes = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [
            mockProgrammeMembershipCojNotSigned[0],
            mockProgrammeMembershipCojSigned
          ],
          placements: []
        })
      );
      dispatch(updatedActionsData([mockOutstandingActions[1]]));
      return <Programmes />;
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammes />
        </Router>
      </Provider>
    );

    cy.get("[data-cy='reviewActionBtn-programmeMemberships-1']").should(
      "exist"
    );
    cy.get("[data-cy='actionDueDate-programmeMemberships-1']").should("exist");
    cy.get("[data-cy='actionDueDate-programmeMemberships-1']").should(
      "not.contain",
      "(overdue)"
    );
  });

  it("should display the programme review button and overdue label for overdue programme", () => {
    const MockedProgrammes = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [
            mockProgrammeMembershipCojNotSigned[0],
            mockProgrammeMembershipCojSigned
          ],
          placements: []
        })
      );
      dispatch(updatedActionsData([mockOutstandingActions[2]]));
      return <Programmes />;
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammes />
        </Router>
      </Provider>
    );

    cy.get("[data-cy='reviewActionBtn-programmeMemberships-1']").should(
      "exist"
    );
    cy.get("[data-cy='actionDueDate-programmeMemberships-1']").should("exist");
    cy.get("[data-cy='actionDueDate-programmeMemberships-1']").should(
      "contain",
      "(overdue)"
    );
  });
});
