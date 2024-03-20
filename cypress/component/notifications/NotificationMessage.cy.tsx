import { mount } from "cypress/react18";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import history from "../../../components/navigation/history";
import { NotificationMessage } from "../../../components/notifications/NotificationMessage";
import store from "../../../redux/store/store";

describe("NotificationMessage", () => {
  beforeEach(() => {
    cy.viewport("macbook-15");
    mount(
      <Provider store={store}>
        <Router history={history}>
          <NotificationMessage />
        </Router>
      </Provider>
    );
  });

  it("should display the error page when no matched active notification to display", () => {
    cy.get('[data-cy="backLink"]')
      .should("exist")
      .should("include.text", "Back to list");
    cy.url().should("include", "/notifications");
    cy.get('[data-cy="error-header-text"]')
      .should("exist")
      .contains("Oops! Something went wrong");
    cy.get('[data-cy="error-message-text"]')
      .should("exist")
      .contains(
        "Couldn't load this message. Please check your internet connection and try again."
      );
  });
});
