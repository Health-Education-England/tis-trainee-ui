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
  updatedsigningCojSignedDate
} from "../../../redux/slices/userSlice";
import CojView9 from "../../../components/forms/conditionOfJoining/CojView9";

describe("COJ Contents ReadOnly View", () => {
  beforeEach(() => {
    const MockedCojView9 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedsigningCojProgName("General Practice"));
      dispatch(updatedsigningCoj(true));
      dispatch(updatedsigningCojSignedDate(new Date("2023-01-01")));
      return <CojView9 />;
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
  });
  it("should display signedOn date and not submit button", () => {
    cy.get("[data-cy=cogSignBtn]").should("not.exist");
    cy.get('[data-cy="cojSignedOn"]')
      .should("exist")
      .should("contain.text", "Signed On: 01/01/2023");
  });
  it("should check and disable checkboxes", () => {
    cy.get("[data-cy=isDeclareProvisional0]")
      .should("be.disabled")
      .should("be.checked");
    cy.get("[data-cy=isDeclareSatisfy0]")
      .should("be.disabled")
      .should("be.checked");
    cy.get("[data-cy=isDeclareProvide0]")
      .should("be.disabled")
      .should("be.checked");
    cy.get("[data-cy=isDeclareInform0]")
      .should("be.disabled")
      .should("be.checked");
    cy.get("[data-cy=isDeclareUpToDate0]")
      .should("be.disabled")
      .should("be.checked");
    cy.get("[data-cy=isDeclareAttend0]")
      .should("be.disabled")
      .should("be.checked");
    cy.get("[data-cy=isDeclareEngage0]")
      .should("be.disabled")
      .should("be.checked");
  });
  it("should render view component with save PDF btn/link and declarations for submitted form.", () => {
    cy.get("[data-cy=savePdfBtn]").should("exist");
    cy.get("[data-cy=pdfHelpLink]")
      .should("exist")
      .should(
        "have.attr",
        "href",
        "https://tis-support.hee.nhs.uk/trainees/how-to-save-form-as-pdf/"
      );
  });
});
