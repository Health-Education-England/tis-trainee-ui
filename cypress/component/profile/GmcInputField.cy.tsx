import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { Formik, Form } from "formik";
import history from "../../../components/navigation/history";
import React from "react";
import { gmcValidationSchema } from "../../../components/profile/GmcEditForm";
import TextInputField from "../../../components/forms/TextInputField";

describe("GmcInputField in Formik form", () => {
  it("should validate GMC numbers", () => {
    const MockedForm = () => {
      return (
        <Formik
          initialValues={{ gmcNumber: "" }}
          onSubmit={() => console.log("submitting")}
          validationSchema={gmcValidationSchema}
        >
          <Form>
            <TextInputField
              label="Provide your 7-digit GMC number"
              type="string"
              name="gmcNumber"
              width={10}
              placeholder={""}
            />
          </Form>
        </Formik>
      );
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedForm />
        </Router>
      </Provider>
    );
    cy.get("#gmcNumber").clear().type("123456");
    cy.get("#gmcNumber--error-message").contains(
      "GMC must be a 7-digit number"
    );
    cy.get("#gmcNumber").clear().type("12345678");
    cy.get("#gmcNumber--error-message").contains(
      "GMC must be a 7-digit number"
    );
      cy.get("#gmcNumber").clear();
    cy.get("#gmcNumber--error-message").contains(
      "GMC number is required"
    );
    cy.get("#gmcNumber").clear().type("abcdefg");
    cy.get("#gmcNumber--error-message").contains(
      "GMC must be a 7-digit number"
    );
    cy.get("#gmcNumber").clear().type("1234567");
    cy.get("#gmcNumber--error-message").should("not.exist");
  });
});
