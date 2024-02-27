import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartAs } from "../../../../mock-data/submitted-formr-parta";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import {
  updatedCanEdit,
  updatedFormA
} from "../../../../redux/slices/formASlice";
import store from "../../../../redux/store/store";
import FormAView from "../../../../components/forms/form-builder/form-r/part-a/FormAView";
import history from "../../../../components/navigation/history";
import React from "react";

describe("View", () => {
  it("should not render View if no tisId", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormAView />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=linkHowToExport]").should("not.exist");
    cy.get("[data-cy=warningConfirmation]").should("not.exist");
  });
  it("should render view component with save PDF btn/link for submitted form.", () => {
    const expectedSubStr = "Form submitted on: 02/07/2022 14:12 (BST)";
    const MockedView = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormA(submittedFormRPartAs[0]));

      return <FormAView />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedView />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=backLink]").should("include.text", "Back to forms list");
    cy.get("[data-cy=savePdfBtn]").should("exist");
    cy.get("[data-cy=pdfHelpLink]")
      .should("include.text", "Click here for help saving form as a PDF")
      .should(
        "have.attr",
        "href",
        "https://tis-support.hee.nhs.uk/trainees/how-to-save-form-as-pdf/"
      );
    cy.get('[data-cy="localOfficeName-value"]').should(
      "include.text",
      "Health Education England Thames Valley"
    );
    cy.get("[data-cy=BtnEdit]").should("not.exist");
    cy.get("[data-cy=BtnSaveDraft]").should("not.exist");
    cy.get("[data-cy=BtnSubmit]").should("not.exist");
    cy.get("[data-cy=submissionDateTop]").should("exist");
    cy.get("[data-cy=submissionDateTop]").should(
      "include.text",
      expectedSubStr
    );
    cy.get("[data-cy=submissionDate]").should("exist");
    cy.get("[data-cy=submissionDate]").should("include.text", expectedSubStr);
  });
  it("should render view component with no save PDF btn/link for unsubmitted form", () => {
    const MockedViewUnsubmitted = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedFormA({ ...submittedFormRPartAs[1], wholeTimeEquivalent: "" })
      );
      dispatch(updatedCanEdit(true));
      return <FormAView />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedViewUnsubmitted />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=backLink]").should("not.exist");
    cy.get("[data-cy=savePdfBtn]").should("not.exist");
    cy.get("[data-cy=pdfHelpLink]").should("not.exist");
  });

  it("should display the error messages for any fields failing validation", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormAView />
        </Router>
      </Provider>
    );

    cy.get(".nhsuk-error-summary").should("exist");
    cy.get(
      '[data-cy="error-txt-Date of Birth is before the minimum date allowed"]'
    ).should("exist");
    cy.get(
      '[data-cy="error-txt-Anticipated completion date - please choose a future date"]'
    ).should("exist");
    cy.get(
      '[data-cy="error-txt-Training hours (Full Time Equivalent) needs to be a number less than or equal to 1 and greater than zero (a maximum of 2 decimal places)"]'
    ).should("exist");
    cy.get('[data-cy="dateOfBirth-label"]').should(
      "have.class",
      "nhsuk-error-message"
    );
    cy.get('[data-cy="completionDate-label"]').should(
      "have.class",
      "nhsuk-error-message"
    );
    cy.get('[data-cy="wholeTimeEquivalent-label"]').should(
      "have.class",
      "nhsuk-error-message"
    );
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
  });
  it("should display no error message when form passes validation", () => {
    const MockedViewNoErrors = () => {
      const dispatch = useAppDispatch();
      dispatch(
        updatedFormA({
          ...submittedFormRPartAs[1],
          dateOfBirth: "01/01/2000",
          completionDate: "01/01/2030",
          wholeTimeEquivalent: "0.5"
        })
      );
      return <FormAView />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedViewNoErrors />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
    cy.get('[data-cy="isCorrect"]').should("exist").click();
    cy.get('[data-cy="willKeepInformed"]').should("exist").click();
    cy.get('[data-cy="BtnSubmit"]').should("not.be.disabled");
  });
});
