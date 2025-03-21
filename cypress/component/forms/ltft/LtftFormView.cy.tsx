import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import {
  LtftObj,
  updatedCanEditLtft,
  updatedLtft,
  updatedLtftStatus
} from "../../../../redux/slices/ltftSlice";
import { mockLtftDraft0 } from "../../../../mock-data/mock-ltft-data";
import { LtftFormView } from "../../../../components/forms/ltft/LtftFormView";

type LoadStatus = "loading" | "succeeded" | "failed";

const mountLtftViewWithMockData = (
  canEdit: boolean,
  mockData: LtftObj,
  loadStatus?: LoadStatus
) => {
  if (loadStatus) store.dispatch(updatedLtftStatus(loadStatus));
  store.dispatch(updatedLtft(mockData));
  store.dispatch(updatedCanEditLtft(canEdit));
  mount(
    <Provider store={store}>
      <Router history={history}>
        <LtftFormView />
      </Router>
    </Provider>
  );
};

describe("LTFT Form View - editable with no data load", () => {
  beforeEach(() => {
    mountLtftViewWithMockData(true, mockLtftDraft0);
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
    cy.get('[data-cy="BtnSaveDraft"]')
      .should("exist")
      .should("not.be.disabled");
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
    cy.get('[data-cy="ltft-modal-save-btn"]')
      .should("exist")
      .should("be.disabled");
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

describe("LTFT submitted Form View - not editable with successful data load", () => {
  before(() => {
    mountLtftViewWithMockData(
      false,
      {
        ...mockLtftDraft0,
        name: "Bob's LTFT app",
        created: "2025-03-21T13:00:44Z",
        lastModified: "2025-03-21T14:00:44Z"
      },
      "succeeded"
    );
  });
  it("renders a submitted LTFT form", () => {
    cy.get('[data-cy="ltftName"]').contains("Bob's LTFT app");
    cy.get('[data-cy="ltftCreated"]').should(
      "include.text",
      "Fri, 21 Mar 2025 13:00:44 GMT"
    );
    cy.get('[data-cy="ltftSubmitted"]').should(
      "include.text",
      "Fri, 21 Mar 2025 14:00:44 GMT"
    );

    cy.get('[data-cy="cct-calc-summary-header"]')
      .should("exist")
      .contains("CCT Calculation Summary");
    cy.get(
      '[data-cy="edit-Your Training Programme Director (TPD) details"]'
    ).should("not.exist");

    cy.get('[data-cy="edit-Reason(s) for applying"]').should("not.exist");
    cy.get('[data-cy="edit-Personal Details"]').should("not.exist");
    cy.get('[data-cy="informationIsCorrect"]').should("have.attr", "readonly");
    cy.get('[data-cy="notGuaranteed"]').should("have.attr", "readonly");
    cy.get('[data-cy="BtnSubmit"]').should("not.exist");
    cy.get('[data-cy="BtnSaveDraft"]').should("not.exist");
  });
});

describe("LTFT submitted Form View - not editable with loading data", () => {
  before(() => {
    mountLtftViewWithMockData(false, mockLtftDraft0, "loading");
  });
  it("renders a loading spinner", () => {
    cy.get('[data-cy="loading"]').should("exist");
  });
});

describe("LTFT submitted Form View - not editable with failed data load", () => {
  before(() => {
    mountLtftViewWithMockData(false, mockLtftDraft0, "failed");
  });
  it("renders an error page if the saved LTFT form load fails", () => {
    cy.get(".nhsuk-error-summary").should("exist");
  });
});
