import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CctCalculation } from "../../models/CctTypes";
import { ApiError } from "../../services/apiService";
import {
  CctCalculationSaveRequest,
  CctService
} from "../../services/CctService";

export type CctSaveStatus = "idle" | "loading" | "succeeded" | "failed";
type CctLoadStatus = "idle" | "loading" | "succeeded" | "failed";

interface ICct {
  saveStatus: CctSaveStatus;
  calculation: CctCalculation | null;
  loadStatus: CctLoadStatus;
  loadErrorStatus: number | null;
  loadRequestId: string | null;
  calculations: CctCalculation[];
  listStatus: CctLoadStatus;
}

const initialState: ICct = {
  saveStatus: "idle",
  calculation: null,
  loadStatus: "idle",
  loadErrorStatus: null,
  loadRequestId: null,
  calculations: [],
  listStatus: "idle"
};

export const fetchCctCalculations = createAsyncThunk(
  "cct/fetchCalculations",
  async () => {
    const cctService = new CctService();
    return cctService.getCalculations();
  }
);

export const saveCctCalculation = createAsyncThunk(
  "cct/saveCalculation",
  async (request: CctCalculationSaveRequest) => {
    const cctService = new CctService();
    return request.id
      ? cctService.updateCalculation(request.id, request)
      : cctService.saveCalculation(request);
  }
);

export const deleteCctCalculation = createAsyncThunk(
  "cct/deleteCalculation",
  async (id: string) => {
    const cctService = new CctService();
    await cctService.deleteCalculation(id);
  }
);

export const loadSavedCctCalculation = createAsyncThunk<
  CctCalculation,
  string,
  { rejectValue: number | null }
>("cct/loadSavedCalculation", async (id, { rejectWithValue }) => {
  const cctService = new CctService();
  try {
    return await cctService.getCalculation(id);
  } catch (error) {
    return rejectWithValue(error instanceof ApiError ? error.status : null);
  }
});

const cctSlice = createSlice({
  name: "cct",
  initialState,
  reducers: {
    updatedCctSaveStatus(state, action: PayloadAction<CctSaveStatus>) {
      state.saveStatus = action.payload;
    },
    resetCctCalculation(state) {
      state.calculation = null;
      state.loadStatus = "idle";
      state.loadErrorStatus = null;
      state.loadRequestId = null;
    },
    resetCctCalculations(state) {
      state.calculations = [];
      state.listStatus = "idle";
    }
  },
  extraReducers(builder) {
    builder
      .addCase(saveCctCalculation.pending, state => {
        state.saveStatus = "loading";
      })
      .addCase(saveCctCalculation.fulfilled, state => {
        state.saveStatus = "succeeded";
      })
      .addCase(saveCctCalculation.rejected, state => {
        state.saveStatus = "failed";
      })
      .addCase(loadSavedCctCalculation.pending, (state, action) => {
        state.loadStatus = "loading";
        state.loadErrorStatus = null;
        state.loadRequestId = action.meta.requestId;
      })
      .addCase(loadSavedCctCalculation.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.loadRequestId) return;
        state.loadRequestId = null;
        state.loadStatus = "succeeded";
        state.calculation = action.payload;
      })
      .addCase(loadSavedCctCalculation.rejected, (state, action) => {
        if (action.meta.requestId !== state.loadRequestId) return;
        state.loadRequestId = null;
        state.loadStatus = "failed";
        state.loadErrorStatus = action.payload ?? null;
      })
      .addCase(fetchCctCalculations.pending, state => {
        state.listStatus = "loading";
      })
      .addCase(fetchCctCalculations.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.calculations = action.payload;
      })
      .addCase(fetchCctCalculations.rejected, state => {
        state.listStatus = "failed";
      })
      .addCase(deleteCctCalculation.fulfilled, (state, action) => {
        state.calculations = state.calculations.filter(
          calculation => calculation.id !== action.meta.arg
        );
      });
  }
});

export const {
  updatedCctSaveStatus,
  resetCctCalculation,
  resetCctCalculations
} = cctSlice.actions;

export default cctSlice.reducer;
