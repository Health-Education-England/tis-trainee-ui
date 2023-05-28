import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TraineeReferenceService } from "../../services/TraineeReferenceService";
import { CombinedReferenceData } from "../../models/CombinedReferenceData";
import { CurriculumKeyValue } from "../../models/CurriculumKeyValue";
interface IReference {
  combinedRef: any;
  curriculumOptions: CurriculumKeyValue[] | null;
  status: string;
  error: any;
}

export const initialState: IReference = {
  combinedRef: null,
  curriculumOptions: null,
  status: "idle",
  error: ""
};

export const fetchReference = createAsyncThunk(
  "forms/fetchReference",
  async () => {
    try {
      const referenceService = new TraineeReferenceService();
      const response: CombinedReferenceData =
        await referenceService.getCombinedReferenceData();
      return response;
    } catch (error) {
      console.error("Error fetching reference:", error);
      throw error; // Rethrow the error to be caught by the Redux Toolkit
    }
  }
);

const referenceSlice = createSlice({
  name: "reference",
  initialState,
  reducers: {
    updatedReference(state, action: PayloadAction<CombinedReferenceData>) {
      return { ...state, combinedRef: action.payload };
    },
    updatedCurriculumOptions(
      state,
      action: PayloadAction<CurriculumKeyValue[]>
    ) {
      return { ...state, curriculumOptions: action.payload };
    },
    updatedReferenceStatus(state, action: PayloadAction<string>) {
      return { ...state, status: action.payload };
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchReference.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchReference.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.combinedRef = action.payload;
        state.curriculumOptions = action.payload?.curriculum;
      })
      .addCase(fetchReference.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default referenceSlice.reducer;
export const {
  updatedReference,
  updatedReferenceStatus,
  updatedCurriculumOptions
} = referenceSlice.actions;
export const selectAllReference = (state: {
  reference: { combinedRef: any };
}) => state.reference.combinedRef;
export const selectCurriculumOptions = (state: {
  reference: { curriculumOptions: any };
}) => state.reference.curriculumOptions;
