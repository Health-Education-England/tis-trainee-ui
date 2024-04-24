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

    // 1. Personal Details
    cy.checkAndFillFormBSection1();
    cy.navNext();
    // 2. Work
    cy.checkAndFillFormBSection2();
    cy.navNext();
    // 3. TOOT
    cy.checkAndFillFormBSection3();
    cy.navNext();
    // 4. Declarations relating to Good Medical Practice
    cy.checkAndFillFormBSection4();
    cy.navNext();
    // 5. Good Medical Practice: Health statement
    cy.checkAndFillFormBSection5();
    cy.navNext();
    // 6. Previous Resolved Declarations
    cy.checkAndFillFormBSection6();
    cy.navNext();
    // 7. Previous Unresolved Declarations
    cy.checkAndFillFormBSection7();
    cy.navNext();
    // 8. New Resolved Declarations
    cy.checkAndFillFormBSection8();
    cy.navNext();
    // 9. Current Unresolved Declarations
    cy.checkAndFillFormBSection9();
    cy.navNext();
    // 10. Compliments
    cy.checkAndFillFormBSection10();
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
    // check rendered form fields
    // Card headings
    const cardHeadings = {
      1: "Personal Details",
      2: "Whole Scope of Practice: Work",
      3: "Whole Scope of Practice: Time Out Of Training (TOOT)",
      4: "Good Medical Practice: Declarations",
      5: "Good Medical Practice: Health Statement",
      6: "Summary of previous resolved Form R Declarations",
      7: "Summary of previous unresolved Form R Declarations",
      8: "Summary of new resolved Form R Declarations",
      9: "Summary of new unresolved Form R Declarations",
      10: "Compliments"
    };

    Object.entries(cardHeadings).forEach(([key, value]) => {
      cy.get(
        `:nth-child(${key}) > .nhsuk-card > .nhsuk-card__content > .nhsuk-card__heading`
      ).contains(value);
    });

    // section edit buttons
    const sectionEditButtons = {
      1: "edit-Personal Details",
      2: "edit-Type of Work",
      3: "edit-TOOT days (round up to the nearest whole day)",
      4: "edit-Declarations",
      5: "edit-Health Statement (not compulsory)",
      6: "edit-Resolved Declarations (declared on previous Form R)",
      7: "edit-Unresolved Declarations (declared on previous Form R)",
      8: "edit-Resolved Declarations (new)",
      9: "edit-Unresolved Declarations (new)",
      10: "edit-Compliments (Not compulsory)"
    };

    Object.entries(sectionEditButtons).forEach(([key, value]) => {
      cy.get(`[data-cy="${value}"]`)
        .should("exist")
        .should("have.text", "Edit Section");
    });

    // section values
    // 1. Personal Details

    const pdFields = [
      // pd
      ["forename", "Anthony Mara"],
      ["surname", "Gilliam"],
      ["gmcNumber", "11111111"],
      ["email", "email@email.com"],
      ["localOfficeName", "Health Education England Thames Valley"],
      ["prevRevalBody", "Health Education England Midlands"],
      ["currRevalDate", "01/01/2027"],
      ["prevRevalDate", "22/04/2020"],
      ["programmeSpecialty", "ST3"],
      ["dualSpecialty", "DS"]
    ];

    cy.checkViewFields(pdFields);

    // 2. Work
    //work section title
    cy.get('[data-cy="work-label"]')
      .should("exist")
      .should("have.text", "Type of Work");

    // labels
    const workPanelLabels = [
      { 1: "Type Of Work" },
      { 2: "Start Date" },
      { 3: "End Date" },
      { 4: "Training Post" },
      { 5: "Site" },
      { 6: "Site Location" },
      { 7: "Site Known As" }
    ];

    cy.checkPanelElement(1, workPanelLabels, "work", "label");
    cy.checkPanelElement(2, workPanelLabels, "work", "label");

    // values
    const work1Values = [
      { 1: "In Post ST1 Dermatology" },
      { 2: "01/01/2020" },
      { 3: "31/12/2020" },
      { 4: "Yes" },
      { 5: "Addenbrookes Hospital" },
      { 6: "Hills Road Cambridge Cambridgeshire" },
      { 7: "Addenbrookes Hospital (code)" }
    ];

    const work2Values = [
      { 1: "In Post ST1 Dermatology" },
      { 2: "12/01/2019" },
      { 3: "21/12/2019" },
      { 4: "Yes" },
      { 5: "Addenbrookes Hospital" },
      { 6: "Hills Road Cambridge Cambridgeshire" },
      { 7: "Addenbrookes Hospital (code)" }
    ];
    cy.checkPanelElement(1, work1Values, "work", "value");
    cy.checkPanelElement(2, work2Values, "work", "value");

    // 3. TOOT
    const tootFields = [
      ["sicknessAbsence", "0"],
      ["parentalLeave", "0"],
      ["careerBreaks", "0"],
      ["paidLeave", "0"],
      ["unauthorisedLeave", "10"],
      ["otherLeave", "0"],
      ["totalLeave", "10"]
    ];
    cy.checkViewFields(tootFields);

    // 4. Good Medical Practice: Declarations
    const gmpDecFields = [
      ["isHonest", "Yes"],
      ["isHealthy", "Yes"],
      ["isWarned", "Yes"],
      ["isComplying", "Yes"]
    ];
    cy.checkViewFields(gmpDecFields);

    // 5. Good Medical Practice: Health statement
    const gmpHealthFields = [["healthStatement", "I feel great etc."]];
    cy.checkViewFields(gmpHealthFields);

    // 6. Previous Resolved Declarations
    const prevResLabels = [
      { 1: "Declaration Type" },
      { 2: "Date Of Entry" },
      { 3: "Title" },
      { 4: "Location Of Entry" }
    ];

    const prevResValues = [
      { 1: "Significant Event" },
      { 2: "07/03/2020" },
      { 3: "Previous declaration title" },
      { 4: "Previous declaration location of entry" }
    ];

    cy.checkPanelElement(1, prevResLabels, "previousDeclarations", "label");
    cy.checkPanelElement(1, prevResValues, "previousDeclarations", "value");

    // 7. Previous Unresolved Declarations
    const prevUnresFields = [["havePreviousUnresolvedDeclarations", "No"]];
    cy.checkViewFields(prevUnresFields);

    // 8. New Resolved Declarations
    const newResLabels = prevResLabels;
    const newResValues = [
      { 1: "Complaint" },
      { 2: "12/06/2020" },
      { 3: "Current declaration title" },
      { 4: "Current declaration location of entry" }
    ];
    cy.checkPanelElement(1, newResLabels, "currentDeclarations", "label");
    cy.checkPanelElement(1, newResValues, "currentDeclarations", "value");

    // 9. Current Unresolved Declarations
    const newUnresFields = [["haveCurrentUnresolvedDeclarations", "No"]];
    cy.checkViewFields(newUnresFields);

    // 10. Compliments
    const complimentsFields = [["compliments", "Not provided"]];
    cy.checkViewFields(complimentsFields);

    // Declarations
    cy.doDeclarationsFormB();
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
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="progress-header"] > :nth-child(1)').contains(
      "Part 1 of 11 - Personal Details"
    );
    cy.get('[data-cy="email-input"]').type("a@a.a");
    cy.clickSelect('[data-cy="programmeSpecialty"]', null, true);
    cy.navNext();
    // 2. Work
    cy.get('[data-cy="remove-Work-2-button"]').click();
    cy.clickSelect('[data-cy="trainingPost"]', null, true);
    cy.get('[data-cy="navNext"]').click();
    // 3. TOOT
    cy.navNext();
    // 4. Good Medical Practice: Declarations
    cy.get('[data-cy="isHonest-checkbox"]').check();
    cy.get('[data-cy="isHealthy-checkbox"]').check();
    cy.get('[data-cy="isWarned-No-input"]').click();
    cy.navNext();
    // 5. Good Medical Practice: Health statement
    cy.get('[data-cy="healthStatement-text-area-input"]').type(
      "I support Everton FC"
    );
    cy.navNext();
    // 6. Previous Resolved Declarations
    cy.get(".nhsuk-details__summary-text").contains(
      "Declaration types explained"
    );
    cy.get('[data-cy="havePreviousDeclarations-No-input"]').click();
    cy.navNext();
    // 7. Previous Unresolved Declarations
    cy.get(".nhsuk-details__summary-text").contains(
      "Declaration types explained"
    );
    cy.get('[data-cy="havePreviousUnresolvedDeclarations-No-input"]')
      .should("exist")
      .click();
    cy.navNext();
    // 8. New Resolved Declarations
    cy.get('[data-cy="haveCurrentDeclarations-No-input"]').click();
    cy.navNext();
    // 9. Current Unresolved Declarations
    cy.get('[data-cy="haveCurrentUnresolvedDeclarations-No-input"]').click();
    cy.navNext();
    // 10. Covid Declaration & self-assessment
    cy.get(".nhsuk-details__summary-text").should("not.exist");
    cy.get(".nhsuk-fieldset__heading").contains("Form R (Part B)");
    cy.get('[data-cy="progress-header"] > h3').contains(
      "Part 10 of 11 - COVID 19 self-assessment & declarations"
    );
    cy.get('[data-cy="haveCovidDeclarations-Yes-input"]').click();
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get(
      '[data-cy="error-txt-Self-rating your own preformance is required"]'
    ).should("exist");
    cy.get('[data-cy="selfRateForCovid-inline-error-msg"]').should("exist");
    cy.get(
      '[data-cy="error-txt-Please select yes or no to discuss with supervisor"]'
    ).should("exist");
    cy.get('[data-cy="discussWithSupervisorChecked-inline-error-msg"]');
    cy.get(
      '[data-cy="error-txt-Please select yes or no to discuss with someone"]'
    ).should("exist");
    cy.get('[data-cy="discussWithSomeoneChecked-inline-error-msg"]').should(
      "exist"
    );
    cy.get(
      '[data-cy="error-txt-Please select yes or no to changes made to placement"]'
    ).should("exist");
    cy.get('[data-cy="haveChangesToPlacement-inline-error-msg"]').should(
      "exist"
    );

    cy.get('[data-cy="haveChangesToPlacement-Yes-input"]').click();
    cy.get('[data-cy="haveChangesToPlacement-inline-error-msg"]').should(
      "not.exist"
    );
    cy.get('[data-cy="changeCircumstances-inline-error-msg"]').should("exist");
    cy.get('[data-cy="error-txt-Circumstance of change is required"]').should(
      "exist"
    );
    cy.get('[data-cy="howPlacementAdjusted-inline-error-msg"]').should("exist");
    cy.get(
      '[data-cy="error-txt-How your placement was adjusted is required"]'
    ).should("exist");

    cy.get('[data-cy="haveChangesToPlacement-No-input"]').click();
    cy.get('[data-cy="changeCircumstances-inline-error-msg"]').should(
      "not.exist"
    );
    cy.get('[data-cy="howPlacementAdjusted-inline-error-msg"]').should(
      "not.exist"
    );

    cy.get('[data-cy="haveChangesToPlacement-Yes-input"]').click();
    cy.clickSelect('[data-cy="changeCircumstances"]', "Oth", true);
    cy.get('[data-cy="changeCircumstanceOther-inline-error-msg"]').should(
      "exist"
    );
    cy.clickSelect('[data-cy="selfRateForCovid"]', null, false);
    cy.get('[data-cy="reasonOfSelfRate-inline-error-msg"]').should("not.exist");
    cy.get('[data-cy="reasonOfSelfRate-text-area-input"]').should("not.exist");

    cy.clickSelect('[data-cy="selfRateForCovid"]', null, true);
    cy.get('[data-cy="selfRateForCovid-inline-error-msg"]').should("not.exist");
    cy.get('[data-cy="reasonOfSelfRate-inline-error-msg"]').should("exist");
    cy.get('[data-cy="reasonOfSelfRate-text-area-input"]')
      .should("exist")
      .type("my reason for self-rate");

    cy.get('[data-cy="discussWithSupervisorChecked-No-input"]').click();
    cy.get('[data-cy="discussWithSomeoneChecked-Yes-input"]').click();
    cy.get('[data-cy="changeCircumstanceOther-text-area-input"]').type(
      "other change"
    );
    cy.get('[data-cy="howPlacementAdjusted-text-area-input"]').type(
      "more info on how placement adjusted"
    );
    cy.get(".nhsuk-error-summary").should("not.exist");
    cy.get('[data-cy="navNext"]').click();

    // 11. Compliments
    cy.get('[data-cy="compliments-text-area-input"]')
      .should("exist")
      .type("a really nice compliment");
    cy.get('[data-cy="BtnShortcutToConfirm"]').should("not.exist");
    cy.get('[data-cy="BtnSaveDraft"]').should("exist");
    cy.get('[data-cy="navNext"] > .nhsuk-pagination__page')
      .contains("Review & submit")
      .click();
    cy.get('[data-cy="BtnShortcutToConfirm"]').should("exist");
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
    cy.get('[data-cy="edit-Personal Details"]').should("exist");
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
    cy.get(
      ":nth-child(10) > .nhsuk-card > .nhsuk-card__content > .nhsuk-card__heading"
    ).contains("COVID 19 self-assessment & declarations");
    cy.get('[data-cy="edit-COVID 19 self-assessment & declarations"]').should(
      "exist"
    );

    const covidFields = [
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
      ["educationSupervisorEmail", "Not provided"],
      ["haveChangesToPlacement", "Yes"]
    ];
    cy.checkViewFields(covidFields);
  });
});
