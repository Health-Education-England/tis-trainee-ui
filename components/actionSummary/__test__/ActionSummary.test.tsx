import React from "react";
import {
  render,
  screen,
  queryByAttribute,
  fireEvent
} from "@testing-library/react";
import ActionSummary from "../ActionSummary";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import userReducer from "../../../redux/slices/userSlice";
import {
  emptyActionsData,
  multiplePmActionTypeData,
  unknownActionTypeData
} from "../../../mock-data/mock-trainee-actions-data";
import { setActionsRefreshNeeded } from "../../../redux/slices/traineeActionsSlice";

jest.mock("../../../utilities/hooks/useTraineeActions", () => ({
  useTraineeActions: jest.fn()
}));

const mockDispatch = jest.fn();
jest.mock("../../../redux/hooks/hooks", () => ({
  useAppDispatch: () => mockDispatch
}));

import { useTraineeActions } from "../../../utilities/hooks/useTraineeActions";

describe("ActionSummary", () => {
  const mockUseTraineeActions = useTraineeActions as jest.Mock;

  beforeEach(() => {
    mockUseTraineeActions.mockReturnValue(emptyActionsData);
    mockDispatch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    const store = configureStore({
      reducer: {
        user: userReducer
      }
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  };

  test("dispatches resetMfaJourney on mount", () => {
    renderWithProviders(<ActionSummary />);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test("renders the action summary container with correct data-cy attributes", () => {
    const { container } = renderWithProviders(<ActionSummary />);
    const getByDataCy = (value: string) =>
      queryByAttribute("data-cy", container, value);

    expect(getByDataCy("actionSummary")).toBeInTheDocument();
    expect(getByDataCy("actionSummaryHeading")).toBeInTheDocument();
  });

  test("renders no outstanding actions message when no actions exist", () => {
    const { container } = renderWithProviders(<ActionSummary />);
    const getByDataCy = (value: string) =>
      queryByAttribute("data-cy", container, value);

    expect(getByDataCy("noOutstandingActions")).toBeInTheDocument();
    expect(
      screen.getByText(/No outstanding actions for any Programme Membership/i)
    ).toBeInTheDocument();
  });

  test("doesn't render actions with unknown types", () => {
    mockUseTraineeActions.mockReturnValue(unknownActionTypeData);

    renderWithProviders(<ActionSummary />);

    expect(screen.getByText("Test Programme")).toBeInTheDocument();
    expect(screen.queryByText("UNKNOWN_TYPE")).not.toBeInTheDocument();
  });

  test("renders multiple programme groups with correct data", () => {
    mockUseTraineeActions.mockReturnValue(multiplePmActionTypeData);

    renderWithProviders(<ActionSummary />);

    expect(screen.getByText("First Programme")).toBeInTheDocument();
    expect(screen.getByText("Second Programme")).toBeInTheDocument();

    expect(screen.getByText("Submit a new Form R Part A")).toBeInTheDocument();
    expect(
      screen.getByText("Sign your Conditions of Joining")
    ).toBeInTheDocument();
    expect(screen.getAllByText("Submit a new Form R Part B").length).toBe(2);
    expect(
      screen.getAllByText("Review your Programme Membership details").length
    ).toBe(2);
    expect(
      screen.getByText("Review your Placement details")
    ).toBeInTheDocument();

    expect(screen.getAllByText("01/01/2025").length).toBe(6);
    expect(screen.getByText("01/02/2025")).toBeInTheDocument();

    expect(screen.getAllByText("Outstanding").length).toBe(7);
  });

  test("renders correct links for each action type", () => {
    mockUseTraineeActions.mockReturnValue(multiplePmActionTypeData);

    const { container } = renderWithProviders(<ActionSummary />);

    const formRPartALink = screen
      .getByText("Submit a new Form R Part A")
      .closest("a");
    expect(formRPartALink).toHaveAttribute("href", "/formr-a");

    const formRPartBLinks = screen.getAllByText("Submit a new Form R Part B");
    formRPartBLinks.forEach(link => {
      expect(link.closest("a")).toHaveAttribute("href", "/formr-b");
    });

    const cojLink = screen
      .getByText("Sign your Conditions of Joining")
      .closest("a");
    expect(cojLink).toHaveAttribute("href", "/programmes/456/sign-coj");

    const pmLinks = screen.getAllByText(
      "Review your Programme Membership details"
    );
    pmLinks.forEach(link => {
      expect(link.closest("a")).toHaveAttribute("href", "/programmes");
    });

    const placementLink = screen
      .getByText("Review your Placement details")
      .closest("a");
    expect(placementLink).toHaveAttribute("href", "/placements");
  });

  test("applies correct styling to action status", () => {
    mockUseTraineeActions.mockReturnValue(multiplePmActionTypeData);

    renderWithProviders(<ActionSummary />);

    const icons = document.querySelectorAll('svg[color="red"]');
    expect(icons.length).toBe(7);
  });

  test("renders refresh button", () => {
    const { container } = renderWithProviders(<ActionSummary />);
    const getByDataCy = (value: string) =>
      queryByAttribute("data-cy", container, value);

    const refreshButton = getByDataCy("refreshActionsButton");
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton).toHaveTextContent("Refresh data");
  });

  test("clicking the refresh button calls the refresh action", () => {
    const { container } = renderWithProviders(<ActionSummary />);
    const getByDataCy = (value: string) =>
      queryByAttribute("data-cy", container, value);

    mockDispatch.mockClear();

    const refreshButton = getByDataCy("refreshActionsButton");
    if (refreshButton) fireEvent.click(refreshButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setActionsRefreshNeeded(true));
  });
});
