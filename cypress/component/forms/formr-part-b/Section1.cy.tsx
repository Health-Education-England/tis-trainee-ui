/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section1 from "../../../../components/forms/formr-part-b/sections/Section1";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import { updatedReference } from "../../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";
import history from "../../../../components/navigation/history";

describe("Section1", () => {
  it("should mount section 1 ", () => {
    const MockedSection1 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));
      dispatch(updatedReference(mockedCombinedReference));

      return (
        <Section1
          prevSectionLabel=""
          nextSectionLabel="Section 2:\nWhole Scope of Practice"
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSection1 />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset1]")
      .should("exist")
      .should("include.text", "Section 1");
    cy.testDataSourceLink();
    cy.get('[data-cy="forename"]').clear().type("   forename    ");
    cy.get(".nhsuk-card__heading").first().click();
    cy.get('[data-cy="forename"]').should("have.value", "forename");
    cy.get("[data-cy=email]")
      .should("exist")
      .should("have.value", "email@email.com");
    cy.get(".nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 2");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
    cy.get("[data-cy=prevRevalBodyOther]").should("not.exist");
    cy.get("[data-cy=prevRevalBody]").select("other");
    cy.get("[data-cy=prevRevalBodyOther]")
      .should("exist")
      .type("c")
      .get(".react-select__menu")
      .find(".react-select__option")
      .first()
      .click();
    cy.get(".react-select__value-container").should("include.text", "Maximus");
  });
});
