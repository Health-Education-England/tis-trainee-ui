import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section4 from "../../../../components/forms/formr-part-b/sections/Section4";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";
import { updatedReference } from "../../../../redux/slices/referenceSlice";
import history from "../../../../components/navigation/history";

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
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSection4 />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset4]")
      .should("exist")
      .should("include.text", "Section 4");
    //click no to check that assosiated panel doen not exist in dom
    cy.get("[data-cy=havePreviousDeclarations1]").click({ force: true });
    cy.get('[data-cy="previousDeclarations[0].declarationType"]').should(
      "not.exist"
    );
    //click yes and complete panal
    cy.get("[data-cy=havePreviousDeclarations0]").click();
    cy.get('[data-cy="previousDeclarations[0].declarationType"]').should(
      "exist"
    );
    cy.get('[data-cy="previousDeclarations[0].declarationType"]').select(
      "Complaint"
    );
    cy.get('[data-cy="previousDeclarations[0].dateOfEntry"]').click();
    cy.get('[data-cy="previousDeclarations[0].dateOfEntry"]').type(
      "2022-05-28"
    );
    cy.get('[data-cy="previousDeclarations[0].title"]').type("testTitle");
    cy.get("#previousDeclarations[0].title--error-message").should("not.exist");
    cy.get('[data-cy="previousDeclarations[0].locationOfEntry"]').type(
      "testLocation"
    );
    cy.get('[data-cy="btnAddDeclaration"]').click();
    cy.get('[data-cy="previousDeclarations[1].declarationType"]').should(
      "exist"
    );
    cy.get("[data-cy=closeIcon1]").focus().click();
    cy.get(
      "#declarationPanel1 > :nth-child(1) > .nhsuk-grid-column-one-quarter > h3"
    ).should("not.exist");
    //click no on previous unresolved declerations
    cy.get("[data-cy=havePreviousUnresolvedDeclarations1]").click();
    cy.get("#previousDeclarationSummary--hint > span").should("not.exist");
    //click yes on previous unresolved declarations
    cy.get("[data-cy=havePreviousUnresolvedDeclarations0]").click();
    cy.get(".nhsuk-form-group > [data-cy=previousDeclarationSummary]").should(
      "exist"
    );
    cy.get(".nhsuk-form-group > [data-cy=previousDeclarationSummary]")
      .clear()
      .type("test text                               ");
    cy.get(".nhsuk-card__heading").first().click();
    cy.get(".nhsuk-form-group > [data-cy=previousDeclarationSummary]").should(
      "have.value",
      "test text"
    );
    //click yes on click yes on previous unresolved declarations and
    // no on Previous resolved declarations
    cy.get("[data-cy=havePreviousDeclarations1]").click();
    cy.get(
      "[data-cy=havePreviousUnresolvedDeclarations] > .nhsuk-panel-with-label__label"
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
