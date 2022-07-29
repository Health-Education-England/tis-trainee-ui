import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import CovidDeclaration from "./CovidDeclaration";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import { updatedReference } from "../../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";
import history from "../../../navigation/history";

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
    cy.get("[data-cy=haveCovidDeclarations0]").should("exist").click();
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
