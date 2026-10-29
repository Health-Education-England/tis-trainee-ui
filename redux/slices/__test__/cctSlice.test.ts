import { configureStore } from "@reduxjs/toolkit";
import { CctCalculation } from "../../../models/CctTypes";
import { ApiError } from "../../../services/apiService";
import {
  CctCalculationSaveRequest,
  CctService
} from "../../../services/CctService";
import cctReducer, {
  deleteCctCalculation,
  fetchCctCalculations,
  loadSavedCctCalculation,
  resetCctCalculation,
  resetCctCalculations,
  saveCctCalculation
} from "../cctSlice";

const calculation: CctCalculation = {
  id: "5f0c9a3e-8a4d-4c55-9a51-0f6a2f1d7c11",
  name: "Parental leave",
  programmeDetails: {
    specialty: "Paediatrics",
    startDate: "2023-08-02",
    lengthMonths: 84,
    startGrade: "ST1",
    startGradeOverrideNotes: "",
    additionalMonths: 0,
    additionalMonthsNotes: "",
    acceleratedMonths: 0,
    acceleratedMonthsNotes: "",
    eighteenMonthFinalGrade: null,
    eighteenMonthFinalGradeNotes: "",
    skippedGrade: null,
    skippedGradeNotes: ""
  },
  changes: [],
  result: {
    cctDate: "2030-08-01",
    originalProgrammeEndDate: "2030-08-01",
    adjustedProgrammeEndDate: "2030-08-01",
    totalWteMonthsCompleted: 0,
    monthsRemaining: 84,
    assumedFullTimePeriods: [],
    projection: {
      startDate: "2023-08-02",
      wte: 1,
      calendarMonths: 84,
      wteMonths: 84
    }
  },
  created: "2026-10-28T10:00:00Z",
  lastModified: "2026-10-28T10:00:00Z"
};

const newRequest: CctCalculationSaveRequest = {
  name: calculation.name,
  programmeDetails: calculation.programmeDetails,
  changes: []
};

const makeStore = () => configureStore({ reducer: { cct: cctReducer } });

describe("cctSlice", () => {
  const initial = cctReducer(undefined, { type: "init" });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("loadSavedCctCalculation", () => {
    it("holds the saved calculation once it loads", async () => {
      const getSpy = jest
        .spyOn(CctService.prototype, "getCalculation")
        .mockResolvedValue(calculation);
      const store = makeStore();

      await store.dispatch(loadSavedCctCalculation(calculation.id));

      expect(getSpy).toHaveBeenCalledWith(calculation.id);
      expect(store.getState().cct).toEqual({
        ...initial,
        calculation,
        loadStatus: "succeeded"
      });
    });

    it("records the status when the BE refuses the request", async () => {
      jest.spyOn(CctService.prototype, "getCalculation").mockRejectedValue(
        new ApiError({
          data: {},
          status: 404,
          statusText: "Not Found",
          headers: {},
          config: {}
        })
      );
      const store = makeStore();

      await store.dispatch(loadSavedCctCalculation(calculation.id));

      expect(store.getState().cct).toEqual({
        ...initial,
        loadStatus: "failed",
        loadErrorStatus: 404
      });
    });

    it("records no status when the request fails without a response", async () => {
      jest
        .spyOn(CctService.prototype, "getCalculation")
        .mockRejectedValue(new TypeError("Failed to fetch"));
      const store = makeStore();

      await store.dispatch(loadSavedCctCalculation(calculation.id));

      expect(store.getState().cct).toEqual({
        ...initial,
        loadStatus: "failed",
        loadErrorStatus: null
      });
    });

    it("forgets the calculation when reset", async () => {
      jest
        .spyOn(CctService.prototype, "getCalculation")
        .mockResolvedValue(calculation);
      const store = makeStore();
      await store.dispatch(loadSavedCctCalculation(calculation.id));

      store.dispatch(resetCctCalculation());

      expect(store.getState().cct).toEqual(initial);
    });
  });

  describe("fetchCctCalculations", () => {
    it("holds the saved calculations once they load", async () => {
      jest
        .spyOn(CctService.prototype, "getCalculations")
        .mockResolvedValue([calculation]);
      const store = makeStore();

      await store.dispatch(fetchCctCalculations());

      expect(store.getState().cct).toEqual({
        ...initial,
        calculations: [calculation],
        listStatus: "succeeded"
      });
    });

    it("records the failure when the calculations fail to load", async () => {
      jest
        .spyOn(CctService.prototype, "getCalculations")
        .mockRejectedValue(new TypeError("Failed to fetch"));
      const store = makeStore();

      await store.dispatch(fetchCctCalculations());

      expect(store.getState().cct).toEqual({
        ...initial,
        listStatus: "failed"
      });
    });

    it("forgets the calculations when reset", async () => {
      jest
        .spyOn(CctService.prototype, "getCalculations")
        .mockResolvedValue([calculation]);
      const store = makeStore();
      await store.dispatch(fetchCctCalculations());

      store.dispatch(resetCctCalculations());

      expect(store.getState().cct).toEqual(initial);
    });
  });

  describe("deleteCctCalculation", () => {
    const other = {
      ...calculation,
      id: "7a1e9f20-5b3c-4d6e-8f70-1a2b3c4d5e6f"
    };

    it("drops the deleted calculation from the list", async () => {
      jest
        .spyOn(CctService.prototype, "getCalculations")
        .mockResolvedValue([calculation, other]);
      const deleteSpy = jest
        .spyOn(CctService.prototype, "deleteCalculation")
        .mockResolvedValue();
      const store = makeStore();
      await store.dispatch(fetchCctCalculations());

      await store.dispatch(deleteCctCalculation(calculation.id));

      expect(deleteSpy).toHaveBeenCalledWith(calculation.id);
      expect(store.getState().cct.calculations).toEqual([other]);
    });

    it("keeps the list when the delete fails", async () => {
      jest
        .spyOn(CctService.prototype, "getCalculations")
        .mockResolvedValue([calculation, other]);
      jest
        .spyOn(CctService.prototype, "deleteCalculation")
        .mockRejectedValue(new TypeError("Failed to fetch"));
      const store = makeStore();
      await store.dispatch(fetchCctCalculations());

      await store.dispatch(deleteCctCalculation(calculation.id));

      expect(store.getState().cct.calculations).toEqual([calculation, other]);
    });
  });

  describe("saveCctCalculation", () => {
    it("updates the saved calculation when the request has an id", async () => {
      const updateSpy = jest
        .spyOn(CctService.prototype, "updateCalculation")
        .mockResolvedValue(calculation);
      const saveSpy = jest.spyOn(CctService.prototype, "saveCalculation");
      const store = makeStore();
      const request = { ...newRequest, id: calculation.id };

      await store.dispatch(saveCctCalculation(request));

      expect(updateSpy).toHaveBeenCalledWith(calculation.id, request);
      expect(saveSpy).not.toHaveBeenCalled();
      expect(store.getState().cct.saveStatus).toBe("succeeded");
    });

    it("saves a new calculation when the request has no id", async () => {
      const saveSpy = jest
        .spyOn(CctService.prototype, "saveCalculation")
        .mockResolvedValue(calculation);
      const updateSpy = jest.spyOn(CctService.prototype, "updateCalculation");
      const store = makeStore();

      await store.dispatch(saveCctCalculation(newRequest));

      expect(saveSpy).toHaveBeenCalledWith(newRequest);
      expect(updateSpy).not.toHaveBeenCalled();
      expect(store.getState().cct.saveStatus).toBe("succeeded");
    });
  });
});
