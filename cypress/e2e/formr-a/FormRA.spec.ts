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
        if (loadFormAButton.attr("data-cy") === "btnLoadNewForm") {
          cy.get("[data-cy=btnLoadNewForm]").click();
          cy.get("body").then($body => {
            if ($body.find(".MuiDialog-container").length) {
              cy.get(".MuiDialogContentText-root").should(
                "include.text",
                "You recently submitted a form"
              );
              cy.get(".MuiDialogActions-root > :nth-child(2)").click();
            }
          });
          cy.get("[data-cy=cctSpecialty1]").should("not.exist");
          cy.get("[data-cy=cctSpecialty2]").should("not.exist");
        } else {
          cy.get("#btnOpenForm").click();
        }
        cy.get(".nhsuk-warning-callout > p").should("exist");

        //-- personal details section --
        cy.completeFormAPersonalDetailsSection(dateAttained);
        cy.get("[data-cy=wholeTimeEquivalent]").clear();

        //-- Declarations section --
        cy.get("[data-cy=declarationType0]").click();
        cy.get("[data-cy=cctSpecialty2]").should("exist");

        //- Programme specialty section --
        cy.completeFormRAProgrammeSpecialtySection();

        cy.get("[data-cy=college] > option")
          .eq(1)
          .then(element => {
            const selectedItem = element.val()!.toString();
            cy.get("[data-cy=college]")
              .select(selectedItem)
              .should("not.have.value", "--Please select--");
          });
        cy.get("[data-cy=completionDate]").clear().type(completionDate);

        //-- Programme section --
        cy.get("[data-cy=trainingGrade] > option")
          .eq(3)
          .then(element => {
            const selectedItem = element.val()!.toString();
            cy.get("[data-cy=trainingGrade]")
              .select(selectedItem)
              .should("not.have.value", "--Please select--");
          });
        cy.get("[data-cy=startDate]")
          .clear()
          .type(startDate)
          .should("not.have.value", "");
        cy.get("[data-cy=programmeMembershipType]")
          .should("exist")
          .clear()
          .type("LAT");

        //-- error msg when FTE not completed
        cy.log("################ Error msg when no FTE ###################");
        cy.get("[data-cy=BtnContinue]").should("exist").click();
        cy.get(".nhsuk-error-summary").should("exist");
        cy.get("#wholeTimeEquivalent--error-message").should("exist");
        cy.get("[data-cy=wholeTimeEquivalent]").type("0.99");
      });

    // ---------------- Check/edit the form -------------------------------------------
    // -- Clicking Continue --
    cy.log("################ Check/ EDIT FORM ###################");
    cy.get("[data-cy=BtnContinue]").click();
    cy.get(".nhsuk-warning-callout").should("exist");

    cy.get("[data-cy=BtnSubmit]").should("exist");

    // -- Clicking Edit --
    cy.contains("Edit").should("exist").click();

    // -- Check form values persist --
    cy.checkFormRAValues(dateAttained, completionDate, startDate, "0.99");
    cy.get("[data-cy=BtnSubmit]").should("not.exist");
    cy.contains("Edit").should("not.exist");
    cy.get("[data-cy=BtnContinue]").should("exist");
    cy.get("#wholeTimeEquivalent").clear().type("1").should("have.value", "1");

    // Save draft
    cy.log("################ save draft form ###################");
    cy.get("[data-cy=BtnSaveDraft]").click();
    cy.checkForSuccessNotif("Success");
    cy.get("[data-cy=btnEditSavedForm]").should("exist").click();
    cy.checkFormRAValues(dateAttained, completionDate, startDate, "1");

    cy.get("[data-cy=BtnContinue]").click();
    cy.get("[data-cy='warningSubmit']")
      .first()
      .scrollIntoView()
      .should("exist");

    // ------------ submit form ---------------------------------------------------------------------
    cy.log("################ submit form ###################");

    cy.get("[data-cy=BtnSubmit]").scrollIntoView().should("exist").click();
    cy.get(".MuiDialog-container")
      .should("exist")
      .should("include.text", "Please think carefully before submitting");
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get("[data-cy=btnLoadNewForm]").should("exist");
    cy.contains("Submitted forms").should("exist");

    cy.log(
      "################ check submitted form is in forms list ###################"
    );
    // Open the form just saved
    cy.get("[data-cy=submittedForm]").first().click();
    cy.get("[data-cy=mobileNumber]").should("have.text", "0777777777777");
    cy.get("[data-cy=localOfficeName]").should(
      "have.text",
      "Health Education England Wessex"
    );
    // Navigate back to the list
    cy.get(".nhsuk-back-link__link").should("exist").click();
    cy.contains("Submitted forms").should("exist");
    cy.get("[data-cy=btnLoadNewForm]").should("exist");
  });
});
