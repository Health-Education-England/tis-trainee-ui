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
import {
  mockLtftDraft0,
  mockLtftDraft1,
  mockLtftUnsubmitted0
} from "../../../../mock-data/mock-ltft-data";
import { LtftFormView } from "../../../../components/forms/ltft/LtftFormView";

const mountLtftViewWithMockData = (mockLtftObj: LtftObj) => {
  store.dispatch(updatedLtft(mockLtftObj));
  mount(
    <Provider store={store}>
      <Router history={history}>
        <LtftFormView />
      </Router>
    </Provider>
  );
};

describe("LTFT Form View - not editable", () => {
  before(() => {
    store.dispatch(updatedLtftStatus("succeeded"));
    mountLtftViewWithMockData({
      ...mockLtftDraft1,
      declarations: {
        discussedWithTpd: true,
        informationIsCorrect: true,
        notGuaranteed: true
      }
    });
  });

  it("should render the form as read-only", () => {
    cy.get('[data-cy="cct-calc-summary-header"]').should("exist");
    cy.get(
      '[data-cy="edit-Your Training Programme Director (TPD) details"]'
    ).should("not.exist");
    cy.get('[data-cy="edit-Other discussions (if applicable)"]').should(
      "not.exist"
    );
    cy.get('[data-cy="edit-Reason(s) for applying"]').should("not.exist");
    cy.get('[data-cy="edit-Personal Details"]').should("not.exist");
    cy.get('[data-cy="informationIsCorrect"]')
      .should("be.checked")
      .should("have.attr", "readonly");
    cy.get('[data-cy="notGuaranteed"]')
      .should("be.checked")
      .should("have.attr", "readonly");
    cy.get('[data-cy="BtnSubmit"]').should("not.exist");
    cy.get('[data-cy="BtnSaveDraft"]').should("not.exist");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
    cy.get('[data-cy="ltftName"]').contains("My Programme - Hours Reduction");
    cy.get('[data-cy="ltftCreated"]').should("exist");
    cy.get('[data-cy="ltftSubmitted"]').should("exist");
    cy.get('[data-cy="ltftRef"]').contains("ltft_-1_001");
    cy.get('[data-cy="supportingInformation-value"]').contains("Not provided");
  });
});

describe("LTFT Form View - editable & no name", () => {
  beforeEach(() => {
    mountLtftViewWithMockData(mockLtftDraft0);
    store.dispatch(updatedCanEditLtft(true));
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
    cy.get('[data-cy="BtnSaveDraft"]').should("exist");
    cy.get('[data-cy="startOverButton"]').should("exist");
  });

  it("should enable the submit button when declarations are checked and input name text", () => {
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
    cy.get('[data-cy="name"]').type("Test Application");
    cy.get('[data-cy="BtnSubmit"]').should("not.be.disabled");
  });

  it("should open the pre-submit modal when submit button is enabled and clickable", () => {
    cy.get('[data-cy="informationIsCorrect"]').check();
    cy.get('[data-cy="notGuaranteed"]').check();
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
    cy.get("#ltftName").type("  ");
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
    // should enable the submit button when Name is inputted
    cy.get("#ltftName").type("Test Application");
    cy.get('[data-cy="BtnSubmit"]').should("not.be.disabled").click();
    cy.get('[data-cy="dialogModal"]').should("exist");
  });
});

describe("LTFT Form View - editable & saved name", () => {
  before(() => {
    mountLtftViewWithMockData(mockLtftDraft1);
  });

  it("should render the saved name in the form", () => {
    cy.get("#ltftName").should("have.value", "My Programme - Hours Reduction");
  });
});

describe("LTFT Form View - unsubmitted", () => {
  before(() => {
    mountLtftViewWithMockData(mockLtftUnsubmitted0);
  });

  it("should render the correct buttons", () => {
    cy.get('[data-cy="BtnSubmit"]').should("exist").contains("Re-submit");
    cy.get('[data-cy="BtnSaveDraft"]').should("exist");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
  });
});
