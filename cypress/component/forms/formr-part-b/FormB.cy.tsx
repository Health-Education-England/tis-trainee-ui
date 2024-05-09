/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react18";
import { MemoryRouter } from "react-router-dom";
import FormB from "../../../../components/forms/form-builder/form-r/part-b/FormRPartB";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import {
  updatedCurriculumOptions,
  updatedReference
} from "../../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";
import { transformReferenceData } from "../../../../utilities/FormBuilderUtilities";
import { updatedPreferredMfa } from "../../../../redux/slices/userSlice";
import {
  defaultCovidObject,
  updatedCanEditB,
  updatedDisplayCovid,
  updatedFormB
} from "../../../../redux/slices/formBSlice";
import { ProfileToFormRPartBInitialValues } from "../../../../models/ProfileToFormRPartBInitialValues";
import {
  mockTraineeProfileFormB,
  mockTraineeProfileFormBCovid
} from "../../../../mock-data/trainee-profile";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";

describe("FormB /create (without Covid)", () => {
  beforeEach(() => {
    store.dispatch(
      updatedCurriculumOptions(mockedCombinedReference.curriculumOptions)
    );
    store.dispatch(
      updatedReference(transformReferenceData(mockedCombinedReference))
    );
    store.dispatch(updatedPreferredMfa("SMS"));
    const initialFormBData = ProfileToFormRPartBInitialValues(
      mockTraineeProfileFormB
    );
    store.dispatch(updatedFormB(initialFormBData));
  });

  it("should render FormB", () => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b/create"]}>
          <FormB />
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="formRBHeading"]')
      .should("exist")
      .contains("Form R (Part B)");
    cy.get('[data-cy="formrbLabel"]')
      .should("exist")
      .contains("Trainee registration for Postgraduate Speciality Training");
    cy.get('[data-cy="WarningCallout-formBImportantNotice-label"] > span')
      .should("exist")
      .contains("Important");
    cy.get(".nhsuk-warning-callout > :nth-child(2) > :nth-child(1)").should(
      "include.text",
      "This form has been pre-populated using the information available against your records"
    );

    cy.get(".nhsuk-details__summary-text").should("exist");

    // 1. Personal Details
    cy.log("#### 1. Personal Details ####");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 1 of 10 - Personal Details"
    );
    cy.get('[data-cy="autosaveNote"]');
    cy.get(".nhsuk-card__heading").contains("Personal Details");

    cy.get(".nhsuk-pagination__title")
      .should("exist")
      .should("include.text", "Next");
    cy.get(".nhsuk-pagination__page > div")
      .contains("Whole Scope of Practice: Work")
      .click();
    cy.get('[data-cy="email-input"]').should(
      "have.class",
      "nhsuk-input nhsuk-input--width-20 nhsuk-input--error"
    );
    cy.get('[data-cy="email-inline-error-msg"]')
      .should("exist")
      .contains("Email is required");
    cy.get(".nhsuk-error-summary")
      .should("exist")
      .contains("Email is required");
    cy.get('[data-cy="currRevalDate-inline-error-msg"]')
      .should("exist")
      .contains("Current Revalidation date has to be on or after today");
    cy.get(".nhsuk-error-summary")
      .should("exist")
      .contains("Current Revalidation date has to be on or after today");
    cy.get('[data-cy="email-input"]').type("bo");
    cy.get('[data-cy="email-inline-error-msg"]')
      .should("exist")
      .contains("Email address is invalid");
    cy.get(".nhsuk-error-summary")
      .should("exist")
      .contains("Email address is invalid");
    cy.clearAndType('[data-cy="email-input"]', "b@b.bob");
    cy.get('[data-cy="email-inline-error-msg"]').should("not.exist");
    cy.get(".nhsuk-error-summary").should("not.contain", "Email is required");
    cy.clearAndType('[data-cy="currRevalDate-input"]', "2040-01-01");
    // default programmeSpecialty value was provided but didn't match dropdown options so isValidOption utils function returns empty string which fires an error
    cy.get('[data-cy="programmeSpecialty-inline-error-msg"]').should("exist");
    cy.get(".nhsuk-error-summary")
      .should("exist")
      .contains("Programme / Training Specialty is required");
    cy.get('[data-cy="navNext"]').should(
      "have.class",
      "nhsuk-pagination__link nhsuk-pagination__link--next disabled-link"
    );
    cy.clickSelect('[data-cy="programmeSpecialty"]', null, true);
    cy.get(".react-select__value-container").contains("ACCS Anaesthetics");
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get('[data-cy="navNext"]')
      .should(
        "have.class",
        "nhsuk-pagination__link nhsuk-pagination__link--next"
      )
      .contains("Whole Scope of Practice: Work")
      .click();

    // 2. Work
    cy.log("#### 2. Work ####");
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 2 of 10 - Whole Scope of Practice: Work"
    );
    cy.get(".nhsuk-card__heading").contains("Type of Work");
    cy.get(".nhsuk-error-summary").should("not.exist");

    // fire any errors on navigation
    cy.navNext();
    cy.get(".nhsuk-error-summary")
      .should("exist")
      .contains(
        "Before proceeding to the next section please address the following:"
      );
    cy.get(
      ".error-summary_li > :nth-child(1) > :nth-child(1) > :nth-child(1) > b"
    ).contains("Work 1");
    cy.get(
      ':nth-child(1) > :nth-child(2) > ul > [data-cy="error-txt-Training Post is required"]'
    ).should("exist");
    cy.get(":nth-child(2) > :nth-child(1) > b").contains("Work 2");
    cy.get(
      ':nth-child(2) > :nth-child(2) > ul > [data-cy="error-txt-Training Post is required"]'
    );
    cy.get(
      ':nth-child(1) > .nhsuk-card__content > :nth-child(3) > [data-cy="trainingPost"] > [data-cy="trainingPost-inline-error-msg"]'
    ).should("exist");
    cy.get(
      ':nth-child(2) > .nhsuk-card__content > :nth-child(3) > [data-cy="trainingPost"] > [data-cy="trainingPost-inline-error-msg"]'
    ).should("exist");

    // remove panel errors
    cy.clickSelect(
      ':nth-child(1) > .nhsuk-card__content > :nth-child(3) > [data-cy="trainingPost"]',
      null,
      true
    );
    cy.get(".react-select__value-container").contains("Yes");
    cy.get(
      ':nth-child(1) > .nhsuk-card__content > :nth-child(3) > [data-cy="trainingPost"] > [data-cy="trainingPost-inline-error-msg"]'
    ).should("not.exist");
    cy.clickSelect(
      ':nth-child(2) > .nhsuk-card__content > :nth-child(3) > [data-cy="trainingPost"]',
      null,
      false
    );
    cy.get(".react-select__value-container").contains("No");
    cy.get(
      ':nth-child(2) > .nhsuk-card__content > :nth-child(3) > [data-cy="trainingPost"] > [data-cy="trainingPost-inline-error-msg"]'
    ).should("not.exist");
    cy.get(".nhsuk-error-summary").should("not.exist");

    // add another work
    cy.get('[data-cy="add-Work-button"]').should("exist").click();
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get(".error-summary_li_nested > :nth-child(1) > b").contains("Work 3");

    cy.checkElement("error-txt-Type of Work is required");
    cy.checkElement("typeOfWork-inline-error-msg", "Type of Work is required");
    cy.checkElement("error-txt-Start date must be a valid date");
    cy.checkElement(
      "startDate-inline-error-msg",
      "Start date must be a valid date"
    );
    cy.checkElement("error-txt-End date must be a valid date");
    cy.checkElement(
      "endDate-inline-error-msg",
      "End date must be a valid date"
    );
    cy.checkElement("error-txt-Training Post is required");
    cy.checkElement(
      "trainingPost-inline-error-msg",
      "Training Post is required"
    );
    cy.checkElement("error-txt-Site Location is required");
    cy.checkElement("error-txt-Site Name is required");
    cy.checkElement("error-txt-Site Known As is required", null, false);
    cy.checkElement("site-inline-error-msg", "Site Name is required");
    cy.checkElement(
      "siteLocation-inline-error-msg",
      "Site Location is required"
    );
    cy.checkElement("typeOfWork-inline-error-msg", "Type of Work is required");

    // remove this blank work panel (Work 3)
    cy.get('[data-cy="remove-Work-3-button"]').should("exist").click();
    cy.get(".nhsuk-error-summary").should("not.exist");

    // add another work
    cy.checkElement("add-Work-button").click();
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get('[data-cy="typeOfWork-input"]').last().type("another work");
    cy.checkElement("typeOfWork-inline-error-msg", null, false);
    cy.get(
      '[data-cy="trainingPost"]> .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .last()
      .click()
      .type("y")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();

    cy.checkElement("trainingPost-inline-error-msg", null, false);
    cy.clearAndType('[data-cy="startDate-input"]:last', "2027-01-01");
    cy.checkElement("startDate-inline-error-msg", null, false);
    cy.clearAndType('[data-cy="endDate-input"]:last', "2026-01-02");
    cy.checkElement(
      "endDate-inline-error-msg",
      "End date must be later than Start date"
    );
    cy.clearAndType('[data-cy="endDate-input"]:last', "2027-01-02");
    cy.checkElement("endDate-inline-error-msg", null, false);
    cy.clearAndType('[data-cy="site-input"]:last', "another site");
    cy.checkElement("site-inline-error-msg", null, false);
    cy.get(".nhsuk-error-summary").should("exist");
    cy.clearAndType('[data-cy="siteLocation-input"]:last', "another site loc");
    cy.checkElement("siteLocation-inline-error-msg", null, false);
    cy.get('[data-cy="siteKnownAs-input"]:last')
      .should("exist")
      .should("be.empty");
    cy.get(".nhsuk-error-summary").should("not.exist");

    // remove 2nd work panel
    cy.checkElement("remove-Work-2-button").click();
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get(
      ':nth-child(1) > .nhsuk-card__content > :nth-child(2) > [data-cy="typeOfWork-input"]'
    )
      .should("exist")
      .should("have.value", "placementType3 grade3 specialty3");
    cy.get(
      ':nth-child(2) > .nhsuk-card__content > :nth-child(2) > [data-cy="typeOfWork-input"]'
    )
      .should("exist")
      .should("have.value", "another work");
    cy.get(
      ':nth-child(3) > .nhsuk-card__content > :nth-child(2) > [data-cy="typeOfWork-input"]'
    ).should("not.exist");
    cy.get('[data-cy="navPrevious"] > .nhsuk-pagination__page > div').click();
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 1 of 10 - Personal Details"
    );
    cy.navNext();
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 2 of 10 - Whole Scope of Practice: Work"
    );
    cy.navNext();

    // 3. TOOT
    cy.log("#### 3. TOOT ####");
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 3 of 10 - Whole Scope of Practice: Time Out Of Training (TOOT)"
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
    cy.clearAndType('[data-cy="sicknessAbsence-input"]', "0");
    cy.checkElement("totalLeave-inline-error-msg", null, false);

    cy.get('[data-cy="navPrevious"]').contains("Whole Scope of Practice: Work");
    cy.get('[data-cy="navNext"]')
      .contains("Good Medical Practice: Declarations")
      .click();

    // 4. Declarations relating to Good Medical Practice
    cy.log("#### 4. Declarations relating to Good Medical Practice ####");
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 4 of 10 - Good Medical Practice: Declarations"
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
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 3 of 10 - Whole Scope of Practice: Time Out Of Training (TOOT)"
    );
    cy.navNext();
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 4 of 10 - Good Medical Practice: Declarations"
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
    cy.navNext();

    // 5. Good Medical Practice: Health statement
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 5 of 10 - Good Medical Practice: Health Statement"
    );
    cy.get(".nhsuk-card__heading").contains(
      "Health Statement (not compulsory)"
    );
    cy.checkElement("healthStatement-text-area-input");
    cy.navNext();

    // 6. Previous Resolved Declarations
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
    cy.get('[data-cy="error-txt-Declaration type is required"]').should(
      "exist"
    );
    cy.get('[data-cy="remove-Previous Declarations-1-button"]')
      .should("exist")
      .click();
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get(
      '[data-cy="error-txt-At least one Previous Declaration is required"]'
    ).should("exist");
    cy.get('[data-cy="havePreviousDeclarations-No-input"]').click();
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.navNext();

    // 7. Previous Unresolved Declarations
    cy.log("#### 7. Previous Unresolved Declarations ####");
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 7 of 10 - Summary of previous unresolved Form R Declarations"
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
    cy.navNext();

    // 8. New Resolved Declarations
    cy.log("#### 8. New Resolved Declarations ####");
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 8 of 10 - Summary of new resolved Form R Declarations"
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
    cy.get('[data-cy="error-txt-Declaration type is required"]').should(
      "exist"
    );
    cy.get('[data-cy="declarationType-inline-error-msg"]').should("exist");
    cy.get('[data-cy="error-txt-Date of entry must be a valid date"]').should(
      "exist"
    );
    cy.get('[data-cy="dateOfEntry-inline-error-msg"]').should("exist");
    cy.get('[data-cy="error-txt-Title is required"]').should("exist");
    cy.get('[data-cy="title-inline-error-msg"]').should("exist");
    cy.get('[data-cy="error-txt-Location of entry is required"]').should(
      "exist"
    );
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
    cy.get('[data-cy="locationOfEntry-input"]').should(
      "have.value",
      "dec 2 loc"
    );
    cy.get('[data-cy="navNext"]').click();

    // 9. Current Unresolved Declarations
    cy.log("#### 9. Current Unresolved Declarations ####");
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.checkElement(
      "progress-header",
      "Part 9 of 10 - Summary of new unresolved Form R Declarations"
    );
    cy.get(".nhsuk-card__heading").contains("Unresolved Declarations (new)");
    cy.get('[data-cy="haveCurrentUnresolvedDeclarations-No-input"]').click();
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get('[data-cy="navNext"] > .nhsuk-pagination__page > div')
      .contains("10. Compliments")
      .click();

    // 10. Compliments
    cy.log("#### 10. Compliments ####");
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.checkElement("progress-header", "Part 10 of 10 - Compliments");
    cy.get(".nhsuk-card__heading").contains("Compliments (Not compulsory)");
    cy.clearAndType(
      '[data-cy="compliments-text-area-input"]',
      "temp compliment"
    );
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.checkElement("BtnSaveDraft");
    cy.get('[data-cy="BtnSaveDraft"]').should("exist");
    cy.get('[data-cy="BtnShortcutToConfirm"]').should("not.exist");
    cy.get('[data-cy="navNext"] > .nhsuk-pagination__page')
      .contains("Review & submit")
      .click();
    // Note this is a bit of a fudge as we cannot navigate to the Confirm page and return to the form
    cy.get('[data-cy="BtnShortcutToConfirm"]').should("exist");
  });
});

describe("FormB /confirm (without Covid)", () => {
  beforeEach(() => {
    store.dispatch(
      updatedCurriculumOptions(mockedCombinedReference.curriculum)
    );
    store.dispatch(
      updatedReference(transformReferenceData(mockedCombinedReference))
    );
    store.dispatch(updatedCanEditB(true));
    store.dispatch(updatedPreferredMfa("SMS"));
    store.dispatch(
      updatedFormB({ ...submittedFormRPartBs[0], currRevalDate: "2027-01-01" })
    );
  });
  it("should render FormB Confirm page to edit", () => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b/confirm"]}>
          <FormB />
        </MemoryRouter>
      </Provider>
    );
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.checkElement(
      "formrbLabel",
      "Trainee registration for Postgraduate Speciality Training"
    );

    cy.get(
      '[data-cy="warningConfirmation"] > .nhsuk-warning-callout__label > span'
    )
      .should("exist")
      .should("include.text", "Confirmation");
    cy.get('[data-cy="warningConfirmation"] > p')
      .should("exist")
      .should(
        "include.text",
        "Please check the information entered below is correct, agree to the\n            Declarations at the bottom of the page, and then click 'Submit\n            Form'."
      );
    cy.get('[data-cy="edit-Personal Details"]').should("exist");
    cy.get(
      ":nth-child(2) > .nhsuk-card--feature > .nhsuk-card__content--feature > .nhsuk-card__heading"
    )
      .should("exist")
      .contains("Whole Scope of Practice: Work");
    cy.get(
      '[data-cy="work-value"] > :nth-child(1) > .nhsuk-card__content > :nth-child(2) > .nhsuk-grid-row > :nth-child(2)'
    ).should("have.text", "01/01/2020");
  });
});

describe("FormB /create (with Covid)", () => {
  beforeEach(() => {
    store.dispatch(
      updatedCurriculumOptions(mockedCombinedReference.curriculumOptions)
    );
    store.dispatch(
      updatedReference(transformReferenceData(mockedCombinedReference))
    );
    store.dispatch(updatedPreferredMfa("SMS"));
    const initialFormBData = ProfileToFormRPartBInitialValues(
      mockTraineeProfileFormBCovid
    );
    // Bit of a hack to get the Covid object in the store
    // See FormB redux slice loadSavedFormB reducer for the logic
    store.dispatch(
      updatedFormB({
        ...initialFormBData,
        covidDeclarationDto: defaultCovidObject
      })
    );
    store.dispatch(updatedDisplayCovid(true));
    store.dispatch(updatedCanEditB(false));

    cy.log("initialFormBData", initialFormBData);
  });

  it("should render FormB with Covid", () => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b/create"]}>
          <FormB />
        </MemoryRouter>
      </Provider>
    );
    // 1. Personal Details
    cy.log("#### 1. Personal Details (Covid) ####");
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="progress-header"] > :nth-child(1)').contains(
      "Part 1 of 11 - Personal Details"
    );
    cy.get('[data-cy="email-input"]').type("a@a.a");
    cy.clickSelect('[data-cy="programmeSpecialty"]');
    cy.navNext();
    // 2. Work
    cy.log("#### 2. Work (Covid) ####");
    cy.get('[data-cy="remove-Work-2-button"]').click();
    cy.clickSelect('[data-cy="trainingPost"]');
    cy.navNext();
    // 3. TOOT
    cy.log("#### 3. TOOT (Covid) ####");
    cy.get('[data-cy="navNext"]').click();
    // 4. Good Medical Practice: Declarations
    cy.log("#### 4. Good Medical Practice: Declarations (Covid) ####");
    cy.get('[data-cy="isHonest-checkbox"]').check();
    cy.get('[data-cy="isHealthy-checkbox"]').check();
    cy.get('[data-cy="isWarned-No-input"]').click();
    cy.get('[data-cy="navNext"]').click();
    // 5. Good Medical Practice: Health statement
    cy.log("#### 5. Good Medical Practice: Health statement (Covid) ####");
    cy.get('[data-cy="healthStatement-text-area-input"]').type(
      "I support Everton FC for my sins"
    );
    cy.navNext();
    // 6. Previous Resolved Declarations
    cy.log("#### 6. Previous Resolved Declarations (Covid) ####");
    cy.get(".nhsuk-details__summary-text").contains(
      "Declaration types explained"
    );
    cy.get('[data-cy="havePreviousDeclarations-No-input"]').click();
    cy.navNext();
    // 7. Previous Unresolved Declarations
    cy.log("#### 7. Previous Unresolved Declarations (Covid) ####");
    cy.get(".nhsuk-details__summary-text").contains(
      "Declaration types explained"
    );
    cy.get('[data-cy="havePreviousUnresolvedDeclarations-No-input"]')
      .should("exist")
      .click();
    cy.navNext();
    // 8. New Resolved Declarations
    cy.log("#### 8. New Resolved Declarations (Covid) ####");
    cy.get('[data-cy="haveCurrentDeclarations-No-input"]').click();
    cy.navNext();
    // 9. Current Unresolved Declarations
    cy.log("#### 9. Current Unresolved Declarations (Covid) ####");
    cy.get('[data-cy="haveCurrentUnresolvedDeclarations-No-input"]').click();
    cy.navNext();

    // 10. Covid Declaration & self-assessment
    cy.log("#### 10. Covid Declaration & self-assessment (Covid) ####");
    cy.get(".nhsuk-details__summary-text").should("not.exist");
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 10 of 11 - COVID 19 self-assessment & declarations"
    );
    cy.get('[data-cy="haveCovidDeclarations-Yes-input"]').click();
    cy.get(".nhsuk-error-summary").should("exist");

    const selectors = [
      "error-txt-Self-rating your own preformance is required",
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
    cy.navNext();

    // 11. Compliments
    cy.log("#### 11. Compliments (Covid) ####");
    cy.clearAndType(
      '[data-cy="compliments-text-area-input"]',
      "a really nice compliment"
    );

    cy.checkElement("BtnShortcutToConfirm", null, false);
    cy.checkElement("BtnSaveDraft");

    cy.get('[data-cy="navNext"] > .nhsuk-pagination__page')
      .contains("Review & submit")
      .click();

    cy.checkElement("BtnShortcutToConfirm");
  });
});

describe("FormB /confirm (with Covid)", () => {
  beforeEach(() => {
    store.dispatch(
      updatedCurriculumOptions(mockedCombinedReference.curriculum)
    );
    store.dispatch(
      updatedReference(transformReferenceData(mockedCombinedReference))
    );
    store.dispatch(updatedCanEditB(true));
    store.dispatch(updatedPreferredMfa("SMS"));
    store.dispatch(updatedDisplayCovid(true));

    const mockConfirmDataFormB = {
      ...submittedFormRPartBs[0],
      currRevalDate: "2027-01-01",
      haveCovidDeclarations: true,
      covidDeclarationDto: {
        selfRateForCovid:
          "Below expectations for stage of training - needs further development",
        reasonOfSelfRate: "Felt bad",
        discussWithSupervisorChecked: false,
        discussWithSomeoneChecked: true,
        haveChangesToPlacement: true,
        changeCircumstances: "Other",
        changeCircumstanceOther: "Other change",
        howPlacementAdjusted: "Adjusted",
        otherInformationForPanel: "Nothing more to say",
        educationSupervisorName: "",
        educationSupervisorEmail: ""
      }
    };

    store.dispatch(updatedFormB(mockConfirmDataFormB));
    cy.log("mockConfirmDataFormB...", mockConfirmDataFormB);
  });

  it("should render FormB Confirm page to edit", () => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b/confirm"]}>
          <FormB />
        </MemoryRouter>
      </Provider>
    );
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="formrbLabel"]').contains(
      "Trainee registration for Postgraduate Speciality Training"
    );
    cy.get(
      '[data-cy="warningConfirmation"] > .nhsuk-warning-callout__label > span'
    )
      .should("exist")
      .should("include.text", "Confirmation");
    cy.get('[data-cy="warningConfirmation"] > p')
      .should("exist")
      .should(
        "include.text",
        "Please check the information entered below is correct, agree to the\n            Declarations at the bottom of the page, and then click 'Submit\n            Form'."
      );

    // check some default sections
    cy.get(
      ":nth-child(1) > .nhsuk-card > .nhsuk-card__content > .nhsuk-card__heading"
    ).contains("Personal Details");
    cy.checkElement("edit-Personal Details");

    cy.get('[data-cy="forename-label"]').contains("Forename");
    cy.get('[data-cy="forename-value"]')
      .should("exist")
      .should("have.text", "Anthony Mara");

    cy.get(
      ":nth-child(2) > .nhsuk-card--feature > .nhsuk-card__content--feature > .nhsuk-card__heading"
    ).contains("Whole Scope of Practice: Work");
    cy.get('[data-cy="edit-Type of Work"]').should("exist");
    cy.get('[data-cy="work-label"]').contains("Type of Work");
    cy.get(
      '[data-cy="work-value"] > :nth-child(1) > .nhsuk-card__content > :nth-child(3) > .nhsuk-grid-row > :nth-child(2)'
    ).should("have.text", "31/12/2020");
    cy.get(
      ":nth-child(2) > .nhsuk-card__content > :nth-child(2) > .nhsuk-grid-row > :nth-child(2)"
    ).should("have.text", "12/01/2019");

    cy.get(
      ":nth-child(3) > .nhsuk-card > .nhsuk-card__content > .nhsuk-card__heading"
    ).contains("Whole Scope of Practice: Time Out Of Training (TOOT)");
    cy.get('[data-cy="unauthorisedLeave-value"]').should("have.text", "10");
    cy.get('[data-cy="totalLeave-value"]').should("have.text", "10");

    cy.get(
      ":nth-child(4) > .nhsuk-card > .nhsuk-card__content > .nhsuk-card__heading"
    ).contains("Good Medical Practice: Declarations");
    cy.get('[data-cy="isHonest-value"]').should("have.text", "Yes");
    cy.get('[data-cy="edit-Declarations"]').should("exist");

    cy.get(
      ":nth-child(5) > .nhsuk-card > .nhsuk-card__content > .nhsuk-card__heading"
    ).contains("Good Medical Practice: Health Statement");
    cy.get('[data-cy="healthStatement-value"]').should(
      "have.text",
      "I feel great etc."
    );

    cy.get(
      ":nth-child(6) > .nhsuk-card--feature > .nhsuk-card__content--feature > .nhsuk-card__heading"
    ).contains("Summary of previous resolved Form R Declarations");
    cy.get('[data-cy="previousDeclarations-label"]').contains(
      "Previous Resolved Declarations"
    );
    cy.get(
      '[data-cy="previousDeclarations-value"] > .nhsuk-card > .nhsuk-card__content > :nth-child(1) > .nhsuk-grid-row > :nth-child(2)'
    ).should("have.text", "Significant Event");
    cy.get(
      ":nth-child(7) > .nhsuk-card > .nhsuk-card__content > .nhsuk-card__heading"
    ).contains("Summary of previous unresolved Form R Declarations");
    cy.get('[data-cy="havePreviousUnresolvedDeclarations-value"]').should(
      "have.text",
      "No"
    );

    cy.get('[data-cy="currentDeclarations-label"]').contains(
      "Current Resolved Declarations"
    );
    cy.get(
      '[data-cy="currentDeclarations-value"] > .nhsuk-card > .nhsuk-card__content > :nth-child(1) > .nhsuk-grid-row > :nth-child(2)'
    ).should("have.text", "Complaint");

    cy.get('[data-cy="edit-Unresolved Declarations (new)"]').should("exist");
    cy.get('[data-cy="haveCurrentUnresolvedDeclarations-value"]').should(
      "have.text",
      "No"
    );

    cy.get(
      ":nth-child(11) > .nhsuk-card > .nhsuk-card__content > .nhsuk-card__heading"
    ).contains("Compliments");
    cy.get('[data-cy="compliments-value"]').should("have.text", "Not provided");

    // check for Covid section
    cy.checkViewFields([
      ["haveCovidDeclarations", "Yes"],
      [
        "selfRateForCovid",
        "Below expectations for stage of training - needs further development"
      ],
      ["reasonOfSelfRate", "Felt bad"],
      ["discussWithSupervisorChecked", "No"],
      ["discussWithSomeoneChecked", "Yes"],
      ["changeCircumstances", "Other"],
      ["changeCircumstanceOther", "Other change"],
      ["howPlacementAdjusted", "Adjusted"],
      ["educationSupervisorName", "Not provided"],
      ["educationSupervisorEmail", "Not provided"]
    ]);
  });
});
