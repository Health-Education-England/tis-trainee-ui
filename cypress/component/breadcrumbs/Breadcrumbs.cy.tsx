import { mount } from "cypress/react";
import { Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import { updatedPreferredMfa } from "../../../redux/slices/userSlice";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumbs";

describe("Breadcrumbs", () => {
  it("should display the Home link if MFA is set up", () => {
    store.dispatch(updatedPreferredMfa("SMS"));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Breadcrumbs />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="homeLink"]').should("exist").should("have.text", "Home");
  });
});

// TODO mock useLocation to test HomeHeaderSection comp
