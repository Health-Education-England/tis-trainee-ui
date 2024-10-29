import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import FormSavePDF from "../../../components/forms/FormSavePDF";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
import history from "../../../components/navigation/history";
import React from "react";

describe("FormSavePDF", () => {
  it("should push history when clicking back button", () => {
    cy.stub(FormRUtilities, "historyPush").as("Back");
    cy.stub(FormRUtilities, "windowPrint").as("PrintPDF");

    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormSavePDF history={[]} path="/formr-b" />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=backLink]").click();
    cy.get("@Back").should("have.been.called");
  });

  it("should call windowPrint when client-side PDF", () => {
    cy.stub(FormRUtilities, "windowPrint").as("PrintPDF");

    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormSavePDF history={[]} path="/formr-b" />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=savePdfBtn]").click();
    cy.get("@PrintPDF").should("have.been.called");
  });

  it("should show instructions when client-side PDF", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormSavePDF history={[]} path="/formr-b" />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=pdfHelpLink]").should("exist");
  });

  it("should call click handler when server-side PDF", () => {
    cy.stub(FormRUtilities, "windowPrint").as("PrintPDF");

    const clickHandler = cy.stub().as("ClickHandler");

    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormSavePDF
            history={[]}
            path="/formr-b"
            onClickHandler={clickHandler}
          />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=savePdfBtn]").click();
    cy.get("@PrintPDF").should("not.have.been.called");
    cy.get("@ClickHandler").should("have.been.called");
  });

  it("should not show instructions when server-side PDF", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormSavePDF history={[]} path="/formr-b" onClickHandler={() => {}} />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=pdfHelpLink]").should("not.exist");
  });
});
