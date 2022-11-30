import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartAs } from "../../../../src/mock-data/submitted-formr-parta";
import { useAppDispatch } from "../../../../src/redux/hooks/hooks";
import { updatedFormA } from "../../../../src/redux/slices/formASlice";
import store from "../../../../src/redux/store/store";
import View from "../../../../src/components/forms/formr-part-a/View";
import history from "../../../../src/components/navigation/history";
import React from "react";

describe("View", () => {
  it("should not render View if no tisId", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <View canEdit={false} history={[]} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=linkHowToExport]").should("not.exist");
    cy.get("[data-cy=warningConfirmation]").should("not.exist");
  });
  it("should render view component with save PDF btn/link for submitted form.", () => {
    const MockedView = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormA(submittedFormRPartAs[0]));

      return <View canEdit={false} history={[]} />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedView />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=backLink]").should(
      "include.text",
      "Go back to forms list"
    );
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
      "Form Submitted on: 02/07/2022"
    );
    cy.get("[data-cy=submissionDate]").should("exist");
    cy.get("[data-cy=submissionDate]").should(
      "include.text",
      "Form Submitted on: 02/07/2022"
    );
  });
  it("should render view component with no save PDF btn/link for unsubmitted form", () => {
    const MockedViewUnsubmitted = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormA(submittedFormRPartAs[1]));

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
  });
});
