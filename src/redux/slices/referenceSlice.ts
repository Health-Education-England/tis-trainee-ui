import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TraineeReferenceService } from "../../services/TraineeReferenceService";

interface IReference {
  combinedRef: any;
  status: string;
  error: any;
}

export const initialState: IReference = {
  combinedRef: null,
  status: "idle",
  error: ""
};

export const fetchReference = createAsyncThunk(
  "forms/fetchReference",
  async () => {
    const referenceService = new TraineeReferenceService();
    const response: any = await referenceService.getCombinedReference();
    return [...response.map((res: { data: any }) => res.data)];
  }
);

const referenceSlice = createSlice({
  name: "reference",
  initialState,
  reducers: {
    updatedReference(state, action: PayloadAction<any[]>) {
      return { ...state, combinedRef: action.payload };
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
      })
      .addCase(fetchReference.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default referenceSlice.reducer;
export const { updatedReference, updatedReferenceStatus } =
  referenceSlice.actions;
export const selectAllReference = (state: {
  reference: { combinedRef: any[] };
}) => state.reference.combinedRef;
