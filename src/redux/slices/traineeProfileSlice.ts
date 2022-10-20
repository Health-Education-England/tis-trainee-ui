import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeProfile } from "../../models/TraineeProfile";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import { initialPersonalDetails } from "../../models/PersonalDetails";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";

interface IProfile {
  traineeProfileData: TraineeProfile;
  status: string;
  error: any;
  viewedCojProg: ProgrammeMembership | null;
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
  viewedCojProg: null
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
    },
    updatedViewedCojProg(state, action: PayloadAction<ProgrammeMembership>) {
      return { ...state, viewedCojProg: action.payload };
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTraineeProfileData.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchTraineeProfileData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.traineeProfileData = action.payload;
      })
      .addCase(fetchTraineeProfileData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default traineeProfileSlice.reducer;

export const {
  resetToInit,
  updatedTraineeProfileData,
  updatedTraineeProfileStatus,
  updatedViewedCojProg
} = traineeProfileSlice.actions;

export const selectTraineeProfile = (state: { traineeProfile: IProfile }) =>
  state.traineeProfile.traineeProfileData;
