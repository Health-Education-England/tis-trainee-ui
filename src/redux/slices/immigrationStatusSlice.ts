import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeReferenceService } from "../../services/TraineeReferenceService";

interface IImmigrationStatus {
  immigrationStatuses: any[];
  status: string;
  error: any;
}

export const initialState: IImmigrationStatus = {
  immigrationStatuses: [],
  status: "idle",
  error: ""
};

export const fetchImmigrationStatuses = createAsyncThunk(
  "forms/fetchImmigrationStatuses",
  async () => {
    const immigrationStatusService = new TraineeReferenceService();
    const response: AxiosResponse<any[]> =
      await immigrationStatusService.getImmigrationStatus();
    return response.data;
  }
);

const immigrationStatusSlice = createSlice({
  name: "immigrationStatus",
  initialState,
  reducers: {
    resetted() {
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchImmigrationStatuses.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchImmigrationStatuses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.immigrationStatuses = action.payload;
      })
      .addCase(fetchImmigrationStatuses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default immigrationStatusSlice.reducer;
export const { resetted } = immigrationStatusSlice.actions;
export const selectAllImmigrationStatuses = (state: {
  immigrationStatus: { immigrationStatuses: any[] };
}) => state.immigrationStatus.immigrationStatuses;
