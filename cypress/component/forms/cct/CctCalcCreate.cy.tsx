import store from "../../../../redux/store/store";
import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import {
  mockProgrammeMembershipsForGrouping,
  mockTraineeProfile
} from "../../../../mock-data/trainee-profile";
import { CctCalcCreate } from "../../../../components/forms/cct/CctCalcCreate";
import { TraineeProfile } from "../../../../models/TraineeProfile";
import {
  CctCalculation,
  resetCctCalc,
  updatedCctCalc
} from "../../../../redux/slices/cctSlice";
import { mockCctList } from "../../../../mock-data/mock-cct-data";
import { cctCalcWarningsMsgs } from "../../../../utilities/CctConstants";

const { noActiveProgsMsg } = cctCalcWarningsMsgs;

const mountCctWithMockData = (
  profileData: TraineeProfile = mockTraineeProfile,
  cctCalcData: CctCalculation | null = null
) => {
  store.dispatch(updatedTraineeProfileData(profileData));
  if (cctCalcData) {
    store.dispatch(updatedCctCalc(cctCalcData));
  } else {
    store.dispatch(resetCctCalc());
  }
  mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/cct"]}>
        <CctCalcCreate />
      </MemoryRouter>
    </Provider>
  );
};

describe("CctCalcCreate - alt msg if no/past programmes", () => {
  it("doesn't render the calc form if no programmes", () => {
    mountCctWithMockData({ ...mockTraineeProfile, programmeMemberships: [] });
    cy.get('[data-cy="cct-only-past-progs-msg"]')
      .should("exist")
      .contains(noActiveProgsMsg);
  });
  it("doesn't render the calc form if only past programmes", () => {
    mountCctWithMockData({
      ...mockTraineeProfile,
      programmeMemberships: [mockProgrammeMembershipsForGrouping[0]]
    });
    cy.get('[data-cy="cct-only-past-progs-msg"]')
      .should("exist")
      .contains(noActiveProgsMsg);
  });
});

describe("CctCalcCreate - new", () => {
  it("renders the new cct calc form for completion", () => {
    mountCctWithMockData();
    cy.checkAndFillNewCctCalcForm();
  });
});

describe("CctCalcCreate - edit", () => {
  it("renders the cct calc form for editing", () => {
    mountCctWithMockData(mockTraineeProfile, mockCctList[0]);
    cy.get('[data-cy="backLink-to-back-to-cct-home"]').should("exist");
    cy.get('[data-cy="saved-cct-details"] > div').first().contains("bob1");
    cy.get('[data-cy="saved-cct-details"] > div')
      .eq(1)
      .contains("Mon, 09 Dec 2024 10:13:09 GMT");
    cy.get('[data-cy="saved-cct-details"] > div')
      .last()
      .contains("Mon, 09 Dec 2024 15:11:04 GMT");
    cy.get(".react-select__single-value").should("contain", "Cardiology");
    cy.get('[data-cy="cct-calc-btn"]').should("exist");
    cy.clickSelect('[data-cy="changes[0].wte"]', "60%");
    cy.get('[data-cy="until-end-of-programme-0"]').check();
    cy.get('[data-cy="cct-calc-btn"]').click();
    cy.get('[data-cy="result-row-0"]').should("exist");
    cy.get('[data-cy="cct-view-summary-btn"]').should("exist").click();
  });
});

describe("CctCalcCreate - multi-change calculation", () => {
  it("calculates correctly with LTFT then sickness changes", () => {
    mountCctWithMockData();
    cy.clickSelect('[data-cy="programmeMembership.id"]', null, true);

    // Change 1: LTFT at 50%
    cy.get('[data-cy="changes[0].type"]').select("LTFT");
    cy.clickSelect('[data-cy="changes[0].wte"]', "50%");
    cy.get('[data-cy="changes[0].startDate"]').type("2025-07-01");
    cy.get('[data-cy="changes[0].endDate"]').type("2026-06-30");

    cy.get('[data-cy="add-another-change-btn"]').click();

    // Change 2: OOPP
    cy.get('[data-cy="changes[1].type"]').select("OOPP");
    cy.get('[data-cy="changes[1].startDate"]').type("2026-03-01");
    cy.get('[data-cy="changes[1].endDate"]').type("2026-03-31");

    // Calculate
    cy.get('[data-cy="cct-calc-btn"]').click();

    // // overlap error exists
    cy.get(".nhsuk-error-message").should(
      "include.text",
      "Change 2 overlaps with Change 1."
    );

    // Fix overlap by adjusting change 1 end date to 28/02/2026
    cy.get('[data-cy="changes[0].endDate"]').clear().type("2026-02-28");
    cy.get('[data-cy="cct-calc-btn"]').click();

    // Verify both result rows exist
    cy.get('[data-cy="result-row-0"]').should("exist");
    cy.get('[data-cy="result-row-1"]').should("exist");

    // days added
    cy.get('[data-cy="days-added-0"]').should("have.text", "Days added 122");
    cy.get('[data-cy="days-added-1"]').should("have.text", "Days added 31");

    // View summary button should be available
    cy.get('[data-cy="cct-view-summary-btn"]').should("exist").click();
  });

  it("can add and remove changes", () => {
    mountCctWithMockData();
    cy.clickSelect('[data-cy="programmeMembership.id"]', null, true);

    // Start with one change, no remove button visible
    cy.get('[data-cy="change-row-0"]').should("exist");
    cy.get('[data-cy="remove-change-btn-0"]').should("not.exist");

    // Add second change - remove buttons should appear
    cy.get('[data-cy="add-another-change-btn"]').click();
    cy.get('[data-cy="change-row-1"]').should("exist");
    cy.get('[data-cy="remove-change-btn-0"]').should("exist");
    cy.get('[data-cy="remove-change-btn-1"]').should("exist");

    // Add third change
    cy.get('[data-cy="add-another-change-btn"]').click();
    cy.get('[data-cy="change-row-2"]').should("exist");

    // Remove the middle change
    cy.get('[data-cy="remove-change-btn-1"]').click();
    cy.get('[data-cy="change-row-2"]').should("not.exist");

    // Remove one more - back to single change, no remove button
    cy.get('[data-cy="remove-change-btn-1"]').click();
    cy.get('[data-cy="remove-change-btn-0"]').should("not.exist");
  });
});
