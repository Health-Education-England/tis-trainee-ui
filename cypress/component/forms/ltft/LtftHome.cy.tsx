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
      .contains("In progress application");
    cy.get('[data-cy="ltft-summary-header"]')
      .should("exist")
      .contains("Previous applications summary");
    cy.get('[data-cy="continue-application-button"]')
      .should("exist")
      .contains("Continue draft application");
    cy.get('[data-cy="ltft-startover-btn"]')
      .should("exist")
      .contains("Start over");
  });
});
