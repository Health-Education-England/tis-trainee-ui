import store from "../../../../redux/store/store";
import { mount } from "cypress/react18";
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
  updatedCctCalc
} from "../../../../redux/slices/cctSlice";
import { mockCctCalcData1 } from "../../../../mock-data/mock-cct-data";
import { cctCalcWarningsMsgs } from "../../../../utilities/CctConstants";

const { noActiveProgsMsg } = cctCalcWarningsMsgs;

const mountCctWithMockData = (
  profileData: TraineeProfile = mockTraineeProfile,
  cctCalcData: CctCalculation | null = null
) => {
  store.dispatch(updatedTraineeProfileData(profileData));
  if (cctCalcData) store.dispatch(updatedCctCalc(cctCalcData));
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
    mountCctWithMockData(mockTraineeProfile, mockCctCalcData1);
    cy.get('[data-cy="backLink-to-cct-home"]').should("exist");
    cy.get('[data-cy="saved-cct-details"] > div').first().contains("bob1");
    cy.get('[data-cy="saved-cct-details"] > div')
      .eq(1)
      .contains("Mon, 09 Dec 2024 10:13:09 GMT");
    cy.get('[data-cy="saved-cct-details"] > div')
      .last()
      .contains("Mon, 09 Dec 2024 15:11:04 GMT");
    cy.get('[data-cy="cct-calc-btn"]').should("not.exist");
    cy.clickSelect('[data-cy="changes[0].wte"]', "60%");
    cy.get('[data-cy="cct-calc-btn"]').should("exist").click();
  });
});
