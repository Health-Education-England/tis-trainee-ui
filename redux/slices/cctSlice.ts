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
  calculations: CctCalculation[];
  listStatus: CctLoadStatus;
}

const initialState: ICct = {
  saveStatus: "idle",
  calculation: null,
  loadStatus: "idle",
  loadErrorStatus: null,
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
      .addCase(loadSavedCctCalculation.pending, state => {
        state.loadStatus = "loading";
        state.loadErrorStatus = null;
      })
      .addCase(loadSavedCctCalculation.fulfilled, (state, action) => {
        state.loadStatus = "succeeded";
        state.calculation = action.payload;
      })
      .addCase(loadSavedCctCalculation.rejected, (state, action) => {
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
      });
  }
});

export const {
  updatedCctSaveStatus,
  resetCctCalculation,
  resetCctCalculations
} = cctSlice.actions;

export default cctSlice.reducer;
