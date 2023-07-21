import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import { HomeHeaderSection } from "../../../components/home/HomeHeaderSection";
import history from "../../../components/navigation/history";

describe("HomeHeaderSection", () => {
  it("should display the homeWelcomeHeaderText", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <HomeHeaderSection />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=homeWelcomeHeaderText]").should(
      "contain",
      "Welcome to TIS Self-Service"
    );
    cy.get("[data-cy=homeWelcomeSubHeaderText]").should(
      "contain",
      "Your post-graduate training programme resource"
    );
    cy.get("[data-cy=homeWelcomeBodyText]").should(
      "include.text",
      "Our goal is to improve your training experience by making TIS Self-Service a one-stop-shop "
    );
    cy.get('[data-cy="tssUpdatesContainer"]').should("exist");
  });
});
