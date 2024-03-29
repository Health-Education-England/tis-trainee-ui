import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import SubmittedFormsList from "../../../components/forms/SubmittedFormsList";
import store from "../../../redux/store/store";
import {
  submittedFormRPartAs,
  recentSubmittedFormRPartAs,
  recentSubmitDate
} from "../../../mock-data/submitted-formr-parta";
import history from "../../../components/navigation/history";

describe("SubmittedFormsList", () => {
  it("should show no forms submitted msg if no submitted forms", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <SubmittedFormsList
            formRList={[]}
            path="/formr-a"
            latestSubDate={""}
          />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=formsFalseHint]")
      .should("exist")
      .should(
        "contain.text",
        "After you submit your completed form, instructions on how to save a copy as a PDF will appear here."
      );
    cy.get("[data-cy=noSubmittedFormsMsg]").should("be.visible");
    cy.get("[data-cy=formsListWarning]").should("not.exist");
  });
  it("should show the help hint for unsubmitting forms when there are submitted forms in the list", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <SubmittedFormsList
            formRList={submittedFormRPartAs}
            path="/formr-a"
            latestSubDate={""}
          />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=formsFalseHint]").should("not.exist");

    cy.get("[data-cy=formsTrueHint]").should(
      "contain.text",
      "To save a PDF copy of your submitted form, please click on a form below and then click the Save a copy as a PDF button at the top of that page."
    );
    cy.get("[data-cy=noSubmittedFormsMsg]").should("not.exist");
    cy.get(
      ":nth-child(1) > td > .nhsuk-action-link > [data-cy=submittedForm] > .nhsuk-action-link__text"
    ).should("contain.text", "Form submitted on 02/07/2022 14:12 (BST)");
    cy.get(
      ":nth-child(4) > td > .nhsuk-action-link > [data-cy=submittedForm] > .nhsuk-action-link__text"
    ).should("contain.text", "Form submitted on 22/04/2020 01:00 (BST)");
    cy.get("[data-cy=formsListWarning]")
      .should("exist")
      .should("contain.text", "Important")
      .should("contain.text", "Need to amend a recently-submitted form?");
  });
  it("should show warning when there is recent submitted form", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <SubmittedFormsList
            formRList={recentSubmittedFormRPartAs}
            path="/formr-a"
            latestSubDate={recentSubmitDate}
          />
        </Router>
      </Provider>
    );

    cy.get("[data-cy=noSubmittedFormsMsg]").should("not.exist");
    cy.get("[data-cy=formsListWarning]")
      .should("exist")
      .should("contain.text", "Your previous form was submitted recently on");
  });
});
