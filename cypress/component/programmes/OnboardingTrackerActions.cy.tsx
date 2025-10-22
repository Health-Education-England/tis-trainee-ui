import { mount } from "cypress/react";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import dayjs from "dayjs";
import { OnboardingTrackerActions } from "../../../components/programmes/trackers/OnboardingTrackerActions";
import { mockProgrammeMemberships } from "../../../mock-data/trainee-profile";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import { MemoryRouter } from "react-router-dom";

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
  });
  it("All 3 sections should show as 'not available' when the PM start date is 16 weeks and a day away ", () => {
    mountOnboardingTrackerActionsWithMockData({
      ...mockProgramme,
      startDate: dayjs().add(16, "weeks").add(1, "day").format("YYYY-MM-DD")
    });
  });
  it("should show the status of first 2 sections (16 weeks and 12 weeks) but 3rd section as 'not available' when the PM start date is 12 weeks away ", () => {
    mountOnboardingTrackerActionsWithMockData({
      ...mockProgramme,
      startDate: dayjs().add(12, "weeks").format("YYYY-MM-DD")
    });
  });
  it("should show the status of all 3 sections when the PM start date is today ", () => {
    mountOnboardingTrackerActionsWithMockData({
      ...mockProgramme,
      startDate: dayjs().format("YYYY-MM-DD")
    });
  });
});
