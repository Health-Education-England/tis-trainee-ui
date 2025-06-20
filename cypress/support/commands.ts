/// <reference types="cypress" />

import dayjs from "dayjs";
import { cctCalcWarningsMsgs } from "../../utilities/CctConstants";

const currentDate = dayjs().format("YYYY-MM-DD");
const currRevalDate = dayjs().add(3, "month").format("YYYY-MM-DD");
const prevRevalDate = dayjs().subtract(5, "year").format("YYYY-MM-DD");
const workStartDate1 = dayjs().subtract(1, "year").format("YYYY-MM-DD");
const workEndDate1 = currRevalDate;
const workStartDate2 = dayjs().subtract(2, "year").format("YYYY-MM-DD");
const workEndDate2 = dayjs(currRevalDate).add(1, "year").format("YYYY-MM-DD");

Cypress.Commands.add(
  "checkElement",
  (
    selector: string,
    message: string | number | null = null,
    shouldExist: boolean = true
  ) => {
    const operation = shouldExist ? "exist" : "not.exist";
    cy.get(`[data-cy="${selector}"]`).should(operation);
    if (shouldExist && message) {
      cy.get(`[data-cy="${selector}"]`).contains(message);
    }
  }
);

Cypress.Commands.add("checkForFormLinkerAndComplete", () => {
  cy.get("dialog").then($dialog => {
    if ($dialog.is(":visible")) {
      cy.get('[data-cy="isArcp1"]').click();
      cy.clickSelect('[data-cy="programmeMembershipId"]');
      cy.get('[data-cy="form-linker-submit-btn"]').click();
    }
  });
});

Cypress.Commands.add("startOver", () => {
  cy.get('[data-cy="startOverButton"]').should("exist").click();
  cy.get(".MuiDialogContentText-root").should(
    "include.text",
    "This action will delete all the changes you have made to this form. Are you sure you want to continue?"
  );
  cy.get(".MuiDialogActions-root > :nth-child(2)").click();
});

Cypress.Commands.add("testDataSourceLink", () => {
  cy.get("[data-cy=dataSourceSummary]")
    .should("exist")
    .should("include.text", "My details are wrong")
    .click({ force: true });
  cy.get("[data-cy=dataSourceText] > :nth-child(1)").should("be.visible");
  cy.get(".nhsuk-action-link__text").should(
    "contain.text",
    "How to update my personal details"
  );
  cy.get("[data-cy='dataSourceLink']").should(
    "have.attr",
    "href",
    "https://tis-support.hee.nhs.uk/trainees/how-to-update-personal-data/"
  );
});

Cypress.Commands.add(
  "signInToTss",
  (
    waitTimeMs?: number,
    visitUrl?: string,
    viewport?: Cypress.ViewportPreset
  ) => {
    if (waitTimeMs && waitTimeMs === 30000) {
      cy.log(
        "*** Note: The 30s wait is to allow the MFA TOTP token to refresh (from a previous test) ***"
      );
      cy.wait(waitTimeMs);
    }
    const urlString = visitUrl ?? "/";
    cy.visit(urlString, { failOnStatusCode: false, timeout: 60000 });
    if (viewport) cy.viewport(viewport);
    cy.signIn();
  }
);

Cypress.Commands.add("clickAllRemoveWorkButtons", () => {
  cy.get("body").then($body => {
    if ($body.find('[data-cy^="remove-Work-"]')?.length > 0) {
      cy.get('[data-cy^="remove-Work-"]').first().click({ force: true });
      cy.clickAllRemoveWorkButtons();
    }
  });
});

Cypress.Commands.add(
  "clickSelect",
  (selectorBeginningSegment, text = null, useFirst = true) => {
    const selector = `${selectorBeginningSegment} > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container`;
    if (text) {
      cy.get(selector).type(text);
    } else {
      cy.get(selector).click();
    }
    cy.get(".react-select__menu")
      .find(".react-select__option")
      .then(options => {
        if (useFirst) {
          cy.wrap(options).first().click();
        } else {
          cy.wrap(options).last().click();
        }
      });
  }
);

Cypress.Commands.add("clearAndType", (selector: string, text: string) => {
  cy.get(selector).should("exist").click().clear().type(text);
});

Cypress.Commands.add("navigateBackToConfirm", (steps: number) => {
  const s = steps;
  for (let x = 0; x < s; x++) {
    cy.navNext();
  }
});

Cypress.Commands.add("navNext", (forceClick?: boolean) => {
  cy.get('[data-cy="navNext"]').click({ force: forceClick });
});

Cypress.Commands.add("clickRadioCheck", (selector: string) => {
  cy.get(selector).click();
});

export type ItemType = {
  [key: number]: string;
};
export type CheckType = "value" | "label";

Cypress.Commands.add("checkViewFields", (fields: string[][]) => {
  fields.forEach(([label, value]) => {
    cy.get(`[data-cy="${label}-label"]`).should("exist");
    cy.get(`[data-cy="${label}-value"]`)
      .should("exist")
      .should("have.text", value);
  });
});

Cypress.Commands.add("signIn", () => {
  cy.get('[type="email"]').click().clear().type(Cypress.env("username"));
  cy.get('[type="password"]').clear().type(Cypress.env("password"));
  cy.get(".amplify-button--primary").click();
  cy.task("generateOTP").then(token => {
    cy.get('[type="number"]').type(`${token}{enter}`);
  });
});

// ### Form A ###
Cypress.Commands.add("checkAndFillFormASection1", () => {
  // Header section

  const containedEls = [
    [".nhsuk-fieldset__heading", "Form R (Part A)"],
    [
      '[data-cy="formraLabel"]',
      "Trainee registration for Postgraduate Speciality Training"
    ],
    [
      '[data-cy="formraInfo"]',
      "The Form R is a vital aspect of Revalidation (this applies to those holding GMC registration) and you are expected to complete one at the start of a new training programme and ahead of each ARCP."
    ],
    [
      '[data-cy="WarningCallout-formAImportantNotice-label"] > span',
      "Important"
    ],
    [
      ".nhsuk-warning-callout > :nth-child(2) > :nth-child(1)",
      "This form has been pre-populated using the information available against your records"
    ],
    [
      '[data-cy="autosaveNote"]',
      "Note: This form will autosave 2 seconds after you pause making changes."
    ],
    [
      '[data-cy="autosaveStatusMsg"]',
      "Autosave status: Waiting for new changes..."
    ]
  ];

  containedEls.forEach(element => {
    cy.get(element[0]).should("contain", element[1]);
  });

  // Personal details

  const personalDetailsEls = [
    ['[data-cy="progress-header"] > h3', "Part 1 of 3 - Personal Details"],
    ['[data-cy="forename-label"]', "Forename"],
    ['[data-cy="immigrationStatus-label"]', "Immigration Status"]
  ];

  personalDetailsEls.forEach(element => {
    cy.get(element[0]).should("include.text", element[1]);
  });

  // test that the name fields grow and shrink with the input size
  cy.get('[data-cy="forename-input"]').should("have.value", "Anthony Mara");
  cy.clearAndType(
    '[data-cy="forename-input"]',
    "Terry terry terry terry terry terry"
  );
  cy.get('[data-cy="forename-input"]').should(
    "have.class",
    "nhsuk-input nhsuk-input--width-30"
  );

  cy.clearAndType('[data-cy="forename-input"]', "Terry");
  cy.get('[data-cy="forename-input"]').should(
    "have.class",
    "nhsuk-input nhsuk-input--width-20"
  );

  // test that the whitespace is removed from the text input
  cy.clearAndType('[data-cy="surname-input"]', "  John Terry  ");
  cy.get('[data-cy="progress-header"] > h3').click();
  cy.get('[data-cy="surname-input"]').should("have.value", "John Terry");

  // test AutocompleteSelect
  cy.clickSelect('[data-cy="immigrationStatus"]', "ref", true);
  cy.get('[data-cy="immigrationStatus"]').contains("Refugee in the UK");

  // test inline error
  cy.clearAndType('[data-cy="dateOfBirth-input"]', "1000-05-01");
  cy.get('[data-cy="dateOfBirth-inline-error-msg"]').should(
    "have.text",
    "Date of Birth is before the minimum date allowed"
  );

  cy.get('[data-cy="error-txt-Email address is required"]').should(
    "have.text",
    "Email address is required"
  );

  // test error summary
  cy.get('[data-cy="errorSummary"] > p').should(
    "have.text",
    "Before proceeding to the next section please address the following:"
  );
  cy.clearAndType('[data-cy="email-input"]', "traineeui.tester@hee.nhs.uk");
  cy.clearAndType('[data-cy="dateOfBirth-input"]', "2000-05-01");
  cy.get('[data-cy="errorSummary"] > p').should("not.exist");
  cy.get(
    '[data-cy="error-txt-Date of Birth is before the minimum date allowed"]'
  ).should("not.exist");
  cy.get('[data-cy="dateOfBirth-inline-error-msg"]').should("not.exist");

  // test soft validation
  cy.clearAndType('[data-cy="postCode-input"]', "123456");
  cy.get(".field-warning-msg").should(
    "have.text",
    "Warning: Non-UK postcode detected. Please ignore if valid."
  );
  cy.get('[data-cy="postCode-input"]').clear();
  cy.get(".field-warning-msg").should("not.exist");
  cy.get('[data-cy="postCode-inline-error-msg"]').should("exist");
  cy.clearAndType('[data-cy="postCode-input"]', "123456");
  cy.get(".field-warning-msg").should("exist");
  cy.get('[data-cy="postCode-inline-error-msg"]').should("not.exist");

  // check disabled next button
  cy.clearAndType('[data-cy="email-input"]', "x@x");
  cy.navNext(true);
  cy.get('[data-cy="navNext"]').should("have.class", "disabled-link");

  // check errors too
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get('[data-cy="error-txt-Email address is invalid"]').should("exist");
  cy.clearAndType('[data-cy="email-input"]', "traineeui.tester@hee.nhs.uk");
  cy.get(".nhsuk-error-summary").should("not.exist");

  cy.get('[data-cy="BtnSaveExit-formA"]').should("not.be", "disabled");
});

Cypress.Commands.add("checkAndFillFormASection2", () => {
  // Page 2
  cy.get('[data-cy="WarningCallout-formAImportantNotice-label"] > span').should(
    "not.exist"
  );

  cy.get('[data-cy="progress-header"] > h3').should(
    "have.text",
    "Part 2 of 3 - Programme Declarations"
  );

  cy.get(
    '[data-cy="declarationType-I have been appointed to a programme leading to award of CCT-input"]'
  ).should("exist");

  cy.clickRadioCheck(
    '[data-cy="declarationType-I have been appointed to a programme leading to award of CCT-input"]'
  );
  cy.get('[data-cy="cctSpecialty1"]').should("be.visible");
  cy.get('[data-cy="cctSpecialty2"]').should("be.visible");
  cy.clickSelect('[data-cy="cctSpecialty1"]', "ana", true);
  cy.get('[data-cy="cctSpecialty1"]').should("include.text", "ACCS");

  // hide the cctSpecialty fields
  cy.clickRadioCheck(
    '[data-cy="declarationType-I will be seeking specialist registration by application for a CESR-input"]'
  );
  cy.get('[data-cy="cctSpecialty1]').should("not.exist");
  cy.get('[data-cy="cctSpecialty2]').should("not.exist");
  // unhide the cctSpecialty fields to see if the cct1 value is still there
  cy.clickRadioCheck(
    '[data-cy="declarationType-I have been appointed to a programme leading to award of CCT-input"]'
  );
  cy.get('[data-cy="cctSpecialty1-label"]').should("be.visible");
  cy.get(
    '[data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__value-container'
  ).should("include.text", "ACCS");

  // hidden fields should not be validated
  cy.clickRadioCheck(
    '[data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__indicators > .react-select__clear-indicator'
  );
  cy.get('[data-cy="cctSpecialty1-inline-error-msg"]').should("exist");
  cy.get(".nhsuk-error-summary").should("exist");
  cy.clickRadioCheck(
    '[data-cy="declarationType-I will be seeking specialist registration by application for a CESR-input"]'
  );
  cy.get('[data-cy="cctSpecialty1]').should("not.exist");
  cy.get('[data-cy="cctSpecialty1-inline-error-msg"]').should("not.exist");
  cy.clearAndType('[data-cy="completionDate-input"]', "2032-12-30");
  cy.get('[data-cy="programmeSpecialty-hint"]').should(
    "have.text",
    "This field is pre-populated from your linked Programme."
  );
  cy.get('[data-cy="programmeSpecialty-input"]').should(
    "have.attr",
    "readonly"
  );

  cy.get('[data-cy="college-inline-error-msg"]').should("exist");
  cy.get(".nhsuk-error-summary").should("exist");
  cy.clickSelect('[data-cy="college"]', "dent", true);
  cy.get(".nhsuk-error-summary").should("not.exist");
});

Cypress.Commands.add("checkAndFillFormASection3", () => {
  // Page 3
  cy.get('[data-cy="progress-header"] > h3').should(
    "have.text",
    "Part 3 of 3 - Programme Details"
  );

  cy.get('[data-cy="WarningCallout-formAImportantNotice-label"] > span').should(
    "not.exist"
  );

  // can navigate back to previous section without triggering validation
  cy.get('[data-cy="navPrevious"]').click();
  cy.get('[data-cy="progress-header"] > h3').should(
    "have.text",
    "Part 2 of 3 - Programme Declarations"
  );

  cy.navNext();
  cy.get('[data-cy="progress-header"] > h3').should(
    "have.text",
    "Part 3 of 3 - Programme Details"
  );
  cy.get('[data-cy="postTypesSummary"]').should("exist").click();
  cy.get('[data-cy="postTypesText"] > :nth-child(1)')
    .should("be.visible")
    .should(
      "include.text",
      "Substantive post: A role that a post graduate doctor in training holds on a permanent basis."
    );
  cy.navNext();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get("b").contains(
    "Before proceeding to the next section please address the following:"
  );
  cy.get(
    '[data-cy="error-txt-Training hours (Full Time Equivalent) needs to be a number less than or equal to 1 and greater than zero (a maximum of 2 decimal places)"]'
  ).should("exist");

  // check wte field validation
  cy.clearAndType('[data-cy="wholeTimeEquivalent-input"]', "1.1");
  cy.get(
    '[data-cy="error-txt-Training hours (Full Time Equivalent) needs to be a number less than or equal to 1 and greater than zero (a maximum of 2 decimal places)"]'
  ).should("exist");
  cy.get(".nhsuk-error-summary").should("exist");
  cy.clearAndType('[data-cy="wholeTimeEquivalent-input"]', "0.5");
  cy.clearAndType('[data-cy="startDate-input"]', dayjs().format("YYYY-MM-DD"));
  cy.clickSelect('[data-cy="trainingGrade"]', null);
  cy.checkElement("programmeMembershipType", "Substantive");
  cy.clickSelect('[data-cy="programmeMembershipType"]', null);
  cy.checkElement("programmeMembershipType", "Military");
  cy.get(".nhsuk-error-summary").should("not.exist");
  // wait to trigger autosave
  cy.wait(2000);
});

// Form B
// ### SECTION 1: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection1", () => {
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Personal Details"
  );
  cy.checkElement("WarningCallout-formBImportantNotice-label");
  cy.get(".nhsuk-warning-callout > :nth-child(2) > :nth-child(1)").should(
    "include.text",
    "This form has been pre-populated using the information available against your records"
  );
  cy.get(".nhsuk-details__summary-text").should("exist").click();
  cy.get(".nhsuk-action-link__text").contains(
    "How to update my personal details"
  );

  // 1. Personal Details

  // header stuff
  const pdContainsEls1 = [
    ['[data-cy="formRBHeading"]', "Form R (Part B)"],
    [
      '[data-cy="autosaveNote"]',
      "Note: This form will autosave 2 seconds after you pause making changes."
    ],
    [".nhsuk-card__heading", "Personal Details"],
    [".nhsuk-pagination__title", "Next"],
    [".nhsuk-pagination__page > div", "Whole Scope of Practice: Work"]
  ];
  pdContainsEls1.forEach(([selector, text]) => {
    cy.get(selector).should("exist").contains(text);
  });

  // check the 'save & exit' button is not disabled when form not dirty/no autosave triggered
  cy.get('[data-cy="BtnSaveExit-formB"]')
    .should("not.be.disabled")
    .should("have.text", "Save & exit");

  // clear page first
  cy.get('[data-cy="forename-input"]').clear();
  cy.get('[data-cy="surname-input"]').clear();
  cy.get('[data-cy="gmcNumber-input"]').clear();
  cy.get('[data-cy="email-input"]').clear();
  cy.clickSelect('[data-cy="prevRevalBody"]', null, true);

  // check the 'save & exit' button is disabled when form dirty and and autosave is triggered
  cy.get('[data-cy="BtnSaveExit-formB"]')
    .should("be.disabled")
    .should("have.text", "Saving...");

  cy.get(
    '[data-cy="prevRevalBody"] > .autocomplete-select > .react-select__control > .react-select__indicators > .react-select__clear-indicator'
  ).click();
  cy.get('[data-cy="currRevalDate-input"]').clear();
  cy.get('[data-cy="prevRevalDate-input"]').clear();
  cy.get('[data-cy="programmeSpecialty-input"]').should(
    "have.attr",
    "readonly"
  );
  cy.clickSelect('[data-cy="dualSpecialty"]', null, true);
  cy.get(
    '[data-cy="dualSpecialty"] > .autocomplete-select > .react-select__control > .react-select__indicators > .react-select__clear-indicator'
  ).click();

  // check error summary (required fields)
  cy.get(".nhsuk-error-summary").contains(
    "Before proceeding to the next section please address the following:"
  );
  cy.get('[data-cy="error-txt-Forename is required"]').should("exist");
  cy.get('[data-cy="error-txt-GMC-Registered Surname is required"]').should(
    "exist"
  );
  cy.get('[data-cy="error-txt-GMC number is required"]').should("exist");
  cy.get('[data-cy="error-txt-Email is required"]').should("exist");
  cy.get(
    '[data-cy="error-txt-Current Revalidation date must be a valid date"]'
  ).should("exist");

  // (non-required fields)
  cy.get('[data-cy="error-txt-Previous Revalidation date is required"]').should(
    "not.exist"
  );
  cy.get('[data-cy="error-txt-Dual Specialty is required"]').should(
    "not.exist"
  );

  // check inline errors (required fields)
  cy.get('[data-cy="forename-inline-error-msg"]').should("exist");
  cy.get('[data-cy="surname-inline-error-msg"]').should("exist");
  cy.get('[data-cy="gmcNumber-inline-error-msg"]').should("exist");
  cy.get('[data-cy="email-inline-error-msg"]').should("exist");
  cy.get('[data-cy="currRevalDate-inline-error-msg"]').should("exist");

  // (non-required fields)
  cy.get('[data-cy="prevRevalDate-inline-error-msg"]').should("not.exist");
  cy.get('[data-cy="dualSpecialty-inline-error-msg"]').should("not.exist");

  // check disabled navNext
  cy.get('[data-cy="navNext"]').should(
    "have.class",
    "nhsuk-pagination__link nhsuk-pagination__link--next disabled-link"
  );

  // more email validation
  cy.clearAndType('[data-cy="email-input"]', "bo");
  cy.get('[data-cy="email-inline-error-msg"]')
    .should("exist")
    .contains("Email address is invalid");
  cy.get(".nhsuk-error-summary").contains("Email address is invalid");
  cy.clearAndType('[data-cy="email-input"]', "traineeui.tester@hee.nhs.uk");
  cy.get('[data-cy="email-inline-error-msg"]').should("not.exist");
  cy.get(".nhsuk-error-summary").should("not.contain", "Email is required");

  // check 'other' option conditional rendering
  cy.clickSelect('[data-cy="prevRevalBody"]', "oth");
  cy.get('[data-cy="prevRevalBodyOther-label"]').should("exist");

  // Check validation for 'other' option choices
  cy.get('[data-cy="prevRevalBodyOther-inline-error-msg"]').should("exist");
  cy.clickSelect('[data-cy="prevRevalBodyOther"]', null, true);
  cy.clickSelect('[data-cy="prevRevalBody"]', null, true);
  cy.get('[data-cy="prevRevalBodyOther-inline-error-msg"]').should("not.exist");

  cy.clickSelect('[data-cy="prevRevalBody"]', "oth");
  cy.clickSelect('[data-cy="prevRevalBodyOther"]', null);
  cy.get('[data-cy="prevRevalBodyOther-inline-error-msg"]').should("not.exist");

  // more date validation
  cy.clearAndType('[data-cy="currRevalDate-input"]', prevRevalDate);
  cy.get(".field-warning-msg")
    .should("exist")
    .contains("Warning: You have entered a past date.");

  cy.clearAndType('[data-cy="currRevalDate-input"]', currRevalDate);
  cy.get(".field-warning-msg").should("not.exist");

  // complete the required fields
  cy.clearAndType('[data-cy="forename-input"]', `Bob-${currentDate}`);
  cy.clearAndType('[data-cy="surname-input"]', `Smith-${currentDate}`);
  cy.clearAndType('[data-cy="gmcNumber-input"]', "1234567");

  cy.get(".error-summary").should("not.exist");
  cy.get('[data-cy="navNext"]').should(
    "not.have.class",
    "nhsuk-pagination__link nhsuk-pagination__link--next disabled-link"
  );
});

// ### SECTION 2: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection2", () => {
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Whole Scope of Practice: Work"
  );
  cy.checkElement("WarningCallout-workInstructions-label");
  cy.checkElement("autosaveNote");
  cy.get(".nhsuk-card__heading").contains("Type of Work");
  cy.clickAllRemoveWorkButtons();
  cy.get(".nhsuk-error-summary").contains(
    "Before proceeding to the next section please address the following:"
  );
  cy.get('[data-cy="error-txt-At least one Type of Work is required"]');

  // add a work panel
  cy.checkElement("add-Work-button", "Add a Work panel", true).click();

  // check the inline errors
  cy.checkElement("typeOfWork-inline-error-msg");
  cy.checkElement("trainingPost-inline-error-msg");
  cy.checkElement("startDate-inline-error-msg");
  cy.checkElement("endDate-inline-error-msg");
  cy.checkElement("site-inline-error-msg");
  cy.checkElement("siteLocation-inline-error-msg");
  cy.checkElement("siteKnownAs-inline-error-msg", null, false);

  // check the error summary
  cy.get(".error-summary_li_nested > :nth-child(1) > b").contains("Work 1");
  cy.checkElement("error-txt-Type of Work is required");
  cy.checkElement("error-txt-Training Post is required");
  cy.checkElement("error-txt-Start date must be a valid date");
  cy.checkElement("error-txt-End date must be a valid date");
  cy.checkElement("error-txt-Site Location is required");
  cy.checkElement("error-txt-Site Name is required");

  // fill in the panel 1
  cy.clearAndType('[data-cy="typeOfWork-input"]', "Some Work 1");
  cy.clickSelect('[data-cy="trainingPost"]');
  cy.clearAndType('[data-cy="startDate-input"]', workStartDate1);
  cy.clearAndType('[data-cy="endDate-input"]', workEndDate1);
  cy.clearAndType('[data-cy="site-input"]', "some site 1");
  cy.clearAndType('[data-cy="siteLocation-input"]', "London");
  cy.clearAndType('[data-cy="siteKnownAs-input"]', "St. Barabas");

  // check error summary
  cy.get(".error-summary").should("not.exist");

  // add another work panel
  cy.checkElement("add-Work-button").click();
  cy.get(".error-summary").should("exist");
  cy.get(".error-summary_li_nested > :nth-child(1) > b").contains("Work 2");

  // force an error in first panel
  cy.get('[data-cy="startDate-input"]').clear();

  // check error summary again
  cy.get(".error-summary_li_nested > :nth-child(1) > b").contains("Work 1");
  cy.get(":nth-child(2) > :nth-child(1) > b").contains("Work 2");

  // check inline errors on first panel
  cy.get(
    ':nth-child(1) > .nhsuk-card__content > :nth-child(4) > [data-cy="startDate"] > [data-cy="startDate-inline-error-msg"]'
  )
    .should("exist")
    .contains("Start date must be a valid date");
  cy.get(
    ':nth-child(1) > .nhsuk-card__content > :nth-child(5) > [data-cy="endDate"] > [data-cy="endDate-inline-error-msg"]'
  )
    .should("exist")
    .contains("End date must be later than or equal to Start date");

  // fill in second panel
  cy.get('[data-cy="typeOfWork-input"]:last').type("Some Work 2");
  cy.clickSelect('[data-cy="trainingPost"]:last');
  cy.clearAndType('[data-cy="startDate-input"]:last', workStartDate2);
  cy.clearAndType('[data-cy="endDate-input"]:last', workEndDate2);
  cy.clearAndType('[data-cy="site-input"]:last', "some site 2");
  cy.clearAndType('[data-cy="siteLocation-input"]:last', "Manchester");
  cy.clearAndType(
    '[data-cy="siteKnownAs-input"]:last',
    "The Firey Pit of Despair"
  );

  cy.get(":nth-child(2) > :nth-child(1) > b").should("not.exist");
  cy.get(".error-summary").should("exist");

  // delete the first panel
  cy.get('[data-cy="remove-Work-1-button"]').click();
  cy.get(".error-summary").should("not.exist");

  // check the position of the remaining panel
  cy.get('[data-cy="typeOfWork-input"]').should("have.length", 1);
  cy.get('[data-cy="typeOfWork-input"]').should("have.value", "Some Work 2");
});

// ### SECTION 3: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection3", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Whole Scope of Practice: Time Out Of Training (TOOT)"
  );
  cy.get(".nhsuk-card__heading").contains(
    "TOOT days (round up to the nearest whole day)"
  );
  cy.checkElement("sicknessAbsence-input").clear();
  cy.checkElement(
    "sicknessAbsence-inline-error-msg",
    "Short and Long-term sickness absence must be a positive number or zero"
  );

  cy.get(".nhsuk-error-summary").should("exist");
  cy.checkElement(
    "error-txt-Short and Long-term sickness absence must be a positive number or zero"
  );
  // check max digits
  cy.get('[data-cy="sicknessAbsence-input"]').type("9999999");
  cy.checkElement("sicknessAbsence-inline-error-msg", null, false);
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.get('[data-cy="sicknessAbsence-input"]')
    .should("exist")
    .should("have.value", "9999");
  cy.get('[data-cy="paidLeave-input"]')
    .clear()
    .type("999999")
    .should("have.value", "9999");
  cy.get('[data-cy="totalLeave-input"]').should("have.attr", "readonly");
  cy.get('[data-cy="totalLeave-input"]').should("have.value", "19998");
  cy.checkElement("totalLeave-inline-error-msg");
  cy.checkElement("error-txt-Total leave cannot exceed 9999 days", null);
  cy.log("still navigate back to previous section with errors");
  cy.get('[data-cy="navPrevious"]').click();
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Whole Scope of Practice: Work"
  );
  cy.navNext();
  cy.clearAndType('[data-cy="sicknessAbsence-input"]', "0");
  cy.checkElement("totalLeave-inline-error-msg", null, false);
});

// ### SECTION 4: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection4", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Good Medical Practice: Declarations"
  );
  cy.get(".nhsuk-card__heading").contains("Declarations");
  cy.get('[data-cy="isHonest-checkbox"]').check();

  cy.checkElement("isHealthy-inline-error-msg");
  cy.checkElement("isWarned-inline-error-msg");
  cy.get(".nhsuk-error-summary").should("exist");
  cy.checkElement(
    "error-txt-Please confirm your acceptance to Good Medical Practice personal health obligations"
  );
  cy.checkElement(
    "error-txt-Please select Yes or No relating to conditions, warnings, or undertakings"
  );

  cy.get('[data-cy="navNext"]').should(
    "have.class",
    "nhsuk-pagination__link nhsuk-pagination__link--next disabled-link"
  );
  // test navigation to previous even with errors
  cy.get('[data-cy="navPrevious"]').click();
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Whole Scope of Practice: Time Out Of Training (TOOT)"
  );
  cy.navNext();
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Good Medical Practice: Declarations"
  );
  // errors will only reappear after user interaction
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.get('[data-cy="isHealthy-checkbox"]').check();
  cy.get(".nhsuk-error-summary").should("exist");

  cy.checkElement("isWarned-inline-error-msg");
  cy.checkElement(
    "error-txt-Please select Yes or No relating to conditions, warnings, or undertakings"
  );
  cy.get('[data-cy="isWarned-Yes-input"]').click();
  cy.checkElement("isComplying-inline-error-msg");
  cy.get('[data-cy="isWarned-No-input"]').click();
  cy.checkElement("isComplying-inline-error-msg", null, false);
});

// ### SECTION 5: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection5", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Good Medical Practice: Health Statement"
  );
  cy.get(".nhsuk-card__heading").contains("Health Statement (not compulsory)");
  cy.checkElement("healthStatement-text-area-input");
});

// ### SECTION 6: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection6", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Summary of previous resolved Form R Declarations"
  );
  cy.get(".nhsuk-card__heading").contains(
    "Resolved Declarations (declared on previous Form R)"
  );
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.get('[data-cy="havePreviousDeclarations-Yes-input"]').click();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get(
    '[data-cy="error-txt-At least one Previous Declaration is required"]'
  ).should("exist");
  cy.checkElement("add-Previous Declarations-button");
  cy.get('[data-cy="havePreviousDeclarations-No-input"]').click();
  cy.get(".nhsuk-error-summary").should("not.exist");

  cy.get('[data-cy="havePreviousDeclarations-Yes-input"]').click();
  cy.get('[data-cy="add-Previous Declarations-button"]').click();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get('[data-cy="declarationType-label"]').should(
    "have.text",
    "Declaration Type"
  );
  cy.get('[data-cy="declarationType-inline-error-msg"]').should("exist");
  cy.get('[data-cy="error-txt-Declaration type is required"]').should("exist");
  cy.get('[data-cy="remove-Previous Declarations-1-button"]')
    .should("exist")
    .click();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get(
    '[data-cy="error-txt-At least one Previous Declaration is required"]'
  ).should("exist");
  cy.get('[data-cy="havePreviousDeclarations-No-input"]').click();
  cy.get(".nhsuk-error-summary").should("not.exist");
});

// ### SECTION 7: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection7", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Summary of previous unresolved Form R Declarations"
  );
  cy.get(".nhsuk-card__heading").contains(
    "Unresolved Declarations (declared on previous Form R)"
  );
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.navNext();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get(
    '[data-cy="havePreviousUnresolvedDeclarations-inline-error-msg"]'
  ).should("exist");
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get(
    '[data-cy="error-txt-Please select Yes or No for previous declarations"]'
  ).should("exist");
  cy.get('[data-cy="havePreviousUnresolvedDeclarations-No-input"]').click();
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.checkElement(
    "havePreviousUnresolvedDeclarations-inline-error-msg",
    null,
    false
  );
  cy.checkElement("previousDeclarationSummary-text-area-input", null, false);
  cy.get('[data-cy="havePreviousUnresolvedDeclarations-Yes-input"]').click();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get('[data-cy="previousDeclarationSummary-text-area-input"]')
    .should("be.visible")
    .type("prev unresolved dec summary ");
});

// ### SECTION 8: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection8", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Summary of new resolved Form R Declarations"
  );
  cy.get(".nhsuk-card__heading").contains("Resolved Declarations (new)");
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.checkElement("add-Current Declarations-button", null, false);

  cy.get('[data-cy="haveCurrentDeclarations-Yes-input"]').click();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get('[data-cy="add-Current Declarations-button"]').should("exist");
  cy.get(
    '[data-cy="error-txt-At least one Current Declaration is required"]'
  ).should("exist");
  cy.get('[data-cy="add-Current Declarations-button"]').click();
  cy.get(
    '[data-cy="error-txt-At least one Current Declaration is required"]'
  ).should("not.exist");
  cy.get(".error-summary_li_nested > :nth-child(1) > b").should(
    "have.text",
    "Current Declarations 1"
  );
  cy.get('[data-cy="error-txt-Declaration type is required"]').should("exist");
  cy.get('[data-cy="declarationType-inline-error-msg"]').should("exist");
  cy.get('[data-cy="error-txt-Date of entry must be a valid date"]').should(
    "exist"
  );
  cy.get('[data-cy="dateOfEntry-inline-error-msg"]').should("exist");
  cy.get('[data-cy="error-txt-Title is required"]').should("exist");
  cy.get('[data-cy="title-inline-error-msg"]').should("exist");
  cy.get('[data-cy="error-txt-Location of entry is required"]').should("exist");
  cy.get('[data-cy="locationOfEntry-inline-error-msg"]').should("exist");
  // complete panel 1
  cy.clickSelect('[data-cy="declarationType"]');
  cy.clearAndType('[data-cy="dateOfEntry-input"]', "2024-04-01");
  cy.clearAndType('[data-cy="title-input"]', "dec 1 title");
  cy.clearAndType('[data-cy="locationOfEntry-input"]', "dec 1 loc");
  cy.get(".nhsuk-error-summary").should("not.exist");
  // add another panel
  cy.get('[data-cy="add-Current Declarations-button"]').click();
  cy.get(".error-summary_li_nested > :nth-child(1) > b").should(
    "have.text",
    "Current Declarations 2"
  );
  cy.checkElement("error-txt-Title is required");
  cy.checkElement("title-inline-error-msg");
  // force an error in panel 1
  cy.get(
    ':nth-child(1) > .nhsuk-card__content > :nth-child(4) > [data-cy="title-input"]'
  ).clear();
  cy.get(
    ':nth-child(1) > .nhsuk-card__content > :nth-child(4) > [data-cy="title-inline-error-msg"]'
  ).should("exist");
  cy.get(
    ".error-summary_li > :nth-child(1) > :nth-child(1) > :nth-child(1) > b"
  ).should("have.text", "Current Declarations 1");
  // remove error in panel 1
  cy.get(
    ':nth-child(1) > .nhsuk-card__content > :nth-child(4) > [data-cy="title-input"]'
  ).type("new dec 1 title");
  cy.get(
    ':nth-child(1) > .nhsuk-card__content > :nth-child(4) > [data-cy="title-inline-error-msg"]'
  ).should("not.exist");
  cy.get(".error-summary_li_nested > :nth-child(1) > b").should(
    "have.text",
    "Current Declarations 2"
  );
  // complete panel 2
  cy.clickSelect(
    ':nth-child(2) > .nhsuk-card__content > :nth-child(2) > [data-cy="declarationType"]'
  );
  cy.clearAndType(
    ':nth-child(2) > .nhsuk-card__content > :nth-child(3) > [data-cy="dateOfEntry"] > [data-cy="dateOfEntry-input"]',
    "2024-04-02"
  );
  cy.clearAndType(
    ':nth-child(2) > .nhsuk-card__content > :nth-child(4) > [data-cy="title-input"]',
    "dec 2 title"
  );
  cy.clearAndType(
    ':nth-child(2) > .nhsuk-card__content > :nth-child(5) > [data-cy="locationOfEntry-input"]',
    "dec 2 loc"
  );
  cy.get(".nhsuk-error-summary").should("not.exist");

  // remove panel 1
  cy.get('[data-cy="remove-Current Declarations-1-button"]').click();

  // check the remaining panel
  cy.get(".react-select__value-container").should("have.text", "Complaint");
  cy.get('[data-cy="title-input"]').should("have.value", "dec 2 title");
  cy.get('[data-cy="locationOfEntry-input"]').should("have.value", "dec 2 loc");
});

// ### SECTION 9: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection9", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Summary of new unresolved Form R Declarations"
  );
  cy.get(".nhsuk-card__heading").contains("Unresolved Declarations (new)");
  cy.get('[data-cy="haveCurrentUnresolvedDeclarations-No-input"]').click();
  cy.get(".nhsuk-error-summary").should("not.exist");
});

// ### SECTION 10: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection10", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "Compliments"
  );
  cy.get(".nhsuk-card__heading").contains("Compliments (Not compulsory)");
  cy.clearAndType('[data-cy="compliments-text-area-input"]', "temp compliment");
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.checkElement("BtnSaveExit-formB");
  cy.get('[data-cy="BtnShortcutToConfirm"]').should("not.exist");
});

// ### COVID SECTION: CHECK AND FILL
Cypress.Commands.add("checkAndFillCovidSection", () => {
  cy.get(".nhsuk-details__summary-text").should("not.exist");
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').should(
    "include.text",
    "COVID 19 self-assessment & declarations"
  );
  cy.get('[data-cy="haveCovidDeclarations-Yes-input"]').click();
  cy.get(".nhsuk-error-summary").should("exist");

  const selectors = [
    "error-txt-Self-rating your own performance is required",
    "selfRateForCovid-inline-error-msg",
    "error-txt-Please select yes or no to discuss with supervisor",
    "discussWithSupervisorChecked-inline-error-msg",
    "error-txt-Please select yes or no to discuss with someone",
    "discussWithSomeoneChecked-inline-error-msg",
    "error-txt-Please select yes or no to changes made to placement",
    "haveChangesToPlacement-inline-error-msg"
  ];

  selectors.forEach(selector => {
    cy.checkElement(selector);
  });

  cy.get('[data-cy="haveChangesToPlacement-Yes-input"]').click();
  const haveChangesSelectors = [
    {
      selector: "haveChangesToPlacement-inline-error-msg",
      shouldExist: false
    },
    "changeCircumstances-inline-error-msg",
    "error-txt-Circumstance of change is required",
    "howPlacementAdjusted-inline-error-msg",
    "error-txt-How your placement was adjusted is required"
  ];

  haveChangesSelectors.forEach(item => {
    const { selector, shouldExist = true } =
      typeof item === "string" ? { selector: item } : item;
    cy.checkElement(selector, null, shouldExist);
  });

  cy.get('[data-cy="haveChangesToPlacement-No-input"]').click();
  cy.checkElement("changeCircumstances-inline-error-msg", null, false);
  cy.checkElement("howPlacementAdjusted-inline-error-msg", null, false);

  cy.get('[data-cy="haveChangesToPlacement-Yes-input"]').click();
  cy.clickSelect('[data-cy="changeCircumstances"]', "oth");
  cy.checkElement("changeCircumstanceOther-inline-error-msg");

  cy.clickSelect('[data-cy="selfRateForCovid"]', null, false);
  cy.checkElement("reasonOfSelfRate-inline-error-msg", null, false);
  cy.checkElement("reasonOfSelfRate-text-area-input", null, false);

  cy.clickSelect('[data-cy="selfRateForCovid"]');
  cy.checkElement("selfRateForCovid-inline-error-msg", null, false);
  cy.checkElement("reasonOfSelfRate-inline-error-msg");

  cy.clearAndType(
    '[data-cy="reasonOfSelfRate-text-area-input"]',
    "my reason for self-rate"
  );
  cy.get('[data-cy="discussWithSupervisorChecked-No-input"]').click();
  cy.get('[data-cy="discussWithSomeoneChecked-Yes-input"]').click();

  cy.clearAndType(
    '[data-cy="changeCircumstanceOther-text-area-input"]',
    "other change"
  );
  cy.clearAndType(
    '[data-cy="howPlacementAdjusted-text-area-input"]',
    "more info on how placement adjusted"
  );
  cy.checkElement("nhsuk-error-summary", null, false);
});

Cypress.Commands.add("checkFlags", (name: string) => {
  return cy
    .request({
      method: "GET",
      url: `/api/forms/form-switches`
    })
    .then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.be.greaterThan(0);
      const data = response.body.filter(
        (flag: { name: string }) => flag.name === name
      );
      expect(data.length).to.eq(1);
      return data[0].enabled;
    });
});

Cypress.Commands.add("checkAndFillNewCctCalcForm", () => {
  const { shortNoticeMsg, wteCustomMsg, wteIncreaseMsg } = cctCalcWarningsMsgs;
  cy.get('[data-cy="backLink-to-cct-home"]').should("exist");
  cy.url().should("include", "/cct");
  cy.get('[data-cy="cct-calc-warning"]')
    .should("exist")
    .contains("Please note");
  cy.get('[data-cy="cct-calc-warning"] > p > a')
    .last()
    .should("include.text", "contact your Local Office support");
  cy.get('[data-cy="cct-calc-header"]')
    .should("exist")
    .contains("CCT Calculator - Changing hours (LTFT)");

  // prog modal
  cy.get('[data-cy="show-prog-modal-btn"]').should("be.visible").click();
  cy.get('[data-cy="dialogModal"]').should("exist");
  cy.get('[data-cy="dialogModal"] > div > h2').first().contains("Programmes");
  cy.get('[data-cy="dialogModal"] > div > h2').last().contains("Placements");
  cy.get('[data-cy="currentExpand"]').first().should("exist").click();
  cy.get('[data-cy="subheaderOnboarding"]').should("exist");
  cy.get('[data-cy="subheaderLtft"]').should("exist");
  cy.get('[data-cy="modal-cancel-btn"]').should("exist").click();
  cy.get('[data-cy="dialogModal"]').should("not.be.visible");

  //main form - header
  cy.get('[data-cy="cct-calc-form"]').should("exist");
  cy.get('[data-cy="cct-calc-btn"]').should("not.exist");
  cy.get('[data-cy="linked-prog-header"]').contains("Linked Programme");
  cy.get('[data-cy="linked-prog-table"]').should("not.exist");

  // - linked prog
  cy.clickSelect('[data-cy="programmeMembership.id"]', null, true);
  cy.get('[data-cy="programmeMembership.id"]').should("exist");
  cy.get('[data-cy="table-header-linked-prog-name"]').contains(
    "Linked Programme"
  );
  cy.get('[data-cy="table-data-linked-prog-name"]').contains("Cardiology");
  // - linked prog - clear
  cy.get(
    '[data-cy="programmeMembership.id"] > .autocomplete-select > .react-select__control > .react-select__indicators > .react-select__clear-indicator'
  ).click();
  cy.get('[data-cy="linked-prog-table"]').should("not.exist");
  cy.clickSelect('[data-cy="programmeMembership.id"]', null, true);

  // - current WTE
  cy.clickSelect('[data-cy="programmeMembership.wte"]', null, true);
  cy.get('[data-cy="changes[0].type"]').contains("WTE (e.g. LTFT)");
  cy.get(".nhsuk-error-message").first().contains("Please enter a start date");
  cy.get('[data-cy="changes[0].startDate"]').type("2022-01-01");
  cy.get(".nhsuk-error-message")
    .first()
    .contains("Change date cannot be before today.");
  cy.get('[data-cy="start-short-notice-warn"]').should("not.exist");
  cy.get('[data-cy="changes[0].startDate"]').type(dayjs().format("YYYY-MM-DD"));
  cy.get('[data-cy="start-short-notice-warn"]')
    .should("exist")
    .contains(shortNoticeMsg);
  cy.get('[data-cy="changes[0].wte"] > .nhsuk-error-message').contains(
    "Please enter a Proposed WTE"
  );
  cy.clickSelect('[data-cy="changes[0].wte"]', null, true);
  cy.get('[data-cy="changes[0].wte"] > .nhsuk-error-message').contains(
    "WTE values must be different"
  );
  cy.clickSelect('[data-cy="programmeMembership.wte"]', "80%", false);
  cy.clickSelect('[data-cy="changes[0].wte"]', "90%", false);
  cy.get('[data-cy="wte-increase-return-warn"]')
    .should("exist")
    .contains(wteIncreaseMsg);
  cy.get('[data-cy="wte-custom-warn"]').should("exist").contains(wteCustomMsg);
  cy.get('[data-cy="cct-calc-btn"]').should("exist").click();
});
