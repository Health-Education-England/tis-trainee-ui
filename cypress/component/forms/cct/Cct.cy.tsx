import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react";
import store from "../../../../redux/store/store";
import { Cct } from "../../../../components/forms/cct/Cct";

const mountCct = () => {
  mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/cct"]}>
        <Cct />
      </MemoryRouter>
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

describe("Cct", () => {
  it("starts on part 1 with the programme details form open", () => {
    mountCct();

    cy.get('[data-cy="cct-header"]').should("exist");
    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Part 1 of 3 - Programme details"
    );
    cy.get('[data-cy="cct-programme-details-form"]').should("exist");
    cy.get('[data-cy="navPrevious"]').should("not.exist");
    cy.get('[data-cy="navNext"]').should("exist");
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

    cy.get('[data-cy="cct-edit-programme-details"]').click();
    cy.get('[data-cy="cct-programme-details-form"]').should("exist");
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
      .should("contain.text", "Not yet calculated")
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

  it("shows the summary with the calculation flagged as unavailable", () => {
    mountCct();
    saveProgrammeDetails();
    cy.get('[data-cy="navNext"]').click();
    cy.get('[data-cy="navNext"]').click();

    cy.get('[data-cy="progress-header"]').should(
      "contain.text",
      "Part 3 of 3 - Summary"
    );
    cy.get('[data-cy="cct-no-result-warning"]').should("exist");
    cy.get('[data-cy="cct-result-summary"]').should(
      "contain.text",
      "Not yet calculated"
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
});
