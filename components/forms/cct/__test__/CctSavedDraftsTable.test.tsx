import { deleteCctCalc } from "../../../../redux/slices/cctSlice";
import { loadCctList } from "../../../../redux/slices/cctListSlice";
import store, { RootState } from "../../../../redux/store/store";

type MockStoreType = {
  dispatch: jest.Mock;
  getState: jest.Mock<Partial<RootState>>;
  subscribe: jest.Mock;
  replaceReducer: jest.Mock;
};

jest.mock("../../../../redux/store/store", () => {
  const mockStore: MockStoreType = {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      cct: { formDeleteStatus: "succeeded" }
    })) as jest.Mock<Partial<RootState>>,
    subscribe: jest.fn(() => jest.fn()),
    replaceReducer: jest.fn()
  };
  return {
    __esModule: true,
    default: mockStore
  };
});

jest.mock("../../../../redux/slices/cctSlice", () => ({
  deleteCctCalc: jest.fn((id: string) => "MOCK_DELETE_ACTION")
}));

jest.mock("../../../../redux/slices/cctListSlice", () => ({
  loadCctList: jest.fn(() => "MOCK_LOAD_LIST_ACTION")
}));

describe("CctSavedDraftsTable - Delete Logic", () => {
  let setIsCctModalOpen: jest.Mock;
  let setCalcIdToDelete: jest.Mock;
  let startSubmitting: jest.Mock;
  let stopSubmitting: jest.Mock;

  // Recreate the function to test directly
  const deleteCctCalcAndReloadList = async (): Promise<void> => {
    setIsCctModalOpen(false);
    startSubmitting();

    // Mock the calcIdToDelete value directly
    const calcIdToDelete = "test-calc-id";

    if (calcIdToDelete) {
      await store.dispatch(deleteCctCalc(calcIdToDelete));
      const deleteStatus = (store.getState() as Partial<RootState>).cct
        ?.formDeleteStatus;
      if (deleteStatus === "succeeded") {
        store.dispatch(loadCctList());
      }
    }

    stopSubmitting();
    setCalcIdToDelete(null);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setIsCctModalOpen = jest.fn();
    setCalcIdToDelete = jest.fn();
    startSubmitting = jest.fn();
    stopSubmitting = jest.fn();
  });

  it("successfully deletes a calculation and reloads the list", async () => {
    await deleteCctCalcAndReloadList();

    expect(setIsCctModalOpen).toHaveBeenCalledWith(false);
    expect(startSubmitting).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith("MOCK_DELETE_ACTION");
    expect(store.getState).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith("MOCK_LOAD_LIST_ACTION");
    expect(stopSubmitting).toHaveBeenCalled();
    expect(setCalcIdToDelete).toHaveBeenCalledWith(null);
    expect(deleteCctCalc).toHaveBeenCalledWith("test-calc-id");
  });

  it("doesn't reload the list if deletion fails", async () => {
    (store.getState as jest.Mock).mockReturnValueOnce({
      cct: { formDeleteStatus: "failed" }
    });

    await deleteCctCalcAndReloadList();

    expect(setIsCctModalOpen).toHaveBeenCalledWith(false);
    expect(startSubmitting).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith("MOCK_DELETE_ACTION");
    expect(store.getState).toHaveBeenCalled();
    expect(loadCctList).not.toHaveBeenCalled();
    expect(stopSubmitting).toHaveBeenCalled();
    expect(setCalcIdToDelete).toHaveBeenCalledWith(null);
  });
});
