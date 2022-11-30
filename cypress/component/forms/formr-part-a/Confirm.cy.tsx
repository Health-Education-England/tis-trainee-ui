import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartAs } from "../../../../src/mock-data/submitted-formr-parta";
import { useAppDispatch } from "../../../../src/redux/hooks/hooks";
import { updatedFormA } from "../../../../src/redux/slices/formASlice";
import store from "../../../../src/redux/store/store";
import { FormRUtilities } from "../../../../src/utilities/FormRUtilities";
import Confirm from "../../../../src/components/forms/formr-part-a/Confirm";
import history from "../../../../src/components/navigation/history";
import { ConfirmProvider } from "material-ui-confirm";
import React from "react";

describe("Confirm", () => {
  it("should not render the page if no tisId", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Confirm history={[]} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=warningSubmit]").should("not.exist");
  });
  it("should mount the Confirm component with declaration and btns", () => {
    const MockedConfirm = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormA(submittedFormRPartAs[1]));

      return <Confirm history={[]} />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ConfirmProvider>
            <MockedConfirm />
          </ConfirmProvider>
        </Router>
      </Provider>
    );
    cy.get("[data-cy=warningConfirmation]").should(
      "include.text",
      "Confirmation"
    );
    cy.get("[data-cy=surname]").should("have.text", "Gilliam");
    cy.contains("Declarations").should("exist");
    cy.get("[data-cy=declarationTypeVal]").should("include.text", "CESR CP");
    cy.contains("Important").should("exist");
    cy.get("[data-cy=warningSubmit] > p").should(
      "include.text",
      "By submitting this form, I confirm that the information above is correct"
    );

    cy.stub(FormRUtilities, "handleSubmitA").as("Submit");
    cy.get("[data-cy=BtnSubmit]").should("exist").click();
    cy.get(".MuiDialog-container")
      .should("exist")
      .should("include.text", "Please think carefully before submitting");
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get("@Submit").should("have.been.called");

    cy.stub(FormRUtilities, "historyPush").as("EditViaLink");
    cy.get("[data-cy=BtnEdit]").should("exist").click();
    cy.get("@EditViaLink").should("have.been.called");

    cy.stub(FormRUtilities, "saveDraftA").as("SaveDraft");
    cy.get("[data-cy=BtnSaveDraft]").should("exist").click();
    cy.get("@SaveDraft").should("have.been.called");

    cy.get("[data-cy=submissionDateTop]").should("not.exist");
    cy.get("[data-cy=submissionDate]").should("not.exist");
  });
});
