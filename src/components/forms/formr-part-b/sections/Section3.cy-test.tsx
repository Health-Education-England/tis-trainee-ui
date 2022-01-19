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
            saveDraft={() => null}
            previousSection={null}
            handleSectionSubmit={() => null}
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
          saveDraft={() => null}
          previousSection={null}
          handleSectionSubmit={() => null}
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
    cy.get(".nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 4");
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 2");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
  });
});
