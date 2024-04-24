/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Form R (Part B) - mobile", () => {
  it("Should successfully delete a draft form via 'start over' button on forms list page and then display the 'submit new form' button.", () => {
    cy.signInToTss(30000, undefined, "iphone-6");
    cy.get('[data-cy="menuToggleBtn"]').should("exist").click({ force: true }); // force click to avoid any notifications toast
    cy.get('[data-cy="Form R (B)"]').should("exist").click({ force: true });
    cy.get("#btnOpenForm")
      .should("exist")
      .focus()
      .then((loadFormBButton: JQuery) => {
        // ---------- if New form btn ------------------------------------------------------------------
        if (loadFormBButton.attr("data-cy") === "Submit new form") {
          cy.get('[data-cy="Submit new form"]').click({ force: true });
          cy.checkForRecentForm();
        } else {
          cy.get("#btnOpenForm").click({ force: true });
        }
        cy.get(
          '[data-cy="WarningCallout-formBImportantNotice-label"] > span'
        ).should("exist");
        cy.clearAndType("[data-cy=gmcNumber-input]", "55555555");
        cy.wait(2000);
        cy.get('[data-cy="autosaveStatusMsg"]')
          .should("exist")
          .should("include.text", "Autosave status: Success");
        cy.get("[data-cy=BtnSaveDraft]").click();
        cy.wait(5000);
        cy.startOver();
        cy.get('[data-cy="Submit new form"]').should("exist");
      });
  });
});

describe("Form R (Part B) - desktop", () => {
  it("Should complete and save a new draft form", () => {
    cy.signInToTss(30000, "/formr-b", "macbook-15");
    cy.get('[data-cy="Submit new form"]').click();
    cy.checkForRecentForm();
    cy.log("################ complete a new form ###################");
    // 1. Personal Details
    cy.checkAndFillFormBSection1();
    cy.navNext();
    // 2. Work
    cy.checkAndFillFormBSection2();
    cy.navNext();
    // 3. TOOT
    cy.checkAndFillFormBSection3();
    cy.navNext();
    // 4. Declarations relating to Good Medical Practice
    cy.checkAndFillFormBSection4();
    cy.navNext();
    // 5. Good Medical Practice: Health statement
    cy.checkAndFillFormBSection5();
    cy.navNext();
    // 6. Previous Resolved Declarations
    cy.checkAndFillFormBSection6();
    cy.navNext();
    // 7. Previous Unresolved Declarations
    cy.checkAndFillFormBSection7();
    cy.navNext();
    // 8. New Resolved Declarations
    cy.checkAndFillFormBSection8();
    cy.navNext();
    // 9. Current Unresolved Declarations
    cy.checkAndFillFormBSection9();
    cy.navNext();
    // 10. Compliments
    cy.checkAndFillFormBSection10();
    cy.get('[data-cy="navNext"] > .nhsuk-pagination__page')
      .contains("Review & submit")
      .click();
    // save draft
    cy.log("################ save draft ###################");
    cy.get("[data-cy=BtnSaveDraft]").click();
  });
});

// retrieve the saved draft form and submit it
describe("Form R (Part B) - draft form", () => {
  it("should retrieve a saved draft form and submit it", () => {
    cy.signInToTss(0, "/", "macbook-15");
    cy.get('[data-cy="Form R (B)"]').click();
    cy.get('[data-cy="btn-Edit saved draft form"]').click();
    cy.checkForRecentForm;

    cy.log("################ back to confirm page ###################");
    cy.get('[data-cy="BtnShortcutToConfirm"]').should("not.exist");
    cy.navigateBackToConfirm(10);

    // submit form
    cy.log("################ submit form ###################");
    cy.doDeclarationsFormB();
    cy.get("[data-cy=BtnSubmit]")
      .should("exist")
      .should("not.be.disabled")
      .click();

    cy.get(".MuiDialog-container")
      .should("exist")
      .should("include.text", "Please think carefully before submitting");
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get('[data-cy="Submit new form"]').should("exist");

    cy.log(
      "################ check submitted forms list/ form ###################"
    );
    cy.contains("Submitted forms").should("exist");
    cy.get("[data-cy=formsTrueHint]").should("exist");
    // Open the form just saved
    cy.get("[data-cy=submittedForm]").first().click();
    // Check for PDF btn and help link
    cy.get("[data-cy=savePdfBtn]").should("exist");
    cy.get("[data-cy=pdfHelpLink]")
      .should("exist")
      .should(
        "have.attr",
        "href",
        "https://tis-support.hee.nhs.uk/trainees/how-to-save-form-as-pdf/"
      );
    // Check contents
    cy.get('[data-cy="email-value"]').should(
      "have.text",
      "traineeui.tester@hee.nhs.uk"
    );
    // Navigate back to the list
    cy.get(".nhsuk-back-link__link").should("exist").click();
    cy.contains("Submitted forms").should("exist");
  });
});

describe("Form R (Part B) - autosave tests", () => {
  it("Should not autosave if no changes made/autosave if changes made - and then navigate away", () => {
    cy.signInToTss(30000, "/formr-b", "macbook-15");
    cy.get('[data-cy="Submit new form"]').click();
    cy.checkForRecentForm();
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("contain.text", "Form R (Part B)");
    cy.get('[data-cy="homeLink"]').should("exist").click();
    cy.wait(5000); // wait for any toast notifications to disappear
    cy.get('[data-cy="Form R (B)"]').should("exist").click();
    cy.get('[data-cy="Submit new form"]').should("exist").click();
    cy.checkForRecentForm();
    cy.get('[data-cy="autosaveNote"]').should("exist");
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should("contain.text", "Autosave status: Waiting for new changes...");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
    cy.get('[data-cy="email-input"]').type("test.reset@hee.nhs.uk");
    cy.get('[data-cy="autosaveStatusMsg"]').should(
      "include.text",
      "Autosave status: Success"
    );
    cy.get('[data-cy="topNavSupport"]').should("exist").click();
    cy.get('[data-cy="Form R (B)"]').should("exist").click();
    cy.get('[data-cy="btn-Edit saved draft form"]').should("exist");
    cy.startOver();
    cy.get('[data-cy="Submit new form"]').should("exist");
  });
});
