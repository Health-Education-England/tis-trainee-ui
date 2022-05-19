/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

let isCovid = false;

const currentDate = Cypress.dayjs().format("YYYY-MM-DD");
const futureDate = Cypress.dayjs()
  .add(Cypress.dayjs.duration({ months: 6 }))
  .format("YYYY-MM-DD");
const pastDate = Cypress.dayjs()
  .subtract(Cypress.dayjs.duration({ months: 6 }))
  .format("YYYY-MM-DD");
const outOfRangeFutureDate = Cypress.dayjs(futureDate)
  .add(Cypress.dayjs.duration({ years: 20 }))
  .format("YYYY-MM-DD");
const farFutureDate = Cypress.dayjs()
  .add(Cypress.dayjs.duration({ years: 5 }))
  .format("YYYY-MM-DD");

const currRevalDate = Cypress.dayjs().add(3, "month").format("YYYY-MM-DD");

const prevRevalDate = Cypress.dayjs().subtract(5, "years").format("YYYY-MM-DD");

describe("Form R (Part B)", () => {
  before(() => {
    cy.visit("./");
    cy.viewport("iphone-6");
    cy.signIn();
  });
  it("Should complete a new Form R Part B.", () => {
    isCovid = true;
    cy.get("[data-cy=BtnMenu]").should("exist").click();
    cy.contains("Form R (Part B)").click();
    cy.visit("/formr-b/321");
    cy.checkForErrorNotif("Error");

    cy.get("#btnOpenForm").click();
    cy.get(".nhsuk-warning-callout > p").should("exist");

    // ---- check if form state resets if navigate away from create page ------------
    cy.get("#email").type("test.reset@hee.nhs.uk");
    cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
    cy.get("[data-cy=BtnMenu]").click();
    cy.get(":nth-child(2) > .nhsuk-header__navigation-link").click();
    cy.get("[data-cy=BtnMenu]").click();
    cy.get(":nth-child(3) > .nhsuk-header__navigation-link").click();
    cy.get("#btnOpenForm").click();
    cy.get("[data-cy=email]").should("have.value", "");

    //   // -------- Section 1 - Doctor's details -----------
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
      Cypress.dayjs(farFutureDate).format("DD/MM/YYYY")
    );
    // check if Covid section exists or not depending on flag
    if (isCovid) {
      cy.get("[data-cy=sectionHeader7]").should("exist");
      cy.get("[data-cy=BtnEditSection7]").should("exist");
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
    cy.get(
      ":nth-child(9) > .nhsuk-summary-list > :nth-child(5) > .nhsuk-summary-list__value"
    ).should("contain.text", "None recorded");

    //check sections 4 and 5 display correctly
    cy.get(
      ":nth-child(12) > :nth-child(3) > .nhsuk-summary-list__row > .nhsuk-summary-list__value"
    ).should("exist");
    cy.get(
      ":nth-child(12) > :nth-child(3) > .nhsuk-summary-list__row > .nhsuk-summary-list__value"
    ).should("contain.text", "test text");

    cy.get(
      ":nth-child(15) > :nth-child(3) > .nhsuk-summary-list__row > .nhsuk-summary-list__key"
    ).should("exist");
    cy.get(
      ":nth-child(15) > :nth-child(3) > .nhsuk-summary-list__row > .nhsuk-summary-list__value"
    ).should("contain.text", "test text");

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
        const selectedItem = element.val().toString();
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
    cy.get("[data-cy=currentDeclarationType1]").should(
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
    cy.get("[data-cy=btnEditSavedForm]").should("exist").click();
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
      Cypress.dayjs(farFutureDate).format("DD/MM/YYYY")
    );
    // ------------- submit form -----------------------------------------

    // intercept formr-partb POST req
    let uid: string;

    cy.intercept("POST", "/api/forms/formr-partb", res => {
      uid = res.body["id"];
    });

    // intercept formr-partBs GET req
    cy.intercept("GET", "/api/forms/formr-partbs").as("getFormrPartBs");

    cy.get("[data-cy=BtnSubmitForm]").should("exist").click();
    cy.checkForSuccessNotif("Success");
    cy.get("[data-cy=btnLoadNewForm]").should("exist");
    cy.contains("Submitted forms").should("exist");
    cy.get("[data-cy=formsTrueHint]").should("exist");

    // ------------- Check newly-submitted form exists -------------------
    // compare uid to row id
    cy.wait("@getFormrPartBs").then(interception => {
      const body = interception.response.body;
      const formrbsArray: string[] = Object.values(body);
      formrbsArray.forEach((row, index) => {
        if (row["id"] === uid) {
          // Open the form just saved
          cy.get("[data-cy=submittedForm]").eq(index).click();
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
        }
      });
    });
  });
});
