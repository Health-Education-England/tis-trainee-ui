import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeReferenceService } from "../../services/TraineeReferenceService";

interface IGrade {
  grades: any[];
  status: string;
  error: any;
}

export const initialState: IGrade = {
  grades: [],
  status: "idle",
  error: ""
};

export const fetchGrades = createAsyncThunk("forms/fetchGrades", async () => {
  const gradeService = new TraineeReferenceService();
  const response: AxiosResponse<any[]> = await gradeService.getTrainingGrades();
  return response.data;
});

const gradeSlice = createSlice({
  name: "grade",
  initialState,
  reducers: {
    resetted() {
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGrades.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.grades = action.payload;
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default gradeSlice.reducer;
export const { resetted } = gradeSlice.actions;
export const selectAllGrades = (state: { grade: { grades: any[] } }) =>
  state.grade.grades;
