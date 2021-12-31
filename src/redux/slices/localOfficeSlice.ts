import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeReferenceService } from "../../services/TraineeReferenceService";

interface ILocalOffice {
  localOffices: any[];
  status: string;
  error: any;
}

export const initialState: ILocalOffice = {
  localOffices: [],
  status: "idle",
  error: ""
};

export const fetchlocalOffices = createAsyncThunk(
  "forms/fetchlocalOffices",
  async () => {
    const localOfficeService = new TraineeReferenceService();
    const response: AxiosResponse<any[]> =
      await localOfficeService.getLocalOffices();
    return response.data;
  }
);

const localOfficeSlice = createSlice({
  name: "localOffice",
  initialState,
  reducers: {
    resetted() {
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchlocalOffices.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchlocalOffices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.localOffices = action.payload;
      })
      .addCase(fetchlocalOffices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default localOfficeSlice.reducer;
export const { resetted } = localOfficeSlice.actions;
export const selectAllLocalOffices = (state: {
  localOffice: { localOffices: any[] };
}) => state.localOffice.localOffices;
