import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import FormRPartB from "../../../../components/forms/formr-part-b/FormRPartB";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import React from "react";

describe("FormRPartB routes page", () => {
  it("should render without crashing", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormRPartB />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("include.text", "Form R (Part B)");
  });
});