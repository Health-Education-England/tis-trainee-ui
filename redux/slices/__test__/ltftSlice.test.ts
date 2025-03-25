import {
  AnyAction,
  configureStore,
  EnhancedStore,
  ThunkDispatch
} from "@reduxjs/toolkit";
import ltftReducer, {
  saveLtft,
  LtftObj,
  updateLtft,
  deleteLtft,
  loadSavedLtft,
  updatedCanEditLtft,
  updatedEditPageNumberLtft,
  resetToInitLtft,
  setLtftCctSnapshot,
  updatedLtft,
  updatedLtftSaveStatus,
  initialState,
  LtftState
} from "../ltftSlice";
import { FormsService } from "../../../services/FormsService";
import * as ltftUtilities from "../../../utilities/ltftUtilities";
import * as ToastMessage from "../../../components/common/ToastMessage";
import { mockLtftDraft1 } from "../../../mock-data/mock-ltft-data";
import { CctCalculation } from "../cctSlice";
import { LtftDto, mapLtftObjToDto } from "../../../utilities/ltftUtilities";
import { AxiosResponse, AxiosRequestHeaders } from "axios";

jest.mock("../../../services/FormsService");
jest.mock("../../../utilities/ltftUtilities");
jest.mock("../../../components/common/ToastMessage");

type TestStore = EnhancedStore<{
  ltft: LtftState;
}> & {
  dispatch: ThunkDispatch<{ ltft: LtftState }, unknown, AnyAction>;
};

// Factory function to create tests for saveLtft and updateLtft thunks
const createLtftThunkTests = (
  thunkName: string,
  thunkAction: typeof saveLtft | typeof updateLtft,
  serviceMethodName: "saveLtft" | "updateLtft"
): void => {
  describe(`ltftSlice - ${thunkName} thunk`, () => {
    let store: TestStore;
    const mockFormData: LtftObj = mockLtftDraft1;
    const mockResponse: AxiosResponse<LtftDto, any> = {
      status: 200,
      statusText: "OK",
      config: {
        headers: {} as AxiosRequestHeaders
      },
      headers: {} as AxiosRequestHeaders,
      data: {
        ...mapLtftObjToDto(mockFormData),
        id: "123updated",
        lastModified: "2023-01-01T12:30:00"
      }
    };
    const mockMappedResponse: LtftObj = {
      ...mockFormData,
      id: "123updated",
      lastModified: "2023-01-01T12:30:00"
    };

    beforeEach(() => {
      store = configureStore({
        reducer: {
          ltft: ltftReducer
        }
      });

      jest.clearAllMocks();

      (ltftUtilities.mapLtftObjToDto as jest.Mock).mockReturnValue({
        mockResponse
      });
      (ltftUtilities.mapLtftDtoToObj as jest.Mock).mockReturnValue(
        mockMappedResponse
      );
    });

    test("should handle successful save/update", async () => {
      (
        FormsService.prototype[serviceMethodName] as jest.Mock
      ).mockResolvedValue(mockResponse);

      const result = await store.dispatch(
        thunkAction({
          formData: mockFormData,
          isAutoSave: false,
          isSubmit: false,
          showFailToastOnly: false
        })
      );

      expect(ltftUtilities.mapLtftObjToDto).toHaveBeenCalledWith(mockFormData);
      expect(FormsService.prototype[serviceMethodName]).toHaveBeenCalled();
      expect(FormsService.prototype.submitLtft).not.toHaveBeenCalled();
      expect(ltftUtilities.mapLtftDtoToObj).toHaveBeenCalledWith(
        mockResponse.data
      );
      expect(ToastMessage.showToast).toHaveBeenCalled();
      expect(result.payload).toEqual({
        data: mockMappedResponse,
        isAutoSave: false,
        isSubmit: false,
        showFailToastOnly: false
      });
      expect(store.getState().ltft.formData).toEqual(mockMappedResponse);
      expect(store.getState().ltft.saveStatus).toBe("succeeded");
    });

    test("should handle successful operation with auto-save", async () => {
      (
        FormsService.prototype[serviceMethodName] as jest.Mock
      ).mockResolvedValue(mockResponse);

      await store.dispatch(
        thunkAction({
          formData: mockFormData,
          isAutoSave: true,
          isSubmit: false,
          showFailToastOnly: false
        })
      );

      expect(FormsService.prototype[serviceMethodName]).toHaveBeenCalled();
      expect(ToastMessage.showToast).not.toHaveBeenCalled();
      expect(store.getState().ltft.saveStatus).toBe("succeeded");
      expect(store.getState().ltft.saveLatestTimeStamp).not.toBe(
        "none this session"
      );
    });

    test("should handle successful submit", async () => {
      (FormsService.prototype.submitLtft as jest.Mock).mockResolvedValue(
        mockResponse
      );

      await store.dispatch(
        thunkAction({
          formData: mockFormData,
          isAutoSave: false,
          isSubmit: true,
          showFailToastOnly: false
        })
      );

      expect(FormsService.prototype.submitLtft).toHaveBeenCalled();
      expect(FormsService.prototype[serviceMethodName]).not.toHaveBeenCalled();
      expect(ToastMessage.showToast).toHaveBeenCalled();
      expect(store.getState().ltft.saveStatus).toBe("succeeded");
    });

    test("should handle failure when saving/updating", async () => {
      const errorType = serviceMethodName === "saveLtft" ? "SAVE" : "UPDATE";
      const error = {
        code: `ERR_${errorType}`,
        message: `Failed to ${
          serviceMethodName === "saveLtft" ? "save" : "update"
        }`
      };
      (
        FormsService.prototype[serviceMethodName] as jest.Mock
      ).mockRejectedValue(error);

      await store.dispatch(
        thunkAction({
          formData: mockFormData,
          isAutoSave: false,
          isSubmit: false,
          showFailToastOnly: false
        })
      );

      expect(store.getState().ltft.saveStatus).toBe("failed");
      expect(store.getState().ltft.error).toBe(error.message);
      expect(ToastMessage.showToast).toHaveBeenCalled();
    });

    test("should handle failure when submitting", async () => {
      const error = { code: "ERR_SUBMIT", message: "Failed to submit" };
      (FormsService.prototype.submitLtft as jest.Mock).mockRejectedValue(error);

      await store.dispatch(
        thunkAction({
          formData: mockFormData,
          isAutoSave: false,
          isSubmit: true,
          showFailToastOnly: false
        })
      );

      expect(store.getState().ltft.saveStatus).toBe("failed");
      expect(ToastMessage.showToast).toHaveBeenCalled();
    });

    test(`should not show toast when auto-${
      serviceMethodName === "saveLtft" ? "saving" : "updating"
    } fails`, async () => {
      const operationName =
        serviceMethodName === "saveLtft" ? "save" : "update";
      const error = {
        code: `ERR_AUTO_${operationName.toUpperCase()}`,
        message: `Failed to auto-${operationName}`
      };
      (
        FormsService.prototype[serviceMethodName] as jest.Mock
      ).mockRejectedValue(error);

      await store.dispatch(
        thunkAction({
          formData: mockFormData,
          isAutoSave: true,
          isSubmit: false,
          showFailToastOnly: false
        })
      );

      expect(store.getState().ltft.saveStatus).toBe("failed");
      expect(ToastMessage.showToast).not.toHaveBeenCalled();
    });

    test(`should not show toast when successful ${
      serviceMethodName === "saveLtft" ? "save" : "update"
    } (not autosave) and showFailToastOnly is true`, async () => {
      (
        FormsService.prototype[serviceMethodName] as jest.Mock
      ).mockResolvedValue(mockResponse);

      await store.dispatch(
        thunkAction({
          formData: mockFormData,
          isAutoSave: false,
          isSubmit: false,
          showFailToastOnly: true
        })
      );

      expect(ToastMessage.showToast).not.toHaveBeenCalled();
    });
  });
};

createLtftThunkTests("saveLtft", saveLtft, "saveLtft");
createLtftThunkTests("updateLtft", updateLtft, "updateLtft");

describe("ltftSlice - deleteLtft thunk", () => {
  let store: TestStore;
  const mockFormId = "ltft-123";

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ltft: ltftReducer
      }
    });

    jest.clearAllMocks();
  });

  test("should handle successful deletion", async () => {
    const mockResponse = { success: true };
    (FormsService.prototype.deleteLtft as jest.Mock).mockResolvedValue(
      mockResponse
    );

    await store.dispatch(deleteLtft(mockFormId));

    expect(FormsService.prototype.deleteLtft).toHaveBeenCalledWith(mockFormId);
    expect(ToastMessage.showToast).toHaveBeenCalled();
    expect(store.getState().ltft.status).toBe("succeeded");
  });

  test("should handle deletion failure", async () => {
    const error = {
      code: "ERR_DELETE",
      message: "Failed to delete LTFT form"
    };
    (FormsService.prototype.deleteLtft as jest.Mock).mockRejectedValue(error);

    await store.dispatch(deleteLtft(mockFormId));

    expect(FormsService.prototype.deleteLtft).toHaveBeenCalledWith(mockFormId);
    expect(store.getState().ltft.status).toBe("failed");
    expect(store.getState().ltft.error).toBe(error.message);
    expect(ToastMessage.showToast).toHaveBeenCalledWith(
      expect.any(String),
      ToastMessage.ToastType.ERROR,
      `${error.code}-${error.message}`
    );
  });

  test("should set status to 'deleting' when deletion is pending", () => {
    (FormsService.prototype.deleteLtft as jest.Mock).mockReturnValue(
      new Promise(() => {}) // Never resolves to keep action in pending state
    );
    store.dispatch(deleteLtft(mockFormId));
    expect(store.getState().ltft.status).toBe("deleting");
  });
});

describe("ltftSlice - loadSavedLtft thunk", () => {
  let store: TestStore;
  const mockFormId = "ltft-456";
  let mockResponse: AxiosResponse<LtftDto, any>;
  let mockMappedLtft: LtftObj;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ltft: ltftReducer
      }
    });

    jest.clearAllMocks();

    mockResponse = {
      status: 200,
      statusText: "OK",
      config: {
        headers: {} as AxiosRequestHeaders
      },
      headers: {} as AxiosRequestHeaders,
      data: {
        ...mapLtftObjToDto(mockLtftDraft1),
        id: mockFormId,
        lastModified: "2023-01-01T12:30:00"
      }
    };

    mockMappedLtft = {
      ...mockLtftDraft1,
      id: mockFormId
    };

    (ltftUtilities.mapLtftDtoToObj as jest.Mock).mockReturnValue(
      mockMappedLtft
    );
  });

  test("should handle successful form loading", async () => {
    (FormsService.prototype.getLtftFormById as jest.Mock).mockResolvedValue(
      mockResponse
    );

    await store.dispatch(loadSavedLtft(mockFormId));

    expect(FormsService.prototype.getLtftFormById).toHaveBeenCalledWith(
      mockFormId
    );
    expect(ltftUtilities.mapLtftDtoToObj).toHaveBeenCalledWith(
      mockResponse.data
    );
    expect(store.getState().ltft.status).toBe("succeeded");
    expect(store.getState().ltft.formData).toEqual(mockMappedLtft);
  });

  test("should handle form loading failure", async () => {
    const error = {
      code: "ERR_LOAD",
      message: "Failed to load LTFT form"
    };
    (FormsService.prototype.getLtftFormById as jest.Mock).mockRejectedValue(
      error
    );
    await store.dispatch(loadSavedLtft(mockFormId));
    expect(FormsService.prototype.getLtftFormById).toHaveBeenCalledWith(
      mockFormId
    );
    expect(store.getState().ltft.status).toBe("failed");
    expect(store.getState().ltft.error).toBe(error.message);
    expect(ToastMessage.showToast).toHaveBeenCalledWith(
      expect.any(String),
      ToastMessage.ToastType.ERROR,
      `${error.code}-${error.message}`
    );
  });

  test("should set status to 'loading' when form loading is pending", () => {
    (FormsService.prototype.getLtftFormById as jest.Mock).mockReturnValue(
      new Promise(() => {})
    );

    store.dispatch(loadSavedLtft(mockFormId));

    expect(store.getState().ltft.status).toBe("loading");
  });
});

// reducer tests
describe("ltftSlice - reducers", () => {
  let store: TestStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ltft: ltftReducer
      }
    });

    jest.clearAllMocks();
  });

  test("resetToInitLtft should reset state to initial values", () => {
    store.dispatch(updatedCanEditLtft(true));
    store.dispatch(updatedEditPageNumberLtft(5));

    expect(store.getState().ltft.canEdit).toBe(true);
    expect(store.getState().ltft.editPageNumber).toBe(5);

    store.dispatch(resetToInitLtft());

    // Verify state was reset
    expect(store.getState().ltft).toEqual(initialState);
  });

  test("setLtftCctSnapshot should update LtftCctSnapshot", () => {
    const mockCctSnapshot = {
      id: "cct-123",
      created: "2024-01-01"
    } as unknown as CctCalculation;

    store.dispatch(setLtftCctSnapshot(mockCctSnapshot));

    expect(store.getState().ltft.LtftCctSnapshot).toEqual(mockCctSnapshot);
  });

  test("updatedLtft should update formData", () => {
    store.dispatch(updatedLtft(mockLtftDraft1));
    expect(store.getState().ltft.formData).toEqual(mockLtftDraft1);
  });

  test("updatedCanEditLtft should update canEdit flag", () => {
    expect(store.getState().ltft.canEdit).toBe(false); // Initial state

    store.dispatch(updatedCanEditLtft(true));
    expect(store.getState().ltft.canEdit).toBe(true);

    store.dispatch(updatedCanEditLtft(false));
    expect(store.getState().ltft.canEdit).toBe(false);
  });

  test("updatedEditPageNumberLtft should update editPageNumber", () => {
    expect(store.getState().ltft.editPageNumber).toBe(0); // Initial state

    store.dispatch(updatedEditPageNumberLtft(3));
    expect(store.getState().ltft.editPageNumber).toBe(3);

    store.dispatch(updatedEditPageNumberLtft(1));
    expect(store.getState().ltft.editPageNumber).toBe(1);
  });

  test("updatedLtftSaveStatus should update saveStatus", () => {
    expect(store.getState().ltft.saveStatus).toBe("idle"); // Initial state

    store.dispatch(updatedLtftSaveStatus("saving"));
    expect(store.getState().ltft.saveStatus).toBe("saving");

    store.dispatch(updatedLtftSaveStatus("succeeded"));
    expect(store.getState().ltft.saveStatus).toBe("succeeded");

    store.dispatch(updatedLtftSaveStatus("failed"));
    expect(store.getState().ltft.saveStatus).toBe("failed");
  });
});
