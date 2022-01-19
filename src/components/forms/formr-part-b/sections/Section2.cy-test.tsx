import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Section2 from "./Section2";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";

describe("Section2", () => {
  it("should not render the form it no data", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <Section2
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

  it("should mount section 2 ", () => {
    const MockedSection2 = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormB(submittedFormRPartBs[0]));

      return (
        <Section2
          prevSectionLabel="Section 1:\nDoctor's details"
          nextSectionLabel="Section 3:\nDeclarations relating to\nGood Medical Practice"
          saveDraft={() => null}
          previousSection={null}
          handleSectionSubmit={() => null}
        />
      );
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedSection2 />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=legendFieldset2]")
      .should("exist")
      .should("include.text", "Section 2");
    cy.get('[data-cy="work[0].trainingPost"]')
      .should("exist")
      .should("have.value", "Yes");
    cy.get("[data-cy=sicknessAbsence]")
      .should("exist")
      .should("have.value", "0");
    cy.get(".nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 3");
    cy.get("[data-cy=LinkToPreviousSection] > .nhsuk-pagination__page > div")
      .should("exist")
      .should("include.text", "Section 1");
    cy.get("[data-cy=BtnSaveDraft]").should("exist");
  });
});
