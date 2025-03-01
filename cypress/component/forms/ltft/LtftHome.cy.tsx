import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react18";
import store from "../../../../redux/store/store";
import { LtftHome } from "../../../../components/forms/ltft/LtftHome";
import { updatedLtftSummaryList } from "../../../../redux/slices/ltftSummaryListSlice";
import { mockLtftsList1 } from "../../../../mock-data/mock-ltft-data";
import * as hooks from "../../../../utilities/hooks/useIsBetaTester";

describe("LtftHome - new application", () => {
  it("renders the LtftHome component with 'new application' tracker", () => {
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/ltft"]}>
          <LtftHome />
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="ltft-tracker-header"]')
      .should("exist")
      .contains("New application");
    cy.get('[data-cy="ltft-summary-header"]')
      .should("exist")
      .contains("Previous applications summary");
    cy.get('[data-cy="choose-cct-btn"]')
      .should("exist")
      .contains(
        "Choose a CCT Calculation to begin your Changing hours (LTFT) application"
      );
    cy.get('[data-cy="ltft-startover-btn"]').should("not.exist");
  });

  it("renders the LtftHome component with 'draft' tracker", () => {
    store.dispatch(updatedLtftSummaryList(mockLtftsList1));
    cy.stub(hooks, "default").returns(true);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/ltft"]}>
          <LtftHome />
        </MemoryRouter>
      </Provider>
    );
    cy.get('[data-cy="ltft-tracker-header"]').contains(
      "In progress application"
    );
    cy.get('[data-cy="continue-application-button"]').should("exist");
    cy.get('[data-cy="startOverButton"]').should("exist");
  });
});
