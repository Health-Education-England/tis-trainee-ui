import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { FeatureFlags } from "../../models/FeatureFlags";
import { FormsService } from "../../services/FormsService";
import { toastErrText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";

interface IFeatureFlags {
  featureFlags: FeatureFlags;
  status: string;
  error: any;
}

export const initialState: IFeatureFlags = {
  featureFlags: { formRPartB: { covidDeclaration: false } },
  status: "idle",
  error: ""
};

export const fetchFeatureFlags = createAsyncThunk(
  "forms/fetchFeatureFlags",
  async () => {
    const formsService = new FormsService();
    const response: AxiosResponse<FeatureFlags> =
      await formsService.getFeatureFlags();
    return response.data;
  }
);

const featureFlagsSlice = createSlice({
  name: "featureFlags",
  initialState,
  reducers: {
    updatedFeatureFlags(state, action: PayloadAction<FeatureFlags>) {
      return { ...state, featureFlags: action.payload };
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFeatureFlags.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchFeatureFlags.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.featureFlags = action.payload;
      })
      .addCase(fetchFeatureFlags.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.fetchFeatureFlags,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default featureFlagsSlice.reducer;

export const { updatedFeatureFlags } = featureFlagsSlice.actions;
