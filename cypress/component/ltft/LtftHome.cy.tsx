import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { LtftHome } from "../../../components/ltft/LtftHome";
import store from "../../../redux/store/store";
import history from "../../../components/navigation/history";

describe("LtftHome", () => {
  it("renders the LtftHome component", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <LtftHome />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=ltft-tracker-header]").contains(
      "Current Changing hours (LTFT) application"
    );
    cy.get("[data-cy=ltft-summary-header]").contains("Applications summary");
  });
});
