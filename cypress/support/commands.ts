/// <reference types="cypress" />

import day from "dayjs";
import { DateUtilities } from "../../utilities/DateUtilities";
import { BooleanUtilities } from "../../utilities/BooleanUtilities";

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

Cypress.Commands.add("checkForRecentForm", () => {
  cy.get("body").then($body => {
    if ($body.find(".MuiDialog-container").length) {
      cy.get(".MuiDialogContentText-root").should(
        "include.text",
        "You recently submitted a form"
      );
      cy.get(".MuiDialogActions-root > :nth-child(2)").click({ force: true });
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
  cy.get('[data-cy="cctSpecialty1"]').contains("ACCS Anaesthetics");

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
  ).contains("ACCS Anaesthetics");

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
  cy.clearAndType('[data-cy="startDate-input"]', day().format("YYYY-MM-DD"));
  cy.clickSelect('[data-cy="trainingGrade"]', null, true);
  cy.clickSelect('[data-cy="programmeMembershipType"]', null, true);
  cy.get(".nhsuk-error-summary").should("not.exist");
  // wait to trigger autosave
  cy.wait(2000);
});

// ### SECTION 1: CHECK AND FILL
Cypress.Commands.add(
  "checkAndFillSection1",
  (currRevalDate: string, prevRevalDate: string) => {
    cy.contains("Section 1: Doctor's details").should("exist");
    cy.get("[data-cy=mainWarning1]").should("exist");
    cy.get("[data-cy=legendFieldset1]").should("exist");
    cy.get(".nhsuk-warning-callout > p").should("exist");

    cy.get("#prevRevalBody").should("exist");
    cy.get("#prevRevalBodyOther").should("not.exist");

    cy.get("#forename").should("exist").invoke("val");
    cy.get("#forename").focus();
    cy.get("#forename").clear();
    cy.get("#forename").type("   Fore name  ");
    cy.get(".nhsuk-card__heading").first().click();
    cy.get("#forename").should("have.value", "Fore name");
    cy.get("#surname").should("exist").invoke("val");
    cy.get("#surname").clear();
    cy.get("#surname").type("Last name");

    cy.get("#gmcNumber").should("exist").invoke("val");
    cy.get("#gmcNumber").clear();
    cy.get("#gmcNumber").type("11111111");

    cy.get("#email").should("exist").invoke("val");
    cy.get("#email").clear();
    cy.get("#email").type("traineeui.tester@hee.nhs.uk");

    cy.get("[data-cy='localOfficeName']")
      .should("exist")
      .focus()
      .select("Health Education England Wessex");
    cy.get("#prevRevalBody > option")
      .last()
      .then(element => {
        const selectedItem = element.val()!.toString();
        cy.get("#prevRevalBody")
          .select(selectedItem)
          .should("have.value", "other");
      });
    cy.get("#currRevalDate").should("exist").clear().type(currRevalDate);
    cy.get("#prevRevalDate").should("exist").clear().type(prevRevalDate);
    cy.get("#programmeSpecialty > option")
      .eq(1)
      .then(element => {
        const selectedItem = element.val()!.toString();
        cy.get("#programmeSpecialty")
          .select(selectedItem)
          .should("not.have.value", "--Please select--");
      });
    cy.get("#dualSpecialty > option")
      .eq(1)
      .then(element => {
        const selectedItem = element.val()!.toString();
        cy.get("#dualSpecialty")
          .select(selectedItem)
          .should("not.have.value", "--Please select--");
      });
    cy.get("#prevRevalBody").select(
      "Northern Ireland Medical and Dental Training Agency"
    );
    cy.get("#prevRevalBody").should(
      "have.value",
      "Northern Ireland Medical and Dental Training Agency"
    );
    cy.get("#prevRevalBody").should(
      "not.have.value",
      "Health Education England Wessex"
    );
    cy.get("#prevRevalBody").select("other");

    cy.get(
      ".autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container"
    )
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(
      ".autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container"
    )
      .click()
      .type("yach")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
  }
);

// ### SECTION 2: CHECK AND FILL
Cypress.Commands.add(
  "checkAndFillSection2",
  (workStartDate: string, endDate: string) => {
    // This command fills the section with default work panel only

    cy.contains("Whole Scope of Practice").should("exist");
    cy.get(".nhsuk-warning-callout > p").should("exist");
    cy.contains("Type of work").should("exist");
    cy.contains("Add more").should("exist");
    cy.contains("TOOT").should("exist");

    // Delete all other work panels except default work panel
    cy.get('[data-jest="removePanel"]').each(() =>
      cy.get('[data-cy="closeIcon1"]').click()
    );

    // Fill default work panel
    cy.get('[data-cy="work[0].trainingPost"]').select("Yes");
    cy.get('[data-cy="work[0].typeOfWork"]')
      .should("exist")
      .clear()
      .type("In Post Doing Something");
    cy.get('[data-cy="work[0].startDate"]')
      .should("exist")
      .clear()
      .type(workStartDate);

    cy.get(`[data-cy="work[0].endDate"]`).should("exist").clear().type(endDate);
    cy.get(`[data-cy="work[0].site"]`).should("exist").clear().type("Site");
    cy.get(`[data-cy="work[0].siteLocation"]`)
      .should("exist")
      .clear()
      .type("Location");
    cy.get(`[data-cy="work[0].siteKnownAs"]`)
      .should("exist")
      .clear()
      .type("siteKnownAs");

    cy.get("#sicknessAbsence").should("exist").clear().type("1");
    cy.get("#paidLeave").should("exist").clear().type("2");
    cy.get("#parentalLeave").should("exist").clear().type("3");
    cy.get("#careerBreaks").should("exist").clear().type("4");
    cy.get("#unauthorisedLeave").should("exist").clear().type("5");
    cy.get("#otherLeave").should("exist").clear().type("6");
    cy.get("#totalLeave").should("have.value", "21");

    cy.get("[data-cy=BtnAddWorkType]").should("exist");
  }
);

// ### SECTION 3: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection3", () => {
  cy.get("[data-cy=legendFieldset3]").should("include.text", "Section 3");
  cy.get("[data-cy=mainWarning3]").should("exist");
  cy.get("[data-cy=declarations]").should("exist");
  cy.get("[data-cy=healthStatement]").should("exist");

  cy.get("[data-cy=isHonest0]")
    .should("exist")
    .should("contain.value", "")
    .check("true");

  cy.get("[data-cy=isHealthy0]")
    .should("exist")
    .should("contain.value", "")
    .check("true");

  cy.get("[data-cy=isWarned0]")
    .should("exist")
    .should("contain.value", "")
    .check("true");

  cy.get("[data-cy=isComplying0]").should("exist").check("true");
  cy.get(".nhsuk-form-group > [data-cy=healthStatement]")
    .should("exist")
    .clear()
    .type("I'm in astonishingly excellent health.");
});

// ### SECTION 4: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection4", (pastDate: string) => {
  cy.get("[data-cy=legendFieldset4]").should("include.text", "Section 4");
  cy.get("[data-cy=mainWarning4]").should("exist");
  cy.get("[data-cy=declarations4]").should("exist");

  cy.get("[data-cy=havePreviousDeclarations1]")
    .should("exist")
    .should("contain.value", "")
    .check("false");

  cy.get("#declarationPanel0").should("not.exist");

  cy.get("[data-cy=havePreviousDeclarations0]")
    .should("exist")
    .should("contain.value", "")
    .check("true");

  // Fill declaration
  cy.get("[data-cy=legendFieldset4]")
    .should("exist")
    .should("include.text", "Section 4");

  //click no previous unresolved declerations and no Previous resolved declarations
  //submit should be enabled

  cy.get("[data-cy=havePreviousDeclarations1]").click();
  cy.get("[data-cy=havePreviousUnresolvedDeclarations1]").click();
  cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
  cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page").click();

  //click yes Previous resolved declarations and no previous unresolved declerations

  cy.get("[data-cy=havePreviousDeclarations0]").click();
  //should not allow navigation to next page and show error
  cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
  cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("exist");

  cy.get('[data-cy="previousDeclarations[0].declarationType"]').should("exist");
  cy.get('[data-cy="previousDeclarations[0].declarationType"]').select(
    "Complaint"
  );
  cy.get('[data-cy="previousDeclarations[0].dateOfEntry"]').click();
  cy.get('[data-cy="previousDeclarations[0].dateOfEntry"]').type("2000-05-28");
  cy.get('[data-cy="previousDeclarations[0].title"]').type("testTitle");
  cy.get("#previousDeclarations[0].title--error-message").should("not.exist");
  cy.get('[data-cy="previousDeclarations[0].locationOfEntry"]').type(
    "testLocation"
  );
  cy.get("[data-cy=havePreviousUnresolvedDeclarations1]").click();
  cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
  cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("not.exist");
  cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page").click();

  //click no Previous resolved declarations and yes revious unresolved declerations
  cy.get("[data-cy=havePreviousDeclarations1]").click();
  cy.get("[data-cy=havePreviousUnresolvedDeclarations0]").click();
  cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("exist");
  cy.get(".nhsuk-form-group > [data-cy=previousDeclarationSummary]").type(
    "test text"
  );
  cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("not.exist");
});

// ### SECTION 5: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection5", (pastDate: string) => {
  cy.get("[data-cy=legendFieldset5]").should("include.text", "Section 5");
  cy.get("[data-cy=mainWarning5]").should("exist");
  cy.get("[data-cy=declarations5]").should("exist");

  cy.get("[data-cy=haveCurrentDeclarations1]").click();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get("[data-cy=haveCurrentUnresolvedDeclarations1]").click();
  cy.get(".nhsuk-error-summary").should("not.exist");

  cy.get("[data-cy=haveCurrentDeclarations0]").click();
  cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
  cy.get(".nhsuk-error-summary").should("exist");
  //fill
  cy.get('[data-cy="currentDeclarations[0].declarationType"]').select(
    "Complaint"
  );
  cy.get('[data-cy="currentDeclarations[0].dateOfEntry"]').click();
  cy.get('[data-cy="currentDeclarations[0].dateOfEntry"]').type("2021-05-28");
  cy.get('[data-cy="currentDeclarations[0].title"]').type("testTitle");
  cy.get('[data-cy="currentDeclarations[0].locationOfEntry"]').type(
    "testLocation"
  );
  cy.get(".nhsuk-error-summary").should("not.exist");

  cy.get("[data-cy=haveCurrentUnresolvedDeclarations0]").click();
  cy.get("[data-cy=LinkToNextSection] > .nhsuk-pagination__page").click();
  cy.get(".nhsuk-error-summary").should("exist");
  cy.get(".nhsuk-form-group > [data-cy=currentDeclarationSummary]").type(
    "test text"
  );
  cy.get(".nhsuk-error-summary").should("not.exist");
});

// ### SECTION 6: CHECK AND FILL
Cypress.Commands.add("checkAndFillSection6", (compliments: string) => {
  cy.get("[data-cy=legendFieldset6]").should("include.text", "Section 6");

  cy.get("[data-cy=compliments]")
    .should("exist")
    .should("contain.value", "")
    .clear()
    .type(compliments);
});

// ### COVID SECTION: CHECK AND FILL

Cypress.Commands.add("checkAndFillCovidSection", () => {
  cy.get("[data-cy=legendFieldsetCovid]").should("include.text", "COVID");
  cy.get("[data-cy='haveCovidDeclarations0']").should("exist").check();
  cy.get("[data-cy='covidForm']").should("exist");
  cy.get("[data-cy='covidDeclarationDto.reasonOfSelfRate']").should(
    "not.exist"
  );
  cy.get("[data-cy=covidErrorSummary").should("not.exist");
  cy.get("[data-cy='covidDeclarationDto.selfRateForCovid0']")
    .should("exist")
    .check();
  cy.get("[data-cy='covidDeclarationDto.reasonOfSelfRate']").should("exist");
  cy.get("[data-cy='covidDeclarationDto.reasonOfSelfRate']").clear();
  cy.get("[data-cy='covidDeclarationDto.reasonOfSelfRate']").type(
    "Covid Training Progress Reason"
  );

  cy.get("[data-cy='covidDeclarationDto.otherInformationForPanel']").should(
    "exist"
  );
  cy.get("[data-cy='covidDeclarationDto.otherInformationForPanel']").clear();
  cy.get("[data-cy='covidDeclarationDto.otherInformationForPanel']").type(
    "Other Covid information"
  );

  cy.get("[data-cy='covidDeclarationDto.discussWithSupervisorChecked0']")
    .should("exist")
    .check();
  cy.get("[data-cy='covidDeclarationDto.discussWithSomeoneChecked0']")
    .should("exist")
    .check();

  cy.get("[data-cy='covidDeclarationDto.haveChangesToPlacement0']")
    .should("exist")
    .check();

  cy.get("[data-cy='covidDeclarationDto.changeCircumstances']")
    .should("exist")
    .select("Other")
    .should("have.value", "Other");
  cy.get("[data-cy='covidDeclarationDto.changeCircumstanceOther']")
    .should("exist")
    .type("Other circumstance of change");
  cy.get("[data-cy='covidDeclarationDto.howPlacementAdjusted']")
    .should("exist")
    .type("How your placement was adjusted");
  cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("not.exist");
});

Cypress.Commands.add("addWorkPanel", (startDate: string, endDate: string) => {
  cy.get("[data-cy=BtnAddWorkType]").click();

  const workPanels = Cypress.$("[data-cy=workPanel]").length;

  cy.get(`[data-cy="work[${workPanels}].typeOfWork"]`)
    .should("exist")
    .clear()
    .type("Type of work");

  cy.get(`[data-cy="work[${workPanels}].trainingPost"]`)
    .should("exist")
    .select("No");

  cy.get(`[data-cy="work[${workPanels}].startDate"]`)
    .should("exist")
    .clear()
    .type(startDate);

  cy.get(`[data-cy="work[${workPanels}].endDate"]`)
    .should("exist")
    .clear()
    .type(endDate);

  cy.get(`[data-cy="work[${workPanels}].site"]`)
    .should("exist")
    .clear()
    .type("Site name");

  cy.get(`[data-cy="work[${workPanels}].siteLocation"]`)
    .should("exist")
    .clear()
    .type("Site location");
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
    !!value && day(value).isValid() && value.toString().indexOf("-") > -1;

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
