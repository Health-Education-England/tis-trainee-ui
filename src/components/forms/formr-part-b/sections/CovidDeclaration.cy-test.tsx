import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import CovidDeclaration from "./CovidDeclaration";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import { updatedReference } from "../../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";

describe("CovidDeclaration", () => {
  it("should not render the form it no data", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <CovidDeclaration
            prevSectionLabel=""
            nextSectionLabel=""
            saveDraft={() => Promise.resolve()}
            previousSection={null}
            handleSectionSubmit={() => Promise.resolve()}
          />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=errorAction]").should("exist");
  });
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
        <BrowserRouter>
          <MockedCovidSection />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=legendFieldsetCovid]")
      .should("exist")
      .should("include.text", "Pandemic");
    cy.get(".nhsuk-panel-with-label__label").should(
      "include.text",
      "Covid declarations"
    );
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
    cy.get('[data-cy="covidDeclarationDto.educationSupervisorName"]').type(
      "My supervisor's name"
    );
    cy.get('[data-cy="covidDeclarationDto.educationSupervisorEmail"]').type(
      "test@test.com"
    );
    cy.get("[data-cy=covidErrorSummary] > .nhsuk-error-message").should(
      "not.exist"
    );
  });
});
