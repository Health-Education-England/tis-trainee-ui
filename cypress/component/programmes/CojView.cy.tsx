import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import history from "../../../components/navigation/history";
import React from "react";
import {
  updatedsigningCoj,
  updatedsigningCojProgName,
  updatedsigningCojVersion
} from "../../../redux/slices/userSlice";
import CojView from "../../../components/forms/conditionOfJoining/CojView";

describe("COJ Contents View", () => {
  beforeEach(() => {
    const MockedCojView9 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedsigningCojProgName("General Practice"));
      dispatch(updatedsigningCoj(true));
      dispatch(updatedsigningCojVersion("GG10"));
      return <CojView />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedCojView9 />
        </Router>
      </Provider>
    );
  });
  it("should display COJ contents", () => {
    cy.get("[data-cy=cojHeading]").should("exist");
    cy.contains("General Practice").should("exist");
    cy.get("[data-cy=isDeclareProvisional0]").should("exist");
    cy.get("[data-cy=cojSignBtn]").should("exist");
  });
  it("should show warning and disable button when clicking signCoj button without agreements", () => {
    cy.get("[data-cy=cojSignBtn]").click();
    cy.get("#isDeclareProvisional--error-message").should("exist");
    cy.get("#isDeclareSatisfy--error-message").should("exist");
    cy.get("#isDeclareProvide--error-message").should("exist");
    cy.get("#isDeclareInform--error-message").should("exist");
    cy.get("#isDeclareUpToDate--error-message").should("exist");
    cy.get("#isDeclareAttend--error-message").should("exist");
    cy.get("#isDeclareContacted--error-message").should("exist");
    cy.get("#isDeclareEngage--error-message").should("exist");
    cy.get("[data-cy=cojSignBtn]").should("be.disabled");
  });
  it("should show warnings on unchecked agreements", () => {
    cy.get("[data-cy=isDeclareProvisional0]").click();
    cy.get("[data-cy=isDeclareSatisfy0]").click();
    cy.get("[data-cy=isDeclareProvide0]").click();
    cy.get("[data-cy=cojSignBtn]").should("be.disabled");
    cy.get("#isDeclareInform--error-message").should("exist");
    cy.get("#isDeclareUpToDate--error-message").should("exist");
    cy.get("#isDeclareAttend--error-message").should("exist");
    cy.get("#isDeclareContacted--error-message").should("exist");
    cy.get("#isDeclareEngage--error-message").should("exist");
  });
  it("should not show warning and enable button if all agreements are checked", () => {
    cy.get("[data-cy=isDeclareProvisional0]").click();
    cy.get("[data-cy=isDeclareSatisfy0]").click();
    cy.get("[data-cy=isDeclareProvide0]").click();
    cy.get("[data-cy=isDeclareInform0]").click();
    cy.get("[data-cy=isDeclareUpToDate0]").click();
    cy.get("[data-cy=isDeclareAttend0]").click();
    cy.get("[data-cy=isDeclareContacted0]").click();
    cy.get("[data-cy=isDeclareEngage0]").click();
    cy.get("[data-cy=cojSignBtn]").click();
    cy.get("#isDeclareProvisional--error-message").should("not.exist");
    cy.get("#isDeclareSatisfy--error-message").should("not.exist");
    cy.get("#isDeclareProvide--error-message").should("not.exist");
    cy.get("#isDeclareInform--error-message").should("not.exist");
    cy.get("#isDeclareUpToDate--error-message").should("not.exist");
    cy.get("#isDeclareAttend--error-message").should("not.exist");
    cy.get("#isDeclareContacted--error-message").should("not.exist");
    cy.get("#isDeclareEngage--error-message").should("not.exist");
    cy.get("[data-cy=cojSignBtn]").should("not.be.disabled");
  });
  it("should not show warning and enable button if all agreements are checked", () => {
    cy.get("[data-cy=backLink]").should("not.exist");
    cy.get("[data-cy=savePdfBtn]").should("not.exist");
    cy.get("[data-cy=pdfHelpLink]").should("not.exist");
    cy.get("[data-cy=sectionHeader8]").should("not.exist");
  });
});
