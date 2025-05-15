import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RowCctActions } from "../CctSavedDraftsTable";
import store from "../../../../redux/store/store";
import { Provider } from "react-redux";
import { deleteCctCalc } from "../../../../redux/slices/cctSlice";
import { mockCctList } from "../../../../mock-data/mock-cct-data";

let storeState = {
  cct: { formDeleteStatus: "idle" }
};

jest.mock("../../../../redux/store/store", () => ({
  __esModule: true,
  default: {
    dispatch: jest.fn(action => Promise.resolve(action)),
    getState: jest.fn(() => storeState),
    subscribe: jest.fn(() => jest.fn()),
    replaceReducer: jest.fn()
  }
}));

jest.mock("../../../../redux/slices/cctSlice", () => ({
  deleteCctCalc: jest.fn()
}));

jest.mock("../../../../redux/slices/cctListSlice", () => ({
  loadCctList: jest.fn(() => "MOCK_LOAD_ACTION")
}));

jest.mock("../../../../utilities/hooks/useIsLtftPilot", () => ({
  useIsLtftPilot: () => false
}));

jest.mock("../../../../components/navigation/history", () => ({
  push: jest.fn()
}));

jest.mock("../../../../utilities/hooks/useSubmitting", () => ({
  useSubmitting: () => ({
    isSubmitting: false,
    startSubmitting: jest.fn(),
    stopSubmitting: jest.fn()
  })
}));

describe("RowCctActions - Delete Button", () => {
  const mockRow = mockCctList[0];
  const mockSetIsModalOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    storeState = { cct: { formDeleteStatus: "idle" } };
  });

  it("should call deleteCctCalc and loadCctList when delete button is clicked", async () => {
    // Setup deleteCctCalc to simulate a successful delete
    (deleteCctCalc as unknown as jest.Mock).mockReturnValue(
      "MOCK_DELETE_ACTION"
    );

    // Set up the dispatch mock to change the state after "delete" action
    (store.dispatch as jest.Mock).mockImplementation(action => {
      if (action === "MOCK_DELETE_ACTION") {
        storeState = { cct: { formDeleteStatus: "succeeded" } };
      }
      return Promise.resolve();
    });

    render(
      <Provider store={store}>
        <RowCctActions row={mockRow} setIsModalOpen={mockSetIsModalOpen} />
      </Provider>
    );

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteCctCalc).toHaveBeenCalledWith(mockRow.id);
      expect(store.dispatch).toHaveBeenCalledWith("MOCK_DELETE_ACTION");
      expect(store.dispatch).toHaveBeenCalledWith("MOCK_LOAD_ACTION");
    });
  });

  it("should not call loadCctList if delete operation fails", async () => {
    (deleteCctCalc as unknown as jest.Mock).mockReturnValue(
      "MOCK_DELETE_ACTION"
    );

    (store.dispatch as jest.Mock).mockImplementation(action => {
      if (action === "MOCK_DELETE_ACTION") {
        storeState = { cct: { formDeleteStatus: "failed" } };
      }
      return Promise.resolve();
    });

    render(
      <Provider store={store}>
        <RowCctActions row={mockRow} setIsModalOpen={mockSetIsModalOpen} />
      </Provider>
    );

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteCctCalc).toHaveBeenCalledWith(mockRow.id);
      expect(store.dispatch).toHaveBeenCalledWith("MOCK_DELETE_ACTION");
    });

    expect(store.dispatch).not.toHaveBeenCalledWith("MOCK_LOAD_ACTION");
  });
});
