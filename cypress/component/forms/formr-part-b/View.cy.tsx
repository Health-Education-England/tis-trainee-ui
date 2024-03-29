import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import {
  submittedFormRPartBs,
  submittedFormRPartBsWithDraft
} from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import View from "../../../../components/forms/formr-part-b/viewSections/View";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import React from "react";
import { updatedFeatureFlags } from "../../../../redux/slices/featureFlagsSlice";

describe("View", () => {
  it("should not render View if no tisId", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <View canEdit={false} history={[]} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=sectionHeader1]").should("not.exist");
  });
  it("should render view component with save PDF btn/link and declarations for submitted form.", () => {
    const expectedSubStr = "Form submitted on: 22/04/2020 01:00 (BST)";
    const MockedView = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));

      return <View canEdit={false} history={[]} />;
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
    cy.get("[data-cy=localOfficeName]").should(
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
    cy.get("[data-cy=sectionHeader8]")
      .should("exist")
      .should("include.text", "Declarations");
  });
  it("should render view component with no save PDF btn/link and declarations for unsubmitted form", () => {
    const MockedViewUnsubmitted = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBsWithDraft[0]));

      return <View canEdit={true} history={[]} />;
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
    cy.get("[data-cy=sectionHeader8]").should("not.exist");
  });
  it("should not render Covid Section with flag false and haveCovidDeclaration null", () => {
    const MockedViewUnsubmitted = () => {
      const dispatch = useAppDispatch();

      const updatedFormRPartB = {
        ...submittedFormRPartBs[0],
        haveCovidDeclarations: null
      };
      dispatch(
        updatedFeatureFlags({ formRPartB: { covidDeclaration: false } })
      );
      dispatch(updatedFormB(updatedFormRPartB));

      return <View canEdit={true} history={[]} />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedViewUnsubmitted />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=sectionHeader7]").should("not.exist");
  });
  it("should render Covid Section with flag false and haveCovidDeclaration has value", () => {
    const MockedViewUnsubmitted = () => {
      const dispatch = useAppDispatch();

      const updatedFormRPartB = {
        ...submittedFormRPartBs[0],
        haveCovidDeclarations: false
      };
      dispatch(
        updatedFeatureFlags({ formRPartB: { covidDeclaration: false } })
      );
      dispatch(updatedFormB(updatedFormRPartB));

      return <View canEdit={true} history={[]} />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedViewUnsubmitted />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=sectionHeader7]").should("exist");
    cy.get("[data-cy=haveCovidDeclarations]").should("include.text", "No");
  });
  it("should render Covid Section with flag true and haveCovidDeclaration has null value", () => {
    const MockedViewUnsubmitted = () => {
      const dispatch = useAppDispatch();

      const updatedFormRPartB = {
        ...submittedFormRPartBs[0],
        haveCovidDeclarations: null
      };
      dispatch(updatedFeatureFlags({ formRPartB: { covidDeclaration: true } }));
      dispatch(updatedFormB(updatedFormRPartB));

      return <View canEdit={true} history={[]} />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedViewUnsubmitted />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=sectionHeader7]").should("exist");
    cy.get("[data-cy=haveCovidDeclarations]").should("include.text", "No");
  });
});
