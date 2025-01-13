import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { Ltft } from "../../../components/ltft/Ltft";
import store from "../../../redux/store/store";
import history from "../../../components/navigation/history";

describe("Ltft", () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Ltft />
        </Router>
      </Provider>
    );
  });
  it("renders the Ltft page", () => {
    cy.get("[data-cy=ltftHeading]").contains("Changing hours (LTFT)");
  });
});
