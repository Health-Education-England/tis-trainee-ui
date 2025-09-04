import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeProfile } from "../../models/TraineeProfile";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import {
  initialPersonalDetails,
  PersonalDetails
} from "../../models/PersonalDetails";
import { DateUtilities } from "../../utilities/DateUtilities";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";
import { CojUtilities } from "../../utilities/CojUtilities";
import { toastErrText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";

interface IProfile {
  traineeProfileData: TraineeProfile;
  hasSignableCoj: boolean;
  unsignedCojs: ProgrammeMembership[];
  status: string;
  gmcStatus: string;
  error: any;
}

export const initialState: IProfile = {
  traineeProfileData: {
    traineeTisId: "",
    personalDetails: initialPersonalDetails,
    qualifications: [],
    programmeMemberships: [],
    placements: []
  },
  hasSignableCoj: false,
  unsignedCojs: [],
  status: "idle",
  gmcStatus: "idle",
  error: ""
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

export const signCoj = createAsyncThunk(
  "traineeProfile/programmeMembership/signCoj",
  async (programmeMembershipId: string) => {
    const traineeProfileService = new TraineeProfileService();
    const response: AxiosResponse<ProgrammeMembership> =
      await traineeProfileService.signCoj(programmeMembershipId);
    return response.data;
  }
);

export const updateGmc = createAsyncThunk(
  "traineeProfile/personalDetails/updateGmc",
  async (gmc: string) => {
    const traineeProfileService = new TraineeProfileService();
    const response: AxiosResponse<PersonalDetails> =
      await traineeProfileService.updateGmc(gmc);
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
      return {
        ...state,
        traineeProfileData: action.payload,
        hasSignableCoj: CojUtilities.canAnyBeSigned(
          action.payload.programmeMemberships
        )
      };
    },
    updatedTraineeProfileStatus(state, action: PayloadAction<string>) {
      return { ...state, status: action.payload };
    },
    updatedUnsignedCojs(state, action: PayloadAction<ProgrammeMembership[]>) {
      return { ...state, unsignedCojs: action.payload };
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
        state.hasSignableCoj = CojUtilities.canAnyBeSigned(sortedProgrammes);
        state.unsignedCojs = CojUtilities.unsignedCojs(
          state.traineeProfileData.programmeMemberships
        );
      })
      .addCase(fetchTraineeProfileData.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.fetchTraineeProfileData,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(signCoj.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(signCoj.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the signed Programme Membership.
        const tisId = action.payload.tisId;
        const index = state.traineeProfileData.programmeMemberships.findIndex(
          pm => pm.tisId === tisId
        );
        state.traineeProfileData.programmeMemberships[index] = action.payload;

        // Show/hide the COJ alert.
        state.hasSignableCoj = CojUtilities.canAnyBeSigned(
          state.traineeProfileData.programmeMemberships
        );
      })
      .addCase(signCoj.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateGmc.pending, (state, _action) => {
        state.gmcStatus = "loading";
      })
      .addCase(updateGmc.fulfilled, (state, action) => {
        state.gmcStatus = "succeeded";
        state.traineeProfileData.personalDetails = action.payload;
        showToast("GMC number updated", ToastType.SUCCESS);
      })
      .addCase(updateGmc.rejected, (state, action) => {
        state.gmcStatus = "failed";
        state.error = action.error.message;
        showToast("GMC number could not be updated", ToastType.ERROR);
      });
  }
});

export default traineeProfileSlice.reducer;

export const {
  resetToInit,
  updatedTraineeProfileData,
  updatedTraineeProfileStatus,
  updatedUnsignedCojs
} = traineeProfileSlice.actions;

export const selectTraineeProfile = (state: { traineeProfile: IProfile }) =>
  state.traineeProfile.traineeProfileData;
