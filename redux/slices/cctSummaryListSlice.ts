import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import { showToast, ToastType } from "../../components/common/ToastMessage";
import { toastErrText } from "../../utilities/Constants";

export type CctSummaryType = {
  id: string;
  name: string;
  programmeMembershipId: string;
  created: Date | string;
  lastModified: Date | string;
};

type CctSummaryListState = {
  cctList: CctSummaryType[];
  status: string;
  error: any;
};

const initialState: CctSummaryListState = {
  cctList: [],
  status: "idle",
  error: ""
};

export const loadCctSummaryList = createAsyncThunk(
  "cctSummaryList/loadCctSummaryList",
  async () => {
    const traineeProfileService = new TraineeProfileService();
    const response = await traineeProfileService.getCctCalculations();
    return response.data;
  }
);

const cctSummaryListSlice = createSlice({
  name: "cctSummaryList",
  initialState,
  reducers: {
    updatedCctList: (state, action: PayloadAction<CctSummaryType[]>) => {
      state.cctList = action.payload;
    },
    updatedCctListStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loadCctSummaryList.pending, state => {
        state.status = "loading";
      })
      .addCase(loadCctSummaryList.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.cctList = payload;
      })
      .addCase(loadCctSummaryList.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.loadCctSummaryListMessage,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default cctSummaryListSlice.reducer;

export const { updatedCctList, updatedCctListStatus } =
  cctSummaryListSlice.actions;
