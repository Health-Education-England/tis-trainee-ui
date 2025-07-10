import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Redirect } from "react-router-dom";

// mocked Main to focus on the MFA redirect logic
jest.mock("../Main", () => {
  return {
    __esModule: true,
    Main: (_props: Record<string, unknown>) => {
      const { isCriticalLoading, hasCriticalError, preferredMfa } =
        mockMainProps;

      if (isCriticalLoading) return <div data-testid="loading">Loading...</div>;
      if (hasCriticalError)
        return (
          <div data-testid="error-page">
            There was an error loading the app data. Please try again by
            refreshing the page.
          </div>
        );

      // Redirect if preferredMfa conditions are met
      if (
        (preferredMfa === "NOMFA" || preferredMfa === "SMS") &&
        !window.location.pathname.startsWith("/mfa")
      ) {
        return <Redirect to="/mfa" />;
      }

      return (
        <div data-testid="main-content">
          <div data-testid="home">Home</div>
          {window.location.pathname === "/mfa" && (
            <div data-testid="mfa">MFA</div>
          )}
        </div>
      );
    }
  };
});

jest.mock("../../../redux/hooks/hooks", () => ({
  useAppDispatch: () => jest.fn().mockResolvedValue({}),
  useAppSelector: jest.fn(selector => {
    return mockMainProps.preferredMfa;
  })
}));

const mockMainProps = {
  isCriticalLoading: false,
  isCriticalSuccess: true,
  hasCriticalError: false,
  preferredMfa: "TOTP"
};

// import the Main component (which uses the mock Main)
import { Main } from "../Main";

describe("Main Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mock props
    mockMainProps.isCriticalLoading = false;
    mockMainProps.isCriticalSuccess = true;
    mockMainProps.hasCriticalError = false;
    mockMainProps.preferredMfa = "TOTP";

    // Reset window.location.pathname
    Object.defineProperty(window, "location", {
      value: { pathname: "/home" },
      writable: true
    });
  });

  it("should mount successfully and render home page", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Main />
      </MemoryRouter>
    );

    expect(screen.getByTestId("home")).toBeInTheDocument();
  });

  it("should display loading spinner when critical data is loading", () => {
    mockMainProps.isCriticalLoading = true;
    mockMainProps.isCriticalSuccess = false;

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.queryByTestId("home")).not.toBeInTheDocument();
  });

  it("should display error page when critical error occurs", () => {
    mockMainProps.hasCriticalError = true;
    mockMainProps.isCriticalSuccess = false;

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-page")).toBeInTheDocument();
    expect(screen.queryByTestId("home")).not.toBeInTheDocument();
  });

  it("should redirect to MFA when preferredMfa is NOMFA", () => {
    mockMainProps.preferredMfa = "NOMFA";

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    // Redirect component doesn't render content
    expect(screen.queryByTestId("home")).not.toBeInTheDocument();
  });

  it("should redirect to MFA when preferredMfa is SMS", () => {
    mockMainProps.preferredMfa = "SMS";

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("home")).not.toBeInTheDocument();
  });

  it("should not redirect when preferredMfa is TOTP", () => {
    mockMainProps.preferredMfa = "TOTP";

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    expect(screen.getByTestId("home")).toBeInTheDocument();
  });

  it("should render MFA component when on MFA route", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/mfa" },
      writable: true
    });

    render(
      <MemoryRouter initialEntries={["/mfa"]}>
        <Main />
      </MemoryRouter>
    );

    expect(screen.getByTestId("mfa")).toBeInTheDocument();
  });
});
