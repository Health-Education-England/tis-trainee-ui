/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../src/redux/hooks/hooks";
import { updatedFormB } from "../../../../src/redux/slices/formBSlice";
import store from "../../../../src/redux/store/store";
import Section2 from "../../../../src/components/forms/formr-part-b/sections/Section2";
import { submittedFormRPartBs } from "../../../../src/mock-data/submitted-formr-partb";
import history from "../../../../src/components/navigation/history";
import React from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

describe("Section2", () => {
  const startDate = dayjs()
    .subtract(dayjs.duration({ months: 12 }))
    .format("YYYY-MM-DD");
  const endDate = dayjs()
    .subtract(dayjs.duration({ months: 6 }))
    .format("YYYY-MM-DD");

  it("should mount section 2 ", () => {
    const MockedSection2 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));

      return (
        <Section2
          prevSectionLabel="Section 1:\nDoctor's details"
          nextSectionLabel="Section 3:\nDeclarations relating to\nGood Medical Practice"
          saveDraft={() => Promise.resolve()}
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSection2 />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset2]")
      .should("exist")
      .should("include.text", "Section 2");
    cy.testDataSourceLink;
    cy.get('[data-cy="work[0].trainingPost"]')
      .should("exist")
      .should("have.value", "Yes");

    cy.get("[data-cy=sicknessAbsence]")
      .should("exist")
      .should("have.value", "0");
    // TODO additional line below needed because of validation implementation in the comp which causes console warning on first render - comp needs fixing
    cy.get("[data-cy=sicknessAbsence]").should("exist").click({ force: true });
    cy.get("[data-cy=sicknessAbsence]").clear();
    cy.get("#sicknessAbsence--error-message")
      .should("exist")
      .should(
        "contain.text",
        "Short and Long-term sickness absence is required"
      );
    cy.get("[data-cy=sicknessAbsence]").type(".0");
    cy.get("#sicknessAbsence--error-message").should(
      "contain.text",
      "Whole numbers only. No decimals please"
    );
    cy.get("[data-cy=sicknessAbsence]").clear().type("0.");
    cy.get("#sicknessAbsence--error-message").should(
      "contain.text",
      "Whole numbers only. No decimals please"
    );
    cy.get("[data-cy=sicknessAbsence]").clear().type("0.0");
    cy.get("#sicknessAbsence--error-message").should(
      "contain.text",
      "Whole numbers only. No decimals please"
    );
    cy.get("[data-cy=sicknessAbsence]").clear().type("1.9999999999999999");
    cy.get("#sicknessAbsence--error-message").should(
      "contain.text",
      "Whole numbers only. No decimals please"
    );

    cy.get("[data-cy=sicknessAbsence]").clear().type("0.1");
    cy.get("#sicknessAbsence--error-message").should(
      "contain.text",
      "Short and Long-term sickness absence must be rounded up to a whole number"
    );

    cy.get("[data-cy=sicknessAbsence]").click().clear().type("1");
    cy.get("#sicknessAbsence--error-message").should("not.exist");
    cy.get("[data-cy=otherLeave]").click().clear().type("1");
    cy.get("[data-cy=totalLeave]").should("have.value", 12);

    cy.get("[data-cy=closeIcon1] > .nhsuk-icon").should("exist").click();
    cy.get("[data-cy=closeIcon1] > .nhsuk-icon").should("not.exist");
    cy.get(
      ":nth-child(2) > :nth-child(1) > .nhsuk-grid-column-one-quarter > h3"
    ).should("not.exist");
    cy.get("[data-cy=BtnAddWorkType]").should("exist").click();

    cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("exist");
    cy.get('[data-cy="work[1].typeOfWork"]').type("type of work test");
    cy.get('[data-cy="work[1].trainingPost"]').select("Yes");
    cy.get('[data-cy="work[1].startDate"]').type(startDate);
    cy.get('[data-cy="work[1].endDate"]').type(endDate);
    cy.get('[data-cy="work[1].site"]').type("test site");
    cy.get('[data-cy="work[1].siteLocation"]').type("test site location");

    cy.get("#work[1].typeOfWork--error-message").should("not.exist");
    cy.get("[data-cy=closeIcon1] > .nhsuk-icon").should("exist");

    cy.get(".nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 3");
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 1");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
  });
});
