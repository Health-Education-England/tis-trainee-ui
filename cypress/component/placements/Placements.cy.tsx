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
import { Placement } from "../../../models/Placement";

const mountPlacementsWithMockData = (
  placements: Placement[],
  prefMfa: string = "NOMFA",
  profileStatus: string = "idle",
  actionsData: any = [mockOutstandingActions[3]]
) => {
  const MockedPlacements = () => {
    const dispatch = useAppDispatch();
    dispatch(updatedPreferredMfa(prefMfa));
    dispatch(
      updatedTraineeProfileData({
        traineeTisId: "12345",
        personalDetails: mockPersonalDetails,
        programmeMemberships: [],
        placements: placements
      })
    );
    dispatch(updatedTraineeProfileStatus(profileStatus));
    dispatch(updatedActionsData(actionsData));
    return <Placements />;
  };

  mount(
    <Provider store={store}>
      <Router history={history}>
        <MockedPlacements />
      </Router>
    </Provider>
  );
};

describe("Placements with no MFA set up", () => {
  it("should not display Placements page if NOMFA", () => {
    mountPlacementsWithMockData([mockPlacements[0]]);
    cy.get("[data-cy=placementsHeading]").should("not.exist");
  });
});

describe("Placements with MFA set up", () => {
  it("should display Placements when MFA set up", () => {
    mountPlacementsWithMockData(mockPlacements, "SMS", "succeeded");
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

    cy.get('[data-cy="subheaderLtft"]')
      .first()
      .contains("Changing hours (LTFT)");
    cy.get('[data-cy="ltft-link"]').first().click();
    cy.url().should("include", "/notifications");
    cy.get('[data-cy="cct-link-header"]')
      .first()
      .contains("Need a Changing hours (LTFT) calculation?");
    cy.get('[data-cy="cct-link"]').first().click();
    cy.url().should("include", "/cct");
  });

  it("should show available data when partial Other Sites", () => {
    mountPlacementsWithMockData(
      [mockPlacementPartialOtherSites],
      "SMS",
      "succeeded"
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
    mountPlacementsWithMockData(
      [mockPlacementNoOtherSites],
      "SMS",
      "succeeded"
    );
    cy.get("[data-cy=otherSites0Val]")
      .should("exist")
      .should("contain.text", "None provided");
  });

  it("should display Placements Subspecialty", () => {
    mountPlacementsWithMockData(
      [mockPlacementSubSpecialtyPostAllows],
      "SMS",
      "succeeded"
    );
    cy.get('[data-cy="subSpecialty0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "sub specialty");
  });

  it("should display missing Placements Subspecialty None Provided when Post Allows", () => {
    mountPlacementsWithMockData(
      [mockPlacementNoSubSpecialtyPostAllows],
      "SMS",
      "succeeded"
    );

    cy.get('[data-cy="subSpecialty0Val"]')
      .first()
      .should("exist")
      .should("contain.text", "None provided");
  });

  it("should display Placements Subspecialty even if Post does not Allow", () => {
    mountPlacementsWithMockData(
      [mockPlacemenSubSpecialtyPostNotAllows],
      "SMS",
      "succeeded"
    );

    cy.get('[data-cy="subSpecialty0Val"]').should(
      "contain.text",
      "sub specialty"
    );
  });

  it("should not display missing Placements Subspecialty if Post does not Allow", () => {
    mountPlacementsWithMockData(
      [mockPlacementNoSubSpecialtyPostNotAllows],
      "SMS",
      "succeeded"
    );

    cy.get('[data-cy="subSpecialty0Val"]').should("not.exist");
  });

  it("should show alternative text when no panel data available", () => {
    mountPlacementsWithMockData([], "SMS", "succeeded");
    cy.get('[data-cy="upcomingExpand"]').click();
    cy.get(
      '[data-cy="upcomingExpand"] > .nhsuk-details__text > .nhsuk-grid-row > .nhsuk-card > [data-cy="notAssignedplacements"]'
    )
      .should("exist")
      .should("contain.text", "You are not assigned to any placements");
  });

  it("should not show non-templated placement properties", () => {
    mountPlacementsWithMockData(
      [mockPlacementNonTemplatedField],
      "SMS",
      "succeeded"
    );
    cy.get("[data-cy=nonTemplatedField0Val]").should("not.exist");
  });
});

describe("Placement review action", () => {
  it("should not display the placement review button for unavailable placement", () => {
    mountPlacementsWithMockData([mockPlacements[0]]);
    cy.get("[data-cy='reviewActionBtn-placements-315']").should("not.exist");
    cy.get("[data-cy='actionDueDate-placements-315']").should("not.exist");
    cy.get("[class*='panelDivHighlight']").should("not.exist");
  });

  it("should display the placement review button for unreviewed placement", () => {
    mountPlacementsWithMockData([mockPlacements[0]], "SMS", "succeeded", [
      mockOutstandingActions[4]
    ]);
    cy.get("[data-cy='reviewActionBtn-placements-315']").should("exist");
    cy.get("[data-cy='actionDueDate-placements-315']").should("exist");
    cy.get("[class*='panelDivHighlight']").should("exist");
  });

  it("should display the placement review button for unreviewed overdue placement", () => {
    mountPlacementsWithMockData([mockPlacements[0]], "SMS", "succeeded", [
      mockOutstandingActions[5]
    ]);
    cy.get("[data-cy='reviewActionBtn-placements-315']").should("exist");
    cy.get("[data-cy='actionDueDate-placements-315']").should("exist");
    cy.get("[class*='panelDivHighlight']").should("exist");
  });

  it("should not display the programme confirmation button for placement", () => {
    mountPlacementsWithMockData([mockPlacements[0]]);

    cy.get("[data-cy='downloadPmConfirmBtn-placements-315']").should(
      "not.exist"
    );
  });
});
