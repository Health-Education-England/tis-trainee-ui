import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeReferenceService } from "../../services/TraineeReferenceService";

interface ICurriculum {
  curricula: any[];
  status: string;
  error: any;
}

export const initialState: ICurriculum = {
  curricula: [],
  status: "idle",
  error: ""
};

export const fetchCurricula = createAsyncThunk(
  "forms/fetchCurricula",
  async () => {
    const curriculumService = new TraineeReferenceService();
    const response: AxiosResponse<[]> = await curriculumService.getCurricula();
    return response.data;
  }
);

const curriculumSlice = createSlice({
  name: "curriculum",
  initialState,
  reducers: {
    resetted() {
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCurricula.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchCurricula.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curricula = action.payload;
      })
      .addCase(fetchCurricula.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default curriculumSlice.reducer;
export const { resetted } = curriculumSlice.actions;
export const selectAllCurricula = (state: {
  curriculum: { curricula: any[] };
}) => state.curriculum.curricula;
