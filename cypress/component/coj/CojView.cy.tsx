import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import history from "../../../components/navigation/history";
import React from "react";
import { updatedsigningCojProgName } from "../../../redux/slices/userSlice";
import CojView from "../../../components/forms/conditionOfJoining/CojView";

describe("COJ Contents View", () => {
  beforeEach(() => {
    const MockedCojView = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedsigningCojProgName("General Practice"));
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
    cy.get("[data-cy=declareProvisional0]").should("exist");
    cy.get("[data-cy=cogSignBtn]").should("exist");
  });
  it("should show warning and disable button when clicking signCoj button without agreements", () => {
    cy.get("[data-cy=cogSignBtn]").click();
    cy.get("#declareProvisional--error-message").should("exist");
    cy.get("#declareSatisfy--error-message").should("exist");
    cy.get("#declareProvide--error-message").should("exist");
    cy.get("#declareInform--error-message").should("exist");
    cy.get("#declareUpToDate--error-message").should("exist");
    cy.get("#declareAttend--error-message").should("exist");
    cy.get("#declareEngage--error-message").should("exist");
    cy.get("[data-cy=cogSignBtn]").should("be.disabled");
  });
  it("should show warnings on unchecked agreements", () => {
    cy.get("[data-cy=declareProvisional0]").click();
    cy.get("[data-cy=declareSatisfy0]").click();
    cy.get("[data-cy=declareProvide0]").click();
    cy.get("[data-cy=cogSignBtn]").should("be.disabled");
    cy.get("#declareInform--error-message").should("exist");
    cy.get("#declareUpToDate--error-message").should("exist");
    cy.get("#declareAttend--error-message").should("exist");
    cy.get("#declareEngage--error-message").should("exist");
  });
  it("should not show warning and enable button if all agreements are checked", () => {
    cy.get("[data-cy=declareProvisional0]").click();
    cy.get("[data-cy=declareSatisfy0]").click();
    cy.get("[data-cy=declareProvide0]").click();
    cy.get("[data-cy=declareInform0]").click();
    cy.get("[data-cy=declareUpToDate0]").click();
    cy.get("[data-cy=declareAttend0]").click();
    cy.get("[data-cy=declareEngage0]").click();
    cy.get("[data-cy=cogSignBtn]").click();
    cy.get("#declareProvisional--error-message").should("not.exist");
    cy.get("#declareSatisfy--error-message").should("not.exist");
    cy.get("#declareProvide--error-message").should("not.exist");
    cy.get("#declareInform--error-message").should("not.exist");
    cy.get("#declareUpToDate--error-message").should("not.exist");
    cy.get("#declareAttend--error-message").should("not.exist");
    cy.get("#declareEngage--error-message").should("not.exist");
    cy.get("[data-cy=cogSignBtn]").should("not.be.disabled");
  });
});
