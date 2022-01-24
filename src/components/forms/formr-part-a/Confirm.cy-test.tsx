import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { submittedFormRPartAs } from "../../../mock-data/submitted-formr-parta";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { updatedFormA } from "../../../redux/slices/formASlice";
import store from "../../../redux/store/store";
import Confirm from "./Confirm";

describe("Confirm", () => {
  it("should not render the page if no tisId", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <Confirm history={[]} />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=warningSubmit]").should("not.exist");
  });
  it("should mount the Confirm component with declaration and btns", () => {
    const MockedConfirm = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormA(submittedFormRPartAs[0]));

      return <Confirm history={[]} />;
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedConfirm />
        </BrowserRouter>
      </Provider>
    );
    cy.get(".nhsuk-back-link__link")
      .should("exist")
      .should("include.text", "back to list");
    cy.get(
      ":nth-child(2) > .nhsuk-warning-callout > .nhsuk-warning-callout__label"
    ).should("include.text", "Confirmation");
    cy.get(
      ":nth-child(4) > .nhsuk-summary-list > :nth-child(2) > .nhsuk-summary-list__value"
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

    cy.get("[data-cy=BtnEdit]").should("exist").click();
    cy.get("[data-cy=BtnSaveDraft]").should("exist").click();
    cy.get("[data-cy=BtnSubmit]").should("exist").click();
    cy.get(
      ":nth-child(2) > .nhsuk-warning-callout > .nhsuk-warning-callout__label"
    ).should("not.exist");
  });
});
