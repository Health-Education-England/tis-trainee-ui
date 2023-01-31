import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import FormRPartA from "../formr-part-a/FormRPartA";
import store from "../../../redux/store/store";
import history from "../../navigation/history";

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
