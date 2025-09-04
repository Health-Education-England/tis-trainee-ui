import React from "react";
import { render, screen, queryByAttribute } from "@testing-library/react";
import { GlobalAlert } from "../GlobalAlert";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import userReducer, { IUser } from "../../../redux/slices/userSlice";
import traineeActionsReducer, {
  IAction
} from "../../../redux/slices/traineeActionsSlice";
import { RootState } from "../../../redux/store/store";

type GlobalAlertTestState = {
  user: Partial<IUser>;
  traineeActions: Partial<IAction>;
};

// Mock the useTraineeActions hook
jest.mock("../../../utilities/hooks/useTraineeActions", () => ({
  useTraineeActions: jest.fn()
}));

import { useTraineeActions } from "../../../utilities/hooks/useTraineeActions";

describe("GlobalAlert", () => {
  const mockUseTraineeActions = useTraineeActions as jest.Mock;

  beforeEach(() => {
    mockUseTraineeActions.mockReturnValue({ hasOutstandingActions: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (
    ui: React.ReactElement,
    {
      route = "/",
      initialState = {
        user: {
          preferredMfa: "SMS",
          redirected: false,
          status: "succeeded",
          tempMfa: "NOMFA",
          totpSection: 0,
          error: ""
        },
        traineeActions: {
          traineeActionsData: [],
          status: "succeeded",
          error: "",
          refreshNeeded: false
        }
      } as GlobalAlertTestState
    } = {}
  ) => {
    const store = configureStore({
      reducer: {
        user: userReducer,
        traineeActions: traineeActionsReducer
      },
      preloadedState: initialState as unknown as RootState
    });

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    );
  };

  test("renders nothing when no alerts are needed", () => {
    renderWithProviders(<GlobalAlert />);
    expect(screen.queryByTestId("globalAlert")).not.toBeInTheDocument();
  });

  test("renders action summary alert when there are outstanding actions and not on action-summary page", () => {
    mockUseTraineeActions.mockReturnValue({ hasOutstandingActions: true });

    const { container } = renderWithProviders(<GlobalAlert />, {
      route: "/home"
    });

    const getByDataCy = (value: string) =>
      queryByAttribute("data-cy", container, value);

    expect(getByDataCy("globalAlert")).toBeInTheDocument();
    expect(getByDataCy("outstandingTraineeActions")).toBeInTheDocument();
    expect(
      screen.getByText(/You have outstanding actions to complete/i)
    ).toBeInTheDocument();
  });

  test("does not render action summary alert when on action-summary page", () => {
    mockUseTraineeActions.mockReturnValue({ hasOutstandingActions: true });

    renderWithProviders(<GlobalAlert />, {
      route: "/action-summary"
    });

    expect(
      screen.queryByTestId("outstandingTraineeActions")
    ).not.toBeInTheDocument();
  });

  test("renders bookmark alert when redirected is true", () => {
    const { container } = renderWithProviders(<GlobalAlert />, {
      initialState: {
        user: { preferredMfa: "SMS", redirected: true },
        traineeActions: {
          traineeActionsData: [],
          status: "succeeded",
          error: ""
        }
      }
    });

    expect(
      queryByAttribute("data-cy", container, "globalAlert")
    ).toBeInTheDocument();
    expect(
      queryByAttribute("data-cy", container, "bookmarkAlert")
    ).toBeInTheDocument();
    expect(screen.getByText(/We have moved/i)).toBeInTheDocument();
  });

  test("renders both alerts when conditions for both are met", () => {
    mockUseTraineeActions.mockReturnValue({ hasOutstandingActions: true });

    const { container } = renderWithProviders(<GlobalAlert />, {
      route: "/placements",
      initialState: {
        user: { preferredMfa: "SMS", redirected: true },
        traineeActions: {
          traineeActionsData: [],
          status: "succeeded",
          error: ""
        }
      }
    });

    expect(
      queryByAttribute("data-cy", container, "globalAlert")
    ).toBeInTheDocument();
    expect(
      queryByAttribute("data-cy", container, "outstandingTraineeActions")
    ).toBeInTheDocument();
    expect(
      queryByAttribute("data-cy", container, "bookmarkAlert")
    ).toBeInTheDocument();
  });

  test("renders nothing when preferredMfa is NOMFA", () => {
    mockUseTraineeActions.mockReturnValue({ hasOutstandingActions: true });

    renderWithProviders(<GlobalAlert />, {
      initialState: {
        user: { preferredMfa: "NOMFA", redirected: true },
        traineeActions: {
          traineeActionsData: [],
          status: "succeeded",
          error: ""
        }
      }
    });
    expect(screen.queryByTestId("globalAlert")).not.toBeInTheDocument();
  });
});
