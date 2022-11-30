/// <reference types="cypress" />
/// <reference path="../../../support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../src/redux/hooks/hooks";
import { updatedFormB } from "../../../../src/redux/slices/formBSlice";
import store from "../../../../src/redux/store/store";
import Section1 from "../../../../src/components/forms/formr-part-b/sections/Section1";
import { submittedFormRPartBs } from "../../../../src/mock-data/submitted-formr-partb";
import { updatedReference } from "../../../../src/redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../src/mock-data/combinedReferenceData";
import history from "../../../../src/components/navigation/history";
import React from "react";

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
          saveDraft={() => Promise.resolve()}
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
    cy.testDataSourceLink;
    cy.get("[data-cy=email]")
      .should("exist")
      .should("have.value", "email@email.com");
    cy.get(".nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 2");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
    cy.get("[data-cy=prevRevalBodyOther]").should("not.exist");
    cy.get("[data-cy=prevRevalBody]").select("other");
    cy.get("[data-cy=prevRevalBodyOther]").should("exist").type("c");
    cy.get(".nhsuk-form-group > ul").should("exist");
  });
});
