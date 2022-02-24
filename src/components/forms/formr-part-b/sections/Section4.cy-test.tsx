import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section4 from "./Section4";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";
import { updatedReference } from "../../../../redux/slices/referenceSlice";

describe("Section4", () => {
  it("should mount section 4 ", () => {
    const MockedSection4 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));
      dispatch(updatedReference(mockedCombinedReference));

      return (
        <Section4
          prevSectionLabel="Section 3:\nDeclarations relating to\nGood Medical Practice"
          nextSectionLabel="Section 5:\nNew Declarations\nsince your last Form R"
          saveDraft={() => Promise.resolve()}
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedSection4 />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset4]")
      .should("exist")
      .should("include.text", "Section 4");
    cy.get("[data-cy=havePreviousDeclarations1]").should("exist").click();
    cy.get(":nth-child(4) > .nhsuk-panel-with-label__label").should(
      "not.exist"
    );
    cy.get("[data-cy=havePreviousDeclarations0]").should("exist").click();
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
    cy.get(".nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 5");
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 3");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
  });
});
