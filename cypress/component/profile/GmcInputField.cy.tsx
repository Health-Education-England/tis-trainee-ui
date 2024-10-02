import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import history from "../../../components/navigation/history";
import React from "react";
import { GmcEditForm } from "../../../components/profile/GmcEditForm";

describe("GmcInputField in Formik form", () => {
  it("should validate GMC numbers", () => {
    const onSubmit = cy.stub();
    mount(
      <Provider store={store}>
        <Router history={history}>
          <GmcEditForm onSubmit={onSubmit} />
        </Router>
      </Provider>
    );
    cy.get("#gmcNumber").clear().type("123456");
    cy.get("#gmcNumber--error-message").contains(
      "GMC must be a 7-digit number"
    );
    cy.get("#gmcNumber").clear().type("12345678");
    cy.get("#gmcNumber--error-message").should("not.exist");
    cy.get("#gmcNumber").should("have.value", "1234567");
    cy.get("#gmcNumber").clear();
    cy.get("#gmcNumber--error-message").contains("GMC number is required");
    cy.get("#gmc-btns").find("button").should("be.disabled");
    cy.get("#gmcNumber").clear().type("abcdefg");
    cy.get("#gmcNumber--error-message").contains(
      "GMC must be a 7-digit number"
    );
    cy.get("#gmc-btns").find("button").should("be.disabled");
    cy.get("#gmcNumber").clear().type("1234567");
    cy.get("#gmcNumber--error-message").should("not.exist");
    cy.get("#gmc-btns")
      .find("button")
      .should("not.be.disabled")
      .contains("Save")
      .click()
      .should(() => {
        expect(onSubmit).to.be.calledOnce;
        expect(onSubmit).to.be.calledWith({ gmcNumber: "1234567" });
      });
  });
});
