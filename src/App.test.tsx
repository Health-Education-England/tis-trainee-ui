import App from "./App";
import { shallow, mount } from "enzyme";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { Router } from "react-router-dom";
import history from "./components/navigation/history";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const globalAny: any = global;

beforeEach(() => {
  const store = mockStore({});

  globalAny.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          version: "0.1.1"
        })
    })
  );

  mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <Router history={history}>
          <App />
        </Router>
      </MemoryRouter>
    </Provider>
  );
});

describe("App", () => {
  it("renders without crashing", () => {
    shallow(<App />);
  });
});
