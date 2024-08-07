/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import dayjs from "dayjs";

const completionDate = dayjs().add(6, "month").format("YYYY-MM-DD");
const startDate = dayjs()
  .subtract(9, "month")
  .subtract(30, "day")
  .format("YYYY-MM-DD");

describe("Form R Part A - Basic Form completion and submission", () => {
  before(() => {
    cy.signInToTss(30000, "/formr-a");
  });
  it("should complete a form and submit", () => {
    cy.log(
      "################ First delete any existing draft forms ###################"
    );
    cy.get("#btnOpenForm").should("exist").click();
    cy.checkForFormLinkerAndComplete();
    cy.get('[data-cy="forename-input"]').focus().clear().type("Temp");
    cy.startOver();

    cy.log("################ Check autosave functionality ###################");
    cy.wait(5000);
    cy.get("#btnOpenForm").should("exist").click();

    cy.checkForFormLinkerAndComplete();
    cy.get('[data-cy="progress-header"] > h3').should(
      "contain.text",
      "Part 1 of 3 - Personal Details"
    );
    cy.get(
      '[data-cy="WarningCallout-formAImportantNotice-label"] > span'
    ).contains("Important");
    cy.get('[data-cy="dataSourceSummary"]').should("exist").click();
    const immigrationTxt = "Refugee in the UK";
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should("contain.text", "Autosave status: Waiting for new changes...");
    cy.get('[data-cy="startOverButton"]').should("not.exist");
    cy.clickSelect('[data-cy="immigrationStatus"]', "ref", true);
    cy.get('[data-cy="immigrationStatus"] ').contains(immigrationTxt);
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should("include.text", "Autosave status: Success");
    cy.startOver();

    cy.log("################ Complete & submit ###################");
    cy.wait(5000);
    cy.get("#btnOpenForm").should("exist").click();
    cy.checkForFormLinkerAndComplete();

    // complete form section 1-3
    cy.checkAndFillFormASection1();
    cy.navNext();
    cy.checkAndFillFormASection2();
    cy.navNext();
    cy.checkAndFillFormASection3();
    cy.navNext();

    // make edit and return to confirm/submit
    cy.get('[data-cy="surname-value"]').should("have.text", "John Terry");
    cy.get('[data-cy="edit-Personal Details"]').click();
    cy.clearAndType('[data-cy="surname-input"]', "Terry");
    cy.wait(2000);
    cy.get('[data-cy="autosaveStatusMsg"]')
      .should("exist")
      .should("include.text", "Autosave status: Success");
    cy.get('[data-cy="BtnShortcutToConfirm"]').click();
    cy.get('[data-cy="surname-value"]').should("have.text", "Terry");

    // Submit form
    cy.get("[data-cy=BtnSubmit]")
      .scrollIntoView()
      .should("exist")
      .should("be.disabled");
    cy.get('[data-cy="isCorrect"]').should("exist").click();
    cy.get('[data-cy="willKeepInformed"]').should("exist").click();
    cy.get('[data-cy="BtnSubmit"]').should("not.be.disabled").click();

    // final submit via linker modal
    cy.get('[data-cy="form-linker-submit-btn"]').click();

    cy.contains("Submitted forms").should("exist");
    cy.get('[data-cy="Submit new form"]').should("exist");
    cy.get("[data-cy=submittedForm]").first().click();
    cy.get('[data-cy="email-value"]').should(
      "have.text",
      "traineeui.tester@hee.nhs.uk"
    );
    cy.get('[data-cy="savePdfBtn"]').should("exist");
    //check linkage
    cy.get('[data-cy="ARCP Form?-value"]').should("have.text", "No");

    // Navigate back to the list
    cy.get('[data-cy="backLink"]').should("exist").click();
    cy.contains("Submitted forms").should("exist");
  });
});

describe("Form R Part A - JSON form fields visibility status checks", () => {
  before(() => {
    cy.signInToTss(0, "/", "iphone-6");
  });
  it("should persist the updated dependent field visibility status to trigger any expected validation when a draft form is re-opened.", () => {
    cy.contains("Form R (Part A)").click({ force: true });
    cy.wait(5000);
    cy.get("#btnOpenForm").should("exist").click();
    cy.checkForFormLinkerAndComplete();
    cy.clickSelect('[data-cy="immigrationStatus"]', "ref", true);
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
    cy.clickSelect('[data-cy="programmeSpecialty"]', null, true);
    cy.clickSelect('[data-cy="cctSpecialty1"]', null, true);
    cy.clickSelect('[data-cy="college"]', null, true);
    cy.clearAndType('[data-cy="completionDate-input"]', completionDate);
    cy.navNext();
    cy.clickSelect('[data-cy="trainingGrade"]', null, true);
    cy.get('[data-cy="startDate-input"]').type(startDate);
    cy.clickSelect('[data-cy="programmeMembershipType"]', null, true);
    cy.clearAndType('[data-cy="wholeTimeEquivalent-input"]', "1");
    cy.get('[data-cy="navNext"]')
      .should("have.text", "Next:Review & submit")
      .click();

    cy.log(
      "################ Cancel submit and start over/delete draft ###################"
    );
    cy.get('[data-cy="isCorrect"]').should("exist").click();
    cy.get('[data-cy="willKeepInformed"]').should("exist").click();
    cy.get("[data-cy=BtnSubmit]").should("exist").click();
    cy.get("dialog").should("exist");
    cy.get('[data-cy="modal-cancel-btn"]').should("exist").click();
    cy.startOver();
    cy.wait(5000);
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
    cy.visit("/formr-a", { failOnStatusCode: false, timeout: 60000 });
    cy.wait(5000);
    cy.get("#btnOpenForm").should("exist").click();
    cy.checkForFormLinkerAndComplete();
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
    cy.visit("/formr-a", { failOnStatusCode: false, timeout: 60000 });
    cy.wait(5000);
    cy.get("#btnOpenForm").should("exist").click();
    cy.checkForFormLinkerAndComplete();
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
    cy.visit("/formr-a", { failOnStatusCode: false, timeout: 60000 });
    cy.wait(5000);
    cy.get("#btnOpenForm").should("exist").click();
    cy.checkForFormLinkerAndComplete();
    cy.get('[data-cy="email-input"]').focus().clear().type("t");
    cy.startOver();
    cy.get('[data-cy="toastText"]').should(
      "include.text",
      "Couldn't delete your draft Form R (Part A)."
    );
  });
  it("should display a sucess toast message when the form is deleted successfully.", () => {
    cy.contains("Form R (Part A)").click();
    cy.visit("/formr-a", { failOnStatusCode: false, timeout: 60000 });
    cy.wait(5000);
    cy.get('[data-cy="btn-Edit saved draft form"]').should("exist").click();
    cy.get('[data-cy="email-input"]').focus().clear().type("t");
    cy.startOver();
    cy.get('[data-cy="toastText"]').should(
      "include.text",
      "Your draft Form R (Part A) has been deleted."
    );
    cy.get('[data-cy="Submit new form"]').should("exist");
  });
});
