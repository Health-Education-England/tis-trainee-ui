import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { Action, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { useLtftHomeStartover } from "../useLtftHomeStartover";
import {
  fetchLtftSummaryList,
  updatedLtftFormsRefreshNeeded
} from "../../../redux/slices/ltftSummaryListSlice";
import { resetForm } from "../../FormBuilderUtilities";

jest.mock("../../FormBuilderUtilities", () => ({
  resetForm: jest.fn()
}));

// Mock action creators with proper return values
jest.mock("../../../redux/slices/ltftSummaryListSlice", () => ({
  fetchLtftSummaryList: jest.fn(() => ({
    type: "ltftSummaryList/fetchLtftSummaryList"
  })),
  updatedLtftFormsRefreshNeeded: jest.fn(() => ({
    type: "ltftList/updatedLtftFormsRefreshNeeded"
  }))
}));

jest.mock("../useIsBetaTester", () => ({
  __esModule: true,
  default: jest.fn(() => true)
}));

//Custom Type for test state to avoid having to use the real RootState type!
type TestState = {
  ltftSummaryList: {
    ltftFormsRefreshNeeded: boolean;
  };
};

const testReducer = (
  state: TestState = { ltftSummaryList: { ltftFormsRefreshNeeded: true } },
  _action: Action
) => {
  return state;
};

const TestComponent = () => {
  useLtftHomeStartover();
  return null;
};

describe("useLtftHomeStartover", () => {
  let testStore: EnhancedStore<TestState>;

  beforeEach(() => {
    jest.clearAllMocks();

    testStore = configureStore({
      reducer: testReducer,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          serializableCheck: false
        })
    });
  });

  it("should dispatch actions and call resetForm when isBetaTester is true", async () => {
    render(
      <Provider store={testStore}>
        <TestComponent />
      </Provider>
    );

    await waitFor(() => {
      expect(fetchLtftSummaryList).toHaveBeenCalled();
      expect(updatedLtftFormsRefreshNeeded).toHaveBeenCalledWith(false);
      expect(resetForm).toHaveBeenCalledWith("ltft");
    });
  });
});
