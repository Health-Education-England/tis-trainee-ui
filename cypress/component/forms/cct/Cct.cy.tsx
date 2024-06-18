/// <reference types="cypress" />
/// <reference path="../../../../cypress/support/index.d.ts" />
import { mount } from "cypress/react18";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../../redux/store/store";
import { Cct } from "../../../../components/forms/cct/Cct";
import {
  openCctModal,
  setCurrentProgEndDate,
  setNewEndDates,
  setProgName,
  setPropStartDate
} from "../../../../redux/slices/cctCalcSlice";
import dayjs from "dayjs";

describe("Cct", () => {
  it("renders the Cct component", () => {
    const progName = "General Practice";
    const endDate = dayjs().add(3, "year");
    store.dispatch(setNewEndDates([]));
    store.dispatch(openCctModal());
    store.dispatch(setProgName(progName));
    store.dispatch(setCurrentProgEndDate(endDate.format("YYYY-MM-DD")));
    store.dispatch(
      setPropStartDate(dayjs().add(16, "week").format("YYYY-MM-DD"))
    );

    const newEndDate = (newPercent: number, currPercent: number) => {
      const propStartDate = dayjs().add(16, "week").subtract(1, "day");
      const chunkDays = endDate.diff(propStartDate, "days");
      const chunkDaysWTE = Math.ceil((chunkDays * currPercent) / newPercent);
      return dayjs(endDate)
        .add(chunkDaysWTE - chunkDays, "days")
        .format("DD/MM/YYYY");
    };
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/programme"]}>
          <Cct />
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="cct-header"]').contains("CCT Calculator");
    cy.get('[data-cy="cct-disclaimer"]').contains(
      "This calculator is intended to provide a quick rough estimate only."
    );
    cy.get('[data-cy="cctInfoSummary"]')
      .contains("CCT Calculator further information")
      .click();
    cy.get('[data-cy="cctInfoText"] > :nth-child(2) > b').should(
      "include.text",
      "Q. What is your current WTE percentage?"
    );
    cy.get('[data-cy="cct-curr-prog"]').contains("General Practice");
    cy.get('[data-cy="cct-curr-prog-end"]').contains(
      endDate.format("DD/MM/YYYY")
    );
    cy.get('[for="currentFtePercent"]').contains(
      "What is your current WTE percentage?"
    );
    cy.get('[for="ftePercents"]').contains(
      "What WTE percentage(s) are you considering?"
    );
    cy.get("#propStartDate--label").contains(
      "When should the WTE change begin?"
    );
    cy.get("#propEndDate--label").contains("When should the WTE change end?");

    // calc and PDF buttons default to disabled
    cy.get('[data-cy="cct-calc-btn"]').should("be.disabled");
    cy.get('[data-cy="cct-pdf-btn"]').should("be.disabled");
    cy.get('[data-cy="cct-close-btn"]').should("not.be.disabled");

    // check form defaults
    cy.get(
      '[data-cy="currentFtePercent"] > .autocomplete-select > .react-select__control > .react-select__value-container'
    ).should("have.text", "100%");
    cy.get(
      '[data-cy="ftePercents"] > .autocomplete-select > .react-select__control > .react-select__value-container'
    ).should("have.text", "Select or start typing...");
    cy.get('[data-cy="propStartDate"]').should(
      "have.value",
      dayjs().add(16, "week").format("YYYY-MM-DD")
    );
    cy.get('[data-cy="propEndDate"]').should(
      "have.value",
      endDate.format("YYYY-MM-DD")
    );

    // check validation
    cy.get(
      '[data-cy="currentFtePercent"] > .autocomplete-select > .react-select__control > .react-select__indicators > .react-select__clear-indicator'
    ).click();
    cy.get('[data-cy="currentFtePercent"] > .nhsuk-error-message').should(
      "exist"
    );
    cy.get('[data-cy="ftePercents"] > .nhsuk-error-message').should("exist");
    cy.clickSelect('[data-cy="currentFtePercent"]', "8", true);
    cy.get('[data-cy="currentFtePercent"] > .nhsuk-error-message').should(
      "not.exist"
    );

    // check warning
    cy.clickSelect('[data-cy="ftePercents"]', "45", true);
    cy.get('[data-cy="ftePercents"] > .nhsuk-error-message').should(
      "not.exist"
    );
    cy.checkElement("bespoke-wte-warn");
    cy.clickSelect('[data-cy="ftePercents"]', "1", true);
    cy.checkElement("ft-return-warn");

    // check start date validation and warning
    cy.clearAndType(
      '[data-cy="propStartDate"]',
      dayjs().subtract(1, "day").format("YYYY-MM-DD")
    );
    cy.get("#propStartDate--error-message").contains(
      "Start date cannot be before today."
    );
    cy.clearAndType('[data-cy="propStartDate"]', dayjs().format("YYYY-MM-DD"));
    cy.get('[data-cy="start-date-warn"]').should("exist");
    cy.clearAndType(
      '[data-cy="propStartDate"]',
      dayjs().add(16, "week").format("YYYY-MM-DD")
    );
    cy.get('[data-cy="start-date-warn"]').should("not.exist");

    cy.clearAndType(
      '[data-cy="propEndDate"]',
      dayjs(endDate).add(1, "day").format("YYYY-MM-DD")
    );
    cy.get("#propEndDate--error-message").contains(
      `End date cannot be after current programme end date ${endDate.format(
        "DD/MM/YYYY"
      )}`
    );
    cy.clearAndType('[data-cy="propEndDate"]', endDate.format("YYYY-MM-DD"));
    cy.get('[data-cy="end-date-warn"]').should("not.exist");
    cy.get("#propEndDate--error-message").should("not.exist");

    // check calc button enabled
    cy.get('[data-cy="cct-pdf-btn"]').should("be.disabled");
    cy.get('[data-cy="cct-calc-btn"]').should("not.be.disabled").click();

    // summary table should be visible
    cy.get('[data-cy="cct-th-wte"]').should("have.text", "New WTE");
    cy.get('[data-cy="cct-th-new-date"]').should("have.text", "New End Date");
    cy.get(':nth-child(1) > [data-cy="cct-td-new-percent"]')
      .should("have.text", "45%")
      .next()
      .should("exist")
      .should("have.text", newEndDate(45, 80));
    cy.get(':nth-child(2) > [data-cy="cct-td-new-percent"]')
      .should("have.text", "100%")
      .next()
      .should("exist")
      .should("have.text", newEndDate(100, 80));

    cy.get('[data-cy="cctInfoSummary"]').click();

    cy.get('[data-cy="cct-close-btn"]').click();
    cy.get(".cct-dialog").should("not.exist");
  });
});
