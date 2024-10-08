import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersonalDetails } from "../../models/PersonalDetails";
import { Placement } from "../../models/Placement";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";
import { ProfileType } from "../../models/TraineeProfile";
import { CredentialsService } from "../../services/CredentialsService";
import { RootState } from "../store/store";
import { CredentialDsp, CredentialDspType } from "../../models/Dsp";
interface IDsp {
  dspPanelObj: ProfileType | null;
  dspPanelObjName: string;
  gatewayUri: string | null;
  status: string;
  error: any;
  errorCode: any;
  stateId: string | null;
  successCode: number | null;
  credentials: CredentialDsp[];
}

export const initialState: IDsp = {
  dspPanelObj: null,
  dspPanelObjName: "",
  gatewayUri: null,
  status: "",
  error: "",
  errorCode: null,
  stateId: null,
  successCode: null,
  credentials: []
};

export const issueDspCredential = createAsyncThunk(
  "dsp/issueDspCredential",
  async (issueArgs: { issueName: string; stateId: string }, { getState }) => {
    const { issueName, stateId } = issueArgs;
    const state = getState() as RootState;
    const panelData: Placement | ProgrammeMembership | null = state.dsp
      .dspPanelObj as Placement | ProgrammeMembership | null;
    const credentialsService = new CredentialsService();
    localStorage.setItem(
      stateId,
      JSON.stringify({
        panelData: panelData,
        panelName: state.dsp.dspPanelObjName
      })
    );
    const response = await credentialsService.issueDspCredential(
      issueName,
      panelData,
      { state: stateId }
    );
    return response;
  }
);

export const verifyDspIdentity = createAsyncThunk(
  "dsp/verifyDspIdentity",
  async (stateId: string, { getState }) => {
    const state = getState() as RootState;
    const personalData: PersonalDetails =
      state.traineeProfile.traineeProfileData.personalDetails;
    const credentialsService = new CredentialsService();
    localStorage.setItem(
      stateId,
      JSON.stringify({
        panelData: state.dsp.dspPanelObj,
        panelName: state.dsp.dspPanelObjName
      })
    );
    const response = await credentialsService.verifyDspIdentity(personalData, {
      state: stateId
    });
    return response;
  }
);

export const loadCredentials = createAsyncThunk(
  "dsp/loadCredentials",
  async (credType: CredentialDspType) => {
    const credentialsService = new CredentialsService();
    const response = await credentialsService.fetchDspCredentials(credType);
    return response.data;
  }
);

const dspSlice = createSlice({
  name: "dsp",
  initialState,
  reducers: {
    updatedDspStateId(state, action: PayloadAction<string>) {
      return { ...state, stateId: action.payload };
    },
    updatedDspPanelObj(state, action: PayloadAction<ProfileType>) {
      return { ...state, dspPanelObj: action.payload };
    },
    updatedDspPanelObjName(state, action: PayloadAction<string>) {
      return { ...state, dspPanelObjName: action.payload };
    },
    updatedDspGatewayUri(state, action: PayloadAction<string>) {
      return { ...state, gatewayUri: action.payload };
    },
    updatedCredentials(state, action: PayloadAction<CredentialDsp[]>) {
      return { ...state, credentials: action.payload };
    },
    resetDspSlice() {
      return initialState;
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(issueDspCredential.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(issueDspCredential.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.gatewayUri = action.payload.data;
        state.successCode = action.payload.status;
      })
      .addCase(issueDspCredential.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.errorCode = action.error.message?.slice(-3);
      })
      .addCase(verifyDspIdentity.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(verifyDspIdentity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.gatewayUri = action.payload.data;
        state.successCode = action.payload.status;
      })
      .addCase(verifyDspIdentity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.errorCode = action.error.message?.slice(-3);
      })
      .addCase(loadCredentials.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(loadCredentials.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.credentials = action.payload;
      })
      .addCase(loadCredentials.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.errorCode = action.error.message?.slice(-3);
      });
  }
});

export default dspSlice.reducer;

export const {
  updatedDspStateId,
  updatedDspPanelObj,
  updatedDspPanelObjName,
  updatedDspGatewayUri,
  updatedCredentials,
  resetDspSlice
} = dspSlice.actions;
