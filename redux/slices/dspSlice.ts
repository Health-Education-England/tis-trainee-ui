import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersonalDetails } from "../../models/PersonalDetails";
import { Placement } from "../../models/Placement";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";
import { ProfileType } from "../../models/TraineeProfile";
import { CredentialsService } from "../../services/CredentialsService";
import { RootState } from "../store/store";

interface IDsp {
  dspPanelObj: ProfileType | null;
  dspPanelObjName: string;
  gatewayUri: string | null;
  status: string;
  error: any;
  errorCode: any;
  isIssuing: boolean;
  stateId: string | null;
}

export const initialState: IDsp = {
  dspPanelObj: null,
  dspPanelObjName: "",
  gatewayUri: null,
  status: "",
  error: "",
  errorCode: null,
  isIssuing: false,
  stateId: null
};

export const issueDspCredential = createAsyncThunk(
  "dsp/issueDspCredential",
  async (issueName: string, { getState }) => {
    const state = getState() as RootState;
    const panelData: Placement | ProgrammeMembership | null =
      state.dsp.dspPanelObj;
    const credentialsService = new CredentialsService();
    const stateId = state.dsp.stateId;
    if (stateId) {
      localStorage.setItem(
        stateId,
        JSON.stringify({
          panelData: panelData,
          panelName: state.dsp.dspPanelObjName
        })
      );
    }
    const response = await credentialsService.issueDspCredential(
      issueName,
      panelData,
      { state: stateId }
    );
    return response.data;
  }
);

export const verifyDspIdentity = createAsyncThunk(
  "dsp/verifyDspIdentity",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const personalData: PersonalDetails =
      state.traineeProfile.traineeProfileData.personalDetails;
    const credentialsService = new CredentialsService();
    const stateId = state.dsp.stateId;
    const response = await credentialsService.verifyDspIdentity(personalData, {
      state: stateId
    });
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
    updatedDspIsIssuing(state, action: PayloadAction<boolean>) {
      return { ...state, isIssuing: action.payload };
    },
    updatedDspPanelObjName(state, action: PayloadAction<string>) {
      return { ...state, dspPanelObjName: action.payload };
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
        state.gatewayUri = action.payload;
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
        state.gatewayUri = action.payload;
      })
      .addCase(verifyDspIdentity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default dspSlice.reducer;

export const {
  updatedDspStateId,
  updatedDspPanelObj,
  updatedDspIsIssuing,
  updatedDspPanelObjName,
  resetDspSlice
} = dspSlice.actions;
