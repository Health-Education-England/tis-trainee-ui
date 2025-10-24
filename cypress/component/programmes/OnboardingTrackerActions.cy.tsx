import { mount } from "cypress/react";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import dayjs from "dayjs";
import { OnboardingTrackerActions } from "../../../components/programmes/trackers/OnboardingTrackerActions";
import { mockProgrammeMemberships } from "../../../mock-data/trainee-profile";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import { MemoryRouter } from "react-router-dom";
import { LinkType } from "../../../utilities/Constants";
import { TrackerLink } from "../../../components/programmes/trackers/TrackerLink";

// This test file is to test the 'not available' logic in OnboardingTrackerActions component

const mockProgramme = {
  ...mockProgrammeMemberships[0],
  startDate: dayjs().subtract(16, "weeks").format("YYYY-MM-DD")
};

const mountOnboardingTrackerActionsWithMockData = (
  panel: ProgrammeMembership = mockProgramme
) => {
  mount(
    <Provider store={store}>
      <MemoryRouter>
        <OnboardingTrackerActions panel={panel} />
      </MemoryRouter>
    </Provider>
  );
};

describe("OnboardingTrackerActions", () => {
  it("should show the status of first section (16 weeks) but other 2 sections as 'not available' when the PM start date is 16 weeks away ", () => {
    mountOnboardingTrackerActionsWithMockData({
      ...mockProgramme,
      startDate: dayjs().add(16, "weeks").format("YYYY-MM-DD")
    });
    cy.get('[data-cy="status-section-WELCOME_EMAIL"]').contains("not tracked");
    cy.get('[data-cy="status-section-PLACEMENT_CONFIRMATION"]').contains(
      "not available"
    );
    cy.get('[data-cy="status-section-DAY_ONE_EMAIL"]').contains(
      "not available"
    );
  });
  it("All 3 sections should show as 'not available' when the PM start date is 16 weeks and a day away ", () => {
    mountOnboardingTrackerActionsWithMockData({
      ...mockProgramme,
      startDate: dayjs().add(16, "weeks").add(1, "day").format("YYYY-MM-DD")
    });
    cy.get('[data-cy="status-section-WELCOME_EMAIL"]').contains(
      "not available"
    );
    cy.get('[data-cy="status-section-PLACEMENT_CONFIRMATION"]').contains(
      "not available"
    );
    cy.get('[data-cy="status-section-DAY_ONE_EMAIL"]').contains(
      "not available"
    );
  });
  it("should show the status of first 2 sections (16 weeks and 12 weeks) but 3rd section as 'not available' when the PM start date is 12 weeks away ", () => {
    mountOnboardingTrackerActionsWithMockData({
      ...mockProgramme,
      startDate: dayjs().add(12, "weeks").format("YYYY-MM-DD")
    });
    cy.get('[data-cy="status-section-WELCOME_EMAIL"]').contains("not tracked");
    cy.get('[data-cy="status-section-PLACEMENT_CONFIRMATION"]').contains(
      "not tracked"
    );
    cy.get('[data-cy="status-section-DAY_ONE_EMAIL"]').contains(
      "not available"
    );
  });
  it("should show the status of all 3 sections when the PM start date is today ", () => {
    mountOnboardingTrackerActionsWithMockData({
      ...mockProgramme,
      startDate: dayjs().format("YYYY-MM-DD")
    });
    cy.get('[data-cy="status-section-WELCOME_EMAIL"]').contains("not tracked");
    cy.get('[data-cy="status-section-PLACEMENT_CONFIRMATION"]').contains(
      "not tracked"
    );
    cy.get('[data-cy="status-section-DAY_ONE_EMAIL"]').contains("not tracked");
  });
});

// Test the TrackerLink component separately
describe("TrackerLink", () => {
  it("renders internal links with correct path", () => {
    const textLink: LinkType = {
      text: "/programmes",
      isInternal: true
    };

    mount(
      <MemoryRouter>
        <TrackerLink
          textLink={textLink}
          actionText="View Programmes"
          pmId="12345"
        />
      </MemoryRouter>
    );

    cy.get("a").should("have.attr", "href", "/programmes");
    cy.get("a").should("contain", "View Programmes");
  });

  it("renders internal links with pmId replacement", () => {
    const textLink: LinkType = {
      text: "/programmes/:id/sign-coj",
      isInternal: true
    };

    mount(
      <MemoryRouter>
        <TrackerLink textLink={textLink} actionText="Sign CoJ" pmId="12345" />
      </MemoryRouter>
    );

    cy.get("a").should("have.attr", "href", "/programmes/12345/sign-coj");
    cy.get("a").should("contain", "Sign CoJ");
  });

  it("renders external links with target blank", () => {
    const textLink: LinkType = {
      text: "https://example.com",
      isInternal: false
    };

    mount(
      <TrackerLink
        textLink={textLink}
        actionText="External Link"
        pmId="12345"
      />
    );

    cy.get("a").should("have.attr", "href", "https://example.com");
    cy.get("a").should("have.attr", "target", "_blank");
    cy.get("a").should("have.attr", "rel", "noopener noreferrer");
    cy.get("a").should("contain", "External Link");
  });
});
