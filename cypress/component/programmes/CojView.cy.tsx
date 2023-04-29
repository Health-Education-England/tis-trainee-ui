import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import history from "../../../components/navigation/history";
import React from "react";
import {
  updatedsigningCoj,
  updatedsigningCojProgName
} from "../../../redux/slices/userSlice";
import CojView from "../../../components/forms/conditionOfJoining/CojView";

describe("COJ Contents View", () => {
  beforeEach(() => {
    const MockedCojView = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedsigningCojProgName("General Practice"));
      dispatch(updatedsigningCoj(true));
      return <CojView />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedCojView />
        </Router>
      </Provider>
    );
  });
  it("should display COJ contents", () => {
    cy.get("[data-cy=cojHeading]").should("exist");
    cy.contains("General Practice").should("exist");
    cy.get("[data-cy=cogSignBtn]").should("exist");
  });
});
