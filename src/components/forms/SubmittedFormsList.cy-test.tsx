import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import SubmittedFormsList from "./SubmittedFormsList";
import store from "../../redux/store/store";
import { submittedFormRPartAs } from "../../mock-data/submitted-formr-parta";

describe("SubmittedFormsList", () => {
  it("should show no forms submitted msg if no submitted forms", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <SubmittedFormsList formRList={[]} path="/formr-a" history={[]} />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=formsFalseHint]")
      .should("exist")
      .should(
        "contain.text",
        "After you submit your completed form, instructions on how to save a copy as a PDF will appear here."
      );
    cy.get("[data-cy=noSubmittedFormsMsg]").should("be.visible");
  });
  it("should show a submitted form and help hint when submitted forms", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <SubmittedFormsList
            formRList={submittedFormRPartAs}
            path="/formr-a"
            history={[]}
          />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=formsFalseHint]").should("not.exist");

    cy.get("[data-cy=formsTrueHint]").should(
      "contain.text",
      "To save a PDF copy of your submitted form, please click on a form below and then click the Save a copy as a PDF button at the top of that page."
    );
    cy.get("[data-cy=noSubmittedFormsMsg]").should("not.exist");
    cy.get(".nhsuk-action-link__text").should(
      "include.text",
      "form submitted on 22/04/2020"
    );
    cy.get("[data-cy=formsListWarning]")
      .should("exist")
      .should("contain.text", "Need to amend a recently-submitted form?");
  });
});
