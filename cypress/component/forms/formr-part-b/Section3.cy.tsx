import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section3 from "../../../../components/forms/formr-part-b/sections/Section3";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import history from "../../../../components/navigation/history";

describe("Section3", () => {
  it("should mount section 3 ", () => {
    const MockedSection3 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));

      return (
        <Section3
          prevSectionLabel="Section 2:\nWhole Scope of Practice"
          nextSectionLabel="Section 4:\nUpdate to your last Form R"
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSection3 />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset3]")
      .should("exist")
      .should("include.text", "Section 3");
    cy.get(
      "[data-cy=declarations] > .nhsuk-card__content > .nhsuk-card__heading"
    )
      .should("exist")
      .should("include.text", "Declarations");
    cy.get(
      'div[data-cy="healthStatement"] > .nhsuk-card__content > .nhsuk-card__heading'
    )
      .should("exist")
      .should("include.text", "Health statement");
    cy.get("[data-cy=isWarned1]").should("exist").click({ force: true });
    cy.get("[data-cy=isWarned0]").should("exist").click();
    cy.get(".nhsuk-form-group > [data-cy=healthStatement]")
      .clear()
      .type("  I feel great");
    cy.get(".nhsuk-card__heading").first().click();
    cy.get(".nhsuk-form-group > [data-cy=healthStatement]").should(
      "have.value",
      "I feel great"
    );
    cy.get("#isComplying--error-message").should("exist");
    cy.get("[data-cy=isComplying0]").click();
    cy.get("#isComplying--error-message").should("not.exist");
    cy.get("[data-cy=isWarned1]").click();
    cy.get("[data-cy=isComplying0]").should("not.exist");
    cy.get(".nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 4");
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 2");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
  });
});
