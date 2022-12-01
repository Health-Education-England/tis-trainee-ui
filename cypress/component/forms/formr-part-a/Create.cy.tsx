/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../src/redux/store/store";
import Create from "../../../../src/components/forms/formr-part-a/Create";
import { submittedFormRPartAs } from "../../../../src/mock-data/submitted-formr-parta";
import { mockedCombinedReference } from "../../../../src/mock-data/combinedReferenceData";
import { useAppDispatch } from "../../../../src/redux/hooks/hooks";
import { updatedFormA } from "../../../../src/redux/slices/formASlice";
import { updatedReference } from "../../../../src/redux/slices/referenceSlice";
import { FormRUtilities } from "../../../../src/utilities/FormRUtilities";
import history from "../../../../src/components/navigation/history";
import React from "react";

describe("Form R Part A - Create", () => {
  it("should not render the form if no tisId", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Create history={[]} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=BtnContinue]").should("not.exist");
  });
  it("should mount the Create component", () => {
    const MockedCreate = () => {
      cy.stub(FormRUtilities, "historyPush").as("NewUrl");
      const dispatch = useAppDispatch();
      dispatch(updatedFormA(submittedFormRPartAs[0]));
      dispatch(updatedReference(mockedCombinedReference));

      return <Create history={[]} />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedCreate />
        </Router>
      </Provider>
    );
    cy.testDataSourceLink();
    cy.get("[data-cy=backLink]").click();
    cy.get("@NewUrl").should("have.been.called");
    cy.get("#forename").should("exist").should("have.value", "Anthony Mara");
    cy.get("#immigrationStatus")
      .should("exist")
      .select("British National Overseas")
      .should("have.value", "British National Overseas");
    cy.get("[data-cy=cctSpecialty1]").should("not.exist");
    cy.get("[data-cy=cctSpecialty2]").should("not.exist");
    cy.get("[data-cy=declarationType0]").click();
    cy.get("[data-cy=cctSpecialty1]").should("exist");
    cy.get("[data-cy=cctSpecialty2]").should("exist");

    cy.get(".nhsuk-error-summary").should("exist");

    cy.get("[data-cy=postCode]").should("exist").clear().type("123456");
    cy.get(".field-warning-msg")
      .should("exist")
      .should("include.text", "Warning: Non-UK postcode detected");
    cy.get("[data-cy=postCode]").should("exist").clear().type("WC1B 5DA");
    cy.get(".field-warning-msg").should("not.exist");

    cy.get("[data-cy=BtnContinue]").should("exist").click();
    cy.get("[data-cy=BtnSaveDraft]").should("exist").click();
  });
});
