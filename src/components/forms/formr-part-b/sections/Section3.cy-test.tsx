import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section3 from "./Section3";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";

describe("Section3", () => {
  it("should not render the form it no data", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <Section3
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

  it("should mount section 3 ", () => {
    const MockedSection3 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));

      return (
        <Section3
          prevSectionLabel="Section 2:\nWhole Scope of Practice"
          nextSectionLabel="Section 4:\nUpdate to your last Form R"
          saveDraft={() => Promise.resolve()}
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedSection3 />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset3]")
      .should("exist")
      .should("include.text", "Section 3");
    cy.get("[data-cy=declarations] > .nhsuk-panel-with-label__label")
      .should("exist")
      .should("include.text", "Declarations");
    cy.get('div[data-cy="healthStatement"] > .nhsuk-panel-with-label__label')
      .should("exist")
      .should("include.text", "Health statement");
    cy.get("[data-cy=isWarned1]").should("exist").click();
    cy.get("[data-cy=isWarned0]").should("exist").click();
    cy.get(".nhsuk-form-group > [data-cy=healthStatement]").click();
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
