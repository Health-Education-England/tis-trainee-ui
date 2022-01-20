import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section6 from "./Section6";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";

describe("Section6", () => {
  it("should not render the form it no data", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <Section6
            prevSectionLabel=""
            nextSectionLabel=""
            saveDraft={() => Promise.resolve()}
            previousSection={null}
            handleSectionSubmit={() => Promise.resolve()}
            history={[]}
          />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=errorAction]").should("exist");
  });

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
          history={[]}
        />
      );
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedSection6 />
        </BrowserRouter>
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
