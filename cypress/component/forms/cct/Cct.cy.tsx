import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { mount } from "cypress/react";
import cctReferenceReducer from "../../../../redux/slices/cctReferenceSlice";
import cctReducer from "../../../../redux/slices/cctSlice";
import { Cct } from "../../../../components/forms/cct/Cct";
import history from "../../../../components/navigation/history";
import { mockCctCalculateResponses } from "../../../../mock-data/mock-cct-calculate-responses";
import { mockCctSpecialties } from "../../../../mock-data/mock-cct-specialties";
import {
  CctCalculateRequest,
  CctCalculationSaveRequest
} from "../../../../services/CctService";

const createStore = () =>
  configureStore({
    reducer: { cctReference: cctReferenceReducer, cct: cctReducer }
  });

const mountCct = () => {
  history.push("/cct/create");
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

const saveWithMockBackend = (request: CctCalculationSaveRequest) => {
  const { body } = calculateWithMockBackend(request);
  return {
    statusCode: 201,
    body: {
      id: "5f0c9a3e-8a4d-4c55-9a51-0f6a2f1d7c11",
      name: request.name,
      programmeDetails: request.programmeDetails,
      changes: body.changes,
      result: body.result,
      created: "2026-10-28T12:00:00Z",
      lastModified: "2026-10-28T12:00:00Z"
    }
  };
};

const goToSummary = () => {
  cy.get('[data-cy="navNext"]').click();
  cy.get('[data-cy="navNext"]').click();
};

describe("Cct", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/trainee/cct/specialties", {
      body: mockCctSpecialties
    });
    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply(calculateWithMockBackend(req.body))
    );
  });

  it("starts on part 1 with the programme details form open", () => {
    mountCct();

    cy.get('[data-cy="cct-header"]').should("exist");
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Part 1 of 3 - Programme details"
    );
    cy.get('[data-cy="cct-programme-details-form"]').should("exist");
    cy.get('[data-cy="navPrevious"]').should("not.exist");
    cy.get('[data-cy="navNext"]').should("not.exist");
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
    cy.get('[data-cy="navNext"]').should("exist");

    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get('[data-cy="cct-programme-details-form"]').should("exist");
    cy.get('[data-cy="navNext"]').should("not.exist");

    cy.get('[data-cy="cct-programme-details-cancel"]').click();
    cy.get('[data-cy="navNext"]').should("exist");
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

  it("keeps the error box up and Next hidden until a retry succeeds", () => {
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
    cy.get('[data-cy="navNext"]').should("not.exist");

    cy.intercept("POST", "/api/trainee/cct/calculate", req =>
      req.reply({ ...calculateWithMockBackend(req.body), delay: 1500 })
    );
    cy.get('[data-cy="cct-request-retry"]').click();
    cy.get('[data-cy="cct-request-retry"]').should(
      "have.text",
      "Trying again…"
    );
    cy.focused().should("have.attr", "data-cy", "cct-request-retry");
    cy.get('[data-cy="navNext"]').should("not.exist");

    cy.get('[data-cy="cct-request-error"]').should("not.exist");
    cy.get('[data-cy="navNext"]').click();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Part 2 of 3 - Changes"
    );
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
    cy.get('[data-cy="navNext"]').should("exist");
  });

  it("holds the table back until the first change is added", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();

    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Part 2 of 3 - Changes"
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
    cy.get('[data-cy="navNext"]').click();
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
    cy.get('[data-cy="navNext"]').click();
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
    cy.get('[data-cy="navNext"]').click();
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
    cy.get('[data-cy="navNext"]').click();
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
    cy.get('[data-cy="navNext"]').click();
    addParentalLeaveChange();

    cy.get('[data-cy="cct-changes-table"]').should(
      "have.class",
      "nhsuk-table-responsive"
    );
    // Note: nhsuk-react-components copies the head row's labels into every body cell, so no column is hidden when the row stacks.
    cy.get('[data-cy="cct-projection-row"]')
      .find(".nhsuk-table-responsive__heading")
      .should("contain.text", "WTE");
  });

  it("keeps an LTFT change that runs to completion as its own row and projects from it", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();

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
    cy.get('[data-cy="cct-changes-table"]').should("not.exist");
    cy.get('[data-cy="cct-projected-cct-date"]').should(
      "contain.text",
      "no changes added yet"
    );
  });

  it("reopens a change that runs to completion with its duration preselected", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();

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
    cy.get('[data-cy="navNext"]').click();

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
    cy.get('[data-cy="navNext"]').click();

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
    cy.get('[data-cy="navNext"]').click();
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
    cy.get('[data-cy="navNext"]').click();
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
    cy.get('[data-cy="navNext"]').should("exist");
  });

  it("asks for an end date only once the answers so far call for one", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();
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
    cy.get('[data-cy="navNext"]').click();
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
    cy.get('[data-cy="navNext"]').click();
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
    cy.get('[data-cy="navNext"]').click();
    addParentalLeaveChange();

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
    cy.get('[data-cy="navNext"]').click();

    cy.get('[data-cy="cct-add-change"]').click();

    cy.focused().should("have.id", "type");
  });

  it("scrolls back to the changes table and focuses it when a change is saved", () => {
    cy.viewport(800, 400);
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();
    addParentalLeaveChange();

    cy.get('[data-cy^="cct-edit-change-"]').click();
    cy.get('[data-cy="cct-change-form-submit"]').click();

    cy.focused().should("have.id", "cct-changes-scroll");
    cy.get('[data-cy="cct-changes-scroll"]').should($table => {
      const { top } = $table[0].getBoundingClientRect();
      expect(top, `table top: ${top}`).to.be.closeTo(0, 100);
    });
  });

  it("hides Next on the changes page while a change form is open", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Part 2 of 3 - Changes"
    );
    cy.get('[data-cy="navNext"]').should("exist");

    cy.get('[data-cy="cct-add-change"]').click();
    cy.get('[data-cy="navNext"]').should("not.exist");

    cy.get('[data-cy="cct-change-form-cancel"]').click();
    cy.get('[data-cy="navNext"]').should("exist");
  });

  it("hides Next on the changes page while the calculation fails, until the rejected change is removed", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();

    cy.intercept("POST", "/api/trainee/cct/calculate", req => {
      if (req.body.changes.length > 0) {
        req.reply({ statusCode: 400, body: {} });
      } else {
        req.reply(calculateWithMockBackend(req.body));
      }
    });
    addParentalLeaveChange();
    cy.get('[data-cy="cct-request-error"]').should("exist");
    cy.get('[data-cy="navNext"]').should("not.exist");

    cy.get('[data-cy^="cct-remove-change-"]').click();
    cy.get('[data-cy="cct-request-error"]').should("not.exist");
    cy.get('[data-cy="navNext"]').should("exist");
  });

  it("hides Next on the changes page while a saved change is invalid", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();
    addParentalLeaveChange();
    cy.get('[data-cy="navNext"]').should("exist");

    cy.get('[data-cy="navPrevious"]').click();
    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get('[data-cy="startDate-input"]').clear();
    cy.get('[data-cy="startDate-input"]').type("2024-03-01");
    cy.get('[data-cy="cct-programme-details-submit"]').click();
    cy.get('[data-cy="cct-programme-details-summary"]').should(
      "contain.text",
      "26/02/2031"
    );
    cy.get('[data-cy="navNext"]').click();

    cy.get('[data-cy="cct-invalid-changes-summary"]').should(
      "contain.text",
      "Start date cannot be before programme start"
    );
    cy.get('[data-cy="navNext"]').should("not.exist");

    cy.get('[data-cy^="cct-remove-change-"]').click();
    cy.get('[data-cy="cct-invalid-changes-summary"]').should("not.exist");
    cy.get('[data-cy="navNext"]').should("exist");
  });

  it("flags the projection row as invalid while a change runs past completion, until the change ends on the date quoted", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();

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

    cy.get('[data-cy="navNext"]').should("exist");
    cy.get('[data-cy="cct-invalid-changes-summary"]').should("not.exist");
    cy.get('[data-cy="cct-invalid-projection"]').should("not.exist");
    cy.get('[data-cy="cct-projection-row"]')
      .should("contain.text", "27/02/2031")
      .and("contain.text", "26/02/2031");
  });

  it("shows the summary with the calculated completion date", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();
    cy.get('[data-cy="navNext"]').click();

    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Part 3 of 3 - Summary"
    );
    cy.get('[data-cy="cct-result-summary"]').should(
      "contain.text",
      "29/07/2030"
    );
    cy.get('[data-cy="cct-summary-no-changes"]').should("exist");
    cy.get('[data-cy="cct-changes-table"]').should("not.exist");
    cy.get('[data-cy="cct-no-grade-progression"]').should("exist");
    cy.get('[data-cy="navNext"]').should("not.exist");
    cy.get('[data-cy="navPrevious"]').click();
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Part 2 of 3 - Changes"
    );
  });

  it("saves the named calculation, then shows the home page with a success banner", () => {
    cy.intercept("POST", "/api/trainee/cct/calculation", req =>
      req.reply({ ...saveWithMockBackend(req.body), delay: 500 })
    ).as("save");
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();
    addParentalLeaveChange();
    cy.get('[data-cy="navNext"]').click();

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
    cy.get('[data-cy="calculationName-input"]').should(
      "have.value",
      "Full time"
    );
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
});
