import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { submittedFormRPartAs } from "../../../mock-data/submitted-formr-parta";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { updatedFormA } from "../../../redux/slices/formASlice";
import store from "../../../redux/store/store";
import View from "./View";

describe("View", () => {
  it("should not render View if no tisId", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <View canEdit={false} history={[]} />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=linkHowToExport]").should("not.exist");
    cy.get("[data-cy=warningConfirmation]").should("not.exist");
  });
  it("should mount view component with print PDF export link but no edit/save btns", () => {
    const MockedView = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedFormA(submittedFormRPartAs[0]));

      return <View canEdit={false} history={[]} />;
    };
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MockedView />
        </BrowserRouter>
      </Provider>
    );
    cy.get(".nhsuk-back-link__link").should("include.text", "Go back to list");
    cy.get("[data-cy=linkHowToExport]").should("include.text", "PDF");
    cy.get("[data-cy=localOfficeName]").should(
      "include.text",
      "Health Education England Thames Valley"
    );
    cy.get("[data-cy=BtnEdit]").should("not.exist");
    cy.get("[data-cy=BtnSaveDraft]").should("not.exist");
    cy.get("[data-cy=BtnSubmit]").should("not.exist");
  });
});
