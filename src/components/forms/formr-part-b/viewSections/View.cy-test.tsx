import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import {
  submittedFormRPartBs,
  submittedFormRPartBsWithDraft
} from "../../../../mock-data/submitted-formr-partb";
import store from "../../../../redux/store/store";
import history from "../../../navigation/history";
import View from "./View";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";

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
      "Form Submitted on: 22/04/2020"
    );
    cy.get("[data-cy=submissionDate]").should("exist");
    cy.get("[data-cy=submissionDate]").should(
      "include.text",
      "Form Submitted on: 22/04/2020"
    );
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
});
