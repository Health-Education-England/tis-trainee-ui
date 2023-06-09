/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import FormA from "../../../../components/forms/form-builder/form-r/part-a/FormA";
import history from "../../../../components/navigation/history";
import { updatedFormA } from "../../../../redux/slices/formASlice";
import {
  updatedCurriculumOptions,
  updatedReference
} from "../../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";
import { mockTraineeProfile } from "../../../../mock-data/trainee-profile";
import { ProfileToFormRPartAInitialValues } from "../../../../models/ProfileToFormRPartAInitialValues";
import { transformReferenceData } from "../../../../utilities/FormBuilderUtilities";

// Note - Some manual set-up steps are required as it is a self-contained component test - the initialisation would normally be handled by the in the form load btn click event and reference slice fetchReference thunk.

describe("FormA (form creation)", () => {
  beforeEach(() => {
    store.dispatch(
      updatedCurriculumOptions(mockedCombinedReference.curriculum)
    );
    store.dispatch(
      updatedReference(transformReferenceData(mockedCombinedReference))
    );
  });

  it("should not render the form if no traineeTisId in form data", () => {
    const formADataMinusTisId = { ...mockTraineeProfile, traineeTisId: "" };
    const initialisedFormAData =
      ProfileToFormRPartAInitialValues(formADataMinusTisId);
    store.dispatch(updatedFormA(initialisedFormAData));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormA />
        </Router>
      </Provider>
    );
  });
  it("should render the draft form if traineeTisId", () => {
    const initialisedFormAData =
      ProfileToFormRPartAInitialValues(mockTraineeProfile);
    store.dispatch(updatedFormA(initialisedFormAData));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormA />
        </Router>
      </Provider>
    );

    // Page 1
    cy.get('[data-cy="WarningCallout-FormAImportantNotice-label"] > span')
      .should("exist")
      .should("include.text", "Important");
    cy.get(".nhsuk-warning-callout > p")
      .should("exist")
      .should(
        "include.text",
        "This form has been pre-populated using the information available against your records"
      );
    cy.testDataSourceLink();

    cy.get('[data-cy="progress-header"] > h3').should(
      "contain.text",
      "Part 1 of 3 - Personal Details"
    );

    cy.get('[data-cy="forename-label"]')
      .should("exist")
      .should("include.text", "Forename");
    cy.get('[data-cy="forename-input"]')
      .should("exist")
      .should("have.value", "Anthony Mara");
    cy.get('[data-cy="immigrationStatus-label"]')
      .should("exist")
      .should("include.text", "Immigration Status");

    // test that the name fields grow and shrink with the input size
    cy.get('[data-cy="forename-input"]')
      .clear()
      .type("Terry terry terry terry terry terry");
    cy.get('[data-cy="forename-input"]').should(
      "have.class",
      "nhsuk-input nhsuk-input--width-30"
    );
    cy.get('[data-cy="forename-input"]').clear().type("Terry");
    cy.get('[data-cy="forename-input"]').should(
      "have.class",
      "nhsuk-input nhsuk-input--width-20"
    );

    // test that the whitespace is removed from the text input
    cy.get('[data-cy="surname-input"]').clear().type("  Johnny Boy  ");
    cy.get('[data-cy="progress-header"] > h3').click();
    cy.get('[data-cy="surname-input"]').should("have.value", "Johnny Boy");

    // test AutocompleteSelect
    cy.get(
      '[data-cy="immigrationStatus"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .type("brit")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(".react-select__value-container").contains("British");

    // test datepicker
    cy.get('[data-cy="dateAttained-label"]').should("exist");
    cy.get(
      '[data-cy="dateAttained"] > .react-datepicker-wrapper > .react-datepicker__input-container > .nhsuk-input'
    ).click();
    cy.get(".react-datepicker__year-read-view--down-arrow").click();
    cy.get(".react-datepicker__year-dropdown > :nth-child(2)").click();
    cy.get(":nth-child(1) > .react-datepicker__day--001").click();
    cy.get(
      '[data-cy="dateAttained"] >.react-datepicker-wrapper > .react-datepicker__input-container > .nhsuk-input'
    ).should("have.value", "01/05/2023");

    cy.get('[data-cy="medicalSchool-input"]').clear();
    cy.get('[data-cy="medicalSchool-inline-error-msg"]')
      .should("exist")
      .should(
        "include.text",
        "Medical School Awarding Primary Qualification is required"
      );
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get(
      '[data-cy="error-txt-medicalSchool,Medical School Awarding Primary Qualification is required"]'
    ).should("exist");

    cy.get(
      '[data-cy="error-txt-dateOfBirth,This date is before the minimum date allowed"]'
    ).should("not.exist");
    cy.get('[data-cy="dateOfBirth-inline-error-msg"]').should("not.exist");

    cy.get('[data-cy="medicalSchool-input"]').type("best medical school");
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get('[data-cy="medicalSchool-inline-error-msg"]').should("not.exist");

    // test soft validation
    cy.get('[data-cy="postCode-input"]').should("exist").clear().type("123456");
    cy.get(".field-warning-msg")
      .should("exist")
      .should(
        "have.text",
        "Warning: Non-UK postcode detected. Please ignore if valid."
      );
    cy.get('[data-cy="postCode-inline-error-msg"]').should("not.exist");

    cy.get('[data-cy="BtnContinue"]').click();
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get(
      '[data-cy="error-txt-dateOfBirth,This date is before the minimum date allowed"]'
    ).should("exist");
    cy.get('[data-cy="dateOfBirth-inline-error-msg"]').should("exist");
    cy.get('[data-cy="email-inline-error-msg"]').should("exist");
    cy.get('[data-cy="error-txt-email,Email address is required"]').should(
      "exist"
    );

    cy.get(
      '[data-cy="dateOfBirth"] > .react-datepicker-wrapper > .react-datepicker__input-container > .nhsuk-input'
    )
      .click()
      .clear()
      .type("02/05/2003");
    cy.get('[data-cy="email-input"]').type("a@a.a");
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get('[data-cy="dateOfBirth-inline-error-msg"]').should("not.exist");
    cy.get('[data-cy="email-inline-error-msg"]').should("not.exist");
    cy.get('[data-cy="error-txt-email,Email address is required"]').should(
      "not.exist"
    );
    cy.get('[data-cy="BtnSaveDraft"]').should("exist");
    cy.get('[data-cy="BtnContinue"]').click();

    // Page 2
    cy.get(
      '[data-cy="WarningCallout-FormAImportantNotice-label"] > span'
    ).should("not.exist");
    cy.get('[data-cy="progress-header"] > h3').should(
      "contain.text",
      "Part 2 of 3 - Programme Declarations"
    );

    cy.get(
      '[data-cy="declarationType-I have been appointed to a programme leading to award of CCT-input"]'
    ).click();
    cy.get(
      '[data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    ).should("be.visible");
    cy.get(
      '[data-cy="cctSpecialty2"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    ).should("be.visible");

    cy.get(
      '[data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .type("ana")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(".react-select__value-container").contains("ACCS - Anaesthetics");

    // hide the cctSpecialty fields
    cy.get(
      '[data-cy="declarationType-I will be seeking specialist registration by application for a CESR-input"]'
    ).click();
    cy.get(
      '[data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    ).should("not.exist");
    cy.get(
      '[data-cy="cctSpecialty2"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    ).should("not.exist");
    // unhide the cctSpecialty fields to see if the cct1 value is still there
    cy.get(
      '[data-cy="declarationType-I have been appointed to a programme leading to award of CCT-input"]'
    ).click();
    cy.get(".react-select__value-container").contains("ACCS - Anaesthetics");

    // hidden fields should not be validated
    cy.get(
      '[data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__indicators > .react-select__clear-indicator'
    ).click();
    cy.get('[data-cy="cctSpecialty1-inline-error-msg"]').should("exist");
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get(
      '[data-cy="declarationType-I will be seeking specialist registration by application for a CESR-input"]'
    ).click();
    cy.get(
      '[data-cy="cctSpecialty1"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    ).should("not.exist");
    cy.get(".nhsuk-error-summary").should("not.exist");

    // catch any errors not ttriggered completing the form section
    cy.get('[data-cy="BtnContinue"]').click();
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get(
      '[data-cy="error-txt-completionDate,Anticipated completion date - please choose a future date"]'
    ).should("exist");
    cy.get('[data-cy="completionDate-inline-error-msg"]').should("exist");

    cy.get(
      '[data-cy="completionDate"] > .react-datepicker-wrapper > .react-datepicker__input-container > .nhsuk-input'
    )
      .click()
      .clear()
      .type("20/03/2032");
    // Note - Although a default value for Programme Specialty was provided via the Curriculum data it did not match a select option so was reset to ""
    cy.get('[data-cy="programmeSpecialty-inline-error-msg"]')
      .should("exist")
      .click();
    cy.get('[data-cy="college-inline-error-msg"]').should("exist");
    cy.get(".nhsuk-error-summary").should("exist");

    // test AutocompleteSelect drop-down
    cy.get(
      '[data-cy="programmeSpecialty"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(".react-select__value-container").contains("Geriatric Medicine");

    cy.get(
      '[data-cy="college"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .type("dent")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get('[data-cy="BtnContinue"]').click();

    // Page 3
    cy.get('[data-cy="progress-header"] > h3').should(
      "contain.text",
      "Part 3 of 3 - Programme Details"
    );
    cy.get(
      '[data-cy="WarningCallout-FormAImportantNotice-label"] > span'
    ).should("not.exist");

    // can navigate back to previous section without triggering validation
    cy.get(".nhsuk-grid-row > :nth-child(1) > .nhsuk-back-link").click();
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
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get("b").should(
      "contain.text",
      "Please fix the following errors before proceeding:"
    );
    cy.get(
      '[data-cy="error-txt-wholeTimeEquivalent,Training hours (Full Time Equivalent) needs to be a number less than or equal to 1 and greater than zero (a maximum of 2 decimal places)"]'
    ).should("exist");
    cy.get('[data-cy="wholeTimeEquivalent-input"]').type("1.1");
    cy.get(
      '[data-cy="error-txt-wholeTimeEquivalent,Training hours (Full Time Equivalent) needs to be a number less than or equal to 1 and greater than zero (a maximum of 2 decimal places)"]'
    ).should("exist");
    cy.get('[data-cy="wholeTimeEquivalent-input"]').clear().type("0.5");
    cy.get(
      '[data-cy="trainingGrade"] > .autocomplete-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(".nhsuk-error-summary").should("not.exist");
    // Note - been trying to test if the updated form data is being saved in local storage but couldn't find a way to access this via component test so using e2e test instead.
  });
});
