/// <reference types="cypress" />

import dayjs from "dayjs";
import { DateUtilities } from "../../utilities/DateUtilities";
import { BooleanUtilities } from "../../utilities/BooleanUtilities";

const currRevalDate = dayjs().add(3, "month").format("YYYY-MM-DD");
const prevRevalDate = dayjs().subtract(5, "year").format("YYYY-MM-DD");
const workStartDate1 = dayjs().subtract(1, "year").format("YYYY-MM-DD");
const workEndDate1 = currRevalDate;
const workStartDate2 = dayjs().subtract(2, "year").format("YYYY-MM-DD");
const workEndDate2 = dayjs(currRevalDate).add(1, "year").format("YYYY-MM-DD");

Cypress.Commands.add("checkForRecentForm", () => {
  cy.get("body").then($body => {
    if ($body.find(".MuiDialog-container").length) {
      cy.get(".MuiDialogContentText-root").should(
        "include.text",
        "You recently submitted a form"
      );
      cy.wait(5000); // to allow any notification service toast fails to clear to click the button below
      cy.get(".MuiDialogActions-root > :nth-child(2)").click();
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

Cypress.Commands.add("signIn", () => {
  cy.get('[type="email"]').click().clear().type(Cypress.env("username"));
  cy.get('[type="password"]').clear().type(Cypress.env("password"));
  cy.get(".amplify-button--primary").click();
  cy.task("generateOTP").then(token => {
    cy.get('[type="number"]').type(`${token}{enter}`);
  });
});

Cypress.Commands.add(
  "clickSelect",
  (selectorBeginningSegment, text, useFirst) => {
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

Cypress.Commands.add("clickAllRemoveWorkButtons", () => {
  cy.get("body").then($body => {
    if ($body.find('[data-cy^="remove-Work-"]')?.length > 0) {
      cy.get('[data-cy^="remove-Work-"]').first().click({ force: true });
      cy.clickAllRemoveWorkButtons();
    }
  });
});

export type ItemType = {
  [key: number]: string;
};
export type CheckType = "value" | "label";

Cypress.Commands.add(
  "checkPanelElement",
  (
    panelNumber: number,
    items: ItemType[],
    panelName: string,
    checkType: "value" | "label"
  ) => {
    items.forEach(item => {
      const key = Object.keys(item)[0];
      const value = Object.values(item)[0];
      const childNumber = checkType === "value" ? 2 : 1;
      const selector = checkType === "value" ? "" : " > .nhsuk-label > b";
      cy.get(
        `[data-cy="${panelName}-value"] > :nth-child(${panelNumber}) > .nhsuk-card__content > :nth-child(${key}) > .nhsuk-grid-row > :nth-child(${childNumber})${selector}`
      )
        .should("exist")
        .should("have.text", value);
    });
  }
);

Cypress.Commands.add("checkViewFields", (fields: string[][]) => {
  fields.forEach(([label, value]) => {
    cy.get(`[data-cy="${label}-label"]`).should("exist");
    cy.get(`[data-cy="${label}-value"]`)
      .should("exist")
      .should("have.text", value);
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

  cy.get('[data-cy="BtnSaveDraft"]').should("not.be", "disabled");
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
  cy.get('[data-cy="cctSpecialty1"]').contains("ACCS - Anaesthetics");

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
  ).contains("ACCS - Anaesthetics");

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
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get(
    '[data-cy="error-txt-Anticipated completion date - please choose a future date"]'
  ).should("exist");
  cy.get('[data-cy="completionDate-inline-error-msg"]').should("exist");
  cy.clearAndType('[data-cy="completionDate-input"]', "2032-12-30");

  const selector =
    '[data-cy="programmeSpecialty"] > .autocomplete-select > .react-select__control > .react-select__indicators .react-select__clear-indicator';
  cy.get("body").then($body => {
    if ($body.find(selector).length > 0) {
      cy.get(selector).click();
    }
  });
  cy.get('[data-cy="programmeSpecialty-inline-error-msg"]').should("exist");
  cy.clickSelect('[data-cy="programmeSpecialty"]', null, true);
  cy.get('[data-cy="programmeSpecialty-inline-error-msg"]').should("not.exist");
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
  cy.clickSelect('[data-cy="trainingGrade"]', null, true);
  cy.clickSelect('[data-cy="programmeMembershipType"]', null, true);
  cy.get(".nhsuk-error-summary").should("not.exist");
  // wait to trigger autosave
  cy.wait(2000);
});

// ### Form B ###
Cypress.Commands.add("checkAndFillFormBSection1", () => {
  cy.get(
    '[data-cy="WarningCallout-formBImportantNotice-label"] > span'
  ).contains("Important");
  cy.get(".nhsuk-warning-callout > :nth-child(2) > :nth-child(1)").should(
    "include.text",
    "This form has been pre-populated using the information available against your records"
  );
  cy.get(".nhsuk-details__summary-text").should("exist");

  // 1. Personal Details
  const pdContainsEls1 = [
    ['[data-cy="progress-header"] > h3', "Part 1 of 10 - Personal Details"],
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

  cy.get('[data-cy="navNext"]').click();

  cy.get('[data-cy="email-input"]').should(
    "have.class",
    "nhsuk-input nhsuk-input--width-20 nhsuk-input--error"
  );

  const emailTxt = "Email is required";
  const revalTxt = "Current Revalidation date has to be on or after today";

  const pdContainsEls2 = [
    ['[data-cy="email-inline-error-msg"]', emailTxt],
    [".nhsuk-error-summary", emailTxt],
    ['[data-cy="currRevalDate-inline-error-msg"]', revalTxt],
    [".nhsuk-error-summary", revalTxt]
  ];

  pdContainsEls2.forEach(([selector, text]) => {
    cy.get(selector).should("exist").contains(text);
  });

  cy.clearAndType('[data-cy="email-input"]', "bo");
  cy.get('[data-cy="email-inline-error-msg"]')
    .should("exist")
    .contains("Email address is invalid");
  cy.get(".nhsuk-error-summary")
    .should("exist")
    .contains("Email address is invalid");
  cy.clearAndType('[data-cy="email-input"]', "traineeui.tester@hee.nhs.uk");
  cy.get('[data-cy="email-inline-error-msg"]').should("not.exist");
  cy.get(".nhsuk-error-summary").should("not.contain", "Email is required");
  cy.clickSelect('[data-cy="localOfficeName"]', null, true);
  cy.clickSelect('[data-cy="prevRevalBody"]', "oth", true);
  cy.get('[data-cy="prevRevalBodyOther-label"]').should("exist");
  cy.clickSelect('[data-cy="prevRevalBodyOther"]', null, true);
  cy.clearAndType('[data-cy="currRevalDate-input"]', currRevalDate);
  cy.clearAndType('[data-cy="prevRevalDate-input"]', prevRevalDate);
  // default programmeSpecialty value was provided but didn't match dropdown options so isValidOption utils function returns empty string which fires an error
  cy.get('[data-cy="programmeSpecialty-inline-error-msg"]').should("exist");
  cy.get(".nhsuk-error-summary").contains(
    "Programme / Training Specialty is required"
  );
  cy.get('[data-cy="navNext"]').should(
    "have.class",
    "nhsuk-pagination__link nhsuk-pagination__link--next disabled-link"
  );
  cy.clickSelect('[data-cy="programmeSpecialty"]', null, true);
  cy.get(".react-select__value-container").should(
    "not.contain",
    "--Please select--"
  );
  cy.clickSelect('[data-cy="dualSpecialty"]', null, false);
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.get('[data-cy="navNext"]').should(
    "have.class",
    "nhsuk-pagination__link nhsuk-pagination__link--next"
  );
});

// Section 2 - Work Details
Cypress.Commands.add("checkAndFillFormBSection2", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 2 of 10 - Whole Scope of Practice: Work"
  );
  cy.get(".nhsuk-card__heading").contains("Type of Work");
  cy.get(".nhsuk-error-summary").should("not.exist");
  // Check some important text is displayed
  cy.get(".nhsuk-warning-callout > :nth-child(2) > :nth-child(6)").should(
    "include.text",
    "NOTE - Work placements will be sorted in a descending order by End Date when your form is reviewed and saved so there is no need to order them on this page."
  );
  // remove all existing work panels if they exist
  cy.clickAllRemoveWorkButtons();
  cy.get(".nhsuk-error-summary")
    .should("exist")
    .contains(
      "Before proceeding to the next section please address the following:"
    );
  cy.get(".nhsuk-card__heading").should("exist").contains("Type of Work");
  cy.get('[data-cy="error-txt-At least one Type of Work is required"]').should(
    "exist"
  );

  // add work panel
  cy.get('[data-cy="add-Work-button"]').click();
  // complete panel 1
  cy.fillWorkPanel("Work 1", workStartDate1, workEndDate1);
  // add another work panel
  cy.get('[data-cy="add-Work-button"]').click();
  // part fill panel 2
  cy.get(`[data-cy="Work 2"] > b`).contains("Work 2");
  cy.get('[data-cy="typeOfWork-input"]').last().type("Type of Work 2");
  cy.get('[data-cy="startDate-input"]').last().type(workStartDate2);
  cy.get('[data-cy="endDate-input"]').last().type(workEndDate2);
  cy.get(".nhsuk-error-summary").contains("Work 2");
  // remove panel 1
  cy.get('[data-cy="remove-Work-1-button"]').click();

  // The old Panel 2 should remain and is now the only panel (1)
  cy.get('[data-cy="Work 2"]').should("not.exist");
  cy.get('[data-cy="typeOfWork-input"]').should("have.length", 1);
  cy.get('[data-cy="startDate-input"]').should("have.length", 1);
  cy.get('[data-cy="endDate-input"]').should("have.length", 1);
  cy.get('[data-cy="typeOfWork-input"]').should("have.value", "Type of Work 2");
  cy.get('[data-cy="startDate-input"]').should("have.value", workStartDate2);
  cy.get('[data-cy="endDate-input"]').should("have.value", workEndDate2);
  cy.get('[data-cy="error-txt-At least one Type of Work is required"]').should(
    "not.exist"
  );
  // remove the remaining panel
  cy.get('[data-cy="remove-Work-1-button"]').click();
  cy.get('[data-cy="error-txt-At least one Type of Work is required"]').should(
    "exist"
  );
  // add and fill a new panel again
  cy.get('[data-cy="add-Work-button"]').click();
  cy.fillWorkPanel("Work 1", "2024-01-01", "2025-02-02");
});

Cypress.Commands.add(
  "fillWorkPanel",
  (workName: string, startDate: string, endDate: string) => {
    cy.get(`[data-cy="${workName}"] > b`).contains(workName);
    cy.get('[data-cy="typeOfWork-inline-error-msg"]').should("exist");
    cy.get('[data-cy="siteKnownAs-inline-error-msg"]').should("not.exist");
    cy.get(".nhsuk-error-summary").contains(workName);
    cy.get('[data-cy="error-txt-Type of Work is required"]').should("exist");
    cy.clearAndType('[data-cy="typeOfWork-input"]', workName);
    cy.get('[data-cy="typeOfWork-inline-error-msg"]').should("not.exist");

    cy.clickSelect('[data-cy="trainingPost"]', null, true);
    cy.get('[data-cy="trainingPost"]').contains("Yes");
    cy.clearAndType('[data-cy="startDate-input"]', startDate);
    cy.clearAndType('[data-cy="endDate-input"]', endDate);
    cy.clearAndType('[data-cy="site-input"]', `site ${workName}`);
    cy.clearAndType('[data-cy="siteLocation-input"]', `location ${workName}`);

    cy.get('[data-cy="siteKnownAs-inline-error-msg"]').should("not.exist");
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.clearAndType('[data-cy="siteKnownAs-input"]', `known as ${workName}`);
    cy.get(`[data-cy="remove-Work-${workName.split(" ")[1]}-button"]`).should(
      "exist"
    );
    cy.get('[data-cy="remove-Work-1-button"]').should(
      "have.text",
      `Remove ${workName}`
    );
  }
);

Cypress.Commands.add("checkAndFillFormBSection3", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 3 of 10 - Whole Scope of Practice: Time Out Of Training (TOOT)"
  );
  cy.get(".nhsuk-card__heading").contains(
    "TOOT days (round up to the nearest whole day)"
  );
  cy.get('[data-cy="sicknessAbsence-input"]')
    .should("exist")
    .should("have.value", "0")
    .clear();
  cy.get('[data-cy="sicknessAbsence-inline-error-msg"]')
    .should("exist")
    .contains(
      "Short and Long-term sickness absence must be a positive number or zero"
    );
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get(
    '[data-cy="error-txt-Short and Long-term sickness absence must be a positive number or zero"]'
  ).should("exist");
  cy.get('[data-cy="sicknessAbsence-input"]').type("99999");
  cy.get('[data-cy="sicknessAbsence-inline-error-msg"]').should("not.exist");
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.get('[data-cy="sicknessAbsence-input"]')
    .should("exist")
    // check max digits
    .should("have.value", "9999");
  cy.get('[data-cy="paidLeave-input"]')
    .clear()
    .type("999999")
    .should("have.value", "9999");
  cy.get('[data-cy="totalLeave-input"]').should("have.attr", "readonly");
  cy.get('[data-cy="totalLeave-input"]').should("have.value", "19998");
  cy.get('[data-cy="error-txt-Total leave cannot exceed 9999 days"]').should(
    "exist"
  );
  cy.clearAndType('[data-cy="paidLeave-input"]', "9");
  cy.clearAndType('[data-cy="sicknessAbsence-input"]', "999000000");
  cy.get('[data-cy="totalLeave-input"]').should("have.value", "9999");
  cy.get('[data-cy="error-txt-Total leave cannot exceed 9999 days"]').should(
    "not.exist"
  );

  cy.get('[data-cy="navPrevious"]').contains("Whole Scope of Practice: Work");
  cy.get('[data-cy="navNext"]').contains("Good Medical Practice: Declarations");
});

Cypress.Commands.add("checkAndFillFormBSection4", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 4 of 10 - Good Medical Practice: Declarations"
  );
  cy.get(".nhsuk-card__heading").contains("Declarations");
  cy.get('[data-cy="isHonest-checkbox"]').check();
  cy.get('[data-cy="isHealthy-inline-error-msg"]').should("exist");
  cy.get('[data-cy="isWarned-inline-error-msg"]').should("exist");
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get(
    '[data-cy="error-txt-Please confirm your acceptance to Good Medical Practice personal health obligations"]'
  ).should("exist");
  cy.get(
    '[data-cy="error-txt-Please select Yes or No relating to conditions, warnings, or undertakings"]'
  ).should("exist");
  cy.get('[data-cy="navNext"]').should(
    "have.class",
    "nhsuk-pagination__link nhsuk-pagination__link--next disabled-link"
  );
  // test navigation to previous even with errors
  cy.get('[data-cy="navPrevious"]').click();
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 3 of 10 - Whole Scope of Practice: Time Out Of Training (TOOT)"
  );
  cy.get('[data-cy="navNext"]').click();
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 4 of 10 - Good Medical Practice: Declarations"
  );
  // errors will only reappear after user interaction
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.get('[data-cy="isHealthy-checkbox"]').check();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get('[data-cy="isWarned-inline-error-msg"]').should("exist");
  cy.get(
    '[data-cy="error-txt-Please select Yes or No relating to conditions, warnings, or undertakings"]'
  ).should("exist");
  cy.get('[data-cy="isWarned-Yes-input"]').click();
  cy.get('[data-cy="isComplying-inline-error-msg"]').should("exist");
  cy.get('[data-cy="isWarned-No-input"]').click();
  cy.get('[data-cy="isComplying-inline-error-msg"]').should("not.exist");
});

Cypress.Commands.add("checkAndFillFormBSection5", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 5 of 10 - Good Medical Practice: Health Statement"
  );
  cy.get(".nhsuk-card__heading").contains("Health Statement (not compulsory)");
  cy.get('[data-cy="healthStatement-text-area-input"]').should("exist");
});

Cypress.Commands.add("checkAndFillFormBSection6", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 6 of 10 - Summary of previous resolved Form R Declarations"
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
  cy.get('[data-cy="add-Previous Declarations-button"]').should("exist");
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

Cypress.Commands.add("checkAndFillFormBSection7", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 7 of 10 - Summary of previous unresolved Form R Declarations"
  );
  cy.get(".nhsuk-card__heading").contains(
    "Unresolved Declarations (declared on previous Form R)"
  );
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.get('[data-cy="navNext"]').click();
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
  cy.get(
    '[data-cy="havePreviousUnresolvedDeclarations-inline-error-msg"]'
  ).should("not.exist");
  cy.get('[data-cy="previousDeclarationSummary-text-area-input"]').should(
    "not.exist"
  );
  cy.get('[data-cy="havePreviousUnresolvedDeclarations-Yes-input"]').click();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get('[data-cy="previousDeclarationSummary-text-area-input"]')
    .should("be.visible")
    .type("prev unresolved dec summary ");
});

Cypress.Commands.add("checkAndFillFormBSection8", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 8 of 10 - Summary of new resolved Form R Declarations"
  );
  cy.get(".nhsuk-card__heading").contains("Resolved Declarations (new)");
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.get('[data-cy="add-Current Declarations-button"]').should("not.exist");
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
  cy.clickSelect('[data-cy="declarationType"]', null, true);
  cy.get('[data-cy="dateOfEntry-input"]').type(workStartDate1);
  cy.get('[data-cy="title-input"]').type("dec 1 title");
  cy.get('[data-cy="locationOfEntry-input"]').type("dec 1 loc");
  cy.get(".nhsuk-error-summary").should("not.exist");

  // add another panel
  cy.get('[data-cy="add-Current Declarations-button"]').click();
  cy.get(".error-summary_li_nested > :nth-child(1) > b").should(
    "have.text",
    "Current Declarations 2"
  );
  cy.get('[data-cy="error-txt-Title is required"]').should("exist");
  cy.get('[data-cy="title-inline-error-msg"]').should("exist");
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
  cy.clickSelect(
    ':nth-child(2) > .nhsuk-card__content > :nth-child(2) > [data-cy="declarationType"]',
    null,
    true
  );
  cy.get(
    ':nth-child(2) > .nhsuk-card__content > :nth-child(3) > [data-cy="dateOfEntry"] > [data-cy="dateOfEntry-input"]'
  ).type("2024-04-02");
  cy.get(
    ':nth-child(2) > .nhsuk-card__content > :nth-child(4) > [data-cy="title-input"]'
  ).type("dec 2 title");
  cy.get(
    ':nth-child(2) > .nhsuk-card__content > :nth-child(5) > [data-cy="locationOfEntry-input"]'
  ).type("dec 2 loc");
  cy.get(".nhsuk-error-summary").should("not.exist");

  // remove panel 1
  cy.get('[data-cy="remove-Current Declarations-1-button"]').click();

  // check the remaining panel
  cy.get(".react-select__value-container").should("have.text", "Complaint");
  cy.get('[data-cy="title-input"]').should("have.value", "dec 2 title");
  cy.get('[data-cy="locationOfEntry-input"]').should("have.value", "dec 2 loc");
});

Cypress.Commands.add("checkAndFillFormBSection9", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 9 of 10 - Summary of new unresolved Form R Declarations"
  );
  cy.get(".nhsuk-card__heading").contains("Unresolved Declarations (new)");
  cy.get('[data-cy="haveCurrentUnresolvedDeclarations-No-input"]').click();
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.get('[data-cy="navNext"] > .nhsuk-pagination__page > div').contains(
    "10. Compliments"
  );
});

Cypress.Commands.add("checkAndFillFormBSection10", () => {
  cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
  cy.get('[data-cy="progress-header"] > h3').contains(
    "Part 10 of 10 - Compliments"
  );
  cy.get(".nhsuk-card__heading").contains("Compliments (Not compulsory)");
  cy.get('[data-cy="compliments-text-area-input"]')
    .should("exist")
    .type("temp compliment")
    .clear();
  cy.get(".nhsuk-error-summary").should("not.exist");
  cy.get('[data-cy="BtnSaveDraft"]').should("exist");
  cy.get('[data-cy="BtnShortcutToConfirm"]').should("not.exist");
});

Cypress.Commands.add("doDeclarationsFormB", () => {
  // declarations checks
  cy.get(":nth-child(6) > .nhsuk-warning-callout__label").contains(
    "Declarations"
  );
  cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
  cy.get('[data-cy="isDeclarationAccepted"]')
    .should("not.be.checked")
    .click()
    .should("be.checked");
  cy.get('[data-cy="isConsentAccepted"]')
    .should("not.be.checked")
    .click()
    .should("be.checked");
  cy.get('[data-cy="BtnSubmit"]').should("not.be.disabled");
  cy.get('[data-cy="BtnSaveDraft"]').should("exist");
  cy.get('[data-cy="startOverButton"]').should("exist");
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

Cypress.Commands.add("testData", (dataToTest: any, index?: number) => {
  const isDateType = (value: any) =>
    !!value && dayjs(value).isValid() && value.toString().indexOf("-") > -1;

  Object.entries(dataToTest).forEach(([key, val]: [key: string, val: any]) => {
    const cyDataRef = index && index >= 0 ? `${key}${index}` : key;
    if (val && isDateType(val)) {
      const formattedDate = DateUtilities.ToLocalDate(val.toString());
      cy.get(`[data-cy=${cyDataRef}]`).contains(formattedDate);
    } else if (typeof val === "number") {
      cy.get(`[data-cy=${cyDataRef}]`).contains(val);
    } else if (typeof val === "boolean") {
      cy.get(`[data-cy=${cyDataRef}]`).contains(BooleanUtilities.ToYesNo(val));
    } else if (val) {
      cy.get(`[data-cy=${cyDataRef}]`).contains(val.toString());
    }
  });
});
