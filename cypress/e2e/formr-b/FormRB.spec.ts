/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import dayjs from "dayjs";
const today = dayjs();

// Things that can be tested here and not in the component tests are:
// - autosave
// - start over/ delete draft form
// - form editing and navigation
// - form submission
// - checking submitted form
// - shortcut btn
// - saving/checking fomr linkage data
// But Note: currently only the unit and component tests are included in the code coverage report

describe("Form R (Part B) - Draft form deletion, autosave, start over", () => {
  it("Should save a new draft form then delete it", () => {
    cy.signInToTss(30000, "/formr-b", "iphone-6");
    cy.get("#btnOpenForm").should("exist").click();
    cy.checkForFormLinkerAndComplete();

    cy.log("No autosave if no changes made");
    cy.get('[data-cy="homeLink"]').should("exist").click();
    cy.get('[data-cy="menuToggleBtn"]').click();
    cy.get('[data-cy="Form R (B)"]').click();
    cy.get('[data-cy="Submit new form"]').scrollIntoView().click();
    cy.checkForFormLinkerAndComplete();

    cy.log("Autosave if navigate away after editing");
    cy.get('[data-cy="autosaveNote"]').should("exist");
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should("contain.text", "Autosave status: Waiting for new changes...");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
    cy.get('[data-cy="forename-input"]').clear();
    cy.checkElement("forename-inline-error-msg");
    cy.clearAndType('[data-cy="email-input"]', "test.reset@hee.nhs.uk");
    cy.log("save still works with errors");
    cy.get('[data-cy="autosaveStatusMsg"]').should(
      "include.text",
      "Autosave status: Success"
    );
    cy.get('[data-cy="Support"]').scrollIntoView().click();
    cy.get(".nhsuk-header__navigation-close > .nhsuk-icon").click();
    cy.get(".nhsuk-fieldset__heading").contains("Support");
    cy.get('[data-cy="menuToggleBtn"]').click();
    cy.get('[data-cy="Form R (B)"]').should("exist").click();
    cy.checkElement("btn-Edit saved draft form").click();
    cy.log(
      "No error message should be displayed until new changes or navigation"
    );
    cy.checkElement("forename-inline-error-msg", null, false);
    cy.get('[data-cy="email-input"]').should(
      "have.value",
      "test.reset@hee.nhs.uk"
    );
    cy.navNext();
    cy.checkElement("forename-inline-error-msg");
    cy.checkElement("error-txt-Forename is required");

    cy.log("Delete draft form");
    cy.startOver();
    cy.checkElement("Submit new form");
  });
});

describe("Form R (Part B) - Submit a new form", () => {
  it("complete part of a new Form R Part B.", () => {
    cy.signInToTss(30000, "/formr-b");
    cy.checkElement("Submit new form").click();
    cy.checkForFormLinkerAndComplete();
    cy.checkElement("homeLink");
    cy.navNext();
    cy.checkElement("progress-header", "Part 1 of 10 - Personal Details");
    cy.checkAndFillSection1();
    cy.checkElement("startOverButton", "Start over");
    cy.navNext();
    cy.checkAndFillSection2();
    cy.navNext();
    cy.checkAndFillSection3();
    cy.navNext();
    cy.checkAndFillSection4();
    cy.navNext();
    cy.checkAndFillSection5();
    cy.checkElement("BtnSaveDraft").click();
    cy.checkElement("btn-Edit saved draft form");
  });

  it("complete the rest of the Form R Part B.", () => {
    cy.signInToTss(10000, "/formr-b");
    cy.checkElement("btn-Edit saved draft form").click();
    cy.checkElement("BtnShortcutToConfirm", null, false);
    for (let i = 0; i < 5; i++) {
      cy.navNext();
    }
    cy.checkAndFillSection6();
    cy.navNext();
    cy.checkAndFillSection7();
    cy.navNext();
    cy.checkAndFillSection8();
    cy.navNext();
    cy.checkAndFillSection9();
    cy.navNext();
    cy.checkAndFillSection10();
    cy.navNext();

    cy.log(
      "################ check Confirm page, edit, and submit ###################"
    );
    cy.checkElement(
      "formrbLabel",
      "Trainee registration for Postgraduate Speciality Training"
    );
    cy.checkElement("warningConfirmation");
    cy.checkElement("forename-value", `Bob-${today.format("YYYY-MM-DD")}`);
    cy.checkElement("edit-Personal Details").click();
    cy.get('[data-cy="progress-header"] > h3').should(
      "include.text",
      "Personal Details"
    );
    cy.get('[data-cy="forename-input"]').clear();
    cy.get('[data-cy="BtnShortcutToConfirm"]').should("be.disabled");
    cy.get(".error-summary").should("exist");
    cy.clearAndType('[data-cy="forename-input"]', "Bob-edited");
    cy.get(".error-summary").should("not.exist");
    cy.checkElement("BtnShortcutToConfirm").click();
    cy.checkElement("warningConfirmation");
    cy.checkElement("forename-value", "Bob-edited");
    cy.checkElement("prevRevalBodyOther-value", "Not provided");

    cy.get('[data-cy="isDeclarationAccepted"]').click();
    cy.get('[data-cy="isConsentAccepted"]').click();
    cy.checkElement("BtnSubmit", "Submit Form").click();
    // final submit via linker modal
    cy.get('[data-cy="form-linker-submit-btn"]').click();
    cy.checkElement("Submit new form");
  });

  it("Should show the submitted form in the list", () => {
    cy.signInToTss(30000, "/formr-b");
    cy.get('[data-cy="formsListWarning"] > :nth-child(2)').should("exist");
    cy.contains("Submitted forms").should("exist");
    cy.checkElement("submittedForm").first().click();
    cy.get('[data-cy="submissionDateTop"]').should(
      "include.text",
      `Form submitted on: ${today.format("DD/MM/YYYY")}`
    );
    cy.checkElement("savePdfBtn");
    cy.get(".nhsuk-action-link__text").click();
    cy.checkElement("forename-value", "Bob-edited");
    cy.checkElement("surname-value", `Smith-${today.format("YYYY-MM-DD")}`);
    cy.get('[data-cy="isDeclarationAccepted"]').should("be.checked");
    cy.get('[data-cy="isConsentAccepted"]').should("be.checked");
    cy.get('[data-cy="backLink"]').click();
    cy.contains("Submitted forms").should("exist");
  });
});
