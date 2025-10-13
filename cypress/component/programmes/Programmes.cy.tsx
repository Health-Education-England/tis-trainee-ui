import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { Programmes } from "../../../components/programmes/Programmes";
import {
  mockPersonalDetails,
  mockProgrammeMemberships,
  mockProgrammeMembershipNoCurricula,
  mockProgrammeMembershipNonTemplatedField,
  mockProgrammeMembershipCojNotSigned,
  mockProgrammeMembershipCojSigned,
  mockOutstandingActions,
  mockProgrammeMembershipNoTrainingNumber,
  mockProgrammeMembershipNoResponsibleOfficer,
  mockProgrammeMembershipsForGrouping,
  mockUserFeaturesSpecialty
} from "../../../mock-data/trainee-profile";
import history from "../../../components/navigation/history";
import React from "react";
import {
  MFAType,
  updatedPreferredMfa,
  updatedUserFeatures
} from "../../../redux/slices/userSlice";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";
import { updatedActionsData } from "../../../redux/slices/traineeActionsSlice";
import { updatedFormAList } from "../../../redux/slices/formASlice";
import { mockFormList } from "../../../mock-data/formr-list";
import { updatedFormBList } from "../../../redux/slices/formBSlice";
import { FileUtilities } from "../../../utilities/FileUtilities";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import { TraineeAction } from "../../../models/TraineeAction";
import { FormRPartA } from "../../../models/FormRPartA";
import { FormRPartB } from "../../../models/FormRPartB";
import dayjs from "dayjs";
import { UserFeaturesType } from "../../../models/FeatureFlags";

const mountProgrammesWithMockData = (
  prefMfa: MFAType = "NOMFA",
  profileStatus: string = "idle",
  userFeatures: UserFeaturesType = mockUserFeaturesSpecialty,
  programmeMemberships: ProgrammeMembership[] = mockProgrammeMemberships,
  actionsData: TraineeAction[] = [],
  formAList: FormRPartA[] = mockFormList as FormRPartA[],
  formBList: FormRPartB[] = mockFormList as FormRPartB[]
) => {
  const MockedProgrammes = () => {
    const dispatch = useAppDispatch();
    dispatch(updatedPreferredMfa(prefMfa));
    dispatch(
      updatedTraineeProfileData({
        traineeTisId: "12345",
        personalDetails: mockPersonalDetails,
        qualifications: [],
        programmeMemberships: programmeMemberships,
        placements: []
      })
    );
    dispatch(updatedTraineeProfileStatus(profileStatus));
    dispatch(updatedActionsData(actionsData));
    dispatch(updatedUserFeatures(userFeatures));
    dispatch(updatedFormAList(formAList));
    dispatch(updatedFormBList(formBList));
    return <Programmes />;
  };

  mount(
    <Provider store={store}>
      <Router history={history}>
        <MockedProgrammes />
      </Router>
    </Provider>
  );
};

describe("Programmes with no MFA set up", () => {
  it("should not display Programmes page if NOMFA", () => {
    mountProgrammesWithMockData();
    cy.get("[data-cy=programmesHeading]").should("not.exist");
  });
});

describe("Programmes with MFA set up", () => {
  const createUpdatedProgrammeMemberships = (
    subtractYears: number,
    addDays: number = 0
  ) => {
    const updatedProgrammeMemberships = [...mockProgrammeMemberships];
    updatedProgrammeMemberships[0] = {
      ...updatedProgrammeMemberships[0],
      startDate: dayjs()
        .subtract(subtractYears, "year")
        .add(addDays, "day")
        .format("YYYY-MM-DD")
    };
    return updatedProgrammeMemberships;
  };
  it("should display current Programme but no Onboarding Tracker link when start date is not within a year", () => {
    const updatedProgrammeMemberships = createUpdatedProgrammeMemberships(1);
    mountProgrammesWithMockData(
      "SMS",
      "succeeded",
      undefined,
      updatedProgrammeMemberships
    );
    cy.get('[data-cy="currentExpand"]').click();
    cy.get('[data-cy="subheaderDetails"]').contains("Details");
    cy.get(".nhsuk-details__summary-text").should("exist");
    cy.get("[data-cy=programmeName0Val]")
      .first()
      .should("exist")
      .should("contain.text", "Cardiology");
    cy.get("[data-cy=ST6]").should("exist");
    cy.get("[data-cy=trainingNumber0Val]")
      .should("exist")
      .should("contain.text", "EOE/ABC-123/1111111/C");
    cy.get("[data-cy=responsibleOfficer0Val]")
      .should("exist")
      .should("contain.text", "Not currently available");
    cy.get("[data-cy=currDates]")
      .last()
      .should("contain.text", "01/08/2022 - 01/08/2025");
    cy.get('[data-cy="subheaderOnboarding"]').should("not.exist");
    cy.get('[data-cy="cct-link-header"]')
      .first()
      .contains("Need a Changing hours (LTFT) calculation?");
    // both progs and placements use same panel creator component so not repeating placement tests
  });

  it("Should display current Programme and Onboarding Tracker link when start date is within a year", () => {
    const updatedProgrammeMemberships = createUpdatedProgrammeMemberships(1, 1);
    mountProgrammesWithMockData(
      "SMS",
      "succeeded",
      undefined,
      updatedProgrammeMemberships
    );
    cy.get('[data-cy="currentExpand"]').click();
    cy.get('[data-cy="subheaderOnboarding"]').contains("Onboarding");
    cy.get('[data-cy="NewProgrammeOnboardingText"]').should(
      "include.text",
      "Onboarding Tracker"
    );

    cy.get(
      '[data-cy="currentExpand"] > .nhsuk-details__text > .nhsuk-grid-row > .nhsuk-grid-column-one-half > .nhsuk-card > .nhsuk-summary-list > :nth-child(2) > .nhsuk-summary-list__value > p > a'
    )
      .should("have.attr", "href", "/programmes/1/onboarding-tracker")
      .and("include.text", "Track your onboarding journey for this programme");
  });

  it("should show alternative text when no Programme/ panel data available", () => {
    mountProgrammesWithMockData("SMS", "succeeded", undefined, []);
    cy.get("[data-cy=notAssignedprogrammeMemberships]")
      .should("exist")
      .should("contain.text", "You are not assigned to any programmes");
    cy.get('[data-cy="upcomingExpand"]').click();
    cy.get('[data-cy="notAssignedprogrammeMemberships"]')
      .should("exist")
      .should("contain.text", "You are not assigned to any programmes");
  });

  it("should show alternative text when no Curricula", () => {
    mountProgrammesWithMockData("SMS", "succeeded", undefined, [
      mockProgrammeMembershipNoCurricula
    ]);
    cy.get("[data-cy=curricula0Val]")
      .should("exist")
      .should("contain.text", "N/A");
  });

  it("should show alternative text when no training number", () => {
    mountProgrammesWithMockData(
      "SMS",
      "succeeded",
      undefined,
      mockProgrammeMembershipNoTrainingNumber
    );
    cy.get("[data-cy=trainingNumber0Val]")
      .should("exist")
      .should("contain.text", "Not Available");
  });

  it("should show alternative text when no responsible officer", () => {
    mountProgrammesWithMockData(
      "SMS",
      "succeeded",
      undefined,
      mockProgrammeMembershipNoResponsibleOfficer
    );
    cy.get("[data-cy=responsibleOfficer0Val]")
      .should("exist")
      .should("contain.text", "Not currently available");
  });

  it("should not show non-templated programme membership properties", () => {
    mountProgrammesWithMockData("SMS", "succeeded", undefined, [
      mockProgrammeMembershipNonTemplatedField
    ]);
    cy.get("[data-cy=nonTemplatedField6Val]").should("not.exist");
  });
});

describe("Programme summary panel", () => {
  it("should not show COJ when COJ feature disabled", () => {
    const userFeaturesNoCoj = {
      ...mockUserFeaturesSpecialty,
      details: {
        ...mockUserFeaturesSpecialty.details,
        programmes: {
          ...mockUserFeaturesSpecialty.details.programmes,
          conditionsOfJoining: {
            enabled: false
          }
        }
      }
    };

    mountProgrammesWithMockData(
      "SMS",
      "succeeded",
      userFeaturesNoCoj,
      mockProgrammeMembershipCojNotSigned
    );
    cy.get('[data-cy="pastExpand"]').invoke("show").click({ force: true });
    cy.get('[data-cy="conditionsOfJoining0Key"]').should("not.exist");
  });

  it("should show COJ status", () => {
    mountProgrammesWithMockData("SMS", "succeeded", undefined, [
      mockProgrammeMembershipCojNotSigned[0],
      mockProgrammeMembershipCojSigned
    ]);

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
    mountProgrammesWithMockData("SMS", "succeeded", undefined, [
      mockProgrammeMembershipCojNotSigned[0],
      mockProgrammeMembershipCojSigned
    ]);

    cy.get("[data-cy='cojSignedDate']").should("exist");
    cy.get("[data-cy='cojViewBtn-1']").should("exist").and("have.text", "View");
  });
});

describe("Programme review action", () => {
  it("should not display the programme review button for unavailable programme", () => {
    mountProgrammesWithMockData(
      "SMS",
      "succeeded",
      undefined,
      [
        mockProgrammeMembershipCojNotSigned[0],
        mockProgrammeMembershipCojSigned
      ],
      [mockOutstandingActions[0]]
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
    mountProgrammesWithMockData(
      "SMS",
      "succeeded",
      undefined,
      [
        mockProgrammeMembershipCojNotSigned[0],
        mockProgrammeMembershipCojSigned
      ],
      [mockOutstandingActions[1]]
    );

    cy.get("[data-cy='reviewActionBtn-programmeMemberships-1']").should(
      "exist"
    );
    cy.get("[data-cy='actionDueDate-programmeMemberships-1']").should("exist");
    cy.get("[class*='panelDivHighlight']").should("exist");
  });

  it("should display the programme review button for overdue programme", () => {
    mountProgrammesWithMockData(
      "SMS",
      "succeeded",
      undefined,
      [
        mockProgrammeMembershipCojNotSigned[0],
        mockProgrammeMembershipCojSigned
      ],
      [mockOutstandingActions[2]]
    );

    cy.get("[data-cy='reviewActionBtn-programmeMemberships-1']").should(
      "exist"
    );
    cy.get("[data-cy='actionDueDate-programmeMemberships-1']").should("exist");
    cy.get("[class*='panelDivHighlight']").should("exist");
  });
});

describe("Programme confirmation", () => {
  it("should not display the programme confirmation button for past programme", () => {
    mountProgrammesWithMockData("SMS", "succeeded", undefined, [
      mockProgrammeMembershipsForGrouping[0]
    ]);

    cy.get("[data-cy='downloadPmConfirmBtn-programmeMemberships-1']").should(
      "not.exist"
    );
  });

  it("should not display the programme confirmation button for future programme", () => {
    mountProgrammesWithMockData("SMS", "succeeded", undefined, [
      mockProgrammeMembershipsForGrouping[3]
    ]);
    cy.get("[data-cy='downloadPmConfirmBtn-programmeMemberships-4']").should(
      "not.exist"
    );
  });

  it("should not display the programme confirmation button when feature disabled", () => {
    const userFeaturesNoConfirmation = {
      ...mockUserFeaturesSpecialty,
      details: {
        ...mockUserFeaturesSpecialty.details,
        programmes: {
          ...mockUserFeaturesSpecialty.details.programmes,
          confirmation: {
            enabled: false
          }
        }
      }
    };

    mountProgrammesWithMockData(
      "SMS",
      "succeeded",
      userFeaturesNoConfirmation,
      [mockProgrammeMembershipsForGrouping[1]]
    );

    cy.get("[data-cy='downloadPmConfirmBtn-programmeMemberships-2']").should(
      "not.exist"
    );
  });

  it("should display the programme confirmation button for current programme", () => {
    mountProgrammesWithMockData("SMS", "succeeded", undefined, [
      mockProgrammeMembershipsForGrouping[1]
    ]);

    cy.stub(FileUtilities, "downloadPdf").as("DownloadPDF");
    cy.get("[data-cy='downloadPmConfirmBtn-programmeMemberships-2']")
      .should("exist")
      .click({ force: true });
    cy.get("@DownloadPDF").should("have.been.called");
  });

  it("should display the programme confirmation button for upcoming programme", () => {
    mountProgrammesWithMockData("SMS", "succeeded", undefined, [
      mockProgrammeMembershipsForGrouping[2]
    ]);
    cy.stub(FileUtilities, "downloadPdf").as("DownloadPDF");
    cy.get("[data-cy='downloadPmConfirmBtn-programmeMemberships-3']")
      .should("exist")
      .click({ force: true });
    cy.get("@DownloadPDF").should("have.been.called");
  });
});
