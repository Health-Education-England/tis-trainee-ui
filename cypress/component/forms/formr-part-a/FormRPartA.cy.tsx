import React from "react";
import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import FormRPartA from "../../../../components/forms/form-builder/form-r/part-a/FormRPartA";
import store from "../../../../redux/store/store";
import history from "../../../../components/navigation/history";
import { updatedPreferredMfa } from "../../../../redux/slices/userSlice";

describe("FormRPartA routes page", () => {
  it("should render without crashing", () => {
    store.dispatch(updatedPreferredMfa("SMS"));
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
