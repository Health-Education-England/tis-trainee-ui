import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Placement } from "../../models/Placement";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";
import { ProfileType } from "../../models/TraineeProfile";
import { CredentialsService } from "../../services/CredentialsService";

interface IDsp {
  dspPanelObj: ProfileType | null;
  returnedData: any;
  status: string;
  error: any;
}

export const issueDspCredential = createAsyncThunk(
  "dsp/issueDspCredential",
  async (dspIssueData: {
    issueName: string;
    storedPanelData: Placement | ProgrammeMembership | null;
  }) => {
    let { issueName, storedPanelData } = dspIssueData;
    const credentialsService = new CredentialsService();
    const response = await credentialsService.issueDspCredential(
      issueName,
      storedPanelData
    );
    return response.data;
  }
);

export const initialState: IDsp = {
  dspPanelObj: null,
  returnedData: null,
  status: "",
  error: ""
};

const dspSlice = createSlice({
  name: "dsp",
  initialState,
  reducers: {
    updatedDspPanelObj(state, action: PayloadAction<ProfileType>) {
      return { ...state, dspPanelObj: action.payload };
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(issueDspCredential.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(issueDspCredential.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dspPanelObj = action.payload;
      })
      .addCase(issueDspCredential.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default dspSlice.reducer;

export const { updatedDspPanelObj } = dspSlice.actions;
