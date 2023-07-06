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
import duration from "dayjs/plugin/duration";
import { updatedTraineeProfileData } from "../../../../redux/slices/traineeProfileSlice";
import { mockTraineeProfile } from "../../../../mock-data/trainee-profile";
import { ConfirmProvider } from "material-ui-confirm";
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
      dispatch(updatedTraineeProfileData(mockTraineeProfile));

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
        <ConfirmProvider>
          <Router history={history}>
            <MockedSection2 />
          </Router>
        </ConfirmProvider>
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

    cy.get('[data-cy="arcpWarning"]').should("exist");
    cy.get('[data-cy="arcpPeriodTxt"]').should("not.visible");
    cy.get(
      '[data-cy="arcpYYear"] > .year-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .last()
      .click();
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get('[data-cy="arcpPeriodTxt"]')
      .should("be.visible")
      .should(
        "have.text",
        "The ARCP period for 2021 is 04/08/2021 to 02/08/2022."
      );
    cy.get('[data-cy="work[1].trainingPost"]').should("not.exist");
    cy.get(":nth-child(2) > .nhsuk-error-message").should("exist");

    cy.get('[data-cy="work[0].trainingPost"]').select("No");
    cy.get(":nth-child(2) > .nhsuk-error-message").should("not.be.visible");
    cy.get('[data-cy="BtnAddWorkType"]').should(
      "not.have.attr",
      "disabled",
      "disabled"
    );
    cy.get('[data-cy="closeIcon0"]').focus().should("exist").click();
    cy.get(":nth-child(4) > .nhsuk-error-message")
      .should("exist")
      .should("have.text", "You must add at least one Type of Work");

    cy.get(
      '[data-cy="arcpYYear"] > .year-select > .react-select__control > .react-select__value-container > .react-select__input-container'
    )
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(".MuiDialogActions-root > :nth-child(2)").click();
    cy.get('[data-cy="arcpPeriodTxt"]').should("not.be.visible");
    cy.get('[data-cy="work[0].trainingPost"]').should("exist");
    cy.get('[data-cy="work[1].trainingPost"]')
      .should("exist")
      .should("have.value", "Yes");
    cy.get(":nth-child(3) > .nhsuk-error-message")
      .should("exist")
      .should(
        "have.text",
        "Please check the highlighted fields before proceeding."
      );
    cy.get('[data-cy="BtnAddWorkType"]').should(
      "have.attr",
      "disabled",
      "disabled"
    );
  });
});
