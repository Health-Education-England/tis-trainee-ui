/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />

import { mount } from "cypress/react18";
import { MemoryRouter } from "react-router-dom";
import FormA from "../../../../components/forms/form-builder/form-r/part-a/FormRPartA";
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
  updatedCanEdit,
  updatedFormA
} from "../../../../redux/slices/formASlice";
import { ProfileToFormRPartAInitialValues } from "../../../../models/ProfileToFormRPartAInitialValues";
import { mockTraineeProfile } from "../../../../mock-data/trainee-profile";
import { submittedFormRPartAs } from "../../../../mock-data/submitted-formr-parta";
import { FormProvider } from "../../../../components/forms/form-builder/FormContext";
import formAJson from "../../../../components/forms/form-builder/form-r/part-a/formA.json";
import { Field } from "../../../../components/forms/form-builder/FormBuilder";

describe("FormA", () => {
  beforeEach(() => {
    store.dispatch(
      updatedCurriculumOptions(mockedCombinedReference.curriculum)
    );
    store.dispatch(
      updatedReference(transformReferenceData(mockedCombinedReference))
    );
  });
  it("renders the Form A for completing when path is /formr-a/create", () => {
    store.dispatch(updatedPreferredMfa("SMS"));
    const initialisedFormAData =
      ProfileToFormRPartAInitialValues(mockTraineeProfile);
    store.dispatch(updatedFormA(initialisedFormAData));
    const initialPageFields = formAJson.pages[0].sections.flatMap(
      section => section.fields as Field[]
    );
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-a/create"]}>
          <FormProvider
            initialData={initialisedFormAData}
            initialPageFields={initialPageFields}
            formName="formA"
          >
            <FormA />
          </FormProvider>
        </MemoryRouter>
      </Provider>
    );

    cy.checkAndFillFormASection1();
    cy.navNext();
    cy.checkAndFillFormASection2();
    cy.navNext();
    cy.checkAndFillFormASection3();
    cy.get('[data-cy="autosaveStatusMsg"]').contains(
      "Autosave status: Fail - Last autosave success: none this session"
    );
    cy.navNext();
  });

  it("won't render the Form if user has not set their preferred MFA", () => {
    store.dispatch(updatedPreferredMfa("NOMFA"));
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-a/create"]}>
          <FormA />
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="formraLabel"]').should("not.exist");
  });
});

describe("Form A View (/form-a/confirm)", () => {
  beforeEach(() => {
    store.dispatch(
      updatedCurriculumOptions(mockedCombinedReference.curriculum)
    );
    store.dispatch(
      updatedReference(transformReferenceData(mockedCombinedReference))
    );
    store.dispatch(updatedCanEdit(true));
    store.dispatch(updatedPreferredMfa("SMS"));
  });

  it("renders the FormView component with errors when form fields are still missing after having completed the form and bypassed page validation (!?)", () => {
    const initialisedFormAData =
      ProfileToFormRPartAInitialValues(mockTraineeProfile);
    store.dispatch(updatedFormA(initialisedFormAData));
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/formr-a/confirm"]}>
          <FormA />
        </MemoryRouter>
      </Provider>
    );

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
        ".nhsuk-error-summary",
        "Before proceeding to the next section please address the following:"
      ],
      [
        ".nhsuk-error-summary",
        "Date of Birth is before the minimum date allowed"
      ]
    ];

    containedEls.forEach(element => {
      cy.get(element[0]).should("contain", element[1]);
    });

    cy.get('[data-cy="dateOfBirth-label"]').should(
      "have.class",
      "nhsuk-summary-list__key nhsuk-error-message"
    );
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
    cy.clickRadioCheck('[data-cy="isCorrect"]');
    cy.clickRadioCheck('[data-cy="willKeepInformed"]');
    cy.get('[data-cy="BtnSubmit"]').should("be.disabled");
  });

  describe("Form A View (/formr-a/:id)", () => {
    beforeEach(() => {
      store.dispatch(
        updatedCurriculumOptions(mockedCombinedReference.curriculum)
      );
      store.dispatch(
        updatedReference(transformReferenceData(mockedCombinedReference))
      );
      store.dispatch(updatedCanEdit(false));
      store.dispatch(updatedPreferredMfa("SMS"));
    });
    it("renders the readonly FormView component", () => {
      store.dispatch(
        updatedFormA({
          ...submittedFormRPartAs[1],
          dateOfBirth: "2000-01-01",
          completionDate: new Date()
        })
      );
      mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/formr-a/5e972ec9b9b5781b94eb1271"]}>
            <FormA />
          </MemoryRouter>
        </Provider>
      );

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
        ['[data-cy="backLink"]', "Back to forms list"],
        ['[data-cy="savePdfBtn"]', "Save a copy as a PDF"],
        [
          '[data-cy="submissionDateTop"]',
          "Form submitted on: 02/07/2022 11:10 (BST)"
        ]
      ];

      containedEls.forEach(element => {
        cy.get(element[0]).contains(element[1]);

        cy.get('[data-cy="isCorrect"]').should("be.checked");
        cy.get('[data-cy="willKeepInformed"]').should("be.checked");

        const nonExistEls = [
          "warningConfirmation",
          "BtnSubmit",
          "BtnSaveDraft",
          "startOverButton",
          "edit-Personal Details"
        ];
        nonExistEls.forEach(element => {
          cy.get(`[data-cy="${element}"]`).should("not.exist");
        });
      });
    });

    describe("Page not found (/formr-a/*)", () => {
      beforeEach(() => {
        store.dispatch(
          updatedCurriculumOptions(mockedCombinedReference.curriculum)
        );
        store.dispatch(
          updatedReference(transformReferenceData(mockedCombinedReference))
        );
      });
      it("renders the PageNotFound component on a dodgy formr-a route", () => {
        mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={["/formr-a/unknown/1"]}>
              <FormA />
            </MemoryRouter>
          </Provider>
        );

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
          ['[data-cy="pageNotFoundText"]', "Sorry, page not found"]
        ];

        containedEls.forEach(element => {
          cy.get(element[0]).contains(element[1]);
        });
      });
    });

    // Note
    // /formr-a/* (aside from :id) e.g. /formr-a/unknown redirects to /formr-a (not tested here).
    // CreatList comp is tested in CreateList.cy.tsx
  });
});
