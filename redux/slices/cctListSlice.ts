import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CctCalculation } from "./cctSlice";
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

// TODO: refactor to use CctCalculation when BE is ready
export type TempCctListType = CctSummaryType[] | CctCalculation[];

type CctList = {
  cctList: TempCctListType;
  status: string;
  error: any;
};

const initialState: CctList = {
  cctList: [],
  status: "idle",
  error: ""
};

export const loadCctList = createAsyncThunk("cctList/loadCctList", async () => {
  const traineeProfileService = new TraineeProfileService();
  const response = await traineeProfileService.getCctCalculations();
  return response.data;
});

const cctListSlice = createSlice({
  name: "cctList",
  initialState,
  reducers: {
    updatedCctList: (state, action: PayloadAction<TempCctListType>) => {
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

export const { updatedCctList, updatedCctListStatus } = cctListSlice.actions;

export default cctListSlice.reducer;
