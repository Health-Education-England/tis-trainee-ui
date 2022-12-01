import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../src/redux/hooks/hooks";
import { updatedFormB } from "../../../../src/redux/slices/formBSlice";
import store from "../../../../src/redux/store/store";
import Section6 from "../../../../src/components/forms/formr-part-b/sections/Section6";
import { submittedFormRPartBs } from "../../../../src/mock-data/submitted-formr-partb";
import history from "../../../../src/components/navigation/history";
import React from "react";

describe("Section6", () => {
  it("should mount section 6 ", () => {
    const MockedSection6 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));

      return (
        <Section6
          prevSectionLabel="Section 5:\nNew Declarations\nsince your last Form R"
          nextSectionLabel="Covid declaration"
          saveDraft={() => Promise.resolve()}
          previousSection={null}
          handleSectionSubmit={() => Promise.resolve()}
        />
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedSection6 />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset6]")
      .should("exist")
      .should("include.text", "Section 6");
    cy.get(".nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Covid declaration");
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 5");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
  });
});
