import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Declarations from "./Declarations";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import Section6 from "./Section6";
import history from "../../../navigation/history";
import { ConfirmProvider } from "material-ui-confirm";

it("should mount section 6 ", () => {
  const MockedDeclarations = () => {
    const dispatch = useAppDispatch();
    dispatch(updatedFormB(submittedFormRPartBs[0]));

    return (
      <Declarations
        prevSectionLabel="Section 6:\nCompliments"
        saveDraft={() => Promise.resolve()}
        history={[]}
        finalSections={[
          {
            component: Section6,
            title: "Section 6:\nCompliments"
          }
        ]}
      />
    );
  };
  mount(
    <Provider store={store}>
      <Router history={history}>
        <ConfirmProvider>
          <MockedDeclarations />
        </ConfirmProvider>
      </Router>
    </Provider>
  );
  cy.get(".nhsuk-panel-with-label__label")
    .should("exist")
    .should("include.text", "Declaration");
  cy.get("[data-cy=isDeclarationAccepted0]").should("exist").click();
  cy.get("[data-cy=isConsentAccepted0]").should("exist").click();
  cy.get("[data-cy=BtnSubmitForm]").should("exist").click();
  cy.get(".MuiDialog-container")
    .should("exist")
    .should("include.text", "Please think carefully before submitting");
  cy.get(".MuiDialogActions-root > :nth-child(1)").click();
  cy.get(".MuiDialog-container").should("not.exist");
  cy.get("[data-cy=BtnSubmitForm]").should("exist").click();
  cy.get(".MuiDialog-scrollPaper ").should("exist").click(1, 1);
  cy.get(".MuiDialog-container").should("not.exist");
  cy.get("[data-cy=isConsentAccepted0]").should("exist").click();
  cy.get("#isConsentAccepted--error-message")
    .should("exist")
    .should("contain.text", "Error: You must confirm your acceptance");
  cy.get("[data-cy=BtnSubmitForm]").should("be.disabled");
  cy.get("[data-cy=isConsentAccepted0]").should("exist").click();
  cy.get("[data-cy=BtnSubmitForm]").should("not.be.disabled").click();
  cy.get(".MuiDialogActions-root > :nth-child(2)").click();
  cy.get(".MuiDialog-container").should("not.exist");
});
