import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import Createlist from "./CreateList";
import store from "../../redux/store/store";
import history from "../../components/navigation/history";

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
