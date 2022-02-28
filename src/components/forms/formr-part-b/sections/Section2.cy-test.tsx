/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />
import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section2 from "./Section2";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";

describe("Section2", () => {
  const startDate = Cypress.dayjs()
    .subtract(Cypress.dayjs.duration({ months: 12 }))
    .format("YYYY-MM-DD");
  const endDate = Cypress.dayjs()
    .subtract(Cypress.dayjs.duration({ months: 6 }))
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
        <BrowserRouter>
          <MockedSection2 />
        </BrowserRouter>
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
