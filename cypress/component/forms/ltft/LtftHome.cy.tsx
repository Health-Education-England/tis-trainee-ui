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
    cy.get('[data-cy="ltft-tracker-header"]')
      .should("exist")
      .contains("New Application");
    cy.get('[data-cy="ltft-summary-header"]')
      .should("exist")
      .contains("Applications summary");
    cy.get('[data-cy="choose-cct-btn"]')
      .should("exist")
      .contains(
        "Choose a CCT Calculation to begin your Changing hours (LTFT) application"
      );
  });
});
