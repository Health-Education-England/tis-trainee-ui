/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />

import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { addNotification } from "../../../redux/slices/notificationsSlice";
import store from "../../../redux/store/store";
import Notifications from "./Notifications";
import history from "../../navigation/history";

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
        <Router history={history}>
          <MockedErrorNotifications />
        </Router>
      </Provider>
    );
    cy.checkForErrorNotif("Error");
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
        <Router history={history}>
          <MockedSuccessNotifications />
        </Router>
      </Provider>
    );
    cy.checkForSuccessNotif("Success");
  });
});