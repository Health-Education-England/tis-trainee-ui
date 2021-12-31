import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeReferenceService } from "../../services/TraineeReferenceService";

interface IGender {
  genders: any[];
  status: string;
  error: any;
}

export const initialState: IGender = {
  genders: [],
  status: "idle",
  error: ""
};

export const fetchGenders = createAsyncThunk("forms/fetchGenders", async () => {
  const genderService = new TraineeReferenceService();
  const response: AxiosResponse<any[]> = await genderService.getGenders();
  return response.data;
});

const genderSlice = createSlice({
  name: "gender",
  initialState,
  reducers: {
    resetted() {
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGenders.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchGenders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.genders = action.payload;
      })
      .addCase(fetchGenders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default genderSlice.reducer;
export const { resetted } = genderSlice.actions;
export const selectAllGenders = (state: { gender: { genders: any[] } }) =>
  state.gender.genders;
