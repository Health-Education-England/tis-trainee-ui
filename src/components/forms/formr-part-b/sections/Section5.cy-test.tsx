import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section5 from "./Section5";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import { updatedReference } from "../../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";

describe("Section 5", () => {
  it("should not render the form it no data", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <Section5
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
  it("should mount section 5", () => {
    const MockedSection5 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));
      dispatch(updatedReference(mockedCombinedReference));

      return (
        <Section5
          prevSectionLabel="Section 4"
          nextSectionLabel="Section 6"
          saveDraft={() => Promise.resolve()}
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedSection5 />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset5]")
      .should("exist")
      .should("include.text", "Section 5");
    cy.get("[data-cy=haveCurrentDeclarations1]").should("exist").click();
    cy.get(":nth-child(4) > .nhsuk-panel-with-label__label").should(
      "not.exist"
    );
    cy.get("[data-cy=haveCurrentDeclarations0]").should("exist").click();
    cy.get(":nth-child(4) > .nhsuk-panel-with-label__label").should("exist");
    cy.get("[data-cy=btnAddDeclaration]").click();
    cy.get(
      "#declarationPanel1 > :nth-child(1) > .nhsuk-grid-column-one-quarter > h3"
    )
      .should("exist")
      .should("include.text", "Declaration 2");
    cy.get("[data-cy=closeIcon1] > .nhsuk-icon").click();
    cy.get(
      "#declarationPanel1 > :nth-child(1) > .nhsuk-grid-column-one-quarter > h3"
    ).should("not.exist");
  });
});
