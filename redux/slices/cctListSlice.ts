import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import { showToast, ToastType } from "../../components/common/ToastMessage";
import { toastErrText } from "../../utilities/Constants";
import { CctCalculation } from "./cctSlice";
import { AxiosResponse } from "axios";

type CctListState = {
  cctList: CctCalculation[];
  status: string;
  error: any;
};

const initialState: CctListState = {
  cctList: [],
  status: "idle",
  error: ""
};

export const loadCctList = createAsyncThunk("cctList/loadCctList", async () => {
  const traineeProfileService = new TraineeProfileService();
  const response: AxiosResponse<CctCalculation[]> =
    await traineeProfileService.getCctCalculations();
  return response.data;
});

const cctListSlice = createSlice({
  name: "cctList",
  initialState,
  reducers: {
    updatedCctList: (state, action: PayloadAction<CctCalculation[]>) => {
      state.cctList = action.payload;
    },
    updatedCctListStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loadCctList.pending, state => {
        state.status = "loading";
      })
      .addCase(loadCctList.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.cctList = payload;
      })
      .addCase(loadCctList.rejected, (state, { error }) => {
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

export default cctListSlice.reducer;

export const { updatedCctList, updatedCctListStatus } = cctListSlice.actions;
