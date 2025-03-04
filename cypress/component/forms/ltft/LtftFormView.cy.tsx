import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import {
  updatedCanEditLtft,
  updatedLtft
} from "../../../../redux/slices/ltftSlice";
import { mockLtftDraft0 } from "../../../../mock-data/mock-ltft-data";
import { LtftFormView } from "../../../../components/forms/ltft/LtftFormView";

const mountLtftViewWithMockData = () => {
  store.dispatch(updatedLtft(mockLtftDraft0));
  store.dispatch(updatedCanEditLtft(true));
  mount(
    <Provider store={store}>
      <Router history={history}>
        <LtftFormView />
      </Router>
    </Provider>
  );
};

describe("LTFT Form View", () => {
  beforeEach(() => {
    mountLtftViewWithMockData();
  });
  it("renders an existing LTFT form that has just been edited", () => {
    cy.get('[data-cy="cct-calc-summary-header"]')
      .should("exist")
      .contains("CCT Calculation Summary");
    cy.get(
      '[data-cy="edit-Your Training Programme Director (TPD) details"]'
    ).should("exist");
    cy.get('[data-cy="edit-Other discussions (if applicable)"]').should(
      "exist"
    );
    cy.get('[data-cy="edit-Reason(s) for applying"]').should("exist");
    cy.get('[data-cy="edit-Personal Details"]').should("exist");
    cy.get('[data-cy="informationIsCorrect"]').should("exist");
    cy.get('[data-cy="notGuaranteed"]').should("exist");
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
  });

  it("should enable the submit button when declarations are checked", () => {
    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="BtnSubmit"]').should("not.be.disabled");
  });

  it("should open the pre-submit modal when submit button is clicked", () => {
    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="BtnSubmit"]').click();
    cy.get('[data-cy="dialogModal"]').should("exist");
    cy.get('[data-cy="ltftModalWarning"]').should("exist");
    cy.get('[data-cy="ltft-modal-save-btn"]').should("exist");
    cy.get('[data-cy="ltft-modal-save-btn"]').should("be.disabled");
    // should keep disable if trim Name is empty
    cy.get("#ltftName").type("  ");
    cy.get('[data-cy="ltft-modal-save-btn"]').should("be.disabled");
    // should enable the submit button when Name is inputted
    cy.get("#ltftName").type("Test Application");
    cy.get('[data-cy="ltft-modal-save-btn"]').should("not.be.disabled");
    // should close the pre-submit modal when clicking Cancel
    cy.get('[data-cy="dialogModal"] button').contains("Cancel").click();
    cy.get('[data-cy="dialogModal"]').should("not.be.visible");
  });
});
