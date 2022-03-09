import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../redux/store/store";
import FormSavePDF from "./FormSavePDF";
import { FormRUtilities } from "../../utilities/FormRUtilities";

describe("FormSavePDF", () => {
  it("should mount without crashing", () => {
    cy.stub(FormRUtilities, "historyPush").as("Back");
    cy.stub(FormRUtilities, "windowPrint").as("PrintPDF");

    mount(
      <Provider store={store}>
        <BrowserRouter>
          <FormSavePDF history={[]} formrPath="/formr-b" />
        </BrowserRouter>
      </Provider>
    );
    cy.get("[data-cy=backLink]").click();
    cy.get("@Back").should("have.been.called");
    cy.get("[data-cy=savePdfBtn]").click();
    cy.get("@PrintPDF").should("have.been.called");
  });
});
