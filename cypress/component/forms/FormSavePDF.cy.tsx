import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import FormSavePDF from "../../../components/forms/FormSavePDF";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
import history from "../../../components/navigation/history";
import React from "react";

describe("FormSavePDF", () => {
  it("should mount without crashing", () => {
    cy.stub(FormRUtilities, "historyPush").as("Back");
    cy.stub(FormRUtilities, "windowPrint").as("PrintPDF");

    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormSavePDF history={[]} formrPath="/formr-b" />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=backLink]").click();
    cy.get("@Back").should("have.been.called");
    cy.get("[data-cy=savePdfBtn]").click();
    cy.get("@PrintPDF").should("have.been.called");
  });
});
