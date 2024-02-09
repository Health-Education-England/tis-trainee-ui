import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TraineeProfile } from "../../models/TraineeProfile";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import { initialPersonalDetails } from "../../models/PersonalDetails";
import { DateUtilities } from "../../utilities/DateUtilities";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";
import { CojUtilities } from "../../utilities/CojUtilities";
import { toastErrText, toastSuccessText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";
import { Action } from "../../models/Action";
import { TraineeActionsService } from "../../services/TraineeActionsService";

interface IProfile {
  traineeProfileData: TraineeProfile;
  hasSignableCoj: boolean;
  unsignedCojs: ProgrammeMembership[];
  incompleteActions: Action[];
  status: string;
  error: any;
}

export const initialState: IProfile = {
  traineeProfileData: {
    traineeTisId: "",
    personalDetails: initialPersonalDetails,
    programmeMemberships: [],
    placements: []
  },
  hasSignableCoj: false,
  unsignedCojs: [],
  incompleteActions: [],
  status: "idle",
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

export const loadIncompleteTraineeActions = createAsyncThunk(
  "traineeProfile/loadIncompleteTraineeActions",
  async () => {
    const actionService = new TraineeActionsService();
    const response: AxiosResponse<Action[]> =
      await actionService.getIncompleteTraineeActions();
    return response.data;
  }
);

export const completeTraineeAction = createAsyncThunk(
  "traineeProfile/traineeAction/complete",
  async (actionId: string) => {
    const actionService = new TraineeActionsService();
    const response: AxiosResponse<Action> =
      await actionService.completeTraineeAction(actionId);
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
      .addCase(loadIncompleteTraineeActions.pending, state => {
        state.status = "loading";
      })
      .addCase(loadIncompleteTraineeActions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.incompleteActions = action.payload;
      })
      .addCase(loadIncompleteTraineeActions.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.loadIncompleteTraineeActions,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(completeTraineeAction.pending, state => {
        state.status = "saving";
      })
      .addCase(completeTraineeAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        showToast(toastSuccessText.completeTraineeAction, ToastType.SUCCESS);
      })
      .addCase(completeTraineeAction.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.completeTraineeAction,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
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
