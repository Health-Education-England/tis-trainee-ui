import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import ConfirmEmail from "../ConfirmEmail";
import { updateMFAPreference } from "aws-amplify/auth";
import { showToast, ToastType } from "../../../../common/ToastMessage";
import { toastSuccessText } from "../../../../../utilities/Constants";

jest.mock("aws-amplify/auth", () => ({
  updateMFAPreference: jest.fn()
}));

jest.mock("../../../../common/ToastMessage", () => ({
  showToast: jest.fn(),
  ToastType: {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info"
  }
}));

jest.mock("../../../../../redux/slices/userSlice", () => ({
  getPreferredMfa: jest.fn().mockReturnValue({ type: "user/getPreferredMfa" })
}));

jest.mock("../../../../navigation/history", () => ({
  push: jest.fn(),
  listen: jest.fn(),
  location: {},
  createHref: jest.fn()
}));
import history from "../../../../navigation/history";

const store = configureStore({
  reducer: () => ({
    user: {
      preferredMfa: "NOMFA"
    }
  }),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
});

store.dispatch = jest.fn().mockResolvedValue({});

describe("ConfirmEmail Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with correct initial state", () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ConfirmEmail />
        </Router>
      </Provider>
    );

    expect(screen.getByText("Email MFA")).toBeInTheDocument();
    expect(screen.getByText("Confirm Email MFA")).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("handles successful MFA setup", async () => {
    (updateMFAPreference as jest.Mock).mockResolvedValueOnce({});

    render(
      <Provider store={store}>
        <Router history={history}>
          <ConfirmEmail />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByText("Confirm Email MFA"));

    expect(screen.getByText("Setting up...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();

    await waitFor(() => {
      expect(updateMFAPreference).toHaveBeenCalledWith({
        email: "PREFERRED"
      });

      expect(store.dispatch).toHaveBeenCalled();

      expect(history.push).toHaveBeenCalledWith("/home");

      expect(showToast).toHaveBeenCalledWith(
        toastSuccessText.getPreferredMfaEmail,
        ToastType.SUCCESS
      );
    });
  });

  it("handles API errors", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const testError = new Error("API Error");
    (updateMFAPreference as jest.Mock).mockRejectedValueOnce(testError);

    render(
      <Provider store={store}>
        <Router history={history}>
          <ConfirmEmail />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByText("Confirm Email MFA"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to set up Email MFA: ",
        testError
      );

      expect(showToast).toHaveBeenCalledWith(
        "Failed to set up Email MFA. Please try again.",
        ToastType.ERROR
      );

      expect(screen.getByText("Confirm Email MFA")).toBeInTheDocument();
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  it("shows Details section when clicked", () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ConfirmEmail />
        </Router>
      </Provider>
    );

    const detailsContent = screen.queryByText(
      /Email MFA provides additional security/i
    );
    expect(detailsContent).not.toBeVisible();

    fireEvent.click(screen.getByText("Why use Email MFA?"));

    expect(
      screen.getByText(/Email MFA provides additional security/i)
    ).toBeVisible();
  });
});
