import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { FeatureFlags } from "../../models/FeatureFlags";
import { FormsService } from "../../services/FormsService";

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
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFeatureFlags.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchFeatureFlags.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.featureFlags = action.payload;
      })
      .addCase(fetchFeatureFlags.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default featureFlagsSlice.reducer;

export const isCovidFeatureFlag = (state: {
  featureFlags: { featureFlags: FeatureFlags };
}) => state.featureFlags.featureFlags.formRPartB.covidDeclaration.valueOf();
