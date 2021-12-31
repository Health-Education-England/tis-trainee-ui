import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeReferenceService } from "../../services/TraineeReferenceService";

interface ICollege {
  colleges: any[];
  status: string;
  error: any;
}

export const initialState: ICollege = {
  colleges: [],
  status: "idle",
  error: ""
};

export const fetchColleges = createAsyncThunk(
  "forms/fetchColleges",
  async () => {
    const collegeService = new TraineeReferenceService();
    const response: AxiosResponse<[]> = await collegeService.getColleges();
    return response.data;
  }
);

const collegeSlice = createSlice({
  name: "college",
  initialState,
  reducers: {
    resetted() {
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchColleges.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchColleges.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.colleges = action.payload;
      })
      .addCase(fetchColleges.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default collegeSlice.reducer;
export const { resetted } = collegeSlice.actions;
export const selectAllColleges = (state: { college: { colleges: any[] } }) =>
  state.college.colleges;
