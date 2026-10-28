import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  CctCalculationSaveRequest,
  CctService
} from "../../services/CctService";

export type CctSaveStatus = "idle" | "loading" | "succeeded" | "failed";

interface ICct {
  saveStatus: CctSaveStatus;
}

const initialState: ICct = {
  saveStatus: "idle"
};

export const saveCctCalculation = createAsyncThunk(
  "cct/saveCalculation",
  async (request: CctCalculationSaveRequest) => {
    const cctService = new CctService();
    return cctService.saveCalculation(request);
  }
);

const cctSlice = createSlice({
  name: "cct",
  initialState,
  reducers: {
    updatedCctSaveStatus(state, action: PayloadAction<CctSaveStatus>) {
      state.saveStatus = action.payload;
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
      });
  }
});

export const { updatedCctSaveStatus } = cctSlice.actions;

export default cctSlice.reducer;
