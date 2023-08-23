/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

let isCovid = false;
const currentDate = dayjs().format("YYYY-MM-DD");
const futureDate = dayjs()
  .add(dayjs.duration({ months: 6 }))
  .format("YYYY-MM-DD");
const pastDate = dayjs()
  .subtract(dayjs.duration({ months: 6 }))
  .format("YYYY-MM-DD");
const outOfRangeFutureDate = dayjs(futureDate)
  .add(dayjs.duration({ years: 20 }))
  .format("YYYY-MM-DD");
const farFutureDate = dayjs()
  .add(dayjs.duration({ years: 5 }))
  .format("YYYY-MM-DD");
const currRevalDate = dayjs().add(3, "month").format("YYYY-MM-DD");
const prevRevalDate = dayjs().subtract(5, "years").format("YYYY-MM-DD");

describe("Form R (Part B) - Start over via forms list (CreateList) page", () => {
  before(() => {
    cy.signInToTss(30000, undefined, "iphone-6");
  });
  it("Should successfully delete a draft form via 'start over' button on forms list page and then display the 'submit new form' button.", () => {
    isCovid = false;
    cy.get("[data-cy=BtnMenu]").should("exist").click();
    cy.contains("Form R (Part B)").click();
    cy.visit("/formr-b", { failOnStatusCode: false });
    cy.get("#btnOpenForm")
      .should("exist")
      .focus()
      .then((loadFormAButton: JQuery) => {
        // ---------- if New form btn ------------------------------------------------------------------
        if (loadFormAButton.attr("data-cy") === "Submit new form") {
          cy.get('[data-cy="Submit new form"]').click();
          cy.get("body").then($body => {
            if ($body.find(".MuiDialog-container").length) {
              cy.get(".MuiDialogContentText-root").should(
                "include.text",
                "You recently submitted a form"
              );
              cy.get(".MuiDialogActions-root > :nth-child(2)").click();
            }
          });
        } else {
          cy.get("#btnOpenForm").click();
        }
        cy.get(".nhsuk-warning-callout > p").should("exist");
        cy.get("#gmcNumber").type("55555555");
        cy.get("[data-cy=BtnSaveDraft]").click();
        cy.get('[data-cy="startOverButton"]').should("exist").click();
        cy.get(".MuiDialogContentText-root").should(
          "include.text",
          "This action will delete all the changes you have made to this form. Are you sure you want to continue?"
        );
        cy.get(".MuiDialogActions-root > :nth-child(2)").click();
        cy.get('[data-cy="Submit new form"]').should("exist");
      });
  });
});

describe("Form R (Part B)", () => {
  before(() => {
    cy.signInToTss(30000, undefined, "iphone-6");
  });
  it("Should complete a new Form R Part B.", () => {
    isCovid = true;
    cy.get("[data-cy=BtnMenu]").should("exist").click();
    cy.contains("Form R (Part B)").click();
    cy.visit("/formr-b", { failOnStatusCode: false });
    cy.get('[data-cy="Submit new form"]').click();
    cy.get("body").then($body => {
      if ($body.find(".MuiDialog-container").length) {
        cy.get(".MuiDialogContentText-root").should(
          "include.text",
          "You recently submitted a form"
        );
        cy.get(".MuiDialogActions-root > :nth-child(2)").click();
      }
    });
    cy.get(".nhsuk-warning-callout > p").should("exist");

    // Should not autosave if no changes made
    cy.log("### check form does not autosave if no changes made ###");
    cy.get("[data-cy=BtnMenu]").click();
    cy.contains("Support").click();
    cy.get("[data-cy=BtnMenu]").click();
    cy.contains("Form R (Part B)").click();
    cy.get('[data-cy="Submit new form"]').should("exist").click();
    cy.get("body").then($body => {
      if ($body.find(".MuiDialog-container").length) {
        cy.get(".MuiDialogContentText-root").should(
          "include.text",
          "You recently submitted a form"
        );
        cy.get(".MuiDialogActions-root > :nth-child(2)").click();
      }
    });

    // ---- check if form autosaves if navigate away after edit ------------
    cy.log("### check form autosaves when nav away after edit ###");
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
    cy.get("[data-cy=BtnMenu]").click();
    cy.contains("Support").click();
    cy.get("[data-cy=BtnMenu]").click();
    cy.contains("Form R (Part B)").click();
    cy.get('[data-cy="startOverButton"]').should("exist");
    cy.get('[data-cy="btn-Edit saved draft form"]').should("exist").click();

    cy.get("[data-cy=email]").should("have.value", "test.reset@hee.nhs.uk");
    cy.get('[data-cy="startOverButton"]').should("exist");
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should("contain.text", "Autosave status: Waiting for new changes...");

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
    // check if Covid section exists or not depending on flag
    if (isCovid) {
      cy.get("[data-cy=sectionHeader7]").should("exist");
      cy.get("[data-cy=BtnEditSection7]").should("exist");
      cy.get("[data-cy=educationSupervisorName]").should(
        "contain.text",
        "No supervisor name provided"
      );
      cy.get("[data-cy=educationSupervisorEmail]").should(
        "contain.text",
        "No supervisor email provided"
      );
    } else {
      cy.get("[data-cy=sectionHeader7]").should("not.exist");
      cy.get("[data-cy=BtnEditSection7]").should("not.exist");
    }

    //check the health statment populates correctly when empty
    for (let x = 0; x < 5; x++) {
      cy.get(
        "[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page"
      ).click();
    }
    cy.get(".nhsuk-form-group > [data-cy=healthStatement]").clear();
    for (let x = 0; x < 5; x++) {
      cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__title").click();
    }
    cy.get("[data-cy=healthStatement]").should(
      "contain.text",
      "No health statement recorded"
    );

    //check sections 4 and 5 display correctly
    cy.get("[data-cy=previousDeclarationSummary]")
      .should("exist")
      .should("contain.text", "test text");
    cy.get("[data-cy=currentDeclarationSummary]")
      .should("exist")
      .should("contain.text", "test text");

    //go back to section 4 and click no previous unresolved declarations
    //check option dissapears from view
    for (let x = 0; x < 4; x++) {
      cy.get(
        "[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page"
      ).click();
    }
    cy.get("[data-cy=havePreviousUnresolvedDeclarations1]").click();
    for (let x = 0; x < 4; x++) {
      cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__title").click();
    }
    cy.get(
      ":nth-child(12) > :nth-child(3) > .nhsuk-summary-list__row > .nhsuk-summary-list__value"
    ).should("not.exist");

    //go back to section 5 and click no previous unresolved declarations
    //check option dissapears from view
    for (let x = 0; x < 3; x++) {
      cy.get(
        "[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page"
      ).click();
    }
    cy.get("[data-cy=haveCurrentUnresolvedDeclarations1]").click();
    for (let x = 0; x < 3; x++) {
      cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__title").click();
    }
    cy.get(
      ":nth-child(15) > :nth-child(3) > .nhsuk-summary-list__row > .nhsuk-summary-list__key"
    ).should("not.exist");

    // Attempt to submit without checking boxes should fail
    cy.get("[data-cy=BtnSubmitForm]").click();
    cy.get("#isDeclarationAccepted--error-message").should("exist");
    cy.get("#isConsentAccepted--error-message").should("exist");

    // check declarations before editing a section
    cy.get("[data-cy=isDeclarationAccepted0]").click().should("be.checked");
    cy.get("[data-cy=isConsentAccepted0]").click().should("be.checked");

    // edit form section
    cy.get("[data-cy=BtnEditSection1]").should("exist");
    cy.get("[data-cy=gmcNumber]").should("exist");
    cy.get("[data-cy=sectionHeader5]").should(
      "include.text",
      "Section 5: New declarations"
    );
    cy.get("[data-cy=BtnEditSection5]").should("exist").click();
    cy.get(".progress-step").eq(4).should("have.class", "progress-step-active");
    cy.get('[data-cy="currentDeclarations[0].declarationType"] > option')
      .eq(0)
      .then(element => {
        const selectedItem = element?.val()?.toString()!;
        cy.get('[data-cy="currentDeclarations[0].declarationType"]')
          .select(selectedItem)
          .should("have.value", "");
      });

    // back to Confirm/ submit page fails if section error
    cy.get("[data-cy=BtnBackToSubmit]").click();
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get('[data-cy="currentDeclarations[0].declarationType"]')
      .should("exist")
      .select("Significant event");
    cy.get(".nhsuk-error-summary").should("not.exist");

    // return to Confirm / submit page to check edited summary
    cy.get("[data-cy=BtnBackToSubmit]").click();
    cy.get("[data-cy=declarationType1]").should(
      "contain.text",
      "Significant event"
    );
    // check boxes should be unchecked on return
    cy.get("[data-cy=isDeclarationAccepted0]").should("not.be.checked");
    cy.get("[data-cy=isConsentAccepted0]").should("not.be.checked");

    // 'Back to submit' btn is removed if normal (long way) navigation back to Confirmation / submit page is chosen

    cy.get("[data-cy=BtnEditSection5]").click();
    cy.get("[data-cy=BtnBackToSubmit]").should("exist");
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page").click();
    cy.get("[data-cy=BtnBackToSubmit]").should("not.exist");

    for (let x = 0; x < 4; x++) {
      cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__title").click();
      cy.get("[data-cy=BtnBackToSubmit]").should("not.exist");
    }
    cy.get(".nhsuk-warning-callout__label").should(
      "include.text",
      "Confirmation"
    );

    // -------------- Save draft ------------------------------------------------
    cy.get("[data-cy=BtnSaveDraft]").click();

    // -------------- Retrieve saved draft form ----------------------------------
    cy.get('[data-cy="btn-Edit saved draft form"]')
      .should("exist")
      .focus()
      .click();
    cy.get(".nhsuk-warning-callout").should("exist");
    cy.get("[data-cy=gmcNumber]").should("exist");

    for (let x = 0; x < 7; x++) {
      cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__title").click();
      cy.get("[data-cy=BtnBackToSubmit]").should("not.exist");
    }

    // complete declaration again
    cy.get("[data-cy=isDeclarationAccepted0]").click();
    cy.get("[data-cy=isConsentAccepted0]").click();

    // check work saved in correct order
    cy.get("[data-cy=endDate1]").should(
      "contain.text",
      dayjs(farFutureDate).format("DD/MM/YYYY")
    );
    // ------------- submit form -----------------------------------------

    cy.get("[data-cy=BtnSubmitForm]").should("exist").click();
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
    cy.get("[data-cy=gmcNumber]")
      .should("exist")
      .should("have.text", "11111111");
    cy.get("[data-cy=localOfficeName]").should(
      "have.text",
      "Health Education England Wessex"
    );
    cy.get("[data-cy=totalLeave]").should("include.text", "21");
    // Navigate back to the list
    cy.get(".nhsuk-back-link__link").should("exist").click();
    cy.contains("Submitted forms").should("exist");
  });
});
