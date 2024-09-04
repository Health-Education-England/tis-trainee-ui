import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import Placements from "../../../components/placements/Placements";
import {
  mockOutstandingActions,
  mockPlacements,
  mockPlacementNonTemplatedField,
  mockPersonalDetails,
  mockPlacementNoOtherSites,
  mockPlacementPartialOtherSites,
  mockPlacementSubSpecialtyPostAllows,
  mockPlacemenSubSpecialtyPostNotAllows,
  mockPlacementNoSubSpecialtyPostAllows,
  mockPlacementNoSubSpecialtyPostNotAllows
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
import { updatedCredentials } from "../../../redux/slices/dspSlice";
import { mockDspPlacementCredentials } from "../../../mock-data/dsp-credentials";
import { updatedActionsData } from "../../../redux/slices/traineeActionsSlice";

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
    cy.get('[data-cy="subheaderDetails"]')
      .first()
      .should("have.text", "Details");
    cy.get("[data-cy=site0Key]")
      .first()
      .should("exist")
      .should("contain.text", "Site");
    cy.get("[data-cy=siteKnownAs0Val]")
      .first()
      .should("exist")
      .should("contain.text", "Addenbrookes Hospital (siteNo)");
    cy.get('[data-cy="otherSite0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "Huddersfield Royal Infirmary");
    cy.get('[data-cy="otherSiteLocation0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "Acre Street Lindley Huddersfield");
    cy.get('[data-cy="otherSite1Val"]')
      .first()
      .should("exist")
      .should("contain.text", "Great North Children's Hospital (RTD10)");
    cy.get('[data-cy="otherSiteLocation1Val"]')
      .first()
      .should("exist")
      .should("contain.text", "Queen Victoria Road Newcastle upon Tyne");
    cy.get('[data-cy="wholeTimeEquivalent0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "0.75");
    cy.get('[data-cy="employingBody0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "None provided");
    cy.get('[data-cy="subSpecialty0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "Sub specialty");

    cy.get('[data-cy="futureExpand"]').click();
    cy.get('[data-cy="futureWarningText"]').should(
      "have.text",
      "The information we have for future placements with a start date more than 12 weeks from today is not yet finalised and may be subject to change."
    );
    cy.get('[data-cy="otherSpecialties0Key"]').contains("Other Specialties");
    cy.get('[data-cy="otherSpecialty176Val"]').contains("Allergy");
    cy.get('[data-cy="otherSpecialty211Val"]').contains("Ophthalmology");
    cy.get('[data-cy="otherSpecialty176Val"]')
      .parent()
      .next()
      .get('[data-cy="otherSpecialty211Val"]')
      .should("exist"); //alphabetic ordering
  });

  it("should show available data when partial Other Sites", () => {
    const MockedPlacementsSuccess = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [],
          placements: [mockPlacementPartialOtherSites]
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

    cy.get('[data-cy="otherSite0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "site known as");
    cy.get('[data-cy="otherSiteLocation0Val"]').should("not.exist");

    cy.get('[data-cy="otherSite1Val"]')
      .first()
      .should("exist")
      .should("contain.text", "site with missing known as");
    cy.get('[data-cy="otherSiteLocation1Val"]')
      .first()
      .should("exist")
      .should("contain.text", "site location");

    cy.get('[data-cy="otherSite2Val"]')
      .first()
      .should("exist")
      .should("contain.text", "site with only name");
    cy.get('[data-cy="otherSiteLocation2Val"]').should("not.exist");
    cy.get('[data-cy="otherSpecialties0Key"]').contains("Other Specialties");
    cy.get('[data-cy="otherSpecialties0Val"]').contains("None provided");
  });

  it("should show alternative text when no Other Sites", () => {
    const MockedPlacementsSuccess = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [],
          placements: [mockPlacementNoOtherSites]
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

    cy.get("[data-cy=otherSites0Val]")
      .should("exist")
      .should("contain.text", "None provided");
  });

  it("should display Placements Subspecialty", () => {
    const MockedPlacementsSuccess = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [],
          placements: [mockPlacementSubSpecialtyPostAllows]
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

    cy.get('[data-cy="subSpecialty0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "sub specialty");
  });

  it("should display missing Placements Subspecialty None Provided when Post Allows", () => {
    const MockedPlacementsSuccess = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [],
          placements: [mockPlacementNoSubSpecialtyPostAllows]
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

    cy.get('[data-cy="subSpecialty0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "None provided");
  });

  it("should display Placements Subspecialty even if Post does not Allow", () => {
    const MockedPlacementsSuccess = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [],
          placements: [mockPlacemenSubSpecialtyPostNotAllows]
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

    cy.get('[data-cy="subSpecialty0Val"]').should(
      "contain.text",
      "sub specialty"
    );
  });

  it("should not display missing Placements Subspecialty if Post does not Allow", () => {
    const MockedPlacementsSuccess = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: [],
          placements: [mockPlacementNoSubSpecialtyPostNotAllows]
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

    cy.get('[data-cy="subSpecialty0Val"]').should("not.exist");
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
  it("should not show the dsp section if member of no group ", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Placements />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dsp-btn-placements-316"]').should("not.exist");
  });
  it("should show the dsp section if member of the dsp beta group", () => {
    const MockedPlacementsDspBetaGp = () => {
      store.dispatch(updatedCognitoGroups(["dsp-beta-consultants"]));
      store.dispatch(updatedCredentials(mockDspPlacementCredentials));
      return <Placements />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedPlacementsDspBetaGp />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="dsp-btn-placements-316"]').should("exist");
  });
  it("should not show the dsp section if member of another test gp ", () => {
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
    cy.get('[data-cy="dsp-btn-placements-316"]').should("not.exist");
  });

  describe("Placement review action", () => {
    it("should not display the placement review button for unavailable placement", () => {
      const MockedPlacements = () => {
        const dispatch = useAppDispatch();
        dispatch(
          updatedTraineeProfileData({
            traineeTisId: "12345",
            personalDetails: mockPersonalDetails,
            programmeMemberships: [],
            placements: [mockPlacements[0]]
          })
        );
        dispatch(updatedActionsData([mockOutstandingActions[3]]));
        return <Placements />;
      };

      mount(
        <Provider store={store}>
          <Router history={history}>
            <MockedPlacements />
          </Router>
        </Provider>
      );

      cy.get("[data-cy='reviewActionBtn-placements-315']").should("not.exist");
      cy.get("[data-cy='actionDueDate-placements-315']").should("not.exist");
      cy.get("[class*='panelDivHighlight']").should("not.exist");
    });

    it("should display the placement review button for unreviewed placement", () => {
      const MockedPlacements = () => {
        const dispatch = useAppDispatch();
        dispatch(
          updatedTraineeProfileData({
            traineeTisId: "12345",
            personalDetails: mockPersonalDetails,
            programmeMemberships: [],
            placements: [mockPlacements[0]]
          })
        );
        dispatch(updatedActionsData([mockOutstandingActions[4]]));
        return <Placements />;
      };

      mount(
        <Provider store={store}>
          <Router history={history}>
            <MockedPlacements />
          </Router>
        </Provider>
      );

      cy.get("[data-cy='reviewActionBtn-placements-315']").should("exist");
      cy.get("[data-cy='actionDueDate-placements-315']").should("exist");
      cy.get("[class*='panelDivHighlight']").should("exist");
    });

    it("should display the placement review button for unreviewed overdue placement", () => {
      const MockedPlacements = () => {
        const dispatch = useAppDispatch();
        dispatch(
          updatedTraineeProfileData({
            traineeTisId: "12345",
            personalDetails: mockPersonalDetails,
            programmeMemberships: [],
            placements: [mockPlacements[0]]
          })
        );
        dispatch(updatedActionsData([mockOutstandingActions[5]]));
        return <Placements />;
      };

      mount(
        <Provider store={store}>
          <Router history={history}>
            <MockedPlacements />
          </Router>
        </Provider>
      );

      cy.get("[data-cy='reviewActionBtn-placements-315']").should("exist");
      cy.get("[data-cy='actionDueDate-placements-315']").should("exist");
      cy.get("[class*='panelDivHighlight']").should("exist");
    });
  });
});
