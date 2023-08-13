/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const completionDate = dayjs()
  .add(dayjs.duration({ months: 6 }))
  .format("YYYY-MM-DD");
const startDate = dayjs()
  .subtract(dayjs.duration({ months: 9, days: 30 }))
  .format("YYYY-MM-DD");

describe("Form R Part A - Basic Form completion and submission", () => {
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
        // This file is to test saving and submitting the form

        cy.get(".nhsuk-warning-callout > p").should("exist");
        cy.get('[data-cy="progress-header"] > h3').should(
          "contain.text",
          "Part 1 of 3 - Personal Details"
        );

        // -- personal details section --
        // immigration status
        const immigrationTxt = "Refugee in the UK";
        cy.get(
          '[data-cy="immigrationStatus"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
        )
          .click()
          .type("ref")
          .get(".react-select__menu")
          .find(".react-select__option")
          .first()
          .click();
        cy.get('[data-cy="immigrationStatus"] ').contains(immigrationTxt);

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
          '[data-cy="declarationType-I have been appointed to a programme leading to award of CCT-input"]'
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
          '   [data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
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

        cy.get(
          '[data-cy="startDate"]> .react-datepicker-wrapper > .react-datepicker__input-container > .nhsuk-input'
        )
          .click()
          .clear()
          .type(startDate);
        cy.get(".nhsuk-card__heading").click(); // to remove date picker focus
        cy.get('[data-cy="programmeMembershipType-input"]').clear().type("LAT");
        cy.get('[data-cy="wholeTimeEquivalent-input"]').clear().type("1");

        cy.get('[data-cy="BtnContinue"]')
          .should("have.text", "Review & submit")
          .click();

        cy.get('[data-cy="warningConfirmation"]').should("exist");
        cy.get('[data-cy="email-value"]').should(
          "have.text",
          "traineeui.tester@hee.nhs.uk"
        );
        cy.get('[data-cy="edit-Personal Details"]').should("exist");

        // Submit form
        cy.get("[data-cy=BtnSubmit]").scrollIntoView().should("exist").click();
        cy.get(".MuiDialog-container")
          .should("exist")
          .should("include.text", "Please think carefully before submitting");
        cy.get(".MuiDialogActions-root > :nth-child(2)").click();

        cy.contains("Submitted forms").should("exist");
        cy.get('[data-cy="Submit new form"]').should("exist");
        cy.get("[data-cy=submittedForm]").first().click();
        cy.get('[data-cy="email-value"]').should(
          "have.text",
          "traineeui.tester@hee.nhs.uk"
        );
        cy.get('[data-cy="savePdfBtn"]').should("exist");

        // Navigate back to the list
        cy.get(".nhsuk-back-link__link").should("exist").click();
        cy.contains("Submitted forms").should("exist");
      });
  });
});

describe("Form R Part A - JSON form fields visibility status checks", () => {
  before(() => {
    cy.wait(30000);
    cy.visit("/");
    cy.signIn();
  });
  it("should persist the updated dependent field visibility status to trigger any expected validation  when a draft form is re-opened.", () => {
    cy.contains("Form R (Part A)").click();
    cy.visit("/formr-a", { failOnStatusCode: false });
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
    cy.get(
      '[data-cy="immigrationStatus"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .type("ref")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get('[data-cy="email-input"]')
      .focus()
      .clear()
      .type("traineeui.tester@hee.nhs.uk");

    cy.get('[data-cy="BtnContinue"]').click();

    cy.log(
      "################ Check that the changed dependent field visibility prop is persisted when a draft form is saved and re-opened so that the validation still fires correctly ###################"
    );
    cy.get(
      '[data-cy="declarationType-I have been appointed to a programme leading to award of CCT-input"]'
    ).click();
    cy.get('[data-cy="BtnSaveDraft"]').click();
    cy.get('[data-cy="btn-Edit saved draft form"]').should("exist").click();
    cy.get('[data-cy="BtnContinue"]').click();
    cy.get(
      '[data-cy="declarationType-I have been appointed to a programme leading to award of CCT-input"]'
    ).should("be.checked");
    cy.get(
      '[data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    ).should("exist");
    cy.get('[data-cy="BtnContinue"]').click();
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get(
      '[data-cy="programmeSpecialty"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(
      '   [data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
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
    cy.get(
      '[data-cy="trainingGrade"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(
      '[data-cy="startDate"]> .react-datepicker-wrapper > .react-datepicker__input-container > .nhsuk-input'
    )
      .click()
      .clear()
      .type(startDate);
    cy.get(".nhsuk-card__heading").click(); // to remove date picker focus
    cy.get('[data-cy="programmeMembershipType-input"]').clear().type("LAT");
    cy.get('[data-cy="wholeTimeEquivalent-input"]').clear().type("1");

    cy.get('[data-cy="BtnContinue"]')
      .should("have.text", "Review & submit")
      .click();
    // Submit form
    cy.get("[data-cy=BtnSubmit]").scrollIntoView().should("exist").click();
    cy.get(".MuiDialog-container")
      .should("exist")
      .should("include.text", "Please think carefully before submitting");
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();

    cy.contains("Submitted forms").should("exist");
    cy.get('[data-cy="Submit new form"]').should("exist");
  });
});

describe("Form R Part A - toast messages", () => {
  beforeEach(() => {
    cy.wait(30000);
    cy.visit("/");
    cy.signIn();
  });
  it("should display a error toast message when the form is submitted unsuccessfully.", () => {
    cy.intercept("POST", /\/api\/forms\/formr-parta/, {
      statusCode: 500,
      body: { error: "Internal Server Error" }
    }).as("saveFormRequestErrored");
    cy.contains("Form R (Part A)").click();
    cy.visit("/formr-a", { failOnStatusCode: false });
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
    cy.get('[data-cy="BtnSaveDraft"]').click();
    cy.contains(
      "[data-cy=toastText]",
      "Couldn't save your Form R (Part A)."
    ).should("be.visible");
    cy.get('[data-cy="techSupportLink"]').should("be.visible");
  });
  it("should display a success toast message when the form is submitted successfully.", () => {
    cy.intercept("POST", /\/api\/forms\/formr-parta/, {
      statusCode: 200,
      body: { id: "1234" }
    }).as("saveFormRequestSucceeded");
    cy.contains("Form R (Part A)").click();
    cy.visit("/formr-a", { failOnStatusCode: false });
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
    cy.get('[data-cy="BtnSaveDraft"]').click();
    cy.contains(
      "[data-cy=toastText]",
      "Your Form R (Part A) has been saved."
    ).should("be.visible");
  });
});
