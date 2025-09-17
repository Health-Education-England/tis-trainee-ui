import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { Formik, Form } from "formik";
import { MobilePhoneValidationSchema } from "../../../components/authentication/setMfa/ValidationSchema";
import MobilePhoneInputField from "../../../components/forms/MobilePhoneInputField";
import history from "../../../components/navigation/history";
import React from "react";

describe("MobilephoneInputField in Formik form", () => {
  it("should ", () => {
    const MockedForm = () => {
      return (
        <Formik
          initialValues={{ mobilePhoneNumber: "" }}
          onSubmit={() => console.log("submitting")}
          validationSchema={MobilePhoneValidationSchema}
        >
          <Form>
            <MobilePhoneInputField
              label="Enter your mobile phone number below where we will send authentication
          codes during sign in."
              name="mobilePhoneNumber"
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
    cy.get(".nhsuk-label")
      .should("exist")
      .contains(
        "Enter your mobile phone number below where we will send authentication codes during sign in."
      );
    cy.get(".PhoneInputCountrySelect").select("Syria");
    cy.get(".PhoneInputCountryIconImg").should("exist");
    cy.get(".PhoneInputCountrySelect").select("United Kingdom");
    cy.get("#confirmTOTPCode--error-message").contains(
      "Please enter a mobile phone number"
    );
    cy.get(".PhoneInputInput").clear().type("01");
    cy.get("#confirmTOTPCode--error-message").contains(
      "Please enter a valid mobile phone number."
    );
    cy.get(".PhoneInputInput").clear().type("07777777777");
    cy.get("#confirmTOTPCode--error-message").should(
      "not.contain",
      "Please enter a mobile phone number"
    );
  });
});
