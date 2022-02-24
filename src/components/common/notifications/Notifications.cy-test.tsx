import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { addNotification } from "../../../redux/slices/notificationsSlice";
import store from "../../../redux/store/store";
import Notifications from "./Notifications";

describe("Notifications", () => {
  it("should display an error notification for an error type.", () => {
    const MockedErrorNotifications = () => {
      const dispatch = useAppDispatch();
      dispatch(
        addNotification({
          type: "Error",
          text: " - This is a test error message"
        })
      );
      return <Notifications />;
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedErrorNotifications />
        </BrowserRouter>
      </Provider>
    );
    cy.get(".notification").should(
      "have.css",
      "background-color",
      "rgb(167, 23, 26)"
    );
    cy.get("[data-cy=faIcon]")
      .should("exist")
      .should("have.class", "fa-circle-exclamation");
    cy.get("[data-cy=notifText]").should("include.text", "Error");
    cy.get("[data-cy=notifCloseBtn]").should("exist").click();
    cy.get(".notification").should("not.exist");
  });
  it("should display a success notification for a success type", () => {
    const MockedSuccessNotifications = () => {
      const dispatch = useAppDispatch();
      dispatch(
        addNotification({
          type: "Success",
          text: " - This is a test success message"
        })
      );
      return <Notifications />;
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedSuccessNotifications />
        </BrowserRouter>
      </Provider>
    );
    cy.get(".notification").should(
      "have.css",
      "background-color",
      "rgb(0, 100, 0)"
    );
    cy.get("[data-cy=faIcon]")
      .should("exist")
      .should("have.class", "fa-circle-check");
    cy.get("[data-cy=notifText]").should("include.text", "Success");
    // Success notifications should be auto removed after 8s
    cy.wait(8500);
    cy.get(".notification").should("not.exist");
  });
});
