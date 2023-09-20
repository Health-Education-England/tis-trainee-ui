import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section5 from "../../../../components/forms/formr-part-b/sections/Section5";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import { updatedReference } from "../../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../../mock-data/combinedReferenceData";
import history from "../../../../components/navigation/history";

describe("Section 5", () => {
  it("should mount section 5", () => {
    const MockedSection5 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));
      dispatch(updatedReference(mockedCombinedReference));

      return (
        <Section5
          prevSectionLabel="Section 4"
          nextSectionLabel="Section 6"
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSection5 />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset5]")
      .should("exist")
      .should("include.text", "Section 5");

    cy.get("[data-cy=haveCurrentDeclarations1]").click({ force: true });
    cy.get('[data-cy="currentDeclarations[0].declarationType"]').should(
      "not.exist"
    );
    cy.get("[data-cy=haveCurrentDeclarations0]").click();
    cy.get('[data-cy="currentDeclarations[0].declarationType"]').should(
      "exist"
    );
    cy.get('[data-cy="currentDeclarations[0].declarationType"]').select(
      "Complaint"
    );
    cy.get('[data-cy="currentDeclarations[0].dateOfEntry"]').click();
    cy.get('[data-cy="currentDeclarations[0].dateOfEntry"]').type("2022-05-28");
    cy.get('[data-cy="currentDeclarations[0].title"]').type("testTitle");
    cy.get("#currentDeclarations[0].title--error-message").should("not.exist");
    cy.get('[data-cy="currentDeclarations[0].locationOfEntry"]').type(
      "testLocation"
    );
    cy.get('[data-cy="btnAddDeclaration"]').click();
    cy.get('[data-cy="currentDeclarations[1].declarationType"]').should(
      "exist"
    );
    cy.get("[data-cy=closeIcon1]").focus().click();
    cy.get(
      "#declarationPanel1 > :nth-child(1) > .nhsuk-grid-column-one-quarter > h3"
    ).should("not.exist");

    cy.get("[data-cy=haveCurrentUnresolvedDeclarations1]").click();
    cy.get("#currentDeclarationSummary--hint > span").should("not.exist");

    cy.get("[data-cy=haveCurrentUnresolvedDeclarations0]").click();
    cy.get(".nhsuk-form-group > [data-cy=currentDeclarationSummary]").should(
      "exist"
    );
    cy.get(".nhsuk-form-group > [data-cy=currentDeclarationSummary]")
      .clear()
      .type("    more test text   .                            ");
    cy.get(".nhsuk-card__heading").first().click();
    cy.get(".nhsuk-form-group > [data-cy=currentDeclarationSummary]").should(
      "have.value",
      "more test text   ."
    );

    cy.get("[data-cy=haveCurrentDeclarations1]").click();
    cy.get(
      "[data-cy=haveCurrentUnresolvedDeclarations] > .nhsuk-panel-with-label__label"
    ).should("not.exist");
  });
});
