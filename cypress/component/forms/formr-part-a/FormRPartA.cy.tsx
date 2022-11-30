import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import FormRPartA from "../../../../src/components/forms/formr-part-a/FormRPartA";
import store from "../../../../src/redux/store/store";
import history from "../../../../src/components/navigation/history";
import React from "react";

describe("FormRPartA routes page", () => {
  it("should render without crashing", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <FormRPartA />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="formraLabel"]')
      .should("exist")
      .should("include.text", "Trainee registration");
  });
});
