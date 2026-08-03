import React from "react";
import {
  render,
  screen,
  queryByAttribute,
  fireEvent,
  waitFor
} from "@testing-library/react";
import { GlobalAlert } from "../GlobalAlert";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import userReducer, { IUser } from "../../../redux/slices/userSlice";
import traineeActionsReducer, {
  IAction
} from "../../../redux/slices/traineeActionsSlice";
import announcementsReducer from "../../../redux/slices/announcementsSlice";
import { RootState } from "../../../redux/store/store";
import { Announcement } from "../../../models/Announcement";

type GlobalAlertTestState = {
  user: Partial<IUser>;
  traineeActions: Partial<IAction>;
  announcements?: {
    announcements: Announcement[];
    status: string;
    error: string;
  };
};

// Mock the useTraineeActions hook
jest.mock("../../../utilities/hooks/useTraineeActions", () => ({
  useTraineeActions: jest.fn()
}));

jest.mock("../../../services/AnnouncementsService", () => ({
  getAnnouncements: jest.fn().mockResolvedValue([])
}));

import { useTraineeActions } from "../../../utilities/hooks/useTraineeActions";
import { getAnnouncements } from "../../../services/AnnouncementsService";

describe("GlobalAlert", () => {
  const mockUseTraineeActions = useTraineeActions as jest.Mock;

  beforeEach(() => {
    mockUseTraineeActions.mockReturnValue({ hasOutstandingActions: false });
    (getAnnouncements as jest.Mock).mockResolvedValue([]);
    window.localStorage.clear();
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
        traineeActions: traineeActionsReducer,
        announcements: announcementsReducer
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

  test("renders all alerts when conditions for them are met", async () => {
    mockUseTraineeActions.mockReturnValue({ hasOutstandingActions: true });
    const mockAnnouncements: Announcement[] = [
      {
        id: "hy-1",
        title: "Take part in our study",
        content: {
          raw: {
            children: [{ type: "paragraph", children: [{ text: "Details" }] }]
          }
        }
      }
    ];
    (getAnnouncements as jest.Mock).mockResolvedValue(mockAnnouncements);

    const { container } = renderWithProviders(<GlobalAlert />, {
      route: "/placements",
      initialState: {
        user: { preferredMfa: "SMS", redirected: true },
        traineeActions: {
          traineeActionsData: [],
          status: "succeeded",
          error: ""
        },
        announcements: {
          announcements: mockAnnouncements,
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
      await screen.findByRole("heading", { name: "Take part in our study" })
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

  test("does not fetch announcements when preferredMfa is NOMFA", () => {
    renderWithProviders(<GlobalAlert />, {
      initialState: {
        user: { preferredMfa: "NOMFA", redirected: false },
        traineeActions: {
          traineeActionsData: [],
          status: "succeeded",
          error: ""
        }
      }
    });

    expect(getAnnouncements).not.toHaveBeenCalled();
  });

  test("renders announcement banner when Hygraph has published announcements", async () => {
    const mockAnnouncements: Announcement[] = [
      {
        id: "hy-1",
        title: "Take part in our study",
        content: {
          raw: {
            children: [{ type: "paragraph", children: [{ text: "Details" }] }]
          }
        }
      }
    ];
    (getAnnouncements as jest.Mock).mockResolvedValue(mockAnnouncements);

    renderWithProviders(<GlobalAlert />, {
      initialState: {
        user: { preferredMfa: "SMS", redirected: false },
        traineeActions: {
          traineeActionsData: [],
          status: "succeeded",
          error: ""
        },
        announcements: {
          announcements: mockAnnouncements,
          status: "succeeded",
          error: ""
        }
      }
    });

    expect(
      await screen.findByRole("heading", { name: "Take part in our study" })
    ).toBeInTheDocument();
  });

  test("dismissing an announcement persists to localStorage and hides it", async () => {
    const mockAnnouncements: Announcement[] = [
      {
        id: "hy-1",
        title: "Take part in our study",
        content: {
          raw: {
            children: [{ type: "paragraph", children: [{ text: "Details" }] }]
          }
        }
      }
    ];
    (getAnnouncements as jest.Mock).mockResolvedValue(mockAnnouncements);

    renderWithProviders(<GlobalAlert />, {
      initialState: {
        user: { preferredMfa: "SMS", redirected: false },
        traineeActions: {
          traineeActionsData: [],
          status: "succeeded",
          error: ""
        },
        announcements: {
          announcements: mockAnnouncements,
          status: "succeeded",
          error: ""
        }
      }
    });

    await screen.findByRole("heading", { name: "Take part in our study" });

    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss announcement" })
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Take part in our study" })
      ).not.toBeInTheDocument();
    });

    expect(
      JSON.parse(window.localStorage.getItem("tss-dismissed-announcements")!)
    ).toEqual(["hy-1"]);
  });
});
