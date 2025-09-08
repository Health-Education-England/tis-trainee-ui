import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormsService } from "../../services/FormsService";
import { showToast, ToastType } from "../../components/common/ToastMessage";
import { toastErrText } from "../../utilities/Constants";
import { LtftSummaryList, LtftSummaryObj } from "../../models/LtftTypes";

export const initialState: LtftSummaryList = {
  ltftList: [],
  status: "idle",
  error: "",
  ltftFormsRefreshNeeded: false
};

export const fetchLtftSummaryList = createAsyncThunk(
  "ltftSummaryList/fetchLtftSummaryList",
  async () => {
    const formsService = new FormsService();
    const response = await formsService.getLtftSummaryList();
    return response.data;
  }
);

export const ltftSummaryListSlice = createSlice({
  name: "ltftList",
  initialState,
  reducers: {
    updatedLtftSummaryList: (
      state,
      action: PayloadAction<LtftSummaryObj[]>
    ) => {
      state.ltftList = action.payload;
    },
    updatedLtftSummaryListStatus: (state, action) => {
      state.status = action.payload;
    },
    updatedLtftFormsRefreshNeeded: (state, action) => {
      state.ltftFormsRefreshNeeded = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLtftSummaryList.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchLtftSummaryList.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.ltftList = payload;
      })
      .addCase(fetchLtftSummaryList.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.loadLtftSummaryListMessage,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export const {
  updatedLtftSummaryList,
  updatedLtftSummaryListStatus,
  updatedLtftFormsRefreshNeeded
} = ltftSummaryListSlice.actions;

export default ltftSummaryListSlice.reducer;
