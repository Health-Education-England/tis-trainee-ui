/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const dateAttained = dayjs()
  .subtract(dayjs.duration({ years: 1, months: 6, days: 12 }))
  .format("YYYY-MM-DD");
const completionDate = dayjs()
  .add(dayjs.duration({ months: 6 }))
  .format("YYYY-MM-DD");
const startDate = dayjs()
  .subtract(dayjs.duration({ months: 9, days: 30 }))
  .format("YYYY-MM-DD");

describe("Name of the group", () => {
  before(() => {
    cy.wait(30000);
    cy.visit("/");
    cy.signIn();
  });
  it("Should complete a new Form R Part A.", () => {
    cy.contains("Form R (Part A)").click();
    cy.visit("/formr-a", { failOnStatusCode: false });
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

        // most of the Form A functionality is tested in FormA.cy.tsx Component
        // This file is to test localStorage, saving and submitting the form

        cy.get(".nhsuk-warning-callout > p").should("exist");
        cy.get('[data-cy="progress-header"] > h3').should(
          "contain.text",
          "Part 1 of 3 - Personal Details"
        );

        // -- personal details section --
        // immigration status
        const immigrationTxt = "Dependent - other immigration category";
        cy.get(
          '[data-cy="immigrationStatus"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
        )
          .click()
          .type("ot")
          .get(".react-select__menu")
          .find(".react-select__option")
          .first()
          .click();
        cy.get('[data-cy="immigrationStatus"] ').contains(immigrationTxt);
        cy.get('[data-cy="otherImmigrationStatus-label"]').should("exist");

        // Test the local storage is updated
        // put a wait here to give time for the local storage to update
        cy.wait(5000)
          .getLocalStorage("formA")
          .then(formA => {
            console.log("formA", formA && JSON.parse(formA));
            const parsedForm = formA && JSON.parse(formA);
            const immigrationStatus = parsedForm.immigrationStatus;
            console.log("immigrationStatus", immigrationStatus);
            expect(immigrationStatus).to.equal(immigrationTxt);
          });

        // NOTE - Revert this once BE trainee forms DTO has lastModiFiedDate
        // Check the local storage form data is persisted if user navigates away from the page
        // cy.log(
        //   "################ Check the local storage form data is persisted if user navigates away from the page ###################"
        // );
        // cy.get('[data-cy="Form R (Part A)"]').click();
        // cy.get('[data-cy="btn-Edit unsaved draft form"]')
        //   .should("exist")
        //   .click();
        // cy.get('[data-cy="immigrationStatus"] ').contains(immigrationTxt);

        //-- personal details section --
        // test error msg when no email
        cy.log("################ Error msg when no email ###################");
        cy.get('[data-cy="BtnContinue"]').click();
        cy.get(".nhsuk-error-summary").should("exist");
        cy.get('[data-cy="error-txt-email,Email address is required"]').should(
          "exist"
        );
        cy.get('[data-cy="email-input"]')
          .focus()
          .clear()
          .type("traineeui.tester@hee.nhs.uk");
        cy.get(".nhsuk-error-summary").should("not.exist");
        cy.get('[data-cy="BtnContinue"]').click();

        //-- Declarations section --
        // test navigation to the previous section
        cy.get('[data-cy="btnBack-0"]').should("exist").click();
        cy.get('[data-cy="progress-header"] > h3').should(
          "contain.text",
          "Part 1 of 3 - Personal Details"
        );
        cy.get('[data-cy="email-input"]').should(
          "have.value",
          "traineeui.tester@hee.nhs.uk"
        );
        cy.get('[data-cy="BtnContinue"]').click();
        cy.get('[data-cy="progress-header"] > h3').should(
          "contain.text",
          "Part 2 of 3 - Programme Declarations"
        );
        cy.get(
          '[data-cy="declarationType-I will be seeking specialist registration by application for a CESR-input"]'
        ).click();
        cy.get(
          '[data-cy="programmeSpecialty"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
        )
          .click()
          .get(".react-select__menu")
          .find(".react-select__option")
          .first()
          .click();
        cy.get(
          '[data-cy="college"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
        )
          .click()
          .get(".react-select__menu")
          .find(".react-select__option")
          .first()
          .click();
        cy.get(
          '[data-cy="completionDate"] > .react-datepicker-wrapper > .react-datepicker__input-container > .nhsuk-input'
        )
          .click()
          .clear()
          .type(completionDate);
        cy.get('[data-cy="BtnContinue"]').click();

        // section 3 - Programme details
        cy.get('[data-cy="progress-header"] > h3').should(
          "contain.text",
          "Part 3 of 3 - Programme Details"
        );
        cy.get(
          '[data-cy="trainingGrade"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
        )
          .click()
          .get(".react-select__menu")
          .find(".react-select__option")
          .first()
          .click();
        cy.get('[data-cy="wholeTimeEquivalent-input"]').clear().type("1");

        cy.get('[data-cy="BtnContinue"]')
          .should("have.text", "Review & submit")
          .click();

        // Save draft
        cy.get('[data-cy="warningConfirmation"]').should("exist");
        cy.get('[data-cy="email-value"]').should(
          "have.text",
          "traineeui.tester@hee.nhs.uk"
        );
        cy.get('[data-cy="edit-Personal Details"]').should("exist");
        cy.get('[data-cy="BtnSaveDraft"]').should("exist").click();

        // open the saved draft form
        cy.get('[data-cy="btn-Edit saved draft form"]').should("exist").click();
        cy.get('[data-cy="progress-header"] > h3').should(
          "contain.text",
          "Part 1 of 3 - Personal Details"
        );
        cy.get('[data-cy="BtnContinue"]').click();
        cy.get('[data-cy="progress-header"] > h3').should(
          "contain.text",
          "Part 2 of 3 - Programme Declarations"
        );
        cy.get('[data-cy="BtnContinue"]').click();
        cy.get('[data-cy="progress-header"] > h3').should(
          "contain.text",
          "Part 3 of 3 - Programme Details"
        );
        cy.get('[data-cy="BtnContinue"]').click();

        // Submit form
        cy.get("[data-cy=BtnSubmit]").scrollIntoView().should("exist").click();
        cy.get(".MuiDialog-container")
          .should("exist")
          .should("include.text", "Please think carefully before submitting");
        cy.get(".MuiDialogActions-root > :nth-child(2)").click();
        cy.get('[data-cy="Submit new form"]').should("exist");

        // wait for the forms plus new form to reload
        cy.wait(5000);
        cy.contains("Submitted forms").should("exist");
        cy.get("[data-cy=submittedForm]").first().click();
        cy.get('[data-cy="email-value"]').should(
          "have.text",
          "traineeui.tester@hee.nhs.uk"
        );
        cy.get('[data-cy="savePdfBtn"]').should("exist");

        // Navigate back to the list
        cy.get(".nhsuk-back-link__link").should("exist").click();
        cy.contains("Submitted forms").should("exist");
        cy.get('[data-cy="Submit new form"]').should("exist");
      });
  });
});
