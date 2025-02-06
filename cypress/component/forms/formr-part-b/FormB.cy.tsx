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
import { FormProvider } from "../../../../components/forms/form-builder/FormContext";
import { FormRPartB } from "../../../../models/FormRPartB";
import formBJson from "../../../../components/forms/form-builder/form-r/part-b/formB.json";
import { Field } from "../../../../components/forms/form-builder/FormBuilder";

describe("FormB /create (without Covid)", () => {
  let initialFormBData: FormRPartB;
  beforeEach(() => {
    store.dispatch(
      updatedCurriculumOptions(mockedCombinedReference.curriculumOptions)
    );
    store.dispatch(
      updatedReference(transformReferenceData(mockedCombinedReference))
    );
    store.dispatch(updatedPreferredMfa("SMS"));
    initialFormBData = ProfileToFormRPartBInitialValues(
      mockTraineeProfileFormB
    );
    store.dispatch(updatedFormB(initialFormBData));
  });

  it("should render FormB", () => {
    const initialPageFields = formBJson.pages[0].sections.flatMap(
      section => section.fields as Field[]
    );
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b/create"]}>
          <FormProvider
            initialData={initialFormBData}
            initialPageFields={initialPageFields}
            formName="formB"
          >
            <FormB />
          </FormProvider>
        </MemoryRouter>
      </Provider>
    );

    // 1. Personal Details

    // This is just for the component tests ----------
    // default programmeSpecialty value was provided but didn't match dropdown options so isValidOption utils function returns empty string which fires an error
    cy.navNext();
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
    cy.get(".nhsuk-error-summary").should(
      "not.contain",
      "Programme / Training Specialty is required"
    );
    // ----------------------------------------------
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 1 of 10 - Personal Details"
    );
    cy.checkAndFillSection1();
    cy.navNext();

    // 2. Work
    cy.log("#### 2. Work ####");
    cy.checkAndFillSection2();

    cy.get('[data-cy="navPrevious"] > .nhsuk-pagination__page > div').click();
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 1 of 10 - Personal Details"
    );
    cy.navNext();
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 2 of 10 - Whole Scope of Practice: Work"
    );
    cy.navNext();

    // // 3. TOOT
    cy.log("#### 3. TOOT ####");
    cy.checkAndFillSection3();
    cy.get('[data-cy="navPrevious"]').contains("Whole Scope of Practice: Work");
    cy.get('[data-cy="navNext"]')
      .contains("Good Medical Practice: Declarations")
      .click();

    // 4. Declarations relating to Good Medical Practice
    cy.log("#### 4. Declarations relating to Good Medical Practice ####");
    cy.checkAndFillSection4();
    cy.navNext();

    // 5. Good Medical Practice: Health statement
    cy.log("#### 5. Good Medical Practice: Health statement ####");
    cy.checkAndFillSection5();
    cy.navNext();

    // 6. Previous Resolved Declarations
    cy.log("#### 6. Previous Resolved Declarations ####");
    cy.checkAndFillSection6();
    cy.navNext();

    // 7. Previous Unresolved Declarations
    cy.log("#### 7. Previous Unresolved Declarations ####");
    cy.checkAndFillSection7();
    cy.navNext();

    // 8. New Resolved Declarations
    cy.log("#### 8. New Resolved Declarations ####");
    cy.checkAndFillSection8();
    cy.navNext();

    // 9. Current Unresolved Declarations
    cy.log("#### 9. Current Unresolved Declarations ####");
    cy.checkAndFillSection9();
    cy.get('[data-cy="navNext"] > .nhsuk-pagination__page > div')
      .contains("10. Compliments")
      .click();

    // 10. Compliments
    cy.log("#### 10. Compliments ####");
    cy.checkAndFillSection10();
    cy.get('[data-cy="navNext"]').contains("Review & submit").click();
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
    cy.checkElement(
      "formrbInfo",
      "The Form R is a vital aspect of Revalidation (this applies to those holding GMC registration) and you are expected to complete one at the start of a new training programme and ahead of each ARCP."
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
  });

  it("should render FormB with Covid", () => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-b/create"]}>
          <FormB />
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 1 of 11 - Personal Details"
    );
    cy.checkAndFillSection1();
    cy.navNext();
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 2 of 11 - Whole Scope of Practice: Work"
    );
    cy.checkAndFillSection2();
    cy.navNext();
    cy.checkAndFillSection3();
    cy.navNext();
    cy.checkAndFillSection4();
    cy.navNext();
    cy.checkAndFillSection5();
    cy.navNext();
    cy.checkAndFillSection6();
    cy.navNext();
    cy.checkAndFillSection7();
    cy.navNext();
    cy.checkAndFillSection8();
    cy.navNext();
    cy.checkAndFillSection9();
    cy.navNext();
    cy.checkAndFillCovidSection();
    cy.navNext();
    cy.checkAndFillSection10();
    cy.get('[data-cy="navNext"]').contains("Review & submit").click();
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
    cy.get('[data-cy="formrbInfo"]').contains(
      "The Form R is a vital aspect of Revalidation (this applies to those holding GMC registration) and you are expected to complete one at the start of a new training programme and ahead of each ARCP."
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
