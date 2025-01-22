import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FormsService } from "../../services/FormsService";
import { showToast, ToastType } from "../../components/common/ToastMessage";
import { toastErrText } from "../../utilities/Constants";

export type LtftSummaryObj = {
  id: string;
  name: string;
  programmeMembershipId: string;
  status: string;
  created: string;
  lastModified: string;
};

type LtftSummaryList = {
  ltftList: LtftSummaryObj[];
  status: string;
  error: any;
};

export const initialState: LtftSummaryList = {
  ltftList: [],
  status: "idle",
  error: ""
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
    updatedLtftSummaryList: (state, action) => {
      state.ltftList = action.payload;
    },
    updatedLtftSummaryListStatus: (state, action) => {
      state.status = action.payload;
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

export const { updatedLtftSummaryList, updatedLtftSummaryListStatus } =
  ltftSummaryListSlice.actions;

export default ltftSummaryListSlice.reducer;
