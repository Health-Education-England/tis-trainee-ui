/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts"/>

import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { updatedFeatureFlags } from "../../../redux/slices/featureFlagsSlice";
import {
  updatedFormB,
  updateFormBSection
} from "../../../redux/slices/formBSlice";
import store from "../../../redux/store/store";
import Create from "./Create";
import { submittedFormRPartBs } from "../../../mock-data/submitted-formr-partb";
import { updatedReference } from "../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../mock-data/combinedReferenceData";
import history from "../../navigation/history";

describe("Create form B", () => {
  const currRevalDate = Cypress.dayjs().add(3, "month").format("YYYY-MM-DD");
  it("should not render a section if no tisId", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Create history={[]} />
        </Router>
      </Provider>
    );
  });
  it("should render a stepper with Covid Section if Covid feature flag is true", () => {
    const MockedCreate = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFeatureFlags({ formRPartB: { covidDeclaration: true } }));
      dispatch(updatedFormB(submittedFormRPartBs[0]));
      dispatch(updatedReference(mockedCombinedReference));

      dispatch(updateFormBSection(7));

      return <Create history={[]} />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedCreate />
        </Router>
      </Provider>
    );
    cy.get(".progress-step").eq(6).should("have.class", "progress-step-active");
    cy.get("[data-cy=legendFieldsetCovid]")
      .should("exist")
      .should("include.text", "Pandemic");
    cy.get(
      "[data-cy=LinkToNextSection] > .nhsuk-pagination__page > div"
    ).should("include.text", "Review & Submit");
    cy.get(
      "[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page > :nth-child(1)"
    ).should("include.text", "Section 6");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
  });
  it("should show the Confirm section when Covid feature flag is false", () => {
    const MockedCreateNoFlag = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedFeatureFlags({ formRPartB: { covidDeclaration: false } })
      );
      return <Create history={[]} />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedCreateNoFlag />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-warning-callout__label").should(
      "include.text",
      "Confirmation"
    );
    cy.get("[data-cy=sectionHeader1]").should(
      "include.text",
      "Section 1: Doctor's details"
    );
    cy.get("[data-cy=forename]").should("have.text", "Anthony Mara");
    cy.get("[data-cy=BtnEditSection1]").should("exist").click();
    cy.get(".progress-step").eq(0).should("have.class", "progress-step-active");
    cy.get("[data-cy=forename]").click().clear();
    cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("exist");
    cy.get("#forename--error-message").should("exist");
    cy.get("[data-cy=forename]").type("Tony");
    cy.get("#forename--error-message").should("not.exist");
    cy.get("[data-cy=currRevalDate]")
      .should("exist")
      .clear()
      .type(currRevalDate);
    cy.get("[data-cy=BtnBackToSubmit]").should("exist").click();
    cy.get(".nhsuk-warning-callout__label").should(
      "include.text",
      "Confirmation"
    );
    cy.get("[data-cy=forename]").should("have.text", "Tony");
    cy.get("[data-cy=submissionDateTop]").should("not.exist");
    cy.get("[data-cy=submissionDate]").should("not.exist");
    cy.get(
      "[data-cy=declaration] > .nhsuk-card__content > .nhsuk-card__heading"
    ).should("exist");
    cy.get("[data-cy=BtnSubmitForm]").should("exist").click();
    cy.get("#isDeclarationAccepted--error-message").should("exist");
    cy.get("#isConsentAccepted--error-message").should("exist");
    cy.get("[data-cy=isDeclarationAccepted0]").click();
    cy.get("[data-cy=isConsentAccepted0]").click();
    cy.get("#isDeclarationAccepted--error-message").should("not.exist");
    cy.get("#isConsentAccepted--error-message").should("not.exist");
  });
  it("should show 'get back to submit' btn after editing but hide after choosing normal section navigation", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Create history={[]} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=BtnEditSection2]").click();
    cy.get(".progress-step").eq(1).should("have.class", "progress-step-active");
    cy.get("[data-cy=closeIcon1] > .nhsuk-icon > path").click();
    cy.get(
      ":nth-child(2) > :nth-child(1) > .nhsuk-grid-column-one-quarter > h3"
    ).should("not.exist");
    cy.get("[data-cy=BtnBackToSubmit]").should("exist").click();
    cy.get("[data-cy=BtnEditSection3]").click();
    cy.get(".progress-step").eq(2).should("have.class", "progress-step-active");
    cy.get(
      "[data-cy=LinkToPreviousSection] > .nhsuk-pagination__title"
    ).click();
    cy.get("[data-cy=BtnBackToSubmit]").should("not.exist");
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__title").click();
    cy.get("[data-cy=BtnBackToSubmit]").should("not.exist");
    cy.get(
      ":nth-child(2) > :nth-child(1) > .nhsuk-grid-column-one-quarter > h3"
    ).should("not.exist");
    cy.get("[data-cy=BtnSaveDraft]").should("exist").click();
  });
});
