import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../src/redux/hooks/hooks";
import { updatedFormB } from "../../../../src/redux/slices/formBSlice";
import store from "../../../../src/redux/store/store";
import CovidDeclaration from "../../../../src/components/forms/formr-part-b/sections/CovidDeclaration";
import { submittedFormRPartBs } from "../../../../src/mock-data/submitted-formr-partb";
import { updatedReference } from "../../../../src/redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../src/mock-data/combinedReferenceData";
import history from "../../../../src/components/navigation/history";
import React from "react";

describe("CovidDeclaration", () => {
  it("should mount CovidDeclaration section", () => {
    const MockedCovidSection = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));
      dispatch(updatedReference(mockedCombinedReference));

      return (
        <CovidDeclaration
          prevSectionLabel="Section 6"
          nextSectionLabel="Review & Submit"
          saveDraft={() => Promise.resolve()}
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedCovidSection />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=legendFieldsetCovid]")
      .should("exist")
      .should("include.text", "Pandemic");
    cy.get(".nhsuk-card__heading").should("include.text", "Covid declarations");
    cy.get("[data-cy=haveCovidDeclarations0]")
      .should("exist")
      .click({ force: true });
    cy.get(".nhsuk-warning-callout__label")
      .should("exist")
      .should("include.text", "Important");
    cy.get("#covidDeclarationDto.reasonOfSelfRate--label").should("not.exist");
    cy.get('[data-cy="covidDeclarationDto.selfRateForCovid0"]')
      .should("exist")
      .click();
    cy.get('[data-cy="covidDeclarationDto.reasonOfSelfRate"]').should("exist");
    cy.get('[data-cy="covidDeclarationDto.selfRateForCovid2"]')
      .should("exist")
      .click();
    cy.get('[data-cy="covidDeclarationDto.reasonOfSelfRate"]').should(
      "not.exist"
    );
    cy.get("[data-cy=covidErrorSummary] > .nhsuk-error-message").should(
      "exist"
    );
    cy.get('[data-cy="covidDeclarationDto.haveChangesToPlacement0"]').click();
    cy.get('[data-cy="covidDeclarationDto.changeCircumstances"]').select(
      "Any Period of self-isolation"
    );

    cy.get('[data-cy="covidDeclarationDto.howPlacementAdjusted"]').type(
      "my reason"
    );
    cy.get("[data-cy=covidErrorSummary] > .nhsuk-error-message").should(
      "not.exist"
    );
    cy.get('[data-cy="covidDeclarationDto.educationSupervisorName"]').type(
      "My supervisor's name"
    );
    cy.get('[data-cy="covidDeclarationDto.educationSupervisorEmail"]').type(
      "test@test.com"
    );
    cy.get("[data-cy=haveCovidDeclarations1]").click();
    cy.get("[data-cy=mainWarningCovid] > :nth-child(2) > p").should(
      "not.exist"
    );
  });
});
