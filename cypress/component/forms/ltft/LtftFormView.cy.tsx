import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import {
  updatedCanEditLtft,
  updatedLtft,
  updatedLtftStatus
} from "../../../../redux/slices/ltftSlice";
import {
  mockLtftDraft0,
  mockLtftDraft1,
  mockLtftRejected0,
  mockLtftUnsubmitted0
} from "../../../../mock-data/mock-ltft-data";
import { LtftFormView } from "../../../../components/forms/ltft/LtftFormView";
import { FileUtilities } from "../../../../utilities/FileUtilities";
import { LtftObj } from "../../../../models/LtftTypes";

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
    cy.get('[data-cy="savePdfBtn"]').should("exist");
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
    cy.get('[data-cy="supportingInformation-value"]').contains("Not provided");
    cy.get('[data-cy="BtnSubmit"]').should("not.exist");
    cy.get('[data-cy="BtnSaveDraft"]').should("not.exist");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
    // status details section should not exist in DRAFT
    cy.get('[data-cy="ltftName"]').should("not.exist");
    cy.get('[data-cy="ltftCreated"]').should("not.exist");
    cy.get('[data-cy="ltftModified"]').should("not.exist");
    cy.get('[data-cy="ltftRef"]').should("not.exist");
  });
});

describe("LTFT Form View - editable & no name", () => {
  beforeEach(() => {
    mountLtftViewWithMockData(mockLtftDraft0);
    store.dispatch(updatedCanEditLtft(true));
  });
  it("renders an existing LTFT form that has just been edited", () => {
    cy.get('[data-cy="savePdfBtn"]').should("exist");
    cy.get('[data-cy="cct-calc-summary-header"]')
      .should("exist")
      .contains("CCT Calculation Summary");
    cy.get('[data-cy="edit-tpdName"]').should("exist");
    cy.get('[data-cy="edit-reasonsSelected"]').should("exist");
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
    cy.get('[data-cy="cct-recalc-warning-label"]').should("not.exist");
  });
});

describe("LTFT Form View - unsubmitted", () => {
  before(() => {
    mountLtftViewWithMockData(mockLtftUnsubmitted0);
  });

  it("should render the editable section and correct buttons", () => {
    // status details section
    cy.get('[data-cy="UNSUBMITTED-header"]')
      .should("exist")
      .contains("Unsubmitted application");
    cy.get('[data-cy="ltftName"]').contains("my Unsubmitted LTFT");
    cy.get('[data-cy="ltftCreated"]').should("exist");
    cy.get('[data-cy="ltftModified"]').should("exist");
    cy.get('[data-cy="ltfReason"]').contains("Change WTE percentage");
    cy.get('[data-cy="ltftModifiedBy"]').contains("TIS Admin");
    cy.get('[data-cy="ltftMessage"]').contains("status reason message");
    cy.get('[data-cy="ltftRef"]').contains("ltft_4_001");
    cy.get('[data-cy="supportingInformation-value"]').contains("Not provided");

    // recalc section
    cy.get('[data-cy="cct-recalc-warning-label"]').contains(
      "Recalculating your New completion date"
    );
    cy.get('[data-cy="cct-recalc-warning-callout"] > p')
      .first()
      .should(
        "include.text",
        "If required, please edit the Change date and/or Proposed WTE"
      );
    cy.get('[data-cy="cct-recalc-warning-callout"] > p')
      .last()
      .should(
        "include.text",
        "Please note: Any updated values are not saved until"
      );

    // changeDate field edit
    cy.get('[data-cy="changeDate-readonly"]').should(
      "include.text",
      "01/01/2027"
    );
    cy.get('[data-cy="cct-recalculate-btn"]').should("not.exist");
    cy.get('[data-cy="edit-btn_date"]').should("include.text", "Edit").click();
    cy.get('[data-cy="input-symbol"]').should("not.exist");
    cy.get('[data-cy="cct-recalculate-btn"]').should("exist");
    cy.get('[data-cy="changeDate-readonly"]').should("not.exist");
    cy.get('[data-cy="changeDate"]')
      .should("exist")
      .should("have.value", "2027-01-01");
    cy.get('[data-cy="changeDate"]').type("2022-06-30");
    cy.get("#changeDate--error-message")
      .should("exist")
      .should("include.text", "Change date cannot be before today");

    // revert changeDate field
    cy.get('[data-cy="edit-btn_date"]')
      .should("include.text", "Revert")
      .click();
    cy.get("#changeDate--error-message").should("not.exist");
    cy.get('[data-cy="changeDate"]').should("not.exist");
    cy.get('[data-cy="changeDate-readonly"]')
      .should("exist")
      .should("include.text", "01/01/2027");

    // edit changeDate again
    cy.get('[data-cy="edit-btn_date"]').should("include.text", "Edit").click();
    cy.get('[data-cy="changeDate-readonly"]').should("not.exist");
    cy.get('[data-cy="changeDate"]')
      .should("exist")
      .should("have.value", "2022-06-30");
    cy.get("#changeDate--error-message").should("exist");
    cy.get('[data-cy="changeDate"]').type("2027-06-30");
    cy.get("#changeDate--error-message").should("not.exist");

    // Wte field edit
    cy.get('[data-cy="wte-readonly"]').should("include.text", "80%");
    cy.get('[data-cy="edit-btn_wte"]').should("include.text", "Edit").click();
    cy.get('[data-cy="wte-readonly"]').should("not.exist");
    cy.get('[data-cy="input-symbol"]')
      .should("exist")
      .should("include.text", "%");
    cy.get('[data-cy="wte"]').clear().type("100");
    cy.get("#wte--error-message")
      .should("exist")
      .should("include.text", "WTE values must be different");
    cy.get('[data-cy="input-symbol"]').should("not.exist");
    cy.get('[data-cy="cct-recalculate-btn"]').should("be.disabled");
    cy.get('[data-cy="wte"]').clear().type("60");
    cy.get("#wte--error-message").should("not.exist");
    cy.get('[data-cy="cct-recalculate-btn"]').should("not.be.disabled").click();
    cy.get('[data-cy="saved-cct-date"]').should("include.text", "04/05/2028");

    cy.get('[data-cy="BtnSubmit"]').should("exist").contains("Re-submit");
    cy.get('[data-cy="BtnSaveDraft"]').should("exist");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
  });
});

describe("LTFT Form View - rejected", () => {
  before(() => {
    mountLtftViewWithMockData(mockLtftRejected0);
  });

  it("should render rejected reason", () => {
    // status details section
    cy.get('[data-cy="REJECTED-header"]')
      .should("exist")
      .contains("Rejected application");
    cy.get('[data-cy="ltftName"]').contains("my Rejected LTFT");
    cy.get('[data-cy="ltftCreated"]').should("exist");
    cy.get('[data-cy="ltftModified"]').should("exist");
    cy.get('[data-cy="ltfReason"]').contains("Rejected reason");
    cy.get('[data-cy="ltftModifiedBy"]').contains("TIS Admin");
    cy.get('[data-cy="ltftMessage"]').contains("Rejected message");
    cy.get('[data-cy="ltftRef"]').contains("ltft_5_001");
    cy.get('[data-cy="supportingInformation-value"]').contains("Not provided");
  });
});

describe("Disable Ltft PDF Download Button (no form ID)", () => {
  beforeEach(() => {
    mountLtftViewWithMockData(mockLtftDraft0);
  });
  it("should disable 'save Pdf' button for LTFT without form ID", () => {
    cy.get('[data-cy="savePdfBtn"]').should("exist").should("be.disabled");
    cy.get('[data-cy="pdfButtonInfo-icon"]').should("be.visible");
  });
});

describe("Download Ltft PDF", () => {
  beforeEach(() => {
    mountLtftViewWithMockData(mockLtftDraft1);
  });
  it("should show 'save Pdf' button and able to download PDF for LTFT with form ID", () => {
    cy.stub(FileUtilities, "downloadPdf").as("DownloadPDF");
    cy.get('[data-cy="savePdfBtn"]').should("exist").should("not.be.disabled");
    cy.get("[data-cy=savePdfBtn]").click();
    cy.get("@DownloadPDF").should("have.been.called");
    cy.get('[data-cy="pdfButtonInfo-icon"]').should("not.exist");
  });
});

describe("LTFT Form View - empty array field logic", () => {
  const mockLtftEmptyArray = {
    ...mockLtftDraft0,
    reasonsSelected: []
  };

  it("should display 'Not provided' and NO change link when read-only", () => {
    store.dispatch(updatedCanEditLtft(false));
    store.dispatch(updatedLtftStatus("succeeded"));
    mountLtftViewWithMockData(mockLtftEmptyArray);

    cy.get('[data-cy="empty-array-panel-val"]').should("exist");

    cy.get('[data-cy="edit-otherDiscussions"]').should("not.exist");
  });

  it("should display 'Not provided' AND a change link when editable", () => {
    store.dispatch(updatedCanEditLtft(true));
    mountLtftViewWithMockData(mockLtftEmptyArray);

    cy.get('[data-cy="empty-array-panel-val"]').should("exist");

    cy.get('[data-cy="edit-otherDiscussions"]')
      .should("exist")
      .should("contain.text", "Change");
  });
});
