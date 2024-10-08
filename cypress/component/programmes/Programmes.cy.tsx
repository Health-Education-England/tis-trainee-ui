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
  mockOutstandingActions,
  mockProgrammeMembershipNoTrainingNumber,
  mockProgrammeMembershipNoResponsibleOfficer
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
import { updatedFormAList } from "../../../redux/slices/formASlice";
import { mockFormList } from "../../../mock-data/formr-list";
import { updatedFormBList } from "../../../redux/slices/formBSlice";

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
    store.dispatch(updatedFormAList(mockFormList));
    store.dispatch(updatedFormBList(mockFormList));
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
    cy.get('[data-cy="subheaderDetails"]').contains("Details");
    cy.get(".nhsuk-details__summary-text").should("exist");
    cy.get("[data-cy=programmeName0Val]")
      .first()
      .should("exist")
      .should("contain.text", "General Practice");
    cy.get("[data-cy=ST6]").should("exist");
    cy.get("[data-cy=trainingNumber0Val]")
      .should("exist")
      .should("contain.text", "EOE/ABC-123/1111111/C");
    cy.get("[data-cy=responsibleOfficer0Val]")
      .should("exist")
      .should("contain.text", "Hugh Rangel");
    cy.get("[data-cy=currDates]")
      .last()
      .should("contain.text", "01/08/2020 - 01/08/2025");
    cy.get('[data-cy="subheaderOnboarding"]').contains("Onboarding");
    cy.get('[data-cy="NewProgrammeOnboardingText"]').should(
      "include.text",
      "'New Programme' onboarding journey"
    );
    cy.get(
      '[data-cy="currentExpand"] > .nhsuk-details__text > .nhsuk-grid-row > .nhsuk-grid-column-one-half > .nhsuk-card > .nhsuk-summary-list > :nth-child(2) > .nhsuk-summary-list__value > p > a'
    )
      .should("have.attr", "href", "/programmes/2/onboarding-tracker")
      .and("include.text", "View");
    cy.get(
      '[data-cy="currentExpand"] > .nhsuk-details__text > .nhsuk-grid-row > .nhsuk-grid-column-one-half > .nhsuk-card > .nhsuk-summary-list > [data-cy="subheaderLtft"]'
    ).contains("Less Than Full Time");
    cy.get(
      '[data-cy="currentExpand"] > .nhsuk-details__text > .nhsuk-grid-row > .nhsuk-grid-column-one-half > .nhsuk-card > .nhsuk-summary-list > :nth-child(4) > .nhsuk-summary-list__value > a'
    ).contains("See your LTFT notification");
    cy.get(
      '[data-cy="currentExpand"] > .nhsuk-details__text > .nhsuk-grid-row > .nhsuk-grid-column-one-half > .nhsuk-card > .nhsuk-summary-list > :nth-child(5) > .nhsuk-summary-list__key > .nhsuk-label'
    ).contains("Need a rough idea how changing your hours");
    cy.get('[data-cy="cctBtn-General Practice"]')
      .should("exist")
      .should("contain.text", "Open CCT Calculator")
      .should("have.attr", "title", "Open CCT Calculator");
    cy.get('[data-cy="cctBtn-General Practice"]').first().click();
    cy.get('[data-cy="cctBtn-General Practice"]').first().should("be.disabled");
    cy.get('[data-cy="cctBtn-General Practice"]').last().should("be.disabled");
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

  it("should show alternative text when no panel data available", () => {
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
    cy.get('[data-cy="upcomingExpand"]').click();
    cy.get(
      '[data-cy="upcomingExpand"] > .nhsuk-details__text > .nhsuk-grid-row > .nhsuk-card > [data-cy="notAssignedprogrammeMemberships"]'
    )
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

  it("should show alternative text when no training number", () => {
    const MockedProgrammeNoTrainingNumber = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: mockProgrammeMembershipNoTrainingNumber,
          placements: []
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammeNoTrainingNumber />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=trainingNumber0Val]")
      .should("exist")
      .should("contain.text", "Not Available");
  });

  it("should show alternative text when no responsible officer", () => {
    const MockedProgrammeNoResponsibleOfficer = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: mockProgrammeMembershipNoResponsibleOfficer,
          placements: []
        })
      );
      console.log(mockProgrammeMembershipNoResponsibleOfficer);
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Programmes />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedProgrammeNoResponsibleOfficer />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=responsibleOfficer0Val]")
      .should("exist")
      .should("contain.text", "Not currently available");
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

    cy.get('[data-cy="pastExpand"]').invoke("show").click({ force: true });
    cy.get('[data-cy="conditionsOfJoining0Key"]')
      .should("exist")
      .and("have.text", "Conditions of Joining");
    cy.get('[data-cy="conditionsOfJoining0CojInfo-icon"]')
      .invoke("show")
      .click({ force: true });
    cy.get("#conditionsOfJoining0CojInfo")
      .should("be.visible")
      .and(
        "include.text",
        "The Conditions of Joining a Specialty Training Programme is your acknowledgement that you will adhere to the professional responsibilities, including the need to participate actively in the assessment and, where applicable revalidation processes."
      );
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
    cy.get("[class*='panelDivHighlight']").should("not.exist");
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
    cy.get("[class*='panelDivHighlight']").should("exist");
  });

  it("should display the programme review button for overdue programme", () => {
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
    cy.get("[class*='panelDivHighlight']").should("exist");
  });
});
