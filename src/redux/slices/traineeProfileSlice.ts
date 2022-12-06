import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeProfile } from "../../models/TraineeProfile";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import { initialPersonalDetails } from "../../models/PersonalDetails";
import { DateUtilities } from "../../utilities/DateUtilities";

interface IProfile {
  traineeProfileData: TraineeProfile;
  status: string;
  error: any;
  dspIssueRes: any;
}

export const initialState: IProfile = {
  traineeProfileData: {
    traineeTisId: "",
    personalDetails: initialPersonalDetails,
    programmeMemberships: [],
    placements: []
  },
  status: "idle",
  error: "",
  dspIssueRes: null
};

export const fetchTraineeProfileData = createAsyncThunk(
  "traineeProfile/fetchTraineeProfileData",
  async () => {
    const traineeProfileService = new TraineeProfileService();
    const response: AxiosResponse<TraineeProfile> =
      await traineeProfileService.getTraineeProfile();
    return response.data;
  }
);

// TODO CORS error if addCredential made via localhost
export const issueDspCredential = createAsyncThunk(
  "traineeProfile/issueDspCredential",
  async (parData: { panelId: string; panelName: string }) => {
    let { panelId, panelName } = parData;
    const traineeProfileService = new TraineeProfileService();
    const response = await traineeProfileService.issueDspCred(
      panelId,
      panelName
    );
    if (!!response.headers.location) {
      window.location.href = response.headers.location;
    }
  }
);

const traineeProfileSlice = createSlice({
  name: "traineeProfile",
  initialState,
  reducers: {
    resetToInit() {
      return initialState;
    },
    updatedTraineeProfileData(state, action: PayloadAction<TraineeProfile>) {
      return { ...state, traineeProfileData: action.payload };
    },
    updatedTraineeProfileStatus(state, action: PayloadAction<string>) {
      return { ...state, status: action.payload };
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTraineeProfileData.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchTraineeProfileData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.traineeProfileData.traineeTisId = action.payload.traineeTisId;
        state.traineeProfileData.personalDetails =
          action.payload.personalDetails;
        const sortedProgrammes = DateUtilities.genericSort(
          action.payload.programmeMemberships,
          "startDate",
          true
        );
        state.traineeProfileData.programmeMemberships = sortedProgrammes;
        const sortedPlacements = DateUtilities.genericSort(
          action.payload.placements,
          "startDate",
          true
        );
        state.traineeProfileData.placements = sortedPlacements;
      })
      .addCase(fetchTraineeProfileData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(issueDspCredential.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(issueDspCredential.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dspIssueRes = action.payload;
      })
      .addCase(issueDspCredential.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default traineeProfileSlice.reducer;

export const {
  resetToInit,
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} = traineeProfileSlice.actions;

export const selectTraineeProfile = (state: { traineeProfile: IProfile }) =>
  state.traineeProfile.traineeProfileData;
