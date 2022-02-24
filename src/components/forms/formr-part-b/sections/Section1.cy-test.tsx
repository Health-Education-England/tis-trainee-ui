/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section1 from "./Section1";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import { updatedReference } from "../../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";

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
        <BrowserRouter>
          <MockedSection1 />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset1]")
      .should("exist")
      .should("include.text", "Section 1");
    cy.testDataSourceLink();
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
