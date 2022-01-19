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
  it("should not render the form it no data", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <Section1
            prevSectionLabel=""
            nextSectionLabel=""
            saveDraft={() => null}
            previousSection={null}
            handleSectionSubmit={() => null}
          />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset1]").should("not.exist");
    cy.get("[data-cy=errorAction]").should("exist");
  });
  it("should mount section 1 ", () => {
    const MockedSection1 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));
      dispatch(updatedReference(mockedCombinedReference));

      return (
        <Section1
          prevSectionLabel=""
          nextSectionLabel="Section 2:\nWhole Scope of Practice"
          saveDraft={() => null}
          previousSection={null}
          handleSectionSubmit={() => null}
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
    cy.get("[data-cy=email]")
      .should("exist")
      .should("have.value", "email@email.com");
    cy.get(".nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 2");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
  });
});
