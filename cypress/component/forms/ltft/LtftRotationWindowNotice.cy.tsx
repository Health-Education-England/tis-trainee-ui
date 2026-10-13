import store from "../../../../redux/store/store";
import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { mockLtftNewFormObj } from "../../../../mock-data/mock-ltft-data";
import { LtftForm } from "../../../../components/forms/ltft/LtftForm";
import { updatedLtft } from "../../../../redux/slices/ltftSlice";
import { makeValidProgrammeOptions } from "../../../../utilities/ltftUtilities";
import {
  mockProgrammeMemberships,
  mockTraineeProfile,
  mockUserFeaturesLtftPilot
} from "../../../../mock-data/trainee-profile";
import { updatedUserFeatures } from "../../../../redux/slices/userSlice";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import {
  LTFT_ROTATION_WINDOW_URLS,
  ltftRotationWindowNoticeText
} from "../../../../utilities/Constants";

const londonPmId = "london-pm-id";
const eoePmId = "eoe-pm-id";

const mockPms = [
  {
    ...mockProgrammeMemberships[0],
    tisId: londonPmId,
    programmeName: "London Cardiology",
    managingDeanery: "South London"
  },
  {
    ...mockProgrammeMemberships[0],
    tisId: eoePmId,
    programmeName: "Anglia Cardiology",
    managingDeanery: "East of England"
  }
];

const mountLtftWithPms = () => {
  store.dispatch(updatedLtft(mockLtftNewFormObj));
  store.dispatch(
    updatedTraineeProfileData({
      ...mockTraineeProfile,
      programmeMemberships: mockPms
    })
  );
  store.dispatch(updatedUserFeatures(mockUserFeaturesLtftPilot));

  const pmOptions = makeValidProgrammeOptions(mockPms, [londonPmId, eoePmId]);

  mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/ltft/create"]}>
        <LtftForm pmOptions={pmOptions} />
      </MemoryRouter>
    </Provider>
  );
};

describe("LTFT rotation window notice", () => {
  it("does not show the notice until a programme is selected", () => {
    mountLtftWithPms();
    cy.get("h3").contains("Part 1 of 10 - Your Programme");
    cy.get('[data-cy="rotationWindowWarning"]').should("not.exist");
  });

  it("shows the notice with the deanery's rotation window link when a rotation window programme is selected", () => {
    mountLtftWithPms();
    cy.clickSelect('[data-cy="pmId"]', "London Cardiology");

    cy.get('[data-cy="rotationWindowWarning"]').should("exist");
    cy.get('[data-cy="rotationWindowLabel"]').should(
      "contain.text",
      "Important"
    );
    cy.get('[data-cy="rotationWindowText"]').should(
      "contain.text",
      ltftRotationWindowNoticeText
    );
    cy.get('[data-cy="rotationWindowLink"]')
      .should("have.attr", "href", LTFT_ROTATION_WINDOW_URLS.London)
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer")
      .and("contain.text", "opens in a new tab");
  });

  it("removes the notice when the trainee switches to a programme with no rotation window", () => {
    mountLtftWithPms();
    cy.clickSelect('[data-cy="pmId"]', "London Cardiology");
    cy.get('[data-cy="rotationWindowWarning"]').should("exist");

    cy.clickSelect('[data-cy="pmId"]', "Anglia Cardiology");
    cy.get('[data-cy="rotationWindowWarning"]').should("not.exist");
  });

  it("shows the notice only on the Your Programme page", () => {
    mountLtftWithPms();
    cy.clickSelect('[data-cy="pmId"]', "London Cardiology");
    cy.get('[data-cy="rotationWindowWarning"]').should("exist");

    cy.navNext();
    cy.get("h3").contains("Part 2 of 10 - Working hours before change");
    cy.get('[data-cy="rotationWindowWarning"]').should("not.exist");

    cy.get('[data-cy="navPrevious"]').click();
    cy.get("h3").contains("Part 1 of 10 - Your Programme");
    cy.get('[data-cy="rotationWindowWarning"]').should("exist");
  });
});
