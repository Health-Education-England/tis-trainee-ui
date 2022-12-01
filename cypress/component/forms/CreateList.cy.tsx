import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import Createlist from "../../../src/components/forms/CreateList";
import store from "../../../src/redux/store/store";
import history from "../../../src/components/navigation/history";
import React from "react";

describe("CreateList", () => {
  it("should mount comp without crashing", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <Createlist history={[]} />
        </Router>
      </Provider>
    );
  });
});
