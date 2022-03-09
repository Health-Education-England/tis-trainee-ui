import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Createlist from "./CreateList";
import store from "../../redux/store/store";

describe("CreateList", () => {
  it("should mount comp without crashing", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <Createlist history={[]} />
        </BrowserRouter>
      </Provider>
    );
  });
});
