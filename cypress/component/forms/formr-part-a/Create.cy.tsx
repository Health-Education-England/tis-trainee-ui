/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import Create from "../../../../components/forms/formr-part-a/Create";
import { submittedFormRPartAs } from "../../../../mock-data/submitted-formr-parta";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormA } from "../../../../redux/slices/formASlice";
import { updatedReference } from "../../../../redux/slices/referenceSlice";
import { FormRUtilities } from "../../../../utilities/FormRUtilities";
import history from "../../../../components/navigation/history";

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

    // test AutocompleteSelect dropdown
    cy.get(
      '[data-cy="programmeSpecialty"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(".react-select__value-container").contains("Geriatric Medicine");
    cy.get(".react-select__clear-indicator").first().click();
    cy.get(".react-select__value-container").should(
      "include.text",
      "Select or start typing..."
    );
    cy.get('[data-cy="programmeSpecialty"] > .nhsuk-error-message').should(
      "contain.text",
      "Error: Programme specialty is required"
    );

    // test AutocompleteSelect autocomplete
    cy.get(
      '[data-cy="programmeSpecialty"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .type("ger")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(".react-select__value-container").contains("Geriatric Medicine");
    cy.get('[data-cy="programmeSpecialty"] > .nhsuk-error-message').should(
      "not.exist"
    );
    cy.get('[data-cy="cctSpecialty1"] > .nhsuk-error-message').should(
      "contain.text",
      "Error: Specialty 1 for Award of CCT is required"
    );
    cy.get(
      '[data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .type("na")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(".react-select__value-container").contains("ACCS - Anaesthetics");
    cy.get('[data-cy="cctSpecialty1"] > .nhsuk-error-message').should(
      "not.exist"
    );

    cy.get("[data-cy=BtnContinue]").should("exist").click();
    cy.get("[data-cy=BtnSaveDraft]").should("exist").click();
  });
});
