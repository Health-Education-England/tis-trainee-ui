import { useState } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { mount } from "cypress/react";
import day from "dayjs";
import cctReferenceReducer from "../../../../redux/slices/cctReferenceSlice";
import cctReducer from "../../../../redux/slices/cctSlice";
import traineeProfileReducer from "../../../../redux/slices/traineeProfileSlice";
import { Cct } from "../../../../components/forms/cct/Cct";
import history from "../../../../components/navigation/history";
import { mockCctCalculateResponses } from "../../../../mock-data/mock-cct-calculate-responses";
import { mockCctSpecialties } from "../../../../mock-data/mock-cct-specialties";
import { CctChangesSection } from "../../../../components/forms/cct/CctChangesSection";
import { CctTrainingTimeSection } from "../../../../components/forms/cct/CctTrainingTimeSection";
import { CctGradeYearsTable } from "../../../../components/forms/cct/CctGradeProgressionSection";
import {
  CctChange,
  CctChangeDto,
  CctGradeYear,
  CctProgrammeDetails,
  CctTrainingTime
} from "../../../../models/CctTypes";
import {
  CCT_INDICATIVE_DATE_TEXT,
  CCT_MAX_CHANGES,
  CCT_MAX_TRAINING_TIME_ENTRIES
} from "../../../../utilities/CctConstants";
import {
  CctCalculateRequest,
  CctCalculationSaveRequest
} from "../../../../services/CctService";

const createStore = () =>
  configureStore({
    reducer: {
      cctReference: cctReferenceReducer,
      cct: cctReducer,
      traineeProfile: traineeProfileReducer
    }
  });

const mountCct = (path = "/cct/create") => {
  history.push(path);
  mount(
    <Provider store={createStore()}>
      <Router history={history}>
        <Cct />
      </Router>
    </Provider>
  );
};

const selectOption = (fieldName: string, optionLabel: string) => {
  cy.get(`[data-cy="${fieldName}"] .react-select__control`).click();
  cy.get(".react-select__menu").contains(optionLabel).click();
};

const selectedValue = (fieldName: string) =>
  cy.get(`[data-cy="${fieldName}"] .react-select__single-value`);

const dateLimitsError =
  "Date must be between 01/01/1970 and 50 years from today.";
const latestDate = day().add(50, "year").format("YYYY-MM-DD");
const dayAfterLatestDate = day()
  .add(50, "year")
  .add(1, "day")
  .format("YYYY-MM-DD");

const typeDate = (fieldName: string, date: string) => {
  cy.get(`[data-cy="${fieldName}-input"]`).clear();
  cy.get(`[data-cy="${fieldName}-input"]`).type(date);
};

const enterTwoDigitYear = (fieldName: string) => {
  cy.get(`[data-cy="${fieldName}-input"]`).then($input => {
    const input = $input[0] as HTMLInputElement;
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )?.set?.call(input, "0099-01-01");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  cy.get(`[data-cy="${fieldName}-input"]`).should("have.value", "0099-01-01");
};

const saveProgrammeDetails = () => {
  selectOption("specialty", "Paediatrics");
  cy.get('[data-cy="startDate-input"]').type("2023-08-02");
  cy.get('[data-cy="cct-programme-details-submit"]').click();
};

const addParentalLeaveChange = () => {
  cy.get('[data-cy="cct-add-change"]').click();
  selectOption("type", "Parental leave");
  cy.get('[data-cy="startDate-input"]').type("2024-02-01");
  cy.get('[data-cy="endDate-input"]').type("2024-08-01");
  cy.get('[data-cy="cct-change-form-submit"]').click();
};

const addParentalLeaveChangeAndWait = () => {
  cy.intercept("POST", "/api/trainee/cct/calculate").as("calculateChange");
  addParentalLeaveChange();
  cy.wait("@calculateChange");
};

const addTrainingTime = (
  kind: "additional" | "accelerated",
  grade: string,
  months: string,
  reason: string
) => {
  cy.get(`[data-cy="cct-add-${kind}-time"]`).click();
  selectOption("grade", grade);
  cy.get("#months").type(months);
  cy.get("#notes").type(reason);
  cy.get('[data-cy="cct-training-time-form-submit"]').click();
};

const calculateWithMockBackend = ({
  programmeDetails,
  changes
}: CctCalculateRequest) => {
  const key = [
    programmeDetails.startDate,
    ...changes.map(
      ({ type, startDate, endDate, wte, countsTowardsCompletion }) =>
        `${type} ${startDate} ${endDate} ${wte} ${countsTowardsCompletion}`
    )
  ].join(" + ");
  const body = mockCctCalculateResponses[key];
  if (!body) throw new Error(`No mock /calculate response for "${key}"`);
  return { statusCode: 200, body };
};

const paediatricsGrades = ["ST1", "ST2", "ST3", "ST4", "ST5", "ST6", "ST7"];

const calculateWithGradeChecks = (request: CctCalculateRequest) => {
  const reply = calculateWithMockBackend(request);
  const { additionalTrainingTime, skippedGrade } = request.programmeDetails;
  const notInProgression = (grade: string) =>
    `${grade} is not part of this programme's grade progression.`;
  const errors = [
    ...additionalTrainingTime.flatMap(({ grade }, index) =>
      paediatricsGrades.includes(grade)
        ? []
        : [
            {
              pointer: `#/programmeDetails/additionalTrainingTime[${index}]/grade`,
              detail: notInProgression(grade)
            }
          ]
    ),
    ...(skippedGrade && !paediatricsGrades.includes(skippedGrade)
      ? [
          {
            pointer: "#/programmeDetails/skippedGrade",
            detail: notInProgression(skippedGrade)
          }
        ]
      : [])
  ];
  return { ...reply, body: { ...reply.body, errors } };
};

const calculateWithErrors =
  (errors: { pointer: string; detail: string }[]) =>
  (request: CctCalculateRequest) => {
    const reply = calculateWithMockBackend(request);
    return { ...reply, body: { ...reply.body, errors } };
  };

const savedCalculationId = "5f0c9a3e-8a4d-4c55-9a51-0f6a2f1d7c11";
const savedCalculationUrl = `/api/trainee/cct/calculation/${savedCalculationId}`;

const saveWithMockBackend = (request: CctCalculationSaveRequest) => {
  const { body } = calculateWithMockBackend(request);
  return {
    statusCode: 201,
    body: {
      id: savedCalculationId,
      name: request.name,
      programmeDetails: request.programmeDetails,
      changes: body.changes,
      result: body.result,
      created: "2026-10-28T12:00:00Z",
      lastModified: "2026-10-28T12:00:00Z"
    }
  };
};

const paediatricsProgrammeDetails = (
  startDate: string
): CctProgrammeDetails => ({
  specialty: "Paediatrics",
  startDate,
  lengthMonths: 84,
  lengthOverrideNotes: "",
  startGrade: "ST1",
  startGradeOverrideNotes: "",
  additionalTrainingTime: [],
  acceleratedTrainingTime: [],
  eighteenMonthFinalGrade: null,
  eighteenMonthFinalGradeNotes: "",
  skippedGrade: null,
  skippedGradeNotes: ""
});

const parentalLeaveChange: CctChangeDto = {
  type: "PARENTAL",
  startDate: "2024-02-01",
  endDate: "2024-08-01",
  wte: null,
  countsTowardsCompletion: false,
  notes: ""
};

const savedCalculation = (name: string, startDate = "2023-08-02") =>
  saveWithMockBackend({
    name,
    programmeDetails: paediatricsProgrammeDetails(startDate),
    changes: [parentalLeaveChange]
  }).body;

const mountSavedCalculationWith = (
  programmeDetails: Partial<CctProgrammeDetails>
) => {
  cy.intercept("GET", savedCalculationUrl, {
    body: saveWithMockBackend({
      name: "No longer valid",
      programmeDetails: {
        ...paediatricsProgrammeDetails("2023-08-02"),
        ...programmeDetails
      },
      changes: []
    }).body
  });
  mountCct(`/cct/${savedCalculationId}`);
};

const calculationsUrl = "/api/trainee/cct/calculation";

const listedCalculation = (id: string, name: string, lastModified: string) => ({
  ...savedCalculation(name),
  id,
  lastModified
});

const clickContinue = (times = 1) => {
  for (let step = 0; step < times; step++)
    cy.get('[data-cy="cct-continue"]').click();
};

const clickBack = (times = 1) => {
  for (let step = 0; step < times; step++)
    cy.get('[data-cy="cct-back-link"]').click();
};

const goToChanges = () => clickContinue(3);

const goToSummary = () => clickContinue(4);

describe("Cct", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/trainee/cct/specialties", {
      body: mockCctSpecialties
    });
    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(calculateWithMockBackend(req.body))
    );
    cy.intercept("GET", calculationsUrl, { body: [] });
  });

  it("starts on step 1 with the programme details form open", () => {
    mountCct();

    cy.get('[data-cy="cct-header"]').should("exist");
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 1 of 5 - Programme details"
    );
    cy.get('[data-cy="cct-programme-details-form"]').should("exist");
    cy.get('[data-cy="cct-back-link"]').should("have.text", "Back to CCT home");
    cy.get('[data-cy="cct-continue"]').should("not.exist");
  });

  it("moves through the steps with Continue and the back link", () => {
    mountCct();
    saveProgrammeDetails();

    [
      ["Step 2 of 5 - Training time adjustments", "Back to Programme details"],
      [
        "Step 3 of 5 - Grade progression adjustments",
        "Back to Training time adjustments"
      ],
      ["Step 4 of 5 - Changes", "Back to Grade progression adjustments"]
    ].forEach(([heading, backLink]) => {
      cy.get('[data-cy="cct-continue"]').should("have.text", "Continue");
      cy.get('[data-cy="cct-continue"]').click();
      cy.get('[data-cy="progress-header"]').should("contain.text", heading);
      cy.get('[data-cy="cct-back-link"]').should("have.text", backLink);
    });
    cy.get('[data-cy="cct-continue"]').should("have.text", "Show summary");
    cy.get('[data-cy="cct-return-to-summary"]').should("not.exist");

    [
      "Step 3 of 5 - Grade progression adjustments",
      "Step 2 of 5 - Training time adjustments",
      "Step 1 of 5 - Programme details"
    ].forEach(heading => {
      cy.get('[data-cy="cct-back-link"]').click();
      cy.get('[data-cy="progress-header"]').should("contain.text", heading);
    });

    goToSummary();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 5 of 5 - Summary"
    );
    cy.get('[data-cy="cct-continue"]').should("not.exist");
    cy.get('[data-cy="cct-back-link"]').should("have.text", "Back to CCT home");
  });

  it("reveals the rest of the form and defaults length and grade from the specialty", () => {
    mountCct();

    cy.get('[data-cy="startGrade"]').should("not.exist");
    selectOption("specialty", "Paediatrics");

    cy.get("#lengthMonths").should("have.value", "84");
    selectedValue("startGrade").should("contain.text", "ST1");
  });

  it("shows the saved programme details as a summary, then reopens for editing", () => {
    mountCct();
    saveProgrammeDetails();

    cy.get('[data-cy="cct-programme-details-summary"]')
      .should("contain.text", "Paediatrics")
      .and("contain.text", "84 months")
      .and("contain.text", "02/08/2023");
    cy.get('[data-cy="cct-programme-details-form"]').should("not.exist");
    cy.get('[data-cy="cct-continue"]').should("exist");

    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get('[data-cy="cct-programme-details-form"]').should("exist");
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    cy.get('[data-cy="cct-programme-details-cancel"]').click();
    cy.get('[data-cy="cct-continue"]').should("exist");
  });

  it("asks for a reason as soon as the start grade differs from the specialty default", () => {
    mountCct();
    selectOption("specialty", "Paediatrics");

    selectedValue("startGrade").should("contain.text", "ST1");
    cy.get("#startGradeOverrideNotes").should("not.exist");

    selectOption("startGrade", "ST4");
    cy.get("#startGradeOverrideNotes").should("exist").type("Entered at ST4");

    // Note: back to the default, so the reason is no longer asked for - and the entry is cleared, not just hidden.
    selectOption("startGrade", "ST1");
    cy.get("#startGradeOverrideNotes").should("not.exist");
    selectOption("startGrade", "ST4");
    cy.get("#startGradeOverrideNotes").should("have.value", "");
  });

  it("re-defaults the start grade when the specialty changes", () => {
    mountCct();
    selectOption("specialty", "Paediatrics");
    selectOption("startGrade", "ST4");
    cy.get("#startGradeOverrideNotes").should("exist");

    selectOption("specialty", "Geriatric medicine");
    selectedValue("startGrade").should("contain.text", "ST4");
    cy.get("#lengthMonths").should("have.value", "48");
    // Note: ST4 is the default for this specialty, so it is no longer an override.
    cy.get("#startGradeOverrideNotes").should("not.exist");
  });

  it("keeps an overridden start grade when the programme details are reopened, until the specialty changes", () => {
    mountCct();
    selectOption("specialty", "Paediatrics");
    selectOption("startGrade", "ST4");
    cy.get("#startGradeOverrideNotes").type("Entered at ST4");
    cy.get('[data-cy="startDate-input"]').type("2023-08-02");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="cct-programme-details-summary"]').should(
      "contain.text",
      "ST4"
    );

    cy.get('[data-cy="cct-edit-programme-details"]').click();
    selectedValue("startGrade").should("contain.text", "ST4");
    cy.get("#startGradeOverrideNotes").should("have.value", "Entered at ST4");

    selectOption("specialty", "Haematology");
    selectedValue("startGrade").should("contain.text", "ST3");
    selectOption("specialty", "Paediatrics");
    selectedValue("startGrade").should("contain.text", "ST1");
  });

  it("asks for a reason as soon as the programme length differs from the specialty default", () => {
    mountCct();
    selectOption("specialty", "Paediatrics");

    cy.get("#lengthMonths").should("have.value", "84");
    cy.get("#lengthOverrideNotes").should("not.exist");

    cy.get("#lengthMonths").clear().type("85");
    cy.get("#lengthOverrideNotes").should("exist").type("Agreed locally");

    // Note: back to the default, so the reason is no longer asked for - and the entry is cleared, not just hidden.
    cy.get("#lengthMonths").type("{backspace}4");
    cy.get("#lengthOverrideNotes").should("not.exist");
    cy.get("#lengthMonths").type("{backspace}5");
    cy.get("#lengthOverrideNotes").should("have.value", "");
  });

  it("re-defaults an overridden programme length when the specialty changes", () => {
    mountCct();
    selectOption("specialty", "Paediatrics");
    cy.get("#lengthMonths").clear().type("60");
    cy.get("#lengthOverrideNotes").type("Agreed locally");

    selectOption("specialty", "Geriatric medicine");
    cy.get("#lengthMonths").should("have.value", "48");
    // Note: 48 is the default for this specialty, so the length is no longer an override.
    cy.get("#lengthOverrideNotes").should("not.exist");
  });

  it("keeps an overridden programme length when the programme details are reopened", () => {
    mountCct();
    selectOption("specialty", "Paediatrics");
    cy.get("#lengthMonths").clear().type("60");
    cy.get("#lengthOverrideNotes").type("Agreed locally");
    cy.get('[data-cy="startDate-input"]').type("2023-08-02");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="cct-programme-details-summary"]')
      .should("contain.text", "60 months")
      .and("contain.text", "default for this specialty is 84 months")
      .and("contain.text", "Agreed locally");

    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get("#lengthMonths").should("have.value", "60");
    cy.get("#lengthOverrideNotes").should("have.value", "Agreed locally");
  });

  it("rejects a programme length outside 1 to 120 months", () => {
    const lengthError =
      "Programme length must be a whole number of months between 1 and 120.";
    mountCct();
    selectOption("specialty", "Paediatrics");
    cy.get('[data-cy="startDate-input"]').type("2023-08-02");

    cy.get("#lengthMonths").clear();
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="errorSummary"]').should("contain.text", lengthError);

    cy.get("#lengthMonths").type("0");
    cy.get('[data-cy="errorSummary"]').should("contain.text", lengthError);

    cy.get("#lengthMonths").clear().type("121");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="errorSummary"]').should("contain.text", lengthError);
    cy.get('[data-cy="cct-programme-details-summary"]').should("not.exist");

    cy.get("#lengthMonths").clear().type("120");
    cy.get("#lengthOverrideNotes").type("Agreed locally");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="errorSummary"]').should("not.exist");
    cy.get('[data-cy="cct-programme-details-summary"]').should("exist");
  });

  it("rejects a programme start date outside the date limits", () => {
    mountCct();
    selectOption("specialty", "Paediatrics");

    typeDate("startDate", "1969-12-31");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="errorSummary"]').should("contain.text", dateLimitsError);

    enterTwoDigitYear("startDate");
    cy.get('[data-cy="errorSummary"]').should("contain.text", dateLimitsError);

    typeDate("startDate", dayAfterLatestDate);
    cy.get('[data-cy="errorSummary"]').should("contain.text", dateLimitsError);
    cy.get('[data-cy="cct-programme-details-summary"]').should("not.exist");

    typeDate("startDate", "1970-01-01");
    cy.get('[data-cy="errorSummary"]').should("not.exist");

    typeDate("startDate", latestDate);
    cy.get('[data-cy="errorSummary"]').should("not.exist");
  });

  it("rejects a change's dates outside the date limits", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    cy.get('[data-cy="cct-add-change"]').click();
    selectOption("type", "Parental leave");

    typeDate("startDate", "1969-12-31");
    typeDate("endDate", "2024-08-01");
    cy.get('[data-cy="cct-change-form-submit"]').click();
    cy.get('[data-cy="errorSummary"]').should("contain.text", dateLimitsError);

    enterTwoDigitYear("startDate");
    cy.get('[data-cy="errorSummary"]').should("contain.text", dateLimitsError);

    typeDate("startDate", dayAfterLatestDate);
    cy.get('[data-cy="errorSummary"]').should("contain.text", dateLimitsError);

    typeDate("startDate", "2024-02-01");
    cy.get('[data-cy="errorSummary"]').should("not.exist");

    typeDate("endDate", dayAfterLatestDate);
    cy.get('[data-cy="errorSummary"]').should("contain.text", dateLimitsError);

    enterTwoDigitYear("endDate");
    cy.get('[data-cy="errorSummary"]').should("contain.text", dateLimitsError);

    typeDate("endDate", latestDate);
    cy.get('[data-cy="errorSummary"]').should("not.exist");
  });

  it("keeps the error box up and Continue hidden until a retry succeeds", () => {
    cy.intercept("POST", "/api/trainee/cct/calculate", {
      statusCode: 500,
      body: {}
    });
    mountCct();
    saveProgrammeDetails();

    cy.get('[data-cy="cct-request-error"] button').should("have.length", 1);
    cy.get('[data-cy="cct-programme-details-summary"]').should(
      "contain.text",
      "—"
    );
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply({ ...calculateWithMockBackend(req.body), delay: 1500 })
    );
    cy.get('[data-cy="cct-request-retry"]').click();
    cy.get('[data-cy="cct-request-retry"]').should(
      "have.text",
      "Trying again…"
    );
    cy.focused().should("have.attr", "data-cy", "cct-request-retry");
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    cy.get('[data-cy="cct-request-error"]').should("not.exist");
    cy.get('[data-cy="cct-continue"]').click();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 2 of 5 - Training time adjustments"
    );

    cy.intercept("POST", "/api/trainee/cct/calculate", {
      statusCode: 500,
      body: {}
    });
    addTrainingTime("additional", "ST2", "6", "Outcome 3 following ARCP");
    cy.get('[data-cy="cct-request-error"]').should(
      "contain.text",
      "We could not calculate your programme end date."
    );
    cy.get('[data-cy="cct-continue"]').should("not.exist");
  });

  it("shows a loading indicator until the specialties arrive", () => {
    cy.intercept("GET", "/api/trainee/cct/specialties", {
      body: mockCctSpecialties,
      delay: 1500
    });
    mountCct();

    cy.get('[data-cy="loading"]').should("exist");
    cy.get('[data-cy="cct-programme-details-form"]').should("not.exist");

    cy.get('[data-cy="cct-programme-details-form"]').should("exist");
    cy.get('[data-cy="loading"]').should("not.exist");
  });

  it("keeps the form back and offers a retry until the specialties load", () => {
    cy.intercept("GET", "/api/trainee/cct/specialties", {
      statusCode: 500,
      body: {}
    });
    mountCct();

    cy.get('[data-cy="cct-request-error"]').should(
      "contain.text",
      "list of specialties"
    );
    cy.get('[data-cy="cct-programme-details-form"]').should("not.exist");

    cy.intercept("GET", "/api/trainee/cct/specialties", {
      body: mockCctSpecialties,
      delay: 1500
    });
    cy.get('[data-cy="cct-request-retry"]').click();
    cy.get('[data-cy="cct-request-retry"]').should(
      "have.text",
      "Trying again…"
    );

    cy.get('[data-cy="cct-request-error"]').should("not.exist");
    saveProgrammeDetails();
    cy.get('[data-cy="cct-continue"]').should("exist");
  });

  it("holds the table back until the first change is added", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();

    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 4 of 5 - Changes"
    );
    // Note: with nothing entered the table would say no more than the programme details already do.
    cy.get('[data-cy="cct-changes-table"]').should("not.exist");
    cy.get('[data-cy="cct-hide-assumed-periods"]').should("not.exist");
    cy.get('[data-cy="cct-projected-cct-date"]')
      .should("contain.text", "29/07/2030")
      .and("contain.text", "no changes added yet");
    cy.get('[data-cy="cct-add-change"]').should("exist");

    addParentalLeaveChange();
    cy.get('[data-cy="cct-changes-table"]').should("exist");
    cy.get('[data-cy="cct-projected-cct-date"]').should(
      "not.contain.text",
      "no changes added yet"
    );
  });

  it("moves the projection start to the day after the last change ends", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChange();

    cy.get('[data-cy="cct-projection-row"]')
      .should("contain.text", "Full-time projection")
      .and("contain.text", "Projects to completion")
      .and("contain.text", "02/08/2024")
      .and("contain.text", "100%")
      .and("contain.text", "Read only");
    // Note: the projection is always derived so no controls of its own.
    cy.get('[data-cy="cct-projection-row"] button').should("not.exist");
    cy.get('[data-cy="cct-total-row"]').should("exist");
    cy.get('[data-cy="cct-completion-total-row"]').should("exist");
  });

  it("shows the gap before a change as an assumed full-time row", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChange();

    // Note: the period from the prog start to the day before the change, which nothing covers.
    cy.get('[data-cy="cct-assumed-row"]')
      .should("contain.text", "Assumed full-time")
      .and("contain.text", "02/08/2023")
      .and("contain.text", "31/01/2024")
      .and("contain.text", "100%");
    cy.get('[data-cy="cct-hide-assumed-periods"]').should("not.be.checked");
    // Note: while they are on show the two totals read as one, as in the POC.
    cy.get('[data-cy="cct-total-row"]').should("exist");
    cy.get('[data-cy="cct-entered-total-row"]').should("not.exist");
    cy.get('[data-cy="cct-assumed-total-row"]').should("not.exist");
  });

  it("shows the assumed full-time rows only once the calculation returns them", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply({ ...calculateWithMockBackend(req.body), delay: 1500 })
    );
    addParentalLeaveChange();

    cy.get('[data-cy^="cct-change-row-"]').should("exist");
    cy.get('[data-cy="cct-assumed-row"]').should("not.exist");
    cy.get('[data-cy="cct-hide-assumed-periods"]').should("not.exist");

    cy.get('[data-cy="cct-assumed-row"]')
      .should("contain.text", "02/08/2023")
      .and("contain.text", "31/01/2024");
    cy.get('[data-cy="cct-hide-assumed-periods"]').should("exist");
  });

  it("hides the assumed full-time rows and splits the totals on request", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChange();

    cy.get('[data-cy="cct-hide-assumed-periods"]').check();

    cy.get('[data-cy="cct-assumed-row"]').should("not.exist");
    cy.get('[data-cy="cct-total-row"]').should("not.exist");
    cy.get('[data-cy="cct-entered-total-row"]').should("exist");
    cy.get('[data-cy="cct-assumed-total-row"]').should("exist");
    // Note: the change itself is never hidden, only the gaps around it.
    cy.get('[data-cy^="cct-change-row-"]').should("exist");
  });

  it("stacks each row under its column labels on a narrow viewport", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChangeAndWait();

    cy.get('[data-cy="cct-changes-table"]').should(
      "have.class",
      "nhsuk-table-responsive"
    );
    // Note: nhsuk-react-components copies the head row's labels into every body cell, so no column is hidden when the row stacks.
    cy.get('[data-cy="cct-projection-row"]')
      .find(".nhsuk-table-responsive__heading")
      .should("contain.text", "WTE");
    cy.get('[data-cy="cct-total-row"]').scrollIntoView();
    cy.get('[data-cy="cct-total-row"] td:visible').should("have.length", 3);
  });

  it("keeps an LTFT change that runs to completion as its own row and projects from it", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();

    cy.get('[data-cy="cct-add-change"]').click();
    selectOption("type", "Less than full time (LTFT)");
    cy.get(
      '[data-cy="ltftDuration-It lasts for the rest of my training-input"]'
    ).click();
    // Note: that choice is what makes it project, so it has no end date of its own.
    cy.get('[data-cy="endDate-input"]').should("not.exist");
    cy.get('[data-cy="startDate-input"]').type("2025-02-01");
    cy.get("#wtePercent").type("60");
    cy.get('[data-cy="cct-change-form-submit"]').click();

    // Note: as in the POC, the change stays listed and the projection it drives is still shown separately.
    cy.get('[data-cy^="cct-change-row-"]')
      .should("contain.text", "LTFT")
      .and("contain.text", "For remainder of training")
      .and("contain.text", "60%");
    cy.get('[data-cy="cct-projection-row"]')
      .should("contain.text", "LTFT projection")
      .and("contain.text", "60%")
      .and("contain.text", "01/02/2025")
      .and("contain.text", "Read only");

    cy.get('[data-cy^="cct-remove-change-"]').click();
    cy.get('[data-cy="submitBtn-Remove"]').click();
    cy.get('[data-cy="cct-changes-table"]').should("not.exist");
    cy.get('[data-cy="cct-projected-cct-date"]').should(
      "contain.text",
      "no changes added yet"
    );
  });

  it("reopens a change that runs to completion with its duration preselected", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();

    cy.get('[data-cy="cct-add-change"]').click();
    selectOption("type", "Less than full time (LTFT)");
    cy.get(
      '[data-cy="ltftDuration-It lasts for the rest of my training-input"]'
    ).click();
    cy.get('[data-cy="startDate-input"]').type("2025-02-01");
    cy.get("#wtePercent").type("60");
    cy.get('[data-cy="cct-change-form-submit"]').click();

    cy.get('[data-cy^="cct-edit-change-"]').click();
    cy.get(
      '[data-cy="ltftDuration-It lasts for the rest of my training-input"]'
    ).should("be.checked");
    cy.get('[data-cy="endDate-input"]').should("not.exist");

    // Note: giving it an end date stops it projecting, so the projection falls back to full time.
    cy.get('[data-cy="ltftDuration-It ends on a specific date-input"]').click();
    cy.get('[data-cy="endDate-input"]').type("2025-08-01");
    cy.get('[data-cy="cct-change-form-submit"]').click();

    cy.get('[data-cy^="cct-change-row-"]').should("contain.text", "01/08/2025");
    cy.get('[data-cy="cct-projection-row"]')
      .should("contain.text", "Full-time projection")
      .and("contain.text", "02/08/2025")
      .and("contain.text", "100%");
  });

  it("asks for an end date again if the LTFT change stops running to completion", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();

    cy.get('[data-cy="cct-add-change"]').click();
    selectOption("type", "Less than full time (LTFT)");
    cy.get(
      '[data-cy="ltftDuration-It lasts for the rest of my training-input"]'
    ).click();
    cy.get('[data-cy="endDate-input"]').should("not.exist");

    cy.get('[data-cy="ltftDuration-It ends on a specific date-input"]').click();
    cy.get('[data-cy="endDate-input"]').should("exist");
  });

  it("navigates to the changes page and adds a change", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();

    cy.get('[data-cy="cct-add-change"]').click();
    selectOption("type", "Less than full time (LTFT)");
    cy.get("#wtePercent").should("exist").type("60");
    cy.get('[data-cy="startDate-input"]').type("2024-02-01");
    cy.get('[data-cy="ltftDuration-It ends on a specific date-input"]').click();
    cy.get('[data-cy="endDate-input"]').type("2024-08-01");
    cy.get('[data-cy="cct-change-form-submit"]').click();

    // Note: the table uses the short label so nine columns fit better; the dropdown offers the full one.
    cy.get('[data-cy="cct-changes-table"]')
      .should("contain.text", "LTFT")
      .and("contain.text", "60%")
      .and("contain.text", "01/02/2024")
      .and("contain.text", "01/08/2024");
  });

  it("only offers the completion credit choice for the types that allow it", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    cy.get('[data-cy="cct-add-change"]').click();

    selectOption("type", "Sickness absence");
    cy.get('[data-cy="countsTowardsCompletion-checkbox"]').should("not.exist");
    cy.get("#wtePercent").should("not.exist");

    selectOption("type", "Out of programme - research (OOPR)");
    cy.get('[data-cy="countsTowardsCompletion-checkbox"]').should("exist");
    cy.get("#wtePercent").should("not.exist");

    cy.get('[data-cy="countsTowardsCompletion-checkbox"]').check();
    cy.get("#wtePercent").should("exist");
  });

  it("sends no credit for an OOPR change once its credit is unticked", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    cy.get('[data-cy="cct-add-change"]').click();
    selectOption("type", "Out of programme - research (OOPR)");
    cy.get('[data-cy="startDate-input"]').type("2024-02-01");
    cy.get('[data-cy="endDate-input"]').type("2024-08-01");
    cy.get('[data-cy="countsTowardsCompletion-checkbox"]').check();
    cy.get("#wtePercent").type("50");
    cy.get('[data-cy="countsTowardsCompletion-checkbox"]').uncheck();

    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(calculateWithMockBackend(req.body))
    ).as("calculate");
    cy.get('[data-cy="cct-change-form-submit"]').click();

    cy.wait("@calculate").then(({ request, response }) => {
      expect(request.body.changes[0]).to.deep.include({
        type: "OOPR",
        wte: null,
        countsTowardsCompletion: false
      });
      expect(response?.statusCode).to.eq(200);
    });
    cy.get('[data-cy="cct-request-error"]').should("not.exist");
    cy.get('[data-cy="cct-continue"]').should("exist");
  });

  it("asks for an end date only once the answers so far call for one", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    cy.get('[data-cy="cct-add-change"]').click();

    cy.get('[data-cy="endDate-input"]').should("not.exist");

    selectOption("type", "Less than full time (LTFT)");
    cy.get('[data-cy="endDate-input"]').should("not.exist");

    cy.get('[data-cy="ltftDuration-It ends on a specific date-input"]').click();
    cy.get('[data-cy="endDate-input"]').should("exist");
  });

  it("offers the duration choice for LTFT only", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    cy.get('[data-cy="cct-add-change"]').click();

    selectOption("type", "Parental leave");
    cy.get('[data-cy="ltftDuration-radios"]').should("not.exist");
    cy.get('[data-cy="endDate-input"]').should("exist");

    selectOption("type", "Less than full time (LTFT)");
    cy.get('[data-cy="ltftDuration-radios"]').should("exist");
  });

  it("makes the changes table keyboard reachable and cues the hidden columns", () => {
    cy.viewport(800, 800);
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChange();

    cy.get('[data-cy="cct-changes-scroll"]')
      .should("have.attr", "tabindex", "0")
      .and("have.attr", "role", "region")
      .and("have.attr", "aria-label", "Changes to your training");

    cy.get('[data-cy="cct-changes-scroll-area"]')
      .should("have.attr", "data-scroll-left", "false")
      .and("have.attr", "data-scroll-right", "true");

    cy.get('[data-cy="cct-changes-scroll"]').scrollTo("right");

    cy.get('[data-cy="cct-changes-scroll-area"]')
      .should("have.attr", "data-scroll-left", "true")
      .and("have.attr", "data-scroll-right", "false");
  });

  it("scrolls to the change form and focuses the change type on edit", () => {
    cy.viewport(800, 400);
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChangeAndWait();

    cy.get('[data-cy^="cct-edit-change-"]').click();

    cy.focused().should("have.id", "type");
    cy.get('[data-cy="cct-change-form"]').should($form => {
      const { top } = $form[0].getBoundingClientRect();
      expect(top, `form top: ${top}`).to.be.closeTo(0, 100);
    });
  });

  it("focuses the change type when the add form opens", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();

    cy.get('[data-cy="cct-add-change"]').click();

    cy.focused().should("have.id", "type");
  });

  it("scrolls back to the changes table and focuses it when a change is saved", () => {
    cy.viewport(800, 400);
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChangeAndWait();

    cy.get('[data-cy^="cct-edit-change-"]').click();
    cy.get('[data-cy="cct-change-form-submit"]').click();

    cy.focused().should("have.id", "cct-changes-scroll");
    cy.get('[data-cy="cct-changes-scroll"]').should($table => {
      const { top } = $table[0].getBoundingClientRect();
      expect(top, `table top: ${top}`).to.be.closeTo(0, 100);
    });
  });

  it("hides Continue on the changes page while a change form is open", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 4 of 5 - Changes"
    );
    cy.get('[data-cy="cct-continue"]').should("exist");

    cy.get('[data-cy="cct-add-change"]').click();
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    cy.get('[data-cy="cct-change-form-cancel"]').click();
    cy.get('[data-cy="cct-continue"]').should("exist");
  });

  it("hides Continue on the changes page while the calculation fails, until the rejected change is removed", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();

    cy.intercept("POST", "/api/trainee/cct/calculate", req => {
      if (req.body.changes.length > 0) {
        req.reply({ statusCode: 400, body: {} });
      } else {
        req.reply(calculateWithMockBackend(req.body));
      }
    });
    addParentalLeaveChange();
    cy.get('[data-cy="cct-request-error"]').should("exist");
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    cy.get('[data-cy^="cct-remove-change-"]').click();
    cy.get('[data-cy="submitBtn-Remove"]').click();
    cy.get('[data-cy="cct-request-error"]').should("not.exist");
    cy.get('[data-cy="cct-continue"]').should("exist");
  });

  it("hides Continue on the changes page while a saved change is invalid", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChange();
    cy.get('[data-cy="cct-continue"]').should("exist");

    clickBack(3);
    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get('[data-cy="startDate-input"]').clear();
    cy.get('[data-cy="startDate-input"]').type("2024-03-01");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="cct-programme-details-summary"]').should(
      "contain.text",
      "26/02/2031"
    );
    goToChanges();

    cy.get('[data-cy="cct-invalid-changes-summary"]').should(
      "contain.text",
      "Start date cannot be before programme start"
    );
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    cy.get('[data-cy^="cct-remove-change-"]').click();
    cy.get('[data-cy="submitBtn-Remove"]').click();
    cy.get('[data-cy="cct-invalid-changes-summary"]').should("not.exist");
    cy.get('[data-cy="cct-continue"]').should("exist");
  });

  it("warns on the programme details and adjustment steps while new programme details make a change invalid", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChange();
    clickBack(3);
    cy.get('[data-cy="cct-programme-details-summary"]').should("exist");
    cy.get('[data-cy="cct-invalid-changes-notice"]').should("not.exist");

    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get('[data-cy="startDate-input"]').clear();
    cy.get('[data-cy="startDate-input"]').type("2024-03-01");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="cct-invalid-changes-notice"]').should(
      "contain.text",
      "Some of your changes no longer fit within your programme dates."
    );
    cy.get('[data-cy="cct-continue"]').should("exist");

    clickContinue(2);
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 3 of 5 - Grade progression adjustments"
    );
    cy.get('[data-cy="cct-invalid-changes-notice"]').should("exist");
    clickBack(2);

    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get('[data-cy="startDate-input"]').clear();
    cy.get('[data-cy="startDate-input"]').type("2023-08-02");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="cct-programme-details-summary"]').should("exist");
    cy.get('[data-cy="cct-invalid-changes-notice"]').should("not.exist");
  });

  it("flags the projection row as invalid while a change runs past completion, until the change ends on the date quoted", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();

    cy.get('[data-cy="cct-add-change"]').click();
    selectOption("type", "Less than full time (LTFT)");
    cy.get("#wtePercent").type("50");
    cy.get('[data-cy="startDate-input"]').type("2030-01-01");
    cy.get('[data-cy="ltftDuration-It ends on a specific date-input"]').click();
    cy.get('[data-cy="endDate-input"]').type("2032-12-31");
    cy.get('[data-cy="cct-change-form-submit"]').click();

    cy.get('[data-cy="cct-invalid-changes-summary"]').should(
      "contain.text",
      "End date cannot be after the current projected Completion of Training Date (26/02/2031)."
    );
    cy.get(
      '[data-cy="cct-projection-row"] [data-cy="cct-invalid-projection"]'
    ).should("contain.text", "Invalid");

    cy.get('[data-cy^="cct-edit-change-"]').click();
    cy.get('[data-cy="endDate-input"]').clear();
    cy.get('[data-cy="endDate-input"]').type("2031-02-26");
    cy.get('[data-cy="cct-change-form-submit"]').click();

    cy.get('[data-cy="cct-continue"]').should("exist");
    cy.get('[data-cy="cct-invalid-changes-summary"]').should("not.exist");
    cy.get('[data-cy="cct-invalid-projection"]').should("not.exist");
    cy.get('[data-cy="cct-projection-row"]')
      .should("contain.text", "27/02/2031")
      .and("contain.text", "26/02/2031");
  });

  it("shows the summary with the calculated completion date", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    cy.get('[data-cy="cct-continue"]').click();

    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 5 of 5 - Summary"
    );
    cy.get('[data-cy="cct-result-summary"]').should(
      "contain.text",
      "29/07/2030"
    );
    cy.get('[data-cy="cct-summary-disclaimer"]').should(
      "contain.text",
      CCT_INDICATIVE_DATE_TEXT
    );
    cy.get('[data-cy="cct-summary-no-changes"]').should("exist");
    cy.get('[data-cy="cct-changes-table"]').should("not.exist");
    cy.get('[data-cy="cct-grade-years-table"]').should("have.length", 2);
    cy.get('[data-cy="cct-print-summary"]')
      .find('[data-cy="cct-grade-years-table"]')
      .should("exist");
    cy.get('[data-cy="cct-grade-year-1-row"]')
      .first()
      .should("contain.text", "Year 1")
      .and("contain.text", "ST1")
      .and("contain.text", "31/07/2024");
    cy.get('[data-cy="cct-grade-year-7-row"]')
      .first()
      .should("contain.text", "Year 7")
      .and("contain.text", "ST7")
      .and("contain.text", "29/07/2030");
    cy.get('[data-cy="cct-grade-years-hint"]')
      .first()
      .should("contain.text", "may not match your official training record");
    cy.get('[data-cy="cct-grade-years-eighteen-month-hint"]').should(
      "not.exist"
    );
    cy.get('[data-cy="cct-grade-years-skipped-hint"]').should("not.exist");
    cy.get('[data-cy="cct-grade-years-past-highest-hint"]').should("not.exist");
    cy.get('[data-cy="cct-delete"]').should("not.exist");
    cy.get('[data-cy="cct-continue"]').should("not.exist");
  });

  it("opens each step from its Change action on the summary, with a shortcut back", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="cct-return-to-summary"]').should("not.exist");
    goToSummary();

    cy.get('[data-cy="cct-change-programme-details"]').should(
      "have.text",
      "Change (Programme details)"
    );
    [
      ["cct-change-programme-details", "Step 1 of 5 - Programme details"],
      [
        "cct-change-training-time-adjustments",
        "Step 2 of 5 - Training time adjustments"
      ],
      [
        "cct-change-grade-progression-adjustments",
        "Step 3 of 5 - Grade progression adjustments"
      ]
    ].forEach(([action, heading]) => {
      cy.get(`[data-cy="${action}"]`).click();
      cy.get('[data-cy="progress-header"]').should("contain.text", heading);
      cy.get('[data-cy="cct-continue"]').should("have.text", "Continue");
      cy.get('[data-cy="cct-return-to-summary"]').click();
      cy.get('[data-cy="progress-header"]').should(
        "contain.text",
        "Step 5 of 5 - Summary"
      );
    });

    cy.get('[data-cy="cct-change-changes"]').click();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 4 of 5 - Changes"
    );
    cy.get('[data-cy="cct-return-to-summary"]').should("not.exist");
    cy.get('[data-cy="cct-continue"]').should("have.text", "Show summary");

    clickBack(2);
    cy.get('[data-cy="cct-add-additional-time"]').click();
    cy.get('[data-cy="cct-continue"]').should("not.exist");
    cy.get('[data-cy="cct-return-to-summary"]').should("not.exist");
  });

  it("saves the named calculation, then shows the home page with a success banner", () => {
    cy.intercept("POST", "/api/trainee/cct/calculation", req =>
      req.reply({ ...saveWithMockBackend(req.body), delay: 500 })
    ).as("save");
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChange();
    cy.get('[data-cy="cct-continue"]').click();

    cy.get('[data-cy="calculationName-input"]').type(
      "  Parental leave in 2024  "
    );
    cy.get('[data-cy="cct-save-submit"]').click();
    cy.get('[data-cy="cct-save-submit"]')
      .should("be.disabled")
      .and("contain.text", "Saving…");

    cy.wait("@save").then(({ request }) => {
      expect(request.body).to.not.have.property("id");
      expect(request.body.name).to.equal("Parental leave in 2024");
      expect(request.body.programmeDetails).to.deep.include({
        specialty: "Paediatrics",
        startDate: "2023-08-02"
      });
      expect(request.body.changes).to.have.length(1);
      expect(request.body.changes[0]).to.not.have.property("id");
      expect(request.body.changes[0]).to.deep.include({
        type: "PARENTAL",
        startDate: "2024-02-01",
        endDate: "2024-08-01"
      });
    });
    cy.get('[data-cy="cct-saved-banner"]').should(
      "contain.text",
      "Your calculation 'Parental leave in 2024' has been saved"
    );
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/cct");
    });
  });

  it("disables the name and ignores Back to CCT home and Start over while the calculation saves, then shows the home page", () => {
    cy.intercept("POST", "/api/trainee/cct/calculation", req =>
      req.reply({ ...saveWithMockBackend(req.body), delay: 1500 })
    ).as("save");
    mountCct();
    saveProgrammeDetails();
    goToSummary();
    cy.get('[data-cy="calculationName-input"]').type("Full time");
    cy.get('[data-cy="cct-save-submit"]').click();
    cy.get('[data-cy="cct-save-submit"]').should("contain.text", "Saving…");
    cy.get('[data-cy="calculationName-input"]').should("be.disabled");

    cy.get('[data-cy="cct-back-link"]').click();
    cy.get('[data-cy="cct-start-over"]').click();
    cy.get('[data-cy="dialogModal"]').should("not.exist");
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 5 of 5 - Summary"
    );
    cy.then(() => {
      expect(history.location.pathname).to.equal("/cct/create");
    });

    cy.wait("@save");
    cy.get('[data-cy="cct-saved-banner"]').should(
      "contain.text",
      "Your calculation 'Full time' has been saved"
    );
  });

  it("asks for a name and sends nothing until one is given", () => {
    cy.intercept("POST", "/api/trainee/cct/calculation", req =>
      req.reply(saveWithMockBackend(req.body))
    ).as("save");
    mountCct();
    saveProgrammeDetails();
    goToSummary();

    cy.get('[data-cy="calculationName-input"]').type("   ");
    cy.get('[data-cy="cct-save-submit"]').click();

    cy.get('[data-cy="errorSummary"]').should(
      "contain.text",
      "Please enter a name for your calculation."
    );
    cy.get('[data-cy="cct-save-form"] .nhsuk-error-message').should(
      "contain.text",
      "Please enter a name for your calculation."
    );
    cy.get("@save.all").should("have.length", 0);
    cy.get('[data-cy="cct-result-summary"]').should("exist");
  });

  it("keeps the summary and shows an error when saving fails, then saves on the next try", () => {
    cy.intercept("POST", "/api/trainee/cct/calculation", {
      statusCode: 500,
      body: {}
    }).as("failedSave");
    mountCct();
    saveProgrammeDetails();
    goToSummary();

    cy.get('[data-cy="calculationName-input"]').type("Full time");
    cy.get('[data-cy="cct-save-submit"]').click();
    cy.wait("@failedSave");

    cy.get('[data-cy="cct-save-error"]').should(
      "contain.text",
      "We could not save your calculation."
    );
    cy.get('[data-cy="cct-save-submit"]')
      .should("not.be.disabled")
      .and("contain.text", "Save calculation");
    cy.get('[data-cy="calculationName-input"]')
      .should("have.value", "Full time")
      .and("not.be.disabled");
    cy.get('[data-cy="cct-result-summary"]').should("exist");
    cy.get('[data-cy="cct-saved-banner"]').should("not.exist");

    cy.intercept("POST", "/api/trainee/cct/calculation", req =>
      req.reply(saveWithMockBackend(req.body))
    );
    cy.get('[data-cy="cct-save-submit"]').click();
    cy.get('[data-cy="cct-saved-banner"]').should(
      "contain.text",
      "Your calculation 'Full time' has been saved"
    );
  });

  it("reopens a saved calculation from the success banner's link", () => {
    cy.intercept("POST", "/api/trainee/cct/calculation", req =>
      req.reply(saveWithMockBackend(req.body))
    );
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    }).as("load");
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChange();
    cy.get('[data-cy="cct-continue"]').click();
    cy.get('[data-cy="calculationName-input"]').type("Parental leave in 2024");
    cy.get('[data-cy="cct-save-submit"]').click();

    cy.get('[data-cy="cct-saved-banner-link"]').click();
    cy.wait("@load");
    cy.get('[data-cy="cct-saved-banner"]').should("not.exist");
    cy.get('[data-cy="calculationName-input"]').should(
      "have.value",
      "Parental leave in 2024"
    );
    cy.then(() => {
      expect(history.location.pathname).to.equal(`/cct/${savedCalculationId}`);
    });
  });

  it("opens a saved calculation on the summary with its name, and saves it again with a PUT", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    cy.intercept("PUT", savedCalculationUrl, req =>
      req.reply({ ...saveWithMockBackend(req.body), statusCode: 200 })
    ).as("update");
    mountCct(`/cct/${savedCalculationId}`);

    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 5 of 5 - Summary"
    );
    cy.get('[data-cy="cct-result-summary"]').should(
      "contain.text",
      "28/01/2031"
    );
    cy.get('[data-cy="calculationName-input"]').should(
      "have.value",
      "Parental leave in 2024"
    );

    cy.get('[data-cy="calculationName-input"]').clear();
    cy.get('[data-cy="calculationName-input"]').type("Renamed");
    cy.get('[data-cy="cct-save-submit"]').click();

    cy.wait("@update").then(({ request }) => {
      expect(request.body.id).to.equal(savedCalculationId);
      expect(request.body.name).to.equal("Renamed");
      expect(request.body.programmeDetails).to.deep.equal(
        paediatricsProgrammeDetails("2023-08-02")
      );
      expect(request.body.changes).to.deep.equal([parentalLeaveChange]);
    });
    cy.get('[data-cy="cct-saved-banner"]').should(
      "contain.text",
      "Your calculation 'Renamed' has been saved"
    );
    cy.then(() => {
      expect(history.location.pathname).to.equal("/cct");
    });
  });

  it("lets the changes of an opened calculation be edited, removed and added to", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="cct-change-changes"]').click();

    cy.get('[data-cy^="cct-change-row-"]').should("have.length", 1);
    cy.get('[data-cy^="cct-edit-change-"]').click();
    cy.get('[data-cy="endDate-input"]').should("have.value", "2024-08-01");
    cy.get('[data-cy="cct-change-form-cancel"]').click();

    cy.get('[data-cy^="cct-remove-change-"]').click();
    cy.get('[data-cy="modal-cancel-btn"]').click();
    cy.get('[data-cy="dialogModal"]').should("not.exist");
    cy.get('[data-cy^="cct-change-row-"]').should("have.length", 1);
    cy.get('[data-cy^="cct-remove-change-"]').should("have.focus");

    cy.get('[data-cy^="cct-remove-change-"]').click();
    cy.get('[data-cy="submitBtn-Remove"]').click();
    cy.get('[data-cy^="cct-change-row-"]').should("not.exist");
    addParentalLeaveChange();
    cy.get('[data-cy^="cct-change-row-"]').should("have.length", 1);

    cy.get('[data-cy="cct-continue"]').click();
    cy.get('[data-cy="cct-result-summary"]').should(
      "contain.text",
      "28/01/2031"
    );
  });

  it("says a missing, malformed or someone else's calculation can't be found, with a link back instead of a retry", () => {
    cy.intercept("GET", savedCalculationUrl, { statusCode: 404, body: {} });
    mountCct(`/cct/${savedCalculationId}`);

    cy.get('[data-cy="cct-calculation-not-found"]').should(
      "contain.text",
      "We could not find this calculation."
    );
    cy.get('[data-cy="cct-request-retry"]').should("not.exist");
    cy.get('[data-cy="cct-home-link"]').click();
    cy.get('[data-cy="cct-new-calculation"]').should("exist");

    cy.intercept("GET", savedCalculationUrl, { statusCode: 403, body: {} });
    cy.then(() => history.push(`/cct/${savedCalculationId}`));
    cy.get('[data-cy="cct-calculation-not-found"]').should("exist");

    cy.intercept("GET", "/api/trainee/cct/calculation/not-a-uuid", {
      statusCode: 400,
      body: {}
    }).as("malformedLoad");
    cy.then(() => history.push("/cct/not-a-uuid"));
    cy.wait("@malformedLoad");
    cy.get('[data-cy="cct-calculation-not-found"]').should("exist");
  });

  it("offers a retry when a saved calculation fails to load, then opens it", () => {
    cy.intercept("GET", savedCalculationUrl, { statusCode: 500, body: {} });
    mountCct(`/cct/${savedCalculationId}`);

    cy.get('[data-cy="cct-request-error"]').should(
      "contain.text",
      "We could not load your calculation."
    );

    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024"),
      delay: 1000
    });
    cy.get('[data-cy="cct-request-retry"]').click();
    cy.get('[data-cy="cct-request-retry"]').should(
      "contain.text",
      "Trying again…"
    );
    cy.get('[data-cy="calculationName-input"]').should(
      "have.value",
      "Parental leave in 2024"
    );
  });

  it("hides the indicative date note on the summary until there is a result", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    cy.intercept("POST", "/api/trainee/cct/calculate", {
      statusCode: 500,
      body: {}
    });
    mountCct(`/cct/${savedCalculationId}`);

    cy.get('[data-cy="cct-result-summary"]').should("contain.text", "—");
    cy.get('[data-cy="cct-summary-disclaimer"]').should("not.exist");

    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(calculateWithMockBackend(req.body))
    );
    cy.get('[data-cy="cct-request-retry"]').click();
    cy.get('[data-cy="cct-result-summary"]').should(
      "contain.text",
      "28/01/2031"
    );
    cy.get('[data-cy="cct-summary-disclaimer"]').should("exist");
  });

  it("shows the problem in the Changes card instead of saving when a saved change is no longer valid", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("No longer valid", "2024-03-01")
    });
    mountCct(`/cct/${savedCalculationId}`);

    cy.get('[data-cy="cct-summary-errors"] a')
      .should("have.length", 1)
      .and("have.text", "Changes");
    cy.get('[data-cy="cct-card-error-changes"]').should(
      "contain.text",
      "Start date cannot be before programme start"
    );
    cy.get('[data-cy^="cct-card-error-"]').should("have.length", 1);
    cy.get('[data-cy="cct-save-blocked"]').should(
      "contain.text",
      "You need to fix the problems above before you can save this calculation."
    );
    cy.get('[data-cy="cct-save-form"]').should("not.exist");

    cy.get('[data-cy="cct-summary-error-link-changes"]').click();
    cy.focused().should("have.attr", "data-cy", "cct-change-changes");
    cy.focused().click();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 4 of 5 - Changes"
    );
    cy.get('[data-cy="cct-invalid-changes-summary"]').should(
      "contain.text",
      "Start date cannot be before programme start"
    );
  });

  it("lets an opened calculation's programme details edit be cancelled while the specialties fail to load", () => {
    cy.intercept("GET", "/api/trainee/cct/specialties", {
      statusCode: 500,
      body: {}
    });
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="cct-change-programme-details"]').click();

    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get('[data-cy="cct-request-error"]').should(
      "contain.text",
      "We could not load the list of specialties."
    );
    cy.get('[data-cy="cct-programme-details-cancel"]').click();
    cy.get('[data-cy="cct-programme-details-summary"]').should("exist");
  });

  it("lists the saved calculations newest first, each linking to its calculation, and fetches them again on return", () => {
    const oldest = listedCalculation(
      "0b6d2c41-3f7e-4a8b-9c1d-2e5f6a7b8c90",
      "Oldest",
      "2026-10-20T12:00:00Z"
    );
    cy.intercept("GET", calculationsUrl, {
      body: [
        { ...oldest, result: { ...oldest.result, cctDate: "2031-06-30" } },
        listedCalculation(
          "7a1e9f20-5b3c-4d6e-8f70-1a2b3c4d5e6f",
          "Middle",
          "2026-10-25T12:00:00.5Z"
        ),
        listedCalculation(
          savedCalculationId,
          "Newest",
          "2026-10-28T12:30:04.117Z"
        )
      ]
    }).as("list");
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Newest")
    }).as("load");
    mountCct("/cct");

    cy.get('[data-cy="cct-calculation-row"]').should("have.length", 3);
    cy.get('[data-cy="cct-calculation-link"]').then(links => {
      expect([...links].map(link => link.textContent)).to.deep.equal([
        "Newest",
        "Middle",
        "Oldest"
      ]);
    });
    cy.get('[data-cy="cct-calculation-row"]')
      .first()
      .should("contain.text", "Paediatrics")
      .and("contain.text", "28/01/2031")
      .and("contain.text", "28/10/2026");
    cy.get('[data-cy="cct-calculation-row"]')
      .last()
      .should("contain.text", "30/06/2031")
      .and("contain.text", "20/10/2026");

    cy.get('[data-cy="cct-calculation-link"]').first().click();
    cy.wait("@load");
    cy.get('[data-cy="calculationName-input"]').should("have.value", "Newest");
    cy.then(() => {
      expect(history.location.pathname).to.equal(`/cct/${savedCalculationId}`);
    });

    cy.then(() => history.goBack());
    cy.get('[data-cy="cct-calculation-row"]').should("have.length", 3);
    cy.get("@list.all").should("have.length", 2);
  });

  it("shows the estimate warning and explains the calculator in a closed expander", () => {
    mountCct("/cct");

    cy.get('[data-cy="cct-home-warning"]').should(
      "contain.text",
      CCT_INDICATIVE_DATE_TEXT
    );
    cy.get('[data-cy="cctCalculatorSummary"]').should(
      "contain.text",
      "What can I use the CCT calculator for?"
    );
    cy.get('[data-cy="cctCalculatorSummary"]')
      .closest("details")
      .should("not.have.attr", "open");

    cy.get('[data-cy="cctCalculatorSummary"]').click();
    cy.get('[data-cy="cctCalculatorSummary"]')
      .closest("details")
      .should("have.attr", "open");
    cy.get('[data-cy="cctCalculatorText"]')
      .should("contain.text", "'What if?' calculations")
      .and("contain.text", "add a snapshot of a saved calculation");
  });

  it("says there are no saved calculations when there are none", () => {
    mountCct("/cct");

    cy.get('[data-cy="cct-home-subheading"]').should(
      "have.text",
      "CCT Calculator"
    );
    cy.get('[data-cy="cct-no-calculations"]').should(
      "contain.text",
      "You have no saved calculations."
    );
    cy.get('[data-cy="cct-calculations-table"]').should("not.exist");
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
  });

  it("offers a retry when the saved calculations fail to load, then lists them", () => {
    cy.intercept("GET", calculationsUrl, { statusCode: 500, body: {} });
    mountCct("/cct");

    cy.get('[data-cy="cct-request-error"]').should(
      "contain.text",
      "We could not load your saved calculations."
    );
    cy.get('[data-cy="cct-calculations-table"]').should("not.exist");

    cy.intercept("GET", calculationsUrl, {
      body: [savedCalculation("Parental leave in 2024")],
      delay: 1000
    });
    cy.get('[data-cy="cct-request-retry"]').click();
    cy.get('[data-cy="cct-request-retry"]').should(
      "contain.text",
      "Trying again…"
    );
    cy.get('[data-cy="cct-calculation-link"]').should(
      "have.text",
      "Parental leave in 2024"
    );
    cy.get('[data-cy="cct-request-error"]').should("not.exist");
  });

  it("deletes a saved calculation from its row only once confirmed, and says so", () => {
    cy.intercept("GET", calculationsUrl, {
      body: [
        listedCalculation(
          "7a1e9f20-5b3c-4d6e-8f70-1a2b3c4d5e6f",
          "Older",
          "2026-10-25T12:00:00Z"
        ),
        listedCalculation(savedCalculationId, "Newest", "2026-10-28T12:00:00Z")
      ]
    });
    cy.intercept("DELETE", savedCalculationUrl, { body: true }).as("delete");
    mountCct("/cct");

    cy.get('[data-cy="cct-delete"]')
      .first()
      .should("contain.text", "Delete Newest")
      .click();
    cy.get('[data-cy="warningText-Delete"]').should(
      "have.text",
      "Are you sure you want to delete 'Newest'? You cannot undo this."
    );
    cy.get('[data-cy="modal-cancel-btn"]').click();
    cy.get('[data-cy="dialogModal"]').should("not.exist");
    cy.get('[data-cy="cct-delete"]').first().should("have.focus");
    cy.get('[data-cy="cct-calculation-row"]').should("have.length", 2);
    cy.get("@delete.all").should("have.length", 0);

    cy.get('[data-cy="cct-delete"]').first().click();
    cy.get('[data-cy="submitBtn-Delete"]').click();

    cy.wait("@delete");
    cy.get('[data-cy="cct-deleted-banner"]').should(
      "contain.text",
      "Your calculation 'Newest' has been deleted"
    );
    cy.get('[data-cy="cct-calculation-link"]').should("have.text", "Older");
  });

  it("deletes an opened calculation from its summary and returns to the list", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    cy.intercept("DELETE", savedCalculationUrl, { body: true }).as("delete");
    mountCct(`/cct/${savedCalculationId}`);

    cy.get('[data-cy="cct-delete"]')
      .should("have.text", "Delete this calculation")
      .click();
    cy.get('[data-cy="warningText-Delete"]').should(
      "contain.text",
      "'Parental leave in 2024'"
    );
    cy.get('[data-cy="submitBtn-Delete"]').click();

    cy.wait("@delete");
    cy.get('[data-cy="cct-deleted-banner"]').should(
      "contain.text",
      "Your calculation 'Parental leave in 2024' has been deleted"
    );
    cy.get('[data-cy="cct-no-calculations"]').should("exist");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/cct");
    });
  });

  it("keeps the confirmation open with an error when a delete fails, then deletes on retry", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    cy.intercept("DELETE", savedCalculationUrl, { statusCode: 500, body: {} });
    mountCct(`/cct/${savedCalculationId}`);

    cy.get('[data-cy="cct-delete"]').click();
    cy.get('[data-cy="submitBtn-Delete"]').click();
    cy.get('[data-cy="actionModalError"]').should(
      "contain.text",
      "We could not delete your calculation. Try again."
    );
    cy.get('[data-cy="cct-deleted-banner"]').should("not.exist");

    cy.intercept("DELETE", savedCalculationUrl, { body: true, delay: 1000 });
    cy.get('[data-cy="submitBtn-Delete"]').click();
    cy.get('[data-cy="submitBtn-Delete"]')
      .should("contain.text", "Deleting...")
      .and("be.disabled");
    cy.get('[data-cy="cct-deleted-banner"]').should("exist");
  });

  it("lets a new calculation be left before anything is entered", () => {
    mountCct();
    cy.get('[data-cy="cct-programme-details-form"]').should("exist");

    cy.then(() => history.push("/home"));
    cy.get('[data-cy="cct-programme-details-form"]').should("not.exist");
    cy.get('[data-cy="dialogModal"]').should("not.exist");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/home");
    });
  });

  it("warns before leaving unsaved changes, but not on moving between steps, and stays on request", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    clickBack(3);
    cy.get('[data-cy="dialogModal"]').should("not.exist");

    cy.then(() => history.push("/home"));
    cy.get('[data-cy="warningText-You have unsaved changes"]').should(
      "have.text",
      "If you leave this page, your changes will be lost."
    );
    cy.get('[data-cy="submitBtn-You have unsaved changes"]').should(
      "have.text",
      "Leave without saving"
    );
    cy.get('[data-cy="modal-cancel-btn"]')
      .should("have.text", "Stay on this page")
      .click();
    cy.get('[data-cy="dialogModal"]').should("not.exist");
    cy.get('[data-cy="cct-edit-programme-details"]').should("exist");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/cct/create");
    });

    cy.get('[data-cy="cct-back-link"]').click();
    cy.get('[data-cy="submitBtn-You have unsaved changes"]').click();
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/cct");
    });
  });

  it("leaves without saving once confirmed, including from the browser's back button", () => {
    mountCct("/cct");
    cy.get('[data-cy="cct-new-calculation"]').click();
    selectOption("specialty", "Paediatrics");
    cy.get('[data-cy="startDate-input"]').type("2023-08-02");

    cy.then(() => history.goBack());
    cy.get('[data-cy="submitBtn-You have unsaved changes"]').should("exist");
    cy.location("pathname").should("equal", "/cct");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/cct/create");
    });

    cy.get('[data-cy="submitBtn-You have unsaved changes"]').click();
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
    cy.location("pathname").should("equal", "/cct");
  });

  it("leaves for the page the browser's forward button was going to", () => {
    mountCct();
    cy.get('[data-cy="cct-programme-details-form"]').should("exist");
    cy.then(() => history.push("/home"));
    cy.get('[data-cy="cct-programme-details-form"]').should("not.exist");
    cy.then(() => history.goBack());
    selectOption("specialty", "Paediatrics");

    cy.then(() => history.goForward());
    cy.get('[data-cy="submitBtn-You have unsaved changes"]').click();
    cy.get('[data-cy="cct-programme-details-form"]').should("not.exist");
    cy.location("pathname").should("equal", "/home");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/home");
    });
  });

  it("leaves for the page a jump back through the browser's history was going to", () => {
    history.push("/home");
    mountCct("/cct");
    cy.get('[data-cy="cct-new-calculation"]').click();
    selectOption("specialty", "Paediatrics");

    cy.then(() => history.go(-2));
    cy.get('[data-cy="submitBtn-You have unsaved changes"]').click();
    cy.get('[data-cy="cct-programme-details-form"]').should("not.exist");
    cy.location("pathname").should("equal", "/home");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/home");
    });
  });

  it("stays after the browser's back button on request, and puts the address back", () => {
    mountCct("/cct");
    cy.get('[data-cy="cct-new-calculation"]').click();
    selectOption("specialty", "Paediatrics");

    cy.then(() => history.goBack());
    cy.get('[data-cy="modal-cancel-btn"]').click();
    cy.get('[data-cy="dialogModal"]').should("not.exist");
    cy.location("pathname").should("equal", "/cct/create");
    selectedValue("specialty").should("have.text", "Paediatrics");

    cy.then(() => history.goBack());
    cy.get('[data-cy="warningText-You have unsaved changes"]').should("exist");
  });

  it("keeps the page and the address in step when the browser moves again while the warning is open", () => {
    mountCct("/cct");
    cy.get('[data-cy="cct-new-calculation"]').click();
    selectOption("specialty", "Paediatrics");

    cy.then(() => history.goBack());
    cy.get('[data-cy="warningText-You have unsaved changes"]').should("exist");
    cy.location("pathname").should("equal", "/cct");
    cy.then(() => history.goForward());
    cy.location("pathname").should("equal", "/cct/create");
    cy.get('[data-cy="modal-cancel-btn"]').click();
    cy.get('[data-cy="dialogModal"]').should("not.exist");
    cy.location("pathname").should("equal", "/cct/create");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/cct/create");
    });

    cy.then(() => history.goBack());
    cy.get('[data-cy="warningText-You have unsaved changes"]').should("exist");
  });

  it("lets an opened calculation be looked through and left without a warning", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="cct-change-changes"]').click();
    cy.get('[data-cy^="cct-edit-change-"]').click();
    cy.get('[data-cy="cct-change-form-cancel"]').click();

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
    cy.get('[data-cy="dialogModal"]').should("not.exist");
  });

  it("warns before leaving an opened calculation once a change is removed", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="cct-change-changes"]').click();
    cy.get('[data-cy^="cct-remove-change-"]').click();
    cy.get('[data-cy="submitBtn-Remove"]').click();

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="warningText-You have unsaved changes"]').should("exist");
    cy.then(() => {
      expect(history.location.pathname).to.equal(`/cct/${savedCalculationId}`);
    });
  });

  it("deletes an opened calculation with unsaved changes without warning about them", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    cy.intercept("DELETE", savedCalculationUrl, { body: true });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="calculationName-input"]').type(" (old)");

    cy.get('[data-cy="cct-delete"]').click();
    cy.get('[data-cy="submitBtn-Delete"]').click();
    cy.get('[data-cy="cct-deleted-banner"]').should("exist");
    cy.get('[data-cy="dialogModal"]').should("not.exist");
  });

  it("starts over without asking when nothing has been entered", () => {
    mountCct();
    cy.get('[data-cy="cct-start-over"]').should("have.text", "Start over");
    cy.get('[data-cy="cct-start-over"]').click();

    cy.get('[data-cy="dialogModal"]').should("not.exist");
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 1 of 5 - Programme details"
    );
    cy.get('[data-cy="cct-programme-details-form"]').should("exist");
  });

  it("offers Start over on every step of a new calculation, and stays on Cancel", () => {
    mountCct();
    saveProgrammeDetails();
    [1, 2, 3].forEach(() => {
      cy.get('[data-cy="cct-start-over"]').should("exist");
      clickContinue();
    });
    addParentalLeaveChangeAndWait();

    cy.get('[data-cy="cct-start-over"]').click();
    cy.get('[data-cy="warningText-Start over"]').should(
      "have.text",
      "If you start over, everything you have entered will be cleared."
    );
    cy.get('[data-cy="submitBtn-Start over"]').should(
      "have.text",
      "Start over"
    );
    cy.get('[data-cy="modal-cancel-btn"]').click();

    cy.get('[data-cy="dialogModal"]').should("not.exist");
    cy.get('[data-cy="cct-start-over"]').should("have.focus");
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 4 of 5 - Changes"
    );
    cy.get('[data-cy^="cct-edit-change-"]').should("have.length", 1);
  });

  it("clears everything and goes back to an empty step 1 once confirmed", () => {
    mountCct();
    saveProgrammeDetails();
    goToChanges();
    addParentalLeaveChangeAndWait();
    cy.get('[data-cy="cct-continue"]').click();
    cy.get('[data-cy="calculationName-input"]').type("Parental leave in 2024");

    cy.get('[data-cy="cct-start-over"]').click();
    cy.get('[data-cy="submitBtn-Start over"]').click();

    cy.get('[data-cy="dialogModal"]').should("not.exist");
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 1 of 5 - Programme details"
    );
    cy.get('[data-cy="cct-programme-details-form"]').should("exist");
    selectedValue("specialty").should("not.exist");
    cy.get('[data-cy="startDate-input"]').should("not.exist");
    cy.get('[data-cy="cct-back-link"]').should("have.text", "Back to CCT home");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/cct/create");
    });

    saveProgrammeDetails();
    cy.get('[data-cy="cct-return-to-summary"]').should("not.exist");
    clickContinue(3);
    cy.get('[data-cy^="cct-edit-change-"]').should("not.exist");
    cy.get('[data-cy="cct-continue"]').click();
    cy.get('[data-cy="calculationName-input"]').should("have.value", "");
  });

  it("doesn't warn about leaving after starting over with nothing re-entered", () => {
    mountCct();
    selectOption("specialty", "Paediatrics");
    cy.get('[data-cy="cct-start-over"]').click();
    cy.get('[data-cy="submitBtn-Start over"]').click();
    cy.get('[data-cy="dialogModal"]').should("not.exist");

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
    cy.get('[data-cy="dialogModal"]').should("not.exist");
  });

  it("doesn't offer Start over on an opened calculation", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="cct-result-summary"]').should("exist");
    cy.get('[data-cy="cct-start-over"]').should("not.exist");

    cy.get('[data-cy="cct-change-programme-details"]').click();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 1 of 5 - Programme details"
    );
    cy.get('[data-cy="cct-start-over"]').should("not.exist");
  });

  it("warns before leaving when only a dropdown option has been picked", () => {
    mountCct();
    selectOption("specialty", "Paediatrics");

    cy.then(() => history.push("/home"));
    cy.get('[data-cy="warningText-You have unsaved changes"]').should("exist");
    cy.then(() => {
      expect(history.location.pathname).to.equal("/cct/create");
    });
  });

  it("warns before leaving part-way through adding a change", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="cct-change-changes"]').click();
    cy.get('[data-cy="cct-add-change"]').click();
    selectOption("type", "Parental leave");

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="warningText-You have unsaved changes"]').should("exist");
  });

  it("warns before leaving once an opened calculation's name is edited", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="calculationName-input"]').type(" (old)");

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="warningText-You have unsaved changes"]').should("exist");
  });

  it("keeps an edited name when moving between steps, and warns before leaving it", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="calculationName-input"]').clear();
    cy.get('[data-cy="calculationName-input"]').type("Renamed");
    cy.get('[data-cy="cct-change-changes"]').click();
    cy.get('[data-cy="cct-save-form"]').should("not.exist");

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="warningText-You have unsaved changes"]').should("exist");
    cy.get('[data-cy="modal-cancel-btn"]').click();
    cy.get('[data-cy="cct-continue"]').click();
    cy.get('[data-cy="calculationName-input"]').should("have.value", "Renamed");
  });

  it("stops warning once an edited name is put back as it was", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="calculationName-input"]').type(" (old)");
    cy.get('[data-cy="calculationName-input"]').clear();
    cy.get('[data-cy="calculationName-input"]').type("Parental leave in 2024");

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
    cy.get('[data-cy="dialogModal"]').should("not.exist");
  });

  it("doesn't count hiding the assumed full-time periods as an unsaved change", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="cct-hide-assumed-periods"]').check();

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
    cy.get('[data-cy="dialogModal"]').should("not.exist");
  });

  it("doesn't count programme details confirmed without a change as an unsaved change", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="cct-change-programme-details"]').click();
    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="cct-programme-details-summary"]').should("exist");

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
    cy.get('[data-cy="dialogModal"]').should("not.exist");
  });

  it("doesn't count an overridden start grade confirmed without a change as an unsaved change", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: saveWithMockBackend({
        name: "Entered at ST4",
        programmeDetails: {
          ...paediatricsProgrammeDetails("2023-08-02"),
          startGrade: "ST4",
          startGradeOverrideNotes: "Entered at ST4"
        },
        changes: [parentalLeaveChange]
      }).body
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="cct-change-programme-details"]').click();
    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="cct-programme-details-summary"]').should(
      "contain.text",
      "ST4"
    );

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
    cy.get('[data-cy="dialogModal"]').should("not.exist");
  });

  it("stops warning once a removed change is added back as it was", () => {
    cy.intercept("GET", savedCalculationUrl, {
      body: savedCalculation("Parental leave in 2024")
    });
    mountCct(`/cct/${savedCalculationId}`);
    cy.get('[data-cy="cct-change-changes"]').click();
    cy.get('[data-cy^="cct-remove-change-"]').click();
    cy.get('[data-cy="submitBtn-Remove"]').click();
    addParentalLeaveChange();
    cy.get('[data-cy^="cct-change-row-"]').should("have.length", 1);

    cy.then(() => history.push("/cct"));
    cy.get('[data-cy="cct-new-calculation"]').should("exist");
    cy.get('[data-cy="dialogModal"]').should("not.exist");
  });
});

describe("Cct training time and grade progression adjustments", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/trainee/cct/specialties", {
      body: mockCctSpecialties
    });
    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(calculateWithMockBackend(req.body))
    ).as("calculate");
    cy.intercept("GET", calculationsUrl, { body: [] });
  });

  it("records none of either kind until some is added", () => {
    mountCct();
    saveProgrammeDetails();
    clickContinue();

    cy.get('[data-cy="cct-no-additional-time"]').should("exist");
    cy.get('[data-cy="cct-no-accelerated-time"]').should("exist");
    cy.get('[data-cy="cct-adjusted-length"]').should("not.exist");
    clickContinue();
    cy.get('[data-cy="cct-no-grade-progression-adjustments"]').should("exist");
  });

  it("adds training time against a grade, sends it to the calculation and adjusts the length", () => {
    mountCct();
    saveProgrammeDetails();
    cy.wait("@calculate");
    clickContinue();

    addTrainingTime("additional", "ST2", "6", "Outcome 3 following ARCP");

    cy.wait("@calculate")
      .its("request.body.programmeDetails")
      .should("deep.include", {
        additionalTrainingTime: [
          { grade: "ST2", months: 6, notes: "Outcome 3 following ARCP" }
        ],
        acceleratedTrainingTime: []
      });
    cy.get('[data-cy="cct-additional-time-0-row"]')
      .should("contain.text", "ST2")
      .and("contain.text", "6 months")
      .and("contain.text", "Outcome 3 following ARCP");

    addTrainingTime("additional", "ST4", "4", "Second outcome 3");
    addTrainingTime("accelerated", "ST1", "3", "Recognised prior learning");

    cy.get('[data-cy="cct-additional-time-total-row"]').should(
      "contain.text",
      "10 months"
    );
    cy.get('[data-cy="cct-accelerated-time-total-row"]').should(
      "contain.text",
      "3 months"
    );
    cy.get('[data-cy="cct-adjusted-length-months"]').should(
      "have.text",
      "91 months"
    );
  });

  it("offers the grades in the calculated grade progression", () => {
    mountCct();
    saveProgrammeDetails();
    clickContinue();
    cy.get('[data-cy="cct-add-additional-time"]').click();

    cy.get('[data-cy="grade"] .react-select__control').click();
    cy.get(".react-select__menu")
      .should("contain.text", "ST1")
      .and("contain.text", "ST7")
      .and("not.contain.text", "ST8")
      .and("not.contain.text", "CT1")
      .and("not.contain.text", "F2");
  });

  it("asks for a grade, whole months and a reason, and caps accelerated time at 12 months in total", () => {
    mountCct();
    saveProgrammeDetails();
    clickContinue();
    cy.get('[data-cy="cct-add-accelerated-time"]').click();
    cy.get('[data-cy="cct-training-time-form-submit"]').click();
    cy.get('[data-cy="errorSummary"]')
      .should("contain.text", "Please choose a grade.")
      .and("contain.text", "Enter a whole number of months between 1 and 24.")
      .and(
        "contain.text",
        "Please enter a reason for accelerated training time."
      );
    cy.get('[data-cy="cct-training-time-form-cancel"]').click();

    addTrainingTime("accelerated", "ST1", "8", "Prior learning");
    addTrainingTime("accelerated", "ST2", "5", "More prior learning");
    cy.get('[data-cy="errorSummary"]').should(
      "contain.text",
      "Total accelerated training time cannot be more than 12 months."
    );

    cy.get("#months").clear();
    cy.get("#months").type("4");
    cy.get('[data-cy="cct-training-time-form-submit"]').click();
    cy.get('[data-cy="cct-training-time-form"]').should("not.exist");
    cy.get('[data-cy="cct-accelerated-time-total-row"]').should(
      "contain.text",
      "12 months"
    );
  });

  it("edits an entry, and removes it only once confirmed", () => {
    mountCct();
    saveProgrammeDetails();
    clickContinue();
    addTrainingTime("additional", "ST2", "6", "Outcome 3");

    cy.get('[data-cy="cct-additional-time-0-edit"]').click();
    cy.get("#months").should("have.value", "6");
    cy.get("#months").clear();
    cy.get("#months").type("3");
    cy.get('[data-cy="cct-training-time-form-submit"]').click();
    cy.get('[data-cy="cct-additional-time-0-row"]').should(
      "contain.text",
      "3 months"
    );

    cy.get('[data-cy="cct-additional-time-0-remove"]').click();
    cy.get('[data-cy="modal-cancel-btn"]').click();
    cy.get('[data-cy="cct-additional-time-0-row"]').should("exist");

    cy.get('[data-cy="cct-additional-time-0-remove"]').click();
    cy.get('[data-cy="submitBtn-Remove"]').click();
    cy.get('[data-cy="cct-no-additional-time"]').should("exist");
    cy.get('[data-cy="cct-adjusted-length"]').should("not.exist");
  });

  it("puts focus back on the button that opened the form when it closes", () => {
    mountCct();
    saveProgrammeDetails();
    clickContinue();

    cy.get('[data-cy="cct-add-additional-time"]').click();
    cy.get('[data-cy="cct-training-time-form-cancel"]').click();
    cy.focused().should("have.attr", "data-cy", "cct-add-additional-time");

    addTrainingTime("additional", "ST2", "6", "Outcome 3");
    cy.focused().should("have.attr", "data-cy", "cct-add-additional-time");

    cy.get('[data-cy="cct-additional-time-0-edit"]').click();
    cy.get('[data-cy="cct-training-time-form-cancel"]').click();
    cy.focused().should("have.attr", "data-cy", "cct-additional-time-0-edit");

    cy.get('[data-cy="cct-additional-time-0-edit"]').click();
    cy.get('[data-cy="cct-training-time-form-submit"]').click();
    cy.focused().should("have.attr", "data-cy", "cct-additional-time-0-edit");
  });

  it("holds Continue and the other edits back while a training time form is open", () => {
    mountCct();
    saveProgrammeDetails();
    clickContinue();
    cy.get('[data-cy="cct-add-additional-time"]').click();

    cy.get('[data-cy="cct-continue"]').should("not.exist");
    cy.get('[data-cy="cct-add-accelerated-time"]').should("be.disabled");

    cy.get('[data-cy="cct-training-time-form-cancel"]').click();
    cy.get('[data-cy="cct-continue"]').should("exist");
    cy.get('[data-cy="cct-add-accelerated-time"]').should("be.enabled");
  });

  it("puts each kind of adjustment on its own step", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="cct-grade-years-table"]').should("exist");
    cy.get('[data-cy="cct-training-time-section"]').should("not.exist");
    cy.get('[data-cy="cct-grade-progression-section"]').should("not.exist");

    clickContinue();
    cy.get('[data-cy="cct-programme-details-inset"]').should("exist");
    cy.get('[data-cy="cct-grade-years-table"]').should("exist");
    cy.get('[data-cy="cct-training-time-section"]').should("exist");
    cy.get('[data-cy="cct-grade-progression-section"]').should("not.exist");

    clickContinue();
    cy.get('[data-cy="cct-programme-details-inset"]').should("exist");
    cy.get('[data-cy="cct-grade-years-table"]').should("exist");
    cy.get('[data-cy="cct-grade-progression-section"]').should("exist");
    cy.get('[data-cy="cct-training-time-section"]').should("not.exist");
  });

  it("rejects a programme length the accelerated time would use up", () => {
    mountCct();
    saveProgrammeDetails();
    clickContinue();
    addTrainingTime("accelerated", "ST1", "12", "Prior learning");

    clickBack();
    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get("#lengthMonths").clear();
    cy.get("#lengthMonths").type("12");
    cy.get("#lengthOverrideNotes").type("Agreed locally");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="errorSummary"]').should(
      "contain.text",
      "Adjusted training duration must be greater than zero."
    );
  });

  it("records the grade progression adjustments in their own section", () => {
    mountCct();
    saveProgrammeDetails();
    clickContinue(2);
    cy.get('[data-cy="cct-edit-grade-progression"]')
      .should("have.text", "Add grade progression adjustments")
      .click();

    cy.get('[data-cy="hasSkippedGrade-checkbox"]').check();
    cy.get('[data-cy="cct-grade-progression-submit"]').click();
    cy.get('[data-cy="errorSummary"]')
      .should("contain.text", "Please choose the grade year to skip.")
      .and("contain.text", "Please enter a reason for skipping a grade year.");
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    selectOption("skippedGrade", "ST2");
    cy.get("#skippedGradeNotes").type("Core competencies");
    cy.get('[data-cy="cct-grade-progression-submit"]').click();

    cy.get('[data-cy="cct-grade-progression-summary"]')
      .should("contain.text", "Skipped grade year")
      .and("contain.text", "ST2")
      .and("contain.text", "Core competencies");
    cy.get('[data-cy="cct-edit-grade-progression"]').should(
      "have.text",
      "Edit grade progression adjustments"
    );
    cy.get('[data-cy="cct-continue"]').should("exist");
  });

  it("offers an 18-month final year only for a programme length with a half year", () => {
    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(calculateWithMockBackend(req.body))
    ).as("calculate");
    mountCct();
    saveProgrammeDetails();
    cy.wait("@calculate");
    clickContinue(2);
    cy.get('[data-cy="cct-edit-grade-progression"]').click();
    cy.get('[data-cy="hasEighteenMonthFinalYear-checkbox"]').should(
      "not.exist"
    );
    cy.get('[data-cy="cct-grade-progression-cancel"]').click();

    clickBack(2);
    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get("#lengthMonths").clear();
    cy.get("#lengthMonths").type("90");
    cy.get("#lengthOverrideNotes").type("Agreed locally");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.wait("@calculate");
    clickContinue(2);
    cy.get('[data-cy="cct-edit-grade-progression"]').click();
    cy.get('[data-cy="cct-eighteen-month-final-grade"]').should("not.exist");
    cy.get('[data-cy="hasEighteenMonthFinalYear-checkbox"]').check();
    cy.get('[data-cy="cct-eighteen-month-final-grade"]').should(
      "contain.text",
      "Final grade lasting 18 months: ST7"
    );
    cy.get('[data-cy="hasSkippedGrade-checkbox"]').check();
    selectOption("skippedGrade", "ST3");
    cy.get('[data-cy="cct-eighteen-month-final-grade"]').should(
      "contain.text",
      "Final grade lasting 18 months: ST8"
    );
    cy.get("#eighteenMonthFinalGradeNotes").type("ICM dual specialty");
    cy.get("#skippedGradeNotes").type("Core competencies");

    cy.get('[data-cy="cct-grade-progression-submit"]').click();
    cy.wait("@calculate")
      .its("request.body.programmeDetails")
      .should("deep.include", {
        eighteenMonthFinalGrade: "ST8",
        eighteenMonthFinalGradeNotes: "ICM dual specialty"
      });
    cy.get('[data-cy="cct-grade-progression-summary"]')
      .should("contain.text", "18-month final year")
      .and("contain.text", "ST8");

    cy.get('[data-cy="cct-edit-grade-progression"]').click();
    cy.get('[data-cy="hasEighteenMonthFinalYear-checkbox"]').uncheck();
    cy.get('[data-cy="cct-grade-progression-submit"]').click();
    cy.wait("@calculate")
      .its("request.body.programmeDetails")
      .should("deep.include", {
        eighteenMonthFinalGrade: null,
        eighteenMonthFinalGradeNotes: ""
      });
  });

  it("lets a saved 18-month final year be unticked once the length has no half year", () => {
    mountSavedCalculationWith({
      eighteenMonthFinalGrade: "ST6",
      eighteenMonthFinalGradeNotes: "ICM dual specialty"
    });
    cy.get('[data-cy="cct-change-grade-progression-adjustments"]').click();
    cy.get('[data-cy="cct-edit-grade-progression"]').click();
    cy.get('[data-cy="hasEighteenMonthFinalYear-checkbox"]').should(
      "be.checked"
    );
    cy.get('[data-cy="cct-eighteen-month-final-grade"]').should(
      "contain.text",
      "Final grade lasting 18 months: ST6"
    );
    cy.get('[data-cy="hasEighteenMonthFinalYear-checkbox"]').uncheck();
    cy.get('[data-cy="cct-grade-progression-submit"]').click();
    cy.get('[data-cy="cct-no-grade-progression-adjustments"]').should("exist");
  });

  it("shows the adjustments read-only on the summary", () => {
    mountCct();
    saveProgrammeDetails();
    clickContinue();
    addTrainingTime("additional", "ST2", "6", "Outcome 3");
    clickContinue(3);

    cy.get('[data-cy="cct-training-time-summary"]')
      .first()
      .within(() => {
        cy.get('[data-cy="cct-additional-time-0-row"]')
          .should("contain.text", "ST2")
          .and("contain.text", "6 months")
          .and("contain.text", "Outcome 3");
        cy.get('[data-cy="cct-no-accelerated-time"]').should("exist");
        cy.get('[data-cy="cct-adjusted-length-months"]').should(
          "have.text",
          "90 months"
        );
        cy.get("button").should("not.exist");
      });
    cy.get('[data-cy="cct-no-grade-progression-adjustments"]').should("exist");
  });

  it("lists training time in a grade outside the progression, and hides Continue until it is fixed", () => {
    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(calculateWithGradeChecks(req.body))
    );
    mountSavedCalculationWith({
      additionalTrainingTime: [{ grade: "ST8", months: 6, notes: "Outcome 3" }]
    });
    cy.get('[data-cy="cct-change-training-time-adjustments"]').click();

    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 2 of 5 - Training time adjustments"
    );
    cy.get('[data-cy="cct-invalid-adjustments-summary"]').should(
      "contain.text",
      "Additional training time (ST8, 6 months): ST8 is not part of this programme's grade progression."
    );
    cy.get('[data-cy="cct-additional-time-0-grade-error"]').should(
      "contain.text",
      "ST8 is not part of this programme's grade progression."
    );
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    cy.get('[data-cy="cct-invalid-adjustments-summary"] a').click();
    cy.focused().should("have.attr", "data-cy", "cct-additional-time-0-edit");

    cy.focused().click();
    cy.get('[data-cy="grade"] .react-select__control').click();
    cy.get(".react-select__menu")
      .should("contain.text", "ST7")
      .and("contain.text", "ST8")
      .and("not.contain.text", "ST9");
    cy.get(".react-select__menu").contains("ST2").click();
    cy.get('[data-cy="cct-training-time-form-submit"]').click();
    cy.get('[data-cy="cct-invalid-adjustments-summary"]').should("not.exist");
    cy.get('[data-cy="cct-additional-time-0-grade-error"]').should("not.exist");
    cy.get('[data-cy="cct-continue"]').should("exist");
    cy.get('[data-cy="cct-return-to-summary"]').should("exist");
  });

  it("lists a skipped grade outside the progression and links to the grade progression adjustments", () => {
    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(calculateWithGradeChecks(req.body))
    );
    mountSavedCalculationWith({
      skippedGrade: "ST9",
      skippedGradeNotes: "Core competencies"
    });
    cy.get('[data-cy="cct-change-grade-progression-adjustments"]').click();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 3 of 5 - Grade progression adjustments"
    );

    cy.get('[data-cy="cct-invalid-adjustments-summary"]').should(
      "contain.text",
      "Skipped grade year: ST9 is not part of this programme's grade progression."
    );
    cy.get('[data-cy="cct-skippedGrade-error"]').should(
      "contain.text",
      "ST9 is not part of this programme's grade progression."
    );
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    cy.get('[data-cy="cct-invalid-adjustments-summary"] a').click();
    cy.focused().should("have.attr", "data-cy", "cct-edit-grade-progression");
  });

  it("lists a missing skipped grade reason against the skipped grade year", () => {
    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(
        calculateWithErrors([
          {
            pointer: "#/programmeDetails/skippedGradeNotes",
            detail: "Please enter a reason for skipping a grade year."
          }
        ])(req.body)
      )
    );
    mountSavedCalculationWith({ skippedGrade: "ST2", skippedGradeNotes: "" });
    cy.get('[data-cy="cct-change-grade-progression-adjustments"]').click();

    cy.get('[data-cy="cct-invalid-adjustments-summary"]').should(
      "contain.text",
      "Skipped grade year: Please enter a reason for skipping a grade year."
    );
    cy.get('[data-cy="cct-skippedGrade-error"]').should(
      "contain.text",
      "Please enter a reason for skipping a grade year."
    );
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    cy.get('[data-cy="cct-invalid-adjustments-summary"] a').click();
    cy.focused().should("have.attr", "data-cy", "cct-edit-grade-progression");
  });

  it("lists a training time total over the limit against its kind and links to the first entry", () => {
    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(
        calculateWithErrors([
          {
            pointer: "#/programmeDetails/additionalTrainingTime",
            detail:
              "Total additional training time cannot be more than 24 months."
          }
        ])(req.body)
      )
    );
    mountSavedCalculationWith({
      additionalTrainingTime: [
        { grade: "ST2", months: 6, notes: "Outcome 3" },
        { grade: "ST3", months: 6, notes: "Second outcome 3" }
      ]
    });
    cy.get('[data-cy="cct-change-training-time-adjustments"]').click();

    cy.get('[data-cy="cct-invalid-adjustments-summary"]').should(
      "contain.text",
      "Additional training time: Total additional training time cannot be more than 24 months."
    );
    cy.get('[data-cy$="-error"]').should("not.exist");
    cy.get('[data-cy="cct-continue"]').should("not.exist");

    cy.get('[data-cy="cct-invalid-adjustments-summary"] a').click();
    cy.focused().should("have.attr", "data-cy", "cct-additional-time-0-edit");
  });

  it("shows each invalid adjustment in its own card instead of saving or printing", () => {
    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(calculateWithGradeChecks(req.body))
    );
    mountSavedCalculationWith({
      additionalTrainingTime: [{ grade: "ST8", months: 6, notes: "Outcome 3" }],
      skippedGrade: "ST9",
      skippedGradeNotes: "Core competencies"
    });

    cy.get('[data-cy="cct-summary-errors"] a').then($links => {
      expect($links.toArray().map(link => link.textContent)).to.deep.equal([
        "Training time adjustments",
        "Grade progression adjustments"
      ]);
    });
    cy.get('[data-cy="cct-card-error-training-time-adjustments"]').should(
      "contain.text",
      "Additional training time (ST8, 6 months): ST8 is not part of this programme's grade progression."
    );
    cy.get('[data-cy="cct-card-error-grade-progression-adjustments"]').should(
      "contain.text",
      "Skipped grade year: ST9 is not part of this programme's grade progression."
    );
    cy.get('[data-cy="cct-card-error-programme-details"]').should("not.exist");
    cy.get('[data-cy="cct-card-error-changes"]').should("not.exist");
    cy.get('[data-cy="cct-save-blocked"]').should("exist");
    cy.get('[data-cy="cct-save-form"]').should("not.exist");
    cy.get('[data-cy="cct-save-pdf"]').should("not.exist");

    cy.get(
      '[data-cy="cct-summary-error-link-grade-progression-adjustments"]'
    ).click();
    cy.focused().should(
      "have.attr",
      "data-cy",
      "cct-change-grade-progression-adjustments"
    );

    cy.get(
      '[data-cy="cct-summary-error-link-training-time-adjustments"]'
    ).click();
    cy.focused().should(
      "have.attr",
      "data-cy",
      "cct-change-training-time-adjustments"
    );
    cy.focused().click();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Step 2 of 5 - Training time adjustments"
    );
    cy.get('[data-cy="cct-invalid-adjustments-summary"]').should(
      "contain.text",
      "ST8 is not part of this programme's grade progression."
    );
  });
});

describe("CctTrainingTimeSection entry cap", () => {
  const mountWithEntries = (count: number) => {
    const additionalTrainingTime = new Array<CctTrainingTime>(count).fill({
      grade: "ST1",
      months: 1,
      notes: "Outcome 3"
    });
    mount(
      <CctTrainingTimeSection
        programmeDetails={{
          ...paediatricsProgrammeDetails("2023-08-02"),
          additionalTrainingTime
        }}
        result={null}
        calculationStatus="idle"
        invalidAdjustments={[]}
        isFormOpen={false}
        onChange={cy.stub()}
        onFormOpenChange={cy.stub()}
        onDirtyChange={cy.stub()}
      />
    );
  };

  it("offers another entry below the maximum", () => {
    mountWithEntries(CCT_MAX_TRAINING_TIME_ENTRIES - 1);
    cy.get('[data-cy="cct-add-additional-time"]').should("exist");
    cy.get('[data-cy="cct-max-additional-time"]').should("not.exist");
  });

  it("replaces Add with the limit at the maximum, for that kind only", () => {
    mountWithEntries(CCT_MAX_TRAINING_TIME_ENTRIES);
    cy.get('[data-cy="cct-add-additional-time"]').should("not.exist");
    cy.get('[data-cy="cct-max-additional-time"]').should(
      "contain.text",
      "You have reached the maximum of 20 additional training time entries."
    );
    cy.get('[data-cy="cct-add-accelerated-time"]').should("exist");
  });

  it("puts focus on the new entry when adding it takes the place of Add", () => {
    function StatefulSection() {
      const [programmeDetails, setProgrammeDetails] = useState({
        ...paediatricsProgrammeDetails("2023-08-02"),
        additionalTrainingTime: new Array<CctTrainingTime>(
          CCT_MAX_TRAINING_TIME_ENTRIES - 1
        ).fill({ grade: "ST1", months: 1, notes: "Outcome 3" })
      });
      const [isFormOpen, setIsFormOpen] = useState(false);
      return (
        <CctTrainingTimeSection
          programmeDetails={programmeDetails}
          result={null}
          calculationStatus="idle"
          invalidAdjustments={[]}
          isFormOpen={isFormOpen}
          onChange={setProgrammeDetails}
          onFormOpenChange={setIsFormOpen}
          onDirtyChange={() => {}}
        />
      );
    }
    mount(
      <Provider store={createStore()}>
        <Router history={history}>
          <StatefulSection />
        </Router>
      </Provider>
    );

    addTrainingTime("additional", "ST1", "1", "Outcome 3");
    cy.get('[data-cy="cct-max-additional-time"]').should("exist");
    cy.focused().should(
      "have.attr",
      "data-cy",
      `cct-additional-time-${CCT_MAX_TRAINING_TIME_ENTRIES - 1}-edit`
    );
  });
});

describe("CctChangesSection change cap", () => {
  const mountWithChanges = (count: number) => {
    const changes = new Array<CctChange>(count)
      .fill({
        id: "",
        type: "PARENTAL",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        wte: null,
        countsTowardsCompletion: false
      })
      .map((change, index) => ({ ...change, id: `change-${index}` }));
    mount(
      <CctChangesSection
        programmeDetails={null}
        changes={changes}
        calculatedChanges={[]}
        result={null}
        cctDate={null}
        invalidChanges={[]}
        calculationStatus="idle"
        isRetrying={false}
        isFormOpen={false}
        onRetry={cy.stub()}
        onChange={cy.stub()}
        onFormOpenChange={cy.stub()}
        onDirtyChange={cy.stub()}
      />
    );
  };

  it("offers another change below the maximum", () => {
    mountWithChanges(CCT_MAX_CHANGES - 1);
    cy.get('[data-cy="cct-add-change"]').should("exist");
    cy.get('[data-cy="cct-max-changes"]').should("not.exist");
  });

  it("replaces Add change with the limit at the maximum", () => {
    mountWithChanges(CCT_MAX_CHANGES);
    cy.get('[data-cy="cct-add-change"]').should("not.exist");
    cy.get('[data-cy="cct-max-changes"]').should(
      "contain.text",
      "You have reached the maximum of 50 changes."
    );
  });
});

describe("CctGradeYearsTable", () => {
  const gradeYear = (
    yearNumber: number,
    grade: CctGradeYear["grade"],
    endDate: string,
    overrides: Partial<CctGradeYear> = {}
  ): CctGradeYear => ({
    yearNumber,
    grade,
    endDate,
    skippedGradeBeforeThisRow: null,
    extendedToEighteenMonths: false,
    exceedsKnownTrainingGrade: false,
    additionalMonths: 0,
    acceleratedMonths: 0,
    ...overrides
  });

  it("marks the skipped, 18-month and past-highest years and explains each", () => {
    mount(
      <CctGradeYearsTable
        gradeYears={[
          gradeYear(1, "ST1", "2024-07-31"),
          gradeYear(2, "ST3", "2025-07-31", {
            skippedGradeBeforeThisRow: "ST2"
          }),
          gradeYear(3, "ST4", "2027-01-30", {
            extendedToEighteenMonths: true
          }),
          gradeYear(4, null, "2028-01-30", {
            exceedsKnownTrainingGrade: true
          })
        ]}
        programmeDetails={{
          ...paediatricsProgrammeDetails("2023-08-02"),
          eighteenMonthFinalGrade: "ST4",
          eighteenMonthFinalGradeNotes: "Agreed with my TPD",
          skippedGrade: "ST2",
          skippedGradeNotes: "Core competencies"
        }}
      />
    );

    cy.get('[data-cy="cct-grade-year-2-row"]').should(
      "contain.text",
      "ST3 (ST2 skipped)"
    );
    cy.get('[data-cy="cct-grade-year-3-row"]')
      .should("contain.text", "ST4 (18-month final year)")
      .and("contain.text", "30/01/2027");
    cy.get('[data-cy="cct-grade-year-4-row"]').should(
      "contain.text",
      "— (grade label not automatically assigned)"
    );
    cy.get('[data-cy="cct-grade-years-hint"]').should("exist");
    cy.get('[data-cy="cct-grade-years-eighteen-month-hint"]').should(
      "contain.text",
      "ST4 is an 18-month final year."
    );
    cy.get('[data-cy="cct-grade-years-skipped-hint"]').should(
      "contain.text",
      "ST2 is skipped, so later years move up a grade."
    );
    cy.get('[data-cy="cct-grade-years-past-highest-hint"]').should(
      "contain.text",
      "Check your official training record."
    );
    cy.get('[data-cy="cct-grade-years-training-time-hint"]').should(
      "not.exist"
    );
  });

  it("marks the years with additional or accelerated training time and explains them", () => {
    mount(
      <CctGradeYearsTable
        gradeYears={[
          gradeYear(1, "ST1", "2024-04-30", { acceleratedMonths: 3 }),
          gradeYear(2, "ST2", "2025-10-31", { additionalMonths: 6 }),
          gradeYear(3, "ST3", "2026-10-31")
        ]}
        programmeDetails={paediatricsProgrammeDetails("2023-08-02")}
      />
    );

    cy.get('[data-cy="cct-grade-year-1-row"]').should(
      "contain.text",
      "ST1 (-3 months accelerated)"
    );
    cy.get('[data-cy="cct-grade-year-2-row"]').should(
      "contain.text",
      "ST2 (+6 months additional)"
    );
    cy.get('[data-cy="cct-grade-year-3-row"]')
      .should("contain.text", "ST3")
      .and("not.contain.text", "(");
    cy.get('[data-cy="cct-grade-years-training-time-hint"]').should(
      "contain.text",
      "Additional training time moves that grade's end date and every later grade on. Accelerated training time brings them forward."
    );
  });
});
