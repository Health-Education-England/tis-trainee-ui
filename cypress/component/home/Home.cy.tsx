import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import Home from "../../../components/home/Home";
import {
  updatedCognitoGroups,
  updatedPreferredMfa
} from "../../../redux/slices/userSlice";
import history from "../../../components/navigation/history";

const homeCards = [
  "Profile",
  "Placements",
  "Programmes",
  "Form R (Part A)",
  "Form R (Part B)",
  "Support",
  "MFA",
  "Action Summary",
  "CCT (Certificate of Completion of Training)",
  "Changing hours (LTFT)"
];

describe("Home with no MFA set up", () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Home />
        </Router>
      </Provider>
    );
  });
  homeCards.forEach(card => {
    it(`should not display the ${card} card on the Home page`, () => {
      cy.get(`[data-cy="${card}"]`).should("not.exist");
    });
  });
});

describe("Home with MFA set up", () => {
  beforeEach(() => {
    store.dispatch(updatedPreferredMfa("SMS"));
    store.dispatch(updatedCognitoGroups(["beta-consultants"]));
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Home />
        </Router>
      </Provider>
    );
  });

  homeCards.forEach(card => {
    it(`should display the ${card} card on the Home page`, () => {
      cy.get(`[data-cy="${card}"]`).should("exist");
    });
  });
});
