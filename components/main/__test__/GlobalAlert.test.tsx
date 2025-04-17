import React from "react";
import { render, screen } from "@testing-library/react";
import { GlobalAlert } from "../GlobalAlert";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Create mock hooks that return values we control
let mockActionsData = {
  isActionsAndAlertLoading: false,
  isActionsAndAlertSuccess: true,
  isActionsAndAlertError: false
};

let mockAlertData = {
  unsignedCoJ: false,
  inProgressFormR: false,
  importantInfo: false,
  unreviewedProgramme: false,
  unreviewedPlacement: false,
  showActionsSummaryAlert: false
};

// Mock the hooks
jest.mock("../../../utilities/hooks/useActionsAndAlertDataLoader", () => ({
  useActionsAndAlertsDataLoader: () => mockActionsData
}));

jest.mock("../../../utilities/hooks/useAlertStatusData", () => ({
  useAlertStatusData: () => mockAlertData
}));

describe("GlobalAlert Error States", () => {
  beforeEach(() => {
    // Reset mocks to default values before each test
    mockActionsData = {
      isActionsAndAlertLoading: false,
      isActionsAndAlertSuccess: true,
      isActionsAndAlertError: false
    };

    mockAlertData = {
      unsignedCoJ: false,
      inProgressFormR: false,
      importantInfo: false,
      unreviewedProgramme: false,
      unreviewedPlacement: false,
      showActionsSummaryAlert: false
    };
  });

  const renderWithStore = (customState = {}) => {
    const defaultState = {
      user: {
        preferredMfa: "SMS",
        redirected: false
      }
    };

    const mergedState = {
      ...defaultState,
      ...customState
    };

    const store = configureStore({
      reducer: () => mergedState
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <GlobalAlert />
        </BrowserRouter>
      </Provider>
    );
  };

  it("should display error message when isActionsAndAlertError is true and preferredMfa is not NOMFA", () => {
    mockActionsData.isActionsAndAlertError = true;
    mockAlertData.showActionsSummaryAlert = true;

    renderWithStore();

    expect(
      screen.getByText(/There was a problem loading any outstanding actions/i)
    ).toBeInTheDocument();
  });

  it("should not display error message when isActionsAndAlertError is false", () => {
    renderWithStore();

    expect(
      screen.queryByText(/There was a problem loading any outstanding actions/i)
    ).not.toBeInTheDocument();
  });

  it("should not display error message when isActionsAndAlertError is true but preferredMfa is NOMFA", () => {
    mockActionsData.isActionsAndAlertError = true;

    renderWithStore({
      user: { preferredMfa: "NOMFA", redirected: false }
    });

    expect(
      screen.queryByText(/There was a problem loading any outstanding actions/i)
    ).not.toBeInTheDocument();
  });

  it("should render nothing when isActionsAndAlertLoading is true and preferredMfa is not NOMFA", () => {
    mockActionsData.isActionsAndAlertLoading = true;

    renderWithStore();

    expect(document.body.textContent).toBe("");
  });
});
