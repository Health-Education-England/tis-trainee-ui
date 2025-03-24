import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react18";
import store from "../../../../redux/store/store";
import { LtftHome } from "../../../../components/forms/ltft/LtftHome";

describe("LtftHome", () => {
  it("renders the LtftHome component", () => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/ltft"]}>
          <LtftHome />
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="ltft-current-summary-header"]')
      .should("exist")
      .contains("In progress application");
    cy.get('[data-cy="cct-link"]')
      .should("exist")
      .contains(
        "Choose a CCT Calculation to begin a new Changing hours (LTFT) application"
      );
    cy.get('[data-cy="ltft-previous-summary-header"]')
      .should("exist")
      .contains("Previous applications summary");
  });
});
