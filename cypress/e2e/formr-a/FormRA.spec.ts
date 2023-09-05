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

// Note: See FormA.cy.tsx Component for more thorough tests of the form fields and validation
describe("Form R Part A - Basic Form completion and submission", () => {
  before(() => {
    // Note: The 30s wait is to allow the MFA TOTP token to refresh (from a previous test)
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
        cy.get(".nhsuk-warning-callout > p").should("exist");
        cy.get('[data-cy="progress-header"] > h3').should(
          "contain.text",
          "Part 1 of 3 - Personal Details"
        );

        // -- personal details section --
        // immigration status
        const immigrationTxt = "Refugee in the UK";
        // test autosave functionality and start over button visibility
        cy.log(
          "################ Autosave functionality and start over visibility ###################"
        );
        cy.get('[data-cy="autosaveStatusMsg"]')
          .should("exist")
          .should(
            "contain.text",
            "Autosave status: Waiting for new changes..."
          );
        cy.get('[data-cy="startOverButton"]').should("not.exist");
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
        cy.get('[data-cy="autosaveStatusMsg"]')
          .should("exist")
          .should("include.text", "Autosave status: Success");
        cy.log("################ Start over functionality ###################");
        cy.get('[data-cy="startOverButton"]').should("exist").click();
        cy.get(".MuiDialogContentText-root").should(
          "include.text",
          "This action will delete all the changes you have made to this form. Are you sure you want to continue?"
        );
        cy.get(".MuiDialogActions-root > :nth-child(2)").click();
        cy.get("#btnOpenForm")
          .should("exist")
          .focus()
          .then((loadFormAButton: JQuery) => {
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
          });
        //-- personal details section --
        // test error msg when no email
        cy.log("################ Error msg when no email ###################");
        cy.get('[data-cy="navNext"]').click();
        cy.get(".nhsuk-error-summary").should("exist");
        cy.get('[data-cy="error-txt-email,Email address is required"]').should(
          "exist"
        );
        cy.get('[data-cy="email-input"]')
          .focus()
          .clear()
          .type("traineeui.tester@hee.nhs.uk");
        cy.get(
          '[data-cy="immigrationStatus"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
        )
          .click()
          .type("ref")
          .get(".react-select__menu")
          .find(".react-select__option")
          .first()
          .click();
        cy.get(".nhsuk-error-summary").should("not.exist");
        cy.get('[data-cy="navNext"]').click();

        //-- Declarations section --
        // test navigation to the previous section
        cy.get('[data-cy="navPrevious"]').should("exist").click();
        cy.get('[data-cy="progress-header"] > h3').should(
          "contain.text",
          "Part 1 of 3 - Personal Details"
        );
        cy.get('[data-cy="email-input"]').should(
          "have.value",
          "traineeui.tester@hee.nhs.uk"
        );
        cy.get('[data-cy="navNext"]').click();
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
        cy.get('[data-cy="navNext"]').click();

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
        cy.get(
          '[data-cy="programmeMembershipType"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
        )
          .click()
          .get(".react-select__menu")
          .find(".react-select__option")
          .first()
          .click();
        cy.get('[data-cy="wholeTimeEquivalent-input"]').clear().type("1");

        cy.get('[data-cy="navNext"]')
          .should("have.text", "Next:Review & submit")
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
        cy.get('[data-cy="backLink"]').should("exist").click();
        cy.contains("Submitted forms").should("exist");
      });
  });
});

describe("Form R Part A - JSON form fields visibility status checks", () => {
  before(() => {
    cy.signInToTss(30000);
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

    cy.get('[data-cy="navNext"]').click();

    cy.log(
      "################ Check that the changed dependent field visibility prop is persisted when a draft form is saved and re-opened so that the validation still fires correctly ###################"
    );
    cy.get(
      '[data-cy="declarationType-I have been appointed to a programme leading to award of CCT-input"]'
    ).click();
    cy.get('[data-cy="BtnSaveDraft"]').click();
    cy.get('[data-cy="btn-Edit saved draft form"]').should("exist").click();
    cy.get('[data-cy="startOverButton"]').should("exist");
    cy.get('[data-cy="navNext"]').click();
    cy.get(
      '[data-cy="declarationType-I have been appointed to a programme leading to award of CCT-input"]'
    ).should("be.checked");
    cy.get(
      '[data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    ).should("exist");
    cy.get('[data-cy="navNext"]').click();
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
    cy.get('[data-cy="navNext"]').click();
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
    cy.get(
      '[data-cy="programmeMembershipType"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get('[data-cy="wholeTimeEquivalent-input"]').clear().type("1");

    cy.get('[data-cy="navNext"]')
      .should("have.text", "Next:Review & submit")
      .click();
    // Cancel submit and start over
    cy.log(
      "################ Cancel submit and start over/delete draft ###################"
    );
    cy.get("[data-cy=BtnSubmit]").scrollIntoView().should("exist").click();
    cy.get(".MuiDialog-container")
      .should("exist")
      .should("include.text", "Please think carefully before submitting");
    cy.get(".MuiDialogActions-root > :nth-child(1)").click();
    cy.get('[data-cy="startOverButton"]').should("exist").click();
    cy.get(".MuiDialogContentText-root").should(
      "include.text",
      "This action will delete all the changes you have made to this form. Are you sure you want to continue?"
    );
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get('[data-cy="Submit new form"]').should("exist");
  });
});

describe("Form R Part A - 'save form' toast messages", () => {
  beforeEach(() => {
    cy.signInToTss(30000);
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

describe("Form R Part A - 'delete form' toast messages", () => {
  beforeEach(() => {
    cy.signInToTss(30000);
  });
  it("should display a error toast message when the form is deleted unsuccessfully.", () => {
    cy.intercept("DELETE", /\/api\/forms\/formr-parta/, {
      statusCode: 500,
      body: { error: "Some server error" }
    }).as("deleteFormRequestErrored");
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
    cy.get('[data-cy="email-input"]').focus().clear().type("t");
    cy.get('[data-cy="startOverButton"]').should("exist").click();
    cy.get(".MuiDialogContentText-root").should(
      "include.text",
      "This action will delete all the changes you have made to this form. Are you sure you want to continue?"
    );
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get('[data-cy="toastText"]').should(
      "include.text",
      "Couldn't delete your draft Form R (Part A)."
    );
  });
  it("should display a sucess toast message when the form is deleted successfully.", () => {
    cy.contains("Form R (Part A)").click();
    cy.visit("/formr-a", { failOnStatusCode: false });
    cy.get('[data-cy="btn-Edit saved draft form"]').should("exist").click();
    cy.get('[data-cy="email-input"]').focus().clear().type("t");
    cy.get('[data-cy="startOverButton"]').should("exist").click();
    cy.get(".MuiDialogContentText-root").should(
      "include.text",
      "This action will delete all the changes you have made to this form. Are you sure you want to continue?"
    );
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get('[data-cy="toastText"]').should(
      "include.text",
      "Your draft Form R (Part A) has been deleted."
    );
    cy.get('[data-cy="Submit new form"]').should("exist");
  });
});
