import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { submittedFormRPartAs } from "../../../mock-data/submitted-formr-parta";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { updatedFormA } from "../../../redux/slices/formASlice";
import store from "../../../redux/store/store";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
import Confirm from "./Confirm";
import history from "../../navigation/history";

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
          <MockedConfirm />
        </Router>
      </Provider>
    );
    cy.get(
      ":nth-child(2) > .nhsuk-warning-callout > .nhsuk-warning-callout__label"
    ).should("include.text", "Confirmation");
    cy.get(
      ":nth-child(3) > .nhsuk-summary-list > :nth-child(2) > .nhsuk-summary-list__value"
    ).should("have.text", "Gilliam");
    cy.contains("Declarations").should("exist");
    cy.get(
      ".page-break > .nhsuk-summary-list > :nth-child(1) > .nhsuk-summary-list__value"
    ).should("include.text", "CESR CP");
    cy.contains("Warning").should("exist");
    cy.get("[data-cy=warningSubmit] > p").should(
      "include.text",
      "By submitting this form, I confirm that the information above is correct"
    );
    cy.stub(FormRUtilities, "historyPush").as("EditViaLink");
    cy.get("[data-cy=BtnEdit]").should("exist").click();
    cy.get("@EditViaLink").should("have.been.called");

    cy.stub(FormRUtilities, "saveDraftA").as("SaveDraft");
    cy.get("[data-cy=BtnSaveDraft]").should("exist").click();
    cy.get("@SaveDraft").should("have.been.called");

    cy.stub(FormRUtilities, "handleSubmitA").as("Submit");
    cy.get("[data-cy=BtnSubmit]").should("exist").click();
    cy.get("@Submit").should("have.been.called");
  });
});
