import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import SubmittedFormRList from "../../../../components/forms/form-builder/form-r/SubmittedFormRList";
import { IFormR } from "../../../../models/IFormR";
import { LifeCycleState } from "../../../../models/LifeCycleState";
import {
  mockProgrammesForLinkerTest,
  mockTraineeProfile
} from "../../../../mock-data/trainee-profile";

const programmeInProfile = "2";
const programmeNotInProfile = "999";

const formRList: IFormR[] = [
  {
    id: "form-with-stored-name",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: "2024-03-01",
    lastModifiedDate: "2024-03-01",
    programmeMembershipId: programmeNotInProfile,
    programmeName: "Cardiology"
  },
  {
    id: "form-without-stored-name",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: "2023-03-01",
    lastModifiedDate: "2023-03-01",
    programmeMembershipId: programmeInProfile
  },
  {
    id: "form-with-no-linkage",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: "2022-03-01",
    lastModifiedDate: "2022-03-01"
  },
  {
    id: "legacy-form-with-specialty",
    lifecycleState: LifeCycleState.Submitted,
    submissionDate: "2021-03-01",
    lastModifiedDate: "2021-03-01",
    programmeName: "Public health medicine"
  }
];

const mountList = () => {
  store.dispatch(
    updatedTraineeProfileData({
      ...mockTraineeProfile,
      programmeMemberships: mockProgrammesForLinkerTest
    })
  );

  mount(
    <Provider store={store}>
      <Router history={history}>
        <SubmittedFormRList
          formRList={formRList}
          path="/formr-a"
          latestSubDate="2024-03-01"
        />
      </Router>
    </Provider>
  );
};

const pmCell = (rowIndex: number) => `[data-cy="${rowIndex}_programmeName"]`;

describe("SubmittedFormRList - linked programme column", () => {
  it("should show the programme name saved with the form", () => {
    mountList();

    cy.get(pmCell(0)).should("have.text", "Cardiology");
  });

  it("should fall back to the profile when the form has no saved programme name", () => {
    mountList();

    cy.get(pmCell(1)).should("have.text", "Adult psychiatry");
  });

  it("should say nothing is linked when the form has neither", () => {
    mountList();

    cy.get(pmCell(2)).should("have.text", "Linked programme not set.");
  });

  it("should not show the specialty of a form submitted before linkage existed", () => {
    mountList();

    cy.get(pmCell(3)).should("have.text", "Linked programme not set.");
  });
});
