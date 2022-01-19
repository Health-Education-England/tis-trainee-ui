import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../redux/store/store";
import { useAppDispatch } from "../../redux/hooks/hooks";
import Profile from "../profile/Profile";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../redux/slices/traineeProfileSlice";
import {
  mockPersonalDetails,
  mockProgrammeMemberships,
  mockPlacements
} from "../../mock-data/trainee-profile";

describe("Profile", () => {
  it("should display error message when no tisId", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    cy.get('[data-cy="errorAction"]')
      .should("exist")
      .should("contain.text", "Sorry, there was an error loading the data");
  });
  it("should should display loading when status is loading", () => {
    const MockedProfileLoading = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("loading"));
      return <Profile />;
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedProfileLoading />
        </BrowserRouter>
      </Provider>
    );
    cy.get('[data-cy="loading"]').should("exist");
  });
  it("should mount the Profile component with data when status is successful", () => {
    const MockedProfileSuccess = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedTraineeProfileData({
          traineeTisId: "12345",
          personalDetails: mockPersonalDetails,
          programmeMemberships: mockProgrammeMemberships,
          placements: mockPlacements
        })
      );
      dispatch(updatedTraineeProfileStatus("succeeded"));
      return <Profile />;
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedProfileSuccess />
        </BrowserRouter>
      </Provider>
    );
    cy.contains("Personal details").should("exist").click();
    cy.get(
      ".nhsuk-details__text > .nhsuk-summary-list > :nth-child(1) > .nhsuk-summary-list__value"
    ).should("include.text", "Gilliam");
    cy.contains("Placements").should("exist").click();
    cy.get(
      ".nhsuk-grid-column-full > .nhsuk-summary-list > :nth-child(6) > .nhsuk-summary-list__value"
    ).should("include.text", "Dermatology");
    cy.contains("Programmes").should("exist").click();
    cy.get(
      ":nth-child(1) > .nhsuk-summary-list > :nth-child(6) > .nhsuk-summary-list__value > :nth-child(2) > :nth-child(2)"
    ).should("include.text", "01/06/2020 - 01/06/2024");
  });
  it("should display error message when status is failed", () => {
    const MockedProfileFailed = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTraineeProfileStatus("failed"));
      return <Profile />;
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedProfileFailed />
        </BrowserRouter>
      </Provider>
    );
    cy.get('[data-cy="errorAction"]')
      .should("exist")
      .should("contain.text", "Sorry, there was an error loading the data");
  });
});
