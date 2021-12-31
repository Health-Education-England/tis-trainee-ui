import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeReferenceService } from "../../services/TraineeReferenceService";
import { DesignatedBodyKeyValue } from "../../models/DesignatedBodyKeyValue";

interface IDbc {
  dbcs: DesignatedBodyKeyValue[];
  status: string;
  error: any;
}

export const initialState: IDbc = {
  dbcs: [],
  status: "idle",
  error: ""
};

export const fetchDbcs = createAsyncThunk("forms/fetchDbcs", async () => {
  const dbcService = new TraineeReferenceService();
  const response: AxiosResponse<DesignatedBodyKeyValue[]> =
    await dbcService.getDesignatedBodies();
  return response.data;
});

const dbcSlice = createSlice({
  name: "dbc",
  initialState,
  reducers: {
    resetted() {
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDbcs.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchDbcs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dbcs = action.payload;
      })
      .addCase(fetchDbcs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default dbcSlice.reducer;
export const { resetted } = dbcSlice.actions;
export const selectAllDbcs = (state: {
  dbc: { dbcs: DesignatedBodyKeyValue[] };
}) => state.dbc.dbcs;
