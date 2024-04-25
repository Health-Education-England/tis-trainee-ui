/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import dayjs from "dayjs";

let isCovid = false;
const currentDate = dayjs().format("YYYY-MM-DD");
const futureDate = dayjs().add(6, "month").format("YYYY-MM-DD");
const pastDate = dayjs().subtract(6, "month").format("YYYY-MM-DD");
const outOfRangeFutureDate = dayjs(futureDate)
  .add(20, "year")
  .format("YYYY-MM-DD");
const farFutureDate = dayjs().add(5, "year").format("YYYY-MM-DD");
const currRevalDate = dayjs().add(3, "month").format("YYYY-MM-DD");
const prevRevalDate = dayjs().subtract(5, "year").format("YYYY-MM-DD");

// NOTE: This is a temp test file - to be refactored once form is built via FormBuilder

describe("Form R (Part B) - mobile", () => {
  before(() => {
    cy.signInToTss(30000, undefined, "iphone-6");
  });
  it("Should successfully delete a draft form via 'start over' button on forms list page and then display the 'submit new form' button.", () => {
    isCovid = false;
    cy.get('[data-cy="menuToggleBtn"]').should("exist").click({ force: true });
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
        cy.get(".nhsuk-warning-callout > p").should("exist");
        cy.get("#gmcNumber").type("55555555");
        cy.get("[data-cy=BtnSaveDraft]").click();
        cy.wait(5000);
        cy.startOver();
        cy.get('[data-cy="Submit new form"]').should("exist");
      });
  });
});

describe("Form R (Part B) - desktop", () => {
  beforeEach(() => {
    cy.signInToTss(30000, "/formr-b", "macbook-15");
    cy.get('[data-cy="Submit new form"]').click();
    cy.checkForRecentForm();
  });
  it("Should not autosave if no changes made", () => {
    cy.get(".nhsuk-warning-callout > p").should("exist");
    cy.get('[data-cy="homeLink"]').should("exist").click();
    cy.get('[data-cy="Form R (B)"]').should("exist").click();
    cy.get('[data-cy="Submit new form"]').should("exist");
  });

  it("should autosave if navigate away after editing", () => {
    cy.get('[data-cy="autosaveNote"]').should("exist");
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should("contain.text", "Autosave status: Waiting for new changes...");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
    cy.get("#email").type("test.reset@hee.nhs.uk");
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

  it("should complete a new form", () => {
    isCovid = false;

    // -------- Section 1 - Doctor's details -----------
    cy.get(".progress-step")
      .first()
      .should("have.class", "progress-step-active");

    cy.checkAndFillSection1(currRevalDate, prevRevalDate);

    cy.get("#gmcNumber").focus().clear();
    cy.get("#email").focus().clear();

    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page")
      .should("exist")
      .click();

    cy.get(".nhsuk-error-summary").should("exist");
    cy.get("#gmcNumber").type("11111111");
    cy.get("#email").type("traineeui.tester@hee.nhs.uk");
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();

    // -------- Section 2 Whole Scope Types of Work -----------
    cy.get(".progress-step").eq(1).should("have.class", "progress-step-active");
    cy.checkAndFillSection2(pastDate, currentDate);

    cy.get('[data-cy="work[0].startDate"]')
      .should("exist")
      .clear()
      .type(outOfRangeFutureDate);

    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page")
      .should("exist")
      .click();
    cy.get(".nhsuk-error-summary").should("exist");

    cy.get('[data-cy="work[0].startDate"]').clear().type(pastDate);
    cy.get(".nhsuk-error-summary").should("not.exist");

    cy.addWorkPanel(farFutureDate, farFutureDate);

    // Navigate back to section 1
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page").click();

    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get("[data-cy=mainWarning1]").should("exist");

    // Return to section 2
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get('[data-cy="work[0].endDate"]').should("have.value", farFutureDate);
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();

    // -------- Section 3 Declarations relating to Good Medical Practice -----------
    cy.get(".progress-step").eq(2).should("have.class", "progress-step-active");
    cy.checkAndFillSection3();

    // Navigate back to section 2
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page").click();
    cy.get("[data-cy=mainWarning2]").should("exist");
    cy.get("#totalLeave").should("exist").should("contain.value", "21");

    // Return to section 3
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();

    // -------- Section 4: Update to your previous Form R Part B -----------
    cy.get(".progress-step").eq(3).should("have.class", "progress-step-active");
    cy.checkAndFillSection4(pastDate);

    // Navigate back to section 3
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page").click();
    cy.get("[data-cy=mainWarning3]").should("exist");
    cy.get(".nhsuk-form-group > [data-cy=healthStatement]")
      .should("exist")
      .type("I'm in astonishingly excellent health.");

    // Return to section 4
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();

    // -------- Section 5: Update to your previous Form R Part B -----------
    cy.get(".progress-step").eq(4).should("have.class", "progress-step-active");
    cy.checkAndFillSection5(pastDate);

    // Navigate back to section 4
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page").click();
    cy.get("[data-cy=mainWarning4]").should("exist");

    // Return to section 5
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();

    // -------- Section 6: Compliments --------------------------------------
    cy.get(".progress-step").eq(5).should("have.class", "progress-step-active");
    cy.checkAndFillSection6("This is the compliment text.");

    // Navigate back to section 5
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page").click();
    cy.get("[data-cy=mainWarning5]").should("exist");

    // Return to section 6
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
    cy.get("[data-cy=compliments]")
      .should("exist")
      .should("contain.value", "This is the compliment text.");

    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();

    // -------- COVID Section ------------------------------------------------
    if (isCovid) {
      cy.log("### COVID SECTION CHECK ###");
      cy.get(".progress-step")
        .eq(6)
        .should("have.class", "progress-step-active");
      cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
      cy.get("#haveCovidDeclarations--error-message").should("exist");
      cy.get(".progress-step")
        .eq(6)
        .should("have.class", "progress-step-active");
      cy.checkAndFillCovidSection();
      cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
    }

    // -------- Confirm / Review Section --------------------------------------
    cy.get(".nhsuk-warning-callout__label")
      .should("exist")
      .should("include.text", "Confirmation");
    cy.get("[data-cy=endDate1]").should(
      "contain.text",
      dayjs(farFutureDate).format("DD/MM/YYYY")
    );
    // Attempt to submit without checking boxes should fail
    cy.get("[data-cy=BtnSubmitForm]").click();
    cy.get("#isDeclarationAccepted--error-message").should("exist");
    cy.get("#isConsentAccepted--error-message").should("exist");

    // check declarations before editing a section
    cy.get("[data-cy=isDeclarationAccepted0]").click().should("be.checked");
    cy.get("[data-cy=isConsentAccepted0]").click().should("be.checked");

    // submit form
    cy.get("[data-cy=BtnSubmitForm]").click();
    cy.get(".MuiDialog-container")
      .should("exist")
      .should("include.text", "Please think carefully before submitting");
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get('[data-cy="Submit new form"]').should("exist");
    cy.contains("Submitted forms").should("exist");
    cy.get("[data-cy=formsTrueHint]").should("exist");
    cy.log(
      "################ check submitted form is in forms list ###################"
    );
  });
});
