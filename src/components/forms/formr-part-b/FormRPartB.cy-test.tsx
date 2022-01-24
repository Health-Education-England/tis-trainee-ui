import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import FormRPartB from "../formr-part-b/FormRPartB";
import store from "../../../redux/store/store";

describe("FormRPartB routes page", () => {
  it("should render without crashing", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <FormRPartB />
        </BrowserRouter>
      </Provider>
    );
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("include.text", "Form R (Part B)");
    cy.get("[data-cy=btnLoadNewForm]").should("exist");
  });
});
