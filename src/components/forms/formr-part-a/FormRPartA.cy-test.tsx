import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import FormRPartA from "../formr-part-a/FormRPartA";
import store from "../../../redux/store/store";

describe("FormRPartA routes page", () => {
  it("should render without crashing", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <FormRPartA />
        </BrowserRouter>
      </Provider>
    );
    cy.get('[data-cy="formraLabel"]')
      .should("exist")
      .should("include.text", "Trainee registration");
  });
});
