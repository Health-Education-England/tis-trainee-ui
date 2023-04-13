import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import store from "../../../redux/store/store";
import CredentialIssue from "../CredentialIssue";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("CredentialIssue loading state", () => {
  it("renders Loading component when isIssuing is true", () => {
    (React.useState as jest.Mock).mockReturnValue([true, jest.fn()]);
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Route path="/">
          <Provider store={store}>
            <CredentialIssue />
          </Provider>
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByLabelText("loading-bars")).toBeInTheDocument();
  });
});
