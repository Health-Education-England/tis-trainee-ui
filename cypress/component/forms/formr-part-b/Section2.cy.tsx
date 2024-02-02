/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section2 from "../../../../components/forms/formr-part-b/sections/Section2";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import history from "../../../../components/navigation/history";
import dayjs from "dayjs";

describe("Section2", () => {
  const startDate = dayjs().subtract(12, "month").format("YYYY-MM-DD");
  const endDate = dayjs().subtract(6, "month").format("YYYY-MM-DD");

  it("should mount section 2 ", () => {
    const MockedSection2 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));

      return (
        <Section2
          prevSectionLabel="Section 1:\nDoctor's details"
          nextSectionLabel="Section 3:\nDeclarations relating to\nGood Medical Practice"
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
    cy.testDataSourceLink();
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

    //check that TOOT only allowes 5 digits
    cy.get('[data-cy="parentalLeave"]').clear().type("123456789");
    cy.get('[data-cy="parentalLeave"]').should("have.value", "12345");
    cy.get('[data-cy="parentalLeave"]').clear().type("0");

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
    cy.get("[data-cy=sicknessAbsence]").clear().type("1.99");
    cy.get("#sicknessAbsence--error-message").should(
      "contain.text",
      "Error: Short and Long-term sickness absence must be rounded up to a whole number"
    );
    cy.get("[data-cy=sicknessAbsence]").clear().type("0.1");
    cy.get("#sicknessAbsence--error-message").should(
      "contain.text",
      "Short and Long-term sickness absence must be rounded up to a whole number"
    );

    cy.get("[data-cy=sicknessAbsence]").clear().type("99999");
    cy.get("#sicknessAbsence--error-message").should(
      "contain.text",
      "Short and Long-term sickness absence must not be more than 9999"
    );

    cy.get("[data-cy=sicknessAbsence]").clear().type("9999");
    cy.get("#sicknessAbsence--error-message").should("not.exist");

    cy.get("[data-cy=sicknessAbsence]").click().clear().type("1");
    cy.get("#sicknessAbsence--error-message").should("not.exist");
    cy.get("[data-cy=otherLeave]").click().clear().type("1");
    cy.get("[data-cy=totalLeave]").should("have.value", 12);

    cy.get("[data-cy=closeIcon1]").focus().should("exist").click();
    cy.get("[data-cy=closeIcon1]").should("not.exist");
    cy.get(
      ":nth-child(2) > :nth-child(1) > .nhsuk-grid-column-one-quarter > h3"
    ).should("not.exist");
    cy.get("[data-cy=BtnAddWorkType]").should("exist").click();

    cy.get(".nhsuk-error-summary > .nhsuk-error-message").should("exist");
    cy.get('[data-cy="work[1].typeOfWork"]')
      .clear()
      .type("   type of work test  ");
    cy.get(".nhsuk-card__heading").first().click();
    cy.get('[data-cy="work[1].typeOfWork"]').should(
      "have.value",
      "type of work test"
    );
    cy.get('[data-cy="work[1].trainingPost"]').select("Yes");
    cy.get('[data-cy="work[1].startDate"]').type(startDate);
    cy.get('[data-cy="work[1].endDate"]').type(endDate);
    cy.get('[data-cy="work[1].site"]').type("test site");
    cy.get('[data-cy="work[1].siteLocation"]').type("test site location");

    cy.get("#work[1].typeOfWork--error-message").should("not.exist");
    cy.get("[data-cy=closeIcon1]").focus().should("exist");

    cy.get(".nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 3");
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 1");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
  });
});
