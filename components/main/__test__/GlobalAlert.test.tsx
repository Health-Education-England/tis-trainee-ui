import React from "react";
import {
  render,
  screen,
  queryByAttribute,
  waitForElementToBeRemoved,
  fireEvent
} from "@testing-library/react";
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

fdescribe("GlobalAlert", () => {
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

  test("renders recruit alert by default and can dismiss it", () => {
    const { container } = renderWithProviders(<GlobalAlert />);

    expect(
      queryByAttribute("data-cy", container, "recruitAlert")
    ).toBeInTheDocument();
    expect(screen.getByText(/Digital Product Collective/i)).toBeInTheDocument();

    const dismissButton = screen.getByRole("button", {
      name: /dismiss recruitment alert/i
    });
    fireEvent.click(dismissButton);

    expect(
      queryByAttribute("data-cy", container, "recruitAlert")
    ).not.toBeInTheDocument();
  });

  test("recruit alert exposes the expected heading and Get involved link", () => {
    renderWithProviders(<GlobalAlert />);

    expect(
      screen.getByRole("heading", { name: /Think you can make TSS better\?/i })
    ).toBeInTheDocument();

    const getInvolvedLink = screen.getByRole("link", { name: /get involved/i });
    expect(getInvolvedLink).toHaveAttribute(
      "href",
      "https://forms.office.com/e/gnyr0hMuYN"
    );
    expect(getInvolvedLink).toHaveAttribute("target", "_blank");
    expect(getInvolvedLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("dismissing recruit alert keeps other alerts visible", () => {
    mockUseTraineeActions.mockReturnValue({ hasOutstandingActions: true });

    const { container } = renderWithProviders(<GlobalAlert />, {
      route: "/home",
      initialState: {
        user: { preferredMfa: "SMS", redirected: true },
        traineeActions: {
          traineeActionsData: [],
          status: "succeeded",
          error: ""
        }
      }
    });

    fireEvent.click(
      screen.getByRole("button", { name: /dismiss recruitment alert/i })
    );

    expect(
      queryByAttribute("data-cy", container, "recruitAlert")
    ).not.toBeInTheDocument();
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

  test("action summary alert links to /action-summary", () => {
    mockUseTraineeActions.mockReturnValue({ hasOutstandingActions: true });

    renderWithProviders(<GlobalAlert />, { route: "/home" });

    const link = screen.getByRole("link", {
      name: /go to action summary page/i
    });
    expect(link).toHaveAttribute("href", "/action-summary");
  });

  test("bookmark alert shows the current origin as the new address", () => {
    renderWithProviders(<GlobalAlert />, {
      initialState: {
        user: { preferredMfa: "SMS", redirected: true },
        traineeActions: {
          traineeActionsData: [],
          status: "succeeded",
          error: ""
        }
      }
    });

    const originLink = screen.getByRole("link", {
      name: globalThis.location.origin
    });
    expect(originLink).toHaveAttribute("href", "/");
  });

  test("renders all alerts when conditions for them are met", () => {
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
    expect(
      queryByAttribute("data-cy", container, "recruitAlert")
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
