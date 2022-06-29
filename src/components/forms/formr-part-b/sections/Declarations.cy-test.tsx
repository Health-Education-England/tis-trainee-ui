import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { updatedFormB } from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import Declarations from "./Declarations";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import Section6 from "./Section6";
import history from "../../../navigation/history";

it("should mount section 6 ", () => {
  const MockedDeclarations = () => {
    const dispatch = useAppDispatch();
    dispatch(updatedFormB(submittedFormRPartBs[0]));

    return (
      <Declarations
        prevSectionLabel="Section 6:\nCompliments"
        saveDraft={() => Promise.resolve()}
        history={[]}
        finalSections={[
          {
            component: Section6,
            title: "Section 6:\nCompliments"
          }
        ]}
      />
    );
  };
  mount(
    <Provider store={store}>
      <Router history={history}>
        <MockedDeclarations />
      </Router>
    </Provider>
  );
  cy.get(".nhsuk-panel-with-label__label")
    .should("exist")
    .should("include.text", "Declaration");
  cy.get("[data-cy=isDeclarationAccepted0]").should("exist").click();
  cy.get("[data-cy=isConsentAccepted0]").should("exist").click();
  cy.get("[data-cy=BtnSubmitForm]").should("exist").click();
});
