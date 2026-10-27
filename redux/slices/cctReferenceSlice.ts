import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CctSpecialty } from "../../models/CctTypes";
import { CctService } from "../../services/CctService";

export type CctReferenceStatus = "idle" | "loading" | "succeeded" | "failed";

interface ICctReference {
  specialties: CctSpecialty[];
  status: CctReferenceStatus;
  error: string | null;
}

const initialState: ICctReference = {
  specialties: [],
  status: "idle",
  error: null
};

export const fetchCctSpecialties = createAsyncThunk(
  "cctReference/fetchSpecialties",
  async () => {
    const cctService = new CctService();
    return cctService.getSpecialties();
  }
);

const cctReferenceSlice = createSlice({
  name: "cctReference",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCctSpecialties.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchCctSpecialties.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.specialties = action.payload;
        state.error = null;
      })
      .addCase(fetchCctSpecialties.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message ?? "";
      });
  }
});

export default cctReferenceSlice.reducer;
