/// <reference types="cypress" />
/// <reference path="../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { OnboardingTracker } from "../../../components/programmes/trackers/OnboardingTracker";
import store from "../../../redux/store/store";
import {
  MFAType,
  updatedPreferredMfa,
  updatedUserFeatures
} from "../../../redux/slices/userSlice";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import {
  mockPersonalDetails,
  mockProgrammeMemberships,
  mockUserFeatures1
} from "../../../mock-data/trainee-profile";
import { mockFormList } from "../../../mock-data/formr-list";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";
import { updatedActionsData } from "../../../redux/slices/traineeActionsSlice";
import { updatedFormAList } from "../../../redux/slices/formASlice";
import { updatedFormBList } from "../../../redux/slices/formBSlice";
import { mockActionsTestData2 } from "../../../mock-data/mock-trainee-actions-data";
import { TraineeAction } from "../../../models/TraineeAction";

const mountOnboardingTrackerWithMockData = (
  prefMfa: MFAType = "NOMFA",
  profileStatus: string = "idle",
  programmeMemberships: ProgrammeMembership[] = mockProgrammeMemberships,
  actionsData: TraineeAction[] = mockActionsTestData2,
  formAList: any = mockFormList,
  formBList: any = mockFormList
) => {
  const MockedOnboardingTracker = () => {
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
    dispatch(updatedUserFeatures(mockUserFeatures1));
    dispatch(updatedFormAList(formAList));
    dispatch(updatedFormBList(formBList));
    return <OnboardingTracker />;
  };

  mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/programmes/1/onboarding-tracker"]}>
        <Route
          path="/programmes/:id/onboarding-tracker"
          render={() => <MockedOnboardingTracker />}
        />
      </MemoryRouter>
    </Provider>
  );
};
describe("OnboardingTracker", () => {
  it("renders error page when no matching PM found", () => {
    mountOnboardingTrackerWithMockData("SMS", "succeeded", []);
    cy.contains(
      "No Tracker data found for this programme. Please try again."
    ).should("be.visible");
  });
  it("renders tracker when matching PM found", () => {
    mountOnboardingTrackerWithMockData("SMS", "succeeded");
    cy.get("[data-cy=backLink]")
      .should("be.visible")
      .should("have.text", "Back to Programmes list");
    cy.get("[data-cy=onboardingTrackerHeading]").should("be.visible");
    cy.get(":nth-child(1) > .tracker-section-header > .tracker-section_node")
      .should("be.visible")
      .should("have.text", "1");
    cy.get(
      ":nth-child(1) > .tracker-section-header > .tracker-section-header_name"
    ).contains("Welcome (16 weeks)");
    cy.get(":nth-child(1) > :nth-child(4) > .action-card > p > a")
      .contains("Register with Royal Society/ Faculty")
      .should(
        "have.attr",
        "href",
        "https://tis-support.hee.nhs.uk/trainees/royal-college-faculties-contact-information/"
      );
    cy.get(
      ":nth-child(1) > :nth-child(2) > .action-card > .action-card-contents > .svg-inline--fa > path"
    ).click({ force: true });
    cy.get("dialog").should("be.visible");
    cy.get(
      '[open=""] > .dialog-contents-wrapper > .modal-content > h2'
    ).contains("Receive 'Welcome' email");
    cy.get('[open=""] > .dialog-contents-wrapper > .modal-content > p').should(
      "have.text",
      "The Welcome email is sent to the email address you use to sign in to TIS Self-Service."
    );
    cy.get(
      '[open=""] > .dialog-contents-wrapper > [data-cy="modal-cancel-btn"]'
    )
      .should("have.text", "Close")
      .click();

    // Check the status of a few tracker items
    cy.get(
      '[data-cy="status-section-ROYAL_SOCIETY_REGISTRATION"] > :nth-child(2) > [data-cy="status-text"]'
    ).contains("not tracked");
    cy.get(
      '[data-cy="status-section-ROYAL_SOCIETY_REGISTRATION"] > [data-cy="status-icon"] > .svg-inline--fa'
    ).should("have.css", "color", "rgb(66, 85, 99)");
    cy.get(
      '[data-cy="status-section-REVIEW_PROGRAMME"] > :nth-child(2) > [data-cy="status-text"]'
    ).contains("outstanding");
    cy.get(
      '[data-cy="status-section-REVIEW_PROGRAMME"] > [data-cy="status-icon"] > .svg-inline--fa > path'
    ).should("have.css", "color", "rgb(213, 40, 27)");
    cy.get(
      '[data-cy="status-section-SIGN_COJ"] > :nth-child(2) > [data-cy="status-text"]'
    ).contains("completed");
    cy.get(
      '[data-cy="status-section-SIGN_COJ"] > [data-cy="status-icon"] > .svg-inline--fa > path'
    ).should("have.css", "color", "rgb(0, 100, 0)");

    cy.get(":nth-child(2) > .tracker-section-header > .tracker-section_node")
      .should("be.visible")
      .should("have.text", "2");
    cy.get(
      ":nth-child(2) > .tracker-section-header > .tracker-section-header_name"
    ).contains("Placement (12 weeks)");
    cy.get(
      ":nth-child(2) > :nth-child(4) > .action-card > .action-card-contents > .svg-inline--fa > path"
    ).click({ force: true });
    cy.get('[open=""] > .dialog-contents-wrapper > .modal-content > h2').should(
      "have.text",
      "Review your Placement details"
    );
    cy.get('[open=""] > .dialog-contents-wrapper > .modal-content > p > a')
      .first()
      .should("have.text", "Upcoming Placements")
      .should("have.attr", "href", "/placements");
    cy.get('[open=""] > .dialog-contents-wrapper > .modal-content > p > a')
      .last()
      .should("have.text", "Local Office support")
      .should("have.attr", "href", "/support");
    cy.get("body").click(0, 0);
    cy.get("dialog").should("not.be.visible");

    cy.get(":nth-child(3) > .tracker-section-header > .tracker-section_node")
      .should("be.visible")
      .should("have.text", "3");
    cy.get(
      ":nth-child(3) > .tracker-section-header > .tracker-section-header_name"
    ).contains("In post (Day One)");
  });
});
